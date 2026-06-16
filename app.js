const STORAGE_KEY = "hemodialysis-scheduler-v1";
const SHIFT_LABELS = {
  morning: "上午",
  afternoon: "下午",
};
const STAFF_SHIFT_KEYS = ["morning", "afternoon"];
const DOCTOR_COUNT = 2;
const MACHINES_PER_NURSE = 6;
const BACKUP_NURSE_COUNT = 1;
const WEEK_DAYS = [
  { key: "1", label: "周一" },
  { key: "2", label: "周二" },
  { key: "3", label: "周三" },
  { key: "4", label: "周四" },
  { key: "5", label: "周五" },
  { key: "6", label: "周六" },
  { key: "0", label: "周日" },
];
const WEEK_DAY_LABELS = {
  zh: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};
const I18N = {
  zh: {
    titleSuffix: "排班系统",
    storageReady: "本地自动保存，打开后自动读取",
    storageLoaded: "已读取本地保存数据",
    tabs: ["排班台", "患者库", "医护库", "布局设置"],
    print: "打印",
    export: "导出",
    import: "导入",
    reset: "全部重置",
    date: "日期",
    weekMeta: "默认读取每周模板；临时变化可保存为仅当前日期",
    prevWeek: "上一周",
    nextWeek: "下一周",
    today: "今天",
    staffBoard: "医护排班",
    scheduleBoard: "今日排班",
    saveAsWeekly: "本日设为周模板",
    copyPrevious: "复制前一天",
    clearDay: "清空当日",
    language: "语言 / Language",
  },
  en: {
    titleSuffix: "Scheduling",
    storageReady: "Auto-saved locally and loaded on next open",
    storageLoaded: "Loaded local saved data",
    tabs: ["Schedule", "Patients", "Staff", "Settings"],
    print: "Print",
    export: "Export",
    import: "Import",
    reset: "Reset All",
    date: "Date",
    weekMeta: "Uses weekly templates by default; save one-off changes for this date only",
    prevWeek: "Previous Week",
    nextWeek: "Next Week",
    today: "Today",
    staffBoard: "Staff Schedule",
    scheduleBoard: "Daily Schedule",
    saveAsWeekly: "Save Day as Template",
    copyPrevious: "Copy Previous Day",
    clearDay: "Clear Day",
    language: "Language / 语言",
  },
};

const DEFAULT_STATE = {
  settings: {
    roomName: "血透室",
    rowCount: 3,
    machinesPerRow: 8,
    machinePrefix: "",
    hdfMachines: [],
    language: "zh",
  },
  patients: [],
  staffMembers: [],
  weeklySchedules: {},
  schedules: {},
  weeklyStaffSchedules: {},
  staffSchedules: {},
};

const state = loadState();
const ui = {};
let selectedSlot = null;
let toastTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  ensureDate();
  renderAll();
});

function bindElements() {
  [
    "roomTitle",
    "storageStatus",
    "scheduleDate",
    "summaryGrid",
    "weekTitle",
    "weekMeta",
    "prevWeek",
    "nextWeek",
    "todayButton",
    "weekDayStrip",
    "staffTitle",
    "staffMeta",
    "staffScheduleScope",
    "staffScheduleGrid",
    "boardTitle",
    "boardMeta",
    "machineRows",
    "copyPreviousDay",
    "saveDayAsWeeklyTemplate",
    "clearDay",
    "printSchedule",
    "exportData",
    "importData",
    "resetAllData",
    "patientForm",
    "patientFormTitle",
    "resetPatientForm",
    "patientId",
    "patientName",
    "dialysisNo",
    "patientGender",
    "patientAge",
    "patientPhone",
    "dryWeight",
    "vascularAccess",
    "patientStatus",
    "infectionFlag",
    "preferredShift",
    "patientPreferredDays",
    "patientNote",
    "deletePatient",
    "patientSearch",
    "patientTableBody",
    "staffForm",
    "staffFormTitle",
    "resetStaffForm",
    "staffId",
    "staffName",
    "staffCode",
    "staffRole",
    "staffPhone",
    "staffPreferredShift",
    "staffStatus",
    "staffNote",
    "deleteStaff",
    "staffSearch",
    "staffTableBody",
    "layoutForm",
    "languageSelect",
    "roomName",
    "machinesPerRow",
    "rowCount",
    "machinePrefix",
    "restoreDemo",
    "layoutCountBadge",
    "layoutPreviewGrid",
    "assignmentDialog",
    "assignmentForm",
    "assignmentTitle",
    "assignmentSubtitle",
    "assignmentPatient",
    "assignmentNote",
    "assignmentScope",
    "removeAssignment",
    "saveAssignment",
    "toast",
  ].forEach((id) => {
    ui[id] = document.getElementById(id);
  });

  ui.tabs = [...document.querySelectorAll(".tab-button")];
  ui.views = {
    schedule: document.getElementById("scheduleView"),
    patients: document.getElementById("patientsView"),
    staff: document.getElementById("staffView"),
    layout: document.getElementById("layoutView"),
  };
}

function bindEvents() {
  ui.tabs.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  ui.scheduleDate.addEventListener("change", () => {
    refreshScheduleView();
  });

  ui.patientSearch.addEventListener("input", renderPatientTable);
  ui.staffScheduleScope.addEventListener("change", renderStaffSchedule);
  ui.staffSearch.addEventListener("input", renderStaffTable);
  ui.staffForm.addEventListener("submit", saveStaffFromForm);
  ui.resetStaffForm.addEventListener("click", resetStaffForm);
  ui.deleteStaff.addEventListener("click", deleteSelectedStaff);
  ui.languageSelect.addEventListener("change", saveLanguage);
  ui.patientForm.addEventListener("submit", savePatientFromForm);
  ui.resetPatientForm.addEventListener("click", resetPatientForm);
  ui.deletePatient.addEventListener("click", deleteSelectedPatient);

  ui.layoutForm.addEventListener("submit", saveLayout);
  ui.restoreDemo.addEventListener("click", restoreDefaultLayout);
  ["roomName", "machinesPerRow", "rowCount", "machinePrefix"].forEach((id) => {
    ui[id].addEventListener("input", renderLayoutPreviewFromForm);
  });

  ui.copyPreviousDay.addEventListener("click", copyPreviousDay);
  ui.saveDayAsWeeklyTemplate.addEventListener("click", saveDayAsWeeklyTemplate);
  ui.clearDay.addEventListener("click", clearCurrentDay);
  ui.prevWeek.addEventListener("click", () => moveWeek(-1));
  ui.nextWeek.addEventListener("click", () => moveWeek(1));
  ui.todayButton.addEventListener("click", () => {
    ui.scheduleDate.value = formatDateInput(new Date());
    refreshScheduleView();
  });
  ui.printSchedule.addEventListener("click", () => window.print());
  ui.exportData.addEventListener("click", exportData);
  ui.importData.addEventListener("change", importData);
  ui.resetAllData.addEventListener("click", resetAllData);

  ui.assignmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.submitter && event.submitter.value === "cancel") {
      ui.assignmentDialog.close();
      return;
    }
    saveAssignment();
  });
  ui.removeAssignment.addEventListener("click", removeAssignment);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(DEFAULT_STATE);
    }
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch (error) {
    console.warn(error);
    return structuredClone(DEFAULT_STATE);
  }
}

function normalizeState(input) {
  const settings = {
    ...DEFAULT_STATE.settings,
    ...(input.settings || {}),
  };
  settings.rowCount = clampNumber(settings.rowCount, 1, 20, DEFAULT_STATE.settings.rowCount);
  settings.machinesPerRow = clampNumber(settings.machinesPerRow, 1, 30, DEFAULT_STATE.settings.machinesPerRow);
  settings.roomName = String(settings.roomName || DEFAULT_STATE.settings.roomName).slice(0, 32);
  settings.machinePrefix = String(settings.machinePrefix || "").slice(0, 8);
  settings.hdfMachines = normalizeMachineIdList(settings.hdfMachines, new Set(getMachineIds(settings)));
  settings.language = settings.language === "en" ? "en" : "zh";

  return {
    settings,
    patients: Array.isArray(input.patients) ? input.patients.map(normalizePatient).filter(Boolean) : [],
    staffMembers: Array.isArray(input.staffMembers) ? input.staffMembers.map(normalizeStaffMember).filter(Boolean) : [],
    weeklySchedules: normalizeScheduleCollection(input.weeklySchedules, true),
    schedules: normalizeScheduleCollection(input.schedules, false),
    weeklyStaffSchedules: normalizeStaffSchedules(input.weeklyStaffSchedules, settings, true),
    staffSchedules: normalizeStaffSchedules(input.staffSchedules, settings, false),
  };
}

