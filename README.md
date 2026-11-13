# ระบบบันทึกผลวิเคราะห์น้ำตาลทรายดิบ (PWA) — v1

แอปติดตั้งลงมือถือ/คอมพิวเตอร์ ครอบเว็บ Google Apps Script ไว้ใน iframe
ใช้งานเต็มจอเหมือนแอปมือถือ มี splash, ตรวจออฟไลน์/สัญญาณช้า, ปุ่มรีเฟรช, ปุ่มติดตั้ง, แจ้งเวอร์ชันใหม่

Apps Script: https://script.google.com/macros/s/AKfycbyFOaAF4i1p0ciO5kNDKcVp-ubvv2E6bA1X1g0-iE7flJt3_wsY1FhDyPeD8R8K6zUG/exec

## โครงสร้างไฟล์
- `index.html` ตัวแอป (ครอบ iframe)  |  `manifest.webmanifest`  |  `sw.js` Service Worker
- `icons/` ไอคอนทุกขนาด (72–512, maskable 192/512, apple-touch, 16/32/48) สร้างจาก `sugar_truck.ico`
- `favicon.ico`, `apple-touch-icon.png`
- `apps-script/PATCH-logout-and-embed.txt` สิ่งที่ต้องตรวจ/แก้ฝั่ง Apps Script

## ขึ้น GitHub Pages (ต้องเป็น HTTPS ถึงติดตั้ง PWA ได้)
1. สร้าง repository ใหม่ อัปโหลดไฟล์ทั้งหมดไว้ที่ root
2. Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save
3. เปิด `https://<ผู้ใช้>.github.io/<repo>/` แล้วติดตั้ง
(โฮสต์อื่นก็ได้ เช่น Netlify / Cloudflare Pages / เซิร์ฟเวอร์ภายในที่มี HTTPS)

## เปลี่ยนลิงก์ Apps Script
แก้ที่ `src` ของ `<iframe id="frame">` ใน `index.html` (ที่เดียว)

## อัปเดตเวอร์ชัน
แก้ไฟล์แล้วเปลี่ยนเลข `V` ใน `sw.js` (ตอนนี้ `sugarlab-v1`) — ผู้ใช้จะเห็นแถบ "มีเวอร์ชันใหม่ กดอัปเดต"

## ข้อควรรู้
- iOS: ต้องกด แชร์ → เพิ่มไปยังหน้าจอโฮม เอง (แอปมีหน้าสอน) และ storage แยกจาก Safari ต้องล็อกอินใหม่ในแอป
- ข้อมูลทั้งหมดมาจาก Apps Script แบบสด ไม่ถูกแคช ถ้าออฟไลน์จะแสดงหน้าแจ้งเตือนและให้ลองใหม่
- ไอคอนต้นฉบับขนาด 128×128 จึงขยายเป็น 512 แล้วอาจนุ่มลงเล็กน้อย ถ้ามีไฟล์ PNG ใหญ่กว่า ให้แทนที่ใน `icons/`
