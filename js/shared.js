/* =========================================================================
 * SciU-Regis Mock-up — shared.js
 * Shell layout (Navbar / Bottom Nav / Footer), Icon Library, UI helpers
 * อ้างอิง: docs/09_DESIGN.md, docs/10_LAYOUT_NAVIGATION.md, AGENTS.md §9
 * ========================================================================= */

/* ---------------- Icon Library (SVG inner markup, 24x24 stroke-based) ---- */
const ICONS = {
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  'file-text': '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  unlock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/>',
  download: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  bell: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>',
  'log-out': '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  'log-in': '<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>',
  'message-circle': '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>',
  'bar-chart': '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  robot: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="11"/><line x1="8" y1="14" x2="8" y2="17"/><line x1="16" y1="14" x2="16" y2="17"/>',
  'book-open': '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  phone: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>',
  'map-pin': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
  camera: '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  plus: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'x-circle': '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'alert-triangle': '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'external-link': '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'upload-cloud': '<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>',
  edit: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  'trash-2': '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  atom: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
  'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
  'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  slack: '<rect x="13.5" y="2" width="3" height="8" rx="1.5"/><rect x="7.5" y="14" width="3" height="8" rx="1.5"/><rect x="2" y="7.5" width="8" height="3" rx="1.5"/><rect x="14" y="13.5" width="8" height="3" rx="1.5"/>',
  line: '<path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.2 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s5.9-3.5 8.1-6C21.4 14.1 22 12.6 22 11c0-4.4-4.5-8-10-8z"/>',
};

function icon(name, cls = 'w-5 h-5') {
  const path = ICONS[name] || ICONS['alert-triangle'];
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${name}">${path}</svg>`;
}

/* ---------------- Mock session + storage helpers ------------------------- */
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem('sciu:' + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, val) { localStorage.setItem('sciu:' + key, JSON.stringify(val)); },
  remove(key) { localStorage.removeItem('sciu:' + key); },

  /**
   * getSeeded(key, fallback, opts) — โหลดข้อมูล seed พร้อมกลไก self-heal ข้อมูลเก่าค้างใน localStorage
   * opts รองรับ 2 นโยบาย (เลือกอย่างใดอย่างหนึ่งหรือทั้งคู่):
   *   - isValidShape(item): reseed ถ้าข้อมูลเก่ามีโครงสร้างไม่ตรงดีไซน์ปัจจุบัน แต่ "เก็บ" ข้อมูลรูปแบบใหม่ที่ผู้ใช้เพิ่งสร้างไว้
   *       ใช้กับ proofs — กัน reseed ทับหลักฐานที่นักศึกษาเพิ่งส่ง (โครงสร้างใหม่) ขณะเดียวกันก็ล้างข้อมูลก่อนรื้อ OCR ทิ้ง
   *   - version: reseed เมื่อ bump เลข version ถึงแม้ข้อมูลเก่าจะ shape ถูก — ใช้ push เนื้อหา curated ชุดใหม่
   *       ใช้กับ FAQ — เพิ่มรายการ/หมวดใหม่แล้วอยากให้ขึ้นทันทีแม้ browser มีข้อมูลเก่าค้าง
   * ถ้าผ่านทุกเงื่อนไข จะคืน state ที่ผู้ใช้แก้ไว้ตามปกติ (ไม่ล้างทิ้ง)
   */
  getSeeded(key, fallback, opts = {}) {
    const data = this.get(key, null);
    const shapeOk = !opts.isValidShape ? true : (Array.isArray(data) && data.every(opts.isValidShape));
    const versionOk = opts.version == null ? true : (this.get(key + '__seedv', null) === opts.version);
    if (data === null || !Array.isArray(data) || !shapeOk || !versionOk) {
      this.set(key, fallback);
      if (opts.version != null) this.set(key + '__seedv', opts.version);
      return fallback;
    }
    if (opts.version != null) this.set(key + '__seedv', opts.version); // stamp marker ให้ข้อมูล shape ถูกที่ยังไม่มี marker
    return data;
  },
};

/* FR-D6: อีเมลติดต่อเจ้าหน้าที่ที่แสดงให้ผู้ใช้เห็นต้องอ่านจากค่าที่ Admin ตั้งไว้ (FR-F4)
 * ห้าม hardcode ในโค้ดของแต่ละหน้าจอ — ทุกจุดที่ต้องแสดงอีเมลติดต่อให้เรียกฟังก์ชันนี้ */
