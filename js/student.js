/* =========================================================================
 * SciU-Regis Mock-up — student.js
 * Mock data + logic สำหรับหน้าจอฝั่งนักศึกษา (Screen 8-10 + Home)
 * ========================================================================= */

const STUDENT_QUOTA_MAX = 12;

const ME = { name: 'สมชาย ใจดี', code: '66114400123', email: 'somchai.ja@ubu.ac.th' };

/* กิจกรรมที่กำลังเปิดรับ (subset ของ events ฝั่ง registrar) */
const OPEN_EVENTS = [
  { id: 2, name: 'Science Open House 2569', date: '2026-07-15', credits: 1.5, open: false, gps: true, lat: 15.1215, lng: 104.9101, radius: 50, place: 'อาคาร SC — คณะวิทยาศาสตร์' },
  { id: 5, name: 'จิตอาสาพัฒนาคณะวิทยาศาสตร์', date: '2026-07-02', credits: 2.0, open: false, gps: true, lat: 15.1198, lng: 104.9077, radius: 40, place: 'ลานกิจกรรม SC18' },
  { id: 6, name: 'ปลูกป่าชายเลนเฉลิมพระเกียรติ (เปิดกว้าง)', date: '2026-07-08', credits: 2.0, open: true, gps: false, place: 'นอกสถานที่' },
];

const MY_HISTORY = [
  { name: 'ค่ายจิตอาสาพัฒนาโรงเรียนบ้านดอนงัว', date: '2026-06-20', credits: 3.0, type: 'เช็คอิน GPS', status: 'ready' },
  { name: 'บริจาคโลหิต สภากาชาดไทย', date: '2026-06-05', credits: 1.0, type: 'กิจกรรมเปิดกว้าง (อนุมัติแล้ว)', status: 'ready' },
  { name: 'จิตอาสาช่วยงานวัดป่านานาชาติ', date: '2026-07-08', credits: 2.0, type: 'กิจกรรมเปิดกว้าง (รอตรวจ)', status: 'pending' },
  { name: 'อบรมปฐมพยาบาลเบื้องต้น CPR', date: '2026-06-28', credits: 1.5, type: 'เช็คอิน Master Code', status: 'ready' },
];

function myUnits() {
  const ledger = Store.get('ledger', []);
  const row = ledger.find((l) => l.code === ME.code);
  return row ? row.units : 9.0;
}
function myLocked() { return myUnits() >= STUDENT_QUOTA_MAX; }

/* ---------------- Student Home ------------------------------------------- */
function initStudentHome() {
  document.getElementById('sh-progress').innerHTML = progressBar(myUnits(), STUDENT_QUOTA_MAX);

  document.getElementById('sh-events').innerHTML = OPEN_EVENTS.map((e) => `
    <div class="px-4 py-3.5 hover:bg-slate-50 transition">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-medium text-slate-800 truncate">${e.name}</p>
          <p class="text-xs text-slate-400 mt-0.5">${thDate(e.date)} • ${e.credits} หน่วยกิต • ${e.place}</p>
        </div>
        ${e.open ? statusBadge('open', 'เปิดกว้าง') : ''}
      </div>
      <div class="flex gap-2 mt-2.5">
        <a href="student-checkin.html" class="text-xs font-medium text-white bg-blue-600 hover:bg-blue-800 rounded-lg px-3 py-1.5 transition">ลงทะเบียน / เช็คอิน</a>
        <a href="#" class="text-xs font-medium text-slate-500 border border-slate-200 hover:bg-slate-50 rounded-lg px-3 py-1.5 transition">รายละเอียด</a>
      </div>
    </div>`).join('');

  document.getElementById('sh-history').innerHTML = MY_HISTORY.map((h) => `
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <div class="min-w-0">
        <p class="text-sm text-slate-700 truncate">${h.name}</p>
        <p class="text-xs text-slate-400 mt-0.5">${thDate(h.date)} • ${h.type}</p>
      </div>
      <span class="text-sm font-mono font-semibold ${h.status === 'pending' ? 'text-amber-600' : 'text-emerald-700'} shrink-0">+${h.credits.toFixed(1)}</span>
    </div>`).join('');

  const done = MY_HISTORY.filter((h) => h.status === 'ready');
  document.getElementById('sh-stats').innerHTML =
    statsCard('ลงทะเบียนแล้ว', MY_HISTORY.length + 4, 'กิจกรรมทั้งหมด')
    + statsCard('เช็คอินสำเร็จ', done.length + 2, 'ครั้งในปีนี้')
    + statsCard('หน่วยกิตรวม', done.reduce((s, h) => s + h.credits, 0).toFixed(1), 'ทุกประเภทกิจกรรม', { valueCls: 'text-blue-700' });

  initLineOptIn('sh-line');
}

