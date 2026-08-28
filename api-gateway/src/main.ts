import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { generateGlobalId } from './utils/idGenerator';

const app = express();
const prisma = new PrismaClient();

// เปิดใช้งาน CORS และจำกัดโดเมน
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:4200',
    'https://9plus.app' // อนุญาตโดเมนจริง
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get('/api', (req, res) => {
  res.send({ message: 'API Server is running successfully! 🚀' });
});

app.post('/api/register', async (req, res) => {
  try {
    const {
      full_name_local,
      full_name_english,
      date_of_birth,
      citizenship_status,
      countryCode,
      birthYear,
      gender,
      religion,
      regionCode
    } = req.body;

    const global_id = generateGlobalId({
      countryCode,
      birthYear,
      gender,
      religion,
      regionCode
    });

    const newIdentity = await prisma.core_identities.create({
      data: {
        global_id,
        full_name_local,
        full_name_english,
        date_of_birth: new Date(date_of_birth),
        citizenship_status
      }
    });

    res.status(201).json({
      message: 'สร้างรหัส Global ID และบันทึกข้อมูลสำเร็จ',
      data: newIdentity
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);