function getContactEmail() {
  return Store.get('adm-settings', { email: 'registrar@sci.ubu.ac.th' }).email || 'registrar@sci.ubu.ac.th';
}

const MOCK_USERS = {
  registrar: { name: 'พี่สมบัติ วงศ์ทะเบียน', roleLabel: 'Registrar (เจ้าหน้าที่ทะเบียน)', roles: ['registrar', 'lead_org'] },
  student: { name: 'สมชาย ใจดี', studentCode: '66114400123', roleLabel: 'นักศึกษา', roles: ['student'] },
  admin: { name: 'ธนกร ระบบดี', roleLabel: 'ผู้ดูแลระบบ (IT)', roles: ['admin'] },
  'lead-org': { name: 'อาจารย์วิชัย จัดกิจกรรม', roleLabel: 'Lead Org (ผู้จัดกิจกรรม)', roles: ['lead_org'] },
  'field-staff': { name: 'น้องเก่ง สตาฟดี', roleLabel: 'Field Staff (สตาฟหน้างาน)', roles: ['field_staff'] },
  guest: { name: 'ผู้เยี่ยมชม', roleLabel: 'Guest', roles: [] },
};

function currentUser(role) { return MOCK_USERS[role] || MOCK_USERS.guest; }

/**
 * getSessionRole() — Single source of truth for the active role.
 * Priority: 1) Store (localStorage)  2) fallback argument  3) 'guest'
 */
function getSessionRole(fallback) {
  const stored = Store.get('role', null);
  const valid = ['registrar', 'student', 'admin', 'lead-org', 'field-staff', 'guest'];
  if (stored && valid.includes(stored)) return stored;
  if (fallback && valid.includes(fallback)) return fallback;
  return 'guest';
}

/** mockLogout() — clears session and redirects to index */
function mockLogout() {
  Store.remove('role');
  Store.remove('user');
  window.location.href = 'index.html';
}

/* ---------------- Role-based navigation (docs/10 §4.3, §5.1) ------------- */
const NAV_MENUS = {
  registrar: [
    { label: 'หน้าแรก', icon: 'home', href: 'registrar-home.html' },
    { label: 'กิจกรรม', icon: 'calendar', href: 'registrar-event-form.html' },
    { label: 'ตรวจหลักฐาน', icon: 'file-text', href: 'registrar-verify-review.html' },
    { label: 'โควต้า', icon: 'lock', href: 'registrar-quotas.html' },
    { label: 'Export', icon: 'download', href: 'registrar-export.html' },
    { label: 'รอบปี', icon: 'calendar', href: 'registrar-cycles.html' },
  ],
  student: [
    { label: 'หน้าแรก', icon: 'home', href: 'student-home.html' },
    { label: 'รายการกิจกรรม', icon: 'calendar', href: 'event-list.html' },
    { label: 'การช่วยเหลือนักศึกษา', icon: 'book-open', href: 'student-help.html' },
    { label: 'เช็คอิน', icon: 'map-pin', href: 'student-checkin.html' },
    { label: 'ส่งหลักฐาน', icon: 'upload-cloud', href: 'student-proof-upload.html' },
    { label: 'SciU-Buddy', icon: 'message-circle', href: 'student-chatbot.html' },
    { label: 'ติดต่อเรา', icon: 'phone', href: 'contact.html' },
  ],
  admin: [
    { label: 'แผงควบคุม', icon: 'home', href: 'admin-home.html' },
    { label: 'ผู้ใช้', icon: 'users', href: 'admin-users.html' },
    { label: 'ตั้งค่า', icon: 'settings', href: 'admin-settings.html' },
    { label: 'FAQ แชทบอท', icon: 'robot', href: 'admin-faq.html' },
    { label: 'ช่องทางติดต่อ', icon: 'phone', href: 'admin-contacts.html' },
    { label: 'Audit Log', icon: 'bar-chart', href: 'admin-audit.html' },
  ],
  'lead-org': [
    { label: 'หน้าแรก', icon: 'home', href: 'lead-org-home.html' },
    { label: 'กิจกรรมของฉัน', icon: 'calendar', href: 'lead-org-my-events.html' },
    { label: 'สร้างกิจกรรม', icon: 'plus', href: 'registrar-event-form.html' },
    { label: 'ยืนยันรายชื่อ', icon: 'check-circle', href: 'lead-org-rosters.html' },
  ],
  'field-staff': [
    { label: 'หน้าแรก', icon: 'home', href: 'field-staff-home.html' },
    { label: 'กิจกรรมวันนี้', icon: 'calendar', href: 'field-staff-home.html' },
    { label: 'Master Code', icon: 'shield', href: 'field-staff-master-codes.html' },
  ],
  guest: [
    { label: 'หน้าแรก', icon: 'home', href: 'index.html' },
    { label: 'รายการกิจกรรม', icon: 'calendar', href: 'event-list.html' },
    { label: 'การช่วยเหลือนักศึกษา', icon: 'book-open', href: 'student-help.html' },
    { label: 'สอบถาม SciU-Buddy', icon: 'message-circle', href: 'student-chatbot.html' },
    { label: 'ติดต่อเรา', icon: 'phone', href: 'contact.html' },
  ],
};

