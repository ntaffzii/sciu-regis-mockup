/* =========================================================================
 * SciU-Regis Mock-up — admin.js
 * Mock data + logic สำหรับหน้าจอฝั่ง Admin (Screen 11-15 + Home)
 * ========================================================================= */

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
  { time: '2026-07-09 11:47', user: 'admin.thanakorn', role: 'admin', action: 'ai_config_changed', detail: 'เปลี่ยน AI Provider: Gemini -> Local llama.cpp (Typhoon-2)' },
  { time: '2026-07-08 15:20', user: 'keng.staff', role: 'field_staff', action: 'master_code_issued', detail: 'ออก Master Code A7K2M9 กิจกรรม "จิตอาสาพัฒนาคณะวิทยาศาสตร์"' },
  { time: '2026-07-08 10:05', user: 'registrar.sombat', role: 'registrar', action: 'quota_locked', detail: 'ล็อกโควต้า สมหญิง รักเรียน (12/12 หน่วย)' },
  { time: '2026-07-07 09:00', user: 'admin.thanakorn', role: 'admin', action: 'rag_uploaded', detail: 'อัปโหลด "ระเบียบ UBU SAC 2569.pdf" เข้าฐานความรู้' },
];

const DEFAULT_DOCS = [
  { id: 1, name: 'ระเบียบ UBU SAC 2569.pdf', size: '2.4 MB', uploaded: '2026-07-07', status: 'ready', ocr: false, chunks: 148, text: 'เกณฑ์ข้อกำหนดกิจกรรมนักศึกษา คณะวิทยาศาสตร์ มหาวิทยาลัยอุบลราชธานี ปีการศึกษา 2569:\n1. นักศึกษาต้องสะสมชั่วโมงกิจกรรมสะสมรวมไม่น้อยกว่า 36 ชั่วโมง (12 หน่วยกิต)\n2. สามารถยื่นใบคำร้องเข้าร่วมกิจกรรมบำเพ็ญประโยชน์ภายนอก (เปิดกว้าง) สูงสุดได้ไม่เกิน 12 หน่วยกิตต่อปี\n3. Registrar จะทำการ Reset ข้อมูลเมื่อเริ่มรอบปีการศึกษาใหม่ด้วยมือ' },
  { id: 2, name: 'คู่มือกิจกรรมนักศึกษา (สแกน).pdf', size: '18.7 MB', uploaded: '2026-07-07', status: 'ready', ocr: true, chunks: 412, text: '[ข้อความที่แกะจากภาพสแกนโดย Typhoon OCR]\nขั้นตอนปฏิบัติการบันทึกเวลาจัดตั้งโครงการบำเพ็ญประโยชน์:\n- นิสิตต้องแจ้งเรื่องเสนอโครงการล่วงหน้า 7 วัน\n- การตรวจสอบใช้ระบบเช็คอินด้วยพิกัด GPS รัศมีตามที่ระบุในแผนที่ หรือ รหัส Master Code จาก Field Staff' },
  { id: 3, name: 'FAQ กยศ. และทุนการศึกษา.pdf', size: '1.1 MB', uploaded: '2026-07-08', status: 'embedding', ocr: false, chunks: 0, text: 'คำถามที่พบบ่อย (FAQ) เรื่องกองทุน กยศ. และชั่วโมงกิจกรรม:\nQ: สามารถนำชั่วโมงจิตอาสานอกคณะมานับรวมได้หรือไม่?\nA: ได้ โดยอยู่ในประเภทเปิดกว้างและจำกัดไม่เกิน 12 หน่วยกิตต่อปีการศึกษา\nQ: ต้องส่งเอกสารภายในวันไหน?\nA: ภายใน 14 วันหลังเสร็จสิ้นกิจกรรม' },
  { id: 4, name: 'ประกาศรายชื่ออาจารย์ที่ปรึกษา.pdf', size: '3.3 MB', uploaded: '2026-07-09', status: 'ocr', ocr: true, chunks: 0, text: '[กำลังประมวลผล OCR... ข้อความชั่วคราว]\nรายชื่อคณะทำงานสโมสรนักศึกษาและอาจารย์ที่ปรึกษากิจกรรม คณะวิทยาศาสตร์ ม.อุบลฯ\n1. ดร.วิชัย งานวิชาการ (ที่ปรึกษาสโมสร)\n2. พี่สมบัติ วงศ์ทะเบียน (ทะเบียนกิจกรรมคณะ)' },
  { id: 5, name: 'แผ่นพับประชาสัมพันธ์ (ภาพ).pdf', size: '22.0 MB', uploaded: '2026-07-09', status: 'failed', ocr: true, chunks: 0, text: '[ประมวลผลล้มเหลว - เนื่องจากไฟล์ภาพมีความละเอียดต่ำหรือไม่มีตัวอักษรภาษาไทย]\nสามารถเข้ามาพิมพ์ป้อนข้อมูลด้วยมือที่นี่เพื่อทดแทนและนำขึ้น Vector Store ได้' },
];

