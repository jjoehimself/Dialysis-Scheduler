const STORAGE_KEY = "hemodialysis-scheduler-v1";
const SHIFT_LABELS = {
  morning: "上午",
  afternoon: "下午",
};
const STAFF_SHIFT_KEYS = ["morning", "afternoon"];
const WORKING_DAY_KEYS = ["1", "2", "3", "4", "5", "6"];
const REST_DAY_KEY = "0";
const DOCTOR_COUNT = 2;
const MACHINES_PER_NURSE = 6;
const SEVERE_PATIENT_NURSE_CAPACITY = 5;
const BACKUP_NURSE_COUNT = 1;
const STANDARD_CARE_LEVEL = "standard";
const SEVERE_CARE_LEVEL = "severe";
const DEFAULT_MACHINE_TYPE = "hemodialysis";
const MACHINE_ZONE_NORMAL = "normal";
const MACHINE_ZONE_SEVERE = "severe";
const MACHINE_ZONE_INFECTION = "infection";
const MACHINE_ZONE_INFECTION_FLAGS = ["HBC", "HBV", "HCV", "T"];
const MACHINE_ZONES = [
  { key: MACHINE_ZONE_NORMAL, label: "普通区", shortLabel: "普" },
  { key: MACHINE_ZONE_SEVERE, label: "重病区", shortLabel: "重" },
  { key: MACHINE_ZONE_INFECTION, label: "通用传染区", shortLabel: "传" },
  ...MACHINE_ZONE_INFECTION_FLAGS.map((flag) => ({ key: flag, label: `${flag}区`, shortLabel: flag })),
];
const MACHINE_TYPES = [
  { key: "hemodialysis", label: "血透", shortLabel: "透" },
  { key: "hemofiltration", label: "血滤", shortLabel: "滤" },
  { key: "perfusion", label: "灌流", shortLabel: "灌" },
];

// 默认 60 台机器布局（6 排 × 10 台）。
// 1-10 为传染病专用区；21-40 标记为重病区；其余为普通区。
const DEFAULT_LAYOUT_MACHINE_TYPES = Object.freeze({
  "1": "hemofiltration",
  "10": "hemofiltration",
  "11": "hemofiltration",
  "21": "hemofiltration",
  "30": "hemofiltration",
  "31": "hemofiltration",
  "40": "hemofiltration",
  "41": "hemofiltration",
  "50": "hemofiltration",
  "51": "hemofiltration",
});
const DEFAULT_LAYOUT_MACHINE_ZONES = Object.freeze({
  "1": "HBV",
  "2": "HBV",
  "3": "HBV",
  "4": "HBV",
  "5": "HBV",
  "6": "HBV",
  "7": "HBV",
  "8": "HCV",
  "9": "T",
  "10": "T",
  "21": MACHINE_ZONE_SEVERE,
  "22": MACHINE_ZONE_SEVERE,
  "23": MACHINE_ZONE_SEVERE,
  "24": MACHINE_ZONE_SEVERE,
  "25": MACHINE_ZONE_SEVERE,
  "26": MACHINE_ZONE_SEVERE,
  "27": MACHINE_ZONE_SEVERE,
  "28": MACHINE_ZONE_SEVERE,
  "29": MACHINE_ZONE_SEVERE,
  "30": MACHINE_ZONE_SEVERE,
  "31": MACHINE_ZONE_SEVERE,
  "32": MACHINE_ZONE_SEVERE,
  "33": MACHINE_ZONE_SEVERE,
  "34": MACHINE_ZONE_SEVERE,
  "35": MACHINE_ZONE_SEVERE,
  "36": MACHINE_ZONE_SEVERE,
  "37": MACHINE_ZONE_SEVERE,
  "38": MACHINE_ZONE_SEVERE,
  "39": MACHINE_ZONE_SEVERE,
  "40": MACHINE_ZONE_SEVERE,
});
const DEFAULT_LAYOUT_INFECTION_MACHINES = Object.freeze(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);

const MACHINE_TYPE_LABELS = MACHINE_TYPES.reduce((labels, item) => {
  labels[item.key] = item.label;
  return labels;
}, {});
const DEMO_LAST_NAMES = ["王", "李", "张", "刘", "陈", "杨", "赵", "黄", "周", "吴", "徐", "孙", "胡", "朱", "高", "林"];
const DEMO_GIVEN_NAMES = ["安", "宁", "明", "华", "芳", "杰", "敏", "伟", "静", "磊", "欣", "强", "娜", "军", "琳", "健", "晨", "雪"];
const DEMO_INFECTION_FLAGS = ["HBC", "HBV", "HCV", "T"];
const DEMO_DAY_PATTERNS = [
  ["1", "3", "5"],
  ["2", "4", "6"],
];
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
    weekMeta: "默认读取每周模板；周一至周六工作，周日休息；临时变化可保存为仅当前日期",
    prevWeek: "上一周",
    nextWeek: "下一周",
    today: "今天",
    staffBoard: "医护排班",
    scheduleBoard: "今日排班",
    autoSchedule: "生成周模板建议",
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
    weekMeta: "Uses weekly templates by default; Mon-Sat working, Sunday rest; save one-off changes for this date only",
    prevWeek: "Previous Week",
    nextWeek: "Next Week",
    today: "Today",
    staffBoard: "Staff Schedule",
    scheduleBoard: "Daily Schedule",
    autoSchedule: "Generate Weekly Template",
    saveAsWeekly: "Save Day as Template",
    copyPrevious: "Copy Previous Day",
    clearDay: "Clear Day",
    language: "Language / 语言",
  },
};