/* bottom nav (มือถือ) สูงสุด 5 แท็บต่อ role */
const BOTTOM_NAVS = {
  registrar: [
    { label: 'หน้าแรก', icon: 'home', href: 'registrar-home.html' },
    { label: 'Export', icon: 'download', href: 'registrar-export.html' },
    { label: 'ตรวจ', icon: 'file-text', href: 'registrar-verify-review.html' },
    { label: 'โควต้า', icon: 'lock', href: 'registrar-quotas.html' },
    { label: 'บัญชี', icon: 'user', href: 'profile-settings.html' },
  ],
  student: [
    { label: 'หน้าแรก', icon: 'home', href: 'student-home.html' },
    { label: 'เช็คอิน', icon: 'map-pin', href: 'student-checkin.html' },
    { label: 'หลักฐาน', icon: 'upload-cloud', href: 'student-proof-upload.html' },
    { label: 'แชทบอท', icon: 'message-circle', href: 'student-chatbot.html' },
    { label: 'บัญชี', icon: 'user', href: 'profile-settings.html' },
  ],
  admin: [
    { label: 'แผงควบคุม', icon: 'home', href: 'admin-home.html' },
    { label: 'ผู้ใช้', icon: 'users', href: 'admin-users.html' },
    { label: 'ตั้งค่า', icon: 'settings', href: 'admin-settings.html' },
    { label: 'Audit', icon: 'bar-chart', href: 'admin-audit.html' },
    { label: 'บัญชี', icon: 'user', href: 'profile-settings.html' },
  ],
  'lead-org': [
    { label: 'หน้าแรก', icon: 'home', href: 'lead-org-home.html' },
    { label: 'สร้างกิจกรรม', icon: 'plus', href: 'registrar-event-form.html' },
    { label: 'ยืนยัน', icon: 'check-circle', href: 'lead-org-rosters.html' },
    { label: 'บัญชี', icon: 'user', href: 'profile-settings.html' },
  ],
  'field-staff': [
    { label: 'หน้าแรก', icon: 'home', href: 'field-staff-home.html' },
    { label: 'วันนี้', icon: 'calendar', href: 'field-staff-home.html' },
    { label: 'Code', icon: 'shield', href: 'field-staff-master-codes.html' },
    { label: 'บัญชี', icon: 'user', href: 'profile-settings.html' },
  ],
  guest: [
    { label: 'หน้าแรก', icon: 'home', href: 'index.html' },
    { label: 'สอบถาม', icon: 'message-circle', href: 'student-chatbot.html' },
    { label: 'ติดต่อ', icon: 'phone', href: 'contact.html' },
    { label: 'เข้าสู่ระบบ', icon: 'log-in', href: 'login.html' },
  ],
};

const MOCK_NOTIFICATIONS = {
  registrar: [
    { icon: 'file-text', text: 'หลักฐานรอตรวจใหม่ (2 รายการ)', time: '5 นาทีที่แล้ว' },
    { icon: 'alert-triangle', text: 'กิจกรรมที่รอยืนยันรายชื่อ (1 รายการ)', time: '1 ชม.ที่แล้ว' },
    { icon: 'message-circle', text: 'บอทตอบคำถามไม่ได้ (1 คำถาม)', time: '3 ชม.ที่แล้ว' },
  ],
  student: [
    { icon: 'check-circle', text: 'หลักฐาน "ค่ายจิตอาสาวัดป่าฯ" ได้รับอนุมัติแล้ว', time: 'เมื่อวาน' },
    { icon: 'calendar', text: 'กิจกรรม "Science Open House" ใกล้ถึงวันจัดแล้ว', time: '2 วันที่แล้ว' },
  ],
  admin: [
    { icon: 'alert-triangle', text: 'Slack Bot Token ยังไม่ได้ตั้งค่า', time: 'ระบบ' },
    { icon: 'message-circle', text: 'บอทตอบคำถามไม่ได้ ควรเพิ่มเป็น FAQ ใหม่ (1 คำถาม)', time: '2 ชม.ที่แล้ว' },
  ],
};