/* LINE opt-in (PDPA docs/14 §4 — consent แยก, default OFF) */
function initLineOptIn(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const render = () => {
    const notify = Store.get('consent:line-notify', false);
    const chat = Store.get('consent:line-chat', false);
    mount.innerHTML = `
      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <span class="text-green-600">${icon('line', 'w-5 h-5')}</span>
          <div>
            <h2 class="text-base font-semibold text-slate-800">เชื่อมต่อ LINE (opt-in)</h2>
            <p class="text-xs text-slate-400">ความยินยอมแยก 2 รายการ ปิดเป็นค่าเริ่มต้น — ถอนได้ทุกเมื่อ (PDPA)</p>
          </div>
        </div>
        ${[
          { key: 'consent:line-notify', label: 'รับการแจ้งเตือนผ่าน LINE', desc: 'เช่น ผลอนุมัติหลักฐาน, ชั่วโมงเข้าระบบ UBU SAC แล้ว', val: notify },
          { key: 'consent:line-chat', label: 'ใช้แชทบอท SciU-Buddy ผ่าน LINE', desc: 'ข้อความแชทจะถูกประมวลผลโดย AI — ขอความยินยอมแยกจากการแจ้งเตือน', val: chat },
        ].map((t) => `
          <label class="flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition cursor-pointer border-t border-slate-50">
            <span>
              <span class="block text-sm font-medium text-slate-800">${t.label}</span>
              <span class="block text-xs text-slate-400 mt-0.5">${t.desc}</span>
            </span>
            <span class="relative inline-flex shrink-0 mt-0.5">
              <input type="checkbox" data-key="${t.key}" class="toggle-input line-toggle sr-only" ${t.val ? 'checked' : ''}>
              <span class="toggle-track w-11 h-6 bg-slate-200 rounded-full transition-colors flex items-center px-0.5">
                <span class="toggle-thumb w-5 h-5 bg-white rounded-full shadow transition-transform"></span>
              </span>
            </span>
          </label>`).join('')}
      </div>`;
    mount.querySelectorAll('.line-toggle').forEach((el) => el.addEventListener('change', (e) => {
      Store.set(e.target.dataset.key, e.target.checked);
      showToast(e.target.checked ? 'บันทึกความยินยอมแล้ว — เชื่อมบัญชี LINE สำเร็จ (จำลอง)' : 'ถอนความยินยอมแล้ว', 'info');
      render();
    }));
  };
  render();
}

/* ---------------- Screen 8: เช็คอินกิจกรรม -------------------------------- */
let checkinEvent = OPEN_EVENTS[1]; // จิตอาสาพัฒนาคณะวิทยาศาสตร์ @ SC18
const MOCK_POSITIONS = {
  inside: { lat: 15.11995, lng: 104.90785, label: 'ในลานกิจกรรม SC18' },
  outside: { lat: 15.12310, lng: 104.91530, label: 'หน้าประตูมหาวิทยาลัย' },
};
let mockPos = 'inside';
const MASTER_CODE_VALID = 'A7K2M9';

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

