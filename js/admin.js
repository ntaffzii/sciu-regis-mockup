/* =========================================================================
 * SciU-Regis Mock-up — admin.js
 * Mock data + logic สำหรับหน้าจอฝั่ง Admin (Screen 11-15 + Home)
 * ========================================================================= */

const SCIENCE_MAJORS = [
  'เคมี',
  'เทคโนโลยียางและพอลิเมอร์',
  'ฟิสิกส์ชีวการแพทย์',
  'คณิตศาสตร์',
  'วิทยาการข้อมูลและนวัตกรรมซอฟต์แวร์',
  'เทคโนโลยีสารสนเทศและการสื่อสาร',
  'ชีววิทยา',
  'จุลชีววิทยา',
  'วิทยาศาสตร์สิ่งแวดล้อม',
  'อาชีวอนามัยและความปลอดภัย',
  'นวัตกรรมเทคโนโลยีวัสดุ',
];

const ROLE_LABELS = {
  admin: { text: 'Admin', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  registrar: { text: 'Registrar', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  lead_org: { text: 'Lead Org', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  field_staff: { text: 'Field Staff', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  student: { text: 'Student', cls: 'bg-slate-50 text-slate-600 border-slate-200' },
};

const DEFAULT_USERS = [
  { id: 1, username: 'admin.thanakorn', name: 'ธนกร ระบบดี', email: 'thanakorn.r@ubu.ac.th', roles: ['admin'], active: true },
  { id: 2, username: 'registrar.sombat', name: 'สมบัติ วงศ์ทะเบียน', email: 'sombat.w@ubu.ac.th', roles: ['registrar', 'lead_org'], active: true },
  { id: 3, username: 'wichai.lead', name: 'วิชัย จัดกิจกรรม', email: 'wichai.j@ubu.ac.th', roles: ['lead_org'], active: true },
  { id: 4, username: 'keng.staff', name: 'เก่ง สตาฟดี', email: 'keng.s@ubu.ac.th', roles: ['field_staff'], active: true },
  { id: 5, username: 'somchai.ja', name: 'สมชาย ใจดี', email: 'somchai.ja@ubu.ac.th', roles: ['student'], active: true },
  { id: 6, username: 'old.staff', name: 'บุคลากรเก่า ลาออกแล้ว', email: 'old.s@ubu.ac.th', roles: ['field_staff'], active: false },
];

const DEFAULT_WHITELIST = [
  { id: 101, type: 'student', studentCode: '66114400999', name: 'วันดี สมศรี', major: 'วิทยาการคอมพิวเตอร์', year: 2, roles: ['student'], connected: false },
  { id: 102, type: 'staff', email: 'newstaff.demo@ubu.ac.th', name: 'ดร.สมเกียรติ เก่งวิทย์', roles: ['lead_org'], connected: false },
  { id: 103, type: 'staff', email: 'director.science@ubu.ac.th', name: 'ผศ.ดร.กิตติเดช ปัญญาดี', roles: ['registrar', 'lead_org'], connected: false },
  { id: 104, type: 'student', studentCode: '66114400123', name: 'สมชาย ใจดี', major: 'เทคโนโลยีสารสนเทศ', year: 3, roles: ['student'], connected: true }
];

const DEFAULT_AUDIT = [
  { time: '2026-07-10 10:23', user: 'admin.thanakorn', role: 'admin', action: 'user_created', detail: 'สร้างบัญชี keng.staff (Field Staff)' },
  { time: '2026-07-10 09:45', user: 'registrar.sombat', role: 'registrar', action: 'credit_adjusted', detail: 'แก้หน่วยกิต วิชัย เก่งกล้า 3.0 -> 2.0 เหตุผล: มาไม่ครบวันที่ 3' },
  { time: '2026-07-10 09:12', user: 'registrar.sombat', role: 'registrar', action: 'sac_export', detail: 'Export Excel กิจกรรม "อบรมปฐมพยาบาลเบื้องต้น CPR"' },
  { time: '2026-07-09 16:30', user: 'wichai.lead', role: 'lead_org', action: 'event_created', detail: 'สร้างกิจกรรม "ปลูกป่าชายเลนเฉลิมพระเกียรติ" (เปิดกว้าง)' },
  { time: '2026-07-09 14:02', user: 'registrar.sombat', role: 'registrar', action: 'proof_approved', detail: 'อนุมัติหลักฐาน "บริจาคโลหิต" ของ สมหญิง รักเรียน (+1.0 หน่วย)' },
  { time: '2026-07-09 11:47', user: 'admin.thanakorn', role: 'admin', action: 'faq_updated', detail: 'แก้ไขคำตอบ FAQ หมวด "หน่วยกิตกิจกรรม" เรื่องเพดาน 9 ชม./วัน' },
  { time: '2026-07-08 15:20', user: 'keng.staff', role: 'field_staff', action: 'master_code_issued', detail: 'ออก Master Code A7K2M9 กิจกรรม "จิตอาสาพัฒนาคณะวิทยาศาสตร์"' },
  { time: '2026-07-08 10:05', user: 'registrar.sombat', role: 'registrar', action: 'quota_locked', detail: 'ล็อกโควต้า สมหญิง รักเรียน (12/12 หน่วย)' },
  { time: '2026-07-07 09:00', user: 'admin.thanakorn', role: 'admin', action: 'contact_added', detail: 'เพิ่มช่องทางติดต่อ ดร.วิชัย งานวิชาการ (อาจารย์ที่ปรึกษาสโมสรนักศึกษา)' },
];

/* FAQ ที่แชทบอทค้นด้วย semantic search (bge-m3 embedding) เมื่อคำถามไม่ตรงกับ SQL Direct Search (กิจกรรม/ผู้ใช้) */
// bump เลขนี้เมื่อ DEFAULT_FAQS เปลี่ยน (เพิ่มรายการ/หมวดใหม่) เพื่อ reseed ทับข้อมูลเก่าที่ค้างใน localStorage
const FAQS_SEED_VERSION = 2;
const DEFAULT_FAQS = [
  { id: 1, category: 'หน่วยกิตกิจกรรม', question: 'สามารถนำชั่วโมงจิตอาสานอกคณะมานับรวมได้หรือไม่?', answer: 'ได้ โดยอยู่ในประเภทกิจกรรมเปิดกว้าง และหน่วยกิตสะสมรวมทุกแหล่งต้องไม่เกิน 12 หน่วยกิตต่อปีการศึกษา', active: true },
  { id: 2, category: 'หน่วยกิตกิจกรรม', question: 'หนึ่งวันได้หน่วยกิตสูงสุดกี่หน่วย?', answer: 'สูงสุด 3 หน่วยกิต (9 ชั่วโมง) ต่อวัน โดยนับรวมทุกแหล่งหน่วยกิตในระบบ (เช็คอินในมหาวิทยาลัย + หลักฐานกิจกรรมเปิดกว้าง)', active: true },
  { id: 3, category: 'การส่งหลักฐาน', question: 'ต้องส่งเอกสารหลักฐานภายในกี่วัน?', answer: 'ภายใน 14 วันหลังเสร็จสิ้นกิจกรรม มิฉะนั้นเจ้าหน้าที่ทะเบียนอาจไม่รับพิจารณา', active: true },
  { id: 4, category: 'การส่งหลักฐาน', question: 'ถ้าทำจิตอาสาเป็นกลุ่มแต่ไม่ได้ลงทะเบียนในระบบ ต้องทำอย่างไร?', answer: 'ใช้ช่องทาง "กลุ่มจิตอาสา" แนบตารางรายชื่อผู้ร่วมกิจกรรม ระบบจะอ่านชื่อ-รหัสนักศึกษาให้อัตโนมัติด้วย OCR แล้วเจ้าหน้าที่จะตรวจสอบและจับคู่กับนักศึกษาในระบบก่อนอนุมัติ', active: true },
  { id: 5, category: 'กยศ.', question: 'เกณฑ์ 36 ชั่วโมงเกี่ยวข้องกับ กยศ. อย่างไร?', answer: 'นักศึกษาที่กู้ยืม กยศ. ต้องทำกิจกรรมสะสมไม่น้อยกว่า 36 ชั่วโมง (12 หน่วยกิต) ต่อปีการศึกษา จึงจะมีสิทธิ์กู้ยืมต่อในปีถัดไป', active: true },
  { id: 6, category: 'อื่นๆ', question: 'ลืมรหัสผ่านเข้าระบบต้องทำอย่างไร?', answer: 'กดปุ่ม "ลืมรหัสผ่าน" ที่หน้าเข้าสู่ระบบ หรือติดต่อเจ้าหน้าที่ทะเบียนโดยตรงหากไม่ได้ผูกอีเมลมหาวิทยาลัย', active: false },
  { id: 7, category: 'การจัดกิจกรรม', question: 'ต้องการจัดกิจกรรม/โครงการของชมรมหรือสโมสร ต้องยื่นเรื่องล่วงหน้ากี่วัน?', answer: 'ต้องยื่นเอกสารขออนุมัติล่วงหน้าอย่างน้อย 45 วันทำการก่อนวันจัดกิจกรรมจริง เพื่อนำเรื่องเข้าที่ประชุมบอร์ดกิจกรรมของมหาวิทยาลัย', active: true },
  { id: 8, category: 'การส่งหลักฐาน', question: 'หลังจบกิจกรรมต้องส่งรายชื่อและลายเซ็นผู้เข้าร่วมภายในกี่วัน?', answer: 'ภายใน 3 วันทำการหลังกิจกรรมจบ หากรหัสนักศึกษาที่เขียนด้วยลายมืออ่านยาก ระบบ OCR จะอ่านให้อัตโนมัติ แต่เจ้าหน้าที่ทะเบียนจะตรวจสอบและแก้ไขให้ถูกต้องก่อนอนุมัติเสมอ', active: true },
  { id: 9, category: 'กยศ.', question: 'ใกล้เดดไลน์ยื่นกู้ยืม กยศ. แล้วชั่วโมงยังไม่ครบ ยื่นย้อนหลังได้ไหม?', answer: 'แนะนำให้ส่งหลักฐานทันทีหลังทำกิจกรรมเสร็จ ไม่ควรรอสะสมไว้ยื่นช่วงใกล้เดดไลน์ เพราะเจ้าหน้าที่ต้องใช้เวลาตรวจสอบและอนุมัติ หากส่งกระชั้นชิดเกินไปอาจดำเนินการไม่ทันกำหนดยื่นกู้ยืมในปีนั้น', active: true },
  { id: 10, category: 'ทุนการศึกษา', question: 'นักศึกษาทุนเรียนดี/ทุนอื่นๆ (นอกจาก กยศ.) ต้องมีชั่วโมงจิตอาสาเท่าไหร่?', answer: 'เกณฑ์ชั่วโมงกิจกรรมของแต่ละทุนการศึกษาอาจกำหนดไม่เหมือนกัน กรุณาตรวจสอบเงื่อนไขเฉพาะของทุนที่ได้รับจากประกาศทุนนั้นๆ หรือติดต่อเจ้าหน้าที่ทะเบียนเพื่อตรวจสอบยอดชั่วโมงสะสมของตนเอง', active: true },
  { id: 11, category: 'หน่วยกิตกิจกรรม', question: 'เข้าร่วมกิจกรรมไปแล้วแต่ทำไมหน่วยกิตยังไม่ขึ้นในระบบ?', answer: 'หลังจบกิจกรรม เจ้าหน้าที่ทะเบียนต้องใช้เวลาตรวจสอบหลักฐาน/รายชื่อก่อนบันทึกหน่วยกิตเข้าระบบ ปกติจะเห็นข้อมูลอัปเดตภายในไม่กี่วันทำการ หากเกิน 14 วันแล้วยังไม่ขึ้น สามารถติดต่อเจ้าหน้าที่ทะเบียนกิจกรรมได้โดยตรง', active: true },
  { id: 12, category: 'อื่นๆ', question: 'ผู้ปกครองต้องการสอบถามข้อมูลระบบการศึกษา/แนวปฏิบัติของคณะ ติดต่อใครได้บ้าง?', answer: 'สามารถติดต่อเจ้าหน้าที่ทะเบียนกิจกรรมของคณะได้โดยตรง หรือดูช่องทางติดต่อทั้งหมดได้ที่หน้า "ติดต่อเรา" ของระบบ', active: true },
];

/* ช่องทางติดต่ออาจารย์/เจ้าหน้าที่ — แชทบอทตอบด้วย SQL Direct Search ตรงจากตารางนี้ (ข้อมูลเปลี่ยนบ่อย ไม่เหมาะกับ embedding) */
const DEFAULT_CONTACTS = [
  { id: 1, name: 'สมบัติ วงศ์ทะเบียน', position: 'เจ้าหน้าที่ทะเบียนกิจกรรม', department: 'งานกิจการนักศึกษา คณะวิทยาศาสตร์', phone: '045-353-000 ต่อ 1234', email: 'sombat.w@ubu.ac.th', office: 'อาคาร 1 ชั้น 2 ห้อง 1201' },
  { id: 2, name: 'ดร.วิชัย งานวิชาการ', position: 'อาจารย์ที่ปรึกษาสโมสรนักศึกษา', department: 'สโมสรนักศึกษา คณะวิทยาศาสตร์', phone: '045-353-000 ต่อ 1245', email: 'wichai.a@ubu.ac.th', office: 'อาคาร 2 ชั้น 3 ห้อง 2301' },
  { id: 3, name: 'ธนกร ระบบดี', position: 'ผู้ดูแลระบบ SciU-Regis', department: 'งานเทคโนโลยีสารสนเทศ คณะวิทยาศาสตร์', phone: '045-353-000 ต่อ 1299', email: 'thanakorn.r@ubu.ac.th', office: 'อาคาร 1 ชั้น 1 ห้อง IT' },
];

const AdminDB = {
  users: (() => {
    const list = Store.get('adm-users', DEFAULT_USERS);
    
    // บังคับให้บัญชีที่มีสิทธิ์แอดมิน มีสิทธิ์แอดมินเพียงอย่างเดียวเท่านั้น
    list.forEach(u => {
      if (u.roles.includes('admin') && u.roles.length > 1) {
        u.roles = ['admin'];
      }
    });

    const hasAdmin = list.some(u => u.active && u.roles.includes('admin'));
    if (!hasAdmin) {
      let admin = list.find(u => u.username === 'admin.thanakorn' || u.email === 'thanakorn.r@ubu.ac.th');
      if (admin) {
        admin.active = true;
        admin.roles = ['admin'];
      } else {
        list.unshift({ id: 1, username: 'admin.thanakorn', name: 'ธนกร ระบบดี', email: 'thanakorn.r@ubu.ac.th', roles: ['admin'], active: true });
      }
      Store.set('adm-users', list);
    }
    return list;
  })(),
  faqs: Store.getSeeded('adm-faqs', DEFAULT_FAQS, { version: FAQS_SEED_VERSION }),
  contacts: Store.get('adm-contacts', DEFAULT_CONTACTS),
  whitelist: Store.get('adm-whitelist', DEFAULT_WHITELIST),
  save() {
    Store.set('adm-users', this.users);
    Store.set('adm-faqs', this.faqs);
    Store.set('adm-contacts', this.contacts);
    Store.set('adm-whitelist', this.whitelist);
  },
};

function allAuditLogs() {
  return [...Store.get('audit-extra', []), ...DEFAULT_AUDIT];
}

/* Audit log กลาง — registrar.js มีฟังก์ชันหน้าตาเดียวกันสำหรับฝั่งของตัวเอง คนละ actor default */
function appendAudit(action, detail, actor = 'admin.thanakorn') {
  const logs = Store.get('audit-extra', []);
  logs.unshift({ time: new Date().toISOString().slice(0, 16).replace('T', ' '), user: actor, action, detail, role: 'admin' });
  Store.set('audit-extra', logs);
}

function roleBadge(role) {
  const r = ROLE_LABELS[role] || ROLE_LABELS.student;
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${r.cls}">${r.text}</span>`;
}

/* ---------------- Admin Home --------------------------------------------- */
function initAdminHome() {
  document.getElementById('ah-stats').innerHTML =
    statsCard('ผู้ใช้ทั้งหมด', AdminDB.users.length, `${AdminDB.users.filter((u) => u.active).length} active`)
    + statsCard('กิจกรรมทั้งหมด', Store.get('events', []).length || 6, 'ในปีการศึกษา 2569')
    + statsCard('คำถามที่พบบ่อย', AdminDB.faqs.length, `${AdminDB.faqs.filter((f) => f.active).length} เปิดใช้งาน`, { valueCls: 'text-emerald-700' })
    + statsCard('ช่องทางติดต่อ', AdminDB.contacts.length, 'รายชื่อผู้ประสานงาน');

  document.getElementById('ah-audit').innerHTML = allAuditLogs().slice(0, 5).map((l) => `
    <div class="flex items-start gap-3 px-4 py-3">
      <span class="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5 w-24">${l.time.slice(5)}</span>
      <div class="min-w-0">
        <p class="text-xs font-mono font-semibold text-blue-700">${l.action}</p>
        <p class="text-xs text-slate-500 truncate mt-0.5">${l.detail}</p>
      </div>
    </div>`).join('');

  const slackSet = Store.get('adm-settings', null);
  const pendings = [
    { label: 'Slack Bot Token', ok: !!(slackSet && slackSet.slackToken), note: slackSet && slackSet.slackToken ? 'ตั้งค่าแล้ว' : 'ยังไม่ได้ตั้งค่า' },
    { label: 'LLM แชทบอท (คงที่)', ok: true, note: 'typhoon2.5-qwen3-4b (local)' },
    { label: 'อีเมลติดต่อ fallback', ok: true, note: 'registrar@sci.ubu.ac.th' },
  ];
  document.getElementById('ah-config').innerHTML = pendings.map((p) => `
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <span class="text-sm text-slate-700">${p.label}</span>
      ${p.ok ? statusBadge('ready', p.note) : statusBadge('pending', p.note)}
    </div>`).join('');

  const byRole = {};
  AdminDB.users.forEach((u) => u.roles.forEach((r) => { byRole[r] = (byRole[r] || 0) + 1; }));
  document.getElementById('ah-roles').innerHTML = Object.entries(ROLE_LABELS).map(([k, v]) => `
    <div class="flex items-center justify-between px-4 py-2.5">
      ${roleBadge(k)}
      <span class="text-sm font-mono font-semibold text-slate-800">${byRole[k] || 0} <span class="text-xs text-slate-400 font-sans font-normal">บัญชี</span></span>
    </div>`).join('');
}

/* ---------------- Screen 11: จัดการผู้ใช้ --------------------------------- */
function initUsersPage() {
  document.getElementById('user-search').addEventListener('input', renderUsersTable);
  renderUsersTable();
  document.getElementById('btn-add-user').addEventListener('click', () => openUserModal());
}

function renderUsersTable() {
  const q = (document.getElementById('user-search').value || '').toLowerCase();
  const list = AdminDB.users.filter((u) => (u.username + u.name + u.email).toLowerCase().includes(q));
  document.getElementById('users-table').innerHTML = list.length ? `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ผู้ใช้</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">อีเมล</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">บทบาท (หลายบทบาทได้)</th>
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</th>
        <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ดำเนินการ</th>
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map((u) => `
          <tr class="hover:bg-slate-50/50 transition ${u.active ? '' : 'opacity-60'}">
            <td class="px-4 py-3">
              <p class="text-sm font-medium text-slate-800">${u.name}</p>
              <p class="text-xs font-mono text-slate-400">${u.username}</p>
            </td>
            <td class="px-4 py-3 text-sm text-slate-600">${u.email}</td>
            <td class="px-4 py-3"><div class="flex flex-wrap gap-1">${u.roles.map(roleBadge).join('')}</div></td>
            <td class="px-4 py-3 text-center">${u.active ? statusBadge('ready', 'Active') : statusBadge('rejected', 'Inactive')}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <button onclick="openUserModal(${u.id})" class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mr-3">${icon('edit', 'w-4 h-4')} แก้ไข</button>
              <button onclick="toggleUser(${u.id})" class="inline-flex items-center gap-1 text-sm ${u.active ? 'text-red-500 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-800'} font-medium">
                ${icon(u.active ? 'x-circle' : 'check-circle', 'w-4 h-4')} ${u.active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
              </button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>` : emptyState('ไม่พบผู้ใช้ที่ค้นหา');
}

function toggleUser(id) {
  const u = AdminDB.users.find((x) => x.id === id);
  if (!u) return;
  if (u.active) {
    showConfirmDialog({
      title: `ปิดใช้งานบัญชี ${u.username}?`,
      bullets: ['ผู้ใช้จะเข้าสู่ระบบไม่ได้ทันที', 'ข้อมูลและประวัติยังอยู่ครบ เปิดใช้งานคืนได้', 'บันทึกลง Audit Log'],
      tone: 'danger', confirmText: 'ปิดใช้งาน',
      onConfirm: () => {
        u.active = false;
        AdminDB.save();
        showToast(`ปิดใช้งานบัญชี ${u.username} แล้ว`, 'warning');
        renderUsersTable();
      },
    });
  } else {
    u.active = true;
    AdminDB.save();
    showToast(`เปิดใช้งานบัญชี ${u.username} แล้ว`);
    renderUsersTable();
  }
}

function openUserModal(id) {
  const u = id ? AdminDB.users.find((x) => x.id === id) : null;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[55] p-4';
  overlay.innerHTML = `
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
      <h3 class="text-lg font-semibold text-slate-900">${u ? 'แก้ไขบัญชี ' + u.username : 'สร้างบัญชีใหม่'}</h3>
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-slate-700" for="um-name">ชื่อ-นามสกุล</label>
        <input id="um-name" value="${u ? u.name : ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-slate-700" for="um-email">อีเมล</label>
        <input id="um-email" type="email" value="${u ? u.email : ''}" placeholder="name@ubu.ac.th" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
      </div>
      <div class="space-y-1.5">
        <p class="text-sm font-medium text-slate-700">บทบาท (เลือกได้มากกว่า 1 — บทบาทคือสิทธิ์ ไม่ใช่ 1 บัญชี : 1 บทบาท)</p>
        <div class="grid grid-cols-2 gap-2">
          ${Object.entries(ROLE_LABELS).map(([k, v]) => `
            <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" class="um-role rounded border-slate-300" value="${k}" ${u && u.roles.includes(k) ? 'checked' : ''}>
              <span class="text-sm text-slate-700">${v.text}</span>
            </label>`).join('')}
        </div>
      </div>
      <div class="flex gap-3 pt-2">
        <button id="um-cancel" class="flex-1 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition">ยกเลิก</button>
        <button id="um-save" class="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-lg">บันทึก</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  // Enforce mutual exclusivity of admin role
  const roleCheckboxes = overlay.querySelectorAll('.um-role');
  roleCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      if (e.target.value === 'admin' && e.target.checked) {
        roleCheckboxes.forEach(otherCb => {
          if (otherCb.value !== 'admin') otherCb.checked = false;
        });
      } else if (e.target.checked) {
        roleCheckboxes.forEach(otherCb => {
          if (otherCb.value === 'admin') otherCb.checked = false;
        });
      }
    });
  });

  overlay.querySelector('#um-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#um-save').addEventListener('click', () => {
    const name = overlay.querySelector('#um-name').value.trim();
    const email = overlay.querySelector('#um-email').value.trim();
    const roles = [...overlay.querySelectorAll('.um-role:checked')].map((c) => c.value);
    if (!name || !email || !roles.length) { showToast('กรอกชื่อ อีเมล และเลือกบทบาทอย่างน้อย 1 บทบาท', 'error'); return; }
    if (u) {
      u.name = name; u.email = email; u.roles = roles;
    } else {
      AdminDB.users.push({ id: Date.now(), username: email.split('@')[0], name, email, roles, active: true });
    }
    AdminDB.save();
    overlay.remove();
    showToast(u ? 'บันทึกการแก้ไขแล้ว' : 'สร้างบัญชีใหม่แล้ว');
    renderUsersTable();
  });
}

/* ---------------- Screen 12: ตั้งค่าเทคนิค -------------------------------- */
function initSettingsPage() {
  const s = Store.get('adm-settings', { slackToken: '', email: 'registrar@sci.ubu.ac.th', slackContactLink: 'https://sciubu.slack.com/archives/C0REGISTRAR' });
  document.getElementById('set-token').value = s.slackToken ? '••••••••••••' + s.slackToken.slice(-4) : '';
  document.getElementById('set-email').value = s.email;
  document.getElementById('set-slack-link').value = s.slackContactLink || 'https://sciubu.slack.com/archives/C0REGISTRAR';

  const templateKey = 'excel-template';
  const defaultTemplate = {
    fileName: 'UBU_SAC_Default_Template.xlsx',
    uploadedAt: '2026-07-01 10:30',
    columns: ['รหัสนักศึกษา', 'ชื่อ', 'นามสกุล', 'หน่วยกิต']
  };
  const t = Store.get(templateKey, defaultTemplate);

  document.getElementById('template-file-name').textContent = t.fileName;
  document.getElementById('template-upload-time').textContent = `อัปโหลดเมื่อ: ${t.uploadedAt}`;
  document.getElementById('set-template-columns').value = t.columns.join(', ');

  // อัปโหลดไฟล์จำลอง
  const fileInp = document.getElementById('set-template-file');
  document.getElementById('btn-upload-template').addEventListener('click', () => fileInp.click());
  fileInp.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
      document.getElementById('template-file-name').textContent = file.name;
      document.getElementById('template-upload-time').textContent = `อัปโหลดเมื่อ: ${nowStr} (ยังไม่ได้บันทึก)`;
      showToast(`ตรวจพบเทมเพลต: ${file.name} เรียบร้อย (กดบันทึกเพื่อยืนยัน)`, 'info');
    }
  });

  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const token = document.getElementById('set-token').value.trim();
    Store.set('adm-settings', {
      slackToken: token.startsWith('•') ? s.slackToken : token,
      email: document.getElementById('set-email').value.trim(),
      slackContactLink: document.getElementById('set-slack-link').value.trim(),
    });

    const columnsStr = document.getElementById('set-template-columns').value;
    const columns = columnsStr.split(',').map(c => c.trim()).filter(Boolean);
    const uploadedTimeLabel = document.getElementById('template-upload-time').textContent;
    const isNewUpload = uploadedTimeLabel.includes('(ยังไม่ได้บันทึก)');
    let finalUploadedAt = t.uploadedAt;
    if (isNewUpload) {
      finalUploadedAt = uploadedTimeLabel.replace('อัปโหลดเมื่อ: ', '').replace(' (ยังไม่ได้บันทึก)', '');
    }

    Store.set(templateKey, {
      fileName: document.getElementById('template-file-name').textContent,
      uploadedAt: finalUploadedAt,
      columns: columns
    });

    document.getElementById('template-upload-time').textContent = `อัปโหลดเมื่อ: ${finalUploadedAt}`;
    showToast('บันทึกการตั้งค่าระบบและเทมเพลต Excel แล้ว');
    document.getElementById('set-token').value = token ? '••••••••••••' + token.slice(-4) : '';
  });

  document.getElementById('btn-token-eye').addEventListener('click', () => {
    const inp = document.getElementById('set-token');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });
}

