import { useState } from 'react';

export function App() {
  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#1e3a8a' }}>9 Plus ERP System</h1>
      <p>ระบบยืนยันตัวตนด้วย Biometric (สแกนลายนิ้วมือ / ใบหน้า)</p>
      
      <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px' }}>
          <h3>สำหรับพนักงานใหม่</h3>
          <p>ลงทะเบียนประวัติและตั้งค่าสแกนนิ้ว</p>
          <button style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            ลงทะเบียน
          </button>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px' }}>
          <h3>สำหรับพนักงานเดิม</h3>
          <p>เข้าสู่ระบบด้วยลายนิ้วมือ</p>
          <button style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;