const AdminDB = {
  users: Store.get('adm-users', DEFAULT_USERS),
  docs: Store.get('adm-docs', DEFAULT_DOCS),
  whitelist: Store.get('adm-whitelist', DEFAULT_WHITELIST),
  save() {
    Store.set('adm-users', this.users);
    Store.set('adm-docs', this.docs);
    Store.set('adm-whitelist', this.whitelist);
  },
};

function allAuditLogs() {
  return [...Store.get('audit-extra', []), ...DEFAULT_AUDIT];
}

function roleBadge(role) {
  const r = ROLE_LABELS[role] || ROLE_LABELS.student;
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${r.cls}">${r.text}</span>`;
}

/* ---------------- Admin Home --------------------------------------------- */
function initAdminHome() {
  const aiProvider = Store.get('ai-config', { provider: 'local' }).provider;
  const providerLabel = { local: 'Local llama.cpp', gemini: 'Gemini', openai: 'OpenAI GPT' }[aiProvider] || aiProvider;
  document.getElementById('ah-stats').innerHTML =
    statsCard('ผู้ใช้ทั้งหมด', AdminDB.users.length, `${AdminDB.users.filter((u) => u.active).length} active`)
    + statsCard('กิจกรรมทั้งหมด', Store.get('events', []).length || 6, 'ในปีการศึกษา 2569')
    + statsCard('AI Provider', providerLabel, 'พร้อมใช้งาน', { valueCls: 'text-emerald-700' })
    + statsCard('เอกสาร RAG', AdminDB.docs.length, `${AdminDB.docs.filter((d) => d.status === 'ready').length} พร้อมใช้`);

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
    { label: 'AI Provider', ok: true, note: providerLabel },
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
  const s = Store.get('adm-settings', { slackToken: '', mcpEndpoints: 'http://sci_events_mcp:5000/sse', email: 'registrar@sci.ubu.ac.th' });
  document.getElementById('set-token').value = s.slackToken ? '••••••••••••' + s.slackToken.slice(-4) : '';
  document.getElementById('set-mcp').value = s.mcpEndpoints;
  document.getElementById('set-email').value = s.email;

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
      mcpEndpoints: document.getElementById('set-mcp').value.trim(),
      email: document.getElementById('set-email').value.trim(),
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

/* ---------------- Screen 14: ตั้งค่า AI Provider -------------------------- */
const AI_PRESETS = {
  local: { base: 'http://ai_llm_lowvram:8001/v1', model: 'typhoon-2-qwen2.5-7b-instruct', note: 'LLM ภายในระบบ (ค่าเริ่มต้น) — ปลอดภัยต่อ PDPA เพราะข้อมูลไม่ออกนอกเครื่อง' },
  gemini: { base: 'https://generativelanguage.googleapis.com/v1beta', model: 'gemini-2.0-flash', note: 'ระวัง: ห้ามส่งข้อมูลส่วนบุคคลนักศึกษาออกไป provider ภายนอก (นโยบาย PDPA)' },
  openai: { base: 'https://api.openai.com/v1', model: 'gpt-4o-mini', note: 'ระวัง: ห้ามส่งข้อมูลส่วนบุคคลนักศึกษาออกไป provider ภายนอก (นโยบาย PDPA)' },
};

function initAiPage() {
  const cfg = Store.get('ai-config', { provider: 'local', base: AI_PRESETS.local.base, model: AI_PRESETS.local.model, temp: 0.7, maxTokens: 1024, topP: 0.95 });
  const sel = document.getElementById('ai-provider');
  sel.value = cfg.provider;
  document.getElementById('ai-base').value = cfg.base;
  document.getElementById('ai-model').value = cfg.model;
  document.getElementById('ai-temp').value = cfg.temp;
  document.getElementById('ai-maxtokens').value = cfg.maxTokens;
  document.getElementById('ai-topp').value = cfg.topP;
  syncAiLabels();
  updateAiNote(cfg.provider);

  sel.addEventListener('change', () => {
    const p = AI_PRESETS[sel.value];
    document.getElementById('ai-base').value = p.base;
    document.getElementById('ai-model').value = p.model;
    updateAiNote(sel.value);
  });
  ['ai-temp', 'ai-topp'].forEach((id) => document.getElementById(id).addEventListener('input', syncAiLabels));

  document.getElementById('btn-test-conn').addEventListener('click', () => {
    const btn = document.getElementById('btn-test-conn');
    btn.disabled = true;
    btn.innerHTML = `${icon('refresh', 'w-4 h-4')} กำลังทดสอบ...`;
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `${icon('refresh', 'w-4 h-4')} ทดสอบการเชื่อมต่อ`;
      showToast(`เชื่อมต่อ ${sel.options[sel.selectedIndex].text} สำเร็จ — ตอบกลับใน 240ms (จำลอง)`);
    }, 1200);
  });

  document.getElementById('ai-form').addEventListener('submit', (e) => {
    e.preventDefault();
    Store.set('ai-config', {
      provider: sel.value,
      base: document.getElementById('ai-base').value.trim(),
      model: document.getElementById('ai-model').value.trim(),
      temp: parseFloat(document.getElementById('ai-temp').value),
      maxTokens: parseInt(document.getElementById('ai-maxtokens').value, 10),
      topP: parseFloat(document.getElementById('ai-topp').value),
    });
    showToast('บันทึกการตั้งค่า AI Provider แล้ว — API key ถูกเข้ารหัสก่อนเก็บ');
  });
}