const DEFAULT_STATE = {
  settings: {
    roomName: "血透室",
    rowCount: 6,
    machinesPerRow: 10,
    numberingStartSide: "left",
    inactiveSlots: [],
    machineTypes: { ...DEFAULT_LAYOUT_MACHINE_TYPES },
    machineZones: { ...DEFAULT_LAYOUT_MACHINE_ZONES },
    specialMachines: [...DEFAULT_LAYOUT_INFECTION_MACHINES],
    specialZoneName: "传染区",
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
    "autoScheduleDay",
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
    "patientTreatmentType",
    "weeklyTreatmentCount",
    "monthlyHdfCount",
    "patientStatus",
    "infectionFlag",
    "careLevel",
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
    "numberingStartSide",
    "specialZoneName",
    "layoutEditMode",
    "restoreDemo",
    "demoPatientCount",
    "demoDoctorCount",
    "demoNurseCount",
    "demoHbcCount",
    "demoHbvCount",
    "demoHcvCount",
    "demoTCount",
    "demoSevereCount",
    "demoMonthlyHdfCount",
    "generateDemoData",
    "clearDemoData",
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
  ui.generateDemoData.addEventListener("click", generateDemoData);
  ui.clearDemoData.addEventListener("click", clearDemoData);
  ["roomName", "machinesPerRow", "rowCount", "numberingStartSide", "specialZoneName"].forEach((id) => {
    ui[id].addEventListener("input", renderLayoutPreviewFromForm);
  });
  ui.numberingStartSide.addEventListener("change", renderLayoutPreviewFromForm);

  ui.copyPreviousDay.addEventListener("click", copyPreviousDay);
  ui.autoScheduleDay.addEventListener("click", autoScheduleWeeklyTemplate);
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
  settings.numberingStartSide = settings.numberingStartSide === "right" ? "right" : "left";
  settings.inactiveSlots = normalizeInactiveSlots(settings.inactiveSlots, settings);
  settings.specialZoneName = String(settings.specialZoneName || DEFAULT_STATE.settings.specialZoneName).trim().slice(0, 16);
  settings.machineTypes = normalizeMachineTypeMap(settings.machineTypes, new Set(getMachineIds(settings)), settings.hdfMachines);
  settings.machineZones = normalizeMachineZoneMap(settings.machineZones, new Set(getMachineIds(settings)), settings.specialMachines);
  settings.specialMachines = getInfectionMachineIds(settings);
  delete settings.hdfMachines;
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
    treatmentType: normalizeMachineType(patient.treatmentType),
    weeklyTreatmentCount: clampNumber(patient.weeklyTreatmentCount, 1, 6, 3),
    monthlyHdfCount: clampNumber(patient.monthlyHdfCount, 0, 4, 1),
    status: patient.status === "paused" ? "paused" : "active",
    infectionFlag: normalizeInfectionFlag(patient.infectionFlag),
    careLevel: normalizeCareLevel(patient.careLevel),
    preferredShift: ["morning", "afternoon"].includes(patient.preferredShift) ? patient.preferredShift : "",
    preferredDays: normalizeDayPreference(patient.preferredDays),
    note: String(patient.note || "").trim().slice(0, 300),
    demo: Boolean(patient.demo),
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
    demo: Boolean(staff.demo),
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

  const nurseCount = Math.max(getRequiredNurseCount(settings), getMaxStaffScheduleNurseCount(rawSchedules));
  return Object.entries(rawSchedules).reduce((result, [date, daySchedule]) => {
    const validKey = weeklyOnly ? WEEK_DAYS.some((day) => day.key === date) : /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (validKey && daySchedule && typeof daySchedule === "object") {
      result[date] = normalizeStaffScheduleDay(daySchedule, nurseCount);
    }
    return result;
  }, {});
}

function getMaxStaffScheduleNurseCount(rawSchedules) {
  let count = 0;
  Object.values(rawSchedules || {}).forEach((daySchedule) => {
    STAFF_SHIFT_KEYS.forEach((shift) => {
      count = Math.max(count, daySchedule?.[shift]?.nurses?.length || 0);
    });
  });
  return count;
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
    treatmentType: normalizeMachineType(slot.treatmentType),
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
  pruneInvalidMachineSettings();
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

function pruneInvalidMachineSettings() {
  if (!state.settings) {
    return;
  }
  state.settings.inactiveSlots = normalizeInactiveSlots(state.settings.inactiveSlots, state.settings);
  state.settings.machineTypes = normalizeMachineTypeMap(state.settings.machineTypes, new Set(getMachineIds()), state.settings.hdfMachines);
  state.settings.machineZones = normalizeMachineZoneMap(state.settings.machineZones, new Set(getMachineIds()), state.settings.specialMachines);
  state.settings.specialMachines = getInfectionMachineIds(state.settings);
  delete state.settings.hdfMachines;
}

function normalizeMachineIdList(value, validMachines) {
  const items = Array.isArray(value) ? value : [];
  const seen = new Set();
  return items
    .map((item) => String(item || "").trim())
    .filter((machineId) => machineId && validMachines.has(machineId) && !seen.has(machineId) && seen.add(machineId));
}

function normalizeInactiveSlots(value, settings) {
  const items = Array.isArray(value) ? value : [];
  const validSlots = new Set(getAllSlotKeys(settings));
  const seen = new Set();
  return items
    .map((item) => String(item || "").trim())
    .filter((slotKey) => slotKey && validSlots.has(slotKey) && !seen.has(slotKey) && seen.add(slotKey))
    .sort(sortSlotKeys);
}

function getAllSlotKeys(settings = state.settings) {
  const keys = [];
  for (let row = 0; row < settings.rowCount; row += 1) {
    for (let column = 0; column < settings.machinesPerRow; column += 1) {
      keys.push(getSlotKey(row, column));
    }
  }
  return keys;
}

function getSlotKey(row, column) {
  return `r${row}c${column}`;
}

function sortSlotKeys(a, b) {
  const left = parseSlotKey(a);
  const right = parseSlotKey(b);
  return left.row - right.row || left.column - right.column;
}

function parseSlotKey(slotKey) {
  const match = String(slotKey || "").match(/^r(\d+)c(\d+)$/);
  return match ? { row: Number(match[1]), column: Number(match[2]) } : { row: 0, column: 0 };
}

function normalizeMachineTypeMap(value, validMachines, legacyHdfMachines = []) {
  const result = {};
  if (value && typeof value === "object" && !Array.isArray(value)) {
    Object.entries(value).forEach(([machineId, type]) => {
      const normalizedMachineId = String(machineId || "").trim();
      const normalizedType = normalizeMachineType(type);
      if (validMachines.has(normalizedMachineId) && normalizedType !== DEFAULT_MACHINE_TYPE) {
        result[normalizedMachineId] = normalizedType;
      }
    });
  }

  normalizeMachineIdList(legacyHdfMachines, validMachines).forEach((machineId) => {
    if (!result[machineId]) {
      result[machineId] = "hemofiltration";
    }
  });

  return result;
}

function normalizeMachineType(type) {
  const value = String(type || "").trim();
  return MACHINE_TYPE_LABELS[value] ? value : DEFAULT_MACHINE_TYPE;
}

function normalizeMachineZone(zone) {
  const value = String(zone || "").trim().toUpperCase();
  if (!value || value === MACHINE_ZONE_NORMAL.toUpperCase() || value === "REGULAR") {
    return MACHINE_ZONE_NORMAL;
  }
  if (value === MACHINE_ZONE_SEVERE.toUpperCase() || value === "CRITICAL") {
    return MACHINE_ZONE_SEVERE;
  }
  if (value === MACHINE_ZONE_INFECTION.toUpperCase() || value === "SPECIAL") {
    return MACHINE_ZONE_INFECTION;
  }
  return MACHINE_ZONE_INFECTION_FLAGS.includes(value) ? value : MACHINE_ZONE_NORMAL;
}

function normalizeMachineZoneMap(value, validMachines, legacySpecialMachines = []) {
  const result = {};
  if (value && typeof value === "object" && !Array.isArray(value)) {
    Object.entries(value).forEach(([machineId, zone]) => {
      const normalizedMachineId = String(machineId || "").trim();
      const normalizedZone = normalizeMachineZone(zone);
      if (validMachines.has(normalizedMachineId) && normalizedZone !== MACHINE_ZONE_NORMAL) {
        result[normalizedMachineId] = normalizedZone;
      }
    });
  }
  normalizeMachineIdList(legacySpecialMachines, validMachines).forEach((machineId) => {
    if (!result[machineId]) {
      result[machineId] = MACHINE_ZONE_INFECTION;
    }
  });
  return result;
}

function normalizeCareLevel(value) {
  return String(value || "").trim() === SEVERE_CARE_LEVEL ? SEVERE_CARE_LEVEL : STANDARD_CARE_LEVEL;
}

function normalizeInfectionFlag(value) {
  const text = String(value || "").trim().toUpperCase();
  if (!text || ["无", "NONE", "NO", "阴性", "NEGATIVE"].includes(text)) {
    return "";
  }
  if (text === "梅毒" || text === "TP" || text === "SYPHILIS") {
    return "T";
  }
  return text.slice(0, 32);
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
      day.key === REST_DAY_KEY && !hasOverride
        ? state.settings.language === "en"
          ? "Rest"
          : "休息"
        : state.settings.language === "en"
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
  const activePatientList = state.patients.filter((patient) => patient.status === "active");
  const activePatients = activePatientList.length;
  const severePatients = activePatientList.filter(isSeverePatient).length;
  const infectionSummary = [
    ["HBC", ["HBC"]],
    ["HBV", ["HBV"]],
    ["HCV", ["HCV"]],
    ["T", ["T"]],
  ]
    .map(([label, flags]) => `${label}:${activePatientList.filter((patient) => flags.includes(normalizeInfectionFlag(patient.infectionFlag))).length}`)
    .join(" / ");
  const machineZoneSummary = [
    `重:${getSevereMachines().length}`,
    ...MACHINE_ZONE_INFECTION_FLAGS.map((flag) => `${flag}:${getMachineIds().filter((machineId) => getMachineZone(machineId) === flag).length}`),
  ].join(" / ");
  const conflicts = findConflicts(daySchedule);
  const staffCoverage = getStaffCoverage(date);
  const cards = [
    ["机器总数", machines.length],
    ["血透", getMachineTypeCount("hemodialysis")],
    ["血滤", getMachineTypeCount("hemofiltration")],
    ["灌流", getMachineTypeCount("perfusion")],
    ["机器分区", machineZoneSummary],
    ["上午已排", `${morningCount}/${machines.length}`],
    ["下午已排", `${afternoonCount}/${machines.length}`],
    ["在透患者", activePatients],
    ["严重组", severePatients],
    ["传染分类", infectionSummary],
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
  const patientDaySchedule = getEffectiveScheduleForDate(date);
  const baseProfile = getNurseGroupProfileForDay(patientDaySchedule);
  const nurseCount = Math.max(baseProfile.count, getExistingStaffNurseSlotCount(date), 1);
  const nurseProfile = getNurseGroupProfileForDay(patientDaySchedule, state.settings, nurseCount);
  const daySchedule = getEffectiveStaffScheduleForDate(date, nurseCount);

  ui.staffTitle.textContent = state.settings.language === "en" ? `${formatDateLabel(date)} Staff Schedule` : `${formatDateLabel(date)}医护排班`;
  ui.staffMeta.textContent =
    state.settings.language === "en"
      ? `${DOCTOR_COUNT} doctors · ${nurseCount} nurses · ${BACKUP_NURSE_COUNT} backup nurse`
      : `医生 ${DOCTOR_COUNT} 名 · 责任护士 ${nurseCount} 名 · 后备护士 ${BACKUP_NURSE_COUNT} 名`;
  ui.staffScheduleGrid.innerHTML = STAFF_SHIFT_KEYS.map((shift) => renderStaffShiftCard(shift, daySchedule[shift], nurseProfile.shiftGroups[shift], date)).join("");

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
        hint: formatNurseGroupHint(group),
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
      const type = `<em>${escapeHtml(getMachineTypeLabel(machineId))}</em>`;
      const care = isSeverePatient(patient) ? `<em class="care-tag severe">严重组</em>` : "";
      const infection = patient.infectionFlag ? `<em class="care-tag infection">${escapeHtml(patient.infectionFlag)}</em>` : "";
      return `
        <li>
          <span>${escapeHtml(machineId)}${type}${care}${infection}</span>
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
  if (scope === "weekly" && getWeekdayKey(date) === REST_DAY_KEY) {
    input.value = "";
    showToast("周日休息，不保存为每周医护模板；可切换为仅当前日期");
    return;
  }
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
  renderSchedule();
}

function getStaffScheduleForEdit(date, scope, nurseCount = getRequiredNurseCountForDate(date)) {
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

function getEffectiveStaffScheduleForDate(date, nurseCount = getRequiredNurseCountForDate(date)) {
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
  const nurseCount = getRequiredNurseCountForDate(date);
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
  const rows = getMachineRows();
  const date = getCurrentDate();
  const daySchedule = getEffectiveScheduleForDate(date);
  const conflicts = findConflicts(daySchedule);
  const nurseProfile = getNurseGroupProfileForDay(daySchedule, state.settings, getRequiredNurseCountForDate(date));
  const staffSchedule = getEffectiveStaffScheduleForDate(date, nurseProfile.count);
  const scheduleContext = { nurseProfile, staffSchedule };

  document.documentElement.style.setProperty("--machines-per-row", state.settings.machinesPerRow);
  ui.boardTitle.textContent = state.settings.language === "en" ? `${formatDateLabel(date)} Schedule` : `${formatDateLabel(date)}排班`;
  ui.boardMeta.textContent =
    state.settings.language === "en"
      ? `${state.settings.rowCount} rows, ${machines.length} active machines`
      : `${state.settings.rowCount} 排，启用 ${machines.length} 台`;

  ui.machineRows.innerHTML = rows
    .map((row, index) => {
      return `
        <section class="machine-row">
          <div class="row-title">第 ${index + 1} 排</div>
          <div class="machine-grid">
            ${row.map((slot) => (slot.active ? renderMachineCard(slot.machineId, daySchedule[slot.machineId], conflicts, scheduleContext) : renderInactiveScheduleSlot())).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  ui.machineRows.querySelectorAll(".shift-slot").forEach((slot) => {
    slot.addEventListener("click", () => openAssignmentDialog(slot.dataset.machine, slot.dataset.shift));
  });
}

function renderInactiveScheduleSlot() {
  return `<div class="machine-card inactive-machine-slot"><span>空位</span></div>`;
}

function renderMachineCard(machineId, scheduleItem = {}, conflicts = [], scheduleContext = null) {
  const conflictSet = new Set(conflicts.map((item) => `${item.machineId}:${item.shift}`));
  const machineType = getMachineType(machineId);
  const machineTypeLabel = getMachineTypeLabel(machineId);
  const machineZone = getMachineZone(machineId);
  const hasZone = machineZone !== MACHINE_ZONE_NORMAL;
  return `
    <article class="machine-card ${getMachineTypeClass(machineType)} ${getMachineZoneClass(machineZone)}">
      <div class="machine-card-header">
        <span class="machine-id">${escapeHtml(machineId)}</span>
        <div class="machine-card-actions">
          ${hasZone ? `<span class="machine-type-badge ${getMachineZoneClass(machineZone)}">${escapeHtml(getMachineZoneLabel(machineId))}</span>` : ""}
          <span class="machine-type-badge ${getMachineTypeClass(machineType)}">${escapeHtml(machineTypeLabel)}</span>
        </div>
      </div>
      <div class="slot-stack">
        ${renderShiftSlot(machineId, "morning", scheduleItem.morning, conflictSet, scheduleContext)}
        ${renderShiftSlot(machineId, "afternoon", scheduleItem.afternoon, conflictSet, scheduleContext)}
      </div>
    </article>
  `;
}

function renderShiftSlot(machineId, shift, assignment, conflictSet, scheduleContext = null) {
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
      ${renderResponsibleNurseBadge(machineId, shift, scheduleContext)}
      ${sourceLabel ? `<span class="slot-source">${sourceLabel}</span>` : ""}
      ${content}
    </button>
  `;
}

function renderResponsibleNurseBadge(machineId, shift, scheduleContext) {
  if (!scheduleContext) {
    return "";
  }
  const groups = scheduleContext.nurseProfile?.shiftGroups?.[shift] || [];
  const groupIndex = getMachineGroupIndex(machineId, groups);
  const group = groups[groupIndex];
  if (!group || group.empty) {
    return "";
  }
  const nurseId = scheduleContext.staffSchedule?.[shift]?.nurses?.[groupIndex];
  const nurseName = nurseId ? getStaffDisplayName(nurseId) : `护士${groupIndex + 1}`;
  const load = `${group.patientCount}/${group.capacity}${group.severeZone ? " 重病区" : " 其他区"}`;
  return `<span class="slot-nurse">责任护士：${escapeHtml(nurseName)} · ${escapeHtml(group.range)} · ${escapeHtml(load)}</span>`;
}

function openAssignmentDialog(machineId, shift) {
  selectedSlot = { machineId, shift };
  const date = getCurrentDate();
  const assignment = getEffectiveSlot(date, machineId, shift) || {};
  const patientOptions = state.patients
    .filter((patient) => patient.id === assignment.patientId || (patient.status === "active" && patientFitsMachine(patient, machineId)))
    .sort(sortPatients)
    .map((patient) => {
      const details = [patient.dialysisNo, getPatientTreatmentLabel(patient), getPatientCareLabel(patient), patient.vascularAccess, patient.infectionFlag, formatPreference(patient.preferredShift, patient.preferredDays)]
        .filter(Boolean)
        .join(" · ");
      const label = details ? `${patient.name} (${details})` : patient.name;
      return `<option value="${escapeHtml(patient.id)}">${escapeHtml(label)}</option>`;
    })
    .join("");

  ui.assignmentTitle.textContent = `${machineId} ${SHIFT_LABELS[shift]}`;
  ui.assignmentSubtitle.textContent = [
    formatDateLabel(date),
    getMachineTypeLabel(machineId),
    getMachineZoneLabel(machineId),
  ].join(" · ");
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
  if (scope === "weekly" && targetKey === REST_DAY_KEY) {
    showToast("周日休息，不保存为每周患者模板；可切换为仅当前日期");
    return;
  }

  if (!patientId) {
    clearScheduleSlot(targetSchedule, targetKey, machineId, shift, scope === "date" && Boolean(getWeeklySlot(date, machineId, shift)));
  } else {
    const patient = findPatient(patientId);
    if (patient && !patientFitsMachine(patient, machineId)) {
      window.alert(`${patient.name} 需要${getPatientTreatmentLabel(patient)}，且分区必须匹配患者组别或传染标识；不能安排到 ${machineId}（${getMachineTypeLabel(machineId)}，${getMachineZoneLabel(machineId)}）。`);
      return;
    }
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
    treatmentType: ui.patientTreatmentType.value,
    weeklyTreatmentCount: ui.weeklyTreatmentCount.value,
    monthlyHdfCount: ui.monthlyHdfCount.value,
    status: ui.patientStatus.value,
    infectionFlag: ui.infectionFlag.value,
    careLevel: ui.careLevel.value,
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

  const compatibilityIssues = getPatientCompatibilityIssues(patient);
  if (compatibilityIssues.length) {
    window.alert(`不能保存 ${patient.name} 的资料。新的治疗类型或感染标识与以下现有排班不匹配，请先移动或清空：\n\n${compatibilityIssues.slice(0, 12).map((item) => `- ${item}`).join("\n")}`);
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
  ui.patientTreatmentType.value = normalizeMachineType(patient.treatmentType);
  ui.weeklyTreatmentCount.value = patient.weeklyTreatmentCount || 3;
  ui.monthlyHdfCount.value = patient.monthlyHdfCount ?? 1;
  ui.patientStatus.value = patient.status || "active";
  ui.infectionFlag.value = patient.infectionFlag || "";
  ui.careLevel.value = normalizeCareLevel(patient.careLevel);
  ui.preferredShift.value = patient.preferredShift || "";
  setCheckedValues(ui.patientPreferredDays, patient.preferredDays || []);
  ui.patientNote.value = patient.note || "";
  ui.deletePatient.classList.remove("hidden");
}

function resetPatientForm() {
  ui.patientForm.reset();
  ui.patientId.value = "";
  ui.patientStatus.value = "active";
  ui.infectionFlag.value = "";
  ui.careLevel.value = STANDARD_CARE_LEVEL;
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
    ui.patientTableBody.innerHTML = `<tr><td colspan="7"><div class="empty-state">暂无患者资料</div></td></tr>`;
    return;
  }

  ui.patientTableBody.innerHTML = patients
    .map((patient) => {
      const status = patient.status === "paused" ? `<span class="tag off">暂停</span>` : `<span class="tag">在透</span>`;
      const shift = formatPreference(patient.preferredShift, getPatientPreferredDaysForDisplay(patient));
      const plan = `${patient.weeklyTreatmentCount || 3}次/周 · 血滤${patient.monthlyHdfCount ?? 1}次/月`;
      return `
        <tr>
          <td>
            <div class="patient-name">${escapeHtml(patient.name)}${patient.demo ? ` <span class="tag demo">演示</span>` : ""}</div>
            <div class="patient-subline">${escapeHtml([patient.gender, patient.age && `${patient.age}岁`, patient.phone].filter(Boolean).join(" · ") || "基本资料待完善")}</div>
          </td>
          <td>${escapeHtml(patient.dialysisNo || "-")}</td>
          <td>${escapeHtml(patient.vascularAccess || "-")}</td>
          <td>${escapeHtml(`${getPatientTreatmentLabel(patient)} · ${getPatientCareLabel(patient)} · ${plan}`)}</td>
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
            <div class="patient-name">${escapeHtml(staff.name)}${staff.demo ? ` <span class="tag demo">演示</span>` : ""}</div>
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

function generateDemoData() {
  const patientCount = clampNumber(ui.demoPatientCount.value, 0, 300, 36);
  const doctorCount = clampNumber(ui.demoDoctorCount.value, 0, 50, 4);
  const nurseCount = clampNumber(ui.demoNurseCount.value, 0, 200, 10);
  const infectionCounts = {
    HBC: clampNumber(ui.demoHbcCount.value, 0, 300, 0),
    HBV: clampNumber(ui.demoHbvCount.value, 0, 300, 2),
    HCV: clampNumber(ui.demoHcvCount.value, 0, 300, 1),
    T: clampNumber(ui.demoTCount.value, 0, 300, 1),
  };
  const infectiousCount = Object.values(infectionCounts).reduce((total, count) => total + count, 0);
  const severeCount = Math.min(patientCount, clampNumber(ui.demoSevereCount.value, 0, 300, 4));
  const demoMonthlyHdfCount = clampNumber(ui.demoMonthlyHdfCount.value, 0, 4, 1);
  if (!patientCount && !doctorCount && !nurseCount) {
    showToast("请至少输入一种演示数据数量");
    return;
  }
  if (infectiousCount > patientCount) {
    showToast(`四类传染患者合计 ${infectiousCount} 名，不能超过患者总数 ${patientCount} 名`);
    return;
  }

  const infectionFlags = DEMO_INFECTION_FLAGS.flatMap((flag) => Array(infectionCounts[flag]).fill(flag));
  const batch = Date.now().toString(36);
  const patients = Array.from({ length: patientCount }, (_, index) =>
    createDemoPatient(index, batch, infectionFlags, severeCount, demoMonthlyHdfCount),
  );
  const doctors = Array.from({ length: doctorCount }, (_, index) => createDemoStaff(index, batch, "doctor"));
  const nurses = Array.from({ length: nurseCount }, (_, index) => createDemoStaff(index, batch, "nurse"));
  state.patients.push(...patients);
  state.staffMembers.push(...doctors, ...nurses);
  saveState();
  resetPatientForm();
  resetStaffForm();
  renderPatientTable();
  renderStaffTable();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  renderLayoutPreviewFromForm();
  const infectionSummary = DEMO_INFECTION_FLAGS.map((flag) => `${flag} ${infectionCounts[flag]} 名`).join("、");
  showToast(`已生成 ${patients.length} 名患者（${infectionSummary}）、${doctors.length + nurses.length} 名医护演示数据`);
}

function createDemoPatient(index, batch, infectionFlags, severeCount, demoMonthlyHdfCount) {
  const infectionFlag = infectionFlags[index] || "";
  const dayPattern = DEMO_DAY_PATTERNS[index % DEMO_DAY_PATTERNS.length];
  return normalizePatient({
    id: createId(),
    name: createDemoName(index),
    dialysisNo: `DEMO-P-${batch}-${String(index + 1).padStart(3, "0")}`,
    gender: index % 2 ? "女" : "男",
    age: 35 + (index % 45),
    phone: `1380000${String(index + 1).padStart(4, "0")}`,
    dryWeight: 45 + (index % 36),
    vascularAccess: ["自体内瘘", "人工血管", "长期导管"][index % 3],
    treatmentType: DEFAULT_MACHINE_TYPE,
    weeklyTreatmentCount: 3,
    monthlyHdfCount: demoMonthlyHdfCount,
    status: "active",
    infectionFlag,
    careLevel: index < severeCount ? SEVERE_CARE_LEVEL : STANDARD_CARE_LEVEL,
    preferredShift: index % 3 === 0 ? "morning" : index % 3 === 1 ? "afternoon" : "",
    preferredDays: dayPattern,
    note: "演示数据",
    demo: true,
    updatedAt: new Date().toISOString(),
  });
}

function createDemoStaff(index, batch, role) {
  return normalizeStaffMember({
    id: createId(),
    name: `${role === "doctor" ? "医" : "护"}${createDemoName(index + (role === "doctor" ? 40 : 80))}`,
    code: `DEMO-${role === "doctor" ? "D" : "N"}-${batch}-${String(index + 1).padStart(3, "0")}`,
    role,
    phone: `1390000${String(index + 1).padStart(4, "0")}`,
    preferredShift: index % 3 === 0 ? "morning" : index % 3 === 1 ? "afternoon" : "",
    status: "active",
    note: "演示数据",
    demo: true,
    updatedAt: new Date().toISOString(),
  });
}

function createDemoName(index) {
  const last = DEMO_LAST_NAMES[index % DEMO_LAST_NAMES.length];
  const first = DEMO_GIVEN_NAMES[index % DEMO_GIVEN_NAMES.length];
  const second = index % 3 === 0 ? DEMO_GIVEN_NAMES[(index + 5) % DEMO_GIVEN_NAMES.length] : "";
  return `${last}${first}${second}`;
}

function clearDemoData() {
  const demoPatientIds = state.patients.filter((patient) => patient.demo).map((patient) => patient.id);
  const demoStaffIds = state.staffMembers.filter((staff) => staff.demo).map((staff) => staff.id);
  if (!demoPatientIds.length && !demoStaffIds.length) {
    showToast("没有演示数据可清除");
    return;
  }

  if (!window.confirm(`确定清除 ${demoPatientIds.length} 名演示患者和 ${demoStaffIds.length} 名演示医护吗？`)) {
    return;
  }

  demoPatientIds.forEach(removePatientFromSchedules);
  demoStaffIds.forEach(removeStaffFromSchedules);
  state.patients = state.patients.filter((patient) => !patient.demo);
  state.staffMembers = state.staffMembers.filter((staff) => !staff.demo);
  pruneEmptyStaffSchedules();
  saveState();
  resetPatientForm();
  resetStaffForm();
  renderPatientTable();
  renderStaffTable();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast("演示数据已清除");
}

function saveLayout(event) {
  event.preventDefault();
  const settings = {
    roomName: ui.roomName.value.trim() || DEFAULT_STATE.settings.roomName,
    rowCount: clampNumber(ui.rowCount.value, 1, 20, DEFAULT_STATE.settings.rowCount),
    machinesPerRow: clampNumber(ui.machinesPerRow.value, 1, 30, DEFAULT_STATE.settings.machinesPerRow),
    numberingStartSide: ui.numberingStartSide.value === "right" ? "right" : "left",
    inactiveSlots: [],
    specialZoneName: ui.specialZoneName.value.trim().slice(0, 16) || DEFAULT_STATE.settings.specialZoneName,
    machineTypes: {},
    machineZones: {},
    specialMachines: [],
    language: state.settings.language === "en" ? "en" : "zh",
  };

  const oldMachines = new Set(getMachineIds());
  settings.inactiveSlots = normalizeInactiveSlots(state.settings.inactiveSlots, settings);
  const nextMachines = new Set(getMachineIds(settings));
  settings.machineTypes = normalizeMachineTypeMap(state.settings.machineTypes, nextMachines, state.settings.hdfMachines);
  settings.machineZones = normalizeMachineZoneMap(state.settings.machineZones, nextMachines, state.settings.specialMachines);
  settings.specialMachines = getInfectionMachineIds(settings);
  if (!isSameMachineLayout(settings, state.settings) && hasAnyMachineAssignments()) {
    const message = "新布局可能导致机器重新编号，已有患者排班需要人工复核。仍要应用吗？";
    if (!window.confirm(message)) {
      return;
    }
  }
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

function hasAnyMachineAssignments() {
  return [...Object.values(state.schedules), ...Object.values(state.weeklySchedules)].some((daySchedule) =>
    Object.values(daySchedule || {}).some((item) => STAFF_SHIFT_KEYS.some((shift) => item?.[shift]?.patientId)),
  );
}

function restoreDefaultLayout() {
  const message = hasAnyMachineAssignments()
    ? "恢复默认布局会改为 6 排 × 10 台，并重设机器类型和分区。已有患者排班需要人工复核，仍要继续吗？"
    : "确定恢复为默认 60 台机器布局吗？";
  if (!window.confirm(message)) {
    return;
  }

  const language = state.settings.language === "en" ? "en" : "zh";
  state.settings = structuredClone(DEFAULT_STATE.settings);
  state.settings.language = language;
  saveState();
  renderSettingsForm();
  renderHeader();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderLayoutPreviewFromForm();
  showToast("已恢复默认 60 台机器布局");
}

function renderSettingsForm() {
  ui.roomName.value = state.settings.roomName;
  ui.rowCount.value = state.settings.rowCount;
  ui.machinesPerRow.value = state.settings.machinesPerRow;
  ui.numberingStartSide.value = state.settings.numberingStartSide || "left";
  ui.specialZoneName.value = state.settings.specialZoneName || DEFAULT_STATE.settings.specialZoneName;
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
  ui.autoScheduleDay.textContent = text.autoSchedule;
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
    numberingStartSide: ui.numberingStartSide.value === "right" ? "right" : "left",
    inactiveSlots: normalizeInactiveSlots(state.settings.inactiveSlots, {
      rowCount: clampNumber(ui.rowCount.value, 1, 20, DEFAULT_STATE.settings.rowCount),
      machinesPerRow: clampNumber(ui.machinesPerRow.value, 1, 30, DEFAULT_STATE.settings.machinesPerRow),
    }),
    specialZoneName: ui.specialZoneName.value.trim() || DEFAULT_STATE.settings.specialZoneName,
    machineTypes: state.settings.machineTypes || {},
    machineZones: state.settings.machineZones || {},
    specialMachines: state.settings.specialMachines || [],
  };
  const machineSlots = getMachineSlots(settings);
  const machineIds = machineSlots.filter((slot) => slot.active).map((slot) => slot.machineId);
  ui.layoutPreviewGrid.style.setProperty("--preview-cols", settings.machinesPerRow);
  ui.layoutCountBadge.textContent = `${machineIds.length} / ${machineSlots.length} 台`;
  ui.layoutPreviewGrid.innerHTML = machineSlots
    .map((slot) => {
      if (!slot.active) {
        return `
          <button class="preview-machine inactive" type="button" data-slot="${escapeHtml(slot.slotKey)}">
            <span>空位</span>
            <small>已删除</small>
          </button>
        `;
      }
      const machineType = getMachineType(slot.machineId);
      const machineTypeLabel = getMachineTypeLabel(slot.machineId);
      const machineZone = getMachineZone(slot.machineId, settings);
      const machineZoneLabel = getMachineZoneLabel(slot.machineId, settings);
      const hasZone = machineZone !== MACHINE_ZONE_NORMAL;
      return `
        <button class="preview-machine ${getMachineTypeClass(machineType)} ${getMachineZoneClass(machineZone)}" type="button" data-slot="${escapeHtml(slot.slotKey)}" data-machine="${escapeHtml(slot.machineId)}">
          <span>${escapeHtml(slot.machineId)}</span>
          <small>${escapeHtml(machineTypeLabel)}</small>
          ${hasZone ? `<small>${escapeHtml(machineZoneLabel)}</small>` : ""}
        </button>
      `;
    })
    .join("");

  ui.layoutPreviewGrid.querySelectorAll(".preview-machine").forEach((button) => {
    button.addEventListener("click", () => {
      if (!isSameMachineLayout(settings, state.settings)) {
        showToast("先应用布局，再设置机器属性");
        return;
      }
      const editMode = ui.layoutEditMode.value;
      if (editMode === "inactive") {
        toggleInactiveSlot(button.dataset.slot);
      } else if (!button.dataset.machine) {
        showToast("空位只能恢复，不能设置类型或特殊区");
      } else if (editMode === "special") {
        toggleSpecialMachine(button.dataset.machine);
      } else if (editMode.startsWith("zone:")) {
        setMachineZone(button.dataset.machine, editMode.slice(5));
      } else if (editMode.startsWith("type:")) {
        setMachineType(button.dataset.machine, editMode.slice(5));
      } else {
        showToast("请选择要设置的机器类型");
      }
    });
  });
}

function saveDayAsWeeklyTemplate() {
  const date = getCurrentDate();
  const weekdayKey = getWeekdayKey(date);
  if (weekdayKey === REST_DAY_KEY) {
    showToast("周日休息，不保存为每周模板；可保留为仅当前日期调整");
    return;
  }
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

function autoScheduleWeeklyTemplate() {
  const patientResult = buildAutoWeeklyPatientSchedules(getCurrentDate());
  const staffResult = buildAutoWeeklyStaffSchedules(patientResult.schedules);
  const blocking = [...patientResult.blocking, ...staffResult.blocking];

  if (blocking.length) {
    window.alert(`周模板自动排班未保存：\n\n${blocking.map((item) => `- ${item}`).join("\n")}`);
    return;
  }

  const warnings = [...patientResult.warnings, ...staffResult.warnings];
  const confirmLines = [
    "将生成“每周重复”的排班模板。",
    "范围：周一至周六排班，周日休息。",
    `患者治疗次数：${patientResult.assignedCount} 次`,
    `未来 4 周血滤计划：${patientResult.monthlyHdfCount} 次`,
    `医护岗位：每天医生 ${DOCTOR_COUNT * STAFF_SHIFT_KEYS.length} 岗，护士 ${staffResult.nurseShiftCount} 岗，后备护士 ${BACKUP_NURSE_COUNT * STAFF_SHIFT_KEYS.length} 岗`,
    "这会覆盖周一至周六的每周模板，并清空周日模板；本月血滤会保存为日期调整，避免每周重复血滤。",
  ];
  if (patientResult.dayAdjustments.length) {
    const displayedDayAdjustments = patientResult.dayAdjustments
      .slice(0, 30)
      .map((item) => `- ${item.name}：${getWeekDayLabel(item.from)} → ${getWeekDayLabel(item.to)}`);
    if (patientResult.dayAdjustments.length > displayedDayAdjustments.length) {
      displayedDayAdjustments.push(`- 其余 ${patientResult.dayAdjustments.length - displayedDayAdjustments.length} 次治疗也已调整日期`);
    }
    confirmLines.push("", "因原日期位置不足或周日休息，系统已自动调整透析日期：", ...displayedDayAdjustments);
  }
  if (patientResult.timeAdjustments.length) {
    const displayedAdjustments = patientResult.timeAdjustments
      .slice(0, 30)
      .map((item) => `- ${item.name}（${getWeekDayLabel(item.day)}）：${SHIFT_LABELS[item.from]} → ${SHIFT_LABELS[item.to]}`);
    if (patientResult.timeAdjustments.length > displayedAdjustments.length) {
      displayedAdjustments.push(`- 其余 ${patientResult.timeAdjustments.length - displayedAdjustments.length} 名患者也已调整`);
    }
    confirmLines.push(
      "",
      "因原时段位置不足，系统已自动调整透析时间：",
      ...displayedAdjustments,
    );
  }
  if (warnings.length) {
    confirmLines.push("", "需要人工复核：", ...warnings.map((item) => `- ${item}`));
  }
  confirmLines.push("", "确认把这份建议保存为每周模板吗？");

  if (!window.confirm(confirmLines.join("\n"))) {
    return;
  }

  WORKING_DAY_KEYS.forEach((dayKey) => {
    if (Object.keys(patientResult.schedules[dayKey] || {}).length) {
      state.weeklySchedules[dayKey] = patientResult.schedules[dayKey];
    } else {
      delete state.weeklySchedules[dayKey];
    }
    state.weeklyStaffSchedules[dayKey] = staffResult.schedules[dayKey];
  });
  delete state.weeklySchedules[REST_DAY_KEY];
  delete state.weeklyStaffSchedules[REST_DAY_KEY];
  Object.entries(patientResult.monthlyHdfOverrides).forEach(([date, override]) => {
    state.schedules[date] = mergeDateOverrideDays(state.schedules[date] || {}, override);
  });
  saveState();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast("已生成每周排班模板");
}

function buildAutoWeeklyPatientSchedules(selectedDate = getCurrentDate()) {
  const machines = [...getMachineIds()].sort(sortMachineIds);
  const specialMachines = getSpecialMachines().sort(sortMachineIds);
  const regularMachines = machines.filter((machineId) => getMachineZone(machineId) === MACHINE_ZONE_NORMAL);
  const schedules = WORKING_DAY_KEYS.reduce((result, dayKey) => {
    result[dayKey] = {};
    return result;
  }, {});
  const monthlyHdfOverrides = {};
  const warnings = [];
  const blocking = [];
  const timeAdjustments = [];
  const dayAdjustments = [];
  const sessions = [];
  const activePatients = state.patients.filter((patient) => patient.status === "active");
  const missingDayPreference = activePatients.filter((patient) => !patient.preferredDays?.length);
  const insufficientDayPreference = activePatients.filter(
    (patient) => patient.preferredDays?.length && patient.preferredDays.length < clampNumber(patient.weeklyTreatmentCount, 1, 6, 3),
  );
  const patientsWithSunday = activePatients.filter((patient) => patient.preferredDays?.includes(REST_DAY_KEY));

  activePatients.forEach((patient, patientIndex) => {
    getPatientPlannedDays(patient, patientIndex).forEach((dayKey) => {
      sessions.push({
        patient,
        originalDay: dayKey,
        treatmentType: normalizeMachineType(patient.treatmentType),
      });
    });
  });
  sessions.sort((a, b) => sortAutoPatients(a.patient, b.patient) || getDaySortValue(a.originalDay) - getDaySortValue(b.originalDay));
  const infectiousDue = sessions.filter((session) => isInfectiousPatient(session.patient));

  if (!sessions.length) {
    blocking.push("当前没有可生成周模板的在透患者。请先在患者库设置透析星期倾向。");
  }
  if (missingDayPreference.length) {
    warnings.push(`${missingDayPreference.length} 名在透患者未设置透析星期倾向，系统已按治疗计划均衡安排。`);
  }
  if (insufficientDayPreference.length) {
    warnings.push(`${insufficientDayPreference.length} 名患者设置的星期少于每周治疗次数，系统已自动补足工作日。`);
  }
  if (patientsWithSunday.length) {
    warnings.push(`${patientsWithSunday.length} 名患者包含周日倾向，系统按周日休息自动尝试调整到周一至周六。`);
  }
  blocking.push(...getWeeklyCapacityProblems(sessions, specialMachines, regularMachines));
  if (blocking.length) {
    return { schedules, monthlyHdfOverrides, warnings, blocking, timeAdjustments, dayAdjustments, monthlyHdfCount: 0, assignedCount: 0 };
  }

  const unassigned = [];
  const assignedDaysByPatient = new Map();
  sessions.forEach((session) => {
    const assignment = assignWeeklyPatientSession(session, schedules, machines, specialMachines, regularMachines, assignedDaysByPatient);
    if (!assignment) {
      unassigned.push(`${session.patient.name}（原${getWeekDayLabel(session.originalDay)}）`);
      return;
    }
    const patientDays = assignedDaysByPatient.get(session.patient.id) || new Set();
    patientDays.add(assignment.day);
    assignedDaysByPatient.set(session.patient.id, patientDays);
    if (assignment.day !== session.originalDay) {
      dayAdjustments.push({ patientId: session.patient.id, name: session.patient.name, from: session.originalDay, to: assignment.day });
    }
    if (session.patient.preferredShift && assignment.shift !== session.patient.preferredShift) {
      timeAdjustments.push({ patientId: session.patient.id, name: session.patient.name, day: assignment.day, from: session.patient.preferredShift, to: assignment.shift });
    }
  });

  if (unassigned.length) {
    blocking.push(`周模板仍有治疗次数未能安排：${unassigned.join("、")}。请检查机器类型、特殊区数量和患者倾向。`);
  }

  if (!blocking.length) {
    const hdfResult = buildMonthlyHdfOverrides(selectedDate, schedules, specialMachines, regularMachines);
    Object.assign(monthlyHdfOverrides, hdfResult.overrides);
    warnings.push(...hdfResult.warnings);
    blocking.push(...hdfResult.blocking);
  }

  return {
    schedules,
    monthlyHdfOverrides,
    warnings,
    blocking,
    timeAdjustments,
    dayAdjustments,
    monthlyHdfCount: countMonthlyHdfOverrides(monthlyHdfOverrides),
    assignedCount: sessions.length - unassigned.length,
  };
}

function getPatientPlannedDays(patient, patientIndex = 0) {
  const frequency = clampNumber(patient.weeklyTreatmentCount, 1, 6, 3);
  const selected = normalizeDayPreference(patient.preferredDays);
  const planned = [];
  selected.forEach((dayKey) => {
    if (planned.length < frequency && !planned.includes(dayKey)) {
      planned.push(dayKey);
    }
  });

  const pattern = DEMO_DAY_PATTERNS[patientIndex % DEMO_DAY_PATTERNS.length];
  [...pattern, ...WORKING_DAY_KEYS].forEach((dayKey) => {
    if (planned.length < frequency && !planned.includes(dayKey)) {
      planned.push(dayKey);
    }
  });

  return planned.slice(0, frequency);
}

function getPatientPreferredDaysForDisplay(patient) {
  return patient.preferredDays?.length ? patient.preferredDays : getPatientPlannedDays(patient);
}

function getWeeklyCapacityProblems(sessions, specialMachines, regularMachines) {
  const problems = [];
  const weeklySlotsPerMachine = STAFF_SHIFT_KEYS.length * WORKING_DAY_KEYS.length;
  const groups = getCapacityGroups(sessions);

  groups.forEach((group) => {
    if (!group.sessions.length) {
      return;
    }
    const totalCapacity = group.machines.length * weeklySlotsPerMachine;
    if (!group.machines.length) {
      problems.push(`${group.label}需要 ${group.sessions.length} 次/周治疗，但当前没有可用机器。`);
      return;
    }
    if (group.sessions.length > totalCapacity) {
      const needed = Math.ceil(group.sessions.length / weeklySlotsPerMachine);
      problems.push(`${group.label}容量不足：需要 ${group.sessions.length} 次/周，当前 ${group.machines.length} 台机器最多 ${totalCapacity} 次/周，至少需要 ${needed} 台。`);
    }

    MACHINE_TYPES.forEach((type) => {
      const required = group.sessions.filter((session) => normalizeMachineType(session.treatmentType) === type.key).length;
      if (!required) {
        return;
      }
      const capableMachines = group.machines.filter((machineId) => machineSupportsTreatment(machineId, type.key)).length;
      const capacity = capableMachines * weeklySlotsPerMachine;
      if (required > capacity) {
        const needed = Math.ceil(required / weeklySlotsPerMachine);
        problems.push(`${group.label}${type.label}能力不足：需要 ${required} 次/周，当前可承担机器 ${capableMachines} 台，至少需要 ${needed} 台。`);
      }
    });
  });

  return problems;
}

function getCapacityGroups(sessions) {
  return [
    {
      label: "非传染区（普通区与重病区通用）",
      sessions: sessions.filter((session) => !isInfectiousPatient(session.patient)),
      machines: getMachineIds().filter((machineId) => {
        const zone = getMachineZone(machineId);
        return zone === MACHINE_ZONE_NORMAL || zone === MACHINE_ZONE_SEVERE;
      }),
    },
    ...MACHINE_ZONE_INFECTION_FLAGS.map((flag) => ({
      label: `${flag}区`,
      sessions: sessions.filter((session) => normalizeInfectionFlag(session.patient.infectionFlag) === flag),
      machines: getMachineIds().filter((machineId) => [MACHINE_ZONE_INFECTION, flag].includes(getMachineZone(machineId))),
    })),
  ];
}

function assignWeeklyPatientSession(session, schedules, machines, specialMachines, regularMachines, assignedDaysByPatient) {
  const patient = session.patient;
  const pool = getEligibleMachinePoolForTreatment(patient, session.treatmentType, specialMachines, regularMachines);
  const alreadyAssignedDays = assignedDaysByPatient.get(patient.id) || new Set();
  const primaryDays = WORKING_DAY_KEYS.includes(session.originalDay) && !alreadyAssignedDays.has(session.originalDay) ? [session.originalDay] : [];
  const fallbackDays = getWorkingDaysByCurrentLoad(schedules, machines)
    .filter((dayKey) => !primaryDays.includes(dayKey) && !alreadyAssignedDays.has(dayKey));
  const dayChoices = [...primaryDays, ...fallbackDays];

  for (const dayKey of dayChoices) {
    const shiftChoices = patient.preferredShift ? [patient.preferredShift, ...STAFF_SHIFT_KEYS.filter((shift) => shift !== patient.preferredShift)] : getShiftsByCurrentLoad(schedules[dayKey], machines);
    for (const shift of shiftChoices) {
      const machineId = findBestMachineForPatient(patient, pool, shift, schedules[dayKey]);
      if (machineId) {
        const notes = [];
        if (dayKey !== session.originalDay) {
          notes.push(`原日期：${getWeekDayLabel(session.originalDay)}`);
        }
        if (patient.preferredShift && shift !== patient.preferredShift) {
          notes.push(`原倾向：${SHIFT_LABELS[patient.preferredShift]}`);
        }
        setScheduleSlot({ weekly: schedules[dayKey] }, "weekly", machineId, shift, {
          patientId: patient.id,
          treatmentType: session.treatmentType,
          note: notes.join("；"),
          updatedAt: new Date().toISOString(),
        });
        return { day: dayKey, shift, machineId };
      }
    }
  }

  return null;
}

function buildMonthlyHdfOverrides(selectedDate, weeklySchedules, specialMachines, regularMachines) {
  const overrides = {};
  const warnings = [];
  const blocking = [];
  const monthDates = getWorkingDatesInMonthlyCycle(parseDateInput(selectedDate));
  const activePatients = state.patients.filter((patient) => patient.status === "active" && clampNumber(patient.monthlyHdfCount, 0, 4, 1) > 0);

  activePatients.forEach((patient, patientIndex) => {
    const monthlyCount = clampNumber(patient.monthlyHdfCount, 0, 4, 1);
    const hdfPool = getEligibleMachinePoolForTreatment(patient, "hemofiltration", specialMachines, regularMachines);
    if (!hdfPool.length) {
      blocking.push(`${patient.name} 需要每月血滤，但没有匹配的血滤机器（${getRequiredPatientZoneLabel(patient)}）。`);
      return;
    }

    const weeklyLocations = getWeeklyLocationsForPatient(weeklySchedules, patient.id);
    if (!weeklyLocations.length) {
      blocking.push(`${patient.name} 没有可替换为血滤的常规周模板位置。`);
      return;
    }

    const usedDates = new Set();
    for (let index = 0; index < monthlyCount; index += 1) {
      const assignment = assignMonthlyHdfSession(patient, patientIndex + index, weeklyLocations, monthDates, weeklySchedules, overrides, hdfPool, usedDates);
      if (!assignment) {
        blocking.push(`${patient.name} 第 ${index + 1} 次月血滤未能安排。`);
      }
    }
  });

  if (Object.keys(overrides).length) {
    warnings.push(`已为未来 4 周月度周期生成 ${countMonthlyHdfOverrides(overrides)} 次血滤日期调整；这些调整不会进入每周重复模板。`);
  }

  return { overrides, warnings, blocking };
}

function assignMonthlyHdfSession(patient, rotateBy, weeklyLocations, monthDates, weeklySchedules, overrides, hdfPool, usedDates) {
  const candidates = getMonthlyHdfCandidates(weeklyLocations, monthDates, rotateBy)
    .filter((candidate) => !usedDates.has(candidate.date));

  for (const candidate of candidates) {
    const override = overrides[candidate.date] || {};
    const weeklyDay = weeklySchedules[candidate.location.day] || {};
    const effectiveDay = mergeScheduleDays(weeklyDay, override);
    const shiftChoices = [candidate.location.shift, ...STAFF_SHIFT_KEYS.filter((shift) => shift !== candidate.location.shift)];
    for (const shift of shiftChoices) {
      for (const machineId of sortHdfCandidates(hdfPool, shift, effectiveDay)) {
        const hdfSlot = effectiveDay[machineId]?.[shift];
        const hdfAssignment = createMonthlyHdfOverrideForSlot(patient, candidate, machineId, shift, hdfSlot, override);
        if (hdfAssignment) {
          overrides[candidate.date] = override;
          usedDates.add(candidate.date);
          return hdfAssignment;
        }
      }
    }
  }

  return null;
}

function sortHdfCandidates(machinePool, shift, daySchedule) {
  const nurseGroups = getNurseGroupsForShift(daySchedule, shift);
  const groupLoads = new Map(nurseGroups.map((group, index) => [index, countGroupAssignments(group.machines, shift, daySchedule)]));
  return [...machinePool].sort((a, b) => {
    const occupiedDiff = Number(Boolean(daySchedule[a]?.[shift]?.patientId)) - Number(Boolean(daySchedule[b]?.[shift]?.patientId));
    const groupDiff = (groupLoads.get(getMachineGroupIndex(a, nurseGroups)) || 0) - (groupLoads.get(getMachineGroupIndex(b, nurseGroups)) || 0);
    return occupiedDiff || groupDiff || sortMachineIds(a, b);
  });
}

function createMonthlyHdfOverrideForSlot(patient, candidate, machineId, shift, hdfSlot, override) {
  const originalMachineId = candidate.location.machineId;
  const originalShift = candidate.location.shift;
  const note = `每月血滤；原${getWeekDayLabel(candidate.location.day)}${SHIFT_LABELS[originalShift]}`;

  if (!hdfSlot?.patientId || hdfSlot.patientId === patient.id) {
    if (machineId !== originalMachineId || shift !== originalShift) {
      setScheduleSlot({ monthly: override }, "monthly", originalMachineId, originalShift, {
        removed: true,
        updatedAt: new Date().toISOString(),
      });
    }
    setScheduleSlot({ monthly: override }, "monthly", machineId, shift, {
      patientId: patient.id,
      treatmentType: "hemofiltration",
      note,
      updatedAt: new Date().toISOString(),
    });
    return { date: candidate.date, machineId, shift };
  }

  const displacedPatient = findPatient(hdfSlot.patientId);
  const displacedTreatmentType = normalizeMachineType(hdfSlot.treatmentType || displacedPatient?.treatmentType);
  if (!displacedPatient || !patientFitsMachineForTreatment(displacedPatient, displacedTreatmentType, originalMachineId)) {
    return null;
  }

  setScheduleSlot({ monthly: override }, "monthly", originalMachineId, originalShift, {
    patientId: displacedPatient.id,
    treatmentType: displacedTreatmentType,
    note: `与${patient.name}月血滤对调`,
    updatedAt: new Date().toISOString(),
  });
  setScheduleSlot({ monthly: override }, "monthly", machineId, shift, {
    patientId: patient.id,
    treatmentType: "hemofiltration",
    note,
    updatedAt: new Date().toISOString(),
  });
  return { date: candidate.date, machineId, shift };
}

function getMonthlyHdfCandidates(weeklyLocations, monthDates, rotateBy) {
  const candidates = [];
  weeklyLocations.forEach((location) => {
    monthDates
      .filter((dateValue) => getWeekdayKey(dateValue) === location.day)
      .forEach((date) => candidates.push({ date, location }));
  });
  if (!candidates.length) {
    return [];
  }
  const offset = rotateBy % candidates.length;
  return [...candidates.slice(offset), ...candidates.slice(0, offset)];
}

function getWeeklyLocationsForPatient(weeklySchedules, patientId) {
  const locations = [];
  WORKING_DAY_KEYS.forEach((dayKey) => {
    Object.entries(weeklySchedules[dayKey] || {}).forEach(([machineId, item]) => {
      STAFF_SHIFT_KEYS.forEach((shift) => {
        if (item?.[shift]?.patientId === patientId) {
          locations.push({ day: dayKey, machineId, shift });
        }
      });
    });
  });
  return locations;
}

function getWorkingDatesInMonthlyCycle(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = addDays(start, 27);
  const dates = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const value = formatDateInput(cursor);
    if (WORKING_DAY_KEYS.includes(getWeekdayKey(value))) {
      dates.push(value);
    }
  }
  return dates;
}

function countMonthlyHdfOverrides(overrides) {
  return Object.values(overrides || {}).reduce((count, daySchedule) => {
    return (
      count +
      Object.values(daySchedule || {}).reduce((dayCount, item) => {
        return dayCount + STAFF_SHIFT_KEYS.filter((shift) => item?.[shift]?.treatmentType === "hemofiltration" && item?.[shift]?.patientId).length;
      }, 0)
    );
  }, 0);
}

function getWorkingDaysByCurrentLoad(schedules, machines) {
  return [...WORKING_DAY_KEYS].sort((left, right) => {
    const leftLoad = countAssigned(schedules[left] || {}, machines, "morning") + countAssigned(schedules[left] || {}, machines, "afternoon");
    const rightLoad = countAssigned(schedules[right] || {}, machines, "morning") + countAssigned(schedules[right] || {}, machines, "afternoon");
    const loadDiff = leftLoad + getDaySchedulingPenalty(left) - (rightLoad + getDaySchedulingPenalty(right));
    return loadDiff || getDaySortValue(left) - getDaySortValue(right);
  });
}

function getDaySortValue(dayKey) {
  const index = WORKING_DAY_KEYS.indexOf(String(dayKey));
  return index >= 0 ? index : WORKING_DAY_KEYS.length;
}

function getDaySchedulingPenalty(dayKey) {
  if (String(dayKey) === "5") {
    return 1;
  }
  if (String(dayKey) === "6") {
    return 2;
  }
  return 0;
}

function buildAutoWeeklyStaffSchedules(weeklySchedules = state.weeklySchedules) {
  const maxNurseCount = getRequiredNurseCountForWeeklySchedules(weeklySchedules);
  const schedules = {};
  const warnings = [];
  const blocking = [];
  const doctors = state.staffMembers.filter((staff) => staff.role === "doctor" && staff.status === "active");
  const nurses = state.staffMembers.filter((staff) => staff.role === "nurse" && staff.status === "active");
  const minimumNursesPerShift = maxNurseCount + BACKUP_NURSE_COUNT;

  if (doctors.length < DOCTOR_COUNT) {
    blocking.push(`在岗医生不足：每班需要 ${DOCTOR_COUNT} 名，当前只有 ${doctors.length} 名。`);
  }
  if (nurses.length < minimumNursesPerShift) {
    blocking.push(`在岗护士不足：每班需要 ${minimumNursesPerShift} 名（含后备），当前只有 ${nurses.length} 名。`);
  }
  if (blocking.length) {
    return { schedules, warnings, blocking, nurseShiftCount: 0 };
  }

  const assignmentCounts = new Map([...doctors, ...nurses].map((staff) => [staff.id, 0]));
  let nurseShiftCount = 0;
  WORKING_DAY_KEYS.forEach((dayKey) => {
    const nurseCount = getRequiredNurseCountForDay(weeklySchedules[dayKey] || {});
    nurseShiftCount += nurseCount * STAFF_SHIFT_KEYS.length;
    const schedule = createEmptyStaffScheduleDay(nurseCount);
    const usedToday = new Set();
    STAFF_SHIFT_KEYS.forEach((shift) => {
      const selectedDoctors = chooseStaffForShiftBalanced(doctors, DOCTOR_COUNT, shift, usedToday, assignmentCounts);
      selectedDoctors.forEach((staff) => markStaffAssigned(staff.id, usedToday, assignmentCounts));
      schedule[shift].doctors = selectedDoctors.map((staff) => staff.id);

      const selectedNurses = chooseStaffForShiftBalanced(nurses, nurseCount, shift, usedToday, assignmentCounts);
      selectedNurses.forEach((staff) => markStaffAssigned(staff.id, usedToday, assignmentCounts));
      schedule[shift].nurses = selectedNurses.map((staff) => staff.id);

      const usedThisShift = new Set([...schedule[shift].doctors, ...schedule[shift].nurses]);
      const backup = chooseStaffForShiftBalanced(
        nurses.filter((staff) => !usedThisShift.has(staff.id)),
        BACKUP_NURSE_COUNT,
        shift,
        usedToday,
        assignmentCounts,
      )[0];
      if (backup) {
        schedule[shift].backupNurse = backup.id;
        markStaffAssigned(backup.id, usedToday, assignmentCounts);
      }
    });

    const repeatedStaff = getRepeatedStaffInDay(schedule);
    if (repeatedStaff.length) {
      warnings.push(`${getWeekDayLabel(dayKey)} 为保证岗位数量，以下医护存在跨班安排：${repeatedStaff.map(getStaffDisplayName).join("、")}。`);
    }
    schedules[dayKey] = schedule;
  });

  return { schedules, warnings, blocking, nurseShiftCount };
}

function getRequiredNurseCountForWeeklySchedules(weeklySchedules = state.weeklySchedules) {
  return Math.max(1, ...WORKING_DAY_KEYS.map((dayKey) => getRequiredNurseCountForDay(weeklySchedules[dayKey] || {})));
}

function chooseStaffForShiftBalanced(staffList, count, shift, usedToday, assignmentCounts) {
  const compare = (a, b) =>
    scoreShiftPreference(b, shift) - scoreShiftPreference(a, shift) ||
    (assignmentCounts.get(a.id) || 0) - (assignmentCounts.get(b.id) || 0) ||
    sortStaffMembers(a, b);
  const preferred = staffList.filter((staff) => !usedToday.has(staff.id)).sort(compare);
  const fallback = staffList.filter((staff) => usedToday.has(staff.id)).sort(compare);
  return [...preferred, ...fallback].slice(0, count);
}

function markStaffAssigned(staffId, usedToday, assignmentCounts) {
  usedToday.add(staffId);
  assignmentCounts.set(staffId, (assignmentCounts.get(staffId) || 0) + 1);
}

function buildAutoStaffSchedule(date) {
  const nurseCount = getRequiredNurseCountForDate(date);
  const schedule = createEmptyStaffScheduleDay(nurseCount);
  const warnings = [];
  const blocking = [];
  const doctors = state.staffMembers.filter((staff) => staff.role === "doctor" && staff.status === "active");
  const nurses = state.staffMembers.filter((staff) => staff.role === "nurse" && staff.status === "active");
  const minimumNursesPerShift = nurseCount + BACKUP_NURSE_COUNT;

  if (doctors.length < DOCTOR_COUNT) {
    blocking.push(`在岗医生不足：每班需要 ${DOCTOR_COUNT} 名，当前只有 ${doctors.length} 名。`);
  }
  if (nurses.length < minimumNursesPerShift) {
    blocking.push(`在岗护士不足：每班需要 ${minimumNursesPerShift} 名（含后备），当前只有 ${nurses.length} 名。`);
  }
  if (blocking.length) {
    return { schedule, warnings, blocking };
  }

  const usedToday = new Set();
  STAFF_SHIFT_KEYS.forEach((shift) => {
    const selectedDoctors = chooseStaffForShift(doctors, DOCTOR_COUNT, shift, usedToday);
    selectedDoctors.forEach((staff) => usedToday.add(staff.id));
    schedule[shift].doctors = selectedDoctors.map((staff) => staff.id);

    const selectedNurses = chooseStaffForShift(nurses, nurseCount, shift, usedToday);
    selectedNurses.forEach((staff) => usedToday.add(staff.id));
    schedule[shift].nurses = selectedNurses.map((staff) => staff.id);

    const usedThisShift = new Set([...schedule[shift].doctors, ...schedule[shift].nurses]);
    const backup = chooseStaffForShift(
      nurses.filter((staff) => !usedThisShift.has(staff.id)),
      BACKUP_NURSE_COUNT,
      shift,
      usedToday,
    )[0];
    if (backup) {
      schedule[shift].backupNurse = backup.id;
      usedToday.add(backup.id);
    }
  });

  const filledDoctors = STAFF_SHIFT_KEYS.reduce((count, shift) => count + schedule[shift].doctors.filter(Boolean).length, 0);
  const filledNurses = STAFF_SHIFT_KEYS.reduce((count, shift) => count + schedule[shift].nurses.filter(Boolean).length + (schedule[shift].backupNurse ? 1 : 0), 0);
  const repeatedStaff = getRepeatedStaffInDay(schedule);
  if (filledDoctors < DOCTOR_COUNT * STAFF_SHIFT_KEYS.length) {
    warnings.push("医生人数不足以完全避免跨班重复，系统已优先按倾向和均衡原则安排。");
  }
  if (filledNurses < minimumNursesPerShift * STAFF_SHIFT_KEYS.length) {
    warnings.push("护士人数不足以完全避免跨班重复，系统已优先按倾向和均衡原则安排。");
  }
  if (repeatedStaff.length) {
    warnings.push(`为保证岗位数量，以下医护存在跨班安排：${repeatedStaff.map(getStaffDisplayName).join("、")}。`);
  }

  return { schedule, warnings, blocking };
}

function getRepeatedStaffInDay(staffSchedule) {
  const counts = new Map();
  STAFF_SHIFT_KEYS.forEach((shift) => {
    const shiftSchedule = staffSchedule[shift];
    [...shiftSchedule.doctors, ...shiftSchedule.nurses, shiftSchedule.backupNurse].filter(Boolean).forEach((staffId) => {
      counts.set(staffId, (counts.get(staffId) || 0) + 1);
    });
  });
  return [...counts.entries()].filter(([, count]) => count > 1).map(([staffId]) => staffId);
}

function chooseStaffForShift(staffList, count, shift, usedToday) {
  const preferred = staffList
    .filter((staff) => !usedToday.has(staff.id))
    .sort((a, b) => scoreShiftPreference(b, shift) - scoreShiftPreference(a, shift) || sortStaffMembers(a, b));
  const fallback = staffList
    .filter((staff) => usedToday.has(staff.id))
    .sort((a, b) => scoreShiftPreference(b, shift) - scoreShiftPreference(a, shift) || sortStaffMembers(a, b));
  return [...preferred, ...fallback].slice(0, count);
}

function sortAutoPatients(a, b) {
  const infectionScore = Number(isInfectiousPatient(b)) - Number(isInfectiousPatient(a));
  if (infectionScore) {
    return infectionScore;
  }
  const severeScore = Number(isSeverePatient(b)) - Number(isSeverePatient(a));
  if (severeScore) {
    return severeScore;
  }
  const preferenceScore = Number(Boolean(b.preferredShift)) - Number(Boolean(a.preferredShift));
  if (preferenceScore) {
    return preferenceScore;
  }
  const weeklyScore = clampNumber(b.weeklyTreatmentCount, 1, 6, 3) - clampNumber(a.weeklyTreatmentCount, 1, 6, 3);
  if (weeklyScore) {
    return weeklyScore;
  }
  const hdfScore = clampNumber(b.monthlyHdfCount, 0, 4, 1) - clampNumber(a.monthlyHdfCount, 0, 4, 1);
  if (hdfScore) {
    return hdfScore;
  }
  const treatmentScore = normalizeMachineType(a.treatmentType).localeCompare(normalizeMachineType(b.treatmentType), "zh-CN");
  if (treatmentScore) {
    return treatmentScore;
  }
  return sortPatients(a, b);
}

function isInfectiousPatient(patient) {
  return Boolean(normalizeInfectionFlag(patient?.infectionFlag));
}

function isSeverePatient(patient) {
  return normalizeCareLevel(patient?.careLevel) === SEVERE_CARE_LEVEL;
}

function getPatientCareLabel(patient) {
  return isSeverePatient(patient) ? "严重组" : "普通组";
}

function getRequiredPatientZoneLabel(patient) {
  const infectionFlag = normalizeInfectionFlag(patient?.infectionFlag);
  if (infectionFlag) {
    return `${infectionFlag}区`;
  }
  return isSeverePatient(patient) ? "重病区" : "普通区";
}

function getEligibleMachinePool(patient, specialMachines, regularMachines) {
  return getEligibleMachinePoolForTreatment(patient, patient.treatmentType, specialMachines, regularMachines);
}

function getEligibleMachinePoolForTreatment(patient, treatmentType, specialMachines, regularMachines) {
  const normalizedTreatmentType = normalizeMachineType(treatmentType);
  return getMachineIds().filter((machineId) => patientFitsMachineForTreatment(patient, normalizedTreatmentType, machineId));
}

function machineSupportsTreatment(machineId, treatmentType) {
  const machineType = getMachineType(machineId);
  const normalizedTreatmentType = normalizeMachineType(treatmentType);
  if (normalizedTreatmentType === "hemodialysis") {
    return machineType === "hemodialysis" || machineType === "hemofiltration";
  }
  return machineType === normalizedTreatmentType;
}

function patientFitsMachine(patient, machineId) {
  if (!patient) {
    return false;
  }
  return patientFitsMachineForTreatment(patient, patient.treatmentType, machineId);
}

function patientFitsMachineForTreatment(patient, treatmentType, machineId) {
  if (!patient) {
    return false;
  }
  return patientZoneMatchesMachine(patient, machineId) && machineSupportsTreatment(machineId, treatmentType);
}

function patientFitsMachineSettings(patient, machineType, machineZone) {
  return patientZoneMatchesMachineZone(patient, machineZone) && machineTypeSupportsTreatment(machineType, patient.treatmentType);
}

function patientZoneMatchesMachine(patient, machineId) {
  return patientZoneMatchesMachineZone(patient, getMachineZone(machineId));
}

function patientZoneMatchesMachineZone(patient, machineZone) {
  const zone = normalizeMachineZone(machineZone);
  const infectionFlag = normalizeInfectionFlag(patient?.infectionFlag);
  if (infectionFlag) {
    return zone === MACHINE_ZONE_INFECTION || zone === infectionFlag;
  }

  // 普通区与重病区均属于非传染区，可互相调配机器；传染病机器始终隔离。
  return zone === MACHINE_ZONE_NORMAL || zone === MACHINE_ZONE_SEVERE;
}

function machineTypeSupportsTreatment(machineType, treatmentType) {
  const normalizedMachineType = normalizeMachineType(machineType);
  const normalizedTreatmentType = normalizeMachineType(treatmentType);
  if (normalizedTreatmentType === "hemodialysis") {
    return normalizedMachineType === "hemodialysis" || normalizedMachineType === "hemofiltration";
  }
  return normalizedMachineType === normalizedTreatmentType;
}

function getAssignmentCompatibilityIssues(machineId, nextType, nextZone) {
  const issues = [];
  const seen = new Set();
  const addIssue = (label, shift, patient) => {
    const key = `${label}:${shift}:${patient.id}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    const zone = isInfectiousPatient(patient) ? normalizeInfectionFlag(patient.infectionFlag) : getPatientCareLabel(patient);
    issues.push(`${label} ${SHIFT_LABELS[shift]}：${patient.name}（${getPatientTreatmentLabel(patient)}，${zone}）`);
  };
  const scan = (collection, labelForKey) => {
    Object.entries(collection || {}).forEach(([key, daySchedule]) => {
      const item = daySchedule?.[machineId];
      if (!item) {
        return;
      }
      STAFF_SHIFT_KEYS.forEach((shift) => {
        const patient = item[shift]?.patientId ? findPatient(item[shift].patientId) : null;
        if (patient && !patientFitsMachineSettings(patient, nextType, nextZone)) {
          addIssue(labelForKey(key), shift, patient);
        }
      });
    });
  };

  scan(state.weeklySchedules, (key) => `每周${getWeekDayLabel(key)}`);
  scan(state.schedules, (key) => formatDateLabel(key));
  return issues;
}

function getPatientCompatibilityIssues(patient) {
  const issues = [];
  const seen = new Set();
  const addIssue = (label, shift, machineId) => {
    const key = `${label}:${shift}:${machineId}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    issues.push(`${label} ${SHIFT_LABELS[shift]}：${machineId}（${getMachineTypeLabel(machineId)}，${getMachineZoneLabel(machineId)}）`);
  };
  const scan = (collection, labelForKey) => {
    Object.entries(collection || {}).forEach(([key, daySchedule]) => {
      Object.entries(daySchedule || {}).forEach(([machineId, item]) => {
        STAFF_SHIFT_KEYS.forEach((shift) => {
          if (item[shift]?.patientId === patient.id && !patientFitsMachine(patient, machineId)) {
            addIssue(labelForKey(key), shift, machineId);
          }
        });
      });
    });
  };

  scan(state.weeklySchedules, (key) => `每周${getWeekDayLabel(key)}`);
  scan(state.schedules, (key) => formatDateLabel(key));
  return issues;
}

function getShiftsByCurrentLoad(schedule, machines) {
  const daySchedule = getScheduleDay(schedule);
  return [...STAFF_SHIFT_KEYS].sort((left, right) => countAssigned(daySchedule, machines, left) - countAssigned(daySchedule, machines, right));
}

function findBestMachineForPatient(patient, machinePool, shift, schedule) {
  const daySchedule = getScheduleDay(schedule);
  const nurseGroups = getNurseGroupsForShift(daySchedule, shift);
  const groupLoads = new Map(nurseGroups.map((group, index) => [index, countGroupAssignments(group.machines, shift, daySchedule)]));
  const freeMachines = machinePool.filter((machineId) => !daySchedule[machineId]?.[shift]);
  if (!freeMachines.length) {
    return "";
  }

  // 普通区和重病区允许通用，但自动排班仍优先使用对应标识区，容量不足时再跨区。
  const preferredZone = isSeverePatient(patient) ? MACHINE_ZONE_SEVERE : MACHINE_ZONE_NORMAL;
  return freeMachines.sort((a, b) => {
    const zoneDiff = Number(getMachineZone(a) !== preferredZone) - Number(getMachineZone(b) !== preferredZone);
    const groupDiff = (groupLoads.get(getMachineGroupIndex(a, nurseGroups)) || 0) - (groupLoads.get(getMachineGroupIndex(b, nurseGroups)) || 0);
    return zoneDiff || groupDiff || sortMachineIds(a, b);
  })[0];
}

function getScheduleDay(schedule) {
  return schedule?.auto || schedule || {};
}

function countGroupAssignments(machines, shift, daySchedule) {
  return machines.filter((machineId) => daySchedule[machineId]?.[shift]?.patientId).length;
}

function getMachineGroupIndex(machineId, nurseGroups = getNurseGroups()) {
  return nurseGroups.findIndex((group) => group.machines.includes(machineId));
}

function createFullDayOverride(generatedSchedule, previousEffectiveSchedule) {
  const override = structuredClone(generatedSchedule || {});
  Object.entries(previousEffectiveSchedule || {}).forEach(([machineId, item]) => {
    ["morning", "afternoon"].forEach((shift) => {
      if (item[shift]?.patientId && !override[machineId]?.[shift]) {
        if (!override[machineId]) {
          override[machineId] = {};
        }
        override[machineId][shift] = {
          removed: true,
          updatedAt: new Date().toISOString(),
        };
      }
    });
  });
  return override;
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
  const message = "确定全部重置吗？这会清空本地保存的患者资料、患者排班、医护排班、机器类型和特殊区机器设置。";
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

function mergeDateOverrideDays(currentOverride = {}, nextOverride = {}) {
  const result = structuredClone(currentOverride || {});
  Object.entries(nextOverride || {}).forEach(([machineId, item]) => {
    if (!result[machineId]) {
      result[machineId] = {};
    }
    STAFF_SHIFT_KEYS.forEach((shift) => {
      if (item?.[shift]) {
        result[machineId][shift] = structuredClone(item[shift]);
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
  return getMachineSlots(settings)
    .filter((slot) => slot.active)
    .map((slot) => slot.machineId);
}

function getMachineRows(settings = state.settings) {
  return chunk(getMachineSlots(settings), settings.machinesPerRow);
}

function getMachineSlots(settings = state.settings) {
  const inactiveSlots = new Set(normalizeInactiveSlots(settings.inactiveSlots, settings));
  const slots = [];
  for (let row = 0; row < settings.rowCount; row += 1) {
    for (let column = 0; column < settings.machinesPerRow; column += 1) {
      const slotKey = getSlotKey(row, column);
      slots.push({
        slotKey,
        row,
        column,
        active: !inactiveSlots.has(slotKey),
        machineId: "",
      });
    }
  }

  let nextId = 1;
  for (let row = 0; row < settings.rowCount; row += 1) {
    const columns =
      settings.numberingStartSide === "right"
        ? [...Array(settings.machinesPerRow).keys()].reverse()
        : [...Array(settings.machinesPerRow).keys()];
    columns.forEach((column) => {
      const slot = slots.find((item) => item.row === row && item.column === column);
      if (slot?.active) {
        slot.machineId = String(nextId);
        nextId += 1;
      }
    });
  }

  return slots;
}

function getSpecialMachines() {
  return getInfectionMachineIds(state.settings);
}

function getInfectionMachineIds(settings = state.settings) {
  return getMachineIds(settings).filter((machineId) => isInfectionMachineZone(getMachineZone(machineId, settings))).sort(sortMachineIds);
}

function getSevereMachines(settings = state.settings) {
  return getMachineIds(settings).filter((machineId) => getMachineZone(machineId, settings) === MACHINE_ZONE_SEVERE).sort(sortMachineIds);
}

function getMachineType(machineId) {
  return normalizeMachineType(state.settings.machineTypes?.[machineId]);
}

function getMachineTypeLabel(machineId) {
  return MACHINE_TYPE_LABELS[getMachineType(machineId)] || MACHINE_TYPE_LABELS[DEFAULT_MACHINE_TYPE];
}

function getMachineTypeClass(type) {
  return `machine-type-${normalizeMachineType(type)}`;
}

function getMachineZone(machineId, settings = state.settings) {
  return normalizeMachineZone(settings.machineZones?.[machineId]);
}

function getMachineZoneLabel(machineId, settings = state.settings) {
  const zone = getMachineZone(machineId, settings);
  if (zone === MACHINE_ZONE_INFECTION) {
    return settings.specialZoneName || "通用传染区";
  }
  return MACHINE_ZONES.find((item) => item.key === zone)?.label || "普通区";
}

function getMachineZoneClass(zone) {
  return `machine-zone-${normalizeMachineZone(zone).toLowerCase()}`;
}

function isInfectionMachineZone(zone) {
  const normalizedZone = normalizeMachineZone(zone);
  return normalizedZone === MACHINE_ZONE_INFECTION || MACHINE_ZONE_INFECTION_FLAGS.includes(normalizedZone);
}

function getMachineTypeCount(type) {
  const normalizedType = normalizeMachineType(type);
  return getMachineIds().filter((machineId) => getMachineType(machineId) === normalizedType).length;
}

function isSpecialMachine(machineId) {
  return isInfectionMachineZone(getMachineZone(machineId));
}

function setMachineType(machineId, type) {
  const validMachines = new Set(getMachineIds());
  if (!validMachines.has(machineId)) {
    showToast("机器编号不在当前布局中");
    return;
  }

  const machineType = normalizeMachineType(type);
  const issues = getAssignmentCompatibilityIssues(machineId, machineType, getMachineZone(machineId));
  if (issues.length) {
    window.alert(`不能修改 ${machineId} 的机器类型。以下现有排班会不匹配，请先移动或清空：\n\n${issues.slice(0, 12).map((item) => `- ${item}`).join("\n")}`);
    return;
  }

  const machineTypes = { ...(state.settings.machineTypes || {}) };
  if (machineType === DEFAULT_MACHINE_TYPE) {
    delete machineTypes[machineId];
  } else {
    machineTypes[machineId] = machineType;
  }
  state.settings.machineTypes = normalizeMachineTypeMap(machineTypes, validMachines);
  saveState();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderLayoutPreviewFromForm();
  showToast(`${machineId} 已设为${MACHINE_TYPE_LABELS[machineType]}`);
}

function setMachineZone(machineId, zone) {
  const validMachines = new Set(getMachineIds());
  if (!validMachines.has(machineId)) {
    showToast("机器编号不在当前布局中");
    return;
  }

  const machineZone = normalizeMachineZone(zone);
  const issues = getAssignmentCompatibilityIssues(machineId, getMachineType(machineId), machineZone);
  if (issues.length) {
    window.alert(`不能修改 ${machineId} 的机器分区。以下现有排班会不匹配，请先移动或清空：\n\n${issues.slice(0, 12).map((item) => `- ${item}`).join("\n")}`);
    return;
  }

  const machineZones = { ...(state.settings.machineZones || {}) };
  if (machineZone === MACHINE_ZONE_NORMAL) {
    delete machineZones[machineId];
  } else {
    machineZones[machineId] = machineZone;
  }
  state.settings.machineZones = normalizeMachineZoneMap(machineZones, validMachines);
  state.settings.specialMachines = getInfectionMachineIds(state.settings);
  saveState();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderLayoutPreviewFromForm();
  showToast(`${machineId} 已设为${getMachineZoneLabel(machineId)}`);
}

function toggleInactiveSlot(slotKey) {
  const validSlots = new Set(getAllSlotKeys());
  if (!validSlots.has(slotKey)) {
    showToast("机位不在当前布局中");
    return;
  }
  if (hasAnyMachineAssignments()) {
    window.alert("已有患者排班时不能删除或恢复机位。因为机位变化会让机器重新编号，请先清空相关患者排班后再调整布局。");
    return;
  }

  const inactiveSlots = new Set(normalizeInactiveSlots(state.settings.inactiveSlots, state.settings));
  const isRemoving = !inactiveSlots.has(slotKey);
  if (isRemoving && getMachineIds().length <= 1) {
    showToast("至少保留 1 台机器");
    return;
  }

  const oldAttributes = getMachineAttributesBySlot(getMachineSlots());
  if (isRemoving) {
    inactiveSlots.add(slotKey);
  } else {
    inactiveSlots.delete(slotKey);
  }

  const nextSettings = {
    ...state.settings,
    inactiveSlots: normalizeInactiveSlots([...inactiveSlots], state.settings),
  };
  const nextSlots = getMachineSlots(nextSettings);
  state.settings.inactiveSlots = nextSettings.inactiveSlots;
  applyMachineAttributesBySlot(oldAttributes, nextSlots);
  saveState();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderLayoutPreviewFromForm();
  showToast(isRemoving ? "机位已删除，机器已重新编号" : "机位已恢复，机器已重新编号");
}

function getMachineAttributesBySlot(slots) {
  return new Map(
    slots
      .filter((slot) => slot.active)
      .map((slot) => [
        slot.slotKey,
        {
          type: getMachineType(slot.machineId),
          zone: getMachineZone(slot.machineId),
          special: isSpecialMachine(slot.machineId),
        },
      ]),
  );
}

function applyMachineAttributesBySlot(attributes, nextSlots) {
  const machineTypes = {};
  const machineZones = {};
  const specialMachines = [];
  nextSlots.forEach((slot) => {
    if (!slot.active) {
      return;
    }
    const attribute = attributes.get(slot.slotKey);
    const type = normalizeMachineType(attribute?.type);
    if (type !== DEFAULT_MACHINE_TYPE) {
      machineTypes[slot.machineId] = type;
    }
    const zone = normalizeMachineZone(attribute?.zone || (attribute?.special ? MACHINE_ZONE_INFECTION : MACHINE_ZONE_NORMAL));
    if (zone !== MACHINE_ZONE_NORMAL) {
      machineZones[slot.machineId] = zone;
    }
    if (isInfectionMachineZone(zone)) {
      specialMachines.push(slot.machineId);
    }
  });
  const validMachines = new Set(nextSlots.filter((slot) => slot.active).map((slot) => slot.machineId));
  state.settings.machineTypes = normalizeMachineTypeMap(machineTypes, validMachines);
  state.settings.machineZones = normalizeMachineZoneMap(machineZones, validMachines);
  state.settings.specialMachines = normalizeMachineIdList(specialMachines, validMachines);
}

function toggleSpecialMachine(machineId) {
  const validMachines = new Set(getMachineIds());
  if (!validMachines.has(machineId)) {
    showToast("机器编号不在当前布局中");
    return;
  }

  setMachineZone(machineId, isSpecialMachine(machineId) ? MACHINE_ZONE_NORMAL : MACHINE_ZONE_INFECTION);
  return;

  const machines = new Set(getSpecialMachines());
  const nextIsSpecial = !machines.has(machineId);
  const issues = getAssignmentCompatibilityIssues(machineId, getMachineType(machineId), nextIsSpecial ? MACHINE_ZONE_INFECTION : MACHINE_ZONE_NORMAL);
  if (issues.length) {
    window.alert(`不能修改 ${machineId} 的特殊区设置。以下现有排班会不匹配，请先移动或清空：\n\n${issues.slice(0, 12).map((item) => `- ${item}`).join("\n")}`);
    return;
  }

  if (machines.has(machineId)) {
    machines.delete(machineId);
  } else {
    machines.add(machineId);
  }
  state.settings.specialMachines = [...machines].filter((id) => validMachines.has(id)).sort(sortMachineIds);
  saveState();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderLayoutPreviewFromForm();
  showToast(`${machineId} 已${machines.has(machineId) ? "设为" : "取消"}${state.settings.specialZoneName || "特殊区"}`);
}

function isSameMachineLayout(left, right) {
  return (
    Number(left.rowCount) === Number(right.rowCount) &&
    Number(left.machinesPerRow) === Number(right.machinesPerRow) &&
    String(left.numberingStartSide || "left") === String(right.numberingStartSide || "left") &&
    normalizeInactiveSlots(left.inactiveSlots, left).join("|") === normalizeInactiveSlots(right.inactiveSlots, right).join("|")
  );
}

function sortMachineIds(a, b) {
  return a.localeCompare(b, "zh-CN", { numeric: true });
}

function getRequiredNurseCount(settings = state.settings) {
  return Math.max(1, Math.ceil(getMachineIds(settings).length / MACHINES_PER_NURSE));
}

function getNurseGroups(settings = state.settings) {
  return chunk([...getMachineIds(settings)].sort(sortMachineIds), MACHINES_PER_NURSE).map((machines, index) => ({
    index,
    range: `${machines[0]}-${machines[machines.length - 1]}`,
    machines,
    patientCount: 0,
    severeCount: 0,
    capacity: MACHINES_PER_NURSE,
  }));
}

function getRequiredNurseCountForDate(date) {
  return Math.max(getNurseGroupProfileForDay(getEffectiveScheduleForDate(date)).count, getExistingStaffNurseSlotCount(date), 1);
}

function getRequiredNurseCountForDay(daySchedule, settings = state.settings) {
  return Math.max(1, getNurseGroupProfileForDay(daySchedule, settings).count);
}

function getNurseGroupProfileForDay(daySchedule = {}, settings = state.settings, targetCount = 0) {
  const shiftGroups = {};
  STAFF_SHIFT_KEYS.forEach((shift) => {
    shiftGroups[shift] = getNurseGroupsForShift(daySchedule, shift, settings);
  });
  const count = Math.max(targetCount, 1, ...STAFF_SHIFT_KEYS.map((shift) => shiftGroups[shift].length));
  STAFF_SHIFT_KEYS.forEach((shift) => {
    shiftGroups[shift] = padNurseGroups(shiftGroups[shift], count);
  });
  return { shiftGroups, count };
}

function getNurseGroupsForShift(daySchedule = {}, shift, settings = state.settings) {
  const schedule = getScheduleDay(daySchedule);
  const severeMachinePatients = [];
  const otherMachinePatients = [];

  [...getMachineIds(settings)].sort(sortMachineIds).forEach((machineId) => {
    const assignment = schedule[machineId]?.[shift];
    const patient = assignment?.patientId ? findPatient(assignment.patientId) : null;
    if (!patient) {
      return;
    }

    // 护士比例严格按机器所在区域计算：重病区 5 人/护士，其他区域 6 人/护士。
    if (getMachineZone(machineId, settings) === MACHINE_ZONE_SEVERE) {
      severeMachinePatients.push(machineId);
    } else {
      otherMachinePatients.push(machineId);
    }
  });

  const groups = [
    ...buildNurseGroupsForMachines(otherMachinePatients, MACHINES_PER_NURSE, false),
    ...buildNurseGroupsForMachines(severeMachinePatients, SEVERE_PATIENT_NURSE_CAPACITY, true),
  ].sort((left, right) => sortMachineIds(left.machines[0], right.machines[0]));

  return groups.length ? groups.map((group, index) => ({ ...group, index })) : [createEmptyNurseGroup(0)];
}

function buildNurseGroupsForMachines(machineIds, capacity, severeZone) {
  return chunk(machineIds, capacity).map((machines, index) => ({
    index,
    range: formatMachineRangeList(machines),
    machines,
    patientCount: machines.length,
    severeCount: severeZone ? machines.length : 0,
    capacity,
    severeZone,
  }));
}

function formatMachineRangeList(machineIds) {
  const machines = [...machineIds].sort(sortMachineIds);
  if (!machines.length) {
    return "备用责任区";
  }

  const ranges = [];
  let start = machines[0];
  let previous = machines[0];
  for (let index = 1; index < machines.length; index += 1) {
    const current = machines[index];
    if (Number(current) === Number(previous) + 1) {
      previous = current;
      continue;
    }
    ranges.push(start === previous ? String(start) : `${start}-${previous}`);
    start = current;
    previous = current;
  }
  ranges.push(start === previous ? String(start) : `${start}-${previous}`);
  return ranges.join("、");
}

function createNurseGroupDraft() {
  return { machines: [], patientCount: 0, severeCount: 0 };
}

function finalizeNurseGroup(group, index) {
  const capacity = group.severeCount ? SEVERE_PATIENT_NURSE_CAPACITY : MACHINES_PER_NURSE;
  const first = group.machines[0];
  const last = group.machines[group.machines.length - 1];
  return {
    index,
    range: first === last ? String(first) : `${first}-${last}`,
    machines: group.machines,
    patientCount: group.patientCount,
    severeCount: group.severeCount,
    capacity,
  };
}

function createEmptyNurseGroup(index) {
  return {
    index,
    range: "备用责任区",
    machines: [],
    patientCount: 0,
    severeCount: 0,
    capacity: MACHINES_PER_NURSE,
    empty: true,
  };
}

function padNurseGroups(groups, count) {
  const result = [...groups];
  while (result.length < count) {
    result.push(createEmptyNurseGroup(result.length));
  }
  return result.map((group, index) => ({ ...group, index }));
}

function formatNurseGroupHint(group) {
  if (group.empty) {
    return group.range;
  }
  const level = group.severeZone ? "重病区" : "其他区";
  return `${group.range} · ${group.patientCount}/${group.capacity} · ${level}`;
}

function getExistingStaffNurseSlotCount(date) {
  const weekdayKey = getWeekdayKey(date);
  const counts = [];
  [state.weeklyStaffSchedules?.[weekdayKey], state.staffSchedules?.[date]].forEach((daySchedule) => {
    STAFF_SHIFT_KEYS.forEach((shift) => {
      counts.push(daySchedule?.[shift]?.nurses?.length || 0);
    });
  });
  return Math.max(0, ...counts);
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

  return [patient.name, patient.dialysisNo, patient.phone, patient.vascularAccess, getPatientTreatmentLabel(patient), getPatientCareLabel(patient), patient.infectionFlag, formatDayPreference(patient.preferredDays)]
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

function getPatientTreatmentLabel(patient) {
  return MACHINE_TYPE_LABELS[normalizeMachineType(patient?.treatmentType)] || MACHINE_TYPE_LABELS[DEFAULT_MACHINE_TYPE];
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
  const plan = `${patient.weeklyTreatmentCount || 3}次/周，血滤${patient.monthlyHdfCount ?? 1}次/月`;
  return [patient.dialysisNo && `透析号 ${patient.dialysisNo}`, getPatientTreatmentLabel(patient), getPatientCareLabel(patient), plan, patient.vascularAccess, patient.infectionFlag]
    .filter(Boolean)
    .join(" · ") || "资料待完善";
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