/* ---------------- Shell renderer ----------------------------------------- */
function renderShell(opts) {
  const { role: _roleHint = null, active = '', title = '' } = opts || {};
  const role = getSessionRole(_roleHint);

  // Page authorization check to enforce role boundaries
  const pathname = window.location.pathname.split('/').pop() || 'index.html';
  if (role === 'admin') {
    const allowedAdminPages = [
      'admin-home.html',
      'admin-users.html',
      'admin-settings.html',
      'admin-faq.html',
      'admin-contacts.html',
      'admin-audit.html',
      'profile-settings.html',
      'login.html',
      'index.html'
    ];
    const isRestrictedPage = pathname.startsWith('registrar-') ||
      pathname.startsWith('student-') ||
      pathname.startsWith('lead-org-') ||
      pathname.startsWith('field-staff-') ||
      pathname === 'event-list.html' ||
      pathname === 'event-detail.html' ||
      pathname === 'contact.html';

    if (isRestrictedPage && !allowedAdminPages.includes(pathname)) {
      window.location.href = 'admin-home.html';
      return;
    }
  } else if (role !== 'admin' && pathname.startsWith('admin-')) {
    if (role === 'guest') {
      window.location.href = 'login.html';
    } else {
      const homeRedirects = {
        registrar: 'registrar-home.html',
        student: 'student-home.html',
        'lead-org': 'lead-org-home.html',
        'field-staff': 'field-staff-home.html'
      };
      window.location.href = homeRedirects[role] || 'index.html';
    }
    return;
  }

  const user = currentUser(role);
  const menus = NAV_MENUS[role] || NAV_MENUS.guest;
  const bottoms = BOTTOM_NAVS[role] || BOTTOM_NAVS.guest;
  const notifs = MOCK_NOTIFICATIONS[role] || [];
  const homeHref = (menus[0] && menus[0].href) || 'index.html';

  const navLinks = menus.map((m) => {
    const isActive = m.href.split('#')[0] === active;
    return `<a href="${m.href}" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition
        ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}">
        ${icon(m.icon, 'w-4 h-4')}<span class="hidden xl:inline">${m.label}</span><span class="xl:hidden">${m.label}</span></a>`;
  }).join('');

  const notifItems = notifs.length
    ? notifs.map((n) => `
        <div class="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition">
          <span class="text-slate-400 mt-0.5">${icon(n.icon, 'w-4 h-4')}</span>
          <div class="min-w-0"><p class="text-sm text-slate-700 leading-snug">${n.text}</p>
          <p class="text-xs text-slate-400 mt-0.5">${n.time}</p></div>
        </div>`).join('')
    : '<p class="px-4 py-6 text-sm text-slate-400 text-center">ไม่มีการแจ้งเตือน</p>';

  const navbar = `
  <nav class="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between gap-3">
      <a href="index.html" class="flex items-center gap-2 shrink-0">
        <span class="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm"><img src="img/sci-faculty-2569.png" class="w-8 h-8 object-contain" alt="SciU-Regis"></span>
        <span class="hidden sm:block leading-tight">
          <span class="block text-sm font-bold text-slate-900">SciU-Regis</span>
          <span class="block text-[10px] text-slate-400">Registrar Assistant</span>
        </span>
      </a>
      <div class="hidden lg:flex items-center gap-1 flex-1 justify-center">${navLinks}</div>
      <div class="flex items-center gap-1.5">
        ${role !== 'guest' ? `
        <div class="relative">
          <button id="shell-bell" class="relative p-2 rounded-xl hover:bg-slate-100 transition" aria-label="การแจ้งเตือน">
            <span class="text-slate-600">${icon('bell', 'w-5 h-5')}</span>
            ${notifs.length ? `<span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">${notifs.length}</span>` : ''}
          </button>
          <div id="shell-bell-dd" class="hidden absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p class="text-sm font-semibold text-slate-800">การแจ้งเตือน</p>
              <span class="text-xs text-slate-400">${notifs.length} รายการ</span>
            </div>
            <div class="divide-y divide-slate-50 max-h-80 overflow-y-auto">${notifItems}</div>
            <a href="#" class="block px-4 py-2.5 text-center text-sm text-blue-600 font-medium hover:bg-blue-50 border-t border-slate-100">ดูทั้งหมด</a>
          </div>
        </div>
        <div class="relative">
          <button id="shell-profile" class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition" aria-label="โปรไฟล์">
            <span class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">${icon('user', 'w-4 h-4')}</span>
            <span class="hidden md:flex items-center gap-1 text-sm text-slate-700 font-medium">${user.name.split(' ')[0]}
              <span class="text-slate-400">${icon('chevron-down', 'w-4 h-4')}</span></span>
          </button>
          <div id="shell-profile-dd" class="hidden absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-100">
              <p class="text-sm font-semibold text-slate-800">${user.name}</p>
              <p class="text-xs text-slate-400 mt-0.5">${user.roleLabel}</p>
              ${user.roles.length > 1 ? `<p class="text-[10px] text-amber-600 mt-1 inline-flex items-center gap-1">${icon('shield', 'w-3 h-3')} ถือหลายบทบาท: ${user.roles.join(' + ')}</p>` : ''}
            </div>
            <a href="profile-settings.html" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">${icon('user', 'w-4 h-4')} ตั้งค่าบัญชีของฉัน</a>
            ${role === 'registrar' ? `<a href="registrar-slack.html" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">${icon('bell', 'w-4 h-4')} ตั้งค่าการแจ้งเตือน</a>` : ''}
            ${role === 'admin' ? `<a href="admin-settings.html" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">${icon('settings', 'w-4 h-4')} ตั้งค่าระบบ</a>` : ''}
            <a href="login.html" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">${icon('refresh', 'w-4 h-4')} สลับบทบาท (Mock)</a>
            <a href="#" onclick="mockLogout(); return false;" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100">${icon('log-out', 'w-4 h-4')} ออกจากระบบ</a>
          </div>
        </div>` : `
        <a href="login.html" class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-600/20">
          ${icon('log-in', 'w-4 h-4')} เข้าสู่ระบบ</a>`}
        <button id="shell-hamburger" class="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition" aria-label="เมนู">
          <span class="text-slate-600">${icon('menu', 'w-5 h-5')}</span>
        </button>
      </div>
    </div>
    <div id="shell-mobile-menu" class="hidden lg:hidden border-t border-slate-100 bg-white px-4 py-2 space-y-1">
      ${menus.map((m) => `<a href="${m.href}" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${m.href.split('#')[0] === active ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}">${icon(m.icon, 'w-4 h-4')} ${m.label}</a>`).join('')}
    </div>
  </nav>`;

  const bottomNav = `
  <nav class="lg:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-white border-t border-slate-200 safe-area-bottom">
    <div class="h-full grid grid-cols-${bottoms.length}">
      ${bottoms.map((b) => {
    const isActive = b.href.split('#')[0] === active;
    return `<a href="${b.href}" class="flex flex-col items-center justify-center gap-0.5 ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}">
          ${icon(b.icon, 'w-5 h-5')}<span class="text-[10px] font-medium">${b.label}</span></a>`;
  }).join('')}
    </div>
  </nav>`;

  const footer = `
  <footer class="bg-slate-50 border-t border-slate-200 mt-auto mb-16 lg:mb-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-blue-600"><img src="img/sci-faculty-2569.png" class="w-7 h-7 object-contain" alt="SciU-Regis"></span>
            <p class="text-sm font-bold text-slate-800">SciU-Regis</p>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">ระบบผู้ช่วยกิจกรรมนักศึกษาและงานทะเบียนกิจกรรม<br/>คณะวิทยาศาสตร์ มหาวิทยาลัยอุบลราชธานี</p>
        </div>
        <div>
          <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">ลิงก์ที่เป็นประโยชน์</h4>
          <ul class="space-y-2">
            <li><a href="index.html" class="text-sm text-slate-600 hover:text-blue-600 transition">เกี่ยวกับระบบ</a></li>
            <li><a href="#" class="text-sm text-slate-600 hover:text-blue-600 transition">นโยบายความเป็นส่วนตัว (PDPA)</a></li>
            <li><a href="#" class="text-sm text-slate-600 hover:text-blue-600 transition">เงื่อนไขการใช้งาน</a></li>
            <li><a href="#" class="text-sm text-slate-600 hover:text-blue-600 transition">คู่มือการใช้งาน</a></li>
          </ul>
        </div>
        <div id="contact">
          <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">ติดต่อ</h4>
          <ul class="space-y-2 text-sm text-slate-600">
            <li class="flex items-center gap-2"><span class="text-slate-400">${icon('phone', 'w-4 h-4')}</span>045-353-xxx</li>
            <li class="flex items-center gap-2"><span class="text-slate-400">${icon('mail', 'w-4 h-4')}</span><a href="mailto:${getContactEmail()}" class="hover:text-blue-600 transition">${getContactEmail()}</a></li>
            <li class="flex items-center gap-2"><span class="text-slate-400">${icon('map-pin', 'w-4 h-4')}</span>คณะวิทยาศาสตร์ ม.อุบลราชธานี</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-slate-200 my-6"></div>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-xs text-slate-400">(c) 2569 Faculty of Science, Ubon Ratchathani University. All rights reserved.</p>
        <p class="text-xs text-slate-400">Version 1.0.0 (Mock-up) | ปีการศึกษา 2569</p>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('afterbegin', navbar);
  document.body.insertAdjacentHTML('beforeend', bottomNav);
  document.body.insertAdjacentHTML('beforeend', footer);
  if (title) document.title = `${title} — SciU-Regis`;

  // dropdown toggles
  bindDropdown('shell-bell', 'shell-bell-dd');
  bindDropdown('shell-profile', 'shell-profile-dd');
  const burger = document.getElementById('shell-hamburger');
  const mobileMenu = document.getElementById('shell-mobile-menu');
  if (burger && mobileMenu) burger.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

  // Persist the resolved role to session so every subsequent page navigation is stable.
  Store.set('role', role);
}

