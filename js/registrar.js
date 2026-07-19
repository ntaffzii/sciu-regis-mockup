/* =========================================================================
 * SciU-Regis Mock-up — registrar.js
 * Mock data + logic สำหรับหน้าจอฝั่ง Registrar (Screen 1-7 + Home)
 * ========================================================================= */

/* ---------------- Mock data (โหลดจาก localStorage ถ้ามี state ค้าง) ------- */
const QUOTA_MAX = 12; // 12 หน่วย (36 ชม.) ต่อปีการศึกษา — FR-C group

const DEFAULT_EVENTS = [
  { id: 1, name: 'ค่ายจิตอาสาพัฒนาโรงเรียนบ้านดอนงัว', date: '2026-06-20', days: 3, credits: 3.0, open: false, gps: true, lat: 15.1183, lng: 104.9057, radius: 30, participants: 100, checkedIn: 45, exportStatus: 'none', rosterOverdue: false, staffIds: [99], staffLimit: 3 },
  { id: 2, name: 'Science Open House 2569', date: '2026-07-15', days: 1, credits: 1.5, open: false, gps: true, lat: 15.1215, lng: 104.9101, radius: 50, participants: 250, checkedIn: 0, exportStatus: 'none', rosterOverdue: false, staffIds: [], staffLimit: 5 },
  { id: 3, name: 'บริจาคโลหิต สภากาชาดไทย (เปิดกว้าง)', date: '2026-06-05', days: 1, credits: 1.0, open: true, acceptedDocTypes: ['individual', 'project'], gps: false, participants: 60, checkedIn: 58, exportStatus: 'confirmed', rosterOverdue: false, staffIds: [], staffLimit: 3 },
  { id: 4, name: 'อบรมปฐมพยาบาลเบื้องต้น CPR', date: '2026-06-28', days: 1, credits: 1.5, open: false, gps: false, participants: 80, checkedIn: 74, exportStatus: 'exported', rosterOverdue: false, staffIds: [], staffLimit: 3 },
  { id: 5, name: 'จิตอาสาพัฒนาคณะวิทยาศาสตร์', date: '2026-07-02', days: 2, credits: 2.0, open: false, gps: true, lat: 15.1198, lng: 104.9077, radius: 40, participants: 55, checkedIn: 51, exportStatus: 'none', rosterOverdue: true, staffIds: [4, 99], staffLimit: 2 },
  { id: 6, name: 'ปลูกป่าชายเลนเฉลิมพระเกียรติ (เปิดกว้าง)', date: '2026-07-08', days: 1, credits: 2.0, open: true, acceptedDocTypes: ['individual', 'project'], gps: false, participants: 40, checkedIn: 36, exportStatus: 'none', rosterOverdue: true, staffIds: [], staffLimit: 3 },
];

const DEFAULT_STUDENTS = [
  { code: '66114400123', first: 'สมชาย', last: 'ใจดี', credits: 3.0, attend: [true, true, true] },
  { code: '66114400124', first: 'สมหญิง', last: 'รักเรียน', credits: 3.0, attend: [true, true, true] },
  { code: '66114400125', first: 'วิชัย', last: 'เก่งกล้า', credits: 2.0, attend: [true, true, false] },
  { code: '66114400126', first: 'มานี', last: 'มีนา', credits: 3.0, attend: [true, true, true] },
  { code: '66114400127', first: 'ปิติ', last: 'ยินดี', credits: 1.0, attend: [true, false, false] },
  { code: '66114400128', first: 'ชูใจ', last: 'ใจงาม', credits: 3.0, attend: [true, true, true] },
  { code: '66114400129', first: 'ดวงเดือน', last: 'ศรีสุข', credits: 2.0, attend: [false, true, true] },
  { code: '66114400130', first: 'อนันต์', last: 'พากเพียร', credits: 3.0, attend: [true, true, true] },
  { code: '66114400131', first: 'กมล', last: 'ขยันยิ่ง', credits: 2.0, attend: [true, false, true] },
  { code: '66114400132', first: 'รุ่งนภา', last: 'แสงทอง', credits: 3.0, attend: [true, true, true] },
  { code: '6611440013X', first: 'ทดสอบ', last: 'รหัสผิด', credits: 1.0, attend: [true, false, false] }, // จงใจให้รหัสไม่ผ่าน validation
  { code: '66114400134', first: 'ศุภชัย', last: 'เรืองรอง', credits: 3.0, attend: [true, true, true] },
];

/* หลักฐานกิจกรรมเปิดกว้าง (FR-C4-C7, C19) — ไม่ผูกกับ event_id ใดๆ ในระบบ
 * submissionMethod: 'logbook' (สูงสุด 4 แถว, กรอกเอง) | 'group_roster' (OCR อ่านตารางรายชื่อ)
 * logbook: items[] คือแถวที่นักศึกษากรอกเอง ไม่มี OCR
 * group_roster: rosterEntries[] คือแถวที่ OCR สกัดจากรูปตาราง — matchedCode ต้องจับคู่กับ students ก่อนอนุมัติได้ */
const DEFAULT_PROOFS = [
  {
    id: 101, submissionMethod: 'logbook', submittedBy: { name: 'สมชาย ใจดี', code: '66114400123' }, submittedAt: '2026-07-08',
    coverImage: 'cover_สมชาย.jpg', tableImage: 'แบบบันทึกกิจกรรม_วัดป่าฯ.jpg',
    items: [
      {
        rowIndex: 1, activityName: 'จิตอาสาช่วยงานวัดป่านานาชาติ', location: 'วัดป่านานาชาติ อ.วารินชำราบ', activityDate: '2026-07-05', timeRange: '08:00-14:00',
        hours: 6, detail: 'ช่วยทำความสะอาดศาลาปฏิบัติธรรมและจัดสถานที่รับเสด็จ', approverName: 'พระอาจารย์สมชาย ปัญญาวุฑโฒ', approverPosition: 'เจ้าอาวาส', approverPhone: '081-234-5678',
        photos: ['activity_1a.jpg', 'activity_1b.jpg'], status: 'pending', approvedHours: null, rejectionReason: null
      },
    ]
  },
  {
    id: 102, submissionMethod: 'logbook', submittedBy: { name: 'สมปอง ใจงาม', code: '66114400140' }, submittedAt: '2026-07-08',
    coverImage: 'cover_สมปอง.jpg', tableImage: 'table_สมปอง.jpg',
    items: [
      {
        rowIndex: 1, activityName: 'อาสาสมัครช่วยงานกาชาดจังหวัด', location: 'สำนักงานกาชาดจังหวัดอุบลราชธานี', activityDate: '2026-07-01', timeRange: '08:00-17:00',
        hours: 9, detail: 'ช่วยลงทะเบียนผู้บริจาคโลหิตและจัดเตรียมอุปกรณ์', approverName: 'นางสาวจิราภรณ์ ใจบุญ', approverPosition: 'เจ้าหน้าที่กาชาดจังหวัด', approverPhone: '045-123-456',
        photos: ['certificate_redcross.jpg'], status: 'pending', approvedHours: null, rejectionReason: null
      },
      {
        rowIndex: 2, activityName: 'อาสาสมัครแจกน้ำดื่มงานวิ่งการกุศล', location: 'สนามกีฬาจังหวัดอุบลราชธานี', activityDate: '2026-07-01', timeRange: '05:00-09:00',
        hours: 4, detail: 'ดูแลจุดบริการน้ำดื่มระหว่างเส้นทางวิ่ง', approverName: 'นายประวิทย์ ขยันงาน', approverPosition: 'ผู้ประสานงานอาสาสมัคร', approverPhone: '089-111-2222',
        photos: ['run_event_1.jpg'], status: 'pending', approvedHours: null, rejectionReason: null
      },
    ]
  },
  {
    id: 103, submissionMethod: 'logbook', submittedBy: { name: 'มานี มีนา', code: '66114400126' }, submittedAt: '2026-07-09',
    coverImage: 'cover_มานี.jpg', tableImage: 'table_มานี.jpg',
    items: [
      {
        rowIndex: 1, activityName: 'จิตอาสาสอนหนังสือน้อง ร.ร.บ้านหนองแสง', location: 'โรงเรียนบ้านหนองแสง', activityDate: '2026-07-06', timeRange: '09:00-12:00',
        hours: 3, detail: 'สอนวิชาภาษาอังกฤษพื้นฐานให้นักเรียนชั้นประถม', approverName: 'นางสมศรี รักเด็ก', approverPosition: 'ผู้อำนวยการโรงเรียน', approverPhone: '045-987-654',
        photos: ['teaching_1.jpg'], status: 'pending', approvedHours: null, rejectionReason: null
      },
    ]
  },
  {
    id: 104, submissionMethod: 'logbook', submittedBy: { name: 'ปิติ ยินดี', code: '66114400127' }, submittedAt: '2026-07-09',
    coverImage: 'cover_ปิติ.jpg', tableImage: 'proof_rimmun.jpg',
    items: [
      {
        rowIndex: 1, activityName: 'อาสาพัฒนาชุมชนริมมูล', location: 'องค์การบริหารส่วนตำบลริมมูล', activityDate: '2026-06-28', timeRange: '07:00-19:00',
        hours: 12, detail: 'ช่วยขุดลอกคลองและปลูกต้นไม้ริมแม่น้ำมูล', approverName: 'นายก อบต. ริมมูล', approverPosition: 'นายกองค์การบริหารส่วนตำบล', approverPhone: '081-999-8888',
        photos: ['rimmun_1.jpg', 'rimmun_2.jpg'], status: 'pending', approvedHours: null, rejectionReason: null
      },
    ]
  },
  {
    id: 105, submissionMethod: 'group_roster', submittedBy: { name: 'ชมรมอาสาพัฒนา ม.อุบลฯ', code: '66114400132' }, submittedAt: '2026-07-10',
    groupFormImage: 'แบบบันทึกกิจกรรม_ปลูกป่า.jpg', rosterImage: 'roster_ปลูกป่า.jpg',
    groupActivity: {
      name: 'ปลูกป่าชายเลนชุมชนบ้านโนนงาม', location: 'ชุมชนบ้านโนนงาม อ.เมือง', date: '2026-07-08', hours: 6,
      detail: 'ปลูกต้นโกงกางและทำความสะอาดชายฝั่ง', approverName: 'นายประสาน ดูแลดี', approverPosition: 'ผู้ใหญ่บ้าน', approverPhone: '086-555-4444'
    },
    rosterEntries: [
      { rowIndex: 1, ocrFirstName: 'รุ่งนภา', ocrLastName: 'แสงทอง', ocrStudentCode: '66114400132', ocrFaculty: 'วิทยาศาสตร์', signaturePresent: true, matchedCode: null, status: 'pending', approvedHours: null, rejectionReason: null },
      { rowIndex: 2, ocrFirstName: 'กมล', ocrLastName: 'ขยันยิ่ง', ocrStudentCode: '66114400131', ocrFaculty: 'วิทยาศาสตร์', signaturePresent: true, matchedCode: null, status: 'pending', approvedHours: null, rejectionReason: null },
      { rowIndex: 3, ocrFirstName: 'ดวงเดือน', ocrLastName: 'ศรีสุข', ocrStudentCode: '6611440O129', ocrFaculty: 'วิทยาศาสตร์', signaturePresent: true, matchedCode: null, status: 'pending', approvedHours: null, rejectionReason: null }, // OCR อ่านเลข 0 เป็นตัว O ผิด
      { rowIndex: 4, ocrFirstName: 'ธนพล', ocrLastName: 'แก้วมณี', ocrStudentCode: '66114499999', ocrFaculty: 'วิศวกรรมศาสตร์', signaturePresent: false, matchedCode: null, status: 'pending', approvedHours: null, rejectionReason: null }, // รหัสไม่ตรงกับใครในระบบ + ไม่มีลายเซ็น
    ]
  },
];

const DEFAULT_LEDGER = [
  { code: '66114400123', name: 'สมชาย ใจดี', units: 9.0, locked: false },
  { code: '66114400124', name: 'สมหญิง รักเรียน', units: 12.0, locked: true },
  { code: '66114400125', name: 'วิชัย เก่งกล้า', units: 4.5, locked: false },
  { code: '66114400126', name: 'มานี มีนา', units: 11.0, locked: false },
  { code: '66114400127', name: 'ปิติ ยินดี', units: 12.0, locked: true },
  { code: '66114400128', name: 'ชูใจ ใจงาม', units: 2.0, locked: false },
  { code: '66114400129', name: 'ดวงเดือน ศรีสุข', units: 7.5, locked: false },
  { code: '66114400130', name: 'อนันต์ พากเพียร', units: 12.0, locked: true },
  { code: '66114400131', name: 'กมล ขยันยิ่ง', units: 0, locked: false },
  { code: '66114400132', name: 'รุ่งนภา แสงทอง', units: 10.0, locked: false },
];