function initCheckinPage() {
  const eventId = Number(Store.get('eventId', 5));
  const allEvents = Store.get('events', []);
  const found = allEvents.find(e => e.id === eventId);
  if (found) {
    checkinEvent = found;
  }

  document.getElementById('ci-event').innerHTML = `
    <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">กิจกรรมที่เลือก</p>
    <p class="text-base font-semibold text-slate-800 mt-1">${checkinEvent.name}</p>
    <p class="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">${icon('map-pin', 'w-3.5 h-3.5')} ${checkinEvent.location || checkinEvent.place || 'คณะวิทยาศาสตร์'} • รัศมี ${checkinEvent.radius || 30} ม. • ${checkinEvent.credits} หน่วยกิต</p>`;
  
  const hasGps = checkinEvent.gps !== false;
  const hasSelfie = checkinEvent.selfie !== false;
  const hasCode = checkinEvent.masterCode !== false;

  document.getElementById('mode-gps').classList.toggle('hidden', !hasGps);
  document.getElementById('mode-selfie').classList.toggle('hidden', !hasSelfie);
  document.getElementById('mode-code').classList.toggle('hidden', !hasCode);

  if (hasGps) {
    switchMode('gps');
  } else if (hasSelfie) {
    switchMode('selfie');
  } else if (hasCode) {
    switchMode('code');
  } else {
    document.getElementById('pane-gps').classList.add('hidden');
    document.getElementById('pane-selfie').classList.add('hidden');
    document.getElementById('pane-code').classList.add('hidden');
  }
}