function syncAiLabels() {
  document.getElementById('ai-temp-val').textContent = document.getElementById('ai-temp').value;
  document.getElementById('ai-topp-val').textContent = document.getElementById('ai-topp').value;
}

function updateAiNote(provider) {
  const p = AI_PRESETS[provider];
  const warn = provider !== 'local';
  document.getElementById('ai-note').innerHTML = `
    <div class="border-l-4 ${warn ? 'border-amber-400 bg-amber-50' : 'border-emerald-400 bg-emerald-50'} p-3.5 rounded-r-xl flex items-start gap-2.5">
      <span class="${warn ? 'text-amber-600' : 'text-emerald-600'} shrink-0 mt-0.5">${icon(warn ? 'alert-triangle' : 'check-circle', 'w-4 h-4')}</span>
      <p class="text-xs ${warn ? 'text-amber-800' : 'text-emerald-800'} leading-relaxed">${p.note}</p>
    </div>`;
}

/* ---------------- Screen 15: จัดการฐานความรู้ RAG ------------------------- */
const DOC_STATUS = {
  processing: { badge: () => statusBadge('pending', 'กำลังประมวลผล'), },
  ocr: { badge: () => statusBadge('pending', 'กำลังอ่าน OCR') },
  embedding: { badge: () => statusBadge('info', 'กำลังสร้าง Embedding') },
  ready: { badge: () => statusBadge('ready', 'พร้อมใช้งาน') },
  failed: { badge: () => statusBadge('rejected', 'ล้มเหลว') },
};

function initKnowledgePage() {
  const dz = document.getElementById('kb-dropzone');
  const fi = document.getElementById('kb-file');
  dz.addEventListener('click', () => fi.click());
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('border-blue-500', 'bg-blue-50/40'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('border-blue-500', 'bg-blue-50/40'));
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('border-blue-500', 'bg-blue-50/40');
    if (e.dataTransfer.files.length) acceptKbFile(e.dataTransfer.files[0]);
  });
  fi.addEventListener('change', () => { if (fi.files.length) acceptKbFile(fi.files[0]); });
  renderKbTable();
}

/* FR-F8: ไฟล์ PDF เข้าฐานความรู้ต้องไม่เกิน 15 MB — เช็คจริงจาก file.size ไม่ใช่แค่ข้อความในหน้าเว็บ */
const MAX_KB_FILE_MB = 15;
function acceptKbFile(file) {
  const maxBytes = MAX_KB_FILE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    showToast(`ไฟล์ "${file.name}" ขนาด ${(file.size / 1024 / 1024).toFixed(1)} MB เกินเพดาน ${MAX_KB_FILE_MB} MB — กรุณาเลือกไฟล์ใหม่`, 'error');
    return;
  }
  uploadKbDoc(file.name, file.size);
}