/* ---------------- Screen 13: Audit Log Viewer ---------------------------- */
function initAuditPage() {
  const logs = allAuditLogs();
  const users = [...new Set(logs.map((l) => l.user))];
  const actions = [...new Set(logs.map((l) => l.action))];
  const roles = [...new Set(logs.map((l) => l.role).filter(Boolean))];
  document.getElementById('audit-user').innerHTML = '<option value="">ผู้ใช้ทั้งหมด</option>' + users.map((u) => `<option>${u}</option>`).join('');
  document.getElementById('audit-action').innerHTML = '<option value="">ทุกประเภทการกระทำ</option>' + actions.map((a) => `<option>${a}</option>`).join('');
  // FR-F5: กรองตาม role ด้วย ไม่ใช่แค่รายชื่อผู้ใช้รายบุคคล
  const roleFilterEl = document.getElementById('audit-role');
  if (roleFilterEl) {
    roleFilterEl.innerHTML = '<option value="">ทุกบทบาท (Role)</option>'
      + roles.map((r) => `<option value="${r}">${(ROLE_LABELS[r] || { text: r }).text}</option>`).join('');
  }
  ['audit-user', 'audit-action', 'audit-role', 'audit-date-from', 'audit-date-to'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderAuditTable);
  });
  const searchEl = document.getElementById('audit-search');
  if (searchEl) searchEl.addEventListener('input', renderAuditTable);
  renderAuditTable();
}