function switchMode(mode) {
  ['gps', 'selfie', 'code'].forEach((m) => {
    document.getElementById('pane-' + m).classList.toggle('hidden', m !== mode);
    const tab = document.getElementById('mode-' + m);
    tab.className = 'flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition text-sm font-medium ' + (m === mode
      ? 'border-blue-600 bg-blue-50 text-blue-700'
      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300');
  });
  if (mode === 'selfie' && !Store.get('consent:selfie', false)) requestSelfieConsent();
}

function setMockPos(key) {
  mockPos = key;
  document.getElementById('pos-inside').className = 'flex-1 py-2 text-xs font-medium rounded-xl transition ' + (key === 'inside' ? 'bg-blue-600 text-white shadow' : 'bg-white border border-slate-200 text-slate-500');
  document.getElementById('pos-outside').className = 'flex-1 py-2 text-xs font-medium rounded-xl transition ' + (key === 'outside' ? 'bg-blue-600 text-white shadow' : 'bg-white border border-slate-200 text-slate-500');
  document.getElementById('gps-result').innerHTML = '';
}

function doGpsCheckin() {
  const pos = MOCK_POSITIONS[mockPos];
  const dist = haversineMeters(pos.lat, pos.lng, checkinEvent.lat, checkinEvent.lng);
  const ok = dist <= checkinEvent.radius;
  document.getElementById('gps-result').innerHTML = ok ? `
    <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center space-y-2">
      <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">${icon('check-circle', 'w-6 h-6')}</div>
      <p class="text-sm font-semibold text-emerald-800">เช็คอินสำเร็จ!</p>
      <p class="text-xs text-emerald-700">คุณอยู่ห่างจุดกิจกรรม <span class="font-mono font-semibold">${dist} ม.</span> (ในรัศมี ${checkinEvent.radius} ม.) — บันทึกเวลา ${new Date().toLocaleTimeString('th-TH')}</p>
    </div>` : `
    <div class="rounded-2xl border border-red-200 bg-red-50 p-5 text-center space-y-2">
      <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">${icon('x-circle', 'w-6 h-6')}</div>
      <p class="text-sm font-semibold text-red-800">เช็คอินไม่สำเร็จ — อยู่นอกพื้นที่กิจกรรม</p>
      <p class="text-xs text-red-700">ตำแหน่งของคุณ (<span class="font-mono">${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}</span>) ห่างจุดกิจกรรม <span class="font-mono font-semibold">${dist} ม.</span> เกินรัศมี ${checkinEvent.radius} ม.</p>
      <p class="text-xs text-red-600">กรุณาเข้าใกล้พื้นที่จัดงาน หรือติดต่อสตาฟเพื่อขอ Master Code</p>
    </div>`;
  if (ok) showToast('เช็คอิน GPS สำเร็จ');
}

/* Selfie + PDPA consent (มาตรา 26 — ขอชัดแจ้งก่อนเปิดกล้อง) */
function requestSelfieConsent() {
  showConfirmDialog({
    title: 'ขอความยินยอมใช้ภาพถ่าย (Selfie)',
    message: 'ภาพถ่ายใบหน้าเป็นข้อมูลชีวภาพ (Sensitive Data) ตาม PDPA มาตรา 26 ต้องขอความยินยอมโดยชัดแจ้งก่อนเปิดกล้อง',
    bullets: [
      'ใช้เพื่อยืนยันการเข้าร่วมกิจกรรมนี้เท่านั้น',
      'ระบบลบไฟล์ภาพอัตโนมัติภายใน 90 วัน (เก็บเฉพาะข้อมูลว่าเช็คอินแล้ว)',
      'ปฏิเสธได้ — ใช้เช็คอินแบบ GPS หรือ Master Code แทน',
    ],
    confirmText: 'ยินยอม เปิดกล้อง',
    cancelText: 'ไม่ยินยอม',
    onConfirm: () => {
      Store.set('consent:selfie', true);
      showToast('บันทึกความยินยอมแล้ว — เปิดกล้องได้', 'info');
      renderSelfiePane();
    },
  });
  renderSelfiePane();
}

function renderSelfiePane() {
  const consented = Store.get('consent:selfie', false);
  document.getElementById('selfie-area').innerHTML = consented ? `
    <div class="rounded-2xl bg-slate-900 h-64 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden" role="img" aria-label="กล้องจำลอง">
      <span class="text-slate-500">${icon('camera', 'w-10 h-10')}</span>
      <p class="text-xs mt-2 text-slate-500">กล้องจำลอง (mock camera preview)</p>
      <span class="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] text-red-400"><span class="w-2 h-2 rounded-full bg-red-500 gps-dot"></span> LIVE</span>
    </div>
    <button onclick="captureSelfie()" class="w-full inline-flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-600/20" type="button">
      ${icon('camera', 'w-5 h-5')} ถ่ายรูปและเช็คอิน
    </button>
    <button onclick="revokeSelfieConsent()" class="w-full text-xs text-slate-400 hover:text-red-500 transition py-1" type="button">ถอนความยินยอมการใช้ภาพถ่าย</button>` : `
    <div class="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center space-y-3">
      <div class="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">${icon('lock', 'w-6 h-6')}</div>
      <p class="text-sm font-medium text-slate-600">ยังไม่ได้ให้ความยินยอมใช้ภาพถ่าย</p>
      <p class="text-xs text-slate-400 leading-relaxed">กล้องจะเปิดได้หลังจากคุณให้ความยินยอมโดยชัดแจ้งเท่านั้น (PDPA มาตรา 26)<br/>หรือเลือกเช็คอินแบบ GPS / Master Code แทน</p>
      <button onclick="requestSelfieConsent()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-800 transition" type="button">
        ${icon('shield', 'w-4 h-4')} อ่านและให้ความยินยอม
      </button>
    </div>`;
}

function captureSelfie() {
  showToast('ถ่ายรูปสำเร็จ — เช็คอินด้วย Selfie แล้ว (ไฟล์จะถูกลบอัตโนมัติใน 90 วัน)');
}

function revokeSelfieConsent() {
  Store.set('consent:selfie', false);
  showToast('ถอนความยินยอมแล้ว — ใช้ GPS หรือ Master Code เช็คอินแทนได้', 'info');
  renderSelfiePane();
}

/* Master Code */
function submitMasterCode(e) {
  e.preventDefault();
  const val = document.getElementById('mc-input').value.trim().toUpperCase();
  const box = document.getElementById('mc-result');
  if (!/^[A-Z0-9]{6}$/.test(val)) {
    box.innerHTML = `<p class="text-xs text-red-600 flex items-center gap-1.5">${icon('alert-triangle', 'w-4 h-4')} รหัสต้องเป็นตัวอักษร/ตัวเลข 6 ตัว</p>`;
    return;
  }
  if (val === MASTER_CODE_VALID) {
    box.innerHTML = `
      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
        <p class="text-sm font-semibold text-emerald-800 flex items-center justify-center gap-1.5">${icon('check-circle', 'w-4 h-4')} เช็คอินด้วย Master Code สำเร็จ</p>
        <p class="text-xs text-emerald-700 mt-1">รหัสถูกออกโดย Field Staff หน้างาน — บันทึกเวลา ${new Date().toLocaleTimeString('th-TH')}</p>
      </div>`;
    showToast('เช็คอินด้วย Master Code สำเร็จ');
  } else {
    box.innerHTML = `
      <div class="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
        <p class="text-sm font-semibold text-red-800 flex items-center justify-center gap-1.5">${icon('x-circle', 'w-4 h-4')} รหัสไม่ถูกต้องหรือหมดอายุ</p>
        <p class="text-xs text-red-600 mt-1">ขอรหัสใหม่จากสตาฟหน้างาน (รหัสจำลองที่ใช้ได้: <span class="font-mono font-semibold">${MASTER_CODE_VALID}</span>)</p>
      </div>`;
  }
}

/* ---------------- Screen 9: อัปโหลดหลักฐาน ------------------------------- */
function initProofUploadPage() {
  const units = myUnits();
  const locked = myLocked();
  document.getElementById('pu-progress').innerHTML = progressBar(units, STUDENT_QUOTA_MAX, {
    label: locked ? 'โควต้าปีการศึกษา 2569' : `คุณสะสมได้อีก ${(STUDENT_QUOTA_MAX - units).toFixed(1).replace(/\.0$/, '')}/${STUDENT_QUOTA_MAX} หน่วยในปีการศึกษานี้`,
  });

  if (locked) {
    document.getElementById('pu-form-wrap').innerHTML = `
      <div class="rounded-2xl border border-purple-200 bg-purple-50 p-8 text-center space-y-3">
        <div class="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">${icon('lock', 'w-7 h-7')}</div>
        <p class="text-base font-semibold text-purple-800">โควต้ากิจกรรมเปิดกว้างของปีนี้ครบแล้ว (${STUDENT_QUOTA_MAX}/${STUDENT_QUOTA_MAX} หน่วย)</p>
        <p class="text-sm text-purple-700 leading-relaxed">หลักฐานที่ส่งเพิ่มจะไม่ถูกนับหน่วยกิตในปีการศึกษานี้<br/>ระบบจึงปิดการอัปโหลดเพื่อไม่ให้เสียเวลา — โควต้าจะรีเซ็ตเมื่อเปิดรอบปีการศึกษาใหม่</p>
      </div>`;
    return;
  }

  const select = document.getElementById('pu-event-id');
  if (select) {
    const allEvents = Store.get('events', []);
    const openEvents = allEvents.filter(e => e.open === true || e.is_open_category === true);
    const listToUse = openEvents.length ? openEvents : [
      { id: 3, name: 'บริจาคโลหิต สภากาชาดไทย (เปิดกว้าง)' },
      { id: 6, name: 'ปลูกป่าชายเลนเฉลิมพระเกียรติ (เปิดกว้าง)' },
      { id: 7, name: 'กิจกรรมจิตอาสาสาธารณประโยชน์ภายนอกคณะ (เปิดกว้าง)' }
    ];
    select.innerHTML = `<option value="" disabled selected>-- กรุณาเลือกประเภทกิจกรรมเปิดกว้าง --</option>` +
      listToUse.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  }

  const dz = document.getElementById('dropzone');
  const fileInput = document.getElementById('pu-file');
  dz.addEventListener('click', () => fileInput.click());
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('border-blue-500', 'bg-blue-50/40'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('border-blue-500', 'bg-blue-50/40'));
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('border-blue-500', 'bg-blue-50/40');
    if (e.dataTransfer.files.length) setUploadedFile(e.dataTransfer.files[0].name);
  });
  fileInput.addEventListener('change', () => { if (fileInput.files.length) setUploadedFile(fileInput.files[0].name); });

  document.getElementById('pu-consent').addEventListener('change', updateSubmitState);
  document.getElementById('proof-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const hours = parseFloat(document.getElementById('pu-hours').value) || 0;
    const unitsClaim = hours / 3; // 3 ชม. = 1 หน่วย
    const proofs = Store.get('proofs', []);
    const selEvent = document.getElementById('pu-event-id');
    const eventId = Number(selEvent.value);
    const categoryTitle = selEvent.options[selEvent.selectedIndex].text;
    const titleVal = document.getElementById('pu-title').value;

    proofs.unshift({
      id: Date.now(), student: ME.name, code: ME.code,
      eventId: eventId,
      categoryTitle: categoryTitle,
      title: titleVal || 'กิจกรรมจิตอาสา',
      submitted: new Date().toISOString().slice(0, 10), hours, units: unitsClaim,
      file: Store.get('pu-filename', 'หลักฐาน.pdf'), status: 'pending', mismatch: false,
      ocr: { name: 'นาย' + ME.name, date: thDate(document.getElementById('pu-date').value || new Date()), hours, confidence: 90 },
    });
    Store.set('proofs', proofs);
    showToast('ส่งหลักฐานแล้ว — ระบบกำลังอ่านด้วย OCR และจะแจ้งผลหลัง Registrar ตรวจ');
    e.target.reset();
    document.getElementById('uploaded-file').innerHTML = '';
    Store.remove('pu-filename');
    updateSubmitState();
  });
  updateSubmitState();
}

