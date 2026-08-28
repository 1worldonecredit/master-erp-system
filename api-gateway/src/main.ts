import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { generateGlobalId } from './utils/idGenerator';
import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4200', 'https://9plus.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const rpName = '9Plus ERP System';
const rpID = 'localhost';
const origin = 'http://localhost:3000';

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

app.get('/api', (req, res) => {
  return res.send({ message: 'API Server is running successfully! 🚀' });
});

app.post('/api/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    const global_id = generateGlobalId({
      countryCode: validatedData.countryCode,
      birthYear: validatedData.birthYear,
      gender: validatedData.gender,
      religion: validatedData.religion,
      regionCode: validatedData.regionCode
    } as any);

    const newIdentity = await prisma.core_identities.create({
      data: {
        global_id,
        full_name_local: validatedData.full_name_local,
        full_name_english: validatedData.full_name_english,
        date_of_birth: new Date(validatedData.date_of_birth),
        citizenship_status: validatedData.citizenship_status
      }
    });
    return res.status(201).json({ message: 'สร้างรหัส Global ID สำเร็จ', data: newIdentity });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง', details: error.issues });
    }
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});
// --- 4. API ใหม่: ขอตัวเลือกการเข้าสู่ระบบด้วยลายนิ้วมือ (Login Options) ---
app.post('/api/biometric/login/options', async (req, res) => {
  const { global_id } = req.body;
  if (!global_id) return res.status(400).json({ error: 'กรุณาระบุ global_id' });

  // ค้นหากุญแจลายนิ้วมือทั้งหมดของผู้ใช้นี้ในระบบ
  const passkeys = await prisma.passkey_credentials.findMany({ where: { global_id } });
  if (passkeys.length === 0) return res.status(404).json({ error: 'ไม่พบข้อมูลลายนิ้วมือ กรุณาลงทะเบียนก่อน' });

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: passkeys.map((key) => ({
      id: key.credential_id as any,
      type: 'public-key' as const,
    })),
    userVerification: 'preferred',
  });

  challengeStore[global_id] = options.challenge;
  return res.status(200).json(options);
});

// --- 5. API ใหม่: ตรวจสอบและเข้าสู่ระบบ (Login Verify) ---
app.post('/api/biometric/login/verify', async (req, res) => {
  const { global_id, authenticationResponse } = req.body;
  const expectedChallenge = challengeStore[global_id];

  if (!expectedChallenge) return res.status(400).json({ error: 'ไม่พบ Challenge กรุณาทำรายการใหม่' });

  try {
    // หากุญแจลายนิ้วมือที่ตรงกับอุปกรณ์ที่ส่งมา
    const passkey = await prisma.passkey_credentials.findUnique({
      where: { credential_id: authenticationResponse.id }
    });

    if (!passkey) return res.status(404).json({ error: 'ไม่พบกุญแจลายนิ้วมือนี้ในระบบ' });

   const verification = await verifyAuthenticationResponse({
      response: authenticationResponse as any,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      // เปลี่ยนชื่อตัวแปรเป็น credential และปรับฟิลด์ด้านในให้ตรงกับเวอร์ชันล่าสุด
      credential: {
        id: passkey.credential_id,
        publicKey: passkey.public_key as any,
        counter: Number(passkey.counter),
      } as any, 
    });

    if (verification.verified && verification.authenticationInfo) {
      const { newCounter } = verification.authenticationInfo;

      // อัปเดตจำนวนครั้ง (Counter) เพื่อป้องกันการแฮกแบบ Replay Attack
      await prisma.passkey_credentials.update({
        where: { credential_id: passkey.credential_id },
        data: { counter: BigInt(newCounter) }
      });

      delete challengeStore[global_id];
      
      // TODO: ในอนาคตสามารถสร้าง JWT Token ตรงนี้เพื่อส่งกลับไปให้หน้าเว็บ
      return res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ! 🚀', global_id });
    }

    return res.status(400).json({ error: 'การสแกนนิ้วไม่ถูกต้อง' });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: 'การเข้าสู่ระบบล้มเหลว', details: error.message });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);