function renderAuditTable() {
  const user = document.getElementById('audit-user').value;
  const action = document.getElementById('audit-action').value;
  const role = document.getElementById('audit-role')?.value || '';
  const dateFrom = document.getElementById('audit-date-from')?.value || '';
  const dateTo = document.getElementById('audit-date-to')?.value || '';
  const q = (document.getElementById('audit-search').value || '').toLowerCase();
  const list = allAuditLogs().filter((l) => {
    const logDate = l.time.slice(0, 10); // YYYY-MM-DD
    return (!user || l.user === user)
      && (!action || l.action === action)
      && (!role || l.role === role)
      && (!dateFrom || logDate >= dateFrom)
      && (!dateTo || logDate <= dateTo)
      && (!q || (l.detail + l.action).toLowerCase().includes(q));
  });

  document.getElementById('audit-count').textContent = `${list.length} รายการ`;
  document.getElementById('audit-table').innerHTML = list.length ? `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">เวลา</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ผู้ใช้</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">การกระทำ</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">รายละเอียด</th>
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map((l) => `
          <tr class="hover:bg-slate-50/50 transition">
            <td class="px-4 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">${l.time}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <p class="text-sm font-mono text-slate-700">${l.user}</p>
              <div class="mt-0.5">${roleBadge(l.role)}</div>
            </td>
            <td class="px-4 py-3"><span class="text-xs font-mono font-semibold text-blue-700 bg-blue-50 rounded-lg px-2 py-1">${l.action}</span></td>
            <td class="px-4 py-3 text-sm text-slate-600">${l.detail}</td>
          </tr>`).join('')}
      </tbody>
    </table>` : emptyState('ไม่พบ log ตามเงื่อนไขที่กรอง');
}

