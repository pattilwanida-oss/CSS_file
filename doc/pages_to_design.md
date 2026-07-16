# ส่วนประกอบหน้าจอและ Interaction สำหรับออกแบบ Figma (CSS_file Project)

เอกสารนี้ระบุองค์ประกอบทั้งหมดในแต่ละหน้า พร้อมอธิบายพฤติกรรม (Interaction) ที่สำคัญ เช่น ขั้นตอนการเชื่อมต่อผ่าน QR Code และสถานะการแสดงผลเวลาที่ผู้เล่น "กดเลือกการ์ด" เพื่อให้นำไปสร้าง Prompt ใน Figma ได้ภาพที่สมบูรณ์ที่สุด

---

## 1. Home Page / Game Lobby (หน้าสร้างห้องและรอผู้เล่น)
**องค์ประกอบและ Interaction ที่ต้องมี:**
- Game Title (โลโก้คำว่า "CSS_file")
- ปุ่ม "Create New Game" 
- **หน้าต่างเชื่อมต่อ (Connection Box):** ต้องมีกรอบสำหรับแสดง **QR Code** ที่ออกแบบให้เด่นชัด พร้อมคำแนะนำเช่น "Scan to Join" เพื่อให้ผู้เล่นใช้มือถือสแกนเข้าเกมได้ทันที
- ข้อความแสดงรหัสห้อง (Room Code) 4-6 หลัก สำหรับคนที่ไม่ได้สแกน QR

**📋 Figma Prompt:**
> Design a responsive Home Page and Game Lobby for "CSS_file". Must include: 1. Game Title ("CSS_file"). 2. "Create New Game" button. 3. A prominent QR Code connection box with a "Scan to Join" label, making it obvious how mobile users connect to the TV/Screen. 4. A large text area displaying a 4-6 digit Room Code.

---

## 2. Join Page (หน้าเข้าร่วมเกม)
**องค์ประกอบและ Interaction ที่ต้องมี:**
- โลโก้เกมขนาดเล็ก ("CSS_file")
- **ช่องกรอก Room Code:** สำหรับคนที่ใช้มือถือสแกน QR Code จากหน้า Home ระบบจะพามาระบุที่หน้านี้ (ช่องนี้อาจมีรหัสเติมไว้ให้อัตโนมัติ)
- ช่องกรอก Player Name
- ปุ่ม "Join Game" สำหรับกดยืนยันเพื่อเข้าสู่เกม

**📋 Figma Prompt:**
> Design a responsive Join Page for "CSS_file". This is the screen users see on their mobile phones after scanning the QR code from the Lobby. Must include: 1. Small Game Logo. 2. Input field for "Room Code". 3. Input field for "Player Name". 4. A prominent "Join Game" button to enter the match.

---

## 3. Game Board Page (หน้ากระดานหลัก)
**องค์ประกอบและ Interaction ที่ต้องมี:**
- ส่วนหัว (Header) แสดงสถานะปัจจุบันของเกม 
- พื้นที่แสดงรายชื่อผู้ต้องสงสัย (Suspects Grid)
- **พื้นที่แสดงหลักฐานและอาวุธ (Evidence & Weapons Grid):** *ต้องออกแบบเป็นการ์ดที่มีรูปภาพ (Picture Cards) อย่างชัดเจน เช่น ภาพมีด, ภาพเชือก ห้ามทำเป็นแค่ตัวหนังสือเปล่าๆ*
- สัญลักษณ์ (Markers) สำหรับวางระบุตำแหน่งบนการ์ด เพื่อบอกว่าหลักฐานชิ้นไหนกำลังถูกเพ่งเล็งหรืออ้างอิงอยู่

**📋 Figma Prompt:**
> Design a responsive Game Board Page for "CSS_file". Must include: 1. Header showing game status. 2. A grid layout for "Suspects". 3. A grid layout for "Evidence" and "Weapons". **CRITICAL DESIGN RULE:** Evidence and Weapons MUST be physical-looking Picture Cards containing vivid illustrations or photos of the actual items (e.g., a bloody knife, a footprint). Do not use text-only designs. 4. Visual markers placed on top of certain cards to show they are currently being targeted or investigated.

---

## 4. Player Page (หน้าผู้เล่นและสถานะตอนเลือกการ์ด)
**องค์ประกอบและ Interaction ที่ต้องมี:**
- ป้ายแสดงบทบาท (Role Badge) ที่บอกว่าเป็นใคร 
- **การ์ดในมือ (Player's Hand):** แสดงการ์ดอาวุธและหลักฐานของผู้เล่น (ต้องเป็นการ์ดรูปภาพแบบเดียวกับกระดานหลัก)
- **สถานะตอนเลือกการ์ด (Card Selection Interaction):** 
  - *เมื่อผู้เล่นแตะเลือกการ์ด:* การ์ดใบนั้นจะต้อง **ลอย/เด้งใหญ่ขึ้นมา (Scale up)** กว่าใบอื่น
  - มี **เส้นขอบหนาสีสว่างหรือเรืองแสง (Glowing border)** ล้อมรอบการ์ดใบที่ถูกเลือก
  - มี **ไอคอนเครื่องหมายถูก (Checkmark)** ปรากฏบนการ์ดเพื่อยืนยันจุดที่กำลังโฟกัส
- ปุ่มยืนยัน (Confirm Button) ด้านล่าง ที่จะเปลี่ยนสีสว่างขึ้น (Active) เมื่อมีการเลือกการ์ดแล้ว

**📋 Figma Prompt:**
> Design a responsive Player Dashboard for "CSS_file". Must include: 1. A Role Badge showing the player's secret identity. 2. A hand of Evidence and Weapon cards (MUST be visual Picture Cards with illustrations/photos). 3. **CRITICAL INTERACTION (Card Selection State):** Clearly show one specific card in a "Selected" state. The selected card MUST scale up/pop out, feature a thick glowing or brightly colored border, and display a checkmark icon to indicate it has been tapped by the user. 4. A large, active "Confirm Selection" button at the bottom.
