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
  { id: 1, name: 'ระเบียบ UBU SAC 2569.pdf', size: '2.4 MB', uploaded: '2026-07-07', status: 'ready', ocr: false, chunks: 148 },
  { id: 2, name: 'คู่มือกิจกรรมนักศึกษา (สแกน).pdf', size: '18.7 MB', uploaded: '2026-07-07', status: 'ready', ocr: true, chunks: 412 },
  { id: 3, name: 'FAQ กยศ. และทุนการศึกษา.pdf', size: '1.1 MB', uploaded: '2026-07-08', status: 'embedding', ocr: false, chunks: 0 },
  { id: 4, name: 'ประกาศรายชื่ออาจารย์ที่ปรึกษา.pdf', size: '3.3 MB', uploaded: '2026-07-09', status: 'ocr', ocr: true, chunks: 0 },
  { id: 5, name: 'แผ่นพับประชาสัมพันธ์ (ภาพ).pdf', size: '22.0 MB', uploaded: '2026-07-09', status: 'failed', ocr: true, chunks: 0 },
];

const AdminDB = {
  users: Store.get('adm-users', DEFAULT_USERS),
  docs: Store.get('adm-docs', DEFAULT_DOCS),
  save() {
    Store.set('adm-users', this.users);
    Store.set('adm-docs', this.docs);
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

  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const token = document.getElementById('set-token').value.trim();
    Store.set('adm-settings', {
      slackToken: token.startsWith('•') ? s.slackToken : token,
      mcpEndpoints: document.getElementById('set-mcp').value.trim(),
      email: document.getElementById('set-email').value.trim(),
    });
    showToast('บันทึกการตั้งค่าแล้ว — ค่า secret ถูกเข้ารหัส (AES-256-GCM) ก่อนเก็บ');
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
  document.getElementById('audit-user').innerHTML = '<option value="">ผู้ใช้ทั้งหมด</option>' + users.map((u) => `<option>${u}</option>`).join('');
  document.getElementById('audit-action').innerHTML = '<option value="">ทุกประเภทการกระทำ</option>' + actions.map((a) => `<option>${a}</option>`).join('');
  ['audit-user', 'audit-action', 'audit-search'].forEach((id) =>
    document.getElementById(id).addEventListener(id === 'audit-search' ? 'input' : 'change', renderAuditTable));
  renderAuditTable();
}

function renderAuditTable() {
  const user = document.getElementById('audit-user').value;
  const action = document.getElementById('audit-action').value;
  const q = (document.getElementById('audit-search').value || '').toLowerCase();
  const list = allAuditLogs().filter((l) =>
    (!user || l.user === user) && (!action || l.action === action) && (!q || (l.detail + l.action).toLowerCase().includes(q)));

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
    if (e.dataTransfer.files.length) uploadKbDoc(e.dataTransfer.files[0].name);
  });
  fi.addEventListener('change', () => { if (fi.files.length) uploadKbDoc(fi.files[0].name); });
  renderKbTable();
}

function uploadKbDoc(name) {
  const doc = { id: Date.now(), name, size: (Math.random() * 15 + 1).toFixed(1) + ' MB', uploaded: new Date().toISOString().slice(0, 10), status: 'processing', ocr: false, chunks: 0 };
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
            <td class="px-4 py-3 text-right">
              <button onclick="deleteKbDoc(${d.id})" class="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium">${icon('trash-2', 'w-4 h-4')} ลบ</button>
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