function setUploadedFile(name) {
  Store.set('pu-filename', name);
  document.getElementById('uploaded-file').innerHTML = `
    <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
      <span class="text-emerald-600 shrink-0">${icon('check-circle', 'w-5 h-5')}</span>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-emerald-800 truncate">${name}</p>
        <p class="text-xs text-emerald-600">อัปโหลดสำเร็จ (จำลอง)</p>
      </div>
      <button type="button" onclick="this.closest('div.bg-emerald-50').remove(); Store.remove('pu-filename'); updateSubmitState();" class="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium">${icon('trash-2', 'w-4 h-4')} ลบ</button>
    </div>`;
  updateSubmitState();
}

function updateSubmitState() {
  const btn = document.getElementById('pu-submit');
  if (!btn) return;
  const ok = document.getElementById('pu-consent').checked;
  btn.disabled = !ok;
  btn.className = ok
    ? 'w-full inline-flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-600/20'
    : 'w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-200 text-slate-400 font-medium rounded-xl cursor-not-allowed';
}

/* ---------------- Screen 10: แชทบอท SciU-Buddy --------------------------- */
/* Mock knowledge base — keyword matching */
const CHAT_KB = [
  { keys: ['ชั่วโมง', 'สะสม', 'เท่าไหร่', 'เท่าไร', 'หน่วยกิต'], mcp: 'search_knowledge_base',
    reply: (name) => `ขณะนี้คุณ${name}มีหน่วยกิตกิจกรรมเปิดกว้างสะสม <strong>${myUnits().toFixed(1)}/${STUDENT_QUOTA_MAX} หน่วย</strong> ในปีการศึกษา 2569 ครับ<br/><br/>ดูรายละเอียดเพิ่มเติมได้ที่หน้า "ประวัติของฉัน" นะครับ` },
  { keys: ['กิจกรรม', 'เปิดรับ', 'ลงทะเบียน', 'สมัคร'], mcp: 'get_active_events',
    reply: () => `ขณะนี้มีกิจกรรมเปิดให้ลงทะเบียนอยู่ ${OPEN_EVENTS.length} รายการครับ<br/><br/>${OPEN_EVENTS.map((e) => `• <strong>${e.name}</strong> (${thDate(e.date)}, ${e.credits} หน่วย)`).join('<br/>')}<br/><br/>ลงทะเบียนและเช็คอินได้ผ่านหน้ากิจกรรมเลยครับ` },
  { keys: ['เปิดกว้าง', 'จิตอาสา', 'นอกสถานที่', 'open'], mcp: 'search_knowledge_base',
    reply: () => `"กิจกรรมเปิดกว้าง" คือกิจกรรมจิตอาสานอกสถานที่ที่คุณหาเองได้ครับ ส่งใบรับรอง + รูปถ่ายเข้าระบบ แล้วเจ้าหน้าที่จะตรวจด้วย OCR ก่อนอนุมัติ<br/><br/>เพดานสะสมคือ <strong>12 หน่วย (36 ชั่วโมง) ต่อปีการศึกษา</strong> ครับ` },
  { keys: ['ขั้นต่ำ', 'sac', 'จบ', 'เกณฑ์'], mcp: 'search_knowledge_base',
    reply: () => `ตามระเบียบ UBU SAC นักศึกษาต้องมีชั่วโมงกิจกรรมขั้นต่ำ <strong>100 หน่วยชั่วโมง</strong> ตลอดหลักสูตรครับ แบ่งเป็นกิจกรรมบังคับและกิจกรรมเลือก<br/><br/>รายละเอียดฉบับเต็มดูจากคู่มือกิจกรรมนักศึกษาได้ครับ` },
  { keys: ['ติดต่อ', 'ทะเบียน', 'เจ้าหน้าที่', 'โทร', 'อีเมล', 'email'], mcp: 'search_faculty_contacts',
    reply: () => `ติดต่องานทะเบียนกิจกรรม คณะวิทยาศาสตร์ ได้ที่ครับ:<br/><br/>โทร: <strong>045-353-xxx</strong><br/>อีเมล: <a href="mailto:registrar@sci.ubu.ac.th" class="text-blue-600 underline">registrar@sci.ubu.ac.th</a><br/>ที่ตั้ง: สำนักงานคณบดี ชั้น 1 อาคาร SC` },
  { keys: ['เช็คอิน', 'gps', 'selfie', 'master code', 'โค้ด'], mcp: 'search_knowledge_base',
    reply: () => `การเช็คอินกิจกรรมทำได้ 3 วิธีครับ:<br/><br/>1. <strong>GPS</strong> — เช็คอินในรัศมีพื้นที่จัดงาน<br/>2. <strong>Selfie</strong> — ถ่ายรูปยืนยันตัว (ขอความยินยอมก่อน และลบไฟล์ใน 90 วัน)<br/>3. <strong>Master Code</strong> — กรอกรหัส 6 ตัวจากสตาฟหน้างาน` },
];