function normalizePatient(patient) {
  if (!patient || typeof patient !== "object" || !String(patient.name || "").trim()) {
    return null;
  }

  return {
    id: String(patient.id || createId()),
    name: String(patient.name || "").trim().slice(0, 32),
    dialysisNo: String(patient.dialysisNo || "").trim().slice(0, 32),
    gender: String(patient.gender || "").slice(0, 8),
    age: patient.age === "" || patient.age == null ? "" : clampNumber(patient.age, 0, 120, ""),
    phone: String(patient.phone || "").trim().slice(0, 32),
    dryWeight: patient.dryWeight === "" || patient.dryWeight == null ? "" : clampDecimal(patient.dryWeight, 0, 300, ""),
    vascularAccess: String(patient.vascularAccess || "").slice(0, 32),
    status: patient.status === "paused" ? "paused" : "active",
    infectionFlag: String(patient.infectionFlag || "").trim().slice(0, 32),
    preferredShift: ["morning", "afternoon"].includes(patient.preferredShift) ? patient.preferredShift : "",
    preferredDays: normalizeDayPreference(patient.preferredDays),
    note: String(patient.note || "").trim().slice(0, 300),
    updatedAt: patient.updatedAt || new Date().toISOString(),
  };
}

function normalizeStaffMember(staff) {
  if (!staff || typeof staff !== "object" || !String(staff.name || "").trim()) {
    return null;
  }

  return {
    id: String(staff.id || createId()),
    name: String(staff.name || "").trim().slice(0, 32),
    code: String(staff.code || "").trim().slice(0, 32),
    role: staff.role === "doctor" ? "doctor" : "nurse",
    phone: String(staff.phone || "").trim().slice(0, 32),
    preferredShift: ["morning", "afternoon"].includes(staff.preferredShift) ? staff.preferredShift : "",
    status: staff.status === "paused" ? "paused" : "active",
    note: String(staff.note || "").trim().slice(0, 300),
    updatedAt: staff.updatedAt || new Date().toISOString(),
  };
}

function normalizeDayPreference(value) {
  const items = Array.isArray(value) ? value : [];
  const valid = new Set(WEEK_DAYS.map((day) => day.key));
  return [...new Set(items.map(String).filter((day) => valid.has(day)))];
}

function normalizeStaffSchedules(rawSchedules, settings, weeklyOnly = false) {
  if (!rawSchedules || typeof rawSchedules !== "object") {
    return {};
  }

  const nurseCount = getRequiredNurseCount(settings);
  return Object.entries(rawSchedules).reduce((result, [date, daySchedule]) => {
    const validKey = weeklyOnly ? WEEK_DAYS.some((day) => day.key === date) : /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (validKey && daySchedule && typeof daySchedule === "object") {
      result[date] = normalizeStaffScheduleDay(daySchedule, nurseCount);
    }
    return result;
  }, {});
}

function normalizeScheduleCollection(rawSchedules, weeklyOnly = false) {
  if (!rawSchedules || typeof rawSchedules !== "object") {
    return {};
  }

  return Object.entries(rawSchedules).reduce((result, [key, daySchedule]) => {
    const isValidKey = weeklyOnly ? WEEK_DAYS.some((day) => day.key === key) : /^\d{4}-\d{2}-\d{2}$/.test(key);
    if (isValidKey && daySchedule && typeof daySchedule === "object") {
      result[key] = normalizeMachineScheduleDay(daySchedule);
    }
    return result;
  }, {});
}

function normalizeMachineScheduleDay(daySchedule) {
  return Object.entries(daySchedule).reduce((result, [machineId, item]) => {
    if (!item || typeof item !== "object") {
      return result;
    }

    const normalized = {};
    ["morning", "afternoon"].forEach((shift) => {
      const slot = normalizeScheduleSlot(item[shift]);
      if (slot) {
        normalized[shift] = slot;
      }
    });

    if (Object.keys(normalized).length) {
      result[machineId] = normalized;
    }
    return result;
  }, {});
}

function normalizeScheduleSlot(slot) {
  if (!slot || typeof slot !== "object") {
    return null;
  }
  if (slot.removed) {
    return {
      removed: true,
      note: String(slot.note || "").trim().slice(0, 160),
      updatedAt: slot.updatedAt || new Date().toISOString(),
    };
  }
  if (!slot.patientId) {
    return null;
  }
  return {
    patientId: String(slot.patientId),
    note: String(slot.note || "").trim().slice(0, 160),
    updatedAt: slot.updatedAt || new Date().toISOString(),
  };
}

function normalizeStaffScheduleDay(daySchedule, nurseCount) {
  return STAFF_SHIFT_KEYS.reduce((result, shift) => {
    const shiftSchedule = daySchedule?.[shift] || {};
    result[shift] = {
      doctors: normalizeStaffNameArray(shiftSchedule.doctors, DOCTOR_COUNT),
      nurses: normalizeStaffNameArray(shiftSchedule.nurses, nurseCount),
      backupNurse: sanitizeStaffName(shiftSchedule.backupNurse),
    };
    return result;
  }, {});
}

function normalizeStaffNameArray(value, count) {
  const items = Array.isArray(value) ? value : [];
  return Array.from({ length: count }, (_, index) => sanitizeStaffName(items[index]));
}

function sanitizeStaffName(value) {
  return String(value || "").trim().slice(0, 32);
}

function saveState() {
  pruneEmptyStaffSchedules();
  pruneInvalidFiltrationMachines();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const savedText = state.settings.language === "en" ? "Saved locally" : "本地保存";
  ui.storageStatus.textContent = `${savedText} ${new Date().toLocaleTimeString(state.settings.language === "en" ? "en-US" : "zh-CN", { hour12: false })}`;
}

function pruneEmptyStaffSchedules() {
  [state.staffSchedules, state.weeklyStaffSchedules].forEach((collection) => {
    if (!collection) {
      return;
    }
    Object.keys(collection).forEach((date) => {
      if (!isStaffScheduleFilled(collection[date])) {
        delete collection[date];
      }
    });
  });
}

function isStaffScheduleFilled(daySchedule) {
  if (!daySchedule) {
    return false;
  }

  return STAFF_SHIFT_KEYS.some((shift) => {
    const shiftSchedule = daySchedule[shift] || {};
    return (
      (shiftSchedule.doctors || []).some(Boolean) ||
      (shiftSchedule.nurses || []).some(Boolean) ||
      Boolean(shiftSchedule.backupNurse)
    );
  });
}

function pruneInvalidFiltrationMachines() {
  if (!state.settings) {
    return;
  }
  state.settings.hdfMachines = normalizeMachineIdList(state.settings.hdfMachines, new Set(getMachineIds()));
}

function normalizeMachineIdList(value, validMachines) {
  const items = Array.isArray(value) ? value : [];
  const seen = new Set();
  return items
    .map((item) => String(item || "").trim())
    .filter((machineId) => machineId && validMachines.has(machineId) && !seen.has(machineId) && seen.add(machineId));
}

function ensureDate() {
  if (!ui.scheduleDate.value) {
    ui.scheduleDate.value = formatDateInput(new Date());
  }
}

function renderAll() {
  renderSettingsForm();
  renderHeader();
  renderWeekNavigation();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderPatientTable();
  renderStaffTable();
  renderLayoutPreviewFromForm();
  renderLanguage();
}

function renderHeader() {
  const text = getText();
  ui.roomTitle.textContent = `${state.settings.roomName}${state.settings.language === "en" ? " " : ""}${text.titleSuffix}`;
  ui.storageStatus.textContent = localStorage.getItem(STORAGE_KEY) ? text.storageLoaded : text.storageReady;
}

function refreshScheduleView() {
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  saveState();
}