/* ---------------- Screen 14: จัดการ FAQ (Q&A) แชทบอท ---------------------
 * Hybrid FAQ RAG + SQL Direct Search: คำถามทั่วไป/ไม่ตรงกับข้อมูลกิจกรรม -> ค้นด้วย semantic search (bge-m3) บนตารางนี้
 * ไม่มี AI Provider ให้สลับแล้ว — LLM คงที่ (typhoon2.5-qwen3-4b, local เท่านั้น) ตั้งค่าที่นี่จึงเหลือแค่เนื้อหา FAQ */
const FAQ_CATEGORIES = ['หน่วยกิตกิจกรรม', 'การจัดกิจกรรม', 'การส่งหลักฐาน', 'กยศ.', 'ทุนการศึกษา', 'บัญชีผู้ใช้', 'อื่นๆ'];

function initFaqPage() {
  renderFaqTable();
}

function renderFaqTable() {
  const q = (document.getElementById('faq-search').value || '').toLowerCase();
  const list = AdminDB.faqs.filter((f) => (f.category + f.question + f.answer).toLowerCase().includes(q));
  document.getElementById('faq-table').innerHTML = list.length ? `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">หมวดหมู่</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">คำถาม / คำตอบ</th>
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</th>
        <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ดำเนินการ</th>
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map((f) => `
          <tr class="hover:bg-slate-50/50 transition">
            <td class="px-4 py-3 whitespace-nowrap"><span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">${f.category}</span></td>
            <td class="px-4 py-3 max-w-lg">
              <p class="text-sm font-medium text-slate-800">${f.question}</p>
              <p class="text-xs text-slate-400 mt-0.5 line-clamp-2">${f.answer}</p>
            </td>
            <td class="px-4 py-3 text-center">
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" onchange="toggleFaqActive(${f.id})" ${f.active ? 'checked' : ''} class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                <span class="text-xs ${f.active ? 'text-emerald-600' : 'text-slate-400'} font-medium">${f.active ? 'ใช้งาน' : 'ปิดใช้งาน'}</span>
              </label>
            </td>
            <td class="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
              <button onclick="openFaqModal(${f.id})" class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">${icon('edit', 'w-3.5 h-3.5')} แก้ไข</button>
              <button onclick="deleteFaq(${f.id})" class="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">${icon('trash-2', 'w-3.5 h-3.5')} ลบ</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>` : emptyState('ไม่พบ FAQ ตามเงื่อนไขที่กรอง', 'book-open');
}

function toggleFaqActive(id) {
  const f = AdminDB.faqs.find((x) => x.id === id);
  if (!f) return;
  f.active = !f.active;
  AdminDB.save();
  appendAudit(f.active ? 'faq_enabled' : 'faq_disabled', `${f.active ? 'เปิด' : 'ปิด'}ใช้งาน FAQ "${f.question}"`);
  renderFaqTable();
  showToast(f.active ? 'เปิดใช้งาน FAQ แล้ว — บอทจะค้นเจอคำถามนี้' : 'ปิดใช้งาน FAQ แล้ว — บอทจะไม่ใช้คำถามนี้ตอบอีก', f.active ? 'success' : 'warning');
}

function deleteFaq(id) {
  const f = AdminDB.faqs.find((x) => x.id === id);
  if (!f) return;
  showConfirmDialog({
    title: `ลบ FAQ นี้?`,
    message: f.question,
    bullets: ['ลบคำถาม-คำตอบและ embedding ที่เกี่ยวข้องออกจาก pgvector', 'แชทบอทจะไม่ใช้เนื้อหานี้ตอบคำถามอีก'],
    tone: 'danger', confirmText: 'ลบ FAQ',
    onConfirm: () => {
      AdminDB.faqs = AdminDB.faqs.filter((x) => x.id !== id);
      AdminDB.save();
      appendAudit('faq_deleted', `ลบ FAQ "${f.question}"`);
      showToast('ลบ FAQ แล้ว', 'warning');
      renderFaqTable();
    },
  });
}

function openFaqModal(id) {
  const f = id ? AdminDB.faqs.find((x) => x.id === id) : null;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[55] p-4';
  overlay.innerHTML = `
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="text-base font-bold text-slate-900">${f ? 'แก้ไข FAQ' : 'เพิ่มคำถามที่พบบ่อย'}</h3>
        <button id="fm-close" class="text-slate-400 hover:text-slate-600 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-slate-700" for="fm-category">หมวดหมู่</label>
        <select id="fm-category" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
          ${FAQ_CATEGORIES.map((c) => `<option value="${c}" ${f && f.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-slate-700" for="fm-question">คำถาม</label>
        <input id="fm-question" value="${f ? f.question : ''}" placeholder="เช่น หนึ่งวันได้หน่วยกิตสูงสุดกี่หน่วย?" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-slate-700" for="fm-answer">คำตอบ</label>
        <textarea id="fm-answer" rows="4" placeholder="คำตอบที่บอทจะใช้ตอบนักศึกษา" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 leading-relaxed">${f ? f.answer : ''}</textarea>
      </div>
      <label class="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
        <input type="checkbox" id="fm-active" ${!f || f.active ? 'checked' : ''} class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
        <span>เปิดใช้งานทันที (บอทจะค้นเจอคำถามนี้)</span>
      </label>
      <div class="flex gap-3 pt-2">
        <button id="fm-cancel" class="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-sm">ยกเลิก</button>
        <button id="fm-save" class="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-800 transition shadow-lg text-sm">บันทึก FAQ</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('#fm-close').addEventListener('click', close);
  overlay.querySelector('#fm-cancel').addEventListener('click', close);
  overlay.querySelector('#fm-save').addEventListener('click', () => {
    const category = overlay.querySelector('#fm-category').value;
    const question = overlay.querySelector('#fm-question').value.trim();
    const answer = overlay.querySelector('#fm-answer').value.trim();
    const active = overlay.querySelector('#fm-active').checked;
    if (!question || !answer) { showToast('กรุณากรอกทั้งคำถามและคำตอบ', 'error'); return; }

    if (f) {
      f.category = category; f.question = question; f.answer = answer; f.active = active;
      appendAudit('faq_updated', `แก้ไข FAQ "${question}"`);
    } else {
      AdminDB.faqs.push({ id: Date.now(), category, question, answer, active });
      appendAudit('faq_added', `เพิ่ม FAQ ใหม่หมวด "${category}": "${question}"`);
    }
    AdminDB.save();
    close();
    showToast(f ? 'บันทึกการแก้ไข FAQ แล้ว' : 'เพิ่ม FAQ ใหม่แล้ว — พร้อมให้บอทค้นหาได้ทันที');
    renderFaqTable();
  });
}

/* ---------------- Screen 15: จัดการช่องทางติดต่อ -------------------------
 * ข้อมูลอาจารย์/เจ้าหน้าที่ผู้ประสานงาน — แชทบอทตอบด้วย SQL Direct Search ตรงจากตารางนี้เสมอ (เปลี่ยนบ่อย ไม่ทำ embedding) */
function initContactsPage() {
  renderContactsTable();
}

function renderContactsTable() {
  const q = (document.getElementById('contact-search').value || '').toLowerCase();
  const list = AdminDB.contacts.filter((c) => (c.name + c.position + c.department).toLowerCase().includes(q));
  document.getElementById('contact-table').innerHTML = list.length ? `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล / ตำแหน่ง</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">หน่วยงาน</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ติดต่อ</th>
        <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ดำเนินการ</th>
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map((c) => `
          <tr class="hover:bg-slate-50/50 transition">
            <td class="px-4 py-3">
              <p class="text-sm font-medium text-slate-800">${c.name}</p>
              <p class="text-xs text-slate-400">${c.position}</p>
            </td>
            <td class="px-4 py-3 text-sm text-slate-600">${c.department}${c.office ? `<p class="text-xs text-slate-400 mt-0.5">${c.office}</p>` : ''}</td>
            <td class="px-4 py-3 text-sm text-slate-600">
              <p class="font-mono text-xs">${c.phone || '-'}</p>
              <p class="text-xs text-blue-600">${c.email || '-'}</p>
            </td>
            <td class="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
              <button onclick="openContactModal(${c.id})" class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">${icon('edit', 'w-3.5 h-3.5')} แก้ไข</button>
              <button onclick="deleteContact(${c.id})" class="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">${icon('trash-2', 'w-3.5 h-3.5')} ลบ</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>` : emptyState('ยังไม่มีช่องทางติดต่อ — เพิ่มรายชื่อผู้ประสานงาน', 'phone');
}

function deleteContact(id) {
  const c = AdminDB.contacts.find((x) => x.id === id);
  if (!c) return;
  showConfirmDialog({
    title: `ลบช่องทางติดต่อ "${c.name}"?`,
    bullets: ['ลบข้อมูลติดต่อออกจากระบบ', 'แชทบอทจะไม่แนะนำช่องทางนี้ให้นักศึกษาอีก'],
    tone: 'danger', confirmText: 'ลบ',
    onConfirm: () => {
      AdminDB.contacts = AdminDB.contacts.filter((x) => x.id !== id);
      AdminDB.save();
      appendAudit('contact_deleted', `ลบช่องทางติดต่อ "${c.name}"`);
      showToast('ลบช่องทางติดต่อแล้ว', 'warning');
      renderContactsTable();
    },
  });
}

function openContactModal(id) {
  const c = id ? AdminDB.contacts.find((x) => x.id === id) : null;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[55] p-4';
  overlay.innerHTML = `
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="text-base font-bold text-slate-900">${c ? 'แก้ไขช่องทางติดต่อ' : 'เพิ่มช่องทางติดต่อ'}</h3>
        <button id="cm-close" class="text-slate-400 hover:text-slate-600 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-slate-700" for="cm-name">ชื่อ-นามสกุล</label>
          <input id="cm-name" value="${c ? c.name : ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-slate-700" for="cm-position">ตำแหน่ง</label>
          <input id="cm-position" value="${c ? c.position : ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
        </div>
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-slate-700" for="cm-department">หน่วยงาน</label>
        <input id="cm-department" value="${c ? c.department : ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-slate-700" for="cm-phone">เบอร์โทร</label>
          <input id="cm-phone" value="${c ? c.phone || '' : ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-slate-700" for="cm-email">อีเมล</label>
          <input id="cm-email" value="${c ? c.email || '' : ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
        </div>
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-slate-700" for="cm-office">ห้องทำงาน/อาคาร</label>
        <input id="cm-office" value="${c ? c.office || '' : ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
      </div>
      <div class="flex gap-3 pt-2">
        <button id="cm-cancel" class="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-sm">ยกเลิก</button>
        <button id="cm-save" class="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-800 transition shadow-lg text-sm">บันทึก</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('#cm-close').addEventListener('click', close);
  overlay.querySelector('#cm-cancel').addEventListener('click', close);
  overlay.querySelector('#cm-save').addEventListener('click', () => {
    const name = overlay.querySelector('#cm-name').value.trim();
    const position = overlay.querySelector('#cm-position').value.trim();
    const department = overlay.querySelector('#cm-department').value.trim();
    const phone = overlay.querySelector('#cm-phone').value.trim();
    const email = overlay.querySelector('#cm-email').value.trim();
    const office = overlay.querySelector('#cm-office').value.trim();
    if (!name || !position) { showToast('กรุณากรอกชื่อและตำแหน่งอย่างน้อย', 'error'); return; }

    if (c) {
      c.name = name; c.position = position; c.department = department; c.phone = phone; c.email = email; c.office = office;
      appendAudit('contact_updated', `แก้ไขช่องทางติดต่อ "${name}"`);
    } else {
      AdminDB.contacts.push({ id: Date.now(), name, position, department, phone, email, office });
      appendAudit('contact_added', `เพิ่มช่องทางติดต่อ "${name}" (${position})`);
    }
    AdminDB.save();
    close();
    showToast(c ? 'บันทึกการแก้ไขช่องทางติดต่อแล้ว' : 'เพิ่มช่องทางติดต่อแล้ว');
    renderContactsTable();
  });
}

/* ---------------- Whitelist / Roster Management Functions ---------------- */
function renderWhitelistTable() {
  const q = (document.getElementById('user-search').value || '').toLowerCase();
  const list = AdminDB.whitelist.filter((w) => 
    (w.name + (w.studentCode || '') + (w.email || '')).toLowerCase().includes(q)
  );

  document.getElementById('users-table').innerHTML = list.length ? `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ประเภท</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">คีย์ระบุตัวตน</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">รายละเอียด / สิทธิ์</th>
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ผูก Google OAuth</th>
        <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ดำเนินการ</th>
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map((w) => `
          <tr class="hover:bg-slate-50/50 transition">
            <td class="px-4 py-3 whitespace-nowrap">
              ${w.type === 'student' 
                ? '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">Student Roster</span>'
                : '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">Staff Whitelist</span>'}
            </td>
            <td class="px-4 py-3 font-mono text-sm text-slate-700">
              ${w.type === 'student' ? w.studentCode : w.email}
            </td>
            <td class="px-4 py-3 text-sm text-slate-800 font-medium">${w.name}</td>
            <td class="px-4 py-3">
              ${w.type === 'student' 
                ? `<span class="text-xs text-slate-500">${w.major} (ชั้นปีที่ ${w.year})</span>`
                : `<div class="flex flex-wrap gap-1">${w.roles.map(roleBadge).join('')}</div>`}
            </td>
            <td class="px-4 py-3 text-center">
              ${w.connected 
                ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">' + icon('check', 'w-3 h-3 mr-1') + 'เชื่อมโยงแล้ว</span>' 
                : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">รอเข้าใช้งานครั้งแรก</span>'}
            </td>
            <td class="px-4 py-3 text-right whitespace-nowrap space-x-1">
              <button onclick="openWhitelistModal(${w.id})" class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold">${icon('edit', 'w-3.5 h-3.5')} แก้ไข</button>
              <button onclick="deleteWhitelistItem(${w.id})" class="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold">${icon('trash-2', 'w-3.5 h-3.5')} ลบ</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>` : emptyState('ไม่พบข้อมูล Whitelist/Roster ล่วงหน้า', 'users');
}

function deleteWhitelistItem(id) {
  const w = AdminDB.whitelist.find((x) => x.id === id);
  if (!w) return;
  showConfirmDialog({
    title: `ลบสิทธิ์เชื่อมโยงล่วงหน้า?`,
    bullets: [
      `ข้อมูลของ ${w.name} จะถูกนำออกจากรายการ Whitelist`,
      w.type === 'student' ? `นักศึกษารหัส ${w.studentCode} จะไม่สามารถผูกบัญชี Google เพื่อล็อกอินได้` : `เจ้าหน้าที่อีเมล ${w.email} จะล็อกอินไม่ได้`,
      'ไม่มีผลกระทบต่อบัญชีที่ได้ทำการเชื่อมโยงเข้าใช้ไปก่อนหน้านี้แล้ว'
    ],
    tone: 'danger',
    confirmText: 'ลบสิทธิ์ล่วงหน้า',
    onConfirm: () => {
      AdminDB.whitelist = AdminDB.whitelist.filter((x) => x.id !== id);
      AdminDB.save();
      showToast('ลบรายการ Whitelist เรียบร้อยแล้ว', 'warning');
      renderWhitelistTable();
    }
  });
}

function openWhitelistModal(id) {
  const w = id ? AdminDB.whitelist.find((x) => x.id === id) : null;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[55] p-4';
  
  overlay.innerHTML = `
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="text-base font-bold text-slate-900">${w ? 'แก้ไขข้อมูลสิทธิ์ล่วงหน้า' : 'เพิ่มรายชื่อลงทะเบียนสิทธิ์ล่วงหน้า'}</h3>
        <button id="wm-modal-close" class="text-slate-400 hover:text-slate-600 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <!-- เลือกประเภท -->
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-slate-700" for="wm-type">ประเภทผู้ใช้ที่จะได้รับสิทธิ์</label>
        <select id="wm-type" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600" ${w ? 'disabled' : ''}>
          <option value="student" ${w && w.type === 'student' ? 'selected' : ''}>นักศึกษา (Student Roster)</option>
          <option value="staff" ${w && w.type === 'staff' ? 'selected' : ''}>เจ้าหน้าที่ / คณาจารย์ (Staff Whitelist)</option>
        </select>
      </div>

      <!-- ฟิลด์ชื่อและสกุล -->
      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-slate-700" for="wm-name">ชื่อ-นามสกุล</label>
        <input id="wm-name" value="${w ? w.name : ''}" placeholder="สมเกียรติ ยิ่งดี" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
      </div>

      <!-- ส่วนของนักศึกษา -->
      <div id="wm-student-fields" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-slate-700" for="wm-code">รหัสนักศึกษา (11 หลัก)</label>
          <input id="wm-code" value="${w ? w.studentCode || '' : ''}" placeholder="66114400123" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5 relative">
            <label class="text-xs font-semibold text-slate-700">สาขาวิชา</label>
            <button id="wm-major-btn" type="button" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 flex items-center justify-between">
              <span id="wm-major-label" class="truncate text-slate-500">เลือกสาขา...</span>
              <span class="text-slate-400 shrink-0 text-[10px]">&#9662;</span>
            </button>
            <div id="wm-major-dropdown" class="hidden absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 space-y-0.5">
              <!-- Dynamically Populated -->
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700" for="wm-year">ชั้นปี</label>
            <input id="wm-year" type="number" min="1" max="6" value="${w ? w.year || 1 : 1}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
          </div>
        </div>
      </div>

      <!-- ส่วนของเจ้าหน้าที่ -->
      <div id="wm-staff-fields" class="space-y-4 hidden">
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-slate-700" for="wm-email">อีเมลสโมสร/อาจารย์ (@ubu.ac.th)</label>
          <input id="wm-email" value="${w ? w.email || '' : ''}" placeholder="somkiat.y@ubu.ac.th" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
        </div>
        <div class="space-y-1.5">
          <p class="text-xs font-semibold text-slate-700">บทบาทสิทธิ์เจ้าหน้าที่ (เลือกได้หลายอย่าง)</p>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" class="wm-role rounded border-slate-300 text-blue-600 focus:ring-blue-500" value="registrar" ${w && w.roles && w.roles.includes('registrar') ? 'checked' : ''}>
              <span class="text-xs font-medium text-slate-700">Registrar</span>
            </label>
            <label class="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" class="wm-role rounded border-slate-300 text-blue-600 focus:ring-blue-500" value="lead_org" ${w && w.roles && w.roles.includes('lead_org') ? 'checked' : ''}>
              <span class="text-xs font-medium text-slate-700">Lead Org</span>
            </label>
            <label class="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" class="wm-role rounded border-slate-300 text-blue-600 focus:ring-blue-500" value="field_staff" ${w && w.roles && w.roles.includes('field_staff') ? 'checked' : ''}>
              <span class="text-xs font-medium text-slate-700">Field Staff</span>
            </label>
            <label class="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" class="wm-role rounded border-slate-300 text-blue-600 focus:ring-blue-500" value="admin" ${w && w.roles && w.roles.includes('admin') ? 'checked' : ''}>
              <span class="text-xs font-medium text-slate-700">Admin</span>
            </label>
          </div>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <button id="wm-cancel" class="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-sm">ยกเลิก</button>
        <button id="wm-save" class="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-800 transition shadow-lg text-sm">บันทึกสิทธิ์</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  const typeSelect = overlay.querySelector('#wm-type');
  const studentFields = overlay.querySelector('#wm-student-fields');
  const staffFields = overlay.querySelector('#wm-staff-fields');

  function toggleFields() {
    if (typeSelect.value === 'student') {
      studentFields.classList.remove('hidden');
      staffFields.classList.add('hidden');
    } else {
      studentFields.classList.add('hidden');
      staffFields.classList.remove('hidden');
    }
  }

  typeSelect.addEventListener('change', toggleFields);
  toggleFields();

  // ---- Major Multiselect Dropdown ----
  const currentMajors = w && w.major ? w.major.split(',').map(s => s.trim()).filter(Boolean) : [];
  const majorBtn = overlay.querySelector('#wm-major-btn');
  const majorLabel = overlay.querySelector('#wm-major-label');
  const majorDropdown = overlay.querySelector('#wm-major-dropdown');

  // Populate checkboxes
  majorDropdown.innerHTML = SCIENCE_MAJORS.map(m => `
    <label class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
      <input type="checkbox" class="wm-major-cb rounded border-slate-300 text-blue-600 focus:ring-blue-500" value="${m}" ${currentMajors.includes(m) ? 'checked' : ''}>
      <span class="text-xs text-slate-700">${m}</span>
    </label>`).join('');

  function updateMajorLabel() {
    const checked = [...overlay.querySelectorAll('.wm-major-cb:checked')].map(cb => cb.value);
    if (checked.length === 0) {
      majorLabel.textContent = 'เลือกสาขา...';
      majorLabel.className = 'truncate text-slate-400';
    } else if (checked.length === 1) {
      majorLabel.textContent = checked[0];
      majorLabel.className = 'truncate text-slate-800 font-medium';
    } else {
      majorLabel.textContent = `เลือกแล้ว ${checked.length} สาขา`;
      majorLabel.className = 'truncate text-blue-600 font-medium';
    }
  }
  updateMajorLabel();

  majorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    majorDropdown.classList.toggle('hidden');
  });
  majorDropdown.addEventListener('change', updateMajorLabel);
  // Close dropdown when clicking outside
  overlay.addEventListener('click', (e) => {
    if (!majorBtn.contains(e.target) && !majorDropdown.contains(e.target)) {
      majorDropdown.classList.add('hidden');
    }
  });
  // ---- End Major Multiselect ----

  // Enforce mutual exclusivity of admin role in whitelist modal
  const whitelistRoleCheckboxes = overlay.querySelectorAll('.wm-role');
  whitelistRoleCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      if (e.target.value === 'admin' && e.target.checked) {
        whitelistRoleCheckboxes.forEach(otherCb => {
          if (otherCb.value !== 'admin') otherCb.checked = false;
        });
      } else if (e.target.checked) {
        whitelistRoleCheckboxes.forEach(otherCb => {
          if (otherCb.value === 'admin') otherCb.checked = false;
        });
      }
    });
  });

  const close = () => overlay.remove();
  overlay.querySelector('#wm-modal-close').addEventListener('click', close);
  overlay.querySelector('#wm-cancel').addEventListener('click', close);
  overlay.querySelector('#wm-save').addEventListener('click', () => {
    const type = typeSelect.value;
    const name = overlay.querySelector('#wm-name').value.trim();
    
    if (!name) {
      showToast('กรุณาระบุชื่อ-นามสกุล', 'error');
      return;
    }

    if (type === 'student') {
      const code = overlay.querySelector('#wm-code').value.trim();
      const selectedMajors = [...overlay.querySelectorAll('.wm-major-cb:checked')].map(cb => cb.value);
      const major = selectedMajors.join(', ');
      const year = parseInt(overlay.querySelector('#wm-year').value, 10);
      
      if (!code || code.length !== 11) {
        showToast('กรุณากรอกรหัสนักศึกษาให้ครบ 11 หลัก', 'error');
        return;
      }

      if (w) {
        w.name = name;
        w.studentCode = code;
        w.major = major;
        w.year = year;
      } else {
        AdminDB.whitelist.push({
          id: Date.now(),
          type: 'student',
          studentCode: code,
          name,
          major: major || 'วิทยาการคอมพิวเตอร์',
          year: year || 1,
          roles: ['student'],
          connected: false
        });
      }
    } else {
      const email = overlay.querySelector('#wm-email').value.trim();
      const roles = [...overlay.querySelectorAll('.wm-role:checked')].map(cb => cb.value);

      if (!email || !email.includes('@')) {
        showToast('กรุณากรอกอีเมล @ubu.ac.th ให้ถูกต้อง', 'error');
        return;
      }
      if (!roles.length) {
        showToast('กรุณาเลือกบทบาทสิทธิ์เจ้าหน้าที่อย่างน้อย 1 บทบาท', 'error');
        return;
      }

      if (w) {
        w.name = name;
        w.email = email;
        w.roles = roles;
      } else {
        AdminDB.whitelist.push({
          id: Date.now(),
          type: 'staff',
          email,
          name,
          roles,
          connected: false
        });
      }
    }

    AdminDB.save();
    close();
    showToast(w ? 'ปรับปรุงข้อมูลสิทธิ์ล่วงหน้าสำเร็จ' : 'เพิ่มรายชื่อลงทะเบียนสิทธิ์ล่วงหน้าแล้ว');
    renderWhitelistTable();
  });
}

/* ---------------- Bulk Import Excel / CSV Functionality ---------------- */
function openImportModal() {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[55] p-4';
  
  overlay.innerHTML = `
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 flex flex-col space-y-4 max-h-[90vh]">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3 font-sans">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span id="im-title-icon"></span> นำเข้ารายชื่อผู้ใช้งาน (Bulk Import Excel / CSV)
        </h3>
        <button id="im-modal-close" class="text-slate-400 hover:text-slate-600 transition" aria-label="ปิด">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
        <!-- ประเภทและปลายทาง -->
        <div class="space-y-3">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700" for="im-type">ประเภทข้อมูลในไฟล์</label>
            <select id="im-type" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
              <option value="student">นักศึกษา (Student Roster)</option>
              <option value="staff">เจ้าหน้าที่ / คณาจารย์ (Staff Whitelist)</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700" for="im-destination">ปลายทางการนำเข้า</label>
            <select id="im-destination" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
              <option value="whitelist">รายชื่อลงทะเบียน & Whitelist (รอเข้าใช้งานครั้งแรก)</option>
              <option value="active">บัญชีที่เปิดใช้งานแล้ว (Active Accounts ทันที)</option>
            </select>
          </div>
        </div>

        <!-- เทมเพลตตัวอย่าง -->
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
          <div>
            <h4 class="text-xs font-bold text-slate-700 mb-1">ดาวน์โหลดเทมเพลตตัวอย่าง</h4>
            <p class="text-[11px] text-slate-500">กรุณาจัดโครงสร้างไฟล์ Excel หรือ CSV ให้ตรงตามเทมเพลตเพื่อให้ระบบสแกนข้อมูลได้อย่างถูกต้อง</p>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <button id="im-btn-dl-xlsx" type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition shadow-sm">
              <span id="im-dl-xlsx-icon"></span> Excel (.xlsx)
            </button>
            <button id="im-btn-dl-csv" type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm">
              <span id="im-dl-csv-icon"></span> CSV (.csv)
            </button>
          </div>
        </div>
      </div>

      <!-- Drag & Drop Zone -->
      <div id="im-dropzone" class="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition font-sans">
        <span id="im-upload-icon" class="text-slate-400 mb-2"></span>
        <p class="text-sm font-semibold text-slate-700">คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</p>
        <p class="text-xs text-slate-400 mt-1">รองรับไฟล์ Excel (.xlsx, .xls) หรือ CSV (.csv) ขนาดไม่เกิน 5 MB</p>
        <input type="file" id="im-file-inp" accept=".xlsx, .xls, .csv" class="hidden">
      </div>

      <!-- Preview Section (Hidden initially) -->
      <div id="im-preview-section" class="hidden flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden font-sans">
        <div class="flex items-center justify-between bg-blue-50 border border-blue-100 p-3 rounded-xl shrink-0">
          <div class="min-w-0">
            <p id="im-preview-filename" class="text-xs font-bold text-slate-800 truncate"></p>
            <p id="im-preview-summary" class="text-[11px] text-slate-600 mt-0.5"></p>
          </div>
          <button id="im-btn-clear-file" class="px-2.5 py-1.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition bg-white shrink-0">เปลี่ยนไฟล์</button>
        </div>

        <div class="flex-1 overflow-y-auto border border-slate-200 rounded-xl min-h-[150px] bg-slate-50/50">
          <table class="w-full text-left text-xs">
            <thead class="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th class="px-3 py-2">แถว</th>
                <th class="px-3 py-2">คีย์ระบุตัวตน</th>
                <th class="px-3 py-2">ชื่อ-นามสกุล</th>
                <th class="px-3 py-2">รายละเอียด</th>
                <th class="px-3 py-2 text-right">ผลตรวจ</th>
              </tr>
            </thead>
            <tbody id="im-preview-tbody" class="divide-y divide-slate-100 bg-white">
              <!-- Dynamic Rows -->
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between flex-wrap gap-2 pt-1.5 shrink-0">
          <label class="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input type="checkbox" id="im-confirm-chk" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500">
            <span>ยืนยันความถูกต้องของข้อมูลและพร้อมนำเข้าสู่ระบบ</span>
          </label>
        </div>
      </div>

      <div class="flex gap-3 border-t border-slate-100 pt-3 shrink-0 font-sans">
        <button id="im-cancel" class="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-sm">ยกเลิก</button>
        <button id="im-submit" disabled class="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:hover:bg-blue-600 transition shadow-lg text-sm">เริ่มนำเข้าข้อมูล</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  
  // Icon injection
  document.getElementById('im-title-icon').innerHTML = icon('upload-cloud', 'w-6 h-6 text-blue-600');
  document.getElementById('im-dl-xlsx-icon').innerHTML = icon('download', 'w-3.5 h-3.5');
  document.getElementById('im-dl-csv-icon').innerHTML = icon('download', 'w-3.5 h-3.5');
  document.getElementById('im-upload-icon').innerHTML = icon('upload-cloud', 'w-10 h-10 text-slate-400');

  const dropzone = overlay.querySelector('#im-dropzone');
  const fileInp = overlay.querySelector('#im-file-inp');
  const previewSec = overlay.querySelector('#im-preview-section');
  const typeSel = overlay.querySelector('#im-type');
  const destSel = overlay.querySelector('#im-destination');
  const confirmChk = overlay.querySelector('#im-confirm-chk');
  const submitBtn = overlay.querySelector('#im-submit');
  
  let parsedItems = [];

  // Close handlers
  const close = () => overlay.remove();
  overlay.querySelector('#im-modal-close').addEventListener('click', close);
  overlay.querySelector('#im-cancel').addEventListener('click', close);

  // Template downloads
  overlay.querySelector('#im-btn-dl-xlsx').addEventListener('click', () => downloadImportTemplateXlsx(typeSel.value));
  overlay.querySelector('#im-btn-dl-csv').addEventListener('click', () => downloadImportTemplateCSV(typeSel.value));

  // Trigger file select
  dropzone.addEventListener('click', () => fileInp.click());

  // Drag and drop events
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-blue-500', 'bg-blue-50/40');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-blue-500', 'bg-blue-50/40');
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-blue-500', 'bg-blue-50/40');
    if (e.dataTransfer.files.length) {
      handleImportFile(e.dataTransfer.files[0]);
    }
  });

  fileInp.addEventListener('change', () => {
    if (fileInp.files.length) {
      handleImportFile(fileInp.files[0]);
    }
  });

  overlay.querySelector('#im-btn-clear-file').addEventListener('click', () => {
    fileInp.value = '';
    parsedItems = [];
    dropzone.classList.remove('hidden');
    previewSec.classList.add('hidden');
    confirmChk.checked = false;
    submitBtn.disabled = true;
  });

  confirmChk.addEventListener('change', () => {
    const hasValidItems = parsedItems.some(item => !item.hasError);
    submitBtn.disabled = !confirmChk.checked || parsedItems.length === 0 || !hasValidItems;
  });

  function handleImportFile(file) {
    const name = file.name;
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    if (file.size > 5 * 1024 * 1024) {
      showToast(`ไฟล์ "${name}" มีขนาด ${sizeMB} MB ซึ่งเกินเพดาน 5 MB`, 'error');
      return;
    }

    const type = typeSel.value;
    const reader = new FileReader();

    if (name.endsWith('.csv')) {
      reader.onload = (e) => {
        const text = e.target.result;
        try {
          const rawData = parseCSV(text);
          processImportData(rawData, name, type);
        } catch (err) {
          showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ CSV: ' + err.message, 'error');
        }
      };
      reader.readAsText(file, 'UTF-8');
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet);
          processImportData(rawData, name, type);
        } catch (err) {
          showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel: ' + err.message, 'error');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      showToast('ไม่รองรับประเภทไฟล์นี้ กรุณาอัปโหลด .xlsx, .xls หรือ .csv', 'error');
    }
  }

  function processImportData(rawData, filename, importType) {
    if (!rawData || rawData.length === 0) {
      showToast('ไม่พบข้อมูลผู้ใช้ในไฟล์', 'error');
      return;
    }

    parsedItems = [];
    let successCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    rawData.forEach((row, index) => {
      const item = {
        rowNum: index + 2, // Row number in sheet (headers are row 1)
        name: '',
        key: '', // studentCode or email
        details: '',
        warning: '',
        error: '',
        hasWarning: false,
        hasError: false,
        raw: row
      };

      // Find Name column
      const nameCol = Object.keys(row).find(k => k.toLowerCase().includes('ชื่อ') || k.toLowerCase().includes('name') || k.toLowerCase().includes('สกุล'));
      item.name = nameCol ? String(row[nameCol]).trim() : '';

      if (importType === 'student') {
        // Find Code column
        const codeCol = Object.keys(row).find(k => k.toLowerCase().includes('รหัส') || k.toLowerCase().includes('code') || k.toLowerCase().includes('id'));
        item.key = codeCol ? String(row[codeCol]).trim().replace(/\D/g, '') : ''; // numeric only
        
        // Find Major
        const majorCol = Object.keys(row).find(k => k.toLowerCase().includes('สาขา') || k.toLowerCase().includes('major'));
        const major = majorCol ? String(row[majorCol]).trim() : 'วิทยาการคอมพิวเตอร์';

        // Find Year
        const yearCol = Object.keys(row).find(k => k.toLowerCase().includes('ปี') || k.toLowerCase().includes('year'));
        let year = yearCol ? parseInt(String(row[yearCol]).trim(), 10) : 1;
        if (isNaN(year) || year < 1 || year > 6) year = 1;

        item.details = `${major} (ชั้นปีที่ ${year})`;
        item.parsedData = { type: 'student', studentCode: item.key, name: item.name, major, year, roles: ['student'], connected: false };

        // Validation
        if (!item.name) {
          item.error = 'ไม่มีชื่อ-นามสกุล';
          item.hasError = true;
          errorCount++;
        } else if (!item.key || item.key.length !== 11) {
          item.error = 'รหัสนักศึกษาต้องมี 11 หลัก';
          item.hasError = true;
          errorCount++;
        } else {
          // Check Duplicates in Whitelist
          const inWhitelist = AdminDB.whitelist.some(w => w.type === 'student' && w.studentCode === item.key);
          const inActiveUsers = AdminDB.users.some(u => u.username === item.key);
          
          if (inWhitelist || inActiveUsers) {
            item.warning = 'รหัสนักศึกษานี้มีอยู่ในระบบแล้ว';
            item.hasWarning = true;
            warningCount++;
          } else {
            successCount++;
          }
        }
      } else {
        // Staff Whitelist import
        // Find Email column
        const emailCol = Object.keys(row).find(k => k.toLowerCase().includes('เมล') || k.toLowerCase().includes('email') || k.toLowerCase().includes('mail'));
        item.key = emailCol ? String(row[emailCol]).trim() : '';

        // Find Roles
        const roleCol = Object.keys(row).find(k => k.toLowerCase().includes('บทบาท') || k.toLowerCase().includes('สิทธิ์') || k.toLowerCase().includes('role'));
        const rawRoles = roleCol ? String(row[roleCol]).trim() : 'lead_org';
        
        // Map raw roles to internal roles
        let roles = rawRoles.split(/[,;|]/).map(r => {
          r = r.trim().toLowerCase();
          if (r.includes('admin') || r.includes('แอดมิน')) return 'admin';
          if (r.includes('regist') || r.includes('ทะเบียน') || r.includes('งานทะเบียน')) return 'registrar';
          if (r.includes('lead') || r.includes('ผู้จัด') || r.includes('ผู้รับผิดชอบ')) return 'lead_org';
          if (r.includes('staff') || r.includes('สตาฟ') || r.includes('ผู้ช่วย')) return 'field_staff';
          return 'lead_org';
        });
        if (roles.includes('admin')) {
          roles = ['admin'];
        }

        item.details = roles.map(r => ROLE_LABELS[r]?.text || r).join(', ');
        item.parsedData = { type: 'staff', email: item.key, name: item.name, roles, connected: false };

        // Validation
        if (!item.name) {
          item.error = 'ไม่มีชื่อ-นามสกุล';
          item.hasError = true;
          errorCount++;
        } else if (!item.key || !item.key.includes('@')) {
          item.error = 'รูปแบบอีเมลไม่ถูกต้อง';
          item.hasError = true;
          errorCount++;
        } else if (!item.key.endsWith('@ubu.ac.th')) {
          item.warning = 'คำแนะนำ: ควรใช้อีเมลสถาบัน @ubu.ac.th';
          item.hasWarning = true;
          warningCount++;
        } else {
          // Check Duplicates
          const inWhitelist = AdminDB.whitelist.some(w => w.type === 'staff' && w.email === item.key);
          const inActiveUsers = AdminDB.users.some(u => u.email === item.key);

          if (inWhitelist || inActiveUsers) {
            item.warning = 'อีเมลนี้มีอยู่ในระบบแล้ว';
            item.hasWarning = true;
            warningCount++;
          } else {
            successCount++;
          }
        }
      }

      parsedItems.push(item);
    });

    // Update UI Preview
    overlay.querySelector('#im-preview-filename').textContent = `${filename} (${sizeMB} MB)`;
    overlay.querySelector('#im-preview-summary').innerHTML = `พบข้อมูลรวม <span class="font-bold text-slate-800">${parsedItems.length}</span> แถว: พร้อมนำเข้า <span class="font-bold text-emerald-600">${successCount}</span>, มีคำเตือน <span class="font-bold text-amber-600">${warningCount}</span>, พบข้อผิดพลาด (นำเข้าไม่ได้) <span class="font-bold text-red-600">${errorCount}</span>`;

    const tbody = overlay.querySelector('#im-preview-tbody');
    tbody.innerHTML = parsedItems.map(item => {
      let statusBadge = '';
      if (item.hasError) {
        statusBadge = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">${item.error}</span>`;
      } else if (item.hasWarning) {
        statusBadge = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">${item.warning}</span>`;
      } else {
        statusBadge = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">ผ่านเกณฑ์</span>`;
      }

      return `
        <tr class="hover:bg-slate-50 transition ${item.hasError ? 'bg-red-50/10' : ''}">
          <td class="px-3 py-2 text-slate-400 font-mono">${item.rowNum}</td>
          <td class="px-3 py-2 font-mono text-slate-700">${item.key || '—'}</td>
          <td class="px-3 py-2 font-medium text-slate-800">${item.name || '<span class="text-red-500 font-normal">ไม่มีข้อมูล</span>'}</td>
          <td class="px-3 py-2 text-slate-500">${item.details}</td>
          <td class="px-3 py-2 text-right whitespace-nowrap">${statusBadge}</td>
        </tr>`;
    }).join('');

    dropzone.classList.add('hidden');
    previewSec.classList.remove('hidden');
    confirmChk.checked = false;
    submitBtn.disabled = true;
  }

  // Handle click on submit
  submitBtn.addEventListener('click', () => {
    const importDestination = destSel.value;
    const importType = typeSel.value;
    
    // Filter only items without error
    const importable = parsedItems.filter(item => !item.hasError);
    if (importable.length === 0) {
      showToast('ไม่มีข้อมูลที่สามารถนำเข้าได้', 'error');
      return;
    }

    let addedCount = 0;

    importable.forEach(item => {
      const data = item.parsedData;
      if (importDestination === 'whitelist') {
        // Add to Whitelist
        AdminDB.whitelist.push({
          id: Date.now() + Math.floor(Math.random() * 10000),
          ...data
        });
        addedCount++;
      } else {
        // Add directly as Active Users
        const username = data.type === 'student' ? data.studentCode : data.email.split('@')[0];
        AdminDB.users.push({
          id: Date.now() + Math.floor(Math.random() * 10000),
          username,
          name: data.name,
          email: data.type === 'student' ? `${data.studentCode}@ubu.ac.th` : data.email,
          roles: data.roles,
          active: true
        });
        addedCount++;
      }
    });

    AdminDB.save();
    
    // Log to Audit Log
    const auditLogs = Store.get('audit-extra', []);
    auditLogs.unshift({
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: 'admin.thanakorn',
      action: importDestination === 'whitelist' ? 'whitelist_imported' : 'users_imported',
      detail: `นำเข้าข้อมูลผู้ใช้แบบกลุ่ม (${importType === 'student' ? 'นักศึกษา' : 'เจ้าหน้าที่'}) สำเร็จจำนวน ${addedCount} รายการ ผ่านไฟล์ Excel/CSV`,
      role: 'admin'
    });
    Store.set('audit-extra', auditLogs);

    close();
    showToast(`นำเข้าข้อมูลผู้ใช้สำเร็จทั้งหมด ${addedCount} รายการ`, 'success');
    
    // Update the UI
    renderCurrentTable();
  });
}