function bindDropdown(btnId, ddId) {
  const btn = document.getElementById(btnId);
  const dd = document.getElementById(ddId);
  if (!btn || !dd) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('[id$="-dd"]').forEach((el) => { if (el !== dd) el.classList.add('hidden'); });
    dd.classList.toggle('hidden');
  });
  document.addEventListener('click', () => dd.classList.add('hidden'));
  dd.addEventListener('click', (e) => e.stopPropagation());
}

/* ---------------- UI helpers --------------------------------------------- */
function showToast(message, type = 'success') {
  const colors = {
    success: 'bg-emerald-600', error: 'bg-red-600', warning: 'bg-amber-500', info: 'bg-blue-600',
  };
  const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'bell' };
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    wrap.className = 'fixed top-20 right-4 z-[60] space-y-2 max-w-sm';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = `${colors[type] || colors.info} text-white rounded-xl shadow-xl px-4 py-3 flex items-start gap-2.5 toast-enter`;
  el.innerHTML = `<span class="shrink-0 mt-0.5">${icon(icons[type] || 'bell', 'w-4 h-4')}</span><p class="text-sm leading-snug">${message}</p>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('toast-leave');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

/**
 * Confirm dialog (docs/09 Component F) — บังคับใช้กับทุก action ที่ย้อนกลับยาก
 * opts: { title, message, bullets[], confirmText, cancelText, tone: 'warning'|'danger', requireReason, onConfirm(reason), onCancel }
 * onCancel เป็น optional — ถ้าไม่ส่งมา ปุ่ม cancel จะแค่ปิด dialog เฉยๆ เหมือนเดิม
 * ถ้าส่งมา จะถูกเรียกเมื่อกดปุ่ม cancel เท่านั้น (ไม่เรียกตอนคลิกพื้นหลังปิด dialog)
 */
function showConfirmDialog(opts) {
  const {
    title, message = '', bullets = [], confirmText = 'ยืนยัน', cancelText = 'ยกเลิก',
    tone = 'warning', requireReason = false, reasonLabel = 'เหตุผล (บังคับกรอก)', onConfirm, onCancel,
  } = opts;
  const toneCls = tone === 'danger'
    ? { bg: 'bg-red-100', txt: 'text-red-600', box: 'bg-red-50 border-red-200 text-red-800', li: 'text-red-700', btn: 'bg-red-600 hover:bg-red-700' }
    : { bg: 'bg-amber-100', txt: 'text-amber-600', box: 'bg-amber-50 border-amber-200 text-amber-800', li: 'text-amber-700', btn: 'bg-blue-600 hover:bg-blue-800' };

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[55] p-4';
  overlay.innerHTML = `
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
      <div class="w-12 h-12 rounded-full ${toneCls.bg} flex items-center justify-center mx-auto">
        <span class="${toneCls.txt}">${icon('alert-triangle', 'w-6 h-6')}</span>
      </div>
      <h3 class="text-lg font-semibold text-slate-900 text-center">${title}</h3>
      ${message ? `<p class="text-sm text-slate-500 text-center">${message}</p>` : ''}
      ${bullets.length ? `
      <div class="${toneCls.box} border rounded-xl p-4 text-sm">
        <p class="font-medium">การดำเนินการนี้จะ:</p>
        <ul class="list-disc list-inside mt-2 space-y-1 ${toneCls.li}">${bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>` : ''}
      ${requireReason ? `
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-slate-700" for="confirm-reason">${reasonLabel}</label>
        <textarea id="confirm-reason" rows="2" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600" placeholder="เช่น นักศึกษามาช่วยงานเพิ่มวันสุดท้าย"></textarea>
        <p id="confirm-reason-err" class="hidden text-xs text-red-600">ต้องกรอกเหตุผลก่อนบันทึก (บันทึกลง Audit Log)</p>
      </div>` : ''}
      <div class="flex gap-3 pt-2">
        <button id="confirm-cancel" class="flex-1 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition">${cancelText}</button>
        <button id="confirm-ok" class="flex-1 py-2.5 ${toneCls.btn} text-white font-medium rounded-xl transition shadow-lg">${confirmText}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#confirm-cancel').addEventListener('click', () => {
    overlay.remove();
    if (onCancel) onCancel();
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#confirm-ok').addEventListener('click', () => {
    let reason = '';
    if (requireReason) {
      reason = overlay.querySelector('#confirm-reason').value.trim();
      if (!reason) {
        overlay.querySelector('#confirm-reason-err').classList.remove('hidden');
        overlay.querySelector('#confirm-reason').classList.add('border-red-400');
        return;
      }
    }
    overlay.remove();
    if (onConfirm) onConfirm(reason);
  });
}