function renderWeekNavigation() {
  const text = getText();
  const currentDate = parseDateInput(getCurrentDate());
  const weekStart = getWeekStart(currentDate);
  const weekEnd = addDays(weekStart, 6);
  ui.weekTitle.textContent = `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)} ${state.settings.language === "en" ? "Week" : "周排班"}`;
  ui.weekMeta.textContent = text.weekMeta;

  ui.weekDayStrip.innerHTML = WEEK_DAYS.map((day, index) => {
    const date = addDays(weekStart, index);
    const dateValue = formatDateInput(date);
    const effective = getEffectiveScheduleForDate(dateValue);
    const assigned = countAssigned(effective, getMachineIds(), "morning") + countAssigned(effective, getMachineIds(), "afternoon");
    const hasOverride = hasDateOverride(dateValue);
    const isActive = dateValue === getCurrentDate();
    const assignedText =
      state.settings.language === "en"
        ? `${assigned} patients${hasOverride ? " · adjusted" : ""}`
        : `${assigned} 人${hasOverride ? " · 已调整" : ""}`;
    return `
      <button class="week-day-button ${isActive ? "active" : ""}" type="button" data-date="${dateValue}">
        <span>${getWeekDayLabel(day.key)}</span>
        <strong>${date.getMonth() + 1}/${date.getDate()}</strong>
        <em>${assignedText}</em>
      </button>
    `;
  }).join("");

  ui.weekDayStrip.querySelectorAll(".week-day-button").forEach((button) => {
    button.addEventListener("click", () => {
      ui.scheduleDate.value = button.dataset.date;
      refreshScheduleView();
    });
  });
}

function renderSummary() {
  const date = getCurrentDate();
  const machines = getMachineIds();
  const daySchedule = getEffectiveScheduleForDate(date);
  const morningCount = countAssigned(daySchedule, machines, "morning");
  const afternoonCount = countAssigned(daySchedule, machines, "afternoon");
  const activePatients = state.patients.filter((patient) => patient.status === "active").length;
  const conflicts = findConflicts(daySchedule);
  const staffCoverage = getStaffCoverage(date);
  const filtrationCount = getFiltrationMachines().length;

  const cards = [
    ["机器总数", machines.length],
    ["血滤机器", filtrationCount],
    ["上午已排", `${morningCount}/${machines.length}`],
    ["下午已排", `${afternoonCount}/${machines.length}`],
    ["在透患者", activePatients],
    ["医护完成", `${staffCoverage.filled}/${staffCoverage.required}`],
  ];

  ui.summaryGrid.innerHTML = cards
    .map(([label, value]) => `<article class="summary-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`)
    .join("");

  if (conflicts.length) {
    ui.summaryGrid.insertAdjacentHTML(
      "beforeend",
      `<article class="summary-card"><span>重复排班</span><strong>${conflicts.length}</strong></article>`,
    );
  }
}

function countAssigned(daySchedule, machines, shift) {
  return machines.filter((machineId) => daySchedule[machineId]?.[shift]?.patientId).length;
}

function renderStaffSchedule() {
  const date = getCurrentDate();
  const nurseGroups = getNurseGroups();
  const daySchedule = getEffectiveStaffScheduleForDate(date, nurseGroups.length);

  ui.staffTitle.textContent = state.settings.language === "en" ? `${formatDateLabel(date)} Staff Schedule` : `${formatDateLabel(date)}医护排班`;
  ui.staffMeta.textContent =
    state.settings.language === "en"
      ? `${DOCTOR_COUNT} doctors · ${nurseGroups.length} nurses · ${BACKUP_NURSE_COUNT} backup nurse`
      : `医生 ${DOCTOR_COUNT} 名 · 责任护士 ${nurseGroups.length} 名 · 后备护士 ${BACKUP_NURSE_COUNT} 名`;
  ui.staffScheduleGrid.innerHTML = STAFF_SHIFT_KEYS.map((shift) => renderStaffShiftCard(shift, daySchedule[shift], nurseGroups, date)).join("");

  ui.staffScheduleGrid.querySelectorAll("[data-staff-role]").forEach((input) => {
    input.addEventListener("change", saveStaffInput);
  });
}

function renderStaffShiftCard(shift, shiftSchedule, nurseGroups, date) {
  const doctorFields = Array.from({ length: DOCTOR_COUNT }, (_, index) =>
    renderStaffField({
      shift,
      role: "doctor",
      index,
      label: `医生 ${index + 1}`,
      value: shiftSchedule.doctors[index],
    }),
  ).join("");

  const nurseFields = nurseGroups
    .map((group, index) =>
      renderStaffField({
        shift,
        role: "nurse",
        index,
        label: `责任护士 ${index + 1}`,
        hint: group.range,
        value: shiftSchedule.nurses[index],
        patientList: renderNursePatientList(group, shift, date),
      }),
    )
    .join("");

  const backupField = renderStaffField({
    shift,
    role: "backupNurse",
    index: 0,
    label: "后备护士",
    value: shiftSchedule.backupNurse,
  });

  return `
    <section class="staff-shift-card">
      <div class="staff-shift-title">
        <h3>${SHIFT_LABELS[shift]}</h3>
        <span>${DOCTOR_COUNT + nurseGroups.length + BACKUP_NURSE_COUNT} 个岗位</span>
      </div>
      <div class="staff-role-grid">
        ${doctorFields}
        ${nurseFields}
        ${backupField}
      </div>
    </section>
  `;
}

function renderStaffField({ shift, role, index, label, hint = "", value = "", patientList = "" }) {
  const helper = hint ? `<small>${escapeHtml(hint)}</small>` : "";
  const staffRole = role === "doctor" ? "doctor" : "nurse";
  return `
    <label class="staff-field">
      <span>${escapeHtml(label)}${helper}</span>
      <select
        data-staff-shift="${shift}"
        data-staff-role="${role}"
        data-staff-index="${index}"
      >
        ${renderStaffOptions(staffRole, shift, value)}
      </select>
      ${patientList}
    </label>
  `;
}

function renderStaffOptions(role, shift, value) {
  const activeStaff = state.staffMembers
    .filter((staff) => staff.role === role && staff.status === "active")
    .sort((a, b) => scoreShiftPreference(b, shift) - scoreShiftPreference(a, shift) || sortStaffMembers(a, b));
  const hasSelected = activeStaff.some((staff) => staff.id === value);
  const legacyLabel = value && !hasSelected ? getStaffDisplayName(value) : "";
  const options = [`<option value="">${activeStaff.length ? "未安排" : "先到医护库新增"}</option>`];

  if (value && !hasSelected) {
    options.push(`<option value="${escapeHtml(value)}" selected>${escapeHtml(legacyLabel)}（旧记录）</option>`);
  }

  activeStaff.forEach((staff) => {
    const preference = staff.preferredShift ? SHIFT_LABELS[staff.preferredShift] : "不限";
    const selected = staff.id === value ? " selected" : "";
    const code = staff.code ? ` · ${staff.code}` : "";
    options.push(`<option value="${escapeHtml(staff.id)}"${selected}>${escapeHtml(staff.name)}（${preference}${code}）</option>`);
  });

  return options.join("");
}

function renderNursePatientList(group, shift, date) {
  const daySchedule = getEffectiveScheduleForDate(date);
  const rows = group.machines
    .map((machineId) => {
      const assignment = daySchedule[machineId]?.[shift];
      const patient = assignment?.patientId ? findPatient(assignment.patientId) : null;
      if (!patient) {
        return "";
      }
      const type = isFiltrationMachine(machineId) ? `<em>血滤</em>` : "";
      return `
        <li>
          <span>${escapeHtml(machineId)}${type}</span>
          <strong>${escapeHtml(patient.name)}</strong>
        </li>
      `;
    })
    .filter(Boolean)
    .join("");

  return `
    <div class="nurse-patient-list">
      ${rows ? `<ul>${rows}</ul>` : `<div class="nurse-patient-empty">暂无患者</div>`}
    </div>
  `;
}

function saveStaffInput(event) {
  const input = event.currentTarget;
  const date = getCurrentDate();
  const shift = input.dataset.staffShift;
  const role = input.dataset.staffRole;
  const index = Number(input.dataset.staffIndex);
  const scope = ui.staffScheduleScope.value === "date" ? "date" : "weekly";
  const daySchedule = getStaffScheduleForEdit(date, scope);
  const value = String(input.value || "");

  if (role === "doctor") {
    daySchedule[shift].doctors[index] = value;
  } else if (role === "nurse") {
    daySchedule[shift].nurses[index] = value;
  } else if (role === "backupNurse") {
    daySchedule[shift].backupNurse = value;
  }

  saveState();
  renderSummary();
}

function getStaffScheduleForEdit(date, scope, nurseCount = getRequiredNurseCount()) {
  const collection = scope === "weekly" ? state.weeklyStaffSchedules : state.staffSchedules;
  const key = scope === "weekly" ? getWeekdayKey(date) : date;
  if (!collection[key]) {
    collection[key] =
      scope === "date"
        ? getEffectiveStaffScheduleForDate(date, nurseCount)
        : createEmptyStaffScheduleDay(nurseCount);
  } else {
    collection[key] = normalizeStaffScheduleDay(collection[key], nurseCount);
  }
  return collection[key];
}