function downloadImportTemplateXlsx(type) {
  let data = [];
  let filename = '';
  if (type === 'student') {
    data = [
      { 'รหัสนักศึกษา': '66114400111', 'ชื่อ-นามสกุล': 'นายวันชัย ใจดี', 'สาขาวิชา': 'วิทยาการคอมพิวเตอร์', 'ชั้นปี': 2 },
      { 'รหัสนักศึกษา': '66114400222', 'ชื่อ-นามสกุล': 'นางสาวดรุณี เรียนเก่ง', 'สาขาวิชา': 'เทคโนโลยีสารสนเทศ', 'ชั้นปี': 3 },
      { 'รหัสนักศึกษา': '66114400333', 'ชื่อ-นามสกุล': 'นายอุดม พรดี', 'สาขาวิชา': 'ฟิสิกส์', 'ชั้นปี': 1 }
    ];
    filename = 'Student_Roster_Template.xlsx';
  } else {
    data = [
      { 'อีเมล': 'somkiat.y@ubu.ac.th', 'ชื่อ-นามสกุล': 'ดร.สมเกียรติ เก่งวิทย์', 'บทบาท': 'lead_org, field_staff' },
      { 'อีเมล': 'director.science@ubu.ac.th', 'ชื่อ-นามสกุล': 'ผศ.ดร.กิตติเดช ปัญญาดี', 'บทบาท': 'registrar' }
    ];
    filename = 'Staff_Whitelist_Template.xlsx';
  }

  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, filename);
    showToast(`ดาวน์โหลดเทมเพลต ${filename} เรียบร้อยแล้ว`);
  } catch (err) {
    showToast('ไม่สามารถดาวน์โหลดไฟล์ Excel ได้: ' + err.message, 'error');
  }
}

