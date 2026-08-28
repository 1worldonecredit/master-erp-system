import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // นำเข้า Zod
import { generateGlobalId } from './utils/idGenerator';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:4200',
    'https://9plus.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// --- 1. สร้างกฎการตรวจสอบข้อมูลด้วย Zod ---
const registerSchema = z.object({
  full_name_local: z.string().min(1, "กรุณากรอกชื่อภาษาไทย"),
  full_name_english: z.string().min(1, "กรุณากรอกชื่อภาษาอังกฤษ"),
  date_of_birth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "รูปแบบวันที่ไม่ถูกต้อง (ต้องเป็น YYYY-MM-DD)"
  }),
  citizenship_status: z.string().min(1, "กรุณากรอกสัญชาติ"),
  countryCode: z.string().length(2, "รหัสประเทศต้องมี 2 ตัวอักษร"),
  birthYear: z.string().length(4, "ปีเกิดต้องมี 4 ตัวอักษร"),
  gender: z.string().min(1, "กรุณาระบุเพศ"),
  religion: z.string().min(1, "กรุณาระบุศาสนา"),
  regionCode: z.string().min(1, "กรุณาระบุรหัสภูมิภาค")
});

app.get('/api', (req, res) => {
  res.send({ message: 'API Server is running successfully! 🚀' });
});

app.post('/api/register', async (req, res) => {
  try {
    // --- 2. นำข้อมูล req.body มาวิ่งผ่านด่านตรวจของ Zod ---
    const validatedData = registerSchema.parse(req.body);

    // --- 3. หากผ่านด่านมาได้ ก็นำข้อมูลที่สะอาดแล้วไปใช้งาน ---
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

    res.status(201).json({
      message: 'สร้างรหัส Global ID และบันทึกข้อมูลสำเร็จ',
      data: newIdentity
    });

  } catch (error: any) {
    // --- 4. ดักจับ Error: ถ้าข้อมูลผิดกติกา Zod จะเด้งมาทำงานตรงนี้ ---
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'ข้อมูลไม่ถูกต้อง', 
        details: error.errors 
      });
    }
    
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);