function getEffectiveStaffScheduleForDate(date, nurseCount = getRequiredNurseCount()) {
  const weekly = state.weeklyStaffSchedules?.[getWeekdayKey(date)];
  const dateSchedule = state.staffSchedules?.[date];
  if (dateSchedule) {
    return normalizeStaffScheduleDay(dateSchedule, nurseCount);
  }
  return weekly ? normalizeStaffScheduleDay(weekly, nurseCount) : createEmptyStaffScheduleDay(nurseCount);
}

function createEmptyStaffScheduleDay(nurseCount) {
  return STAFF_SHIFT_KEYS.reduce((result, shift) => {
    result[shift] = {
      doctors: Array(DOCTOR_COUNT).fill(""),
      nurses: Array(nurseCount).fill(""),
      backupNurse: "",
    };
    return result;
  }, {});
}

function getStaffCoverage(date) {
  const nurseCount = getRequiredNurseCount();
  const daySchedule = getEffectiveStaffScheduleForDate(date, nurseCount);
  const requiredPerShift = DOCTOR_COUNT + nurseCount + BACKUP_NURSE_COUNT;
  const filled = STAFF_SHIFT_KEYS.reduce((count, shift) => {
      const shiftSchedule = daySchedule[shift];
    return (
      count +
      shiftSchedule.doctors.filter(isStaffScheduleValueFilled).length +
      shiftSchedule.nurses.filter(isStaffScheduleValueFilled).length +
      (shiftSchedule.backupNurse ? 1 : 0)
    );
  }, 0);

  return {
    filled,
    required: requiredPerShift * STAFF_SHIFT_KEYS.length,
  };
}

function isStaffScheduleValueFilled(value) {
  return Boolean(String(value || "").trim());
}