const DEFAULT_CYCLES = [
  { year: 2569, start: '2026-06-01', by: 'พี่สมบัติ วงศ์ทะเบียน', at: '2026-05-28 09:12' },
  { year: 2568, start: '2025-06-09', by: 'พี่สมบัติ วงศ์ทะเบียน', at: '2025-06-02 10:40' },
  { year: 2567, start: '2024-06-10', by: 'เจ้าหน้าที่คนก่อน', at: '2024-06-01 08:55' },
];

/* Feature 2/3: รายชื่อผู้เช็คอินต่อกิจกรรม — เดิมเป็น ROSTER_DATA hardcode แยกอยู่แค่ใน
 * lead-org-rosters.html (คีย์ 1/2/3 ไม่ตรงกับ event id จริงเลย) ย้ายมารวมที่นี่และคีย์ด้วย
 * event id จริงจาก DEFAULT_EVENTS เพื่อให้ field-staff-home.html เชื่อมกับ lead-org-rosters.html ได้
 *
 * โครงสร้างใหม่ (FR-C2/FR-B8 ยืนยันแล้ว — combined check-in): แต่ละคนเก็บหลักฐานได้มากกว่า 1 วิธี
 * พร้อมกันในแถวเดียว (gps + selfie), field `completionPath` บอกว่า "ครบ" ด้วยวิธีไหน:
 *   - 'standard' = ทำครบทุกขั้นตอนที่กิจกรรมกำหนด (gps และ/หรือ selfie ต้อง approved ก่อนถึงจะครบ)
 *   - 'master_code_bypass' = ข้ามด้วยรหัสฉุกเฉิน (ไม่ต้องรอ selfie ที่เหลือ)
 *   - null = ยังไม่ครบ (มี selfie ค้าง pending/rejected)
 * selfie.reviewStatus: 'pending' | 'approved' | 'rejected' — ใช้กับ UC-R23 (หน้าตรวจสอบการเช็คอิน) */
