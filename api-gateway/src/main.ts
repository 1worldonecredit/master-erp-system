import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { generateGlobalId } from './utils/idGenerator';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

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

app.post('/api/biometric/register/options', async (req, res) => {
  const { global_id } = req.body;
  if (!global_id) return res.status(400).json({ error: 'กรุณาระบุ global_id' });

  const user = await prisma.core_identities.findUnique({ where: { global_id } });
  if (!user) return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' });

  const existingPasskeys = await prisma.passkey_credentials.findMany({ where: { global_id } });

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new Uint8Array(Buffer.from(global_id)), 
    userName: user.full_name_english,
    attestationType: 'none',
    excludeCredentials: existingPasskeys.map((key: any) => ({
      id: key.credential_id as any,
      type: 'public-key' as const, 
    })),
  });

  challengeStore[global_id] = options.challenge;
  return res.status(200).json(options);
});

app.post('/api/biometric/register/verify', async (req, res) => {
  const { global_id, registrationResponse } = req.body;
  const expectedChallenge = challengeStore[global_id];

  if (!expectedChallenge) return res.status(400).json({ error: 'ไม่พบ Challenge กรุณาทำรายการใหม่' });

  try {
    const verification = await verifyRegistrationResponse({
      response: registrationResponse as any, 
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo;

      await prisma.passkey_credentials.create({
        data: {
          global_id,
          credential_id: credential.id,
          public_key: Buffer.from(credential.publicKey as any), 
          counter: BigInt(credential.counter)
        }
      });

      delete challengeStore[global_id];
      return res.status(200).json({ message: 'ลงทะเบียนลายนิ้วมือสำเร็จ' });
    }
    
    // เติมจุดนี้เข้าไปเพื่อให้ฟังก์ชันมีค่า Return ครบทุกกรณี
    return res.status(400).json({ error: 'การตรวจสอบลายนิ้วมือไม่ถูกต้อง' });
    
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