function renderSchedule() {
  const machines = getMachineIds();
  const rows = chunk(machines, state.settings.machinesPerRow);
  const date = getCurrentDate();
  const daySchedule = getEffectiveScheduleForDate(date);
  const conflicts = findConflicts(daySchedule);

  document.documentElement.style.setProperty("--machines-per-row", state.settings.machinesPerRow);
  ui.boardTitle.textContent = state.settings.language === "en" ? `${formatDateLabel(date)} Schedule` : `${formatDateLabel(date)}排班`;
  ui.boardMeta.textContent =
    state.settings.language === "en"
      ? `${state.settings.rowCount} rows, ${state.settings.machinesPerRow} machines per row`
      : `${state.settings.rowCount} 排，每排 ${state.settings.machinesPerRow} 台`;

  ui.machineRows.innerHTML = rows
    .map((row, index) => {
      const rowLabel = rowLabelFromIndex(index);
      return `
        <section class="machine-row">
          <div class="row-title">第 ${index + 1} 排 ${rowLabel}</div>
          <div class="machine-grid">
            ${row.map((machineId) => renderMachineCard(machineId, daySchedule[machineId], conflicts)).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  ui.machineRows.querySelectorAll(".shift-slot").forEach((slot) => {
    slot.addEventListener("click", () => openAssignmentDialog(slot.dataset.machine, slot.dataset.shift));
  });
  ui.machineRows.querySelectorAll(".machine-type-toggle").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFiltrationMachine(button.dataset.machine);
    });
  });
}

function renderMachineCard(machineId, scheduleItem = {}, conflicts = []) {
  const conflictSet = new Set(conflicts.map((item) => `${item.machineId}:${item.shift}`));
  const isFiltration = isFiltrationMachine(machineId);
  return `
    <article class="machine-card ${isFiltration ? "filtration" : ""}">
      <div class="machine-card-header">
        <span class="machine-id">${escapeHtml(machineId)}</span>
        <div class="machine-card-actions">
          ${isFiltration ? `<span class="machine-type-badge">血滤</span>` : ""}
          <button class="machine-type-toggle" type="button" data-machine="${escapeHtml(machineId)}">${isFiltration ? "取消" : "血滤"}</button>
        </div>
      </div>
      <div class="slot-stack">
        ${renderShiftSlot(machineId, "morning", scheduleItem.morning, conflictSet)}
        ${renderShiftSlot(machineId, "afternoon", scheduleItem.afternoon, conflictSet)}
      </div>
    </article>
  `;
}

function renderShiftSlot(machineId, shift, assignment, conflictSet) {
  const patient = assignment?.patientId ? findPatient(assignment.patientId) : null;
  const isConflict = conflictSet.has(`${machineId}:${shift}`);
  const classes = ["shift-slot", patient ? "assigned" : "", isConflict ? "conflict" : ""].filter(Boolean).join(" ");
  const source = getSlotSource(getCurrentDate(), machineId, shift);
  const sourceLabel = source === "date" ? "单日调整" : source === "weekly" ? "周模板" : "";
  const content = patient
    ? `
      <div class="slot-patient">${escapeHtml(patient.name)}</div>
      <div class="patient-subline">${escapeHtml(buildPatientSubline(patient))}</div>
      ${assignment.note ? `<div class="slot-note">${escapeHtml(assignment.note)}</div>` : ""}
    `
    : `<div class="slot-empty">未安排</div>`;

  return `
    <button class="${classes}" type="button" data-machine="${escapeHtml(machineId)}" data-shift="${shift}">
      <span class="slot-topline">
        <span class="slot-label">${SHIFT_LABELS[shift]}</span>
        <span class="slot-add">${patient ? "编辑" : "安排"}</span>
      </span>
      ${sourceLabel ? `<span class="slot-source">${sourceLabel}</span>` : ""}
      ${content}
    </button>
  `;
}

function openAssignmentDialog(machineId, shift) {
  selectedSlot = { machineId, shift };
  const date = getCurrentDate();
  const assignment = getEffectiveSlot(date, machineId, shift) || {};
  const patientOptions = state.patients
    .filter((patient) => patient.status === "active" || patient.id === assignment.patientId)
    .sort(sortPatients)
    .map((patient) => {
      const details = [patient.dialysisNo, patient.vascularAccess, patient.infectionFlag, formatPreference(patient.preferredShift, patient.preferredDays)]
        .filter(Boolean)
        .join(" · ");
      const label = details ? `${patient.name} (${details})` : patient.name;
      return `<option value="${escapeHtml(patient.id)}">${escapeHtml(label)}</option>`;
    })
    .join("");

  ui.assignmentTitle.textContent = `${machineId} ${SHIFT_LABELS[shift]}`;
  ui.assignmentSubtitle.textContent = formatDateLabel(date);
  ui.assignmentPatient.innerHTML = `<option value="">未安排</option>${patientOptions}`;
  ui.assignmentPatient.value = assignment.patientId || "";
  ui.assignmentNote.value = assignment.note || "";
  const source = getSlotSource(date, machineId, shift);
  ui.assignmentScope.value = source === "date" || source === "removed" ? "date" : "weekly";
  ui.removeAssignment.disabled = !assignment.patientId;
  ui.saveAssignment.disabled = !state.patients.length;
  ui.assignmentDialog.showModal();
}

function saveAssignment() {
  if (!selectedSlot) {
    return;
  }

  const { machineId, shift } = selectedSlot;
  const date = getCurrentDate();
  const patientId = ui.assignmentPatient.value;
  const note = ui.assignmentNote.value.trim();
  const scope = ui.assignmentScope.value === "date" ? "date" : "weekly";
  const targetSchedule = scope === "weekly" ? state.weeklySchedules : state.schedules;
  const targetKey = scope === "weekly" ? getWeekdayKey(date) : date;

  if (!patientId) {
    clearScheduleSlot(targetSchedule, targetKey, machineId, shift, scope === "date" && Boolean(getWeeklySlot(date, machineId, shift)));
  } else {
    const existing =
      scope === "weekly"
        ? getWeeklyAssignmentsForPatient(patientId, getWeekdayKey(date)).filter((item) => item.shift !== shift || item.machineId !== machineId)
        : getAssignmentsForPatient(patientId, date).filter((item) => item.shift !== shift || item.machineId !== machineId);
    if (existing.length) {
      const oldSlots = existing.map((item) => `${item.machineId}${SHIFT_LABELS[item.shift]}`).join("、");
      const message = `该患者已排在 ${oldSlots}，是否移动到 ${machineId}${SHIFT_LABELS[shift]}？`;
      if (!window.confirm(message)) {
        return;
      }
      moveExistingAssignments(existing, date, shift, scope);
    }
    setScheduleSlot(targetSchedule, targetKey, machineId, shift, {
      patientId,
      note,
      updatedAt: new Date().toISOString(),
    });
    if (scope === "weekly") {
      clearScheduleSlot(state.schedules, date, machineId, shift, false);
      pruneEmptySchedule(state.schedules, date, machineId);
    }
  }

  pruneEmptySchedule(targetSchedule, targetKey, machineId);
  saveState();
  ui.assignmentDialog.close();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast("排班已保存");
}

function moveExistingAssignments(assignments, date, shift, scope) {
  assignments.forEach((item) => {
    if (scope === "weekly") {
      const weekdayKey = getWeekdayKey(date);
      clearScheduleSlot(state.weeklySchedules, weekdayKey, item.machineId, item.shift, false);
      pruneEmptySchedule(state.weeklySchedules, weekdayKey, item.machineId);
    } else {
      clearScheduleSlot(state.schedules, date, item.machineId, item.shift, Boolean(getWeeklySlot(date, item.machineId, item.shift)));
      pruneEmptySchedule(state.schedules, date, item.machineId);
    }
  });
}

function removeAssignment() {
  if (!selectedSlot) {
    return;
  }
  const { machineId, shift } = selectedSlot;
  const date = getCurrentDate();
  const scope = ui.assignmentScope.value === "date" ? "date" : "weekly";
  const targetSchedule = scope === "weekly" ? state.weeklySchedules : state.schedules;
  const targetKey = scope === "weekly" ? getWeekdayKey(date) : date;
  clearScheduleSlot(targetSchedule, targetKey, machineId, shift, scope === "date" && Boolean(getWeeklySlot(date, machineId, shift)));
  pruneEmptySchedule(targetSchedule, targetKey, machineId);
  saveState();
  ui.assignmentDialog.close();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast(scope === "weekly" ? "每周模板已移除" : "当日排班已移除");
}

function pruneEmptySchedule(scheduleCollection, key, machineId) {
  const item = scheduleCollection[key]?.[machineId];
  if (item && !item.morning && !item.afternoon) {
    delete scheduleCollection[key][machineId];
  }
  if (scheduleCollection[key] && !Object.keys(scheduleCollection[key]).length) {
    delete scheduleCollection[key];
  }
}

function savePatientFromForm(event) {
  event.preventDefault();
  const patient = normalizePatient({
    id: ui.patientId.value || createId(),
    name: ui.patientName.value,
    dialysisNo: ui.dialysisNo.value,
    gender: ui.patientGender.value,
    age: ui.patientAge.value,
    phone: ui.patientPhone.value,
    dryWeight: ui.dryWeight.value,
    vascularAccess: ui.vascularAccess.value,
    status: ui.patientStatus.value,
    infectionFlag: ui.infectionFlag.value,
    preferredShift: ui.preferredShift.value,
    preferredDays: getCheckedValues(ui.patientPreferredDays),
    note: ui.patientNote.value,
    updatedAt: new Date().toISOString(),
  });

  if (!patient) {
    showToast("请填写患者姓名");
    return;
  }

  const duplicate = state.patients.find((item) => item.id !== patient.id && patient.dialysisNo && item.dialysisNo === patient.dialysisNo);
  if (duplicate && !window.confirm(`透析号与 ${duplicate.name} 重复，仍要保存吗？`)) {
    return;
  }

  const index = state.patients.findIndex((item) => item.id === patient.id);
  if (index >= 0) {
    state.patients[index] = patient;
  } else {
    state.patients.push(patient);
  }

  saveState();
  fillPatientForm(patient);
  renderPatientTable();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast("患者资料已保存");
}

function fillPatientForm(patient) {
  ui.patientFormTitle.textContent = `编辑患者：${patient.name}`;
  ui.patientId.value = patient.id;
  ui.patientName.value = patient.name;
  ui.dialysisNo.value = patient.dialysisNo || "";
  ui.patientGender.value = patient.gender || "";
  ui.patientAge.value = patient.age || "";
  ui.patientPhone.value = patient.phone || "";
  ui.dryWeight.value = patient.dryWeight || "";
  ui.vascularAccess.value = patient.vascularAccess || "";
  ui.patientStatus.value = patient.status || "active";
  ui.infectionFlag.value = patient.infectionFlag || "";
  ui.preferredShift.value = patient.preferredShift || "";
  setCheckedValues(ui.patientPreferredDays, patient.preferredDays || []);
  ui.patientNote.value = patient.note || "";
  ui.deletePatient.classList.remove("hidden");
}

function resetPatientForm() {
  ui.patientForm.reset();
  ui.patientId.value = "";
  ui.patientStatus.value = "active";
  setCheckedValues(ui.patientPreferredDays, []);
  ui.patientFormTitle.textContent = "新增患者";
  ui.deletePatient.classList.add("hidden");
}

function deleteSelectedPatient() {
  const id = ui.patientId.value;
  if (!id) {
    return;
  }

  const patient = findPatient(id);
  if (!patient) {
    return;
  }

  if (!window.confirm(`确定删除 ${patient.name} 的资料和相关排班吗？`)) {
    return;
  }

  state.patients = state.patients.filter((item) => item.id !== id);
  removePatientFromSchedules(id);
  saveState();
  resetPatientForm();
  renderPatientTable();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast("患者已删除");
}

function removePatientFromSchedules(patientId) {
  removePatientFromScheduleCollection(state.schedules, patientId);
  removePatientFromScheduleCollection(state.weeklySchedules, patientId);
}

function removePatientFromScheduleCollection(scheduleCollection, patientId) {
  Object.entries(scheduleCollection || {}).forEach(([key, daySchedule]) => {
    Object.entries(daySchedule).forEach(([machineId, item]) => {
      ["morning", "afternoon"].forEach((shift) => {
        if (item[shift]?.patientId === patientId) {
          delete item[shift];
        }
      });
      pruneEmptySchedule(scheduleCollection, key, machineId);
    });
  });
}

function renderPatientTable() {
  const keyword = ui.patientSearch.value.trim().toLowerCase();
  const patients = state.patients.filter((patient) => patientMatches(patient, keyword)).sort(sortPatients);

  if (!patients.length) {
    ui.patientTableBody.innerHTML = `<tr><td colspan="6"><div class="empty-state">暂无患者资料</div></td></tr>`;
    return;
  }

  ui.patientTableBody.innerHTML = patients
    .map((patient) => {
      const status = patient.status === "paused" ? `<span class="tag off">暂停</span>` : `<span class="tag">在透</span>`;
      const shift = formatPreference(patient.preferredShift, patient.preferredDays);
      return `
        <tr>
          <td>
            <div class="patient-name">${escapeHtml(patient.name)}</div>
            <div class="patient-subline">${escapeHtml([patient.gender, patient.age && `${patient.age}岁`, patient.phone].filter(Boolean).join(" · ") || "基本资料待完善")}</div>
          </td>
          <td>${escapeHtml(patient.dialysisNo || "-")}</td>
          <td>${escapeHtml(patient.vascularAccess || "-")}</td>
          <td>${escapeHtml(shift)}</td>
          <td>${status}</td>
          <td>
            <div class="row-actions">
              <button class="ghost-button" type="button" data-edit="${escapeHtml(patient.id)}">编辑</button>
              <button class="ghost-button" type="button" data-schedule="${escapeHtml(patient.id)}">去排班</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  ui.patientTableBody.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const patient = findPatient(button.dataset.edit);
      if (patient) {
        fillPatientForm(patient);
      }
    });
  });

  ui.patientTableBody.querySelectorAll("[data-schedule]").forEach((button) => {
    button.addEventListener("click", () => {
      switchView("schedule");
      const patient = findPatient(button.dataset.schedule);
      showToast(patient ? `请在机器格子中选择 ${patient.name}` : "请在机器格子中安排患者");
    });
  });
}

function saveStaffFromForm(event) {
  event.preventDefault();
  const staff = normalizeStaffMember({
    id: ui.staffId.value || createId(),
    name: ui.staffName.value,
    code: ui.staffCode.value,
    role: ui.staffRole.value,
    phone: ui.staffPhone.value,
    preferredShift: ui.staffPreferredShift.value,
    status: ui.staffStatus.value,
    note: ui.staffNote.value,
    updatedAt: new Date().toISOString(),
  });

  if (!staff) {
    showToast("请填写医护姓名");
    return;
  }

  const duplicate = state.staffMembers.find((item) => item.id !== staff.id && staff.code && item.code === staff.code);
  if (duplicate && !window.confirm(`工号与 ${duplicate.name} 重复，仍要保存吗？`)) {
    return;
  }

  const index = state.staffMembers.findIndex((item) => item.id === staff.id);
  if (index >= 0) {
    state.staffMembers[index] = staff;
  } else {
    state.staffMembers.push(staff);
  }

  saveState();
  fillStaffForm(staff);
  renderStaffTable();
  renderStaffSchedule();
  showToast("医护资料已保存");
}