let chatUserName = ME.name.split(' ')[0];

function initChatbotPage() {
  const params = new URLSearchParams(location.search);
  const isGuest = params.get('role') === 'guest';
  if (isGuest) chatUserName = 'นิสิต';

  addBotBubble(`สวัสดีครับคุณ${chatUserName} ผมชื่อ <strong>SciU-Buddy</strong> ผู้ช่วยกิจกรรมนักศึกษา คณะวิทยาศาสตร์ครับ<br/><br/>ถามผมได้เลยครับ เช่น ชั่วโมงสะสม, กิจกรรมที่เปิดรับ, ระเบียบ UBU SAC หรือช่องทางติดต่อเจ้าหน้าที่`, null);

  const q = params.get('q');
  if (q) {
    document.getElementById('chat-input').value = q;
    setTimeout(() => sendChat(), 400);
  }

  document.getElementById('chat-form').addEventListener('submit', (e) => { e.preventDefault(); sendChat(); });
  document.getElementById('chat-suggest').innerHTML = ['ผมมีชั่วโมงสะสมเท่าไหร่แล้ว', 'มีกิจกรรมอะไรเปิดรับบ้าง', 'กยศ. ขอกู้เพิ่มทำยังไง']
    .map((s) => `<button type="button" onclick="document.getElementById('chat-input').value='${s}'; sendChat();" class="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1.5 transition">${s}</button>`).join('');
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addUserBubble(text);
  showTyping();
  setTimeout(() => {
    hideTyping();
    const hit = CHAT_KB.find((k) => k.keys.some((kw) => text.toLowerCase().includes(kw)));
    if (hit) {
      addBotBubble(hit.reply(chatUserName), `ข้อมูลจาก MCP: ${hit.mcp}`);
    } else {
      // Human Fallback (FR-D) — email ในบับเบิลเดียวกัน + จำลอง Slack DM เบื้องหลัง
      addBotBubble(
        `ผมไม่ทราบคำตอบสำหรับคำถามนี้ครับ เจ้าหน้าที่กำลังตรวจสอบและจะติดต่อคุณกลับ<br/><br/>หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเจ้าหน้าที่งานทะเบียนได้ที่:<br/>
        <a href="mailto:registrar@sci.ubu.ac.th" class="text-blue-600 hover:underline font-medium inline-flex items-center gap-1">${icon('mail', 'w-4 h-4')} registrar@sci.ubu.ac.th</a>`,
        'แจ้งเตือนเจ้าหน้าที่ผ่าน Slack แล้ว', true,
      );
      console.info('[MOCK Slack DM -> Registrar]', { student: ME.code, question: text, time: new Date().toISOString() });
    }
  }, 900);
}