/* Status badge (docs/09 Component A) — type: ready|pending|rejected|locked|mismatch|imported */
function statusBadge(type, text) {
  const map = {
    ready: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', ic: 'check-circle' },
    imported: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', ic: 'check' },
    pending: { cls: 'bg-amber-50 text-amber-700 border-amber-200', ic: 'clock' },
    rejected: { cls: 'bg-red-50 text-red-700 border-red-200', ic: 'x-circle' },
    locked: { cls: 'bg-purple-50 text-purple-700 border-purple-200', ic: 'lock' },
    mismatch: { cls: 'bg-yellow-50 text-yellow-800 border-yellow-300', ic: 'alert-triangle' },
    info: { cls: 'bg-blue-50 text-blue-700 border-blue-200', ic: 'bell' },
    open: { cls: 'bg-blue-50 text-blue-700 border-blue-200', ic: 'calendar' },
  };
  const m = map[type] || map.info;
  return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${m.cls} whitespace-nowrap">${icon(m.ic, 'w-3.5 h-3.5')}${text}</span>`;
}

/* Progress bar (docs/09 Component E) */
function progressBar(value, max, opts = {}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const full = value >= max;
  const color = full ? 'bg-purple-500' : 'bg-gradient-to-r from-blue-600 to-blue-400';
  return `
  <div class="space-y-2">
    <div class="flex justify-between items-center">
      <span class="text-sm text-slate-500">${opts.label || 'หน่วยกิตสะสม (กิจกรรมเปิดกว้าง)'}</span>
      <span class="text-lg font-bold font-mono text-slate-900">${value}/${max}</span>
    </div>
    <div class="relative h-3 bg-slate-100 rounded-full overflow-hidden">
      <div class="absolute inset-0 ${color} rounded-full transition-all" style="width:${pct}%"></div>
    </div>
    <p class="text-xs text-slate-400">${full
      ? `<span class="inline-flex items-center gap-1 text-purple-600 font-semibold">${icon('lock', 'w-3 h-3')} ครบโควต้าแล้ว (${max} หน่วย)</span>`
      : `เหลืออีก <span class="font-semibold text-amber-600">${(max - value).toFixed(1).replace(/\.0$/, '')}</span> หน่วย ถึงครบโควต้า (${max} หน่วย)`}</p>
  </div>`;
}

