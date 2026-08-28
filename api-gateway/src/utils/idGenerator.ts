interface UserDemographics {
  countryCode: string; // รหัสประเทศ 3 ตัว เช่น 'THA'
  birthYear: number;   // ปีเกิด ค.ศ. เช่น 1990
  gender: 'M' | 'F' | 'X'; // M=ชาย, F=หญิง, X=ไม่ระบุ
  religion: '1' | '2' | '3' | '0'; // 1=พุทธ, 2=คริสต์, 3=อิสลาม, 0=อื่นๆ/ไม่ระบุ
  regionCode: string;  // รหัสพื้นที่ 3 ตัว เช่น 'BKK'
}

export function generateGlobalId(data: UserDemographics): string {
  // 1. จัดการรหัสประเทศ (3 ตัวอักษร พิมพ์ใหญ่เสมอ)
  const country = data.countryCode.substring(0, 3).toUpperCase();

  // 2. ดึงเลขท้าย 2 ตัวของปีเกิด (ค.ศ.)
  const year = data.birthYear.toString().slice(-2);

  // 3. รวมรหัสเพศและศาสนาเข้าด้วยกัน
  const genderReligion = `${data.gender}${data.religion}`;

  // 4. จัดการรหัสพื้นที่ (3 ตัวอักษร พิมพ์ใหญ่เสมอ)
  const region = data.regionCode.substring(0, 3).toUpperCase();

  // 5. สุ่มตัวเลข 5 หลัก (00000 - 99999) เพื่อป้องกันการซ้ำ
  const uniqueNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

  // ประกอบร่างชุดข้อมูลทั้งหมดคั่นด้วยเครื่องหมายขีด (-)
  return `${country}-${year}-${genderReligion}-${region}-${uniqueNum}`;
}

// ตัวอย่างการเรียกใช้งาน:
// const newUserId = generateGlobalId({
//   countryCode: 'THA',
//   birthYear: 1990,
//   gender: 'M',
//   religion: '1',
//   regionCode: 'BKK'
// });
// console.log(newUserId); 
// ผลลัพธ์ที่ได้จะเป็นฟอร์แมต: THA-90-M1-BKK-84921