function uploadKbDoc(name, sizeBytes) {
  const sizeLabel = sizeBytes ? (sizeBytes / 1024 / 1024).toFixed(1) + ' MB' : (Math.random() * 15 + 1).toFixed(1) + ' MB';
  const doc = { id: Date.now(), name, size: sizeLabel, uploaded: new Date().toISOString().slice(0, 10), status: 'processing', ocr: false, chunks: 0, text: `[ข้อความที่แกะออกมาแบบอัตโนมัติจากไฟล์ใหม่ "${name}"]\nข้อมูลแนวทางส่งเสริมการเรียนรู้และการพัฒนาทักษะวิชาการ/บำเพ็ญสาธารณประโยชน์สำหรับสโมสรนักศึกษา ม.อุบลราชธานี ประจำปีการศึกษา 2569` };
  AdminDB.docs.unshift(doc);
  AdminDB.save();
  renderKbTable();
  showToast(`อัปโหลด "${name}" แล้ว — เริ่ม pipeline: อ่าน text layer -> OCR (ถ้าจำเป็น) -> embedding`, 'info');
  // จำลอง pipeline: processing -> (ocr) -> embedding -> ready
  setTimeout(() => { doc.status = Math.random() > 0.5 ? 'ocr' : 'embedding'; doc.ocr = doc.status === 'ocr'; AdminDB.save(); renderKbTable(); }, 1500);
  setTimeout(() => { doc.status = 'embedding'; AdminDB.save(); renderKbTable(); }, 3200);
  setTimeout(() => {
    doc.status = 'ready';
    doc.chunks = Math.floor(Math.random() * 300 + 50);
    AdminDB.save();
    renderKbTable();
    showToast(`"${name}" พร้อมใช้งานในฐานความรู้แล้ว (${doc.chunks} chunks, bge-m3 1024D)`);
  }, 5200);
}