/* Stats card (docs/09 Component I) */
function statsCard(label, value, sub, opts = {}) {
  return `
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">${label}</p>
    <p class="text-2xl font-bold font-mono ${opts.valueCls || 'text-slate-900'} mt-1">${value}</p>
    <p class="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">${opts.icon ? icon(opts.icon, 'w-3 h-3') : ''}${sub}</p>
  </div>`;
}

/* Empty state */
function emptyState(text, iconName = 'search') {
  return `
  <div class="py-12 text-center">
    <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-300">${icon(iconName, 'w-7 h-7')}</div>
    <p class="text-sm text-slate-400">${text}</p>
  </div>`;
}

/* ---------------- Field-staff assignment helpers (multi-staff, shared by
 * registrar-event-form.html + event-detail.html — event-detail.html ไม่โหลด registrar.js
 * จึงต้องอยู่ที่ shared.js ไม่ใช่ registrar.js) ------------------------------ */
const STAFF_ACCOUNTS = [
  { id: 4, label: 'น้องเก่ง สตาฟดี (keng.staff)', active: true },
  { id: 6, label: 'บุคลากรเก่า ลาออกแล้ว (old.staff) - บัญชีไม่ใช้งาน', active: false },
  { id: 99, label: 'น้องเบล สตาฟใหม่ (bell.staff)', active: true },
];