function addUserBubble(text) {
  document.getElementById('chat-log').insertAdjacentHTML('beforeend', `
    <div class="flex justify-end gap-3">
      <div class="max-w-[75%] bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5">
        <p class="text-sm leading-relaxed">${text}</p>
      </div>
      <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">${icon('user', 'w-4 h-4')}</div>
    </div>`);
  scrollChat();
}

function addBotBubble(html, source, isFallback = false) {
  document.getElementById('chat-log').insertAdjacentHTML('beforeend', `
    <div class="flex gap-3">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center shrink-0 shadow-sm">${icon('robot', 'w-4 h-4')}</div>
      <div class="max-w-[75%] bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
        <p class="text-sm leading-relaxed text-slate-700">${html}</p>
        ${source ? `
        <div class="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
          <span class="text-slate-400">${icon(isFallback ? 'refresh' : 'search', 'w-3 h-3')}</span>
          <span class="text-[10px] text-slate-400">${source}</span>
        </div>` : ''}
      </div>
    </div>`);
  scrollChat();
}

function showTyping() {
  document.getElementById('chat-log').insertAdjacentHTML('beforeend', `
    <div class="flex gap-3" id="typing-row">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center shrink-0 shadow-sm">${icon('robot', 'w-4 h-4')}</div>
      <div class="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
        <span class="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        <span class="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        <span class="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      </div>
    </div>`);
  scrollChat();
}

function hideTyping() {
  const el = document.getElementById('typing-row');
  if (el) el.remove();
}

function scrollChat() {
  const log = document.getElementById('chat-log');
  log.scrollTop = log.scrollHeight;
}
