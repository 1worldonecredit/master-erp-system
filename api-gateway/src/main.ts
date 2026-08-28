import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { generateGlobalId } from './utils/idGenerator';
// นำเข้าเครื่องมือจัดการ Biometric
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4200', 'https://9plus.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// --- การตั้งค่าสำหรับ Biometric (WebAuthn) ---
const rpName = '9Plus ERP System';
const rpID = 'localhost'; // หมายเหตุ: ตอนนำเว็บขึ้นใช้งานจริง ต้องเปลี่ยนเป็น '9plus.app'
const origin = 'http://localhost:3000'; // โดเมนของหน้าเว็บ Frontend ที่ใช้ทดสอบ

// ตัวแปรเก็บคำท้า (Challenge) ชั่วคราวในหน่วยความจำ
const challengeStore: Record<string, string> = {}; 

const registerSchema = z.object({
  full_name_local: z.string().min(1, "กรุณากรอกชื่อภาษาไทย"),
  full_name_english: z.string().min(1, "กรุณากรอกชื่อภาษาอังกฤษ"),
  date_of_birth: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "รูปแบบวันที่ไม่ถูกต้อง" }),
  citizenship_status: z.string().min(1, "กรุณากรอกสัญชาติ"),
  countryCode: z.string().length(2, "รหัสประเทศต้องมี 2 ตัวอักษร"),
  birthYear: z.string().length(4, "ปีเกิดต้องมี 4 ตัวอักษร"),
  gender: z.string().min(1, "กรุณาระบุเพศ"),
  religion: z.string().min(1, "กรุณาระบุศาสนา"),
  regionCode: z.string().min(1, "กรุณาระบุรหัสภูมิภาค")
});

app.get('/api', (req, res) => res.send({ message: 'API Server is running successfully! 🚀' }));

// 1. API เดิม: สมัครสมาชิกและสร้าง Global ID
app.post('/api/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const global_id = generateGlobalId({
      countryCode: validatedData.countryCode,
      birthYear: validatedData.birthYear,
      gender: validatedData.gender,
      religion: validatedData.religion,
      regionCode: validatedData.regionCode
    });

    const newIdentity = await prisma.core_identities.create({
      data: {
        global_id,
        full_name_local: validatedData.full_name_local,
        full_name_english: validatedData.full_name_english,
        date_of_birth: new Date(validatedData.date_of_birth),
        citizenship_status: validatedData.citizenship_status
      }
    });
    res.status(201).json({ message: 'สร้างรหัส Global ID สำเร็จ', data: newIdentity });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง', details: error.errors });
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});

// 2. API ใหม่: ขอตัวเลือกการสแกนนิ้ว (ส่ง Challenge ไปให้เบราว์เซอร์)
app.post('/api/biometric/register/options', async (req, res) => {
  const { global_id } = req.body;
  if (!global_id) return res.status(400).json({ error: 'กรุณาระบุ global_id' });

  const user = await prisma.core_identities.findUnique({ where: { global_id } });
  if (!user) return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' });

  // ดึงลายนิ้วมือเดิม (ถ้ามี) เพื่อไม่ให้สแกนนิ้วเดิมซ้ำ
  const existingPasskeys = await prisma.passkey_credentials.findMany({ where: { global_id } });

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: global_id,
    userName: user.full_name_english,
    attestationType: 'none',
    excludeCredentials: existingPasskeys.map(key => ({
      id: key.credential_id,
      type: 'public-key',
    })),
  });

  // บันทึก Challenge ไว้ตรวจสอบตอนสแกนเสร็จ
  challengeStore[global_id] = options.challenge;
  res.status(200).json(options);
});

// 3. API ใหม่: ตรวจสอบและบันทึกลายนิ้วมือลงฐานข้อมูล
app.post('/api/biometric/register/verify', async (req, res) => {
  const { global_id, registrationResponse } = req.body;
  const expectedChallenge = challengeStore[global_id];

  if (!expectedChallenge) return res.status(400).json({ error: 'ไม่พบ Challenge กรุณาทำรายการใหม่' });

  try {
    const verification = await verifyRegistrationResponse({
      response: registrationResponse,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

      // บันทึกกุญแจสาธารณะลง Database
      await prisma.passkey_credentials.create({
        data: {
          global_id,
          credential_id: Buffer.from(credentialID).toString('base64url'),
          public_key: Buffer.from(credentialPublicKey),
          counter: BigInt(counter)
        }
      });

      delete challengeStore[global_id]; // ล้าง Challenge ทิ้งหลังใช้งานเสร็จ
      return res.status(200).json({ message: 'ลงทะเบียนลายนิ้วมือสำเร็จ' });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: 'การตรวจสอบลายนิ้วมือล้มเหลว', details: error.message });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);