/* คืน array รหัสสตาฟของกิจกรรม — รองรับข้อมูลเก่าที่ยังเป็น staffId เดี่ยว (localStorage ค้าง) */
function eventStaffIds(ev) {
  if (!ev) return [];
  return Array.isArray(ev.staffIds) ? ev.staffIds : (ev.staffId ? [ev.staffId] : []);
}
/* คืนจำนวนจำกัดสตาฟของกิจกรรม — ค่าเริ่มต้น 3 คนถ้าไม่เคยตั้งไว้ (ข้อมูลเก่า) */
function eventStaffLimit(ev) {
  return (ev && Number.isFinite(ev.staffLimit)) ? ev.staffLimit : 3;
}

/* คืนชื่อที่แสดงผลของสตาฟ 1 คนจาก id (บัญชีสตาฟหลัก 3 คน หรือรหัสนักศึกษาที่เป็นสตาฟเฉพาะกิจ) */
function staffDisplayName(id) {
  const known = STAFF_ACCOUNTS.find((s) => s.id === id);
  if (known) return known.label;
  const students = Store.get('students', []);
  const std = students.find((s) => Number(s.code) === id);
  return std ? `${std.first} ${std.last} (${std.code}) — นักศึกษาสตาฟเฉพาะกิจ` : `สตาฟ #${id}`;
}

/* สร้าง <option> สำหรับ select "เพิ่มสตาฟ" — ตัดคนที่เพิ่มไปแล้ว (excludeIds) ออก + ปิดใช้งานบัญชี inactive */
function staffOptionsHtml(excludeIds = []) {
  let html = '<option value="">-- เลือกเพื่อเพิ่มสตาฟ --</option>';
  STAFF_ACCOUNTS.forEach((s) => {
    if (excludeIds.includes(s.id)) return;
    html += `<option value="${s.id}" ${s.active ? '' : 'disabled'}>${s.label}</option>`;
  });
  Store.get('students', []).forEach((s) => {
    const val = Number(s.code);
    if (val && !excludeIds.includes(val)) html += `<option value="${val}">${s.first} ${s.last} (${s.code})</option>`;
  });
  return html;
}

/* เรนเดอร์ chip รายชื่อสตาฟที่เพิ่มแล้ว + toggle ปิด/เปิด select เพิ่มสตาฟตามจำนวนจำกัด
 * staffIdsArr: array อ้างอิงที่ mutate ตรง ๆ ได้ (splice ตอนกดลบ) — onChange: callback หลัง add/remove ทุกครั้ง */
function renderStaffChips(chipsElId, addSelectEl, staffIdsArr, limit, onChange) {
  const chipsEl = document.getElementById(chipsElId);
  if (!chipsEl) return;
  chipsEl.innerHTML = staffIdsArr.length ? staffIdsArr.map((id) => `
    <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200">
      ${staffDisplayName(id)}
      <button type="button" data-id="${id}" class="chip-remove text-blue-400 hover:text-red-600 font-bold leading-none">&times;</button>
    </span>`).join('') : '<span class="text-xs text-slate-400">ยังไม่ได้เพิ่มสตาฟหน้างาน</span>';

  chipsEl.querySelectorAll('.chip-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const idx = staffIdsArr.indexOf(id);
      if (idx !== -1) staffIdsArr.splice(idx, 1);
      renderStaffChips(chipsElId, addSelectEl, staffIdsArr, limit, onChange);
      if (onChange) onChange();
    });
  });

  if (addSelectEl) {
    addSelectEl.innerHTML = staffOptionsHtml(staffIdsArr);
    addSelectEl.disabled = staffIdsArr.length >= limit;
  }
}

/* ค.ศ.->format วันที่ไทยสั้น */
function thDate(d) {
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const dt = (d instanceof Date) ? d : new Date(d);
  return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear() + 543}`;
}