const DEFAULT_ROSTERS = {
  3: {
    name: 'บริจาคโลหิต สภากาชาดไทย',
    students: [
      { code: '66114400123', name: 'สมชาย ใจดี', checkedInAt: '10:00 น.', gps: { lat: 15.1198, lng: 104.9077, distance: 8 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400124', name: 'สมหญิง รักเรียน', checkedInAt: '10:15 น.', gps: { lat: 15.1197, lng: 104.9078, distance: 14 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400126', name: 'มานี มีนา', checkedInAt: '10:30 น.', gps: { lat: 15.1199, lng: 104.9076, distance: 9 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400128', name: 'ชูใจ ใจงาม', checkedInAt: '10:45 น.', gps: null, selfie: null, masterCode: { code: 'X3B8P1', issuedBy: 'เก่ง สตาฟดี', issuedAt: '10:40 น.' }, completionPath: 'master_code_bypass' },
      { code: '66114400130', name: 'อนันต์ พากเพียร', checkedInAt: '11:00 น.', gps: { lat: 15.1200, lng: 104.9075, distance: 11 }, selfie: null, masterCode: null, completionPath: 'standard' },
    ],
  },
  4: {
    name: 'อบรมปฐมพยาบาล CPR',
    students: [
      { code: '66114400123', name: 'สมชาย ใจดี', checkedInAt: '09:00 น.', gps: null, selfie: { url: 'img/mock-selfie.jpg', reviewStatus: 'approved', reviewedBy: 'สมบัติ วงศ์ทะเบียน', reviewedAt: '2026-06-28 12:10' }, masterCode: null, completionPath: 'standard' },
      { code: '66114400124', name: 'สมหญิง รักเรียน', checkedInAt: '09:05 น.', gps: null, selfie: { url: 'img/mock-selfie.jpg', reviewStatus: 'pending', reviewedBy: null, reviewedAt: null }, masterCode: null, completionPath: null },
      { code: '66114400125', name: 'วิชัย เก่งกล้า', checkedInAt: '09:10 น.', gps: null, selfie: { url: 'img/mock-selfie.jpg', reviewStatus: 'pending', reviewedBy: null, reviewedAt: null }, masterCode: null, completionPath: null },
      { code: '66114400128', name: 'ชูใจ ใจงาม', checkedInAt: '09:20 น.', gps: null, selfie: { url: 'img/mock-selfie.jpg', reviewStatus: 'rejected', reviewedBy: 'สมบัติ วงศ์ทะเบียน', reviewedAt: '2026-06-28 13:00' }, masterCode: null, completionPath: null },
    ],
  },
  5: {
    name: 'จิตอาสาพัฒนาคณะวิทยาศาสตร์',
    students: [
      { code: '66114400123', name: 'สมชาย ใจดี', checkedInAt: '09:05 น.', gps: { lat: 15.1198, lng: 104.9077, distance: 6 }, selfie: { url: 'img/mock-selfie.jpg', reviewStatus: 'approved', reviewedBy: 'อาจารย์วิชัย จัดกิจกรรม', reviewedAt: '2026-07-02 10:00' }, masterCode: null, completionPath: 'standard' },
      { code: '66114400124', name: 'สมหญิง รักเรียน', checkedInAt: '09:07 น.', gps: { lat: 15.1199, lng: 104.9078, distance: 10 }, selfie: { url: 'img/mock-selfie.jpg', reviewStatus: 'pending', reviewedBy: null, reviewedAt: null }, masterCode: null, completionPath: null },
      { code: '66114400126', name: 'มานี มีนา', checkedInAt: '09:12 น.', gps: { lat: 15.1197, lng: 104.9079, distance: 15 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400128', name: 'ชูใจ ใจงาม', checkedInAt: '09:20 น.', gps: null, selfie: null, masterCode: { code: 'A7K2M9', issuedBy: 'เก่ง สตาฟดี', issuedAt: '09:18 น.' }, completionPath: 'master_code_bypass' },
      { code: '66114400130', name: 'อนันต์ พากเพียร', checkedInAt: '09:22 น.', gps: { lat: 15.1198, lng: 104.9076, distance: 8 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400132', name: 'รุ่งนภา แสงทอง', checkedInAt: '09:25 น.', gps: { lat: 15.1200, lng: 104.9077, distance: 12 }, selfie: null, masterCode: null, completionPath: 'standard' },
    ],
  },
  6: {
    name: 'ปลูกป่าชายเลนเฉลิมพระเกียรติ',
    students: [
      { code: '66114400123', name: 'สมชาย ใจดี', checkedInAt: '08:23 น.', gps: { lat: 13.4012, lng: 100.0021, distance: 5 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400124', name: 'สมหญิง รักเรียน', checkedInAt: '08:30 น.', gps: { lat: 13.4013, lng: 100.0022, distance: 9 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400125', name: 'วิชัย เก่งกล้า', checkedInAt: '09:15 น.', gps: null, selfie: null, masterCode: { code: 'M5N2K7', issuedBy: 'เก่ง สตาฟดี', issuedAt: '09:12 น.' }, completionPath: 'master_code_bypass' },
      { code: '66114400126', name: 'มานี มีนา', checkedInAt: '08:45 น.', gps: { lat: 13.4011, lng: 104.0023, distance: 18 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400127', name: 'ปิติ ยินดี', checkedInAt: '09:00 น.', gps: null, selfie: { url: 'img/mock-selfie.jpg', reviewStatus: 'pending', reviewedBy: null, reviewedAt: null }, masterCode: null, completionPath: null },
      { code: '66114400128', name: 'ชูใจ ใจงาม', checkedInAt: '08:50 น.', gps: { lat: 13.4014, lng: 100.0020, distance: 7 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400129', name: 'ดวงเดือน ศรีสุข', checkedInAt: '08:55 น.', gps: { lat: 13.4010, lng: 100.0024, distance: 11 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400130', name: 'อนันต์ พากเพียร', checkedInAt: '09:30 น.', gps: null, selfie: null, masterCode: { code: 'B4T9Q2', issuedBy: 'เก่ง สตาฟดี', issuedAt: '09:27 น.' }, completionPath: 'master_code_bypass' },
      { code: '66114400131', name: 'กมล ขยันยิ่ง', checkedInAt: '09:10 น.', gps: { lat: 13.4012, lng: 100.0019, distance: 6 }, selfie: null, masterCode: null, completionPath: 'standard' },
      { code: '66114400132', name: 'รุ่งนภา แสงทอง', checkedInAt: '08:40 น.', gps: { lat: 13.4013, lng: 100.0021, distance: 10 }, selfie: null, masterCode: null, completionPath: 'standard' },
    ],
  },
};

/* คืนสถานะรวมของการเช็คอิน 1 คน — ใช้กับ badge/รายงานทุกหน้าที่เกี่ยวข้อง (FR-B8, UC-R23) */
function checkinOverallStatus(s) {
  if (s.completionPath === 'master_code_bypass') return 'bypass';
  if (s.selfie && s.selfie.reviewStatus === 'pending') return 'pending';
  if (s.selfie && s.selfie.reviewStatus === 'rejected') return 'rejected';
  if (s.completionPath === 'standard') return 'complete';
  return 'incomplete';
}

/* Badge รวมวิธีเช็คอิน + สถานะ — แทน ROSTER_METHOD_BADGE/methodBadge เดิมที่ใช้ method string เดียว */
function checkinStatusBadge(s) {
  const parts = [];
  if (s.gps) parts.push('GPS');
  if (s.selfie) parts.push('Selfie');
  if (s.masterCode) parts.push('Master Code');
  const label = parts.join(' + ') || '—';
  const st = checkinOverallStatus(s);
  if (st === 'bypass') return statusBadge('info', `${label} (บายพาส)`);
  if (st === 'pending') return statusBadge('pending', `${label} · รอตรวจ`);
  if (st === 'rejected') return statusBadge('rejected', `${label} · ถูกปฏิเสธ`);
  if (st === 'complete') return statusBadge('ready', `${label} · สำเร็จ`);
  return statusBadge('mismatch', `${label} · ไม่ครบ`);
}

/* state ต่อ key — reset ได้ด้วยการลบ localStorage */
// proofs ใช้ shape-check: reseed ข้อมูลโครงสร้างเก่า (ก่อนรื้อ OCR) แต่คงหลักฐานรูปแบบใหม่ที่นักศึกษาเพิ่งส่งไว้ (flow เดโม ส่ง→ตรวจ)
const isValidProof = (p) => p && typeof p.submissionMethod === 'string' && (Array.isArray(p.items) || Array.isArray(p.rosterEntries));

const RegDB = {
  events: Store.get('events', DEFAULT_EVENTS),
  students: Store.get('students', DEFAULT_STUDENTS),
  proofs: Store.getSeeded('proofs', DEFAULT_PROOFS, { isValidShape: isValidProof }),
  ledger: Store.get('ledger', DEFAULT_LEDGER),
  cycles: Store.get('cycles', DEFAULT_CYCLES),
  rosters: Store.get('rosters', DEFAULT_ROSTERS),
  // FR-C14: ยอดสะสมของปีการศึกษาก่อนหน้าต้องถูก archive (เก็บ snapshot จริง) ไม่ใช่แค่ metadata
  // โครงสร้าง: { [year]: [ ...deep copy ของ ledger ตอนปิดรอบปีนั้น ] }
  archivedLedgers: Store.get('archived-ledgers', {}),
  save() {
    Store.set('events', this.events);
    Store.set('students', this.students);
    Store.set('proofs', this.proofs);
    Store.set('ledger', this.ledger);
    Store.set('cycles', this.cycles);
    Store.set('rosters', this.rosters);
    Store.set('archived-ledgers', this.archivedLedgers);
  },
};

/* Audit log กลาง — admin-audit.html อ่านคีย์เดียวกัน */
function appendAudit(action, detail, actor = 'registrar.sombat') {
  const logs = Store.get('audit-extra', []);
  logs.unshift({ time: new Date().toISOString().slice(0, 16).replace('T', ' '), user: actor, action, detail, role: 'registrar' });
  Store.set('audit-extra', logs);
}

/* validate รหัสนักศึกษา: ตัวเลขล้วน 11 หลัก (FR-A, AGENTS.md §8.1) */
function isValidStudentCode(code) { return /^\d{11}$/.test(code); }

/* ---------------- Screen 1: Export Excel --------------------------------- */
const EXCEL_TEMPLATE_KEY = 'excel-template';
const DEFAULT_EXCEL_TEMPLATE = {
  fileName: 'UBU_SAC_Default_Template.xlsx',
  uploadedAt: '2026-07-01 10:30',
  columns: ['รหัสนักศึกษา', 'ชื่อ', 'นามสกุล', 'หน่วยกิต']
};

function initExportPage() {
  const t = Store.get(EXCEL_TEMPLATE_KEY, DEFAULT_EXCEL_TEMPLATE);

  const activeNameEl = document.getElementById('active-template-name');
  const activeColumnsEl = document.getElementById('active-template-columns');
  if (activeNameEl) activeNameEl.textContent = t.fileName;
  if (activeColumnsEl) activeColumnsEl.textContent = t.columns.join(', ');

  const sel = document.getElementById('export-event');
  sel.innerHTML = RegDB.events.map((e) => `<option value="${e.id}">${e.name} (${thDate(e.date)})</option>`).join('');
  sel.addEventListener('change', renderExportTable);
  document.getElementById('export-search').addEventListener('input', renderExportTable);
  renderExportTable();

  document.getElementById('btn-export').addEventListener('click', attemptExport);

  document.getElementById('btn-confirm-import').addEventListener('click', () => {
    const ev = currentExportEvent();
    if (ev.exportStatus !== 'exported') return;
    showConfirmDialog({
      title: 'ยืนยันนำเข้า UBU SAC สำเร็จ',
      message: `กิจกรรม "${ev.name}"`,
      bullets: ev.open ? [
        'บันทึกสถานะว่ารายชื่อชุดนี้ถูกนำเข้าระบบ UBU SAC เรียบร้อยแล้ว',
        'หน่วยกิตกิจกรรมเปิดกว้างของนักศึกษาที่เกี่ยวข้องจะถูกบวกเข้ายอดสะสม 12 หน่วย/ปีการศึกษา ณ จุดนี้ (ไม่ใช่ตอนอนุมัติหลักฐาน)',
        'ระบบจะแจ้งเตือนนักศึกษาที่เกี่ยวข้องว่าชั่วโมงเข้าระบบแล้ว',
        'การกระทำนี้ถูกบันทึกลง Audit Log',
      ] : [
        'บันทึกสถานะว่ารายชื่อชุดนี้ถูกนำเข้าระบบ UBU SAC เรียบร้อยแล้ว',
        'ระบบจะแจ้งเตือนนักศึกษาที่เกี่ยวข้องว่าชั่วโมงเข้าระบบแล้ว',
        'การกระทำนี้ถูกบันทึกลง Audit Log',
      ],
      confirmText: 'ยืนยันนำเข้าแล้ว',
      onConfirm: () => {
        ev.exportStatus = 'confirmed';
        let creditedCount = 0;
        if (ev.open) {
          const roster = RegDB.rosters[ev.id];
          if (roster) {
            roster.students.forEach((row) => {
              let ledgerRow = RegDB.ledger.find((l) => l.code === row.code);
              if (!ledgerRow) { ledgerRow = { code: row.code, name: row.name, units: 0, locked: false }; RegDB.ledger.push(ledgerRow); }
              ledgerRow.units = Math.min(QUOTA_MAX, ledgerRow.units + (row.units || 0));
              if (ledgerRow.units >= QUOTA_MAX) ledgerRow.locked = true;
              creditedCount++;
            });
          }
        }
        RegDB.save();
        appendAudit('sac_import_confirmed', `ยืนยันนำเข้า UBU SAC กิจกรรม "${ev.name}"${ev.open ? ` — บวกหน่วยกิตกิจกรรมเปิดกว้างให้ ${creditedCount} คน` : ''}`);
        showToast('บันทึกสถานะนำเข้า UBU SAC สำเร็จ และแจ้งเตือนนักศึกษาแล้ว');
        renderExportTable();
      },
    });
  });
}

function currentExportEvent() {
  const id = Number(document.getElementById('export-event').value);
  return RegDB.events.find((e) => e.id === id);
}

/* กิจกรรมเปิดกว้าง: รายชื่อที่ export ต้องมาจากรายชื่อลงทะเบียนจริงของกิจกรรมนั้น (RegDB.rosters — เช็คอิน + หลักฐานที่ Registrar อนุมัติแล้ว)
 * ไม่ใช่ RegDB.students ทั้งก้อนเหมือนกิจกรรมปกติ (กิจกรรมปกติยังคงพฤติกรรมเดิมไว้ก่อนตามที่ยืนยัน) */
function exportSourceStudents(ev) {
  if (!ev.open) return RegDB.students;
  const roster = RegDB.rosters[ev.id];
  if (!roster) return [];
  return roster.students.map((row) => {
    const parts = row.name.split(' ');
    return { code: row.code, first: parts[0] || row.name, last: parts.slice(1).join(' '), credits: row.units != null ? row.units : ev.credits };
  });
}

/* FR-A5 + UC-R1 <<include>> UC-R9: ปุ่ม Export ต้อง (1) บล็อกทั้งหมดถ้ามีรหัสผิด
 * (2) บังคับผ่านการตรวจสอบ/ล็อกหน่วยกิตกิจกรรมเปิดกว้างของปีปัจจุบันก่อนเสมอ */
function attemptExport() {
  const ev = currentExportEvent();
  const invalid = exportSourceStudents(ev).filter((s) => !isValidStudentCode(s.code));

  if (invalid.length) {
    showConfirmDialog({
      title: 'ไม่สามารถ Export ได้ — พบรหัสนักศึกษาไม่ถูกต้อง',
      tone: 'danger',
      cancelText: 'ปิด',
      confirmText: 'รับทราบ',
      bullets: [
        `พบ ${invalid.length} รายชื่อที่รหัสนักศึกษาไม่ผ่านเงื่อนไข (ต้องเป็นตัวเลข 11 หลัก): ${invalid.map((s) => `${s.code || '(ว่าง)'} (${s.first} ${s.last})`).join(', ')}`,
        'ระบบจะ<strong>ไม่สร้างไฟล์ Excel</strong>จนกว่าจะแก้ไขรหัสนักศึกษาให้ถูกต้องครบทุกคน (FR-A5)',
        'แก้ไขรหัสนักศึกษาที่ผิดในตารางด้านล่าง แล้วกด Export อีกครั้ง',
      ],
    });
    return; // บล็อกทั้งหมด — ไม่สร้างไฟล์แม้แต่ของคนที่รหัสถูกต้อง
  }

  const currentCycleYear = RegDB.cycles[0].year;
  const lockRunYear = Store.get('quota-lock-run-year', null);
  if (lockRunYear !== currentCycleYear) {
    showConfirmDialog({
      title: 'ต้องตรวจสอบ/ล็อกหน่วยกิตก่อน Export',
      tone: 'warning',
      confirmText: 'ตรวจสอบ/ล็อก แล้ว Export ต่อ',
      bullets: [
        'ตาม Use Case Diagram: "Export Excel" (UC-R1) รวมขั้นตอน "ตรวจสอบ/ล็อกหน่วยกิตกิจกรรมเปิดกว้าง" (UC-R9) แบบ &lt;&lt;include&gt;&gt; เสมอ',
        `ปีการศึกษา ${currentCycleYear} ยังไม่เคยรันการตรวจสอบ/ล็อกโควต้ารอบนี้`,
        'กดยืนยันเพื่อให้ระบบรันการตรวจสอบ/ล็อกให้อัตโนมัติก่อน แล้วจึงสร้างไฟล์ Excel ต่อทันที',
      ],
      onConfirm: () => {
        const n = performQuotaLock();
        showToast(n ? `ตรวจสอบ/ล็อกโควต้าอัตโนมัติ ${n} คนก่อน Export แล้ว` : 'ตรวจสอบโควต้าแล้ว ไม่มีรายชื่อต้องล็อกเพิ่ม');
        doExportFile(ev);
      },
    });
    return;
  }

  doExportFile(ev);
}

function doExportFile(ev) {
  const currentT = Store.get(EXCEL_TEMPLATE_KEY, DEFAULT_EXCEL_TEMPLATE);
  // จำลองไฟล์ .xlsx ด้วย CSV ง่ายๆ โดย map คอลัมน์ตามหัวตารางในระบบ
  const rows = [currentT.columns];
  exportSourceStudents(ev).forEach((s) => {
    const row = currentT.columns.map((colName) => {
      const cleaned = colName.trim().toLowerCase();
      if (cleaned.includes('รหัส')) return s.code;
      if (cleaned.includes('นามสกุล') || cleaned.includes('สกุล')) return s.last;
      if (cleaned.includes('ชื่อ')) return s.first;
      if (cleaned.includes('หน่วยกิต') || cleaned.includes('ชั่วโมง') || cleaned.includes('ชม')) return s.credits;
      return '';
    });
    rows.push(row);
  });

  const blob = new Blob(['﻿' + rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `UBUSAC_export_${ev.id}.csv`;
  a.click();
  ev.exportStatus = ev.exportStatus === 'confirmed' ? 'confirmed' : 'exported';
  RegDB.save();
  appendAudit('sac_export', `Export Excel กิจกรรม "${ev.name}" (ใช้เทมเพลต: ${currentT.fileName}, ผ่านการตรวจสอบ/ล็อกโควต้าปี ${RegDB.cycles[0].year} แล้ว)`);
  showToast('สร้างไฟล์ Excel ตามฟอร์แมต UBU SAC แล้ว (จำลอง)');
  renderExportTable();
}

function renderExportTable() {
  const ev = currentExportEvent();
  const q = (document.getElementById('export-search').value || '').toLowerCase();
  const sourceStudents = exportSourceStudents(ev);
  const list = sourceStudents.filter((s) => (s.code + s.first + s.last).toLowerCase().includes(q));
  const t = Store.get(EXCEL_TEMPLATE_KEY, DEFAULT_EXCEL_TEMPLATE);

  // FR-A5: มีรหัสผิดรูปแบบอยู่ → ต้องบล็อก Export ทั้งหมด ไม่ใช่แค่ข้ามแถวที่ผิด
  const invalidStudents = sourceStudents.filter((s) => !isValidStudentCode(s.code));
  const blockBanner = document.getElementById('export-block-banner');
  const btnExport = document.getElementById('btn-export');
  if (blockBanner) {
    blockBanner.innerHTML = invalidStudents.length ? `
      <div class="border-l-4 border-red-400 bg-red-50 p-3 rounded-r-xl flex items-start gap-2.5 mb-4">
        <span class="text-red-600 mt-0.5">${icon('alert-triangle', 'w-4 h-4')}</span>
        <p class="text-xs text-red-800">
          พบ ${invalidStudents.length} รายชื่อที่รหัสนักศึกษาไม่ผ่านเงื่อนไข (ต้องเป็นตัวเลข 11 หลัก) —
          <strong>ระบบจะไม่สร้างไฟล์ Excel จนกว่าจะแก้ไขให้ถูกต้องครบทุกคน</strong> ตาม FR-A5
        </p>
      </div>` : '';
  }
  if (btnExport) {
    btnExport.disabled = invalidStudents.length > 0;
    btnExport.classList.toggle('opacity-50', invalidStudents.length > 0);
    btnExport.classList.toggle('cursor-not-allowed', invalidStudents.length > 0);
  }

  // แถบสถานะ 3 ขั้น
  const statusMap = {
    none: statusBadge('pending', 'ยังไม่ Export'),
    exported: statusBadge('info', 'Export แล้ว — รอยืนยันนำเข้า'),
    confirmed: statusBadge('imported', 'นำเข้า UBU SAC แล้ว'),
  };
  document.getElementById('export-status').innerHTML = statusMap[ev.exportStatus];
  const btnConfirm = document.getElementById('btn-confirm-import');
  btnConfirm.disabled = ev.exportStatus !== 'exported';
  btnConfirm.className = ev.exportStatus === 'exported'
    ? 'w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-green-700 text-white font-medium rounded-xl hover:bg-green-800 transition shadow-lg shadow-green-700/20'
    : 'w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-200 text-slate-400 font-medium rounded-xl cursor-not-allowed';

  document.getElementById('export-table').innerHTML = list.length ? `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        ${t.columns.map(col => `<th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">${col}</th>`).join('')}
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">รหัสถูกต้อง</th>
        <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ดำเนินการ</th>
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map((s) => {
    const ok = isValidStudentCode(s.code);
    return `<tr class="hover:bg-slate-50/50 transition ${ok ? '' : 'bg-red-50/40'}">
            ${t.columns.map(col => {
      const cleaned = col.trim().toLowerCase();
      let val = '';
      let cls = 'text-left';
      if (cleaned.includes('รหัส')) {
        val = s.code;
        cls = `text-left font-mono ${ok ? 'text-slate-800' : 'text-red-600 font-semibold'}`;
      }
      else if (cleaned.includes('นามสกุล') || cleaned.includes('สกุล')) { val = s.last; }
      else if (cleaned.includes('ชื่อ')) { val = s.first; }
      else if (cleaned.includes('หน่วยกิต') || cleaned.includes('ชั่วโมง') || cleaned.includes('ชม')) {
        val = s.credits.toFixed(1);
        cls = 'text-center font-mono text-slate-800';
      }
      return `<td class="px-4 py-3 text-sm ${cls}">${val}</td>`;
    }).join('')}
            <td class="px-4 py-3 text-center">${ok ? statusBadge('ready', 'ผ่าน') : statusBadge('rejected', 'ไม่ผ่าน (ต้องเป็นเลข 11 หลัก)')}</td>
            <td class="px-4 py-3 text-right">
              ${ev.open ? '' : `<button onclick="openAdjustDialog(['${s.code}'])" class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">${icon('edit', 'w-4 h-4')} แก้ไข</button>`}
            </td>
          </tr>`;
  }).join('')}
      </tbody>
    </table>` : emptyState('ไม่พบรายชื่อที่ค้นหา');
  document.getElementById('export-count').textContent = `${list.filter((s) => isValidStudentCode(s.code)).length}/${list.length} รายชื่อพร้อม export`;
}

/* ---------------- Screen 2: แก้ไขหน่วยกิตรายบุคคล ------------------------- */
const adjustSelection = new Set();

function initAdjustPage() {
  document.getElementById('adjust-search').addEventListener('input', renderAdjustTable);
  renderAdjustTable();
  document.getElementById('btn-bulk-adjust').addEventListener('click', () => {
    if (!adjustSelection.size) return;
    openAdjustDialog([...adjustSelection]);
  });
}

function renderAdjustTable() {
  const q = (document.getElementById('adjust-search').value || '').toLowerCase();
  const list = RegDB.students.filter((s) => (s.code + s.first + s.last).toLowerCase().includes(q));
  const dayHead = ['วันที่ 1', 'วันที่ 2', 'วันที่ 3'];

  document.getElementById('adjust-table').innerHTML = `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        <th class="px-4 py-3"><input type="checkbox" id="adjust-all" class="rounded border-slate-300" aria-label="เลือกทั้งหมด"></th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">รหัสนักศึกษา</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
        ${dayHead.map((d) => `<th class="text-center px-2 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">${d}</th>`).join('')}
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">หน่วยกิต</th>
        <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ดำเนินการ</th>
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map((s) => `
          <tr class="hover:bg-slate-50/50 transition">
            <td class="px-4 py-3 text-center"><input type="checkbox" data-code="${s.code}" class="adjust-check rounded border-slate-300" ${adjustSelection.has(s.code) ? 'checked' : ''} aria-label="เลือก ${s.first}"></td>
            <td class="px-4 py-3 text-sm font-mono text-slate-800">${s.code}</td>
            <td class="px-4 py-3 text-sm text-slate-800">${s.first} ${s.last}</td>
            ${s.attend.map((a) => `<td class="px-2 py-3 text-center">${a
    ? `<span class="inline-flex text-emerald-600">${icon('check-circle', 'w-4 h-4')}</span>`
    : `<span class="inline-flex text-red-400">${icon('x-circle', 'w-4 h-4')}</span>`}</td>`).join('')}
            <td class="px-4 py-3 text-sm text-center font-mono font-semibold text-slate-900">${s.credits.toFixed(1)}</td>
            <td class="px-4 py-3 text-right">
              <button onclick="openAdjustDialog(['${s.code}'])" class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">${icon('edit', 'w-4 h-4')} แก้ไข</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;

  document.querySelectorAll('.adjust-check').forEach((cb) => cb.addEventListener('change', (e) => {
    e.target.checked ? adjustSelection.add(e.target.dataset.code) : adjustSelection.delete(e.target.dataset.code);
    updateBulkBar();
  }));
  const all = document.getElementById('adjust-all');
  if (all) all.addEventListener('change', (e) => {
    adjustSelection.clear();
    if (e.target.checked) list.forEach((s) => adjustSelection.add(s.code));
    renderAdjustTable();
    updateBulkBar();
  });
  updateBulkBar();
}

function updateBulkBar() {
  const n = adjustSelection.size;
  const bar = document.getElementById('bulk-bar');
  bar.classList.toggle('hidden', n === 0);
  document.getElementById('bulk-count').textContent = n;
}

function openAdjustDialog(codes) {
  const names = codes.map((c) => {
    const s = RegDB.students.find((x) => x.code === c);
    return s ? `${s.first} ${s.last}` : c;
  });
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[55] p-4';
  overlay.innerHTML = `
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
      <h3 class="text-lg font-semibold text-slate-900">แก้ไขหน่วยกิต (${codes.length} คน)</h3>
      <p class="text-sm text-slate-500">${names.slice(0, 3).join(', ')}${names.length > 3 ? ` และอีก ${names.length - 3} คน` : ''}</p>
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-slate-700" for="adj-credits">หน่วยกิตใหม่</label>
        <input id="adj-credits" type="number" step="0.5" min="0" max="6" value="${(() => { const s0 = RegDB.students.find((x) => x.code === codes[0]); return s0 ? s0.credits.toFixed(1) : '2.0'; })()}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-slate-700" for="adj-reason">เหตุผลที่แก้ไข <span class="text-red-500">*</span></label>
        <textarea id="adj-reason" rows="2" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600" placeholder="เช่น มาช่วยงานเพิ่มช่วงบ่ายวันสุดท้าย"></textarea>
        <p id="adj-reason-err" class="hidden text-xs text-red-600">ต้องกรอกเหตุผลก่อนบันทึก (ผูกกับ Audit Log)</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button id="adj-cancel" class="flex-1 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition">ยกเลิก</button>
        <button id="adj-save" class="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-600/20">บันทึก</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#adj-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#adj-save').addEventListener('click', () => {
    const reason = overlay.querySelector('#adj-reason').value.trim();
    if (!reason) {
      overlay.querySelector('#adj-reason-err').classList.remove('hidden');
      return;
    }
    const val = parseFloat(overlay.querySelector('#adj-credits').value) || 0;
    codes.forEach((c) => {
      const s = RegDB.students.find((x) => x.code === c);
      if (s) {
        appendAudit('credit_adjusted', `แก้หน่วยกิต ${s.first} ${s.last} ${s.credits} -> ${val} เหตุผล: ${reason}`);
        s.credits = val;
      }
    });
    RegDB.save();
    adjustSelection.clear();
    overlay.remove();
    showToast(`บันทึกหน่วยกิตใหม่ ${codes.length} คน พร้อมเหตุผลลง Audit Log แล้ว`);
    if (document.getElementById('adjust-table')) renderAdjustTable();
    if (document.getElementById('export-table')) renderExportTable();
  });
}

/* ---------------- Screen 3: สร้าง/แก้ไขกิจกรรม ---------------------------- */
function initEventFormPage() {
  const gpsToggle = document.getElementById('ev-gps');
  const gpsFields = document.getElementById('gps-fields');
  gpsToggle.addEventListener('change', () => gpsFields.classList.toggle('hidden', !gpsToggle.checked));

  // Feature: กิจกรรมเปิดกว้างเลือกได้ว่ารับหลักฐานแบบไหนบ้าง (individual/project)
  const openToggle = document.getElementById('ev-open');
  const acceptDocTypesBox = document.getElementById('ev-accept-doctypes');
  if (openToggle && acceptDocTypesBox) {
    openToggle.addEventListener('change', () => acceptDocTypesBox.classList.toggle('hidden', !openToggle.checked));
  }

  const radius = document.getElementById('ev-radius');
  const radiusVal = document.getElementById('ev-radius-val');
  const circle = document.getElementById('geofence-circle');
  const syncRadius = () => {
    radiusVal.textContent = radius.value;
    const px = 30 + (radius.value / 100) * 130;
    circle.style.width = px + 'px';
    circle.style.height = px + 'px';
  };
  radius.addEventListener('input', syncRadius);
  syncRadius();

  // คลิกบนแผนที่จำลอง = ปักหมุด
  const map = document.getElementById('mock-map');
  map.addEventListener('click', (e) => {
    const rect = map.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const pin = document.getElementById('map-pin');
    pin.style.left = x + '%';
    pin.style.top = y + '%';
    circle.style.left = x + '%';
    circle.style.top = y + '%';
    // แปลงตำแหน่งเป็นพิกัดจำลองรอบตึก SC18
    document.getElementById('ev-lat').value = (15.1150 + (100 - y) * 0.00012).toFixed(6);
    document.getElementById('ev-lng').value = (104.9020 + x * 0.00015).toFixed(6);
  });

  // อัปโหลดและแสดงตัวอย่างรูปภาพกิจกรรม
  const dropzone = document.getElementById('ev-image-dropzone');
  const fileInput = document.getElementById('ev-image-file');
  const previewWrap = document.getElementById('ev-image-preview-wrap');
  const previewImg = document.getElementById('ev-image-preview');
  const placeholder = document.getElementById('ev-image-placeholder');
  const removeBtn = document.getElementById('ev-image-remove');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      if (e.target.closest('#ev-image-remove') || e.target.closest('#ev-image-preview-wrap')) return;
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          previewWrap.classList.remove('hidden');
          placeholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.value = '';
      previewImg.src = '';
      previewWrap.classList.add('hidden');
      placeholder.classList.remove('hidden');
    });
  }

  const clearImage = () => {
    if (fileInput) fileInput.value = '';
    if (previewImg) previewImg.src = '';
    if (previewWrap) previewWrap.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');
  };

  // Screen 3 + Feature 1: แต่งตั้งสตาฟหน้างานได้หลายคน + จำกัดจำนวนสูงสุดต่อกิจกรรม (chip picker)
  let formStaffIds = [];
  const staffLimitInput = document.getElementById('ev-staff-limit');
  const staffAddSelect = document.getElementById('ev-staff-add');
  const refreshStaffChips = () => renderStaffChips('ev-staff-chips', staffAddSelect, formStaffIds, Number(staffLimitInput.value) || 3);
  if (staffAddSelect && staffLimitInput) {
    refreshStaffChips();
    staffAddSelect.addEventListener('change', () => {
      if (staffAddSelect.value) {
        formStaffIds.push(Number(staffAddSelect.value));
        refreshStaffChips();
      }
    });
    staffLimitInput.addEventListener('input', refreshStaffChips);
  }

  document.getElementById('event-form').addEventListener('reset', () => {
    clearImage();
    gpsFields.classList.add('hidden');
    if (acceptDocTypesBox) acceptDocTypesBox.classList.add('hidden');
    formStaffIds = [];
    refreshStaffChips();
  });

  document.getElementById('event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // UC-R3 exception: กรอกฟิลด์บังคับไม่ครบหรือวันที่/ตัวเลขคลาดเคลื่อน -> แสดงข้อผิดพลาดและระงับการบันทึกทั้งหมด
    const name = document.getElementById('ev-name').value.trim();
    const dateVal = document.getElementById('ev-date').value;
    const daysVal = Number(document.getElementById('ev-days').value);
    const creditsVal = parseFloat(document.getElementById('ev-credits').value);
    const gpsEnabled = gpsToggle.checked;
    const latVal = parseFloat(document.getElementById('ev-lat').value);
    const lngVal = parseFloat(document.getElementById('ev-lng').value);
    const radiusVal = Number(radius.value);
    const openEnabled = document.getElementById('ev-open').checked;
    const acceptIndividual = document.getElementById('ev-accept-individual').checked;
    const acceptProject = document.getElementById('ev-accept-project').checked;

    const errors = [];
    if (!name) errors.push('กรุณากรอกชื่อกิจกรรม');
    if (!dateVal) errors.push('กรุณาเลือกวันที่จัดกิจกรรม');
    if (!Number.isFinite(daysVal) || daysVal < 1) errors.push('จำนวนวันจัดกิจกรรมต้องเป็นตัวเลขตั้งแต่ 1 วันขึ้นไป');
    if (!Number.isFinite(creditsVal) || creditsVal <= 0) errors.push('หน่วยกิตที่ได้รับต้องมากกว่า 0');
    if (gpsEnabled) {
      if (!Number.isFinite(latVal) || !Number.isFinite(lngVal)) errors.push('เปิดใช้ GPS แล้วต้องปักหมุดพิกัดบนแผนที่ก่อนบันทึก');
      if (!Number.isFinite(radiusVal) || radiusVal <= 0) errors.push('รัศมี geofencing ต้องมากกว่า 0 เมตร');
    }
    if (openEnabled && !acceptIndividual && !acceptProject) {
      errors.push('กิจกรรมเปิดกว้างต้องเลือกรับหลักฐานอย่างน้อย 1 แบบ (รายบุคคล หรือ ระดับโครงการ)');
    }
    const staffLimit = Number(staffLimitInput.value) || 3;
    if (formStaffIds.length > staffLimit) {
      errors.push(`มีสตาฟที่เพิ่มไว้ (${formStaffIds.length} คน) เกินจำนวนจำกัด (${staffLimit} คน) — กรุณาลบออกหรือเพิ่มจำนวนจำกัด`);
    }
    if (errors.length) {
      showConfirmDialog({
        title: 'ไม่สามารถบันทึกกิจกรรมได้ — ข้อมูลไม่ครบถ้วน',
        tone: 'danger',
        cancelText: 'ปิด',
        confirmText: 'รับทราบ',
        bullets: errors,
      });
      return; // ระงับการบันทึกทั้งหมดจนกว่าจะแก้ไขครบ
    }

    const open = openEnabled;
    const acceptedDocTypes = open ? [...(acceptIndividual ? ['individual'] : []), ...(acceptProject ? ['project'] : [])] : [];
    const objectives = document.getElementById('ev-objectives').value.trim();
    const description = document.getElementById('ev-desc').value.trim();
    const schedule = document.getElementById('ev-schedule').value.trim();
    const subcategory = document.getElementById('ev-subcat').value;
    const eligible_participants = document.getElementById('ev-target').value.trim();
    const location = document.getElementById('ev-location').value.trim();
    const registration_deadline = document.getElementById('ev-deadline').value;
    const contact_info = document.getElementById('ev-contact').value.trim();
    const image_url = previewImg && previewImg.src ? previewImg.src : null;

    const selfie = document.getElementById('ev-selfie').checked;
    const masterCode = document.getElementById('ev-code').checked;

    RegDB.events.unshift({
      id: Date.now(),
      name,
      date: dateVal,
      days: daysVal,
      credits: creditsVal,
      open,
      acceptedDocTypes,
      gps: gpsEnabled,
      lat: gpsEnabled ? latVal : null,
      lng: gpsEnabled ? lngVal : null,
      radius: radiusVal,
      selfie,
      masterCode,
      staffIds: formStaffIds.slice(),
      staffLimit,
      participants: 0,
      checkedIn: 0,
      exportStatus: 'none',
      rosterOverdue: false,
      objectives,
      description,
      schedule,
      subcategory,
      eligible_participants,
      location,
      registration_deadline,
      contact_info,
      image_url,
    });
    RegDB.save();
    appendAudit('event_created', `สร้างกิจกรรม "${name}"${open ? ' (เปิดกว้าง)' : ''}`);
    showToast(`บันทึกกิจกรรม "${name}" แล้ว${open ? ' — ติดธงกิจกรรมเปิดกว้าง' : ''}`);
    renderRecentEvents();
    e.target.reset();
    clearImage();
    gpsFields.classList.add('hidden');
    formStaffIds = [];
    refreshStaffChips();
  });
  renderRecentEvents();
}

function renderRecentEvents() {
  const box = document.getElementById('recent-events');
  if (!box) return;
  box.innerHTML = RegDB.events.slice(0, 5).map((ev) => {
    const imgHtml = ev.image_url
      ? `<img src="${ev.image_url}" class="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-100">`
      : `<div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">${ev.name.charAt(0)}</div>`;
    const subcatBadge = ev.subcategory ? `<span class="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-100 shrink-0 font-medium">${ev.subcategory}</span>` : '';
    const targetBadge = ev.eligible_participants ? `<span class="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded shrink-0">${ev.eligible_participants}</span>` : '';
    return `
      <div class="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 transition">
        <div class="flex items-start gap-3 min-w-0 flex-1">
          ${imgHtml}
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-slate-800 truncate" title="${ev.name}">${ev.name}</p>
            <p class="text-xs text-slate-400 mt-0.5">${thDate(ev.date)} • ${ev.credits} หน่วยกิต • ${ev.days} วัน</p>
            <div class="flex flex-wrap items-center gap-1.5 mt-1">
              ${subcatBadge}
              ${targetBadge}
            </div>
            ${ev.objectives ? `<p class="text-[10px] text-slate-500 mt-1.5 line-clamp-2" title="${ev.objectives}"><strong>เป้าหมาย:</strong> ${ev.objectives}</p>` : ''}
          </div>
        </div>
        <div class="flex flex-col items-end gap-1.5 shrink-0">
          <div class="flex items-center gap-1">
            ${ev.open ? statusBadge('open', 'เปิดกว้าง') : ''}
            ${ev.gps ? `<span class="text-blue-500" title="เปิด GPS geofencing">${icon('map-pin', 'w-4 h-4')}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ---------------- Screen 4: ตรวจหลักฐานกิจกรรมเปิดกว้าง ------------------
 * FR-C4-C7, C19: logbook กรอกเอง (ไม่ใช้ OCR) — group_roster ใช้ OCR เฉพาะตารางรายชื่อ
 * คิวรอตรวจนับเป็นรายแถว/รายชื่อ (ไม่ใช่รายเอกสาร) อนุมัติ/ปฏิเสธแยกอิสระต่อกัน + คุมเพดาน 9 ชม./วัน (FR-C6) */
const DAILY_HOUR_CAP = 9;
let activeQueueKey = null; // "<proofId>:item:<rowIndex>" หรือ "<proofId>:roster:<rowIndex>"

function pendingProofs() {
  const rows = [];
  RegDB.proofs.forEach((p) => {
    (p.items || []).forEach((it) => { if (it.status === 'pending') rows.push({ key: `${p.id}:item:${it.rowIndex}`, proof: p, item: it }); });
    (p.rosterEntries || []).forEach((en) => { if (en.status === 'pending') rows.push({ key: `${p.id}:roster:${en.rowIndex}`, proof: p, entry: en }); });
  });
  return rows;
}

function findQueueRow(key) { return pendingProofs().find((r) => r.key === key) || null; }

/* จับคู่นักศึกษาอัตโนมัติจากรหัสที่ OCR อ่านได้ (ทำครั้งเดียวตอนโหลดหน้า เหมือน backend จับคู่ตอน ingest)
 * ถ้ารหัสไม่ตรงกับใครในระบบเลย matchedCode ยังเป็น null ให้ Registrar แก้ไขเอง (FR-C19) */
function autoMatchRosterEntries() {
  RegDB.proofs.forEach((p) => (p.rosterEntries || []).forEach((en) => {
    if (!en.matchedCode) {
      const hit = RegDB.students.find((s) => s.code === en.ocrStudentCode);
      if (hit) en.matchedCode = hit.code;
    }
  }));
}

/* เพดาน 9 ชม./วัน (FR-C6) รวมทุกแหล่งหน่วยกิตของนักศึกษาคนเดียวกันในระบบนี้:
 * off_campus_volunteer_proof_items + off_campus_volunteer_roster_entries ที่อนุมัติแล้ว
 * (mock นี้ยังไม่มีฟิลด์ชั่วโมงรายวันของเช็คอินกิจกรรมในมหาวิทยาลัย — ดูหมายเหตุใน AGENTS.md §5.2) */
function approvedHoursOnDate(code, date) {
  let total = 0;
  RegDB.proofs.forEach((p) => {
    (p.items || []).forEach((it) => { if (it.status === 'approved' && it.activityDate === date && p.submittedBy.code === code) total += it.approvedHours || 0; });
    (p.rosterEntries || []).forEach((en) => { if (en.status === 'approved' && p.groupActivity && p.groupActivity.date === date && en.matchedCode === code) total += en.approvedHours || 0; });
  });
  return total;
}
function remainingAllowance(code, date) { return Math.max(0, DAILY_HOUR_CAP - approvedHoursOnDate(code, date)); }
function defaultApprovedHours(code, date, reportedHours) { return Math.min(reportedHours, remainingAllowance(code, date)); }

function initOcrPage() {
  autoMatchRosterEntries();
  renderProofQueue();
  const first = pendingProofs()[0];
  if (first) selectQueueRow(first.key);
}

function renderProofQueue() {
  const list = pendingProofs();
  document.getElementById('queue-count').innerHTML = statusBadge('pending', `รอตรวจ ${list.length} รายการ`);
  document.getElementById('proof-queue').innerHTML = list.length ? list.map((r) => {
    const displayName = r.item ? r.proof.submittedBy.name : `${r.entry.ocrFirstName} ${r.entry.ocrLastName}`;
    const displaySub = r.item ? r.item.activityName : `รายชื่อกลุ่ม • ${r.proof.groupActivity.name}`;
    return `
    <button onclick="selectQueueRow('${r.key}')" class="w-full text-left px-4 py-3 hover:bg-slate-50 transition ${activeQueueKey === r.key ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}">
      <p class="text-sm font-medium text-slate-800 truncate">${displayName}</p>
      <p class="text-xs text-slate-400 truncate mt-0.5">${displaySub}</p>
      <p class="text-[10px] text-slate-300 mt-0.5 font-mono">ส่งเมื่อ ${thDate(r.proof.submittedAt)}</p>
    </button>`;
  }).join('') : emptyState('ไม่มีหลักฐานรอตรวจ', 'check-circle');
}

function selectQueueRow(key) {
  activeQueueKey = key;
  const row = findQueueRow(key);
  renderProofQueue();
  if (!row) return;
  document.getElementById('proof-detail').classList.remove('hidden');
  document.getElementById('proof-empty').classList.add('hidden');
  if (row.item) renderItemDetail(row); else renderRosterDetail(row);
}

function docThumb(label, filename) {
  return `
    <div class="mock-certificate rounded-xl p-4 text-center min-h-[120px] flex flex-col items-center justify-center gap-1">
      <p class="text-[9px] uppercase tracking-[0.2em] text-amber-700/60">${label}</p>
      <p class="text-xs text-slate-600 font-mono">${filename || '(ไม่มีไฟล์)'}</p>
    </div>`;
}

function bindDailyCapBox(code, date, reportedHours) {
  const remaining = remainingAllowance(code, date);
  document.getElementById('daily-cap-box').innerHTML = `
    <div class="border-l-4 border-sky-400 bg-sky-50 p-3 rounded-r-xl text-xs text-sky-700">
      คงเหลือโควตาวันนี้ (${date ? thDate(date) : '-'}): <strong>${remaining} ชม.</strong> จาก ${DAILY_HOUR_CAP} ชม./วัน (นับรวมทุกแหล่งในระบบที่อนุมัติแล้ว) — ชั่วโมงที่อนุมัติต้องไม่เกินยอดนี้
    </div>`;
  const approvedInput = document.getElementById('pf-approved-hours');
  if (approvedInput) {
    approvedInput.max = remaining;
    if (parseFloat(approvedInput.value) > remaining) approvedInput.value = remaining;
  }
}

/* -------- ตรวจแถวที่กรอกเอง (logbook) — ไม่มี OCR ----------- */
function renderItemDetail(row) {
  const { proof: p, item: it } = row;
  document.getElementById('proof-panel-title').textContent = 'ข้อมูลที่กรอกเอง — แก้ไขได้ก่อนอนุมัติ';
  document.getElementById('ocr-confidence').textContent = `แถวที่ ${it.rowIndex} • สมุดบันทึกจิตอาสา`;

  document.getElementById('proof-doc').innerHTML = `
    ${docThumb('หน้าปก', p.coverImage)}
    ${docThumb('หน้าตารางกิจกรรม', p.tableImage)}
    <div class="pt-2 border-t border-slate-100">
      <p class="text-xs text-slate-400">บัญชีผู้ส่ง (auto-fill จากบัญชี login)</p>
      <p class="text-sm font-semibold text-slate-800">${p.submittedBy.name} <span class="font-mono text-xs text-slate-400">(${p.submittedBy.code})</span></p>
    </div>
    <div>
      <p class="text-xs text-slate-400 mb-1.5">รูปทำกิจกรรมจริง (แถวนี้)</p>
      <div class="grid grid-cols-3 gap-1.5">${it.photos.map((f) => `<div class="mock-certificate rounded-lg h-16 flex items-center justify-center text-[9px] text-amber-700/60 px-1 text-center">${f}</div>`).join('')}</div>
    </div>`;

  document.getElementById('ocr-fields').innerHTML = `
    ${ocrRow('ชื่อโครงการ/กิจกรรม', `<input id="pf-title" value="${it.activityName}" class="ocr-input">`)}
    ${ocrRow('สถานที่', `<input id="pf-location" value="${it.location || ''}" class="ocr-input">`)}
    ${ocrRow('วันที่ทำกิจกรรม', `<input id="pf-date" type="date" value="${it.activityDate}" class="ocr-input">`)}
    ${ocrRow('จำนวนชั่วโมงที่แจ้ง', `<input id="pf-hours" type="number" value="${it.hours}" class="ocr-input font-mono w-24 text-right">`)}
    ${ocrRow('ผู้รับรอง', `<span class="text-sm font-semibold text-slate-800 text-right">${it.approverName}${it.approverPosition ? ' (' + it.approverPosition + ')' : ''}</span>`)}
    ${ocrRow('ชั่วโมงที่จะอนุมัติ', `<input id="pf-approved-hours" type="number" step="0.5" value="${defaultApprovedHours(p.submittedBy.code, it.activityDate, it.hours)}" class="ocr-input font-mono w-24 text-right text-emerald-700">`)}`;
  document.querySelectorAll('.ocr-input').forEach((el) => {
    el.className += ' text-sm font-semibold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none text-right';
  });

  bindDailyCapBox(p.submittedBy.code, it.activityDate, it.hours);

  document.getElementById('pf-title').addEventListener('input', (e) => { it.activityName = e.target.value; });
  document.getElementById('pf-location').addEventListener('input', (e) => { it.location = e.target.value; });
  document.getElementById('pf-date').addEventListener('input', (e) => { it.activityDate = e.target.value; bindDailyCapBox(p.submittedBy.code, it.activityDate, it.hours); });
  document.getElementById('pf-hours').addEventListener('input', (e) => { it.hours = parseFloat(e.target.value) || 0; bindDailyCapBox(p.submittedBy.code, it.activityDate, it.hours); });

  document.getElementById('mismatch-box').innerHTML = '';
  document.getElementById('btn-approve').disabled = false;
  document.getElementById('proof-panel-note').textContent = 'แก้ไขค่าที่กรอกผิดในช่องด้านบนได้เลย ก่อนกดอนุมัติ — การตัดสินใจทั้งหมดถูกบันทึกลง Audit Log';
}

/* -------- ตรวจรายชื่อกลุ่ม (group_roster) — OCR สกัด ต้องจับคู่ก่อนอนุมัติ ----------- */
function renderRosterDetail(row) {
  const { proof: p, entry: en } = row;
  document.getElementById('proof-panel-title').textContent = 'รายชื่อที่ OCR สกัดได้ — แก้ไขได้ก่อนอนุมัติ';
  document.getElementById('ocr-confidence').textContent = `แถวที่ ${en.rowIndex} • กิจกรรมกลุ่ม`;

  document.getElementById('proof-doc').innerHTML = `
    ${docThumb('แบบบันทึกการเข้าร่วมกิจกรรม (หน้าเอกสาร — ไม่มี OCR)', p.groupFormImage)}
    ${docThumb('รูปตารางรายชื่อ (OCR)', p.rosterImage)}
    <div class="pt-2 border-t border-slate-100 space-y-1">
      <p class="text-xs text-slate-400">กิจกรรมกลาง (ใช้ร่วมกันทุกคนในตาราง กรอกเองโดยผู้ส่ง ไม่ใช้ OCR)</p>
      <p class="text-sm font-semibold text-slate-800">${p.groupActivity.name}</p>
      <p class="text-xs text-slate-500">${p.groupActivity.location || '-'} • ${thDate(p.groupActivity.date)} • ${p.groupActivity.hours} ชม.</p>
      <p class="text-xs text-slate-500">ผู้รับรอง: ${p.groupActivity.approverName}${p.groupActivity.approverPosition ? ' (' + p.groupActivity.approverPosition + ')' : ''}</p>
      <p class="text-xs text-slate-400 pt-1">ส่งโดย ${p.submittedBy.name}</p>
    </div>`;

  document.getElementById('ocr-fields').innerHTML = `
    ${ocrRow('ชื่อ (OCR)', `<input id="pf-first" value="${en.ocrFirstName}" class="ocr-input">`)}
    ${ocrRow('นามสกุล (OCR)', `<input id="pf-last" value="${en.ocrLastName}" class="ocr-input">`)}
    ${ocrRow('รหัสนักศึกษา (OCR)', `<input id="pf-code" value="${en.ocrStudentCode}" class="ocr-input font-mono">`)}
    ${ocrRow('คณะ (OCR)', `<input id="pf-faculty" value="${en.ocrFaculty || ''}" class="ocr-input">`)}
    ${ocrRow('ลายมือชื่อ', en.signaturePresent ? statusBadge('ready', 'มีลายเซ็น') : statusBadge('rejected', 'ไม่พบลายเซ็น'))}
    ${ocrRow('ชั่วโมงที่จะอนุมัติ', `<input id="pf-approved-hours" type="number" step="0.5" value="${en.matchedCode ? defaultApprovedHours(en.matchedCode, p.groupActivity.date, p.groupActivity.hours) : 0}" class="ocr-input font-mono w-24 text-right text-emerald-700" ${en.matchedCode ? '' : 'disabled'}>`)}`;
  document.querySelectorAll('.ocr-input').forEach((el) => {
    el.className += ' text-sm font-semibold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none text-right';
  });

  ['pf-first', 'pf-last', 'pf-code', 'pf-faculty'].forEach((id) => {
    document.getElementById(id).addEventListener('input', () => {
      en.ocrFirstName = document.getElementById('pf-first').value;
      en.ocrLastName = document.getElementById('pf-last').value;
      en.ocrFaculty = document.getElementById('pf-faculty').value;
      en.ocrStudentCode = document.getElementById('pf-code').value.trim();
      const hit = RegDB.students.find((s) => s.code === en.ocrStudentCode);
      en.matchedCode = hit ? hit.code : null;
      renderRosterDetail(row);
    });
  });

  if (en.matchedCode) {
    const matched = RegDB.students.find((s) => s.code === en.matchedCode);
    bindDailyCapBox(en.matchedCode, p.groupActivity.date, p.groupActivity.hours);
    document.getElementById('mismatch-box').innerHTML = `
      <div class="border-l-4 border-emerald-400 bg-emerald-50 p-3 rounded-r-xl text-xs text-emerald-700">
        จับคู่กับนักศึกษาในระบบแล้ว: <strong>${matched.first} ${matched.last}</strong> (${matched.code})
      </div>`;
    document.getElementById('btn-approve').disabled = false;
    document.getElementById('proof-panel-note').textContent = 'แก้ไขข้อมูลที่ OCR อ่านผิดในช่องด้านบนได้เลย ก่อนกดอนุมัติ — การตัดสินใจทั้งหมดถูกบันทึกลง Audit Log';
  } else {
    document.getElementById('daily-cap-box').innerHTML = '';
    document.getElementById('mismatch-box').innerHTML = `
      <div class="border-l-4 border-amber-400 bg-amber-50 p-3 rounded-r-xl text-xs text-amber-800">
        ${icon('alert-triangle', 'w-4 h-4 inline -mt-0.5 mr-1')}<strong>ยังจับคู่นักศึกษาไม่ได้</strong> — รหัสนักศึกษา "${en.ocrStudentCode}" ไม่ตรงกับใครในระบบ กรุณาแก้ไขรหัสในช่องด้านบนให้ถูกต้องก่อนจึงจะอนุมัติได้
      </div>`;
    document.getElementById('btn-approve').disabled = true;
    document.getElementById('proof-panel-note').textContent = 'ต้องจับคู่นักศึกษาให้สำเร็จก่อน ปุ่มอนุมัติจึงจะใช้งานได้ (FR-C19)';
  }
}

function ocrRow(label, valueHtml) {
  return `<div class="flex justify-between items-center gap-3 p-3 bg-slate-50 rounded-xl">
    <span class="text-sm text-slate-500 shrink-0">${label}</span>${valueHtml}</div>`;
}

function matchedNameFor(code) {
  const s = RegDB.students.find((x) => x.code === code);
  return s ? `${s.first} ${s.last}` : code;
}

function decideProof(approve) {
  const row = findQueueRow(activeQueueKey);
  if (!row) return;
  const { proof: p, item: it, entry: en } = row;
  const isRoster = !!en;
  const target = isRoster ? en : it;
  if (approve && isRoster && !en.matchedCode) { showToast('ยังจับคู่นักศึกษาไม่ได้ ไม่สามารถอนุมัติได้', 'error'); return; }

  const code = isRoster ? en.matchedCode : p.submittedBy.code;
  const date = isRoster ? p.groupActivity.date : it.activityDate;
  const reportedHours = isRoster ? p.groupActivity.hours : it.hours;
  const label = isRoster ? `${en.ocrFirstName} ${en.ocrLastName}` : it.activityName;
  const remaining = remainingAllowance(code, date);
  const approvedInput = document.getElementById('pf-approved-hours');
  const approvedHours = approvedInput ? Math.min(parseFloat(approvedInput.value) || 0, remaining) : 0;

  showConfirmDialog({
    title: approve ? 'อนุมัติรายการนี้?' : 'ปฏิเสธรายการนี้?',
    message: approve ? `${label} — ${approvedHours.toFixed(1)} ชม. (${(approvedHours / 3).toFixed(1)} หน่วย)` : `${label} — ${reportedHours} ชม.`,
    bullets: approve
      ? ['บวกหน่วยกิตเข้ายอดสะสมของนักศึกษาทันที', `เพดาน ${DAILY_HOUR_CAP} ชม./วัน ถูกคุมไว้แล้ว (คงเหลือ ${remaining} ชม. ก่อนอนุมัติแถวนี้)`, 'บันทึกการอนุมัติลง Audit Log']
      : ['รายการนี้จะไม่ถูกนับหน่วยกิต', 'ระบบแจ้งเตือนผู้ส่งพร้อมเหตุผล', 'บันทึกการปฏิเสธลง Audit Log'],
    tone: approve ? 'warning' : 'danger',
    confirmText: approve ? 'อนุมัติ' : 'ปฏิเสธ',
    requireReason: !approve,
    reasonLabel: 'เหตุผลที่ปฏิเสธ (แจ้งผู้ส่ง)',
    onConfirm: (reason) => {
      target.status = approve ? 'approved' : 'rejected';
      if (approve) {
        target.approvedHours = approvedHours;
        const approvedCredits = approvedHours / 3;
        let led = RegDB.ledger.find((l) => l.code === code);
        if (!led) { led = { code, name: matchedNameFor(code), units: 0, locked: false }; RegDB.ledger.push(led); }
        led.units = Math.min(QUOTA_MAX, led.units + approvedCredits);
        led.locked = led.units >= QUOTA_MAX;
      } else {
        target.rejectionReason = reason;
      }
      RegDB.save();
      appendAudit(approve ? 'proof_approved' : 'proof_rejected', approve
        ? `อนุมัติ "${label}" (${code}) — ${approvedHours} ชม. (${(approvedHours / 3).toFixed(1)} หน่วย) เข้ายอดสะสมทันที`
        : `ปฏิเสธ "${label}"${reason ? ' เหตุผล: ' + reason : ''}`);
      showToast(approve ? `อนุมัติแล้ว — บวก ${(approvedHours / 3).toFixed(1)} หน่วยเข้ายอดสะสมแล้ว` : 'ปฏิเสธรายการและแจ้งผู้ส่งแล้ว', approve ? 'success' : 'warning');
      activeQueueKey = null;
      document.getElementById('proof-detail').classList.add('hidden');
      document.getElementById('proof-empty').classList.remove('hidden');
      const next = pendingProofs()[0];
      if (next) selectQueueRow(next.key); else renderProofQueue();
    },
  });
}

/* ---------------- Screen 5: ตรวจสอบ/ล็อกโควต้า --------------------------- */
/* ตรรกะการล็อกโควต้าจริง — ใช้ร่วมกันทั้งจากปุ่มในหน้า Quotas และจากขั้นตอน
 * <<include>> อัตโนมัติก่อน Export Excel (UC-R1 include UC-R9) */
function performQuotaLock() {
  const toLock = RegDB.ledger.filter((l) => l.units >= QUOTA_MAX && !l.locked);
  toLock.forEach((l) => { l.locked = true; });
  RegDB.save();
  Store.set('quota-lock-run-year', RegDB.cycles[0].year);
  Store.set('quota-lock-run-at', new Date().toISOString().slice(0, 16).replace('T', ' '));
  appendAudit('quota_locked', `ตรวจสอบ/ล็อกโควต้า — ล็อกเพิ่ม ${toLock.length} คน`);
  return toLock.length;
}

/* FR-C14: อ่าน ?year= จาก URL เพื่อดูยอดสะสม archive ของปีก่อนหน้าได้ (อ่านอย่างเดียว) */
function getViewedYear() {
  const param = new URLSearchParams(location.search).get('year');
  return param ? Number(param) : RegDB.cycles[0].year;
}
function isViewingCurrentYear() { return getViewedYear() === RegDB.cycles[0].year; }
function ledgerForViewedYear() {
  const year = getViewedYear();
  if (isViewingCurrentYear()) return RegDB.ledger;
  return RegDB.archivedLedgers[year] || [];
}

function initQuotasPage() {
  const year = getViewedYear();
  const readOnly = !isViewingCurrentYear();
  const banner = document.getElementById('quota-archive-banner');
  const btnLock = document.getElementById('btn-lock-check');

  if (banner) {
    banner.innerHTML = readOnly ? `
      <div class="border-l-4 border-blue-400 bg-blue-50 p-3 rounded-r-xl flex items-center justify-between gap-3 mb-4">
        <p class="text-xs text-blue-800 inline-flex items-center gap-2">${icon('file-text', 'w-4 h-4')} กำลังดูข้อมูล <strong>archive ปีการศึกษา ${year}</strong> (อ่านอย่างเดียว — แก้ไข/ล็อกโควต้าไม่ได้)</p>
        <a href="registrar-quotas.html" class="text-xs font-medium text-blue-700 hover:underline shrink-0">← กลับไปปีปัจจุบัน (${RegDB.cycles[0].year})</a>
      </div>` : '';
  }
  if (btnLock) {
    btnLock.classList.toggle('hidden', readOnly);
  }

  document.getElementById('quota-search').addEventListener('input', renderQuotaTable);
  renderQuotaTable();
  if (btnLock && !readOnly) {
    btnLock.addEventListener('click', () => {
      const toLock = RegDB.ledger.filter((l) => l.units >= QUOTA_MAX && !l.locked);
      showConfirmDialog({
        title: 'ตรวจสอบ/ล็อกหน่วยกิตกิจกรรมเปิดกว้าง',
        bullets: [
          `ตรวจยอดสะสมของนักศึกษาทุกคนในปีการศึกษา ${RegDB.cycles[0].year}`,
          toLock.length ? `ล็อกเพิ่ม ${toLock.length} คนที่ยอดถึง ${QUOTA_MAX} หน่วย` : 'ไม่มีรายชื่อใหม่ที่ต้องล็อกเพิ่ม',
          'สถานะล็อกจะหยุดนับหน่วยกิตกิจกรรมเปิดกว้างของคนนั้นในปีนี้',
          'ขั้นตอนนี้จะทำอัตโนมัติก่อน Export Excel เสมอด้วย (UC-R1 include UC-R9)',
        ],
        confirmText: 'ยืนยันตรวจสอบ/ล็อก',
        onConfirm: () => {
          const n = performQuotaLock();
          showToast(n ? `ล็อกโควต้าเพิ่ม ${n} คนแล้ว` : 'ตรวจสอบแล้ว ไม่มีรายชื่อที่ต้องล็อกเพิ่ม');
          renderQuotaTable();
        },
      });
    });
  }
}

function renderQuotaTable() {
  const year = getViewedYear();
  const readOnly = !isViewingCurrentYear();
  const source = ledgerForViewedYear();
  const q = (document.getElementById('quota-search').value || '').toLowerCase();
  const list = source.filter((l) => (l.code + l.name).toLowerCase().includes(q));
  const locked = source.filter((l) => l.locked).length;
  const cycleMeta = RegDB.cycles.find((c) => c.year === year) || RegDB.cycles[0];
  document.getElementById('quota-stats').innerHTML =
    statsCard('นักศึกษาทั้งหมด', source.length, `ในปีการศึกษา ${year}`)
    + statsCard('ครบโควต้า/ล็อกแล้ว', locked, 'คนที่ล็อกแล้ว', { valueCls: 'text-purple-600', icon: 'lock' })
    + statsCard('ใกล้ครบ (>=10)', source.filter((l) => !l.locked && l.units >= 10).length, 'ควรจับตา', { valueCls: 'text-amber-600' })
    + statsCard('ปีการศึกษา', String(year), readOnly ? 'ข้อมูล archive' : `เริ่ม ${thDate(cycleMeta.start)}`);

  document.getElementById('quota-table').innerHTML = list.length ? `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">รหัสนักศึกษา</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-64">ยอดสะสม (หน่วย)</th>
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</th>
        ${readOnly ? '' : '<th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ดำเนินการ</th>'}
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map((l) => {
    const pct = Math.min(100, (l.units / QUOTA_MAX) * 100);
    return `<tr class="hover:bg-slate-50/50 transition">
            <td class="px-4 py-3 text-sm font-mono text-slate-800">${l.code}</td>
            <td class="px-4 py-3 text-sm text-slate-800">${l.name}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full ${l.locked ? 'bg-purple-500' : 'bg-blue-600'}" style="width:${pct}%"></div>
                </div>
                <span class="text-sm font-mono font-semibold ${l.locked ? 'text-purple-700' : 'text-slate-800'}">${l.units.toFixed(1)}/${QUOTA_MAX}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-center">${l.locked ? statusBadge('locked', `ครบแล้ว (${QUOTA_MAX}/${QUOTA_MAX})`) : statusBadge('info', 'สะสมได้อยู่')}</td>
            ${readOnly ? '' : `<td class="px-4 py-3 text-right">
              <button onclick="openLedgerAdjustDialog('${l.code}')" class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">${icon('edit', 'w-4 h-4')} แก้ไข</button>
            </td>`}
          </tr>`;
  }).join('')}
      </tbody>
    </table>` : emptyState('ไม่พบนักศึกษาที่ค้นหา');
}

function openLedgerAdjustDialog(code) {
  const l = RegDB.ledger.find((x) => x.code === code);
  if (!l) return;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[55] p-4';
  overlay.innerHTML = `
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
      <h3 class="text-lg font-semibold text-slate-900">แก้ไขยอดสะสมหน่วยกิต</h3>
      <p class="text-sm text-slate-500">${l.name} (${l.code})</p>
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-slate-700" for="ledger-units">ยอดสะสมใหม่ (หน่วย)</label>
        <input id="ledger-units" type="number" step="0.5" min="0" max="${QUOTA_MAX}" value="${l.units.toFixed(1)}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-slate-700" for="ledger-reason">เหตุผลที่แก้ไข <span class="text-red-500">*</span></label>
        <textarea id="ledger-reason" rows="2" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600" placeholder="เช่น แก้ไขยอดสะสมผิดพลาดจากการนับซ้ำ"></textarea>
        <p id="ledger-reason-err" class="hidden text-xs text-red-600">ต้องกรอกเหตุผลก่อนบันทึก (ผูกกับ Audit Log)</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button id="ledger-cancel" class="flex-1 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition">ยกเลิก</button>
        <button id="ledger-save" class="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-600/20">บันทึก</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#ledger-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#ledger-save').addEventListener('click', () => {
    const reason = overlay.querySelector('#ledger-reason').value.trim();
    if (!reason) {
      overlay.querySelector('#ledger-reason-err').classList.remove('hidden');
      return;
    }
    const val = Math.min(QUOTA_MAX, Math.max(0, parseFloat(overlay.querySelector('#ledger-units').value) || 0));
    appendAudit('credit_adjusted', `แก้ยอดสะสมหน่วยกิต ${l.name} ${l.units} -> ${val} เหตุผล: ${reason}`);
    l.units = val;
    l.locked = val >= QUOTA_MAX;
    RegDB.save();
    overlay.remove();
    showToast(`บันทึกยอดสะสมหน่วยกิตใหม่ของ ${l.name} แล้ว`);
    renderQuotaTable();
  });
}

/* ---------------- Screen 6: จัดการรอบปีการศึกษา --------------------------- */
function initCyclesPage() {
  renderCycles();
  document.getElementById('btn-new-cycle').addEventListener('click', () => {
    const dateVal = document.getElementById('cycle-date').value;
    if (!dateVal) { showToast('กรุณาเลือกวันที่เริ่มปีการศึกษาใหม่ก่อน', 'error'); return; }
    const newYear = RegDB.cycles[0].year + 1;
    showConfirmDialog({
      title: `ยืนยันเปิดรอบปีการศึกษา ${newYear}`,
      bullets: [
        'รีเซ็ตยอดสะสมกิจกรรมเปิดกว้างของนักศึกษาทุกคนเป็น 0',
        `ย้ายข้อมูลปี ${RegDB.cycles[0].year} ไปยังประวัติ (ยังเรียกดูย้อนหลังได้)`,
        `เริ่มนับหน่วยกิตใหม่สำหรับปีการศึกษา ${newYear} ตั้งแต่ ${thDate(dateVal)}`,
      ],
      tone: 'danger',
      confirmText: `ยืนยัน เปิดรอบปี ${newYear}`,
      onConfirm: () => {
        const oldYear = RegDB.cycles[0].year;
        // FR-C14: snapshot ยอดสะสมปีเก่าไว้ก่อนรีเซ็ต ห้ามลบทิ้ง/เขียนทับ
        RegDB.archivedLedgers[oldYear] = RegDB.ledger.map((l) => ({ ...l }));
        RegDB.cycles.unshift({ year: newYear, start: dateVal, by: 'พี่สมบัติ วงศ์ทะเบียน', at: new Date().toISOString().slice(0, 16).replace('T', ' ') });
        RegDB.ledger.forEach((l) => { l.units = 0; l.locked = false; });
        Store.remove('quota-lock-run-year'); // ปีใหม่ยังไม่เคยล็อกโควต้า
        RegDB.save();
        appendAudit('cycle_opened', `เปิดรอบปีการศึกษา ${newYear} (เริ่ม ${dateVal}) — archive ยอดสะสมปี ${oldYear} (${RegDB.archivedLedgers[oldYear].length} รายชื่อ) แล้วรีเซ็ตยอดสะสมทุกคนสำหรับปีใหม่`);
        showToast(`เปิดรอบปีการศึกษา ${newYear} แล้ว — ยอดสะสมปี ${oldYear} ถูก archive ไว้ครบ ${RegDB.archivedLedgers[oldYear].length} รายชื่อ`);
        renderCycles();
      },
    });
  });
}

function renderCycles() {
  const cur = RegDB.cycles[0];

  // FR-E2 (3/4) + FR-E6: ใกล้ถึงกำหนดควรเปิดรอบปีการศึกษาใหม่ -> เตือน Registrar ผ่าน Slack DM
  // หมายเหตุ: ของจริงรอบปีการศึกษาห่างกัน ~365 วัน และเตือนซ้ำทุกสัปดาห์ (ต้องมี scheduler ฝั่ง backend)
  // mock นิ่งจำลองด้วยธรณีประตู 30 วันแทน เพื่อให้เห็นกลไกทำงานจริงโดยไม่ต้องรอเป็นปี
  const daysSinceStart = Math.floor((Date.now() - new Date(cur.start).getTime()) / 86400000);
  if (daysSinceStart >= 30 && daysSinceStart < 400) {
    fireSlackDM('cycle_reminder', { year: cur.year, daysSinceStart });
  }

  document.getElementById('current-cycle').innerHTML = `
    <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">ปีการศึกษาปัจจุบัน</p>
    <p class="text-4xl font-bold font-mono text-slate-900 mt-1">${cur.year}</p>
    <p class="text-sm text-slate-500 mt-2 inline-flex items-center gap-1.5">${icon('calendar', 'w-4 h-4')} เริ่มรอบเมื่อ ${thDate(cur.start)}</p>`;
  document.getElementById('cycle-history').innerHTML = RegDB.cycles.map((c, i) => `
    <div class="flex items-center justify-between gap-3 px-4 py-3 ${i === 0 ? 'bg-blue-50/60' : ''}">
      <div>
        <p class="text-sm font-semibold text-slate-800 font-mono">ปีการศึกษา ${c.year} ${i === 0 ? statusBadge('ready', 'ปัจจุบัน') : ''}</p>
        <p class="text-xs text-slate-400 mt-0.5">เริ่ม ${thDate(c.start)} • เปิดรอบโดย ${c.by} (${c.at})</p>
      </div>
      ${i !== 0 ? `<a href="registrar-quotas.html?year=${c.year}" class="text-xs text-blue-600 hover:underline shrink-0">ดูยอดสะสม (archive)</a>` : ''}
    </div>`).join('');
}

/* ---------------- Screen 7: ตั้งค่าการแจ้งเตือน Slack --------------------- */
const SLACK_TOGGLES = [
  { key: 'proof', label: 'หลักฐานกิจกรรมเปิดกว้างรอตรวจ', desc: 'DM ทันทีเมื่อนักศึกษาส่งหลักฐานใหม่ และเตือนซ้ำถ้าค้างเกิน 2 วัน' },
  { key: 'roster', label: 'กิจกรรมที่ยังไม่ส่งรายชื่อ', desc: 'เตือนเมื่อจบกิจกรรมแล้ว 3 วันแต่ Lead Org ยังไม่ส่งรายชื่อ' },
  { key: 'cycle', label: 'ใกล้เปิดรอบปีการศึกษาใหม่', desc: 'เตือนรายสัปดาห์ช่วงเดือนพ.ค.-มิ.ย. ถ้ายังไม่เปิดรอบใหม่' },
];

function initSlackPage() {
  const settings = Store.get('slack-settings', { proof: true, roster: true, cycle: true, chatbot: true });
  const connected = Store.get('slack-connected', false);

  document.getElementById('slack-toggles').innerHTML = SLACK_TOGGLES.map((t) => `
    <label class="flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition cursor-pointer">
      <span>
        <span class="block text-sm font-medium text-slate-800">${t.label}</span>
        <span class="block text-xs text-slate-400 mt-0.5 leading-relaxed">${t.desc}</span>
      </span>
      <span class="relative inline-flex shrink-0 mt-0.5">
        <input type="checkbox" data-key="${t.key}" class="toggle-input sr-only" ${settings[t.key] ? 'checked' : ''}>
        <span class="toggle-track w-11 h-6 bg-slate-200 rounded-full transition-colors flex items-center px-0.5">
          <span class="toggle-thumb w-5 h-5 bg-white rounded-full shadow transition-transform"></span>
        </span>
      </span>
    </label>`).join('');

  document.querySelectorAll('.toggle-input').forEach((el) => el.addEventListener('change', (e) => {
    settings[e.target.dataset.key] = e.target.checked;
    Store.set('slack-settings', settings);
    showToast(`${e.target.checked ? 'เปิด' : 'ปิด'}การแจ้งเตือน "${SLACK_TOGGLES.find((t) => t.key === e.target.dataset.key).label}" แล้ว`, 'info');
  }));

  renderSlackConnection(connected);
  document.getElementById('btn-slack-connect').addEventListener('click', () => {
    if (Store.get('slack-connected', false)) return;
    // จำลอง OAuth popup
    showConfirmDialog({
      title: 'เชื่อมบัญชี Slack ของฉัน',
      message: 'Slack ขอสิทธิ์ส่งข้อความ DM ถึงคุณ (จำลองหน้า OAuth ของ Slack)',
      bullets: ['ระบบจะส่งแจ้งเตือนเข้า DM ส่วนตัวของคุณเท่านั้น ไม่มีการโพสต์ลง channel', 'ถอนการเชื่อมต่อได้ทุกเมื่อ'],
      confirmText: 'อนุญาต (Allow)',
      onConfirm: () => {
        Store.set('slack-connected', true);
        showToast('เชื่อมบัญชี Slack สำเร็จ — แจ้งเตือนจะส่งเข้า DM ของคุณ');
        renderSlackConnection(true);
      },
    });
  });
}

function renderSlackConnection(connected) {
  document.getElementById('slack-status').innerHTML = connected
    ? `<div class="flex items-center gap-2.5">${statusBadge('ready', 'เชื่อมต่อแล้ว')}<span class="text-sm text-slate-600">DM ไปที่ <span class="font-mono text-xs">@sombat.w</span> (Slack workspace คณะวิทย์)</span></div>`
    : `<div class="flex items-center gap-2.5">${statusBadge('pending', 'ยังไม่เชื่อมต่อ')}<span class="text-sm text-slate-500">เชื่อมบัญชีเพื่อรับแจ้งเตือนทาง DM ส่วนตัว</span></div>`;
  const btn = document.getElementById('btn-slack-connect');
  btn.textContent = connected ? 'เชื่อมต่อแล้ว' : 'เชื่อมบัญชี Slack ของฉัน';
  btn.className = connected
    ? 'inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-400 text-sm font-medium rounded-xl cursor-default'
    : 'inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-600/20';
  if (!connected) btn.insertAdjacentHTML('afterbegin', icon('slack', 'w-4 h-4'));
}

/* กันยิง Slack DM ซ้ำเกินจำเป็นภายใน session เดียวกัน (คนละ trigger คนละ flag) */
const slackFiredThisSession = new Set();
function fireSlackDM(type, detail) {
  if (slackFiredThisSession.has(type)) return;
  slackFiredThisSession.add(type);
  console.info('[MOCK Slack DM -> Registrar]', { type, ...detail, time: new Date().toISOString() });
}

/* ---------------- Registrar Home ----------------------------------------- */
function initRegistrarHome() {
  const pending = pendingProofs().length;
  const locked = RegDB.ledger.filter((l) => l.locked).length;
  const overdue = RegDB.events.filter((e) => e.rosterOverdue).length;

  // FR-E2 (2/4): กิจกรรมยังไม่ส่งรายชื่อเกิน 3 วัน -> แจ้งเตือน Registrar ผ่าน Slack DM (ยิงครั้งเดียวต่อ session ที่พบค้าง)
  if (overdue > 0) {
    fireSlackDM('roster_overdue', { count: overdue, events: RegDB.events.filter((e) => e.rosterOverdue).map((e) => e.name) });
  }

  document.getElementById('home-stats').innerHTML =
    statsCard('รอตรวจ', pending, 'หลักฐานรอการอนุมัติ', { valueCls: pending ? 'text-amber-600' : 'text-slate-900' })
    + statsCard('ครบโควต้า', locked, 'คนที่ล็อกแล้ว', { valueCls: 'text-purple-600', icon: 'lock' })
    + statsCard('ยังไม่ส่งรายชื่อ', overdue, 'เกิน 3 วันหลังจบงาน', { valueCls: overdue ? 'text-red-500' : 'text-slate-900' })
    + statsCard('ปีการศึกษา', RegDB.cycles[0].year, `เริ่ม ${thDate(RegDB.cycles[0].start)}`);

  const tasks = [
    { icon: 'file-text', text: `หลักฐานรอตรวจ (${pending} รายการ)`, href: 'registrar-verify-review.html', cta: 'ไปตรวจ' },
    { icon: 'alert-triangle', text: `กิจกรรมค้างส่งรายชื่อ (${overdue} รายการ)`, href: 'registrar-export.html', cta: 'ตามเรื่อง' },
    { icon: 'lock', text: `นักศึกษาใกล้ครบโควต้า (${RegDB.ledger.filter((l) => !l.locked && l.units >= 10).length} คน)`, href: 'registrar-quotas.html', cta: 'ตรวจสอบ' },
  ];
  document.getElementById('home-tasks').innerHTML = tasks.map((t) => `
    <a href="${t.href}" class="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-slate-50 transition group">
      <span class="flex items-center gap-3 min-w-0">
        <span class="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition shrink-0">${icon(t.icon, 'w-4 h-4')}</span>
        <span class="text-sm text-slate-700 truncate">${t.text}</span>
      </span>
      <span class="text-xs font-medium text-blue-600 inline-flex items-center gap-0.5 shrink-0">${t.cta}${icon('chevron-right', 'w-3.5 h-3.5')}</span>
    </a>`).join('');

  document.getElementById('home-notifs').innerHTML = (MOCK_NOTIFICATIONS.registrar || []).map((n) => `
    <div class="flex items-start gap-3 px-4 py-3">
      <span class="text-slate-400 mt-0.5 shrink-0">${icon(n.icon, 'w-4 h-4')}</span>
      <div class="min-w-0"><p class="text-sm text-slate-700 leading-snug">${n.text}</p>
      <p class="text-xs text-slate-400 mt-0.5">${n.time}</p></div>
    </div>`).join('');

  const quicks = [
    { icon: 'download', label: 'Export Excel', href: 'registrar-export.html' },
    { icon: 'lock', label: 'ตรวจสอบ/ล็อกโควต้า', href: 'registrar-quotas.html' },
    { icon: 'calendar', label: 'เปิดรอบปีการศึกษา', href: 'registrar-cycles.html' },
    { icon: 'plus', label: 'สร้างกิจกรรมใหม่', href: 'registrar-event-form.html' },
  ];
  document.getElementById('home-quick').innerHTML = quicks.map((qk) => `
    <a href="${qk.href}" class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition">
      ${icon(qk.icon, 'w-4 h-4')} ${qk.label}</a>`).join('');
}

/* ---------------- Screen: ตรวจสอบการเช็คอิน (UC-R23 / FR-B8) -------------- */
let crActiveEventId = null;
let crActiveCode = null;

function initCheckinReviewPage() {
  const sel = document.getElementById('cr-event');
  const eventIds = Object.keys(RegDB.rosters);
  sel.innerHTML += eventIds.map((id) => `<option value="${id}">${RegDB.rosters[id].name}</option>`).join('');
  sel.addEventListener('change', function () {
    crActiveEventId = this.value || null;
    crActiveCode = null;
    if (!crActiveEventId) {
      document.getElementById('cr-body').classList.add('hidden');
      document.getElementById('cr-empty-start').classList.remove('hidden');
      return;
    }
    document.getElementById('cr-body').classList.remove('hidden');
    document.getElementById('cr-empty-start').classList.add('hidden');
    renderCrQueue();
    const roster = RegDB.rosters[crActiveEventId];
    if (roster && roster.students.length) selectCrStudent(roster.students[0].code);
  });
}

function renderCrQueue() {
  const roster = RegDB.rosters[crActiveEventId];
  if (!roster) return;
  const pendingCount = roster.students.filter((s) => s.selfie && s.selfie.reviewStatus === 'pending').length;
  document.getElementById('cr-queue-count').innerHTML = pendingCount
    ? statusBadge('pending', `รอตรวจ ${pendingCount} คน`)
    : statusBadge('ready', `ครบแล้วทั้งหมด`);
  document.getElementById('cr-queue').innerHTML = roster.students.length ? roster.students.map((s) => `
    <button onclick="selectCrStudent('${s.code}')" class="w-full text-left px-4 py-3 hover:bg-slate-50 transition ${crActiveCode === s.code ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}">
      <p class="text-sm font-medium text-slate-800 truncate">${s.name}</p>
      <p class="text-xs text-slate-400 font-mono truncate mt-0.5">${s.code}</p>
      <div class="mt-1.5">${checkinStatusBadge(s)}</div>
    </button>`).join('') : emptyState('ยังไม่มีคนเช็คอินในกิจกรรมนี้', 'users');
}

function selectCrStudent(code) {
  crActiveCode = code;
  renderCrQueue();
  const roster = RegDB.rosters[crActiveEventId];
  const s = roster && roster.students.find((x) => x.code === code);
  if (s) renderCrDetail(s);
}

function renderCrDetail(s) {
  const blocks = [];

  blocks.push(`
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
      <div>
        <h3 class="text-base font-bold text-slate-800">${s.name}</h3>
        <p class="text-xs text-slate-400 font-mono mt-0.5">${s.code} • เริ่มเช็คอิน ${s.checkedInAt}</p>
      </div>
      ${checkinStatusBadge(s)}
    </div>`);

  if (s.gps) {
    blocks.push(`
      <div class="space-y-2">
        <h4 class="text-sm font-semibold text-slate-700 flex items-center gap-1.5">${icon('map-pin', 'w-4 h-4 text-blue-600')} พิกัด GPS</h4>
        <div class="mock-map rounded-xl h-32 relative">
          <div class="geofence-circle" style="left:50%; top:50%; width:64px; height:64px;"></div>
          <div class="absolute -translate-x-1/2 -translate-y-1/2" style="left:53%; top:47%;">
            <span class="block w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow"></span>
          </div>
        </div>
        <p class="text-xs text-slate-500 font-mono">Lat/Lng: ${s.gps.lat.toFixed(4)}, ${s.gps.lng.toFixed(4)} — ห่างจากจุดกิจกรรม <strong class="text-slate-700">${s.gps.distance} เมตร</strong></p>
      </div>`);
  }

  if (s.selfie) {
    const st = s.selfie.reviewStatus;
    blocks.push(`
      <div class="space-y-2">
        <h4 class="text-sm font-semibold text-slate-700 flex items-center gap-1.5">${icon('camera', 'w-4 h-4 text-blue-600')} รูปเซลฟี่ ${statusBadge(st === 'approved' ? 'ready' : st === 'rejected' ? 'rejected' : 'pending', st === 'approved' ? 'อนุมัติแล้ว' : st === 'rejected' ? 'ถูกปฏิเสธ' : 'รอตรวจ')}</h4>
        <div class="mock-certificate rounded-xl h-48 flex items-center justify-center text-xs text-amber-700/60">${s.selfie.url}</div>
        ${st === 'pending' ? `
          <div class="flex gap-2 pt-1">
            <button onclick="decideCheckinSelfie('${s.code}', true)" class="flex-1 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition">อนุมัติ</button>
            <button onclick="decideCheckinSelfie('${s.code}', false)" class="flex-1 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition">ปฏิเสธ</button>
          </div>` : `
          <p class="text-xs text-slate-400">ตรวจโดย ${s.selfie.reviewedBy} เมื่อ ${s.selfie.reviewedAt}</p>`}
      </div>`);
  }

  if (s.masterCode) {
    blocks.push(`
      <div class="space-y-2">
        <h4 class="text-sm font-semibold text-slate-700 flex items-center gap-1.5">${icon('shield', 'w-4 h-4 text-blue-600')} Master Code (บายพาส)</h4>
        <p class="text-sm font-mono font-bold text-slate-800">${s.masterCode.code}</p>
        <p class="text-xs text-slate-500">ออกโดย <strong class="text-slate-700">${s.masterCode.issuedBy}</strong> เมื่อ ${s.masterCode.issuedAt}</p>
      </div>`);
  }

  if (!s.gps && !s.selfie && !s.masterCode) {
    blocks.push(`<div class="text-center py-8 text-sm text-slate-400">ไม่มีหลักฐานเช็คอินสำหรับคนนี้</div>`);
  }

  document.getElementById('cr-detail').innerHTML = blocks.join('<div class="border-t border-slate-100"></div>');
}

function decideCheckinSelfie(code, approve) {
  const roster = RegDB.rosters[crActiveEventId];
  const s = roster && roster.students.find((x) => x.code === code);
  if (!s || !s.selfie) return;
  showConfirmDialog({
    title: approve ? 'อนุมัติรูปเซลฟี่' : 'ปฏิเสธรูปเซลฟี่',
    message: `${s.name} (${s.code})`,
    tone: approve ? undefined : 'danger',
    confirmText: approve ? 'อนุมัติ' : 'ปฏิเสธ',
    bullets: approve ? [
      'ยืนยันว่าเทียบภาพกับสถานที่จัดกิจกรรมแล้วถูกต้อง',
      'เมื่ออนุมัติแล้ว ระบบจะแจกหน่วยกิตทันทีถ้าขั้นตอนอื่นที่กิจกรรมกำหนดครบแล้ว (FR-B3/B7)',
    ] : [
      'เช็คอินนี้จะไม่ได้รับหน่วยกิต',
      'นักศึกษาต้องติดต่อ Field Staff เพื่อขอ Master Code หรือถ่ายรูปใหม่ถ้ายังอยู่ในช่วงกิจกรรม',
    ],
    onConfirm: () => {
      const actor = currentUser(getSessionRole()).name;
      s.selfie.reviewStatus = approve ? 'approved' : 'rejected';
      s.selfie.reviewedBy = actor;
      s.selfie.reviewedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
      s.completionPath = approve ? 'standard' : null;
      RegDB.save();
      appendAudit(approve ? 'selfie_approved' : 'selfie_rejected', `${approve ? 'อนุมัติ' : 'ปฏิเสธ'}รูปเซลฟี่เช็คอินของ ${s.name} (${s.code}) กิจกรรม "${roster.name}"`, actor);
      showToast(approve ? 'อนุมัติหน่วยกิตแล้ว' : 'ปฏิเสธรูปเซลฟี่แล้ว', approve ? 'success' : 'warning');
      renderCrQueue();
      renderCrDetail(s);
    },
  });
}