function fillStaffForm(staff) {
  ui.staffFormTitle.textContent = `编辑医护：${staff.name}`;
  ui.staffId.value = staff.id;
  ui.staffName.value = staff.name;
  ui.staffCode.value = staff.code || "";
  ui.staffRole.value = staff.role || "nurse";
  ui.staffPhone.value = staff.phone || "";
  ui.staffPreferredShift.value = staff.preferredShift || "";
  ui.staffStatus.value = staff.status || "active";
  ui.staffNote.value = staff.note || "";
  ui.deleteStaff.classList.remove("hidden");
}

function resetStaffForm() {
  ui.staffForm.reset();
  ui.staffId.value = "";
  ui.staffRole.value = "nurse";
  ui.staffStatus.value = "active";
  ui.staffFormTitle.textContent = "新增医护";
  ui.deleteStaff.classList.add("hidden");
}

function deleteSelectedStaff() {
  const id = ui.staffId.value;
  if (!id) {
    return;
  }

  const staff = findStaff(id);
  if (!staff) {
    return;
  }
  if (!window.confirm(`确定删除 ${staff.name} 的资料和相关医护排班吗？`)) {
    return;
  }

  state.staffMembers = state.staffMembers.filter((item) => item.id !== id);
  removeStaffFromSchedules(id);
  saveState();
  resetStaffForm();
  renderStaffTable();
  renderStaffSchedule();
  renderSummary();
  showToast("医护已删除");
}

