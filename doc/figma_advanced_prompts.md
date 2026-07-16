# Advanced Figma Prompts: User Flow & Responsive Design (CSS_file Project)

ไฟล์นี้ออกแบบมาเพื่อสร้าง Prompt สำหรับ Figma โดยเน้นเรื่อง **"User Flow (การเชื่อมโยงจากปุ่มหนึ่งไปอีกหน้าหนึ่ง)"**, **"ความคล่องตัวของ Responsive (Mobile -> Tablet -> Desktop)"**, และเพิ่มหน้าเฉพาะสำหรับ **"การเลือกไพ่ของฆาตกร (Murderer's Selection)"** ตามที่คุณต้องการ

---

## 1. Flow 1: การสร้างห้องและการสแกนเข้าร่วม (Lobby to Join Flow)
**เป้าหมาย:** สื่อสารให้ AI เห็นภาพว่าหน้าจอบนทีวี/คอมพิวเตอร์ ทำงานร่วมกับหน้าจอมือถืออย่างไรผ่านปุ่มและ QR Code
**📋 Figma Prompt (Copy-Paste):**
> Design a highly responsive "Create & Join Game" user flow for the board game "CSS_file". 
> **Screen 1 (Host Lobby - Responsive Desktop/TV):** Display a large "Create New Game" button. Once clicked, show a prominent QR Code box labeled "Scan to Join" and a large 4-6 digit Room Code.
> **Screen 2 (Mobile Join - Responsive Mobile):** The screen users see after scanning the QR. The flow is: 1) "Room Code" is auto-filled. 2) User taps the "Player Name" input field. 3) User taps a massive, thumb-friendly "Join Game" button to proceed.
> **Responsive Rules:** The layouts must adapt fluidly. On mobile, stack elements vertically with full-width buttons. On desktop, use side-by-side or balanced centered layouts.

---

## 2. Flow 2: หน้าเลือกการ์ดของฆาตกร (Murderer's Secret Selection) - *New!*
**เป้าหมาย:** อธิบายสเต็ปการกดปุ่มต่อปุ่มเวลาที่ฆาตกรต้องเลือก "อาวุธ" และ "หลักฐาน" อย่างลับๆ บนมือถือ
**📋 Figma Prompt (Copy-Paste):**
> Design a responsive mobile-first "Murderer's Secret Selection" screen for "CSS_file". This is the critical phase where the Murderer chooses the murder weapon and key evidence.
> **Components:** 1) A dark red "Murderer" Role Badge at the top. 2) A layout of visual Picture Cards (Weapons and Evidence containing realistic illustrations/photos, NOT text-only).
> **Interaction Flow (Button-to-Button):** 
> - Action 1: The user taps a Weapon picture card. The card physically scales up, gets a glowing red border, and a checkmark appears.
> - Action 2: The user taps an Evidence picture card. It also scales up and highlights.
> - Action 3: ONLY after exactly one weapon and one evidence are selected, a previously disabled, grayed-out "Confirm Murder" button at the bottom turns bright red and becomes active/clickable.
> **Responsive Rules:** Keep the cards easily tappable on small screens. The "Confirm Murder" button should be fixed to the bottom of the viewport on mobile devices.

---

## 3. Flow 3: กระดานหลักและการโต้ตอบของผู้เล่นทั่วไป (Game Board & Player Flow)
**เป้าหมาย:** หน้ากระดานหลักที่ต้องยืดหยุ่นได้ทุกหน้าจอ และหน้าจอมือถือสำหรับผู้เล่นตำแหน่งอื่นๆ
**📋 Figma Prompt (Copy-Paste):**
> Design a responsive "Game Board and Player Action" flow for "CSS_file".
> **Screen 1 (Main Evidence Board - Responsive Any Device):** A responsive grid displaying Suspect cards and visual Picture Cards for Weapons and Evidence. The layout MUST instantly adapt its grid structure based on device width (e.g., 2 columns on mobile, 4 on tablet, 6 on desktop) ensuring picture cards are never cropped. Include physical tokens placed on specific cards.
> **Screen 2 (Investigator Mobile Screen):** The secret dashboard for a standard investigator. Show their Role Badge and their hand of Picture Cards. Include a button flow where tapping a card activates a "Select Clue" button. Once "Select Clue" is clicked, show a "Waiting for others..." loading state.
