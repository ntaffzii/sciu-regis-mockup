/* =========================================================================
 * SciU-Regis Mock-up — registrar.js
 * Mock data + logic สำหรับหน้าจอฝั่ง Registrar (Screen 1-7 + Home)
 * ========================================================================= */

/* ---------------- Mock data (โหลดจาก localStorage ถ้ามี state ค้าง) ------- */
const QUOTA_MAX = 12; // 12 หน่วย (36 ชม.) ต่อปีการศึกษา — FR-C group

const DEFAULT_EVENTS = [
  { id: 1, name: 'ค่ายจิตอาสาพัฒนาโรงเรียนบ้านดอนงัว', date: '2026-06-20', days: 3, credits: 3.0, open: false, gps: true, lat: 15.1183, lng: 104.9057, radius: 30, participants: 100, checkedIn: 45, exportStatus: 'none', rosterOverdue: false, staffId: 99 },
  { id: 2, name: 'Science Open House 2569', date: '2026-07-15', days: 1, credits: 1.5, open: false, gps: true, lat: 15.1215, lng: 104.9101, radius: 50, participants: 250, checkedIn: 0, exportStatus: 'none', rosterOverdue: false, staffId: null },
  { id: 3, name: 'บริจาคโลหิต สภากาชาดไทย (เปิดกว้าง)', date: '2026-06-05', days: 1, credits: 1.0, open: true, gps: false, participants: 60, checkedIn: 58, exportStatus: 'confirmed', rosterOverdue: false, staffId: null },
  { id: 4, name: 'อบรมปฐมพยาบาลเบื้องต้น CPR', date: '2026-06-28', days: 1, credits: 1.5, open: false, gps: false, participants: 80, checkedIn: 74, exportStatus: 'exported', rosterOverdue: false, staffId: null },
  { id: 5, name: 'จิตอาสาพัฒนาคณะวิทยาศาสตร์', date: '2026-07-02', days: 2, credits: 2.0, open: false, gps: true, lat: 15.1198, lng: 104.9077, radius: 40, participants: 55, checkedIn: 51, exportStatus: 'none', rosterOverdue: true, staffId: 4 },
  { id: 6, name: 'ปลูกป่าชายเลนเฉลิมพระเกียรติ (เปิดกว้าง)', date: '2026-07-08', days: 1, credits: 2.0, open: true, gps: false, participants: 40, checkedIn: 36, exportStatus: 'none', rosterOverdue: true, staffId: null },
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

const DEFAULT_PROOFS = [
  { id: 101, student: 'สมชาย ใจดี', code: '66114400123', title: 'จิตอาสาช่วยงานวัดป่านานาชาติ', submitted: '2026-07-08', hours: 6, units: 2.0, file: 'ใบรับรอง_วัดป่าฯ.pdf', status: 'pending', mismatch: false, ocr: { name: 'นายสมชาย ใจดี', date: '5 ก.ค. 2569', hours: 6, confidence: 92 } },
  { id: 102, student: 'สมปอง ใจงาม', code: '66114400140', title: 'อาสาสมัครช่วยงานกาชาดจังหวัด', submitted: '2026-07-08', hours: 9, units: 3.0, file: 'certificate_redcross.jpg', status: 'pending', mismatch: true, ocr: { name: 'นายสมชาย ใจดี', date: '1 ก.ค. 2569', hours: 9, confidence: 87 } },
  { id: 103, student: 'มานี มีนา', code: '66114400126', title: 'จิตอาสาสอนหนังสือน้อง ร.ร.บ้านหนองแสง', submitted: '2026-07-09', hours: 3, units: 1.0, file: 'ใบรับรอง_สอนหนังสือ.pdf', status: 'pending', mismatch: false, ocr: { name: 'นางสาวมานี มีนา', date: '6 ก.ค. 2569', hours: 3, confidence: 95 } },
  { id: 104, student: 'ปิติ ยินดี', code: '66114400127', title: 'อาสาพัฒนาชุมชนริมมูล', submitted: '2026-07-09', hours: 12, units: 4.0, file: 'proof_rimmun.jpg', status: 'pending', mismatch: true, ocr: { name: 'นายปิติ ยินดี', date: '30 มิ.ย. 2569', hours: 18, confidence: 64 } },
  { id: 105, student: 'รุ่งนภา แสงทอง', code: '66114400132', title: 'จิตอาสาบริการน้ำดื่มงานบุญมหาชาติ', submitted: '2026-07-10', hours: 6, units: 2.0, file: 'ใบรับรอง_งานบุญ.pdf', status: 'pending', mismatch: false, ocr: { name: 'นางสาวรุ่งนภา แสงทอง', date: '8 ก.ค. 2569', hours: 6, confidence: 90 } },
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

/* state ต่อ key — reset ได้ด้วยการลบ localStorage */
const RegDB = {
  events: Store.get('events', DEFAULT_EVENTS),
  students: Store.get('students', DEFAULT_STUDENTS),
  proofs: Store.get('proofs', DEFAULT_PROOFS),
  ledger: Store.get('ledger', DEFAULT_LEDGER),
  cycles: Store.get('cycles', DEFAULT_CYCLES),
  save() {
    Store.set('events', this.events);
    Store.set('students', this.students);
    Store.set('proofs', this.proofs);
    Store.set('ledger', this.ledger);
    Store.set('cycles', this.cycles);
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

function pendingProofs() { return RegDB.proofs.filter((p) => p.status === 'pending'); }

/* ---------------- Screen 1: Export Excel --------------------------------- */
function initExportPage() {
  const sel = document.getElementById('export-event');
  sel.innerHTML = RegDB.events.map((e) => `<option value="${e.id}">${e.name} (${thDate(e.date)})</option>`).join('');
  sel.addEventListener('change', renderExportTable);
  document.getElementById('export-search').addEventListener('input', renderExportTable);
  renderExportTable();

  document.getElementById('btn-export').addEventListener('click', () => {
    const ev = currentExportEvent();
    const invalid = RegDB.students.filter((s) => !isValidStudentCode(s.code)).length;
    if (invalid) showToast(`ข้าม ${invalid} รายชื่อที่รหัสนักศึกษาไม่ผ่านเงื่อนไข (ต้องเป็นตัวเลข 11 หลัก)`, 'warning');
    // จำลองไฟล์ .xlsx ด้วย CSV ง่ายๆ ให้กดดาวน์โหลดได้จริง
    const rows = [['รหัสนักศึกษา', 'ชื่อ', 'นามสกุล', 'หน่วยกิต'],
      ...RegDB.students.filter((s) => isValidStudentCode(s.code)).map((s) => [s.code, s.first, s.last, s.credits])];
    const blob = new Blob(['﻿' + rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `UBUSAC_export_${ev.id}.csv`;
    a.click();
    ev.exportStatus = ev.exportStatus === 'confirmed' ? 'confirmed' : 'exported';
    RegDB.save();
    appendAudit('sac_export', `Export Excel กิจกรรม "${ev.name}"`);
    showToast('สร้างไฟล์ Excel ตามฟอร์แมต UBU SAC แล้ว (จำลอง)');
    renderExportTable();
  });

  document.getElementById('btn-confirm-import').addEventListener('click', () => {
    const ev = currentExportEvent();
    if (ev.exportStatus !== 'exported') return;
    showConfirmDialog({
      title: 'ยืนยันนำเข้า UBU SAC สำเร็จ',
      message: `กิจกรรม "${ev.name}"`,
      bullets: [
        'บันทึกสถานะว่ารายชื่อชุดนี้ถูกนำเข้าระบบ UBU SAC เรียบร้อยแล้ว',
        'ระบบจะแจ้งเตือนนักศึกษาที่เกี่ยวข้องว่าชั่วโมงเข้าระบบแล้ว',
        'การกระทำนี้ถูกบันทึกลง Audit Log',
      ],
      confirmText: 'ยืนยันนำเข้าแล้ว',
      onConfirm: () => {
        ev.exportStatus = 'confirmed';
        RegDB.save();
        appendAudit('sac_import_confirmed', `ยืนยันนำเข้า UBU SAC กิจกรรม "${ev.name}"`);
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

function renderExportTable() {
  const ev = currentExportEvent();
  const q = (document.getElementById('export-search').value || '').toLowerCase();
  const list = RegDB.students.filter((s) => (s.code + s.first + s.last).toLowerCase().includes(q));

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
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">รหัสนักศึกษา</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่อ</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">นามสกุล</th>
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">หน่วยกิต</th>
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">รหัสถูกต้อง</th>
      </tr></thead>
      <tbody class="divide-y divide-slate-100">
        ${list.map((s) => {
          const ok = isValidStudentCode(s.code);
          return `<tr class="hover:bg-slate-50/50 transition ${ok ? '' : 'bg-red-50/40'}">
            <td class="px-4 py-3 text-sm font-mono ${ok ? 'text-slate-800' : 'text-red-600 font-semibold'}">${s.code}</td>
            <td class="px-4 py-3 text-sm text-slate-800">${s.first}</td>
            <td class="px-4 py-3 text-sm text-slate-800">${s.last}</td>
            <td class="px-4 py-3 text-sm text-center font-mono text-slate-800">${s.credits.toFixed(1)}</td>
            <td class="px-4 py-3 text-center">${ok ? statusBadge('ready', 'ผ่าน') : statusBadge('rejected', 'ไม่ผ่าน (ต้องเป็นเลข 11 หลัก)')}</td>
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
        <input id="adj-credits" type="number" step="0.5" min="0" max="6" value="2.0" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600">
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
    renderAdjustTable();
  });
}

/* ---------------- Screen 3: สร้าง/แก้ไขกิจกรรม ---------------------------- */
function initEventFormPage() {
  const gpsToggle = document.getElementById('ev-gps');
  const gpsFields = document.getElementById('gps-fields');
  gpsToggle.addEventListener('change', () => gpsFields.classList.toggle('hidden', !gpsToggle.checked));

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

  const staffSelect = document.getElementById('ev-staff-id');
  if (staffSelect) {
    let optionsHtml = '<option value="">-- ไม่แต่งตั้ง (สามารถมอบหมายงานทีหลังได้) --</option>' +
      '<option value="4">น้องเก่ง สตาฟดี (keng.staff)</option>' +
      '<option value="6">บุคลากรเก่า ลาออกแล้ว (old.staff) - บัญชีไม่ใช้งาน</option>' +
      '<option value="99">น้องเบล สตาฟใหม่ (bell.staff)</option>';

    RegDB.students.forEach((s) => {
      const val = Number(s.code);
      if (val) {
        optionsHtml += `<option value="${val}">${s.first} ${s.last} (${s.code})</option>`;
      }
    });
    staffSelect.innerHTML = optionsHtml;
  }

  document.getElementById('event-form').addEventListener('reset', () => {
    clearImage();
    gpsFields.classList.add('hidden');
  });

  document.getElementById('event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('ev-name').value.trim();
    if (!name) { showToast('กรุณากรอกชื่อกิจกรรม', 'error'); return; }
    const open = document.getElementById('ev-open').checked;
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
    const staffIdInput = document.getElementById('ev-staff-id');
    const staffId = staffIdInput && staffIdInput.value ? Number(staffIdInput.value) : null;

    RegDB.events.unshift({
      id: Date.now(),
      name,
      date: document.getElementById('ev-date').value || '2026-08-01',
      days: Number(document.getElementById('ev-days').value) || 1,
      credits: parseFloat(document.getElementById('ev-credits').value) || 1,
      open,
      gps: gpsToggle.checked,
      lat: parseFloat(document.getElementById('ev-lat').value) || null,
      lng: parseFloat(document.getElementById('ev-lng').value) || null,
      radius: Number(radius.value),
      selfie,
      masterCode,
      staffId,
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

/* ---------------- Screen 4: ตรวจหลักฐาน OCR ------------------------------ */
let activeProofId = null;

function initOcrPage() {
  renderProofQueue();
  const first = pendingProofs()[0];
  if (first) selectProof(first.id);
}

function renderProofQueue() {
  const list = pendingProofs();
  document.getElementById('queue-count').innerHTML = statusBadge('pending', `รอตรวจ ${list.length} รายการ`);
  document.getElementById('proof-queue').innerHTML = list.length ? list.map((p) => `
    <button onclick="selectProof(${p.id})" class="w-full text-left px-4 py-3 hover:bg-slate-50 transition ${activeProofId === p.id ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}">
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm font-medium text-slate-800 truncate">${p.student}</p>
        ${p.mismatch ? `<span class="text-yellow-500 shrink-0" title="ข้อมูลไม่ตรง">${icon('alert-triangle', 'w-4 h-4')}</span>` : ''}
      </div>
      <p class="text-xs text-slate-400 truncate mt-0.5">${p.title}</p>
      <p class="text-[10px] text-slate-300 mt-0.5 font-mono">ส่งเมื่อ ${thDate(p.submitted)}</p>
    </button>`).join('') : emptyState('ไม่มีหลักฐานรอตรวจ', 'check-circle');
}

function selectProof(id) {
  activeProofId = id;
  const p = RegDB.proofs.find((x) => x.id === id);
  renderProofQueue();
  if (!p) return;
  document.getElementById('proof-detail').classList.remove('hidden');
  document.getElementById('proof-empty').classList.add('hidden');

  // ซ้าย: เอกสารต้นฉบับ (จำลองใบรับรอง)
  const categoryBadge = p.categoryTitle ? `<div class="mt-1"><span class="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded-full inline-block">หมวดหมู่: ${p.categoryTitle}</span></div>` : '';
  document.getElementById('proof-doc').innerHTML = `
    <div class="mock-certificate rounded-xl p-6 text-center space-y-3 min-h-[280px] flex flex-col justify-center">
      <p class="text-[10px] uppercase tracking-[0.3em] text-amber-700/60">Certificate of Volunteer Work</p>
      <p class="text-lg font-semibold text-slate-700">ใบรับรองการเข้าร่วมกิจกรรมจิตอาสา</p>
      ${categoryBadge}
      <p class="text-sm text-slate-500">ขอรับรองว่า <span class="font-semibold text-slate-800 underline decoration-dotted">${p.ocr.name}</span></p>
      <p class="text-sm text-slate-500">ได้เข้าร่วม "${p.title}"</p>
      <p class="text-sm text-slate-500">เมื่อวันที่ ${p.ocr.date} รวม <span class="font-mono font-semibold">${p.ocr.hours}</span> ชั่วโมง</p>
      <p class="text-xs text-slate-400 pt-3">(ภาพจำลองเอกสาร • ${p.file})</p>
    </div>`;

  // ขวา: ผล OCR + เทียบโปรไฟล์
  document.getElementById('ocr-confidence').textContent = `Confidence: ${p.ocr.confidence}%`;
  document.getElementById('ocr-fields').innerHTML = `
    ${ocrRow('ชื่อในเอกสาร', `<input id="ocr-name" value="${p.ocr.name}" class="ocr-input">`)}
    ${p.categoryTitle ? ocrRow('หมวดหมู่ระบบ (event_id)', `<span class="text-sm font-semibold text-slate-800 text-right">${p.categoryTitle}</span>`) : ''}
    ${ocrRow('ชื่อกิจกรรมเฉพาะ', `<input id="ocr-title" value="${p.title}" class="ocr-input">`)}
    ${ocrRow('วันที่จัดกิจกรรม', `<input id="ocr-date" value="${p.ocr.date}" class="ocr-input">`)}
    ${ocrRow('จำนวนชั่วโมง', `<input id="ocr-hours" type="number" value="${p.ocr.hours}" class="ocr-input font-mono w-24 text-right">`)}
    ${ocrRow('คิดเป็นหน่วยกิต', `<span class="text-sm font-mono font-semibold text-slate-800">${p.units.toFixed(1)} หน่วย</span>`)}
    ${ocrRow('บัญชีผู้ส่ง', `<span class="text-sm font-semibold text-slate-800">${p.student} <span class="font-mono text-xs text-slate-400">(${p.code})</span></span>`)}`;
  document.querySelectorAll('.ocr-input').forEach((el) => {
    el.className += ' text-sm font-semibold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none text-right';
  });

  document.getElementById('mismatch-box').innerHTML = p.mismatch ? `
    <div class="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-xl">
      <div class="flex items-start gap-3">
        <span class="text-yellow-600 shrink-0 mt-0.5">${icon('alert-triangle', 'w-5 h-5')}</span>
        <div>
          <p class="text-sm font-semibold text-yellow-800">คำเตือน: ชื่อ/ข้อมูลบนใบรับรองไม่ตรงกับบัญชีผู้ใช้</p>
          <p class="text-xs text-yellow-700 mt-1 leading-relaxed">
            ชื่อในเอกสาร (OCR): <strong>${p.ocr.name}</strong><br/>
            ชื่อในระบบ: <strong>${p.student}</strong> — ต้องตรวจสอบด้วยตนเองก่อนอนุมัติ (ระบบไม่อนุมัติอัตโนมัติ)
          </p>
        </div>
      </div>
    </div>` : `
    <div class="border-l-4 border-emerald-400 bg-emerald-50 p-3 rounded-r-xl flex items-center gap-2.5">
      <span class="text-emerald-600">${icon('check-circle', 'w-4 h-4')}</span>
      <p class="text-xs text-emerald-800">ข้อมูล OCR ตรงกับบัญชีผู้ใช้ที่ล็อกอิน</p>
    </div>`;
}

function ocrRow(label, valueHtml) {
  return `<div class="flex justify-between items-center gap-3 p-3 bg-slate-50 rounded-xl">
    <span class="text-sm text-slate-500 shrink-0">${label}</span>${valueHtml}</div>`;
}

function decideProof(approve) {
  const p = RegDB.proofs.find((x) => x.id === activeProofId);
  if (!p) return;
  showConfirmDialog({
    title: approve ? 'อนุมัติหลักฐานนี้?' : 'ปฏิเสธหลักฐานนี้?',
    message: `${p.student} — ${p.title} (${p.units.toFixed(1)} หน่วย)`,
    bullets: approve
      ? ['บวกหน่วยกิตเข้ายอดสะสมกิจกรรมเปิดกว้างของปีการศึกษา 2569', 'ถ้ายอดถึง 12 หน่วย ระบบจะล็อกโควต้าอัตโนมัติ', 'บันทึกการอนุมัติลง Audit Log']
      : ['หลักฐานนี้จะไม่ถูกนับหน่วยกิต', 'ระบบแจ้งเตือนนักศึกษาพร้อมเหตุผล', 'บันทึกการปฏิเสธลง Audit Log'],
    tone: approve ? 'warning' : 'danger',
    confirmText: approve ? 'อนุมัติ' : 'ปฏิเสธ',
    requireReason: !approve,
    reasonLabel: 'เหตุผลที่ปฏิเสธ (แจ้งนักศึกษา)',
    onConfirm: (reason) => {
      p.status = approve ? 'approved' : 'rejected';
      if (approve) {
        const row = RegDB.ledger.find((l) => l.code === p.code);
        if (row) {
          row.units = Math.min(QUOTA_MAX, row.units + p.units);
          if (row.units >= QUOTA_MAX) row.locked = true;
        }
      }
      RegDB.save();
      appendAudit(approve ? 'proof_approved' : 'proof_rejected', `${approve ? 'อนุมัติ' : 'ปฏิเสธ'}หลักฐาน "${p.title}" ของ ${p.student}${reason ? ' เหตุผล: ' + reason : ''}`);
      showToast(approve ? `อนุมัติแล้ว — บวก ${p.units.toFixed(1)} หน่วยให้ ${p.student}` : 'ปฏิเสธหลักฐานและแจ้งนักศึกษาแล้ว', approve ? 'success' : 'warning');
      activeProofId = null;
      document.getElementById('proof-detail').classList.add('hidden');
      document.getElementById('proof-empty').classList.remove('hidden');
      const next = pendingProofs()[0];
      if (next) selectProof(next.id); else renderProofQueue();
    },
  });
}

/* ---------------- Screen 5: ตรวจสอบ/ล็อกโควต้า --------------------------- */
function initQuotasPage() {
  document.getElementById('quota-search').addEventListener('input', renderQuotaTable);
  renderQuotaTable();
  document.getElementById('btn-lock-check').addEventListener('click', () => {
    const toLock = RegDB.ledger.filter((l) => l.units >= QUOTA_MAX && !l.locked);
    showConfirmDialog({
      title: 'ตรวจสอบ/ล็อกหน่วยกิตกิจกรรมเปิดกว้าง',
      bullets: [
        `ตรวจยอดสะสมของนักศึกษาทุกคนในปีการศึกษา 2569`,
        toLock.length ? `ล็อกเพิ่ม ${toLock.length} คนที่ยอดถึง ${QUOTA_MAX} หน่วย` : 'ไม่มีรายชื่อใหม่ที่ต้องล็อกเพิ่ม',
        'สถานะล็อกจะหยุดนับหน่วยกิตกิจกรรมเปิดกว้างของคนนั้นในปีนี้',
      ],
      confirmText: 'ยืนยันตรวจสอบ/ล็อก',
      onConfirm: () => {
        toLock.forEach((l) => { l.locked = true; });
        RegDB.save();
        appendAudit('quota_locked', `ตรวจสอบ/ล็อกโควต้า — ล็อกเพิ่ม ${toLock.length} คน`);
        showToast(toLock.length ? `ล็อกโควต้าเพิ่ม ${toLock.length} คนแล้ว` : 'ตรวจสอบแล้ว ไม่มีรายชื่อที่ต้องล็อกเพิ่ม');
        renderQuotaTable();
      },
    });
  });
}

function renderQuotaTable() {
  const q = (document.getElementById('quota-search').value || '').toLowerCase();
  const list = RegDB.ledger.filter((l) => (l.code + l.name).toLowerCase().includes(q));
  const locked = RegDB.ledger.filter((l) => l.locked).length;
  document.getElementById('quota-stats').innerHTML =
    statsCard('นักศึกษาทั้งหมด', RegDB.ledger.length, 'ในปีการศึกษา 2569')
    + statsCard('ครบโควต้า/ล็อกแล้ว', locked, 'คนที่ล็อกแล้ว', { valueCls: 'text-purple-600', icon: 'lock' })
    + statsCard('ใกล้ครบ (>=10)', RegDB.ledger.filter((l) => !l.locked && l.units >= 10).length, 'ควรจับตา', { valueCls: 'text-amber-600' })
    + statsCard('ปีการศึกษา', '2569', `เริ่ม ${thDate(RegDB.cycles[0].start)}`);

  document.getElementById('quota-table').innerHTML = list.length ? `
    <table class="w-full">
      <thead><tr class="border-b border-slate-100 bg-slate-50/50">
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">รหัสนักศึกษา</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-64">ยอดสะสม (หน่วย)</th>
        <th class="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะ</th>
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
          </tr>`;
        }).join('')}
      </tbody>
    </table>` : emptyState('ไม่พบนักศึกษาที่ค้นหา');
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
        RegDB.cycles.unshift({ year: newYear, start: dateVal, by: 'พี่สมบัติ วงศ์ทะเบียน', at: new Date().toISOString().slice(0, 16).replace('T', ' ') });
        RegDB.ledger.forEach((l) => { l.units = 0; l.locked = false; });
        RegDB.save();
        appendAudit('cycle_opened', `เปิดรอบปีการศึกษา ${newYear} (เริ่ม ${dateVal}) และรีเซ็ตยอดสะสมทุกคน`);
        showToast(`เปิดรอบปีการศึกษา ${newYear} แล้ว — ยอดสะสมทุกคนถูกรีเซ็ตและเก็บประวัติปีเก่า`);
        renderCycles();
      },
    });
  });
}

function renderCycles() {
  const cur = RegDB.cycles[0];
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
      ${i !== 0 ? `<a href="registrar-quotas.html" class="text-xs text-blue-600 hover:underline shrink-0">ดูยอดสะสม (archive)</a>` : ''}
    </div>`).join('');
}

/* ---------------- Screen 7: ตั้งค่าการแจ้งเตือน Slack --------------------- */
const SLACK_TOGGLES = [
  { key: 'proof', label: 'หลักฐานกิจกรรมเปิดกว้างรอตรวจ', desc: 'DM ทันทีเมื่อนักศึกษาส่งหลักฐานใหม่ และเตือนซ้ำถ้าค้างเกิน 2 วัน' },
  { key: 'roster', label: 'กิจกรรมที่ยังไม่ส่งรายชื่อ', desc: 'เตือนเมื่อจบกิจกรรมแล้ว 3 วันแต่ Lead Org ยังไม่ส่งรายชื่อ' },
  { key: 'cycle', label: 'ใกล้เปิดรอบปีการศึกษาใหม่', desc: 'เตือนรายสัปดาห์ช่วงเดือนพ.ค.-มิ.ย. ถ้ายังไม่เปิดรอบใหม่' },
  { key: 'chatbot', label: 'บอทตอบคำถามไม่ได้', desc: 'DM คำถาม + รหัสนักศึกษา เมื่อ SciU-Buddy ต้อง fallback' },
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

/* ---------------- Registrar Home ----------------------------------------- */
function initRegistrarHome() {
  const pending = pendingProofs().length;
  const locked = RegDB.ledger.filter((l) => l.locked).length;
  const overdue = RegDB.events.filter((e) => e.rosterOverdue).length;

  document.getElementById('home-stats').innerHTML =
    statsCard('รอตรวจ', pending, 'หลักฐานรอการอนุมัติ', { valueCls: pending ? 'text-amber-600' : 'text-slate-900' })
    + statsCard('ครบโควต้า', locked, 'คนที่ล็อกแล้ว', { valueCls: 'text-purple-600', icon: 'lock' })
    + statsCard('ยังไม่ส่งรายชื่อ', overdue, 'เกิน 3 วันหลังจบงาน', { valueCls: overdue ? 'text-red-500' : 'text-slate-900' })
    + statsCard('ปีการศึกษา', RegDB.cycles[0].year, `เริ่ม ${thDate(RegDB.cycles[0].start)}`);

  const tasks = [
    { icon: 'file-text', text: `หลักฐานรอตรวจ (${pending} รายการ)`, href: 'registrar-ocr-review.html', cta: 'ไปตรวจ' },
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
