import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateGlobalId } from './utils/idGenerator';

const app = express();
const prisma = new PrismaClient();

// อนุญาตให้อ่านข้อมูลแบบ JSON ที่ส่งมาจาก Frontend
app.use(express.json()); 

app.post('/api/register', async (req, res) => {
  try {
    // 1. รับข้อมูลจากหน้าเว็บ (req.body)
    const {
      full_name_local,
      full_name_english,
      date_of_birth,
      citizenship_status,
      // ข้อมูลสำหรับสร้าง ID
      countryCode,
      birthYear,
      gender,
      religion,
      regionCode
    } = req.body;

    // 2. สร้าง Global ID 16 หลัก
    const global_id = generateGlobalId({
      countryCode,
      birthYear,
      gender,
      religion,
      regionCode
    });

    // 3. บันทึกลงฐานข้อมูลผ่าน Prisma
    const newIdentity = await prisma.core_identities.create({
      data: {
        global_id,
        full_name_local,
        full_name_english,
        date_of_birth: new Date(date_of_birth), // แปลงสตริงวันที่ให้เป็นออบเจกต์ Date
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