function renderKbTable() {
  document.getElementById('kb-table').innerHTML = AdminDB.docs.length ? `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">เอกสาร</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">อัปโหลดเมื่อ</th>
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</th>
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Chunks</th>
        <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ดำเนินการ</th>
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${AdminDB.docs.map((d) => `
          <tr class="hover:bg-slate-50/50 transition">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <span class="text-slate-400 shrink-0">${icon('file-text', 'w-4 h-4')}</span>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-800 truncate">${d.name}
                    ${d.ocr ? '<span class="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">ใช้ OCR</span>' : ''}
                  </p>
                  <p class="text-xs text-slate-400">${d.size}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">${thDate(d.uploaded)}</td>
            <td class="px-4 py-3 text-center">${DOC_STATUS[d.status].badge()}
              ${d.status === 'failed' ? `<button onclick="retryKbDoc(${d.id})" class="block mx-auto mt-1 text-xs text-blue-600 hover:underline">ลองใหม่</button>` : ''}</td>
            <td class="px-4 py-3 text-center text-sm font-mono text-slate-600">${d.chunks || '—'}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
              <button onclick="viewKbDocText(${d.id})" class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">${icon('edit', 'w-3.5 h-3.5')} ดู/แก้ไขข้อความ</button>
              <button onclick="deleteKbDoc(${d.id})" class="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">${icon('trash-2', 'w-3.5 h-3.5')} ลบ</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>` : emptyState('ยังไม่มีเอกสารในฐานความรู้ — อัปโหลด PDF เพื่อเริ่มต้น', 'book-open');
}

function retryKbDoc(id) {
  const d = AdminDB.docs.find((x) => x.id === id);
  if (!d) return;
  d.status = 'processing';
  AdminDB.save();
  renderKbTable();
  setTimeout(() => { d.status = 'ready'; d.chunks = Math.floor(Math.random() * 300 + 50); AdminDB.save(); renderKbTable(); showToast(`ประมวลผล "${d.name}" สำเร็จ`); }, 2500);
}

function deleteKbDoc(id) {
  const d = AdminDB.docs.find((x) => x.id === id);
  if (!d) return;
  showConfirmDialog({
    title: `ลบเอกสาร "${d.name}"?`,
    bullets: ['ลบไฟล์ต้นฉบับออกจากระบบ', `ลบ embedding ${d.chunks || 0} chunks ที่เกี่ยวข้องออกจาก pgvector`, 'แชทบอทจะไม่ใช้เนื้อหานี้ตอบคำถามอีก'],
    tone: 'danger', confirmText: 'ลบเอกสาร',
    onConfirm: () => {
      AdminDB.docs = AdminDB.docs.filter((x) => x.id !== id);
      AdminDB.save();
      showToast(`ลบ "${d.name}" พร้อม embedding ที่เกี่ยวข้องแล้ว`, 'warning');
      renderKbTable();
    },
  });
}

function viewKbDocText(id) {
  const d = AdminDB.docs.find((x) => x.id === id);
  if (!d) return;
  
  const textVal = d.text || '';
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[55] p-4';
  overlay.innerHTML = `
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 flex flex-col space-y-4 max-h-[85vh]">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
          <span id="kb-modal-title-icon"></span> ดู/แก้ไขข้อความที่แกะจากเอกสาร RAG
        </h3>
        <button id="kb-modal-close" class="text-slate-400 hover:text-slate-600 transition" aria-label="ปิด">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div>
        <p class="text-xs font-semibold text-slate-700">ชื่อเอกสาร: <span class="text-slate-500 font-normal">${d.name} (${d.size})</span></p>
        <p class="text-[10px] text-slate-400 mt-1">อัปโหลดเมื่อ: ${thDate(d.uploaded)} | สถานะปัจจุบัน: <span class="font-semibold">${d.status === 'ocr' ? 'แกะลายพิมพ์ด้วย OCR' : d.status === 'ready' ? 'พร้อมใช้งาน' : d.status === 'failed' ? 'ประมวลผลล้มเหลว' : 'กำลังจัดเตรียม'}</span></p>
      </div>
      
      <div class="flex-1 overflow-y-auto space-y-1.5 flex flex-col min-h-0">
        <label class="text-xs font-bold text-slate-700 block" for="kb-doc-textarea">ข้อความที่สกัดได้ (Editable Extracted Text)</label>
        <textarea id="kb-doc-textarea" class="w-full flex-1 min-h-[220px] p-3 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 leading-relaxed" placeholder="ยังไม่มีข้อความ หรือการดึงข้อมูลล้มเหลว สามารถเพิ่มข้อความตรงนี้ได้...">${textVal}</textarea>
        <p class="text-[10px] text-slate-400">ตรวจสอบและแก้ไขตัวสะกดที่ผิดพลาดจากการแกะ OCR/Text Layer เพื่อรักษาความถูกต้องในการสืบค้นค้นหา RAG Vector Search (1024D)</p>
      </div>
      
      <div class="flex items-center justify-between border-t border-slate-100 pt-4 gap-4 flex-wrap">
        <label class="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
          <input type="checkbox" id="kb-confirm-vector" checked class="rounded border-slate-300 text-blue-600 focus:ring-blue-500">
          <span>ยืนยันความถูกต้องและต้องการ Vectorize ทันที</span>
        </label>
        <div class="flex gap-2.5">
          <button id="kb-modal-cancel" class="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition">ยกเลิก</button>
          <button id="kb-modal-save" class="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-600/20">บันทึกและปรับปรุง Index</button>
        </div>
      </div>
    </div>`;
    
  document.body.appendChild(overlay);
  document.getElementById('kb-modal-title-icon').innerHTML = icon('file-text', 'w-5 h-5 text-blue-600');
  
  const close = () => overlay.remove();
  overlay.querySelector('#kb-modal-close').addEventListener('click', close);
  overlay.querySelector('#kb-modal-cancel').addEventListener('click', close);
  
  overlay.querySelector('#kb-modal-save').addEventListener('click', () => {
    const newText = overlay.querySelector('#kb-doc-textarea').value;
    const confirmVector = overlay.querySelector('#kb-confirm-vector').checked;
    
    d.text = newText;
    if (confirmVector) {
      d.status = 'ready';
      d.chunks = Math.floor(newText.split('\n').filter(t => t.trim()).length * 1.5) || 5;
    }
    
    AdminDB.save();
    
    // Log action to Audit Log
    const logs = Store.get('audit-extra', []);
    logs.unshift({
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: 'admin.thanakorn',
      action: 'rag_text_edited',
      detail: `แก้ไขข้อความสกัดและอัปเดต Vector Indexing เอกสาร "${d.name}" (${d.chunks} chunks)`,
      role: 'admin'
    });
    Store.set('audit-extra', logs);
    
    close();
    showToast(`บันทึกการแก้ไขข้อความ RAG และปรับโครงสร้าง pgvector สำหรับ "${d.name}" สำเร็จ`);
    renderKbTable();
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
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700" for="wm-major">สาขาวิชา</label>
            <input id="wm-major" value="${w ? w.major || '' : ''}" placeholder="วิทยาการคอมพิวเตอร์" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
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
      const major = overlay.querySelector('#wm-major').value.trim();
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