function renderStaffTable() {
  const keyword = ui.staffSearch.value.trim().toLowerCase();
  const staffMembers = state.staffMembers.filter((staff) => staffMatches(staff, keyword)).sort(sortStaffMembers);

  if (!staffMembers.length) {
    ui.staffTableBody.innerHTML = `<tr><td colspan="6"><div class="empty-state">暂无医护资料</div></td></tr>`;
    return;
  }

  ui.staffTableBody.innerHTML = staffMembers
    .map((staff) => {
      const status = staff.status === "paused" ? `<span class="tag off">停用</span>` : `<span class="tag">在岗</span>`;
      const role = staff.role === "doctor" ? "医生" : "护士";
      const preference = staff.preferredShift ? SHIFT_LABELS[staff.preferredShift] : "不限";
      return `
        <tr>
          <td>
            <div class="patient-name">${escapeHtml(staff.name)}</div>
            <div class="patient-subline">${escapeHtml([staff.phone, staff.note].filter(Boolean).join(" · ") || "资料待完善")}</div>
          </td>
          <td>${escapeHtml(staff.code || "-")}</td>
          <td>${escapeHtml(role)}</td>
          <td>${escapeHtml(preference)}</td>
          <td>${status}</td>
          <td>
            <div class="row-actions">
              <button class="ghost-button" type="button" data-staff-edit="${escapeHtml(staff.id)}">编辑</button>
              <button class="ghost-button" type="button" data-staff-schedule="${escapeHtml(staff.id)}">排班</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  ui.staffTableBody.querySelectorAll("[data-staff-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const staff = findStaff(button.dataset.staffEdit);
      if (staff) {
        fillStaffForm(staff);
      }
    });
  });

  ui.staffTableBody.querySelectorAll("[data-staff-schedule]").forEach((button) => {
    button.addEventListener("click", () => {
      const staff = findStaff(button.dataset.staffSchedule);
      switchView("schedule");
      if (staff) {
        showToast(`${staff.name} 可在医护排班表中选择`);
      }
    });
  });
}

function removeStaffFromSchedules(staffId) {
  [state.weeklyStaffSchedules, state.staffSchedules].forEach((collection) => {
    Object.values(collection || {}).forEach((daySchedule) => {
      STAFF_SHIFT_KEYS.forEach((shift) => {
        const shiftSchedule = daySchedule[shift];
        if (!shiftSchedule) {
          return;
        }
        shiftSchedule.doctors = shiftSchedule.doctors.map((value) => (value === staffId ? "" : value));
        shiftSchedule.nurses = shiftSchedule.nurses.map((value) => (value === staffId ? "" : value));
        if (shiftSchedule.backupNurse === staffId) {
          shiftSchedule.backupNurse = "";
        }
      });
    });
  });
}

function saveLayout(event) {
  event.preventDefault();
  const settings = {
    roomName: ui.roomName.value.trim() || DEFAULT_STATE.settings.roomName,
    rowCount: clampNumber(ui.rowCount.value, 1, 20, DEFAULT_STATE.settings.rowCount),
    machinesPerRow: clampNumber(ui.machinesPerRow.value, 1, 30, DEFAULT_STATE.settings.machinesPerRow),
    machinePrefix: ui.machinePrefix.value.trim().slice(0, 8),
    hdfMachines: [],
  };

  const oldMachines = new Set(getMachineIds());
  const nextMachines = new Set(getMachineIds(settings));
  settings.hdfMachines = normalizeMachineIdList(state.settings.hdfMachines, nextMachines);
  const removedAssigned = countAssignmentsOutsideNextLayout(oldMachines, nextMachines);
  if (removedAssigned && !window.confirm(`新布局会隐藏 ${removedAssigned} 条已排记录，仍要应用吗？`)) {
    return;
  }

  state.settings = settings;
  saveState();
  renderHeader();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderLayoutPreviewFromForm();
  showToast("机器布局已应用");
}

function countAssignmentsOutsideNextLayout(oldMachines, nextMachines) {
  let count = 0;
  [...Object.values(state.schedules), ...Object.values(state.weeklySchedules)].forEach((daySchedule) => {
    Object.entries(daySchedule).forEach(([machineId, item]) => {
      if (oldMachines.has(machineId) && !nextMachines.has(machineId)) {
        if (item.morning?.patientId) count += 1;
        if (item.afternoon?.patientId) count += 1;
      }
    });
  });
  return count;
}

function restoreDefaultLayout() {
  ui.roomName.value = DEFAULT_STATE.settings.roomName;
  ui.rowCount.value = DEFAULT_STATE.settings.rowCount;
  ui.machinesPerRow.value = DEFAULT_STATE.settings.machinesPerRow;
  ui.machinePrefix.value = DEFAULT_STATE.settings.machinePrefix;
  renderLayoutPreviewFromForm();
}

function renderSettingsForm() {
  ui.roomName.value = state.settings.roomName;
  ui.rowCount.value = state.settings.rowCount;
  ui.machinesPerRow.value = state.settings.machinesPerRow;
  ui.machinePrefix.value = state.settings.machinePrefix;
  ui.languageSelect.value = state.settings.language || "zh";
}

function renderLanguage() {
  const text = getText();
  document.documentElement.lang = state.settings.language === "en" ? "en" : "zh-CN";
  document.title = state.settings.language === "en" ? "Hemodialysis Scheduler" : "血透室排班系统";
  document.querySelector(".date-control span").textContent = text.date;
  ui.tabs.forEach((button, index) => {
    if (text.tabs[index]) {
      button.textContent = text.tabs[index];
    }
  });
  ui.printSchedule.textContent = text.print;
  ui.exportData.textContent = text.export;
  document.querySelector(".import-button").childNodes[0].textContent = `${text.import} `;
  ui.resetAllData.textContent = text.reset;
  ui.prevWeek.textContent = text.prevWeek;
  ui.nextWeek.textContent = text.nextWeek;
  ui.todayButton.textContent = text.today;
  ui.saveDayAsWeeklyTemplate.textContent = text.saveAsWeekly;
  ui.copyPreviousDay.textContent = text.copyPrevious;
  ui.clearDay.textContent = text.clearDay;
  document.querySelector(".settings-language span").textContent = text.language;
}

function saveLanguage() {
  state.settings.language = ui.languageSelect.value === "en" ? "en" : "zh";
  saveState();
  renderAll();
  showToast(state.settings.language === "en" ? "Language updated" : "语言已切换");
}

function getText() {
  return I18N[state.settings.language === "en" ? "en" : "zh"];
}

function renderLayoutPreviewFromForm() {
  const settings = {
    roomName: ui.roomName.value || DEFAULT_STATE.settings.roomName,
    rowCount: clampNumber(ui.rowCount.value, 1, 20, DEFAULT_STATE.settings.rowCount),
    machinesPerRow: clampNumber(ui.machinesPerRow.value, 1, 30, DEFAULT_STATE.settings.machinesPerRow),
    machinePrefix: ui.machinePrefix.value || "",
  };
  const machineIds = getMachineIds(settings);
  ui.layoutPreviewGrid.style.setProperty("--preview-cols", settings.machinesPerRow);
  ui.layoutCountBadge.textContent = `${machineIds.length} 台`;
  ui.layoutPreviewGrid.innerHTML = machineIds
    .map((machineId) => {
      const isFiltration = isFiltrationMachine(machineId);
      return `
        <button class="preview-machine ${isFiltration ? "filtration" : ""}" type="button" data-machine="${escapeHtml(machineId)}">
          <span>${escapeHtml(machineId)}</span>
          ${isFiltration ? `<small>血滤</small>` : ""}
        </button>
      `;
    })
    .join("");

  ui.layoutPreviewGrid.querySelectorAll(".preview-machine").forEach((button) => {
    button.addEventListener("click", () => {
      if (!isSameMachineLayout(settings, state.settings)) {
        showToast("先应用布局，再设置血滤机器");
        return;
      }
      toggleFiltrationMachine(button.dataset.machine);
    });
  });
}

function saveDayAsWeeklyTemplate() {
  const date = getCurrentDate();
  const weekdayKey = getWeekdayKey(date);
  const effectiveSchedule = getEffectiveScheduleForDate(date);
  const effectiveStaffSchedule = getEffectiveStaffScheduleForDate(date);
  if (!Object.keys(effectiveSchedule).length && !isStaffScheduleFilled(effectiveStaffSchedule)) {
    showToast("当前日期没有可保存的排班");
    return;
  }

  const weekdayLabel = WEEK_DAYS.find((day) => day.key === weekdayKey)?.label || "本日";
  if (!window.confirm(`确定把 ${formatDateLabel(date)} 的患者机器排班保存为每周${weekdayLabel}模板吗？`)) {
    return;
  }

  if (Object.keys(effectiveSchedule).length) {
    state.weeklySchedules[weekdayKey] = structuredClone(effectiveSchedule);
  } else {
    delete state.weeklySchedules[weekdayKey];
  }
  if (isStaffScheduleFilled(effectiveStaffSchedule)) {
    state.weeklyStaffSchedules[weekdayKey] = structuredClone(effectiveStaffSchedule);
  }
  delete state.schedules[date];
  delete state.staffSchedules[date];
  saveState();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast(`已保存为每周${weekdayLabel}模板`);
}

function copyPreviousDay() {
  const current = new Date(`${getCurrentDate()}T00:00:00`);
  current.setDate(current.getDate() - 1);
  const previousDate = formatDateInput(current);
  const previous = getEffectiveScheduleForDate(previousDate);
  const previousStaff = getEffectiveStaffScheduleForDate(previousDate);

  if ((!previous || !Object.keys(previous).length) && !isStaffScheduleFilled(previousStaff)) {
    showToast("前一天没有排班");
    return;
  }
  const hasCurrentData = state.schedules[getCurrentDate()] || isStaffScheduleFilled(state.staffSchedules?.[getCurrentDate()]);
  if (hasCurrentData && !window.confirm("当前日期已有排班，复制会覆盖，继续吗？")) {
    return;
  }

  if (previous && Object.keys(previous).length) {
    state.schedules[getCurrentDate()] = structuredClone(previous);
  } else {
    delete state.schedules[getCurrentDate()];
  }
  if (isStaffScheduleFilled(previousStaff)) {
    state.staffSchedules[getCurrentDate()] = structuredClone(previousStaff);
  } else if (state.staffSchedules) {
    delete state.staffSchedules[getCurrentDate()];
  }
  saveState();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast("已复制前一天排班");
}

function clearCurrentDay() {
  const date = getCurrentDate();
  const effectiveSchedule = getEffectiveScheduleForDate(date);
  const hasMachineSchedule = Object.keys(effectiveSchedule).length;
  const hasStaffSchedule = isStaffScheduleFilled(state.staffSchedules?.[date]);
  if (!hasMachineSchedule && !hasStaffSchedule) {
    showToast("当日没有排班");
    return;
  }

  if (!window.confirm(`确定清空 ${formatDateLabel(date)} 的排班吗？`)) {
    return;
  }

  if (hasMachineSchedule) {
    state.schedules[date] = createRemovedOverrideDay(effectiveSchedule);
  } else {
    delete state.schedules[date];
  }
  if (state.staffSchedules) {
    delete state.staffSchedules[date];
  }
  saveState();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast("当日排班已清空");
}

function exportData() {
  pruneEmptyStaffSchedules();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `血透室排班数据-${getCurrentDate()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = normalizeState(JSON.parse(reader.result));
      if (!window.confirm("导入会替换当前本地数据，继续吗？")) {
        return;
      }
      state.settings = imported.settings;
      state.patients = imported.patients;
      state.staffMembers = imported.staffMembers;
      state.weeklySchedules = imported.weeklySchedules;
      state.schedules = imported.schedules;
      state.weeklyStaffSchedules = imported.weeklyStaffSchedules;
      state.staffSchedules = imported.staffSchedules;
      saveState();
      renderAll();
      showToast("数据已导入");
    } catch (error) {
      console.error(error);
      showToast("导入文件无法识别");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function resetAllData() {
  const message = "确定全部重置吗？这会清空本地保存的患者资料、患者排班、医护排班和血滤机器设置。";
  if (!window.confirm(message)) {
    return;
  }

  const fresh = structuredClone(DEFAULT_STATE);
  state.settings = fresh.settings;
  state.patients = fresh.patients;
  state.staffMembers = fresh.staffMembers;
  state.weeklySchedules = fresh.weeklySchedules;
  state.schedules = fresh.schedules;
  state.weeklyStaffSchedules = fresh.weeklyStaffSchedules;
  state.staffSchedules = fresh.staffSchedules;
  localStorage.removeItem(STORAGE_KEY);
  ui.scheduleDate.value = formatDateInput(new Date());
  ui.patientSearch.value = "";
  ui.staffSearch.value = "";
  ui.staffScheduleScope.value = "weekly";
  resetPatientForm();
  resetStaffForm();
  renderAll();
  ui.storageStatus.textContent = "已全部重置，本地数据已清空";
  showToast("已全部重置");
}

function switchView(name) {
  ui.tabs.forEach((button) => button.classList.toggle("active", button.dataset.view === name));
  Object.entries(ui.views).forEach(([viewName, element]) => {
    element.classList.toggle("active", viewName === name);
  });
}

function getCurrentDate() {
  return ui.scheduleDate.value;
}

function getWeekdayKey(dateValue) {
  return String(parseDateInput(dateValue).getDay());
}

function getWeeklyScheduleForDate(dateValue) {
  return state.weeklySchedules?.[getWeekdayKey(dateValue)] || {};
}

function getWeeklySlot(dateValue, machineId, shift) {
  return getWeeklyScheduleForDate(dateValue)?.[machineId]?.[shift] || null;
}

function getEffectiveScheduleForDate(dateValue) {
  return mergeScheduleDays(getWeeklyScheduleForDate(dateValue), state.schedules?.[dateValue] || {});
}

function getEffectiveSlot(dateValue, machineId, shift) {
  return getEffectiveScheduleForDate(dateValue)?.[machineId]?.[shift] || null;
}

function mergeScheduleDays(weeklySchedule = {}, dateSchedule = {}) {
  const result = structuredClone(weeklySchedule || {});
  Object.entries(dateSchedule || {}).forEach(([machineId, item]) => {
    if (!result[machineId]) {
      result[machineId] = {};
    }
    ["morning", "afternoon"].forEach((shift) => {
      const slot = item?.[shift];
      if (!slot) {
        return;
      }
      if (slot.removed) {
        delete result[machineId][shift];
      } else {
        result[machineId][shift] = structuredClone(slot);
      }
    });
    if (!result[machineId].morning && !result[machineId].afternoon) {
      delete result[machineId];
    }
  });
  return result;
}

function getSlotSource(dateValue, machineId, shift) {
  const dateSlot = state.schedules?.[dateValue]?.[machineId]?.[shift];
  if (dateSlot) {
    return dateSlot.removed ? "removed" : "date";
  }
  return getWeeklySlot(dateValue, machineId, shift) ? "weekly" : "empty";
}

function hasDateOverride(dateValue) {
  return Boolean(state.schedules?.[dateValue] && Object.keys(state.schedules[dateValue]).length);
}

function setScheduleSlot(scheduleCollection, key, machineId, shift, slot) {
  if (!scheduleCollection[key]) {
    scheduleCollection[key] = {};
  }
  if (!scheduleCollection[key][machineId]) {
    scheduleCollection[key][machineId] = {};
  }
  scheduleCollection[key][machineId][shift] = slot;
}

function clearScheduleSlot(scheduleCollection, key, machineId, shift, keepRemovedMarker) {
  if (keepRemovedMarker) {
    setScheduleSlot(scheduleCollection, key, machineId, shift, {
      removed: true,
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  if (scheduleCollection[key]?.[machineId]) {
    delete scheduleCollection[key][machineId][shift];
  }
}

function createRemovedOverrideDay(daySchedule) {
  return Object.entries(daySchedule).reduce((result, [machineId, item]) => {
    ["morning", "afternoon"].forEach((shift) => {
      if (item[shift]?.patientId) {
        setScheduleSlot(result, "override", machineId, shift, {
          removed: true,
          updatedAt: new Date().toISOString(),
        });
      }
    });
    return result;
  }, {}).override || {};
}

function getMachineIds(settings = state.settings) {
  const ids = [];
  for (let row = 0; row < settings.rowCount; row += 1) {
    for (let machine = 1; machine <= settings.machinesPerRow; machine += 1) {
      const rowCode = rowLabelFromIndex(row);
      const machineCode = String(machine).padStart(2, "0");
      ids.push(`${settings.machinePrefix || ""}${rowCode}${machineCode}`);
    }
  }
  return ids;
}

function getFiltrationMachines() {
  return Array.isArray(state.settings.hdfMachines) ? state.settings.hdfMachines : [];
}

function isFiltrationMachine(machineId) {
  return getFiltrationMachines().includes(machineId);
}

function toggleFiltrationMachine(machineId) {
  const validMachines = new Set(getMachineIds());
  if (!validMachines.has(machineId)) {
    showToast("机器编号不在当前布局中");
    return;
  }

  const machines = new Set(getFiltrationMachines());
  if (machines.has(machineId)) {
    machines.delete(machineId);
  } else {
    machines.add(machineId);
  }
  state.settings.hdfMachines = [...machines].filter((id) => validMachines.has(id)).sort(sortMachineIds);
  saveState();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderLayoutPreviewFromForm();
  showToast(`${machineId} 已${machines.has(machineId) ? "设为" : "取消"}血滤机器`);
}

function isSameMachineLayout(left, right) {
  return (
    Number(left.rowCount) === Number(right.rowCount) &&
    Number(left.machinesPerRow) === Number(right.machinesPerRow) &&
    String(left.machinePrefix || "") === String(right.machinePrefix || "")
  );
}

function sortMachineIds(a, b) {
  return a.localeCompare(b, "zh-CN", { numeric: true });
}

function getRequiredNurseCount(settings = state.settings) {
  return Math.max(1, Math.ceil((settings.rowCount * settings.machinesPerRow) / MACHINES_PER_NURSE));
}

function getNurseGroups(settings = state.settings) {
  return chunk(getMachineIds(settings), MACHINES_PER_NURSE).map((machines, index) => ({
    index,
    range: `${machines[0]}-${machines[machines.length - 1]}`,
    machines,
  }));
}

function rowLabelFromIndex(index) {
  let label = "";
  let current = index;
  do {
    label = String.fromCharCode(65 + (current % 26)) + label;
    current = Math.floor(current / 26) - 1;
  } while (current >= 0);
  return label;
}

function getAssignmentsForPatient(patientId, date) {
  const daySchedule = getEffectiveScheduleForDate(date);
  return getAssignmentsForPatientInDay(patientId, daySchedule);
}

function getWeeklyAssignmentsForPatient(patientId, weekdayKey) {
  return getAssignmentsForPatientInDay(patientId, state.weeklySchedules?.[weekdayKey] || {});
}

function getAssignmentsForPatientInDay(patientId, daySchedule) {
  const assignments = [];
  Object.entries(daySchedule).forEach(([machineId, item]) => {
    ["morning", "afternoon"].forEach((shift) => {
      if (item[shift]?.patientId === patientId) {
        assignments.push({ machineId, shift });
      }
    });
  });
  return assignments;
}

function findConflicts(daySchedule) {
  const seen = {};
  const conflicts = [];
  Object.entries(daySchedule || {}).forEach(([machineId, item]) => {
    ["morning", "afternoon"].forEach((shift) => {
      const patientId = item[shift]?.patientId;
      if (!patientId) {
        return;
      }
      const key = `${shift}:${patientId}`;
      if (!seen[key]) {
        seen[key] = [];
      }
      seen[key].push({ machineId, shift });
    });
  });

  Object.values(seen).forEach((items) => {
    if (items.length > 1) {
      conflicts.push(...items);
    }
  });
  return conflicts;
}

function findPatient(id) {
  return state.patients.find((patient) => patient.id === id);
}

function findStaff(id) {
  return state.staffMembers.find((staff) => staff.id === id);
}

function patientMatches(patient, keyword) {
  if (!keyword) {
    return true;
  }

  return [patient.name, patient.dialysisNo, patient.phone, patient.vascularAccess, patient.infectionFlag, formatDayPreference(patient.preferredDays)]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(keyword));
}

function staffMatches(staff, keyword) {
  if (!keyword) {
    return true;
  }

  return [staff.name, staff.code, staff.phone, staff.role, staff.note]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(keyword));
}

function sortPatients(a, b) {
  return (a.dialysisNo || a.name).localeCompare(b.dialysisNo || b.name, "zh-CN", { numeric: true });
}

function sortStaffMembers(a, b) {
  return (a.code || a.name).localeCompare(b.code || b.name, "zh-CN", { numeric: true });
}

function scoreShiftPreference(staff, shift) {
  if (!staff.preferredShift) {
    return 1;
  }
  return staff.preferredShift === shift ? 2 : 0;
}

function getStaffDisplayName(value) {
  const staff = findStaff(value);
  return staff ? staff.name : value;
}

function formatPreference(preferredShift, preferredDays = []) {
  const shift = preferredShift ? SHIFT_LABELS[preferredShift] : "不限";
  const days = formatDayPreference(preferredDays);
  return days ? `${shift} · ${days}` : shift;
}

function formatDayPreference(preferredDays = []) {
  const labels = preferredDays
    .map((key) => getWeekDayLabel(key))
    .filter(Boolean);
  return labels.join(state.settings.language === "en" ? ", " : "、");
}

function getWeekDayLabel(key) {
  const index = WEEK_DAYS.findIndex((day) => day.key === key);
  const labels = WEEK_DAY_LABELS[state.settings.language === "en" ? "en" : "zh"];
  return index >= 0 ? labels[index] : "";
}

function getCheckedValues(container) {
  return [...container.querySelectorAll("input[type=checkbox]:checked")].map((input) => input.value);
}

function setCheckedValues(container, values) {
  const selected = new Set(values.map(String));
  container.querySelectorAll("input[type=checkbox]").forEach((input) => {
    input.checked = selected.has(input.value);
  });
}

function buildPatientSubline(patient) {
  return [patient.dialysisNo && `透析号 ${patient.dialysisNo}`, patient.vascularAccess, patient.infectionFlag].filter(Boolean).join(" · ") || "资料待完善";
}

function formatDateLabel(dateValue) {
  if (!dateValue) {
    return "今日";
  }
  const date = parseDateInput(dateValue);
  return date.toLocaleDateString(state.settings.language === "en" ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function formatShortDate(date) {
  if (state.settings.language === "en") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function parseDateInput(dateValue) {
  const [year, month, day] = String(dateValue || formatDateInput(new Date()))
    .split("-")
    .map(Number);
  return new Date(year, month - 1, day);
}

function getWeekStart(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  return result;
}

function addDays(date, amount) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + amount);
  return result;
}

function moveWeek(direction) {
  const date = parseDateInput(getCurrentDate());
  date.setDate(date.getDate() + direction * 7);
  ui.scheduleDate.value = formatDateInput(date);
  refreshScheduleView();
}

function chunk(items, size) {
  const result = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.round(number)));
}

function clampDecimal(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.round(number * 10) / 10));
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  clearTimeout(toastTimer);
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  toastTimer = setTimeout(() => {
    ui.toast.classList.remove("show");
  }, 2200);
}