function downloadImportTemplateCSV(type) {
  let csvContent = '';
  let filename = '';
  if (type === 'student') {
    csvContent = "รหัสนักศึกษา,ชื่อ-นามสกุล,สาขาวิชา,ชั้นปี\n66114400111,นายวันชัย ใจดี,วิทยาการคอมพิวเตอร์,2\n66114400222,นางสาวดรุณี เรียนเก่ง,เทคโนโลยีสารสนเทศ,3\n66114400333,นายอุดม พรดี,ฟิสิกส์,1\n";
    filename = 'Student_Roster_Template.csv';
  } else {
    csvContent = "อีเมล,ชื่อ-นามสกุล,บทบาท\nsomkiat.y@ubu.ac.th,ดร.สมเกียรติ เก่งวิทย์,\"lead_org, field_staff\"\ndirector.science@ubu.ac.th,ผศ.ดร.กิตติเดช ปัญญาดี,registrar\n";
    filename = 'Staff_Whitelist_Template.csv';
  }
  
  try {
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`ดาวน์โหลดเทมเพลต ${filename} เรียบร้อยแล้ว`);
  } catch (err) {
    showToast('ไม่สามารถดาวน์โหลดไฟล์ CSV ได้: ' + err.message, 'error');
  }
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const rows = lines.map(line => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
  
  const headers = rows[0].map(h => h.replace(/^["']|["']$/g, ''));
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < headers.length) continue;
    const obj = {};
    headers.forEach((header, index) => {
      let val = row[index] || '';
      val = val.replace(/^["']|["']$/g, '');
      obj[header] = val;
    });
    data.push(obj);
  }
  return data;
}
