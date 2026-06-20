const STORAGE_KEY = "hemodialysis-scheduler-v1";
const UNDO_STORAGE_KEY = `${STORAGE_KEY}-undo-history`;
const APP_VERSION = "2026.06.21.3";
const MAX_UNDO_SNAPSHOTS = 8;
const SHIFT_LABELS = {
  morning: "上午",
  afternoon: "下午",
};
const STAFF_SHIFT_KEYS = ["morning", "afternoon"];
const WORKING_DAY_KEYS = ["1", "2", "3", "4", "5", "6"];
const REST_DAY_KEY = "0";
const DEFAULT_LAYOUT_PRESET_VERSION = "default-60-machine-layout-v1";
const SCHEDULE_PRIORITY_PATIENT = "patient";
const SCHEDULE_PRIORITY_STAFF = "staff";
const SCHEDULE_PRIORITY_SMART = "smart";
const STAFF_WORK_MODE_BALANCED = "balanced";
const STAFF_WORK_MODE_FULL_DAY = "full_day";
const STAFF_WORK_MODE_REST_MAX = "rest_max";
const DOCTOR_COUNT = 2;
const MACHINES_PER_NURSE = 6;
const SEVERE_PATIENT_NURSE_CAPACITY = 5;
const MAX_HEMOFILTRATION_MACHINES_PER_NURSE = 1;
const AUTO_OVERRIDE_SOURCE_MONTHLY_HDF = "auto-monthly-hdf";
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

const NURSE_ZONE_COLORS = Object.freeze([
  { accent: "#176b87", soft: "rgba(23, 107, 135, 0.10)", border: "rgba(23, 107, 135, 0.42)" },
  { accent: "#1f7a4d", soft: "rgba(31, 122, 77, 0.10)", border: "rgba(31, 122, 77, 0.42)" },
  { accent: "#9a6400", soft: "rgba(173, 111, 0, 0.11)", border: "rgba(173, 111, 0, 0.42)" },
  { accent: "#6f42c1", soft: "rgba(111, 66, 193, 0.10)", border: "rgba(111, 66, 193, 0.42)" },
  { accent: "#b42318", soft: "rgba(180, 35, 24, 0.09)", border: "rgba(180, 35, 24, 0.40)" },
  { accent: "#146c5f", soft: "rgba(20, 108, 95, 0.10)", border: "rgba(20, 108, 95, 0.42)" },
  { accent: "#8f5f2a", soft: "rgba(143, 95, 42, 0.10)", border: "rgba(143, 95, 42, 0.42)" },
  { accent: "#4d51a6", soft: "rgba(77, 81, 166, 0.10)", border: "rgba(77, 81, 166, 0.42)" },
  { accent: "#a23b72", soft: "rgba(162, 59, 114, 0.10)", border: "rgba(162, 59, 114, 0.42)" },
  { accent: "#52606d", soft: "rgba(82, 96, 109, 0.10)", border: "rgba(82, 96, 109, 0.40)" },
]);

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
// 每周3次治疗的安全弹性组合：任意相邻两次治疗之间至少完整间隔一天，且跨周也满足该规则。
const SAFE_THRICE_WEEKLY_PATTERNS = Object.freeze([
  Object.freeze(["1", "3", "5"]),
  Object.freeze(["2", "4", "6"]),
  Object.freeze(["1", "3", "6"]),
  Object.freeze(["1", "4", "6"]),
]);
function normalizeSchedulePriority(value) {
  return [SCHEDULE_PRIORITY_PATIENT, SCHEDULE_PRIORITY_STAFF, SCHEDULE_PRIORITY_SMART].includes(value)
    ? value
    : SCHEDULE_PRIORITY_PATIENT;
}

function normalizeStaffWorkMode(value) {
  return [STAFF_WORK_MODE_BALANCED, STAFF_WORK_MODE_FULL_DAY, STAFF_WORK_MODE_REST_MAX].includes(value)
    ? value
    : STAFF_WORK_MODE_BALANCED;
}

function normalizeEvenHdfCount(value, fallback = 2) {
  const safeFallback = [0, 2, 4].includes(Number(fallback)) ? Number(fallback) : 2;
  const count = clampNumber(value, 0, 4, safeFallback);
  if (count <= 0) return 0;
  return count >= 4 ? 4 : 2;
}

function getStaffWorkModeLabel(value = state?.settings?.staffWorkMode) {
  const mode = normalizeStaffWorkMode(value);
  if (mode === STAFF_WORK_MODE_REST_MAX) return "休息最大化";
  return mode === STAFF_WORK_MODE_FULL_DAY ? "整日优先" : "均衡轮班";
}

function isFlexibleDayPriority(priority) {
  return priority === SCHEDULE_PRIORITY_SMART || priority === SCHEDULE_PRIORITY_STAFF;
}

function isCompactResourcePriority(priority) {
  return priority === SCHEDULE_PRIORITY_SMART || priority === SCHEDULE_PRIORITY_STAFF;
}

function getSchedulePriorityLabel(priority = state?.settings?.schedulePriority) {
  const normalizedPriority = normalizeSchedulePriority(priority);
  if (normalizedPriority === SCHEDULE_PRIORITY_SMART) return "灵巧排班";
  if (normalizedPriority === SCHEDULE_PRIORITY_STAFF) return "医护优先";
  return "患者优先";
}

function getSchedulePriorityDescription(priority = state?.settings?.schedulePriority) {
  if (priority === SCHEDULE_PRIORITY_SMART) return "全部每周3次患者使用安全弹性组合，优先减少单人和低负荷护士组";
  if (priority === SCHEDULE_PRIORITY_STAFF) return "尽量让医护少开班、多休息";
  return "尽量保持患者原有透析日程";
}

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
const I18N = window.LANGUAGE_PACKS || {};
const SUPPORTED_LANGUAGE_LIST = window.SUPPORTED_LANGUAGES || [
  { code: "zh-CN", name: "简体中文", dir: "ltr" },
  { code: "en", name: "English", dir: "ltr" },
];
const UI_THEMES = [
  { key: "light", label: "明亮" },
  { key: "eye", label: "护眼绿" },
  { key: "dark", label: "暗黑" },
];

function normalizeLanguageCode(value) {
  const raw = String(value || "").trim();
  if (SUPPORTED_LANGUAGE_LIST.some((item) => item.code === raw)) {
    return raw;
  }
  if (raw === "zh") {
    return "zh-CN";
  }
  return "zh-CN";
}

function normalizeTheme(value) {
  const key = String(value || "").trim();
  return UI_THEMES.some((theme) => theme.key === key) ? key : "light";
}

function getLanguageMeta(code = state?.settings?.language) {
  const normalized = normalizeLanguageCode(code);
  return SUPPORTED_LANGUAGE_LIST.find((item) => item.code === normalized) || SUPPORTED_LANGUAGE_LIST[0];
}

function isChineseLanguage(code = state?.settings?.language) {
  return normalizeLanguageCode(code).startsWith("zh");
}


const DEFAULT_STATE = {
  settings: {
    roomName: "血透室",
    layoutPresetVersion: DEFAULT_LAYOUT_PRESET_VERSION,
    rowCount: 6,
    machinesPerRow: 10,
    numberingStartSide: "left",
    inactiveSlots: [],
    pausedMachines: [],
    schedulePriority: SCHEDULE_PRIORITY_PATIENT,
    staffWorkMode: STAFF_WORK_MODE_BALANCED,
    machineTypes: { ...DEFAULT_LAYOUT_MACHINE_TYPES },
    machineZones: { ...DEFAULT_LAYOUT_MACHINE_ZONES },
    specialMachines: [...DEFAULT_LAYOUT_INFECTION_MACHINES],
    specialZoneName: "传染区",
    language: "zh-CN",
    theme: "light",
  },
  patients: [],
  staffMembers: [],
  weeklySchedules: {},
  schedules: {},
  weeklyStaffSchedules: {},
  staffSchedules: {},
  twoWeekCycle: {
    patientSchedules: { week1: {}, week2: {} },
    staffSchedules: { week1: {}, week2: {} },
    review: null,
    savedAt: "",
    anchorWeekStart: "",
  },
};

let didMigrateStoredLayout = false;
let storageRecoveryMessage = "";
const state = loadState();
const ui = {};
let selectedSlot = null;
let activeCycleWeek = 1;
let pendingTwoWeekPlan = null;
let pendingTwoWeekResolver = null;
let toastTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  const missingElements = bindElements();
  if (missingElements.length) {
    const message = `程序文件不完整，缺少界面元素：${missingElements.join("、")}。请确认 index.html、app.js、styles.css 来自同一版本。`;
    console.error(message);
    window.alert?.(message);
    return;
  }
  bindEvents();
  ensureDate();
  syncActiveCycleWeekFromDate();
  renderAll();
  if (storageRecoveryMessage) {
    showToast(storageRecoveryMessage);
  } else if (didMigrateStoredLayout) {
    showToast(getDynamicMessage("defaultLayoutRestoredDataKept"));
  }
});

function bindElements() {
  const requiredIds = [
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
    "generateTwoWeekPlan",
    "openInsertPatientTop",
    "openShiftSwap",
    "saveTwoWeekTemplate",
    "openTwoWeekReview",
    "runScheduleSelfCheck",
    "undoLastChange",
    "cycleWeekTabs",
    "twoWeekReviewDialog",
    "twoWeekReviewTitle",
    "twoWeekReviewMeta",
    "twoWeekReviewContent",
    "closeTwoWeekReview",
    "printTwoWeekReview",
    "confirmTwoWeekPlan",
    "staffTitle",
    "staffMeta",
    "staffScheduleScope",
    "staffScheduleGrid",
    "boardTitle",
    "boardMeta",
    "machineRows",
    "schedulePriority",
    "schedulePriorityLabel",
    "staffWorkMode",
    "staffWorkModeLabel",
    "shiftSwapDialog",
    "shiftSwapForm",
    "closeShiftSwapDialog",
    "shiftSwapTarget",
    "shiftSwapStartDate",
    "shiftSwapDays",
    "shiftSwapMode",
    "shiftSwapCandidates",
    "shiftSwapCandidateHint",
    "shiftSwapResultDialog",
    "shiftSwapResultTitle",
    "shiftSwapResultMeta",
    "shiftSwapResultContent",
    "closeShiftSwapResult",
    
    "scheduleReviewDialog",
    "scheduleReviewTitle",
    "scheduleReviewMeta",
    "scheduleReviewContent",
    "closeScheduleReview",
    "printScheduleReview",
    "confirmScheduleReview",
    
    
    "printSchedule",
    "exportData",
    "importData",
    "importDataLabel",
    "resetAllData",
    "clearAllCache",
    "openAboutDialog",
    "aboutDialog",
    "aboutForm",
    "aboutDialogTitle",
    "aboutDialogSubtitle",
    "aboutAuthorText",
    "aboutThanksText",
    "aboutContactText",
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
    "patientFixedMachine",
    "patientPreferredDays",
    "forcePreferredDays",
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
    "themeSelect",
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
    "insertPatientDialog",
    "insertPatientForm",
    "closeInsertPatientDialog",
    "toast",
  ];
  requiredIds.forEach((id) => {
    ui[id] = document.getElementById(id);
  });

  ui.tabs = [...document.querySelectorAll(".tab-button")];
  ui.views = {
    schedule: document.getElementById("scheduleView"),
    patients: document.getElementById("patientsView"),
    staff: document.getElementById("staffView"),
    layout: document.getElementById("layoutView"),
  };

  const missing = requiredIds.filter((id) => !ui[id]);
  Object.entries(ui.views).forEach(([name, element]) => {
    if (!element) {
      missing.push(`${name}View`);
    }
  });
  if (ui.tabs.length !== 4) {
    missing.push("主功能标签");
  }
  return [...new Set(missing)];
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
  ui.themeSelect.addEventListener("change", saveTheme);
  ui.patientForm.addEventListener("submit", savePatientFromForm);
  ui.patientTreatmentType.addEventListener("change", syncMonthlyHdfAvailability);
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
  ui.schedulePriority.addEventListener("change", saveSchedulePriority);
  ui.staffWorkMode.addEventListener("change", saveStaffWorkMode);
  ui.generateTwoWeekPlan.addEventListener("click", generateTwoWeekPlan);
  ui.openInsertPatientTop.addEventListener("click", openInsertPatientDialog);
  ui.openShiftSwap.addEventListener("click", openShiftSwapDialog);
  ui.saveTwoWeekTemplate.addEventListener("click", saveTwoWeekCycleTemplate);
  ui.openTwoWeekReview.addEventListener("click", openStoredTwoWeekReview);
  ui.runScheduleSelfCheck.addEventListener("click", runScheduleSelfCheck);
  ui.undoLastChange.addEventListener("click", restoreLastUndoSnapshot);
  ui.closeTwoWeekReview.addEventListener("click", () => closeTwoWeekReview(false));
  ui.confirmTwoWeekPlan.addEventListener("click", () => closeTwoWeekReview(true));
  ui.twoWeekReviewContent.addEventListener("click", handleTwoWeekReviewContentClick);
  ui.printTwoWeekReview.addEventListener("click", printTwoWeekReview);
  ui.twoWeekReviewDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeTwoWeekReview(false);
  });
  ui.cycleWeekTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-week-offset]");
    if (!button) return;
    setDisplayWeekOffset(Number(button.dataset.weekOffset));
  });
  ui.closeScheduleReview.addEventListener("click", () => closeScheduleReview(false));
  ui.confirmScheduleReview.addEventListener("click", () => closeScheduleReview(true));
  ui.printScheduleReview.addEventListener("click", printScheduleReview);
  ui.scheduleReviewDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeScheduleReview(false);
  });
  ui.prevWeek.addEventListener("click", () => setDisplayWeekOffset(0));
  ui.nextWeek.addEventListener("click", () => setDisplayWeekOffset(1));
  ui.todayButton.addEventListener("click", () => setDisplayWeekOffset(0, true));
  ui.printSchedule.addEventListener("click", () => window.print());
  ui.exportData.addEventListener("click", exportData);
  ui.importData.addEventListener("change", importData);
  ui.resetAllData.addEventListener("click", resetAllData);
  ui.clearAllCache.addEventListener("click", clearAllAppCache);
  ui.openAboutDialog.addEventListener("click", () => ui.aboutDialog.showModal());

  ui.assignmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.submitter && event.submitter.value === "cancel") {
      ui.assignmentDialog.close();
      return;
    }
    saveAssignment();
  });
  ui.assignmentForm.querySelectorAll("[data-assignment-cancel]").forEach((button) => {
    button.addEventListener("click", () => ui.assignmentDialog.close());
  });
  ui.removeAssignment.addEventListener("click", removeAssignment);
  ui.insertPatientForm.addEventListener("submit", handleInsertPatientSubmit);
  ui.closeInsertPatientDialog.addEventListener("click", closeInsertPatientDialog);
  ui.insertPatientForm.querySelectorAll("[data-insert-cancel]").forEach((button) => {
    button.addEventListener("click", closeInsertPatientDialog);
  });
  ui.shiftSwapForm.addEventListener("submit", handleShiftSwapSubmit);
  ui.closeShiftSwapDialog.addEventListener("click", closeShiftSwapDialog);
  ui.shiftSwapForm.querySelectorAll("[data-shift-swap-cancel]").forEach((button) => {
    button.addEventListener("click", closeShiftSwapDialog);
  });
  ui.shiftSwapTarget.addEventListener("change", renderShiftSwapCandidates);
  ui.shiftSwapMode.addEventListener("change", syncShiftSwapCandidateHint);
  ui.closeShiftSwapResult.addEventListener("click", () => ui.shiftSwapResultDialog.close());
  ui.shiftSwapResultDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    ui.shiftSwapResultDialog.close();
  });
  getInsertFormField("treatmentType")?.addEventListener("change", syncInsertMonthlyHdfAvailability);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(DEFAULT_STATE);
    }
    const parsed = JSON.parse(raw);
    const migrated = migrateStoredLayoutToCurrentPreset(parsed);
    const normalized = normalizeState(migrated);
    if (didMigrateStoredLayout) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch (error) {
    console.warn("Failed to load saved scheduler data", error);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (storageError) {
      console.warn("Failed to remove corrupted scheduler storage", storageError);
    }
    storageRecoveryMessage = "检测到损坏或无法读取的旧缓存，已恢复默认数据；如有备份可重新导入。";
    return structuredClone(DEFAULT_STATE);
  }
}

function migrateStoredLayoutToCurrentPreset(input) {
  if (!input || typeof input !== "object") {
    return structuredClone(DEFAULT_STATE);
  }

  const existingSettings = input.settings && typeof input.settings === "object" ? input.settings : {};
  if (existingSettings.layoutPresetVersion === DEFAULT_LAYOUT_PRESET_VERSION) {
    return input;
  }

  didMigrateStoredLayout = true;
  return {
    ...input,
    settings: {
      ...existingSettings,
      layoutPresetVersion: DEFAULT_LAYOUT_PRESET_VERSION,
      rowCount: DEFAULT_STATE.settings.rowCount,
      machinesPerRow: DEFAULT_STATE.settings.machinesPerRow,
      numberingStartSide: DEFAULT_STATE.settings.numberingStartSide,
      inactiveSlots: [],
      machineTypes: { ...DEFAULT_LAYOUT_MACHINE_TYPES },
      machineZones: { ...DEFAULT_LAYOUT_MACHINE_ZONES },
      specialMachines: [...DEFAULT_LAYOUT_INFECTION_MACHINES],
      specialZoneName: DEFAULT_STATE.settings.specialZoneName,
    },
  };
}

function normalizeState(input) {
  const settings = {
    ...DEFAULT_STATE.settings,
    ...(input.settings || {}),
  };
  settings.layoutPresetVersion = String(settings.layoutPresetVersion || DEFAULT_LAYOUT_PRESET_VERSION);
  settings.rowCount = clampNumber(settings.rowCount, 1, 20, DEFAULT_STATE.settings.rowCount);
  settings.machinesPerRow = clampNumber(settings.machinesPerRow, 1, 30, DEFAULT_STATE.settings.machinesPerRow);
  settings.roomName = String(settings.roomName || DEFAULT_STATE.settings.roomName).slice(0, 32);
  settings.numberingStartSide = settings.numberingStartSide === "right" ? "right" : "left";
  settings.inactiveSlots = normalizeInactiveSlots(settings.inactiveSlots, settings);
  settings.pausedMachines = normalizeMachineIdList(settings.pausedMachines, new Set(getMachineIds(settings)));
  settings.schedulePriority = normalizeSchedulePriority(settings.schedulePriority);
  settings.staffWorkMode = normalizeStaffWorkMode(settings.staffWorkMode);
  settings.specialZoneName = String(settings.specialZoneName || DEFAULT_STATE.settings.specialZoneName).trim().slice(0, 16);
  settings.machineTypes = normalizeMachineTypeMap(settings.machineTypes, new Set(getMachineIds(settings)), settings.hdfMachines);
  settings.machineZones = normalizeMachineZoneMap(settings.machineZones, new Set(getMachineIds(settings)), settings.specialMachines);
  settings.machineZones = restoreDefaultInfectionSubzonesIfCollapsed(settings.machineZones, settings);
  settings.specialMachines = getInfectionMachineIds(settings);
  delete settings.hdfMachines;
  settings.language = normalizeLanguageCode(settings.language);
  settings.theme = normalizeTheme(settings.theme);

  const patients = Array.isArray(input.patients) ? input.patients.map(normalizePatient).filter(Boolean) : [];
  const staffMembers = Array.isArray(input.staffMembers) ? input.staffMembers.map(normalizeStaffMember).filter(Boolean) : [];
  const patientMap = new Map(patients.map((patient) => [patient.id, patient]));
  const validMachineIds = new Set(getMachineIds(settings));

  const weeklySchedules = normalizeScheduleCollection(input.weeklySchedules, true, patientMap, validMachineIds);
  const weeklyStaffSchedules = normalizeStaffSchedules(input.weeklyStaffSchedules, settings, true);

  return {
    settings,
    patients,
    staffMembers,
    weeklySchedules,
    schedules: normalizeScheduleCollection(input.schedules, false, patientMap, validMachineIds),
    weeklyStaffSchedules,
    staffSchedules: normalizeStaffSchedules(input.staffSchedules, settings, false),
    twoWeekCycle: normalizeTwoWeekCycle(
      input.twoWeekCycle,
      patientMap,
      validMachineIds,
      settings,
      weeklySchedules,
      weeklyStaffSchedules,
    ),
  };
}

function normalizePatient(patient) {
  if (!patient || typeof patient !== "object" || !String(patient.name || "").trim()) {
    return null;
  }

  const treatmentType = normalizeMachineType(patient.treatmentType);
  const monthlyHdfCount = treatmentType === DEFAULT_MACHINE_TYPE
    ? normalizeEvenHdfCount(patient.monthlyHdfCount, 2)
    : 0;

  return {
    id: String(patient.id || createId()),
    name: String(patient.name || "").trim().slice(0, 32),
    dialysisNo: String(patient.dialysisNo || "").trim().slice(0, 32),
    gender: String(patient.gender || "").slice(0, 8),
    age: patient.age === "" || patient.age == null ? "" : clampNumber(patient.age, 0, 120, ""),
    phone: String(patient.phone || "").trim().slice(0, 32),
    dryWeight: patient.dryWeight === "" || patient.dryWeight == null ? "" : clampDecimal(patient.dryWeight, 0, 300, ""),
    vascularAccess: String(patient.vascularAccess || "").slice(0, 32),
    treatmentType,
    weeklyTreatmentCount: clampNumber(patient.weeklyTreatmentCount, 1, 6, 3),
    monthlyHdfCount,
    status: patient.status === "paused" ? "paused" : "active",
    infectionFlag: normalizeInfectionFlag(patient.infectionFlag),
    careLevel: normalizeCareLevel(patient.careLevel),
    preferredShift: ["morning", "afternoon"].includes(patient.preferredShift) ? patient.preferredShift : "",
    fixedMachineId: String(patient.fixedMachineId || "").trim().slice(0, 32),
    fixedMachineLockedAt: patient.fixedMachineId ? String(patient.fixedMachineLockedAt || patient.updatedAt || new Date().toISOString()) : "",
    preferredDays: normalizeDayPreference(patient.preferredDays),
    forcePreferredDays: Boolean(patient.forcePreferredDays),
    temporaryInsert: Boolean(patient.temporaryInsert),
    note: String(patient.note || "").trim().slice(0, 300),
    demo: Boolean(patient.demo),
    updatedAt: patient.updatedAt || new Date().toISOString(),
  };
}

function hasPatientPlacementCriticalChanges(previousPatient, nextPatient) {
  if (!previousPatient || !nextPatient) {
    return true;
  }
  return (
    normalizeMachineType(previousPatient.treatmentType) !== normalizeMachineType(nextPatient.treatmentType) ||
    normalizeInfectionFlag(previousPatient.infectionFlag) !== normalizeInfectionFlag(nextPatient.infectionFlag) ||
    normalizeCareLevel(previousPatient.careLevel) !== normalizeCareLevel(nextPatient.careLevel) ||
    String(previousPatient.fixedMachineId || "") !== String(nextPatient.fixedMachineId || "")
  );
}

function hasPatientSchedulePlanChanges(previousPatient, nextPatient) {
  if (!previousPatient || !nextPatient) {
    return false;
  }
  const previousDays = normalizeDayPreference(previousPatient.preferredDays).join(",");
  const nextDays = normalizeDayPreference(nextPatient.preferredDays).join(",");
  return (
    hasPatientPlacementCriticalChanges(previousPatient, nextPatient) ||
    clampNumber(previousPatient.weeklyTreatmentCount, 1, 6, 3) !== clampNumber(nextPatient.weeklyTreatmentCount, 1, 6, 3) ||
    normalizeEvenHdfCount(previousPatient.monthlyHdfCount, 0) !== normalizeEvenHdfCount(nextPatient.monthlyHdfCount, 0) ||
    String(previousPatient.status || "active") !== String(nextPatient.status || "active") ||
    String(previousPatient.preferredShift || "") !== String(nextPatient.preferredShift || "") ||
    previousDays !== nextDays ||
    Boolean(previousPatient.forcePreferredDays) !== Boolean(nextPatient.forcePreferredDays)
  );
}

function getPatientPlanningIndex(patientId) {
  const index = state.patients.findIndex((patient) => patient.id === patientId);
  return index >= 0 ? index : state.patients.length;
}


function isSchedulablePatient(patient) {
  return Boolean(
    patient &&
    String(patient.name || "").trim() &&
    patient.status !== "paused" &&
    !patient.temporaryInsert &&
    clampNumber(patient.weeklyTreatmentCount, 1, 6, 3) > 0
  );
}

function getSchedulablePatients() {
  return state.patients.filter(isSchedulablePatient);
}

function getDefaultDialysisDaysForPatient(patient, patientIndex = 0, priority = state.settings.schedulePriority) {
  const frequency = clampNumber(patient.weeklyTreatmentCount, 1, 6, 3);
  if (frequency === 3) {
    const patterns = isFlexibleDayPriority(priority)
      ? SAFE_THRICE_WEEKLY_PATTERNS
      : DEMO_DAY_PATTERNS;
    return [...(patterns[patientIndex % patterns.length] || ["1", "3", "5"])];
  }
  if (frequency === 2) {
    return patientIndex % 2 ? ["2", "5"] : ["1", "4"];
  }
  if (frequency === 1) {
    return [WORKING_DAY_KEYS[patientIndex % WORKING_DAY_KEYS.length]];
  }
  return getStaffPriorityDayPattern(frequency).slice(0, frequency);
}

function hasForcedPreferredDays(patient) {
  return Boolean(patient?.forcePreferredDays);
}

function validateForcedPreferredDaysPatients(patients = getSchedulablePatients()) {
  const problems = [];
  patients.filter(hasForcedPreferredDays).forEach((patient) => {
    const frequency = clampNumber(patient.weeklyTreatmentCount, 1, 6, 3);
    const selected = normalizeDayPreference(patient.preferredDays);
    const workingSelected = selected.filter((dayKey) => WORKING_DAY_KEYS.includes(dayKey));

    if (!selected.length) {
      problems.push(`强制个性化：${patient.name} 已开启强制个性化，但没有勾选透析星期。请勾选 ${frequency} 个工作日。`);
      return;
    }

    if (selected.includes(REST_DAY_KEY)) {
      problems.push(`强制个性化：${patient.name} 勾选了周日，但周日为休息日，不能自动排班。请改选周一至周六。`);
    }

    if (workingSelected.length !== frequency) {
      problems.push(`强制个性化：${patient.name} 每周需要 ${frequency} 次透析，但当前勾选了 ${workingSelected.length} 个工作日。请刚好勾选 ${frequency} 个工作日。`);
    }
  });
  return problems;
}

function ensureDefaultDialysisDaysForSchedulablePatients(priority = state.settings.schedulePriority) {
  const notices = [];
  getSchedulablePatients().forEach((patient, patientIndex) => {
    const normalizedDays = normalizeDayPreference(patient.preferredDays);
    if (hasForcedPreferredDays(patient)) {
      patient.preferredDays = normalizedDays;
      return;
    }
    if (normalizedDays.length) {
      patient.preferredDays = normalizedDays;
      return;
    }

    patient.preferredDays = getDefaultDialysisDaysForPatient(patient, patientIndex, priority);
    patient.updatedAt = new Date().toISOString();
    notices.push(`${patient.name} 未设置星期，已按每周 ${patient.weeklyTreatmentCount || 3} 次自动分配到 ${patient.preferredDays.map(getWeekDayLabel).join("、")}`);
  });
  return notices;
}


function normalizeStaffMember(staff) {
  if (!staff || typeof staff !== "object" || !String(staff.name || "").trim()) {
    return null;
  }
  const role = staff.role === "doctor" ? "doctor" : "nurse";

  return {
    id: String(staff.id || createId()),
    name: normalizeDemoStaffName(String(staff.name || "").trim(), role, Boolean(staff.demo)).slice(0, 32),
    code: String(staff.code || "").trim().slice(0, 32),
    role,
    phone: String(staff.phone || "").trim().slice(0, 32),
    preferredShift: ["morning", "afternoon"].includes(staff.preferredShift) ? staff.preferredShift : "",
    status: staff.status === "paused" ? "paused" : "active",
    note: String(staff.note || "").trim().slice(0, 300),
    demo: Boolean(staff.demo),
    updatedAt: staff.updatedAt || new Date().toISOString(),
  };
}

function normalizeDemoStaffName(name, role, isDemo = false) {
  const rawName = String(name || "").trim();
  if (!isDemo) {
    return rawName;
  }
  const roleShort = role === "doctor" ? "医" : "护";
  const suffixPattern = /[（(](医|护)[）)]$/;
  const withoutOldSuffix = rawName.replace(suffixPattern, "");
  const withoutOldPrefix = withoutOldSuffix.startsWith(roleShort) && withoutOldSuffix.length > 1
    ? withoutOldSuffix.slice(1)
    : withoutOldSuffix;
  return `${withoutOldPrefix || rawName}（${roleShort}）`;
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

  return Object.entries(rawSchedules).reduce((result, [date, daySchedule]) => {
    const validKey = weeklyOnly ? WEEK_DAYS.some((day) => day.key === date) : /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (validKey && daySchedule && typeof daySchedule === "object") {
      const storedNurseCount = getStoredStaffNurseCount(daySchedule);
      result[date] = normalizeStaffScheduleDay(daySchedule, storedNurseCount);
    }
    return result;
  }, {});
}

function getStoredStaffNurseCount(daySchedule) {
  let count = 1;
  STAFF_SHIFT_KEYS.forEach((shift) => {
    const nurses = Array.isArray(daySchedule?.[shift]?.nurses) ? daySchedule[shift].nurses : [];
    for (let index = nurses.length - 1; index >= 0; index -= 1) {
      if (sanitizeStaffName(nurses[index])) {
        count = Math.max(count, index + 1);
        break;
      }
    }
  });
  return count;
}

function normalizeScheduleCollection(rawSchedules, weeklyOnly = false, patientMap = new Map(), validMachines = null) {
  if (!rawSchedules || typeof rawSchedules !== "object") {
    return {};
  }

  return Object.entries(rawSchedules).reduce((result, [key, daySchedule]) => {
    const isValidKey = weeklyOnly ? WEEK_DAYS.some((day) => day.key === key) : /^\d{4}-\d{2}-\d{2}$/.test(key);
    if (isValidKey && daySchedule && typeof daySchedule === "object") {
      const normalizedDay = normalizeMachineScheduleDay(daySchedule, patientMap, validMachines);
      if (Object.keys(normalizedDay).length) {
        result[key] = normalizedDay;
      }
    }
    return result;
  }, {});
}

function normalizeMachineScheduleDay(daySchedule, patientMap = new Map(), validMachines = null) {
  return Object.entries(daySchedule).reduce((result, [machineId, item]) => {
    const normalizedMachineId = String(machineId || "").trim();
    if (!normalizedMachineId || (validMachines && !validMachines.has(normalizedMachineId)) || !item || typeof item !== "object") {
      return result;
    }

    const normalized = {};
    ["morning", "afternoon"].forEach((shift) => {
      const slot = normalizeScheduleSlot(item[shift], patientMap);
      if (slot) {
        normalized[shift] = slot;
      }
    });

    if (Object.keys(normalized).length) {
      result[normalizedMachineId] = normalized;
    }
    return result;
  }, {});
}

function normalizeScheduleSlot(slot, patientMap = new Map()) {
  if (!slot || typeof slot !== "object") {
    return null;
  }
  const note = String(slot.note || "").trim().slice(0, 160);
  const source = normalizeScheduleSlotSource(slot.source, note);
  if (slot.removed) {
    return {
      removed: true,
      note,
      ...(source ? { source } : {}),
      updatedAt: slot.updatedAt || new Date().toISOString(),
    };
  }
  if (!slot.patientId) {
    return null;
  }
  const patientId = String(slot.patientId);
  const patient = patientMap.get(patientId);
  if (!patient) {
    return null;
  }
  const treatmentType = slot.treatmentType == null || slot.treatmentType === "" ? patient.treatmentType : slot.treatmentType;
  return {
    patientId,
    treatmentType: normalizeMachineType(treatmentType),
    note,
    ...(source ? { source } : {}),
    updatedAt: slot.updatedAt || new Date().toISOString(),
  };
}

function normalizeScheduleSlotSource(source, note = "") {
  if (String(source || "") === AUTO_OVERRIDE_SOURCE_MONTHLY_HDF) {
    return AUTO_OVERRIDE_SOURCE_MONTHLY_HDF;
  }
  const text = String(note || "");
  if (text.startsWith("每月血滤；原") || (text.startsWith("与") && text.includes("月血滤对调"))) {
    return AUTO_OVERRIDE_SOURCE_MONTHLY_HDF;
  }
  return "";
}

function normalizeStaffScheduleDay(daySchedule, nurseCount) {
  return STAFF_SHIFT_KEYS.reduce((result, shift) => {
    const shiftSchedule = daySchedule?.[shift] || {};
    result[shift] = {
      doctors: normalizeStaffNameArray(shiftSchedule.doctors, DOCTOR_COUNT),
      nurses: normalizeStaffNameArray(shiftSchedule.nurses, nurseCount),
      backupNurse: sanitizeStaffName(shiftSchedule.backupNurse),
      swapNotes: normalizeStaffSwapNotes(shiftSchedule.swapNotes, nurseCount),
    };
    return result;
  }, {});
}

function normalizeStaffSwapNotes(value, nurseCount) {
  const notes = value && typeof value === "object" ? value : {};
  return {
    nurses: Array.from({ length: nurseCount }, (_, index) => normalizeStaffSwapNote(notes.nurses?.[index])),
    backupNurse: normalizeStaffSwapNote(notes.backupNurse),
  };
}

function normalizeStaffSwapNote(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const type = value.type === "payback" ? "payback" : value.type === "cover" ? "cover" : "";
  const partnerId = sanitizeStaffName(value.partnerId);
  if (!type || !partnerId) {
    return null;
  }
  return {
    type,
    partnerId,
    group: clampNumber(value.group, 1, 999, 1),
    relatedDateValue: /^\d{4}-\d{2}-\d{2}$/.test(String(value.relatedDateValue || "")) ? String(value.relatedDateValue) : "",
    relatedShift: STAFF_SHIFT_KEYS.includes(value.relatedShift) ? value.relatedShift : "",
    text: String(value.text || "").trim().slice(0, 80),
  };
}

function normalizeStaffNameArray(value, count) {
  const items = Array.isArray(value) ? value : [];
  return Array.from({ length: count }, (_, index) => sanitizeStaffName(items[index]));
}

function sanitizeStaffName(value) {
  return String(value || "").trim().slice(0, 32);
}

function getStaffSwapNoteFromShift(shiftSchedule = {}, role, index = -1) {
  const notes = shiftSchedule?.swapNotes || {};
  if (role === "backupNurse") {
    return normalizeStaffSwapNote(notes.backupNurse);
  }
  if (role === "nurse") {
    return normalizeStaffSwapNote(notes.nurses?.[index]);
  }
  return null;
}

function setStaffSwapNote(daySchedule, shift, role, index, note) {
  if (!daySchedule?.[shift]) {
    return;
  }
  daySchedule[shift].swapNotes ||= normalizeStaffSwapNotes(daySchedule[shift].swapNotes, daySchedule[shift].nurses?.length || 0);
  if (role === "backupNurse") {
    daySchedule[shift].swapNotes.backupNurse = normalizeStaffSwapNote(note);
    return;
  }
  if (role === "nurse" && index >= 0) {
    daySchedule[shift].swapNotes.nurses ||= [];
    daySchedule[shift].swapNotes.nurses[index] = normalizeStaffSwapNote(note);
  }
}

function clearStaffSwapNote(daySchedule, shift, role, index) {
  setStaffSwapNote(daySchedule, shift, role, index, null);
}

function formatStaffSwapNote(note, mode = "short") {
  const normalized = normalizeStaffSwapNote(note);
  if (!normalized) {
    return "";
  }
  const partnerName = getStaffDisplayName(normalized.partnerId);
  const groupText = normalized.group ? `第${normalized.group}组` : "调班";
  if (mode === "long") {
    const related = normalized.relatedDateValue
      ? `，对应${formatDateLabel(normalized.relatedDateValue)}${normalized.relatedShift ? SHIFT_LABELS[normalized.relatedShift] : ""}`
      : "";
    return normalized.type === "payback"
      ? `${groupText}：补回 ${partnerName} 的班${related}`
      : `${groupText}：替 ${partnerName} 上班${related ? `；${partnerName}后续补回${related.replace(/^，对应/, "")}` : ""}`;
  }
  return normalized.type === "payback" ? `补回${partnerName} · ${groupText}` : `替${partnerName} · ${groupText}`;
}

function saveState() {
  pruneEmptyStaffSchedules();
  pruneInvalidMachineSettings();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const savedText = !isChineseLanguage() ? "Saved locally" : "本地保存";
    if (ui.storageStatus) {
      ui.storageStatus.textContent = `${savedText} ${new Date().toLocaleTimeString(getLanguageMeta().code, { hour12: false })}`;
    }
    updateUndoButton();
    return true;
  } catch (error) {
    console.error("Failed to save scheduler state", error);
    if (ui.storageStatus) {
      ui.storageStatus.textContent = !isChineseLanguage() ? "Local save failed" : "本地保存失败，请立即导出备份";
    }
    showToast(!isChineseLanguage() ? "Local save failed. Export a backup now." : "本地保存失败，请立即导出 JSON 备份");
    return false;
  }
}

function getUndoHistory() {
  try {
    const raw = localStorage.getItem(UNDO_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.state) : [];
  } catch (error) {
    console.warn("Failed to read undo history", error);
    return [];
  }
}

function setUndoHistory(history = []) {
  try {
    localStorage.setItem(UNDO_STORAGE_KEY, JSON.stringify(history.slice(0, MAX_UNDO_SNAPSHOTS)));
  } catch (error) {
    console.warn("Failed to save undo history", error);
  }
  updateUndoButton();
}

function captureUndoSnapshot(label) {
  try {
    const snapshot = {
      id: createId(),
      label: String(label || "上一步操作").slice(0, 80),
      createdAt: new Date().toISOString(),
      state: structuredClone(state),
    };
    const history = getUndoHistory();
    history.unshift(snapshot);
    setUndoHistory(history);
    return true;
  } catch (error) {
    console.warn("Failed to capture undo snapshot", error);
    return false;
  }
}

function updateUndoButton() {
  if (!ui.undoLastChange) return;
  const latest = getUndoHistory()[0];
  ui.undoLastChange.disabled = !latest;
  ui.undoLastChange.textContent = latest ? `撤销：${latest.label}` : "撤销上一步";
  ui.undoLastChange.title = latest
    ? `恢复到“${latest.label}”之前的状态`
    : "关键改动前会自动生成一个可撤销快照";
}

function restoreLastUndoSnapshot() {
  const history = getUndoHistory();
  const latest = history.shift();
  if (!latest?.state) {
    updateUndoButton();
    showToast("目前没有可撤销的操作");
    return;
  }
  if (!window.confirm(`确定撤销“${latest.label}”吗？当前排班会恢复到这一步之前。`)) {
    return;
  }
  const restored = normalizeState(latest.state);
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, restored);
  pendingTwoWeekPlan = null;
  setUndoHistory(history);
  saveState();
  syncActiveCycleWeekFromDate();
  syncCycleWeekToWeeklyView();
  renderAll();
  showToast(`已撤销：${latest.label}`);
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
  state.settings.pausedMachines = normalizeMachineIdList(state.settings.pausedMachines, new Set(getMachineIds()));
  state.settings.schedulePriority = normalizeSchedulePriority(state.settings.schedulePriority);
  state.settings.theme = normalizeTheme(state.settings.theme);
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

function restoreDefaultInfectionSubzonesIfCollapsed(machineZones = {}, settings = DEFAULT_STATE.settings) {
  const result = { ...(machineZones || {}) };
  const defaultInfectionIds = DEFAULT_LAYOUT_INFECTION_MACHINES.map(String);
  const isDefaultGeometry =
    Number(settings.rowCount) === Number(DEFAULT_STATE.settings.rowCount) &&
    Number(settings.machinesPerRow) === Number(DEFAULT_STATE.settings.machinesPerRow) &&
    String(settings.numberingStartSide || "left") === String(DEFAULT_STATE.settings.numberingStartSide || "left") &&
    normalizeInactiveSlots(settings.inactiveSlots, settings).length === 0;
  const allCollapsed = defaultInfectionIds.every((machineId) => result[machineId] === MACHINE_ZONE_INFECTION);
  const hasSpecificInfectionZone = defaultInfectionIds.some((machineId) =>
    MACHINE_ZONE_INFECTION_FLAGS.includes(result[machineId])
  );

  if (isDefaultGeometry && allCollapsed && !hasSpecificInfectionZone) {
    defaultInfectionIds.forEach((machineId) => {
      result[machineId] = DEFAULT_LAYOUT_MACHINE_ZONES[machineId] || MACHINE_ZONE_INFECTION;
    });
    didMigrateStoredLayout = true;
  }

  return result;
}

function normalizeCareLevel(value) {
  return String(value || "").trim() === SEVERE_CARE_LEVEL ? SEVERE_CARE_LEVEL : STANDARD_CARE_LEVEL;
}

function isSeverePatient(patient) {
  return normalizeCareLevel(patient?.careLevel) === SEVERE_CARE_LEVEL;
}

function isInfectiousPatient(patient) {
  return Boolean(normalizeInfectionFlag(patient?.infectionFlag));
}

function getPatientCareLabel(patient) {
  return isSeverePatient(patient) ? "严重组" : "普通组";
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
  renderTheme();
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
  syncMonthlyHdfAvailability();
  updateUndoButton();
}

function renderHeader() {
  const text = getText();
  ui.roomTitle.textContent = `${state.settings.roomName}${!isChineseLanguage() ? " " : ""}${text.titleSuffix}`;
  ui.storageStatus.textContent = localStorage.getItem(STORAGE_KEY) ? text.storageLoaded : text.storageReady;
  ui.storageStatus.title = `版本 ${APP_VERSION}`;
  document.documentElement.dataset.appVersion = APP_VERSION;
}

function refreshScheduleView() {
  syncActiveCycleWeekFromDate();
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
  const displayOffset = getDisplayWeekOffsetForDate(getCurrentDate());
  const displayLabel = getDisplayWeekLabel(displayOffset);
  ui.weekTitle.textContent = !isChineseLanguage()
    ? `${displayLabel} ${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)} Schedule`
    : `${displayLabel} ${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)} 周排班`;
  ui.weekMeta.textContent = hasTwoWeekCycleTemplate()
    ? `${displayLabel}使用长期2周循环第${activeCycleWeek}周模板；日期按本周、下周滚动显示，2周后会自动继续套用下一轮。`
    : text.weekMeta;
  updateCycleWeekChrome();

  ui.weekDayStrip.innerHTML = WEEK_DAYS.map((day, index) => {
    const date = addDays(weekStart, index);
    const dateValue = formatDateInput(date);
    const effective = getEffectiveScheduleForDate(dateValue);
    const assigned = countAssigned(effective, getMachineIds(), "morning") + countAssigned(effective, getMachineIds(), "afternoon");
    const hasOverride = hasDateOverride(dateValue);
    const isActive = dateValue === getCurrentDate();
    const assignedText =
      day.key === REST_DAY_KEY && !hasOverride
        ? !isChineseLanguage()
          ? "Rest"
          : "休息"
        : !isChineseLanguage()
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



function normalizeTwoWeekCycle(
  input,
  patientMap,
  validMachineIds,
  settings,
  fallbackWeeklySchedules = {},
  fallbackWeeklyStaffSchedules = {},
) {
  const safe = input && typeof input === "object" ? input : {};
  const normalizeWeek = (week) =>
    normalizeScheduleCollection(week && typeof week === "object" ? week : {}, true, patientMap, validMachineIds);
  const normalizeStaffWeek = (week) =>
    normalizeStaffSchedules(week && typeof week === "object" ? week : {}, settings, true);

  let week1 = normalizeWeek(safe.patientSchedules?.week1);
  let week2 = normalizeWeek(safe.patientSchedules?.week2);
  let staffWeek1 = normalizeStaffWeek(safe.staffSchedules?.week1);
  let staffWeek2 = normalizeStaffWeek(safe.staffSchedules?.week2);

  const fallbackPatients = normalizeWeek(fallbackWeeklySchedules);
  const fallbackStaff = normalizeStaffWeek(fallbackWeeklyStaffSchedules);
  if (!Object.keys(week1).length && !Object.keys(week2).length && Object.keys(fallbackPatients).length) {
    week1 = structuredClone(fallbackPatients);
    week2 = structuredClone(fallbackPatients);
  } else if (Object.keys(week1).length && !Object.keys(week2).length) {
    week2 = structuredClone(week1);
  } else if (!Object.keys(week1).length && Object.keys(week2).length) {
    week1 = structuredClone(week2);
  }

  if (!Object.keys(staffWeek1).length && !Object.keys(staffWeek2).length && Object.keys(fallbackStaff).length) {
    staffWeek1 = structuredClone(fallbackStaff);
    staffWeek2 = structuredClone(fallbackStaff);
  } else if (Object.keys(staffWeek1).length && !Object.keys(staffWeek2).length) {
    staffWeek2 = structuredClone(staffWeek1);
  } else if (!Object.keys(staffWeek1).length && Object.keys(staffWeek2).length) {
    staffWeek1 = structuredClone(staffWeek2);
  }

  return {
    patientSchedules: { week1, week2 },
    staffSchedules: { week1: staffWeek1, week2: staffWeek2 },
    review: safe.review && typeof safe.review === "object" ? safe.review : null,
    savedAt: String(safe.savedAt || ""),
    anchorWeekStart: normalizeCycleAnchorWeekStart(safe.anchorWeekStart || safe.savedAt),
  };
}

function normalizeCycleAnchorWeekStart(value) {
  const text = String(value || "").slice(0, 10);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return formatDateInput(getWeekStart(parseDateInput(text)));
  }
  return formatDateInput(getWeekStart(new Date()));
}

function getCycleWeekKey(weekNumber = activeCycleWeek) {
  return Number(weekNumber) === 2 ? "week2" : "week1";
}

function hasTwoWeekCycleTemplate() {
  return ["week1", "week2"].some((weekKey) =>
    Object.keys(state.twoWeekCycle?.patientSchedules?.[weekKey] || {}).length ||
    Object.keys(state.twoWeekCycle?.staffSchedules?.[weekKey] || {}).length
  );
}

function getCycleWeekNumberForDate(dateValue = getCurrentDate()) {
  if (!hasTwoWeekCycleTemplate()) {
    return activeCycleWeek;
  }
  const anchorWeekStart = normalizeCycleAnchorWeekStart(state.twoWeekCycle?.anchorWeekStart);
  const anchor = parseDateInput(anchorWeekStart);
  const currentWeekStart = getWeekStart(parseDateInput(dateValue || formatDateInput(new Date())));
  const weekDiff = Math.round((currentWeekStart - anchor) / (7 * 24 * 60 * 60 * 1000));
  return ((weekDiff % 2) + 2) % 2 === 0 ? 1 : 2;
}

function getDisplayWeekOffsetForDate(dateValue = getCurrentDate()) {
  const todayWeekStart = getWeekStart(new Date());
  const targetWeekStart = getWeekStart(parseDateInput(dateValue || formatDateInput(new Date())));
  return Math.round((targetWeekStart - todayWeekStart) / (7 * 24 * 60 * 60 * 1000));
}

function getDisplayWeekLabel(offset = getDisplayWeekOffsetForDate()) {
  const value = Number(offset) || 0;
  if (!isChineseLanguage()) {
    if (value === 0) return "This week";
    if (value === 1) return "Next week";
    return value > 1 ? `${value} weeks later` : `${Math.abs(value)} weeks ago`;
  }
  if (value === 0) return "本周";
  if (value === 1) return "下周";
  return value > 1 ? `${value}周后` : `${Math.abs(value)}周前`;
}

function updateCycleWeekChrome() {
  if (!ui.cycleWeekTabs) return;
  const displayOffset = getDisplayWeekOffsetForDate(getCurrentDate());
  ui.cycleWeekTabs.querySelectorAll("[data-week-offset]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.weekOffset) === displayOffset);
  });
  ui.prevWeek.textContent = "本周";
  ui.nextWeek.textContent = "下周";
  ui.todayButton.textContent = "回到本周";
}

function syncActiveCycleWeekFromDate() {
  const nextWeek = getCycleWeekNumberForDate(getCurrentDate());
  if (nextWeek === activeCycleWeek) {
    updateCycleWeekChrome();
    return;
  }
  if (state.twoWeekCycle) {
    copyWeeklyViewBackToCycle();
  }
  activeCycleWeek = nextWeek;
  syncCycleWeekToWeeklyView();
  updateCycleWeekChrome();
}

function setDisplayWeekOffset(offset, resetToToday = false) {
  if (state.twoWeekCycle) {
    copyWeeklyViewBackToCycle();
  }

  const targetOffset = Number(offset) === 1 ? 1 : 0;
  const today = new Date();
  const selectedDate = resetToToday ? today : parseDateInput(getCurrentDate());
  const selectedWeekStart = getWeekStart(selectedDate);
  const selectedDayOffset = Math.round((selectedDate - selectedWeekStart) / (24 * 60 * 60 * 1000));
  const targetWeekStart = addDays(getWeekStart(today), targetOffset * 7);
  ui.scheduleDate.value = formatDateInput(addDays(targetWeekStart, selectedDayOffset));

  refreshScheduleView();
}

function setActiveCycleWeek(weekNumber) {
  const nextWeek = Number(weekNumber) === 2 ? 2 : 1;
  const currentTemplateWeek = getCycleWeekNumberForDate(getCurrentDate());
  let offset = getDisplayWeekOffsetForDate(getCurrentDate());
  if (currentTemplateWeek !== nextWeek) {
    offset += 1;
  }
  setDisplayWeekOffset(offset === 1 ? 1 : 0);
}

function syncCycleWeekToWeeklyView() {
  const weekKey = getCycleWeekKey();
  const patientWeek = state.twoWeekCycle?.patientSchedules?.[weekKey] || {};
  const staffWeek = state.twoWeekCycle?.staffSchedules?.[weekKey] || {};
  state.weeklySchedules = structuredClone(patientWeek);
  state.weeklyStaffSchedules = structuredClone(staffWeek);
}

function copyWeeklyViewBackToCycle() {
  const weekKey = getCycleWeekKey();
  state.twoWeekCycle.patientSchedules[weekKey] = structuredClone(state.weeklySchedules || {});
  state.twoWeekCycle.staffSchedules[weekKey] = structuredClone(state.weeklyStaffSchedules || {});
}

function getTwoWeekHdfTarget(patient) {
  const fourWeekCount = Math.max(0, Number(patient.monthlyHdfCount || 0));
  return Math.floor(fourWeekCount / 2);
}

function validateEvenFourWeekHdfCounts() {
  return getSchedulablePatients()
    .filter((patient) => patient.treatmentType === "hemodialysis")
    .filter((patient) => Number(patient.monthlyHdfCount || 0) % 2 !== 0)
    .map((patient) => `${patient.name} 的4周血滤次数不是偶数`);
}

function getTwoWeekHdfCountForWeek(patient, weekNumber, patientIndex = 0) {
  const target = getTwoWeekHdfTarget(patient);
  if (target <= 0) return 0;
  if (target === 1) {
    // 每2周1次时，把不同患者均匀分散到第1周或第2周，避免所有血滤集中在同一周。
    return (patientIndex % 2) + 1 === weekNumber ? 1 : 0;
  }
  return weekNumber === 1 ? Math.ceil(target / 2) : Math.floor(target / 2);
}

function getEvenlyDistributedSessionIndexes(totalSessions, selectedCount, rotation = 0) {
  const total = Math.max(0, Number(totalSessions) || 0);
  const count = Math.min(total, Math.max(0, Number(selectedCount) || 0));
  if (!count) return new Set();
  const start = ((Number(rotation) || 0) % total + total) % total;
  if (count === 1) return new Set([start]);
  const indexes = new Set();
  for (let index = 0; index < count; index += 1) {
    indexes.add((start + Math.round((index * total) / count)) % total);
  }
  return indexes;
}

function buildTwoWeekPatientSchedules() {
  const priority = normalizeSchedulePriority(state.settings.schedulePriority);
  const warnings = [];
  const defaultDayNotices = ensureDefaultDialysisDaysForSchedulablePatients(priority);
  if (defaultDayNotices.length) {
    warnings.push(...defaultDayNotices.map((item) => `默认透析日：${item}`));
  }
  const blocking = validateEvenFourWeekHdfCounts();
  if (blocking.length) {
    return { week1: {}, week2: {}, warnings, blocking, fixedMachineAssignments: {} };
  }

  const buildWeek = (weekNumber, preferredMachineAssignments = {}) =>
    buildAutoWeeklyPatientSchedules(getCurrentDate(), priority, {
      skipMonthlyHdfOverrides: true,
      fastMachineSelection: true,
      preassignMachines: true,
      preferredMachineAssignments,
      sessionTreatmentResolver: ({ patient, patientIndex, index, plannedDays, defaultTreatmentType }) => {
        if (defaultTreatmentType !== DEFAULT_MACHINE_TYPE) return defaultTreatmentType;
        const hdfCount = getTwoWeekHdfCountForWeek(patient, weekNumber, patientIndex);
        const hdfIndexes = getEvenlyDistributedSessionIndexes(plannedDays.length, hdfCount, patientIndex + weekNumber);
        return hdfIndexes.has(index) ? "hemofiltration" : defaultTreatmentType;
      },
    });

  const week1Result = buildWeek(1);
  warnings.push(...(week1Result.warnings || []).map((item) => `第1周：${item}`));
  blocking.push(...(week1Result.blocking || []).map((item) => `第1周：${item}`));
  if (blocking.length) {
    return {
      week1: week1Result.schedules || {},
      week2: {},
      warnings,
      blocking,
      fixedMachineAssignments: week1Result.fixedMachineAssignments || {},
    };
  }

  const week2Result = buildWeek(2, getPreferredMachineAssignmentsFromWeek(week1Result.schedules || {}));
  warnings.push(...(week2Result.warnings || []).map((item) => `第2周：${item}`));
  blocking.push(...(week2Result.blocking || []).map((item) => `第2周：${item}`));

  return {
    week1: week1Result.schedules || {},
    week2: week2Result.schedules || {},
    warnings,
    blocking,
    fixedMachineAssignments: getConsistentTwoWeekFixedMachineAssignments(
      week1Result.schedules || {},
      week2Result.schedules || {},
    ),
  };
}

function getPreferredMachineAssignmentsFromWeek(weekSchedules = {}) {
  const machineCountsByAssignment = new Map();
  Object.values(weekSchedules || {}).forEach((daySchedule) => {
    Object.entries(daySchedule || {}).forEach(([machineId, machine]) => {
      STAFF_SHIFT_KEYS.forEach((shift) => {
        const slot = machine?.[shift];
        if (!slot?.patientId || slot.removed) return;
        const assignmentKey = getPatientMachineAssignmentKey(slot.patientId, slot.treatmentType);
        if (!machineCountsByAssignment.has(assignmentKey)) {
          machineCountsByAssignment.set(assignmentKey, new Map());
        }
        const counts = machineCountsByAssignment.get(assignmentKey);
        const normalizedMachineId = String(machineId);
        counts.set(normalizedMachineId, (counts.get(normalizedMachineId) || 0) + 1);
      });
    });
  });

  return [...machineCountsByAssignment.entries()].reduce((result, [assignmentKey, machineCounts]) => {
    const best = [...machineCounts.entries()].sort((left, right) =>
      right[1] - left[1] ||
      sortMachineIds(left[0], right[0]),
    )[0];
    if (best?.[0]) {
      result[assignmentKey] = best[0];
    }
    return result;
  }, {});
}

function getConsistentTwoWeekFixedMachineAssignments(week1 = {}, week2 = {}) {
  const assignments = {};
  getSchedulablePatients().forEach((patient) => {
    if (patient.fixedMachineId) {
      return;
    }
    const baseTreatmentType = normalizeMachineType(patient.treatmentType);
    const machineIds = new Set();
    [week1, week2].forEach((week) => {
      WORKING_DAY_KEYS.forEach((dayKey) => {
        Object.entries(week?.[dayKey] || {}).forEach(([machineId, machine]) => {
          STAFF_SHIFT_KEYS.forEach((shift) => {
            const slot = machine?.[shift];
            if (slot?.patientId === patient.id && normalizeMachineType(slot.treatmentType) === baseTreatmentType) {
              machineIds.add(String(machineId));
            }
          });
        });
      });
    });
    if (machineIds.size === 1) {
      assignments[patient.id] = [...machineIds][0];
    }
  });
  return assignments;
}

function findPatientAssignmentInWeek(week, patientId, preferredDayKey = "") {
  const days = preferredDayKey
    ? [preferredDayKey, ...WORKING_DAY_KEYS.filter((dayKey) => dayKey !== preferredDayKey)]
    : [...WORKING_DAY_KEYS];
  for (const dayKey of days) {
    const day = week?.[dayKey] || {};
    for (const [machineId, machine] of Object.entries(day)) {
      for (const shift of STAFF_SHIFT_KEYS) {
        if (machine?.[shift]?.patientId === patientId) {
          return { dayKey, machineId, shift };
        }
      }
    }
  }
  return null;
}

function removePatientFromWeekDay(week, dayKey, patientId) {
  Object.values(week?.[dayKey] || {}).forEach((machine) => {
    STAFF_SHIFT_KEYS.forEach((shift) => {
      if (machine?.[shift]?.patientId === patientId) {
        delete machine[shift];
      }
    });
  });
}

function findCompatibleHdfMachineForAssignment(week, dayKey, shift, patient, preferredMachineId) {
  const candidates = getMachineIds()
    .filter((machineId) => getMachineType(machineId) === "hemofiltration")
    .filter((machineId) => !isMachinePaused(machineId))
    .filter((machineId) => patientFitsMachineForTreatment(patient, "hemofiltration", machineId))
    .sort((a, b) => {
      const aPreferred = String(a) === String(preferredMachineId) ? -1 : 0;
      const bPreferred = String(b) === String(preferredMachineId) ? -1 : 0;
      return aPreferred - bPreferred || Number(a) - Number(b);
    });

  return candidates.find((machineId) => !week?.[dayKey]?.[machineId]?.[shift]) || "";
}

function estimateNurseDutyCountForPatientSchedules(patientSchedules = {}) {
  return WORKING_DAY_KEYS.reduce((total, dayKey) => {
    const patientDaySchedule = patientSchedules?.[dayKey] || {};
    return total + STAFF_SHIFT_KEYS.reduce((shiftTotal, shift) => {
      const patientCount = countAssigned(patientDaySchedule, getMachineIds(), shift);
      return patientCount
        ? shiftTotal + getRequiredNurseCountForShift(patientDaySchedule, shift) + BACKUP_NURSE_COUNT
        : shiftTotal;
    }, 0);
  }, 0);
}

function buildTwoWeekStaffSchedules(patientResult) {
  const weekResults = {};
  const warnings = [];
  const blocking = [];
  const doctors = state.staffMembers.filter((staff) => staff.role === "doctor" && staff.status === "active");
  const nurses = state.staffMembers.filter((staff) => staff.role === "nurse" && staff.status === "active");
  const estimatedTwoWeekNurseDutyCount =
    estimateNurseDutyCountForPatientSchedules(patientResult.week1) +
    estimateNurseDutyCountForPatientSchedules(patientResult.week2);
  const balancingContext = {
    assignmentCounts: new Map([...doctors, ...nurses].map((staff) => [staff.id, 0])),
    nurseWorkedDays: new Map(nurses.map((staff) => [staff.id, new Set()])),
    estimatedTotalNurseDutyCount: estimatedTwoWeekNurseDutyCount,
  };

  for (const [weekKey, weekSchedules] of Object.entries({
    week1: patientResult.week1,
    week2: patientResult.week2,
  })) {
    const result = buildAutoWeeklyStaffSchedules(
      structuredClone(weekSchedules),
      normalizeSchedulePriority(state.settings.schedulePriority),
      {
        ...balancingContext,
        periodPrefix: `${weekKey}:`,
      },
    );
    weekResults[weekKey] = result.schedules;
    warnings.push(...(result.warnings || []).map((item) => `${weekKey === "week1" ? "第1周" : "第2周"}：${item}`));
    blocking.push(...(result.blocking || []).map((item) => `${weekKey === "week1" ? "第1周" : "第2周"}：${item}`));
  }

  return {
    week1: weekResults.week1 || {},
    week2: weekResults.week2 || {},
    warnings,
    blocking,
  };
}

function buildTwoWeekReview(patientResult, staffResult) {
  const patientRows = getSchedulablePatients()
    .map((patient) => {
      const sessions = [];
      for (const [weekNumber, week] of [[1, patientResult.week1], [2, patientResult.week2]]) {
        for (const dayKey of WORKING_DAY_KEYS) {
          const day = week?.[dayKey] || {};
          for (const [machineId, machine] of Object.entries(day)) {
            for (const shift of STAFF_SHIFT_KEYS) {
              const entry = machine?.[shift];
              if (entry?.patientId === patient.id) {
                sessions.push({
                  weekNumber,
                  dayKey,
                  shift,
                  machineId,
                  treatmentType: entry.treatmentType || patient.treatmentType,
                });
              }
            }
          }
        }
      }
      const hdfCount = sessions.filter((session) => session.treatmentType === "hemofiltration").length;
      return {
        patientId: patient.id,
        name: patient.name,
        targetTreatmentCount: clampNumber(patient.weeklyTreatmentCount, 1, 6, 3) * 2,
        targetHdfCount: getTwoWeekHdfTarget(patient),
        actualHdfCount: hdfCount,
        sessions,
      };
    });

  const staffRows = state.staffMembers
    .filter((staff) => staff.status === "active")
    .map((staff) => {
      const duties = [];
      const swapOuts = [];
      for (const [weekNumber, staffWeek, patientWeek] of [
        [1, staffResult.week1, patientResult.week1],
        [2, staffResult.week2, patientResult.week2],
      ]) {
        for (const dayKey of WORKING_DAY_KEYS) {
          for (const shift of STAFF_SHIFT_KEYS) {
            const entry = staffWeek?.[dayKey]?.[shift] || {};
            const groups = getNurseGroupsForShift(patientWeek?.[dayKey] || {}, shift, state.settings)
              .filter((group) => group && !group.empty);
            if ((entry.doctors || []).includes(staff.id)) {
              duties.push({ weekNumber, dayKey, shift, role: "医生" });
            }
            const nurseIndex = (entry.nurses || []).indexOf(staff.id);
            if (nurseIndex >= 0) {
              const group = groups[nurseIndex];
              const zoneLabel = getNurseGroupReviewLabel(group);
              duties.push({
                weekNumber,
                dayKey,
                shift,
                role: zoneLabel ? `负责：${zoneLabel}` : `责任护士${nurseIndex + 1}`,
                swapNote: getStaffSwapNoteFromShift(entry, "nurse", nurseIndex),
              });
            }
            (entry.nurses || []).forEach((assignedStaffId, nurseNoteIndex) => {
              const note = getStaffSwapNoteFromShift(entry, "nurse", nurseNoteIndex);
              if (note?.type !== "cover" || note.partnerId !== staff.id) {
                return;
              }
              const group = groups[nurseNoteIndex];
              const zoneLabel = getNurseGroupReviewLabel(group);
              swapOuts.push({
                weekNumber,
                dayKey,
                shift,
                role: zoneLabel ? `负责：${zoneLabel}` : `责任护士${nurseNoteIndex + 1}`,
                covererId: assignedStaffId,
                swapNote: note,
              });
            });
            if (entry.backupNurse === staff.id) {
              duties.push({
                weekNumber,
                dayKey,
                shift,
                role: "后备护士",
                swapNote: getStaffSwapNoteFromShift(entry, "backupNurse", -1),
              });
            }
            const backupSwapNote = getStaffSwapNoteFromShift(entry, "backupNurse", -1);
            if (backupSwapNote?.type === "cover" && backupSwapNote.partnerId === staff.id) {
              swapOuts.push({
                weekNumber,
                dayKey,
                shift,
                role: "后备护士",
                covererId: entry.backupNurse,
                swapNote: backupSwapNote,
              });
            }
          }
        }
      }
      const workedDays = new Set(duties.map((duty) => `${duty.weekNumber}-${duty.dayKey}`)).size;
      const fullDays = [...new Set(duties.map((duty) => `${duty.weekNumber}-${duty.dayKey}`))]
        .filter((dayId) => {
          const [weekNumber, dayKey] = dayId.split("-");
          const dayDuties = duties.filter(
            (duty) => String(duty.weekNumber) === weekNumber && duty.dayKey === dayKey,
          );
          return dayDuties.some((duty) => duty.shift === "morning") &&
            dayDuties.some((duty) => duty.shift === "afternoon");
        }).length;
      return {
        staffId: staff.id,
        name: staff.name,
        role: staff.role,
        duties,
        swapOuts,
        swapStats: summarizeStaffSwapItems(duties, swapOuts),
        shiftCount: duties.length,
        workedDays,
        fullDays,
        restDays: 12 - workedDays,
      };
    });

  const cycleBoundaryWarnings = validateTwoWeekCycleBoundary(patientResult);
  return {
    generatedAt: new Date().toISOString(),
    patientRows,
    staffRows,
    warnings: [...patientResult.warnings, ...staffResult.warnings, ...cycleBoundaryWarnings],
    blocking: [...patientResult.blocking, ...staffResult.blocking],
    stats: {
      patientCount: patientRows.length,
      expectedTreatmentCount: patientRows.reduce((sum, row) => sum + row.targetTreatmentCount, 0),
      treatmentCount: patientRows.reduce((sum, row) => sum + row.sessions.length, 0),
      hdfTargetCount: patientRows.reduce((sum, row) => sum + row.targetHdfCount, 0),
      hdfActualCount: patientRows.reduce((sum, row) => sum + row.actualHdfCount, 0),
      staffCount: staffRows.length,
    },
  };
}

function validateTwoWeekCycleBoundary(patientResult) {
  const warnings = [];
  getSchedulablePatients().forEach((patient) => {
    const week2Days = getPatientTreatmentDayIndexes(patientResult.week2, patient.id, 7);
    const week1Days = getPatientTreatmentDayIndexes(patientResult.week1, patient.id, 14);
    if (!week2Days.length || !week1Days.length) return;
    const last = Math.max(...week2Days);
    const firstNextCycle = Math.min(...week1Days);
    if (firstNextCycle - last < 2) {
      warnings.push(`${patient.name} 在第2周末与下一轮第1周初之间没有完整间隔一天。`);
    }
  });
  return warnings;
}

function getPatientTreatmentDayIndexes(week, patientId, offset) {
  const indexes = [];
  WORKING_DAY_KEYS.forEach((dayKey, dayIndex) => {
    const day = week?.[dayKey] || {};
    const assigned = Object.values(day).some((machine) =>
      STAFF_SHIFT_KEYS.some((shift) => machine?.[shift]?.patientId === patientId),
    );
    if (assigned) indexes.push(offset + dayIndex);
  });
  return indexes;
}

function rebuildBaseWeeklyTemplateForTwoWeek() {
  const priority = normalizeSchedulePriority(state.settings.schedulePriority);
  const patientResult = buildAutoWeeklyPatientSchedules(getCurrentDate(), priority);
  const staffResult = buildAutoWeeklyStaffSchedules(patientResult.schedules, priority);
  const safetyErrors = validateGeneratedWeeklySafety(
    patientResult.schedules,
    staffResult.schedules,
  );
  const blocking = [
    ...(patientResult.blocking || []),
    ...(staffResult.blocking || []),
    ...safetyErrors,
  ];

  if (blocking.length) {
    return {
      ok: false,
      blocking,
      warnings: [
        ...(patientResult.warnings || []),
        ...(staffResult.warnings || []),
      ],
    };
  }

  // 无论之前是否已有排班，每次都覆盖内存中的基础周模板，
  // 保证本次报告来自一次全新的自动排列。
  state.weeklySchedules = {};
  state.weeklyStaffSchedules = {};

  WORKING_DAY_KEYS.forEach((dayKey) => {
    if (Object.keys(patientResult.schedules?.[dayKey] || {}).length) {
      state.weeklySchedules[dayKey] = structuredClone(
        patientResult.schedules[dayKey],
      );
    }
    state.weeklyStaffSchedules[dayKey] = structuredClone(
      staffResult.schedules?.[dayKey] || {},
    );
  });

  const fixedAt = new Date().toISOString();
  Object.entries(patientResult.fixedMachineAssignments || {}).forEach(
    ([patientId, machineId]) => {
      const patient = findPatient(patientId);
      if (patient && !patient.fixedMachineId && machineId) {
        patient.fixedMachineId = machineId;
        patient.fixedMachineLockedAt = fixedAt;
        patient.updatedAt = fixedAt;
      }
    },
  );

  return {
    ok: true,
    warnings: [
      "本次报告已忽略原有排班并执行一次全新的自动排列。",
      ...(patientResult.warnings || []),
      ...(staffResult.warnings || []),
    ],
  };
}

function waitForBrowserPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 30);
    });
  });
}

function showTwoWeekLoadingDialog(message = "正在重新排列2周排班，请稍候……") {
  ui.confirmTwoWeekPlan.hidden = true;
  ui.twoWeekReviewTitle.textContent = "正在生成全新的2周排班";
  ui.twoWeekReviewMeta.textContent = "系统正在重新排列患者、血滤、机位和医护班次";
  ui.twoWeekReviewContent.innerHTML = `
    <section class="two-week-loading-panel">
      <div class="two-week-loading-spinner" aria-hidden="true"></div>
      <h3 id="twoWeekProgressTitle">${escapeHtml(message)}</h3>
      <div class="two-week-progress-shell" role="progressbar"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
           id="twoWeekProgressBar">
        <div class="two-week-progress-fill" id="twoWeekProgressFill"></div>
      </div>
      <div class="two-week-progress-row">
        <span id="twoWeekProgressStage">准备排班数据</span>
        <strong id="twoWeekProgressPercent">0%</strong>
      </div>
      <p>数据量较大时可能需要数秒，请不要重复点击。</p>
    </section>
  `;
  if (!ui.twoWeekReviewDialog.open) {
    ui.twoWeekReviewDialog.showModal();
  }
}

function updateTwoWeekProgress(percent, stage, title = "") {
  const safePercent = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
  const bar = document.getElementById("twoWeekProgressBar");
  const fill = document.getElementById("twoWeekProgressFill");
  const stageNode = document.getElementById("twoWeekProgressStage");
  const percentNode = document.getElementById("twoWeekProgressPercent");
  const titleNode = document.getElementById("twoWeekProgressTitle");

  if (bar) bar.setAttribute("aria-valuenow", String(safePercent));
  if (fill) fill.style.width = `${safePercent}%`;
  if (stageNode) stageNode.textContent = stage || "";
  if (percentNode) percentNode.textContent = `${safePercent}%`;
  if (title && titleNode) titleNode.textContent = title;
}

function ensureTaskProgressOverlay() {
  let overlay = document.getElementById("taskProgressOverlay");
  if (overlay) {
    return overlay;
  }
  overlay = document.createElement("div");
  overlay.id = "taskProgressOverlay";
  overlay.className = "task-progress-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="task-progress-panel" role="alert" aria-live="polite">
      <div class="two-week-loading-spinner" aria-hidden="true"></div>
      <div>
        <h3 id="taskProgressTitle">正在处理</h3>
        <p id="taskProgressStage">准备中</p>
      </div>
      <div class="task-progress-shell" role="progressbar"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
           id="taskProgressBar">
        <div class="task-progress-fill" id="taskProgressFill"></div>
      </div>
      <div class="task-progress-foot">
        <span>任务较大时请稍等，不要重复点击。</span>
        <strong id="taskProgressPercent">0%</strong>
      </div>
    </section>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function showTaskProgress(title = "正在处理", stage = "准备中", percent = 0) {
  const overlay = ensureTaskProgressOverlay();
  overlay.hidden = false;
  updateTaskProgress(percent, stage, title);
}

function updateTaskProgress(percent, stage = "", title = "") {
  const overlay = ensureTaskProgressOverlay();
  const safePercent = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
  const titleNode = document.getElementById("taskProgressTitle");
  const stageNode = document.getElementById("taskProgressStage");
  const bar = document.getElementById("taskProgressBar");
  const fill = document.getElementById("taskProgressFill");
  const percentNode = document.getElementById("taskProgressPercent");
  if (title && titleNode) titleNode.textContent = title;
  if (stageNode) stageNode.textContent = stage || "";
  if (bar) bar.setAttribute("aria-valuenow", String(safePercent));
  if (fill) fill.style.width = `${safePercent}%`;
  if (percentNode) percentNode.textContent = `${safePercent}%`;
  overlay.hidden = false;
}

async function stepTaskProgress(percent, stage, title = "") {
  updateTaskProgress(percent, stage, title);
  await waitForBrowserPaint();
}

async function closeTaskProgress(finalStage = "完成", delay = 120) {
  const overlay = document.getElementById("taskProgressOverlay");
  if (!overlay) return;
  updateTaskProgress(100, finalStage);
  await waitForBrowserPaint();
  if (delay) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  overlay.hidden = true;
}

function formatTwoWeekBlockingErrors(items, limit = 24) {
  const unique = [...new Set((items || []).filter(Boolean).map(String))];
  const visible = unique.slice(0, limit);
  const remaining = unique.length - visible.length;
  return `${visible.map((item) => `- ${item}`).join("\n")}${remaining > 0 ? `\n- 其余 ${remaining} 项请在资料中继续检查。` : ""}`;
}

function showTwoWeekGenerationError(error, prefix = "生成2周报告失败") {
  console.error(prefix, error);
  ui.confirmTwoWeekPlan.hidden = true;
  ui.twoWeekReviewTitle.textContent = prefix;
  ui.twoWeekReviewMeta.textContent = "程序捕获到了运行错误，没有继续保存排班。";
  ui.twoWeekReviewContent.innerHTML = `
    <section class="two-week-error-panel">
      <h3>无法完成本次重新排列</h3>
      <p>${escapeHtml(error?.message || String(error || "未知错误"))}</p>
      <p>请关闭窗口后检查患者、机器和医护资料，再重新尝试。</p>
    </section>
  `;
  if (!ui.twoWeekReviewDialog.open) {
    ui.twoWeekReviewDialog.showModal();
  }
}

async function buildFreshTwoWeekPlan() {
  updateTwoWeekProgress(5, "读取患者、机器和医护资料");
  await waitForBrowserPaint();

  updateTwoWeekProgress(18, "生成第1周和第2周患者排班");
  await waitForBrowserPaint();
  const patientResult = buildTwoWeekPatientSchedules();
  if (patientResult.blocking?.length) {
    return { ok: false, blocking: patientResult.blocking };
  }

  updateTwoWeekProgress(55, "分配血滤、机位和治疗班次");
  await waitForBrowserPaint();

  updateTwoWeekProgress(72, "安排医生、责任护士和后备护士");
  await waitForBrowserPaint();
  const staffResult = buildTwoWeekStaffSchedules(patientResult);
  if (staffResult.blocking?.length) {
    return { ok: false, blocking: staffResult.blocking };
  }

  updateTwoWeekProgress(88, "执行循环边界与安全检查");
  await waitForBrowserPaint();
  const safetyErrors = [
    ...validateGeneratedWeeklySafety(patientResult.week1, staffResult.week1).map((item) => `第1周：${item}`),
    ...validateGeneratedWeeklySafety(patientResult.week2, staffResult.week2).map((item) => `第2周：${item}`),
  ];
  if (safetyErrors.length) {
    return { ok: false, blocking: safetyErrors };
  }

  const review = buildTwoWeekReview(patientResult, staffResult);

  updateTwoWeekProgress(96, "整理2周人工复核报告");
  await waitForBrowserPaint();

  const result = {
    ok: true,
    plan: {
      patientSchedules: {
        week1: patientResult.week1,
        week2: patientResult.week2,
      },
      staffSchedules: {
        week1: staffResult.week1,
        week2: staffResult.week2,
      },
      fixedMachineAssignments: patientResult.fixedMachineAssignments || {},
      review,
    },
  };

  updateTwoWeekProgress(100, "排班与报告生成完成");
  await waitForBrowserPaint();
  return result;
}

async function generateTwoWeekPlan() {
  if (ui.generateTwoWeekPlan.disabled) {
    return;
  }

  ui.generateTwoWeekPlan.disabled = true;
  showTwoWeekLoadingDialog("正在生成全新的第1周和第2周排班……");
  await waitForBrowserPaint();

  try {
    const freshResult = await buildFreshTwoWeekPlan();
    if (!freshResult.ok) {
      const details = formatTwoWeekBlockingErrors(freshResult.blocking || []);
      throw new Error(details || "存在无法继续排班的安全冲突。");
    }

    pendingTwoWeekPlan = freshResult.plan;

    ui.twoWeekReviewDialog.close();
    const approved = await showTwoWeekReview(pendingTwoWeekPlan, true);
    if (!approved) {
      return;
    }

    if (pendingTwoWeekPlan.review.blocking.length) {
      window.alert("存在阻止保存的问题，请先解决后再保存2周循环模板。");
      return;
    }

    await saveTwoWeekCycleTemplate();
  } catch (error) {
    showTwoWeekGenerationError(error, "生成2周排班失败");
  } finally {
    ui.generateTwoWeekPlan.disabled = false;
  }
}

async function saveTwoWeekCycleTemplate({ showProgress = true } = {}) {
  if (showProgress) {
    showTaskProgress("正在保存长期2周循环模板", "准备保存排班数据", 5);
    await waitForBrowserPaint();
  }
  let undoCaptured = false;
  if (pendingTwoWeekPlan) {
    if (showProgress) await stepTaskProgress(18, "保存患者、医护和报告模板");
    undoCaptured = captureUndoSnapshot("保存长期2周循环模板");
    state.twoWeekCycle = {
      patientSchedules: structuredClone(pendingTwoWeekPlan.patientSchedules),
      staffSchedules: structuredClone(pendingTwoWeekPlan.staffSchedules),
      review: structuredClone(pendingTwoWeekPlan.review),
      savedAt: new Date().toISOString(),
      anchorWeekStart: formatDateInput(getWeekStart(parseDateInput(getCurrentDate()))),
    };
    const fixedAt = new Date().toISOString();
    if (showProgress) await stepTaskProgress(45, "固定首次自动分配的机位");
    Object.entries(pendingTwoWeekPlan.fixedMachineAssignments || {}).forEach(([patientId, machineId]) => {
      const patient = findPatient(patientId);
      if (patient && !patient.fixedMachineId && machineId) {
        patient.fixedMachineId = String(machineId);
        patient.fixedMachineLockedAt = fixedAt;
        patient.updatedAt = fixedAt;
      }
    });
  } else {
    if (showProgress) await stepTaskProgress(18, "读取当前正在编辑的2周排班");
    copyWeeklyViewBackToCycle();
    const hasAnyPlan = ["week1", "week2"].some((weekKey) =>
      Object.keys(state.twoWeekCycle?.patientSchedules?.[weekKey] || {}).length,
    );
    if (!hasAnyPlan) {
      if (showProgress) await closeTaskProgress("没有可保存的2周排班", 0);
      window.alert("当前没有可保存的2周排班，请先生成2周排班。");
      return;
    }
    if (showProgress) await stepTaskProgress(45, "重新整理当前2周报告");
    undoCaptured = captureUndoSnapshot("保存长期2周循环模板");
    const currentReview = buildCurrentTwoWeekReview();
    if (currentReview) {
      state.twoWeekCycle.review = structuredClone(currentReview);
    }
    state.twoWeekCycle.anchorWeekStart = state.twoWeekCycle.anchorWeekStart || getAnchorWeekStartForActiveCycle();
    state.twoWeekCycle.savedAt = new Date().toISOString();
  }
  if (!undoCaptured) {
    captureUndoSnapshot("保存长期2周循环模板");
  }
  if (showProgress) await stepTaskProgress(70, "写入本地保存数据");
  saveState();
  pendingTwoWeekPlan = null;
  if (showProgress) await stepTaskProgress(85, "刷新本周和下周视图");
  syncCycleWeekToWeeklyView();
  refreshScheduleView();
  if (showProgress) await closeTaskProgress("长期2周循环模板已保存");
  showToast("长期2周循环模板已保存：第1周 → 第2周 → 第1周持续循环");
}

function getAnchorWeekStartForActiveCycle(dateValue = getCurrentDate()) {
  const selectedWeekStart = getWeekStart(parseDateInput(dateValue || formatDateInput(new Date())));
  return formatDateInput(activeCycleWeek === 2 ? addDays(selectedWeekStart, -7) : selectedWeekStart);
}

function buildCurrentTwoWeekReview() {
  // 先把当前正在编辑的周写回2周循环数据，确保报告反映最新修改。
  copyWeeklyViewBackToCycle();

  const patientResult = {
    week1: structuredClone(state.twoWeekCycle?.patientSchedules?.week1 || {}),
    week2: structuredClone(state.twoWeekCycle?.patientSchedules?.week2 || {}),
    warnings: [],
    blocking: [],
  };
  const staffResult = {
    week1: structuredClone(state.twoWeekCycle?.staffSchedules?.week1 || {}),
    week2: structuredClone(state.twoWeekCycle?.staffSchedules?.week2 || {}),
    warnings: [],
    blocking: [],
  };

  const hasPatientSchedule =
    Object.keys(patientResult.week1).length > 0 ||
    Object.keys(patientResult.week2).length > 0;

  if (!hasPatientSchedule) {
    return null;
  }

  return buildTwoWeekReview(patientResult, staffResult);
}

async function openStoredTwoWeekReview() {
  if (ui.openTwoWeekReview.disabled) {
    return;
  }

  ui.openTwoWeekReview.disabled = true;
  showTaskProgress("正在生成当前2周排班报告", "读取当前2周循环数据", 8);
  await waitForBrowserPaint();
  try {
    await stepTaskProgress(30, "整理患者、机位和医护明细");
    const review = buildCurrentTwoWeekReview();
    if (!review) {
      await closeTaskProgress("没有可生成报告的数据", 0);
      window.alert("当前没有可生成报告的2周排班，请先生成或手动保存2周排班。");
      return;
    }
    await stepTaskProgress(72, "生成护士长结论和复核表格");
    showTwoWeekReview({ review }, false, "当前排班报告");
    await closeTaskProgress("当前2周报告已生成", 80);
  } catch (error) {
    await closeTaskProgress("生成报告失败", 0);
    showTwoWeekGenerationError(error, "生成当前2周排班报告失败");
  } finally {
    ui.openTwoWeekReview.disabled = false;
  }
}

async function runScheduleSelfCheck() {
  if (ui.runScheduleSelfCheck.disabled) {
    return;
  }

  ui.runScheduleSelfCheck.disabled = true;
  showTaskProgress("正在执行排班自检", "读取当前2周排班", 8);
  await waitForBrowserPaint();
  try {
    await stepTaskProgress(28, "检查患者治疗、血滤和机器分区");
    const review = buildCurrentTwoWeekReview();
    if (!review) {
      await closeTaskProgress("没有可自检的数据", 0);
      window.alert("当前没有可自检的2周排班，请先生成或保存2周排班。");
      return;
    }
    await stepTaskProgress(58, "检查强制个性化、医护休息和跨年滚动");
    const selfCheck = buildScheduleSelfCheck(review);
    await stepTaskProgress(82, "生成护士长可读结论");
    showTwoWeekReview({ review }, false, "一键自检");
    ui.twoWeekReviewTitle.textContent = selfCheck.title;
    ui.twoWeekReviewMeta.innerHTML = renderSelfCheckMeta(selfCheck);
    ui.twoWeekReviewContent.innerHTML = `${renderSelfCheckSummary(selfCheck)}${ui.twoWeekReviewContent.innerHTML}`;
    await closeTaskProgress("排班自检完成", 80);
  } catch (error) {
    await closeTaskProgress("排班自检失败", 0);
    showTwoWeekGenerationError(error, "排班自检失败");
  } finally {
    ui.runScheduleSelfCheck.disabled = false;
  }
}

function buildScheduleSelfCheck(review) {
  const scheduledPatients = review.patientRows.filter((row) => row.sessions.length > 0).length;
  const hdfMatched = review.stats.hdfTargetCount === review.stats.hdfActualCount;
  const assessment = buildTwoWeekRunAssessment(review, scheduledPatients, hdfMatched);
  const safety = collectCurrentTwoWeekSafetyFindings();
  const forcePreferredWarnings = collectForcedPreferredDayWarnings(review);
  const staffWarnings = collectStaffRestWarnings(review);
  const crossYear = buildCrossYearCycleCheck();
  const blocking = dedupeMessages([...(review.blocking || []), ...safety.errors]);
  const warnings = dedupeMessages([
    ...(review.warnings || []),
    ...safety.warnings,
    ...forcePreferredWarnings,
    ...staffWarnings,
  ]);
  const tone = blocking.length ? "danger" : warnings.length ? "warning" : "ok";
  const title = tone === "danger"
    ? "自检结论：暂时不能长期运行"
    : tone === "warning"
      ? "自检结论：可以运行，但护士长需要先复核"
      : "自检结论：可以长期2周循环运行";
  const detail = tone === "danger"
    ? "系统发现会影响安全保存或长期循环的问题，请先处理红色阻止项。"
    : tone === "warning"
      ? "患者治疗和机器安全没有阻止项，但有提醒项，建议护士长确认后再长期使用。"
      : "患者治疗、血滤目标、机器分区、医护排班和日期滚动均通过本次检查。";
  return {
    tone,
    title,
    detail,
    blocking,
    warnings,
    assessment,
    crossYear,
    cards: [
      {
        label: "患者治疗",
        value: `${review.stats.treatmentCount}/${review.stats.expectedTreatmentCount || review.stats.treatmentCount}`,
        detail: `${scheduledPatients}/${review.stats.patientCount}名患者已排入`,
        tone: assessment.checks[0]?.tone || "ok",
      },
      {
        label: "血滤目标",
        value: `${review.stats.hdfActualCount}/${review.stats.hdfTargetCount}`,
        detail: hdfMatched ? "次数一致" : "需要复核",
        tone: hdfMatched ? "ok" : "warning",
      },
      {
        label: "安全校验",
        value: blocking.length ? `${blocking.length}项阻止` : "通过",
        detail: blocking.length ? "先处理红色问题" : "机器、分区、医护引用无阻止项",
        tone: blocking.length ? "danger" : "ok",
      },
      {
        label: "运行提醒",
        value: warnings.length ? `${warnings.length}项提醒` : "无提醒",
        detail: warnings.length ? "建议护士长复核" : "未发现额外提醒",
        tone: warnings.length ? "warning" : "ok",
      },
      {
        label: "跨年滚动",
        value: crossYear.ok ? "通过" : "需复核",
        detail: crossYear.detail,
        tone: crossYear.ok ? "ok" : "warning",
      },
    ],
  };
}

function collectCurrentTwoWeekSafetyFindings() {
  const patientWeek1 = structuredClone(state.twoWeekCycle?.patientSchedules?.week1 || {});
  const patientWeek2 = structuredClone(state.twoWeekCycle?.patientSchedules?.week2 || {});
  const staffWeek1 = structuredClone(state.twoWeekCycle?.staffSchedules?.week1 || {});
  const staffWeek2 = structuredClone(state.twoWeekCycle?.staffSchedules?.week2 || {});
  const errors = [
    ...validateGeneratedWeeklySafety(patientWeek1, staffWeek1).map((item) => `第1周：${item}`),
    ...validateGeneratedWeeklySafety(patientWeek2, staffWeek2).map((item) => `第2周：${item}`),
  ];
  return { errors: dedupeMessages(errors), warnings: [] };
}

function collectForcedPreferredDayWarnings(review) {
  return (review.patientRows || []).flatMap((row) => {
    const patient = findPatient(row.patientId);
    if (!patient?.forcePreferredDays) return [];
    const allowed = new Set((patient.preferredDays || []).map(String).filter((dayKey) => WORKING_DAY_KEYS.includes(dayKey)));
    if (!allowed.size) {
      return [`${row.name} 已开启强制个性化，但没有勾选可用的星期几。`];
    }
    const moved = row.sessions.filter((session) => !allowed.has(String(session.dayKey)));
    if (!moved.length) return [];
    const detail = moved
      .map((session) => `第${session.weekNumber}周${getWeekDayLabel(session.dayKey)}${SHIFT_LABELS[session.shift]}${session.machineId}号机`)
      .join("、");
    return [`${row.name} 已开启强制个性化，但仍被排到非勾选日期：${detail}。`];
  });
}

function collectStaffRestWarnings(review) {
  const rows = (review.staffRows || []).filter((row) => row.shiftCount > 0);
  if (!rows.length) {
    return ["最近2周没有医护排班，请补全医护后再长期运行。"];
  }
  const minRest = Math.min(...rows.map((row) => row.restDays));
  if (minRest <= 2) {
    const names = rows.filter((row) => row.restDays === minRest).map((row) => row.name).slice(0, 6).join("、");
    return [`医护完整休息日偏少：${names} 最近2周只有${minRest}天完整休息。`];
  }
  return [];
}

function buildCrossYearCycleCheck() {
  try {
    const currentYear = new Date().getFullYear();
    const weekStart = getWeekStart(new Date(currentYear, 11, 29));
    const first = formatDateInput(weekStart);
    const last = formatDateInput(addDays(weekStart, 13));
    const includesYearChange = first.slice(0, 4) !== last.slice(0, 4);
    const labels = [0, 7, 13].map((offset) => formatDateLabel(formatDateInput(addDays(weekStart, offset))));
    return {
      ok: includesYearChange && labels.length === 3,
      detail: `${labels[0]}到${labels[2]}可连续显示`,
    };
  } catch (error) {
    return { ok: false, detail: "跨年日期预览失败，请人工复核" };
  }
}

function renderSelfCheckMeta(selfCheck) {
  const chips = [
    '<span class="two-week-review-meta-label">一键自检</span>',
    `<span class="two-week-review-chip ${escapeHtml(selfCheck.tone)}">${escapeHtml(selfCheck.title.replace("自检结论：", ""))}</span>`,
    `<span class="two-week-review-chip ${selfCheck.blocking.length ? "danger" : "ok"}">${escapeHtml(selfCheck.blocking.length ? `${selfCheck.blocking.length}项阻止` : "无阻止项")}</span>`,
    `<span class="two-week-review-chip ${selfCheck.warnings.length ? "warning" : "ok"}">${escapeHtml(selfCheck.warnings.length ? `${selfCheck.warnings.length}项提醒` : "无提醒")}</span>`,
    `<span class="two-week-review-chip ${selfCheck.crossYear.ok ? "ok" : "warning"}">${escapeHtml(selfCheck.crossYear.ok ? "跨年通过" : "跨年需复核")}</span>`,
  ];
  return chips.join("");
}

function renderSelfCheckSummary(selfCheck) {
  const problemItems = [
    ...selfCheck.blocking.map((item) => ({ tone: "danger", label: "阻止", text: item })),
    ...selfCheck.warnings.map((item) => ({ tone: "warning", label: "提醒", text: item })),
  ];
  return `
    <section class="self-check-summary ${escapeHtml(selfCheck.tone)}">
      <div class="self-check-heading">
        <span>护士长建议</span>
        <h3>${escapeHtml(selfCheck.title)}</h3>
        <p>${escapeHtml(selfCheck.detail)}</p>
      </div>
      <div class="self-check-card-grid">
        ${selfCheck.cards.map((card) => `
          <article class="${escapeHtml(card.tone || "ok")}">
            <span>${escapeHtml(card.label)}</span>
            <strong>${escapeHtml(card.value)}</strong>
            <em>${escapeHtml(card.detail)}</em>
          </article>
        `).join("")}
      </div>
      <div class="self-check-problems">
        ${problemItems.length
          ? problemItems.slice(0, 12).map((item) => `
            <p class="${escapeHtml(item.tone)}"><b>${escapeHtml(item.label)}</b>${escapeHtml(item.text)}</p>
          `).join("")
          : `<p class="ok"><b>通过</b>没有发现需要提前处理的问题。</p>`}
        ${problemItems.length > 12 ? `<p class="warning"><b>提醒</b>还有${escapeHtml(problemItems.length - 12)}项未显示，请看下方报告明细。</p>` : ""}
      </div>
    </section>
  `;
}

function showTwoWeekReview(plan, confirmMode = false, sourceLabel = "全新自动重排") {
  const review = plan?.review;
  if (!review) {
    window.alert("2周总结数据为空，请重新生成2周排班。");
    return Promise.resolve(false);
  }
  ui.twoWeekReviewTitle.textContent = confirmMode
    ? "请复核：新生成2周排班"
    : "请复核：当前2周排班报告";
  const runAssessment = getTwoWeekRunAssessmentForReview(review);
  ui.twoWeekReviewMeta.innerHTML = renderTwoWeekReviewHeaderMeta(review, sourceLabel, confirmMode);
  ui.twoWeekReviewContent.innerHTML = renderTwoWeekReview(review, confirmMode, runAssessment);
  configureTwoWeekApplyControls(runAssessment, confirmMode);
  ui.twoWeekReviewDialog.showModal();
  if (!confirmMode) return Promise.resolve(false);
  return new Promise((resolve) => {
    pendingTwoWeekResolver = resolve;
  });
}

function getTwoWeekRunAssessmentForReview(review) {
  const scheduledPatients = review.patientRows.filter((row) => row.sessions.length > 0).length;
  const hdfMatched = review.stats.hdfTargetCount === review.stats.hdfActualCount;
  return buildTwoWeekRunAssessment(review, scheduledPatients, hdfMatched);
}

function configureTwoWeekApplyControls(runAssessment, confirmMode = false) {
  ui.confirmTwoWeekPlan.hidden = !confirmMode;
  ui.confirmTwoWeekPlan.disabled = Boolean(confirmMode && !runAssessment.canApply);
  ui.confirmTwoWeekPlan.textContent = runAssessment.canApply
    ? "应用为长期2周循环"
    : "暂不能应用：先处理阻止项";
}

function renderTwoWeekReviewHeaderMeta(review, sourceLabel, confirmMode = false) {
  const blockingCount = review?.blocking?.length || 0;
  const warningCount = review?.warnings?.length || 0;
  const issueClass = blockingCount ? "danger" : warningCount ? "warning" : "ok";
  const issueText = blockingCount
    ? `${blockingCount}项阻止保存`
    : warningCount
      ? `${warningCount}项需留意`
      : "无阻止项";
  const actionText = confirmMode ? "复核通过后保存模板" : "仅生成报告，不重新排班";
  const chips = [
    { text: sourceLabel, className: "source" },
    { text: "2周循环模板" },
    { text: `策略：${getSchedulePriorityLabel(state.settings.schedulePriority)}` },
    { text: `护士：${getStaffWorkModeLabel()}` },
    { text: issueText, className: issueClass },
    { text: actionText, className: "action" },
  ];
  return [
    '<span class="two-week-review-meta-label">审核重点</span>',
    ...chips.map(({ text, className = "" }) =>
      `<span class="two-week-review-chip ${escapeHtml(className)}">${escapeHtml(text)}</span>`
    ),
  ].join("");
}

function closeTwoWeekReview(approved = false) {
  if (ui.twoWeekReviewDialog.open) ui.twoWeekReviewDialog.close();
  const resolver = pendingTwoWeekResolver;
  pendingTwoWeekResolver = null;
  if (resolver) resolver(Boolean(approved));
}

function renderTwoWeekReview(review, confirmMode = false, runAssessment = null) {
  const scheduledPatients = review.patientRows.filter((row) => row.sessions.length > 0).length;
  const unscheduledPatients = review.stats.patientCount - scheduledPatients;
  const hdfMatched = review.stats.hdfTargetCount === review.stats.hdfActualCount;
  const assessment = runAssessment || buildTwoWeekRunAssessment(review, scheduledPatients, hdfMatched);
  const summaryText = [
    `本次2周循环共纳入 ${review.stats.patientCount} 名患者，实际排入 ${scheduledPatients} 名`,
    `治疗 ${review.stats.treatmentCount}/${review.stats.expectedTreatmentCount || review.stats.treatmentCount} 人次`,
    `血滤 ${review.stats.hdfActualCount}/${review.stats.hdfTargetCount} 次`,
    `医护 ${review.stats.staffCount} 人参与排班`,
  ].join("；") + "。";
  const statusCards = [
    { label: "纳入患者", value: review.stats.patientCount, detail: `已排 ${scheduledPatients} 人`, tone: unscheduledPatients ? "danger" : "ok" },
    { label: "治疗人次", value: `${review.stats.treatmentCount}/${review.stats.expectedTreatmentCount || review.stats.treatmentCount}`, detail: "实际/应排" },
    { label: "血滤完成", value: `${review.stats.hdfActualCount}/${review.stats.hdfTargetCount}`, detail: hdfMatched ? "目标一致" : "需核对", tone: hdfMatched ? "ok" : "warning" },
    { label: "医护人数", value: review.stats.staffCount, detail: "医生+护士" },
    { label: "阻止项", value: review.blocking.length, detail: review.blocking.length ? "不能直接保存" : "可继续复核", tone: review.blocking.length ? "danger" : "ok" },
    { label: "提醒项", value: review.warnings.length, detail: review.warnings.length ? "请人工确认" : "暂无提醒", tone: review.warnings.length ? "warning" : "ok" },
  ];
  const issueItems = [
    ...review.blocking.map((item) => ({ ...simplifyTwoWeekReviewIssue(item, review), tone: "danger", label: "阻止" })),
    ...review.warnings.map((item) => ({ ...simplifyTwoWeekReviewIssue(item, review), tone: "warning", label: "提醒" })),
  ];
  const issueHtml = issueItems.length
    ? issueItems.map((item) => `
      <div class="two-week-issue ${item.tone}">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${item.html ? item.text : escapeHtml(item.text)}</span>
      </div>
    `).join("")
    : '<div class="two-week-issue ok"><strong>通过</strong><span>未发现2周循环边界阻止项，仍需人工复核患者和医护明细。</span></div>';
  const patientCards = renderTwoWeekPatientCards(review.patientRows);
  const staffCards = renderTwoWeekStaffCards(review.staffRows);

  return `
    <section class="two-week-report-hero">
      <div>
        <h3>本次排班报告</h3>
        <p>${escapeHtml(summaryText)}</p>
      </div>
      <div class="two-week-review-stats">
        ${statusCards.map((card) => `
          <article class="${escapeHtml(card.tone || "")}">
            <span>${escapeHtml(card.label)}</span>
            <strong>${escapeHtml(String(card.value))}</strong>
            <em>${escapeHtml(card.detail)}</em>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="two-week-run-assessment ${escapeHtml(assessment.tone)}">
      <div>
        <span class="two-week-run-eyebrow">护士长结论</span>
        <h3>${escapeHtml(assessment.title)}</h3>
        <p>${escapeHtml(assessment.summary)}</p>
        <p class="two-week-strategy-advice">${escapeHtml(assessment.strategyAdvice)}</p>
        ${renderTwoWeekApplyPanel(assessment, confirmMode)}
      </div>
      <div class="two-week-run-checks">
        ${assessment.checks.map((check) => `
          <article class="${escapeHtml(check.tone)}">
            <span>${escapeHtml(check.label)}</span>
            <strong>${escapeHtml(check.value)}</strong>
            <em>${escapeHtml(check.detail)}</em>
            ${check.facts?.length ? `
              <ul>
                ${check.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}
              </ul>
            ` : ""}
          </article>
        `).join("")}
      </div>
    </section>
    <section class="two-week-review-section">
      <h3>需要先看的问题</h3>
      <div class="two-week-issue-list">${issueHtml}</div>
    </section>
    <section class="two-week-review-section">
      <h3>患者2周治疗明细</h3>
      ${patientCards}
    </section>
    <section class="two-week-review-section">
      <h3>医护2周工作与休息</h3>
      ${staffCards}
    </section>
  `;
}

function renderTwoWeekPatientCards(rows = []) {
  if (!rows.length) {
    return '<div class="two-week-empty-note">暂无患者排班</div>';
  }
  return `
    <div class="two-week-person-card-grid patient-cards">
      ${rows.map(renderTwoWeekPatientCard).join("")}
    </div>
  `;
}

function renderTwoWeekPatientCard(row) {
  const treatmentOk = row.sessions.length >= row.targetTreatmentCount;
  const hdfOk = row.actualHdfCount >= row.targetHdfCount;
  return `
    <article class="two-week-person-card ${treatmentOk && hdfOk ? "ok" : "warning"}">
      <div class="two-week-person-card-head">
        <div>
          <strong>${escapeHtml(row.name)}</strong>
          <span>${escapeHtml(`${row.sessions.length}/${row.targetTreatmentCount}次治疗 · 血滤${row.actualHdfCount}/${row.targetHdfCount}`)}</span>
        </div>
        <div class="two-week-card-badges">
          <span class="two-week-card-badge ${treatmentOk ? "ok" : "warning"}">${escapeHtml(treatmentOk ? "治疗达标" : "治疗不足")}</span>
          <span class="two-week-card-badge ${hdfOk ? "ok" : "warning"}">${escapeHtml(hdfOk ? "血滤达标" : "血滤不足")}</span>
        </div>
      </div>
      ${renderTwoWeekCardWeekLine(row.sessions, 1, "patient")}
      ${renderTwoWeekCardWeekLine(row.sessions, 2, "patient")}
    </article>
  `;
}

function renderTwoWeekStaffCards(rows = []) {
  if (!rows.length) {
    return '<div class="two-week-empty-note">暂无医护排班</div>';
  }
  return `
    <div class="two-week-person-card-grid staff-cards">
      ${rows.map(renderTwoWeekStaffCard).join("")}
    </div>
  `;
}

function renderTwoWeekStaffCard(row) {
  const roleLabel = row.role === "doctor" ? "医生" : "护士";
  const loadTone = row.shiftCount === 0 ? "rest" : row.restDays >= 6 ? "ok" : row.restDays <= 2 ? "warning" : "neutral";
  return `
    <article class="two-week-person-card staff ${loadTone}">
      <div class="two-week-person-card-head">
        <div>
          <strong>${escapeHtml(row.name)}</strong>
          <span>${escapeHtml(`${roleLabel} · ${row.shiftCount}个半日班 · 工作${row.workedDays}天 · 休息${row.restDays}天`)}</span>
        </div>
        <div class="two-week-card-badges">
          <span class="two-week-card-badge neutral">${escapeHtml(`${row.fullDays}天整日`)}</span>
          <span class="two-week-card-badge ${loadTone}">${escapeHtml(row.shiftCount ? `${row.restDays}天休息` : "本轮无班")}</span>
        </div>
      </div>
      ${renderTwoWeekCardWeekLine(row.duties, 1, "staff")}
      ${renderTwoWeekCardWeekLine(row.duties, 2, "staff")}
    </article>
  `;
}

function renderTwoWeekCardWeekLine(items = [], weekNumber = 1, type = "patient") {
  return `
    <div class="two-week-card-week-line">
      <span class="two-week-card-week-label">第${weekNumber}周</span>
      ${WORKING_DAY_KEYS.map((dayKey) => renderTwoWeekCardDayCell(items, weekNumber, dayKey, type)).join("")}
    </div>
  `;
}

function renderTwoWeekCardDayCell(items = [], weekNumber, dayKey, type) {
  const dayItems = items.filter((item) => Number(item.weekNumber) === Number(weekNumber) && String(item.dayKey) === String(dayKey));
  if (!dayItems.length) {
    return `
      <div class="two-week-card-day rest">
        <b>${escapeHtml(getWeekDayLabel(dayKey))}</b>
        <span>休</span>
      </div>
    `;
  }
  const tone = type === "patient"
    ? dayItems.some((item) => normalizeMachineType(item.treatmentType) === "hemofiltration") ? "hdf" : "patient"
    : dayItems.some((item) => String(item.role || "").includes("后备")) ? "backup" : "staff";
  return `
    <div class="two-week-card-day ${escapeHtml(tone)}">
      <b>${escapeHtml(getWeekDayLabel(dayKey))}</b>
      <div class="two-week-card-day-items">
        ${dayItems.map((item) => type === "patient"
          ? renderTwoWeekPatientCardItem(item)
          : renderTwoWeekStaffCardItem(item)
        ).join("")}
      </div>
    </div>
  `;
}

function renderTwoWeekPatientCardItem(session) {
  const treatmentType = normalizeMachineType(session.treatmentType);
  const treatmentLabel = getTreatmentLabel(treatmentType);
  return `
    <span class="${treatmentType === "hemofiltration" ? "hdf" : ""}">
      ${escapeHtml(`${SHIFT_LABELS[session.shift] || ""} ${session.machineId}号机 ${treatmentLabel}`)}
    </span>
  `;
}

function renderTwoWeekStaffCardItem(duty) {
  const shortRole = String(duty.role || "")
    .replace("负责：", "")
    .replace(" · ", " ");
  return `<span>${escapeHtml(`${SHIFT_LABELS[duty.shift] || ""} ${shortRole}`)}</span>`;
}

function renderTwoWeekApplyPanel(assessment, confirmMode = false) {
  const disabled = assessment.canApply ? "" : " disabled";
  const mode = confirmMode ? "pending" : "current";
  return `
    <div class="two-week-apply-panel ${escapeHtml(assessment.tone)}">
      <div>
        <strong>${escapeHtml(assessment.applyTitle)}</strong>
        <span>${escapeHtml(assessment.applyDetail)}</span>
      </div>
      <button class="${assessment.canApply ? "primary-button" : "ghost-button"}" type="button"
              data-two-week-apply="${escapeHtml(mode)}"${disabled}>
        ${escapeHtml(assessment.applyButtonText)}
      </button>
    </div>
  `;
}

function handleTwoWeekReviewContentClick(event) {
  const button = event.target.closest("[data-two-week-apply]");
  if (!button || button.disabled) return;
  if (button.dataset.twoWeekApply === "pending") {
    closeTwoWeekReview(true);
    return;
  }
  applyCurrentTwoWeekCycleFromReview();
}

async function applyCurrentTwoWeekCycleFromReview() {
  const review = buildCurrentTwoWeekReview();
  if (!review) {
    window.alert("当前没有可应用的2周排班，请先生成2周排班。");
    return;
  }
  const assessment = getTwoWeekRunAssessmentForReview(review);
  if (!assessment.canApply) {
    window.alert("当前2周排班还有硬性问题，暂不能应用为长期循环。请先处理阻止项。");
    return;
  }
  await saveTwoWeekCycleTemplate();
  if (ui.twoWeekReviewDialog.open) {
    ui.twoWeekReviewDialog.close();
  }
}

function buildTwoWeekRunAssessment(review, scheduledPatients, hdfMatched, strategyRestComparisonOverride = null) {
  const expectedTreatmentCount = review.stats.expectedTreatmentCount || review.stats.treatmentCount;
  const twoWeekWorkingDays = WORKING_DAY_KEYS.length * 2;
  const twoWeekHalfDaySlots = twoWeekWorkingDays * STAFF_SHIFT_KEYS.length;
  const expectedTreatmentPerWeek = expectedTreatmentCount / 2;
  const actualTreatmentPerWeek = review.stats.treatmentCount / 2;
  const hdfTargetPerWeek = review.stats.hdfTargetCount / 2;
  const hdfActualPerWeek = review.stats.hdfActualCount / 2;
  const treatmentComplete = review.stats.treatmentCount >= expectedTreatmentCount;
  const patientComplete = scheduledPatients === review.stats.patientCount;
  const shortPatients = (review.patientRows || [])
    .filter((row) => row.targetTreatmentCount && row.sessions.length < row.targetTreatmentCount)
    .map((row) => `${row.name}少${row.targetTreatmentCount - row.sessions.length}次`);
  const staffWithDuties = (review.staffRows || []).filter((row) => row.shiftCount > 0);
  const minRestDays = staffWithDuties.length
    ? Math.min(...staffWithDuties.map((row) => row.restDays))
    : 0;
  const maxShiftCount = staffWithDuties.length
    ? Math.max(...staffWithDuties.map((row) => row.shiftCount))
    : 0;
  const unusedNurseCount = (review.staffRows || []).filter((row) => row.role === "nurse" && row.shiftCount === 0).length;
  const totalStaffShiftCount = staffWithDuties.reduce((sum, row) => sum + row.shiftCount, 0);
  const averageStaffShiftCount = staffWithDuties.length ? totalStaffShiftCount / staffWithDuties.length : 0;
  const hdfTargetPatientCount = (review.patientRows || []).filter((row) => row.targetHdfCount > 0).length;
  const hdfShortCount = Math.max(0, review.stats.hdfTargetCount - review.stats.hdfActualCount);
  const blockingCount = review.blocking?.length || 0;
  const warningCount = review.warnings?.length || 0;
  const hasBlocking = Boolean(review.blocking?.length);
  const hasCoreGap = !patientComplete || !treatmentComplete || !hdfMatched;
  const hasWarnings = Boolean(review.warnings?.length);
  const hasStaffLoadWarning = staffWithDuties.length > 0 && minRestDays < 2;
  const needsNurseManagerReview = hasWarnings || hasStaffLoadWarning;
  const strategyRestComparison = strategyRestComparisonOverride || review?.strategyRestComparison || buildTwoWeekStrategyRestComparison();

  let tone = "ok";
  let title = "可以作为长期2周循环运行";
  let summary = "患者治疗、血滤目标、医护覆盖和循环边界都通过。护士长复核明细后，可以按这套2周循环执行。";
  let applyTitle = "最终建议：可以应用为长期2周循环";
  let applyDetail = `系统判断这套方案可按“第1周 → 第2周 → 第1周”持续循环；统计周期为2周，周一至周六共${twoWeekWorkingDays}个治疗日。`;
  let applyButtonText = "应用为长期2周循环";

  if (hasBlocking || hasCoreGap) {
    tone = "danger";
    title = "暂不建议持续运行";
    summary = "这套排班还有硬性问题，先不要作为长期循环执行。请先处理未排满、血滤不达标或阻止项。";
    applyTitle = "最终建议：暂不能应用";
    applyDetail = "系统发现硬性问题，应用后可能造成漏排、血滤不足或保存风险。请先处理下方阻止项。";
    applyButtonText = "暂不能应用";
  } else if (needsNurseManagerReview) {
    tone = "warning";
    title = "可以运行，但护士长需要先复核提醒项";
    summary = hasStaffLoadWarning && !hasWarnings
      ? "患者和血滤都已排满，没有阻止保存的问题；但个别医护休息天数偏少，建议护士长确认人员负担后再长期使用。"
      : "患者和血滤都已排满，没有阻止保存的问题；但有策略回退、星期几倾向调整、医护整日优先或人员负担等提醒，建议护士长确认后再长期使用。";
    applyTitle = "最终建议：复核提醒后可以应用";
    applyDetail = `没有阻止长期循环的问题；建议护士长先看完${warningCount}项提醒，再应用为长期2周循环。`;
    applyButtonText = "复核后应用长期2周循环";
  }

  const shortPatientDetail = shortPatients.length
    ? `${shortPatients.slice(0, 4).join("、")}${shortPatients.length > 4 ? `等${shortPatients.length}人` : ""}`
    : "全部达到应排次数";

  return {
    tone,
    title,
    summary,
    canApply: !hasBlocking && !hasCoreGap,
    applyTitle,
    applyDetail,
    applyButtonText,
    strategyAdvice: formatStrategyRestAdvice(strategyRestComparison),
    checks: [
      {
        label: "患者治疗",
        value: `${review.stats.treatmentCount}/${expectedTreatmentCount}`,
        detail: `2周${twoWeekWorkingDays}个治疗日，${scheduledPatients}/${review.stats.patientCount}名患者已排入`,
        facts: [
          `2周应排${expectedTreatmentCount}次，实际${review.stats.treatmentCount}次`,
          `折合每周应排${formatOneDecimal(expectedTreatmentPerWeek)}次，实际${formatOneDecimal(actualTreatmentPerWeek)}次`,
          patientComplete && treatmentComplete ? "所有患者达到应排次数" : shortPatientDetail,
          unscheduledPatientsText(review.stats.patientCount - scheduledPatients),
        ],
        tone: patientComplete && treatmentComplete ? "ok" : "danger",
      },
      {
        label: "血滤目标",
        value: `${review.stats.hdfActualCount}/${review.stats.hdfTargetCount}`,
        detail: hdfMatched ? "2周目标一致" : "请补足血滤",
        facts: [
          `2周血滤目标${review.stats.hdfTargetCount}次，实际${review.stats.hdfActualCount}次`,
          `折合每周目标${formatOneDecimal(hdfTargetPerWeek)}次，实际${formatOneDecimal(hdfActualPerWeek)}次`,
          hdfTargetPatientCount ? `涉及${hdfTargetPatientCount}名血滤患者` : "本轮没有血滤目标患者",
          `血滤差额${hdfShortCount}次`,
          hdfMatched ? "同患者同机器会尽量保持" : `还差${hdfShortCount}次血滤`,
        ],
        tone: hdfMatched ? "ok" : "danger",
      },
      {
        label: "医护负担",
        value: staffWithDuties.length ? `最多${maxShiftCount}个半日班` : "未排医护",
        detail: staffWithDuties.length ? `2周${twoWeekHalfDaySlots}个半日窗口，最少${minRestDays}天整日休息` : "请检查医护排班",
        facts: staffWithDuties.length ? [
          "上午1班、下午1班，整日2班",
          `2周总计${totalStaffShiftCount}个半日岗位，平均${formatOneDecimal(averageStaffShiftCount)}个/人`,
          `折合每周${formatOneDecimal(totalStaffShiftCount / 2)}个半日岗位`,
          `当前护士上班方式：${getStaffWorkModeLabel()}`,
          `本轮完全无班护士${unusedNurseCount}名`,
          "休息天指周一至周六全天无班",
        ] : [],
        tone: staffWithDuties.length ? hasStaffLoadWarning ? "warning" : "ok" : "danger",
      },
      {
        label: "运行风险",
        value: hasBlocking ? `${blockingCount}项阻止` : hasWarnings ? `${warningCount}项提醒` : hasStaffLoadWarning ? "医护需复核" : "无提醒",
        detail: hasBlocking ? "先处理后再运行" : needsNurseManagerReview ? "复核后可运行" : "可持续运行",
        facts: [
          `按2周循环边界检查：第2周后回到第1周`,
          blockingCount ? `阻止项${blockingCount}个，不能直接保存` : "没有阻止保存的问题",
          warningCount ? `提醒项${warningCount}个，需要人工确认` : "没有额外提醒项",
          hasBlocking ? "先处理阻止项再保存" : "请先看下方问题列表",
        ],
        tone: hasBlocking ? "danger" : needsNurseManagerReview ? "warning" : "ok",
      },
    ],
  };
}

function unscheduledPatientsText(count) {
  return count > 0 ? `还有${count}名患者未排入` : "没有漏排患者";
}

function formatOneDecimal(value) {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function buildTwoWeekStrategyRestComparison() {
  const originalPriority = state.settings.schedulePriority;
  const originalStaffWorkMode = normalizeStaffWorkMode(state.settings.staffWorkMode);
  const patientSnapshot = structuredClone(state.patients || []);
  const priorities = [SCHEDULE_PRIORITY_PATIENT, SCHEDULE_PRIORITY_STAFF, SCHEDULE_PRIORITY_SMART];
  const staffModes = [STAFF_WORK_MODE_BALANCED, STAFF_WORK_MODE_FULL_DAY, STAFF_WORK_MODE_REST_MAX];
  const results = [];
  const modeResults = [];

  try {
    priorities.forEach((priority) => {
      state.settings.schedulePriority = priority;
      state.settings.staffWorkMode = originalStaffWorkMode;
      const patientResult = buildTwoWeekPatientSchedules();
      if (patientResult.blocking?.length) {
        results.push({
          priority,
          ok: false,
          label: getSchedulePriorityLabel(priority),
          reason: `${patientResult.blocking.length}项患者排班阻止`,
        });
        return;
      }

      const staffResult = buildTwoWeekStaffSchedules(patientResult);
      if (staffResult.blocking?.length) {
        results.push({
          priority,
          ok: false,
          label: getSchedulePriorityLabel(priority),
          reason: `${staffResult.blocking.length}项医护排班阻止`,
        });
        return;
      }

      results.push({
        priority,
        ok: true,
        label: getSchedulePriorityLabel(priority),
        metrics: getTwoWeekNurseRestMetrics(staffResult),
      });
    });

    staffModes.forEach((mode) => {
      state.settings.schedulePriority = originalPriority;
      state.settings.staffWorkMode = mode;
      const patientResult = buildTwoWeekPatientSchedules();
      if (patientResult.blocking?.length) {
        modeResults.push({
          mode,
          ok: false,
          label: getStaffWorkModeLabel(mode),
          reason: `${patientResult.blocking.length}项患者排班阻止`,
        });
        return;
      }

      const staffResult = buildTwoWeekStaffSchedules(patientResult);
      if (staffResult.blocking?.length) {
        modeResults.push({
          mode,
          ok: false,
          label: getStaffWorkModeLabel(mode),
          reason: `${staffResult.blocking.length}项医护排班阻止`,
        });
        return;
      }

      modeResults.push({
        mode,
        ok: true,
        label: getStaffWorkModeLabel(mode),
        metrics: getTwoWeekNurseRestMetrics(staffResult),
      });
    });
  } finally {
    state.settings.schedulePriority = originalPriority;
    state.settings.staffWorkMode = originalStaffWorkMode;
    state.patients = patientSnapshot;
  }

  const valid = results.filter((item) => item.ok && item.metrics);
  const validModes = modeResults.filter((item) => item.ok && item.metrics);
  const orderedModesByRest = [...validModes].sort((left, right) =>
    left.metrics.totalWorkedDays - right.metrics.totalWorkedDays ||
    right.metrics.totalRestDays - left.metrics.totalRestDays ||
    left.metrics.totalHalfDayShifts - right.metrics.totalHalfDayShifts ||
    left.metrics.maxShiftCount - right.metrics.maxShiftCount,
  );
  const orderedModesByUnusedNurses = [...validModes].sort((left, right) =>
    right.metrics.unusedNurseCount - left.metrics.unusedNurseCount ||
    left.metrics.maxShiftCount - right.metrics.maxShiftCount ||
    left.metrics.totalWorkedDays - right.metrics.totalWorkedDays,
  );
  const modeBest = orderedModesByRest[0] || null;
  const modeWorst = orderedModesByRest[orderedModesByRest.length - 1] || null;
  const modeMostUnused = orderedModesByUnusedNurses[0] || null;
  const modeLeastUnused = orderedModesByUnusedNurses[orderedModesByUnusedNurses.length - 1] || null;
  if (!valid.length) {
    return {
      results,
      modeResults,
      best: null,
      worst: null,
      modeBest,
      modeWorst,
      modeMostUnused,
      modeLeastUnused,
      improvedNurseCount: 0,
      extraRestDays: 0,
    };
  }

  const orderedByRest = [...valid].sort((left, right) =>
    left.metrics.totalHalfDayShifts - right.metrics.totalHalfDayShifts ||
    left.metrics.totalWorkedDays - right.metrics.totalWorkedDays ||
    left.metrics.maxShiftCount - right.metrics.maxShiftCount,
  );
  const best = orderedByRest[0];
  const worst = orderedByRest[orderedByRest.length - 1];
  let improvedNurseCount = 0;
  Object.entries(best.metrics.shiftCountByNurseId).forEach(([staffId, bestShiftCount]) => {
    const worstShiftCount = worst.metrics.shiftCountByNurseId[staffId] ?? bestShiftCount;
    if (bestShiftCount < worstShiftCount) improvedNurseCount += 1;
  });
  const savedHalfDayShifts = Math.max(0, worst.metrics.totalHalfDayShifts - best.metrics.totalHalfDayShifts);

  return {
    results,
    best,
    worst,
    modeResults,
    modeBest,
    modeWorst,
    modeMostUnused,
    modeLeastUnused,
    improvedNurseCount,
    savedHalfDayShifts,
    extraRestHalfDays: savedHalfDayShifts,
    extraRestDays: Math.max(0, best.metrics.totalRestDays - worst.metrics.totalRestDays),
    modeExtraRestDays: modeBest && modeWorst ? Math.max(0, modeBest.metrics.totalRestDays - modeWorst.metrics.totalRestDays) : 0,
    modeReducedWorkedDays: modeBest && modeWorst ? Math.max(0, modeWorst.metrics.totalWorkedDays - modeBest.metrics.totalWorkedDays) : 0,
    modeExtraUnusedNurses: modeBest && modeWorst ? Math.max(0, modeBest.metrics.unusedNurseCount - modeWorst.metrics.unusedNurseCount) : 0,
    modeUnusedNurseGain: modeMostUnused && modeLeastUnused ? Math.max(0, modeMostUnused.metrics.unusedNurseCount - modeLeastUnused.metrics.unusedNurseCount) : 0,
  };
}

function getTwoWeekNurseRestMetrics(staffResult) {
  const nurses = state.staffMembers.filter((staff) => staff.role === "nurse" && staff.status === "active");
  const rows = nurses.map((staff) => {
    const workedDays = new Set();
    let shiftCount = 0;
    for (const [weekNumber, staffWeek] of [[1, staffResult.week1], [2, staffResult.week2]]) {
      WORKING_DAY_KEYS.forEach((dayKey) => {
        STAFF_SHIFT_KEYS.forEach((shift) => {
          const entry = staffWeek?.[dayKey]?.[shift] || {};
          if ((entry.nurses || []).includes(staff.id) || entry.backupNurse === staff.id) {
            workedDays.add(`${weekNumber}-${dayKey}`);
            shiftCount += 1;
          }
        });
      });
    }
    return {
      staffId: staff.id,
      name: staff.name,
      workedDays: workedDays.size,
      restDays: Math.max(0, 12 - workedDays.size),
      shiftCount,
    };
  });

  const halfDaySlotsPerNurse = WORKING_DAY_KEYS.length * STAFF_SHIFT_KEYS.length * 2;
  const totalHalfDayShifts = rows.reduce((sum, row) => sum + row.shiftCount, 0);
  const totalRestHalfDays = Math.max(0, rows.length * halfDaySlotsPerNurse - totalHalfDayShifts);

  return {
    nurseCount: rows.length,
    totalHalfDayShifts,
    totalRestHalfDays,
    averageShiftCount: rows.length ? totalHalfDayShifts / rows.length : 0,
    totalRestDays: rows.reduce((sum, row) => sum + row.restDays, 0),
    totalWorkedDays: rows.reduce((sum, row) => sum + row.workedDays, 0),
    unusedNurseCount: rows.filter((row) => row.shiftCount === 0).length,
    minRestDays: rows.length ? Math.min(...rows.map((row) => row.restDays)) : 0,
    maxShiftCount: rows.length ? Math.max(...rows.map((row) => row.shiftCount)) : 0,
    shiftCountByNurseId: rows.reduce((result, row) => {
      result[row.staffId] = row.shiftCount;
      return result;
    }, {}),
    restDaysByNurseId: rows.reduce((result, row) => {
      result[row.staffId] = row.restDays;
      return result;
    }, {}),
  };
}

function formatStrategyRestAdvice(comparison) {
  if (!comparison?.best) {
    return "三种排班策略都没有形成可比较的完整方案，请先处理阻止项。";
  }
  const best = comparison.best;
  const worst = comparison.worst;
  const restSummary = comparison.results
    .filter((item) => item.ok && item.metrics)
    .map((item) => `${item.label}${item.metrics.totalHalfDayShifts}个护士半日班、${item.metrics.totalRestDays}个整日休息`)
    .join("，");
  const strategyText = !worst || best.priority === worst.priority
    ? `三种排班策略对比：${restSummary}。结果：当前数据下三种策略差异不大。`
    : comparison.savedHalfDayShifts > 0
      ? `三种排班策略对比：${restSummary}。护士半日班最少的是${best.label}；相比${worst.label}，可让${comparison.improvedNurseCount}名护士少上半天班，合计少排${comparison.savedHalfDayShifts}个半日班。`
      : `三种排班策略对比：${restSummary}。结果：三种可行策略的护士半日岗位总量相同，主要差别在完整休息日和班次集中程度。`;

  const modeBest = comparison.modeBest;
  const modeWorst = comparison.modeWorst;
  const modeSummary = (comparison.modeResults || [])
    .filter((item) => item.ok && item.metrics)
    .map((item) => `${item.label}${item.metrics.totalRestDays}个整日休息、${item.metrics.unusedNurseCount}名护士本轮无班、最多${item.metrics.maxShiftCount}个半日班/人`)
    .join("，");
  if (!modeBest || !modeWorst || !modeSummary) {
    return `${strategyText} 护士上班方式暂时没有形成可比较结果。`;
  }
  if (modeBest.mode === modeWorst.mode || comparison.modeReducedWorkedDays <= 0) {
    if (comparison.modeUnusedNurseGain > 0 && comparison.modeMostUnused && comparison.modeLeastUnused) {
      return `${strategyText} 护士上班方式对比：${modeSummary}。总整日休息数接近；如果目标是让一部分护士本轮完整休息不来上班，${comparison.modeMostUnused.label}可比${comparison.modeLeastUnused.label}多让${comparison.modeUnusedNurseGain}名护士本轮无班，但最多会到${comparison.modeMostUnused.metrics.maxShiftCount}个半日班/人，护士长需要确认公平性。`;
    }
    return `${strategyText} 护士上班方式对比：${modeSummary}。结果：完整休息日差异不明显，建议按科室公平性选择。`;
  }
  return `${strategyText} 护士上班方式对比：${modeSummary}。完整休息日最多的是${modeBest.label}；相比${modeWorst.label}，可减少${comparison.modeReducedWorkedDays}个“有人来上班的日子”，多出${comparison.modeExtraRestDays}个护士整日休息，另可多让${comparison.modeExtraUnusedNurses}名护士本轮完全不排班。`;
}

function renderTreatmentTagList(sessions = []) {
  if (!sessions.length) return '<span class="two-week-empty-note">未排入</span>';
  return `<div class="two-week-tag-list">${sessions.map((session) => {
    const treatmentType = normalizeMachineType(session.treatmentType);
    const tone = treatmentType === "hemofiltration" ? "hdf" : "";
    const label = formatTwoWeekReviewTreatmentLabel(session, `${session.machineId}号机 ${getTreatmentLabel(treatmentType)}`);
    return `<span class="two-week-detail-tag ${tone}">${escapeHtml(label)}</span>`;
  }).join("")}</div>`;
}

function renderDutyTagList(duties = []) {
  if (!duties.length) return '<span class="two-week-empty-note">未排班</span>';
  return `<div class="two-week-tag-list">${duties.map((duty) => {
    const tone = duty.role === "医生" ? "doctor" : duty.role === "后备护士" ? "backup" : "nurse";
    const label = formatTwoWeekReviewTreatmentLabel(duty, duty.role);
    return `<span class="two-week-detail-tag ${tone}">${escapeHtml(label)}</span>`;
  }).join("")}</div>`;
}

function simplifyTwoWeekReviewIssue(message, review = null) {
  const text = String(message || "").replace(/\s+/g, " ").trim();
  const weekLabel = text.match(/第[12]周/)?.[0] || "";
  const plain = (value) => ({ text: value, html: false });
  const html = (value) => ({ text: value, html: true });

  if (text.includes("集中排班") && (text.includes("已自动回退到安全均衡日期") || text.includes("患者优先安全排班") || text.includes("医护优先排班法"))) {
    const modeLabel = text.match(/(灵巧排班|医护优先)集中排班/)?.[1] || "当前策略";
    const patientItems = extractUnassignedPatientItems(text);
    const finalSummary = formatFallbackFinalScheduleSummary(patientItems, weekLabel, review);
    const fallbackText = text.includes("医护优先仍放不下")
      ? "系统先尝试医护优先排班法；医护优先仍放不下，所以最后改用患者优先安全排班：先按患者资料里设置的星期几倾向排；这个星期几放不下时，才调整到其他工作日。"
      : text.includes("医护优先排班法")
      ? "系统已优先改用医护优先排班法：尽量让医护少开班、多休息，同时仍遵守患者分区、血滤和治疗间隔。"
      : "系统已改用患者优先安全排班：先按患者资料里设置的星期几倾向排；这个星期几放不下时，才调整到其他工作日。";
    return html(`
      <div class="two-week-human-issue">
        <p><b>${escapeHtml(weekLabel || "本周")}</b>：按${escapeHtml(modeLabel)}集中排时，有些治疗放不下。${escapeHtml(fallbackText)}</p>
        ${finalSummary || '<p><b>请重点看</b>：血滤机、传染/非传染分区、严重组和治疗间隔。</p>'}
      </div>
    `);
  }

  if (text.includes("医护排班采用整日优先")) {
    return plain(`${weekLabel ? `${weekLabel}：` : ""}医护按整日优先安排，下午会尽量沿用上午同一批人员。`);
  }

  if (text.includes("医护排班采用休息最大化")) {
    return plain(`${weekLabel ? `${weekLabel}：` : ""}医护按休息最大化安排，会优先形成整日班，同时尽量把半日班分摊到所有在岗护士，避免少数人天天上班。`);
  }

  if (text.includes("未设置星期，已按每周")) {
    return plain(text.replace("默认透析日：", "").replace("未设置星期，已按", "没有设置星期几倾向，系统已按"));
  }

  if (text.includes("没有完整间隔一天")) {
    return plain(text.replace("在第2周末与下一轮第1周初之间没有完整间隔一天。", "第2周末和下一轮第1周初离得太近，请人工确认间隔。"));
  }

  if (text.includes("未找到可用血滤机")) {
    return plain(text.replace("请检查血滤机数量、分区和暂停机器。", "请检查血滤机是否够用、分区是否合适、机器是否暂停。"));
  }

  return plain(text
    .replace("系统已尝试固定机位、推荐机位和全部兼容机位；", "")
    .replace("请检查该患者分区、治疗类型、血滤机数量、暂停机器和同日治疗间隔。", "请检查患者分区、治疗类型、血滤机、暂停机器和治疗间隔。"));
}

function extractUnassignedPatientItems(text) {
  const raw = text.match(/治疗次数未能安排：(.+?)(?:。|；|$)/)?.[1] || "";
  if (!raw) return [];
  return raw.split("、").map((item) => item.trim()).filter(Boolean).map((item) => {
    const match = item.match(/^(.+?)（原(.+?)）$/);
    return {
      name: match?.[1] || item,
      originalDayLabel: match?.[2] || "",
    };
  });
}

function formatFallbackFinalScheduleSummary(items = [], weekLabel = "", review = null) {
  if (!items.length || !review?.patientRows?.length) return "";
  const weekNumber = Number(weekLabel.match(/\d+/)?.[0]) || null;
  const analyzedItems = items.map((item) => {
    const row = review.patientRows.find((patientRow) => patientRow.name === item.name);
    const weekSessions = (row?.sessions || []).filter((session) =>
      !weekNumber || Number(session.weekNumber) === weekNumber
    );
    const finalSlots = dedupeMessages(weekSessions.map((session) =>
      `${getWeekDayLabel(session.dayKey)}${SHIFT_LABELS[session.shift] || ""}`
    ));
    if (!finalSlots.length) {
      return { ...item, finalSlots, keptOriginalDay: false, notScheduled: true };
    }
    const keptOriginalDay = item.originalDayLabel &&
      weekSessions.some((session) => getWeekDayLabel(session.dayKey) === item.originalDayLabel);
    return { ...item, finalSlots, keptOriginalDay, notScheduled: false };
  });

  const keptGroups = new Map();
  analyzedItems
    .filter((item) => item.keptOriginalDay)
    .forEach((item) => {
      const dayLabel = item.originalDayLabel || "原日期";
      keptGroups.set(dayLabel, [...(keptGroups.get(dayLabel) || []), item.name]);
    });
  const keptSummary = [...keptGroups.entries()].map(([dayLabel, names]) =>
    `${names.join("、")}仍按设置的${dayLabel}安排`
  );

  const changedSummary = analyzedItems
    .filter((item) => !item.keptOriginalDay && !item.notScheduled)
    .slice(0, 6)
    .map((item) =>
      `${item.name}：设置的是${item.originalDayLabel || "原星期几"}，最终安排到${item.finalSlots.join("、")}`
    );
  const notScheduledSummary = analyzedItems
    .filter((item) => item.notScheduled)
    .map((item) => `${item.name}本周没有排进去`);

  const hiddenChangedCount = analyzedItems.filter((item) => !item.keptOriginalDay && !item.notScheduled).length - changedSummary.length;
  const parts = [];
  if (keptSummary.length) {
    parts.push(`<p><b>星期几倾向保留</b>：${escapeHtml(keptSummary.join("；"))}。</p>`);
  }
  if (changedSummary.length) {
    parts.push(`<p><b>星期几倾向调整</b>：${escapeHtml(changedSummary.join("；"))}。</p>`);
  }
  if (notScheduledSummary.length) {
    parts.push(`<p><b>没有排入</b>：${escapeHtml(notScheduledSummary.join("；"))}。</p>`);
  }
  if (hiddenChangedCount > 0) {
    parts.push(`<p><b>还有调整</b>：另有 ${hiddenChangedCount} 项日期已调整，请看下方明细。</p>`);
  }
  if (!parts.length) return "";
  parts.push('<p class="two-week-human-note">这里比较的是“患者设置的星期几倾向”和“最终安排的星期几”；具体上午/下午、机位、血透/血滤，请看下面患者明细。</p>');
  return parts.join("");
}

function formatTwoWeekReviewTreatmentLabel(item, suffix) {
  const date = getTwoWeekReviewItemDate(item);
  const weekText = formatYearWeekLabel(date);
  const weekdayText = getWeekDayLabel(item.dayKey);
  const shiftText = SHIFT_LABELS[item.shift] || "";
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekText} ${weekdayText}${shiftText} ${suffix}`;
}

function getTwoWeekReviewItemDate(item) {
  const weekStart = getWeekStart(parseDateInput(getCurrentDate()));
  const dayOffset = Math.max(0, WORKING_DAY_KEYS.indexOf(String(item.dayKey)));
  const weekOffset = Math.max(0, Number(item.weekNumber || 1) - 1) * 7;
  return addDays(weekStart, weekOffset + dayOffset);
}

function formatYearWeekLabel(date) {
  const selectedYear = parseDateInput(getCurrentDate()).getFullYear();
  const iso = getIsoWeekInfo(date);
  if (iso.year !== date.getFullYear()) {
    return `跨年周（${iso.year}年第${iso.week}周）`;
  }
  const prefix = iso.year === selectedYear ? "今年" : `${iso.year}年`;
  return `${prefix}第${iso.week}周`;
}

function getIsoWeekNumber(date) {
  return getIsoWeekInfo(date).week;
}

function getIsoWeekInfo(date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return {
    year: target.getUTCFullYear(),
    week: Math.ceil((((target - yearStart) / 86400000) + 1) / 7),
  };
}

function printTwoWeekReview() {
  if (!ui.twoWeekReviewDialog.open) return;
  document.body.classList.add("printing-two-week-review");
  window.print();
  setTimeout(() => document.body.classList.remove("printing-two-week-review"), 300);
}

function renderSummary() {
  const date = getCurrentDate();
  const machines = getMachineIds();
  const daySchedule = getEffectiveScheduleForDate(date);
  const morningCount = countAssigned(daySchedule, machines, "morning");
  const afternoonCount = countAssigned(daySchedule, machines, "afternoon");
  const activePatientList = getSchedulablePatients();
  const activePatients = activePatientList.length;
  const severePatients = activePatientList.filter(isSeverePatient).length;
  const pausedCount = getPausedMachineIds().length;
  const conflicts = findConflicts(daySchedule);
  const staffCoverage = getStaffCoverage(date);
  const availableMachineCount = Math.max(machines.length - pausedCount, 0);
  const dailyMaxTreatments = availableMachineCount * STAFF_SHIFT_KEYS.length;
  const weeklyMaxTreatments = dailyMaxTreatments * WORKING_DAY_KEYS.length;
  const weeklyRequiredTreatments = activePatientList.reduce(
    (sum, patient) => sum + clampNumber(patient.weeklyTreatmentCount, 1, 6, 3),
    0,
  );
  const weeklyRemainingTreatments = Math.max(weeklyMaxTreatments - weeklyRequiredTreatments, 0);
  const equivalentPatientCapacity = Math.floor(weeklyMaxTreatments / 3);
  const currentDayTreatments = morningCount + afternoonCount;
  const currentDayUtilization = dailyMaxTreatments ? Math.round((currentDayTreatments / dailyMaxTreatments) * 100) : 0;
  const activeHdfMachineCount = machines.filter(
    (machineId) => !isMachinePaused(machineId) && getMachineType(machineId) === "hemofiltration",
  ).length;
  const dailyMaxHdfTreatments = activeHdfMachineCount * STAFF_SHIFT_KEYS.length;
  const machineTypeItems = [
    { label: "血透", value: getMachineTypeCount("hemodialysis"), tone: "info" },
    { label: "血滤", value: getMachineTypeCount("hemofiltration"), tone: "warning" },
    { label: "灌流", value: getMachineTypeCount("perfusion"), tone: "purple" },
  ];
  const machineZoneItems = [
    { label: "普通", value: machines.filter((machineId) => getMachineZone(machineId) === MACHINE_ZONE_NORMAL).length, tone: "neutral" },
    { label: "重病", value: machines.filter((machineId) => getMachineZone(machineId) === MACHINE_ZONE_SEVERE).length, tone: "danger" },
    ...MACHINE_ZONE_INFECTION_FLAGS.map((flag) => ({
      label: flag,
      value: machines.filter((machineId) => getMachineZone(machineId) === flag).length,
      tone: flag === "HBV" ? "orange" : flag === "HCV" ? "purple" : flag === "T" ? "teal" : "gold",
    })),
  ];
  const infectionItems = [
    { label: "HBC", value: activePatientList.filter((patient) => normalizeInfectionFlag(patient.infectionFlag) === "HBC").length, tone: "gold" },
    { label: "HBV", value: activePatientList.filter((patient) => normalizeInfectionFlag(patient.infectionFlag) === "HBV").length, tone: "orange" },
    { label: "HCV", value: activePatientList.filter((patient) => normalizeInfectionFlag(patient.infectionFlag) === "HCV").length, tone: "purple" },
    { label: "T", value: activePatientList.filter((patient) => normalizeInfectionFlag(patient.infectionFlag) === "T").length, tone: "teal" },
  ];

  const html = [
    renderSummaryMetricCard({
      label: "排班策略",
      value: getSchedulePriorityLabel(),
      note: getSchedulePriorityDescription(),
      tone: "accent",
      badge: "自动排班",
    }),
    renderSummaryMetricCard({
      label: "机器总览",
      value: machines.length,
      note: `当前暂停 ${pausedCount} 台机器`,
      tone: pausedCount ? "warning" : "info",
      badge: pausedCount ? "含暂停" : "运行正常",
    }),
    renderSummaryChipCard({
      label: "机型配置",
      items: machineTypeItems,
      tone: "info",
      badge: "固定机型",
    }),
    renderCapacityOverviewCard({
      availableMachineCount,
      dailyMaxTreatments,
      weeklyMaxTreatments,
      weeklyRequiredTreatments,
      weeklyRemainingTreatments,
      equivalentPatientCapacity,
      currentDayTreatments,
      currentDayUtilization,
      activeHdfMachineCount,
      dailyMaxHdfTreatments,
    }),
    renderSummaryChipCard({
      label: "机器分区",
      items: machineZoneItems,
      tone: "danger",
      badge: "区域分布",
      wide: true,
    }),
    renderSummaryProgressCard({
      label: "上午排班进度",
      value: morningCount,
      total: machines.length,
      tone: "success",
      badge: "上午",
    }),
    renderSummaryProgressCard({
      label: "下午排班进度",
      value: afternoonCount,
      total: machines.length,
      tone: "teal",
      badge: "下午",
    }),
    renderSummaryMetricCard({
      label: "在透患者",
      value: activePatients,
      note: `其中严重组 ${severePatients} 人`,
      tone: "neutral",
      badge: "患者总量",
    }),
    renderSummaryMetricCard({
      label: "医护完成",
      value: `${staffCoverage.filled}/${staffCoverage.required}`,
      note: staffCoverage.required ? `完成率 ${Math.round((staffCoverage.filled / staffCoverage.required) * 100)}%` : "当前班次无需安排医护",
      tone: staffCoverage.required && staffCoverage.filled < staffCoverage.required ? "warning" : "success",
      badge: "医护岗位",
    }),
    renderSummaryChipCard({
      label: "传染分类",
      items: infectionItems,
      tone: "purple",
      badge: "患者分类",
      wide: true,
    }),
  ];

  if (conflicts.length) {
    html.push(
      renderSummaryMetricCard({
        label: "重复排班",
        value: conflicts.length,
        note: "同一患者在同一班次被重复安排，请尽快检查",
        tone: "danger",
        badge: "需处理",
      }),
    );
  }

  ui.summaryGrid.innerHTML = html.join("");
}

function renderCapacityOverviewCard({
  availableMachineCount,
  dailyMaxTreatments,
  weeklyMaxTreatments,
  weeklyRequiredTreatments,
  weeklyRemainingTreatments,
  equivalentPatientCapacity,
  currentDayTreatments,
  currentDayUtilization,
  activeHdfMachineCount,
  dailyMaxHdfTreatments,
}) {
  const items = [
    { label: "单班", value: availableMachineCount },
    { label: "每日", value: dailyMaxTreatments },
    { label: "每周", value: weeklyMaxTreatments },
    { label: "折算患者", value: equivalentPatientCapacity },
  ];
  return `
    <article class="summary-card capacity-overview tone-accent">
      <div class="summary-card-top">
        <span class="summary-label">治疗能力总览</span>
        <span class="summary-badge">理论容量</span>
      </div>
      <div class="capacity-overview-grid">
        ${items.map((item) => `
          <div class="capacity-overview-item">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
          </div>
        `).join("")}
      </div>
      <div class="capacity-overview-footnote">
        本周需求 ${escapeHtml(weeklyRequiredTreatments)} · 剩余 ${escapeHtml(weeklyRemainingTreatments)} · 今日 ${escapeHtml(currentDayUtilization)}%
      </div>
    </article>
  `;
}

function renderSummaryMetricCard({ label, value, note = "", tone = "neutral", badge = "", wide = false }) {
  return `
    <article class="summary-card tone-${escapeHtml(tone)} ${wide ? "wide" : ""}">
      <div class="summary-card-top">
        <span class="summary-label">${escapeHtml(label)}</span>
        ${badge ? `<span class="summary-badge">${escapeHtml(badge)}</span>` : ""}
      </div>
      <strong class="summary-value">${escapeHtml(value)}</strong>
      ${note ? `<div class="summary-note">${escapeHtml(note)}</div>` : ""}
    </article>
  `;
}

function renderSummaryProgressCard({ label, value, total, tone = "success", badge = "" }) {
  const safeTotal = Math.max(Number(total) || 0, 0);
  const safeValue = Math.max(Math.min(Number(value) || 0, safeTotal || Number(value) || 0), 0);
  const percent = safeTotal ? Math.round((safeValue / safeTotal) * 100) : 0;
  return `
    <article class="summary-card tone-${escapeHtml(tone)}">
      <div class="summary-card-top">
        <span class="summary-label">${escapeHtml(label)}</span>
        ${badge ? `<span class="summary-badge">${escapeHtml(badge)}</span>` : ""}
      </div>
      <strong class="summary-value">${escapeHtml(`${safeValue}/${safeTotal}`)}</strong>
      <div class="summary-progress">
        <div class="summary-progress-bar" style="width:${percent}%"></div>
      </div>
      <div class="summary-progress-meta">
        <span>已安排 ${escapeHtml(safeValue)}</span>
        <span>${escapeHtml(percent)}%</span>
      </div>
    </article>
  `;
}

function renderSummaryChipCard({ label, items = [], tone = "neutral", badge = "", wide = false }) {
  const chips = items
    .map((item) => `
      <span class="summary-chip tone-${escapeHtml(item.tone || "neutral")}">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
      </span>
    `)
    .join("");
  return `
    <article class="summary-card tone-${escapeHtml(tone)} ${wide ? "wide" : ""}">
      <div class="summary-card-top">
        <span class="summary-label">${escapeHtml(label)}</span>
        ${badge ? `<span class="summary-badge">${escapeHtml(badge)}</span>` : ""}
      </div>
      <div class="summary-chip-list">${chips}</div>
    </article>
  `;
}

function countAssigned(daySchedule, machines, shift) {
  return machines.filter((machineId) => daySchedule[machineId]?.[shift]?.patientId).length;
}

function countStaffWorkingForShift(staffDaySchedule = {}, shift) {
  const shiftSchedule = staffDaySchedule?.[shift] || {};
  return new Set([
    ...(shiftSchedule.doctors || []).filter(isStaffScheduleValueFilled),
    ...(shiftSchedule.nurses || []).filter(isStaffScheduleValueFilled),
    ...(isStaffScheduleValueFilled(shiftSchedule.backupNurse) ? [shiftSchedule.backupNurse] : []),
  ]).size;
}

function renderStaffSchedule() {
  const overview = buildStaffTwoWeekOverview();
  const scopeControl = ui.staffScheduleScope?.closest(".scope-control");
  if (scopeControl) {
    scopeControl.hidden = true;
  }
  ui.staffTitle.textContent = "最近2周医护工作与休息";
  ui.staffMeta.textContent = `${overview.rangeText} · 半天班按1个半日班统计，上午+下午同一天算1个工作日`;
  ui.staffScheduleGrid.innerHTML = renderStaffTwoWeekOverview(overview);
}

function buildStaffTwoWeekOverview() {
  const date = getCurrentDate();
  const currentWeekStart = getWeekStart(parseDateInput(date));
  const hasCycle = hasTwoWeekCycleTemplate();
  const week1Actual = buildActualWeekSchedulesForOverview(currentWeekStart);
  const week2Actual = buildActualWeekSchedulesForOverview(addDays(currentWeekStart, 7));
  const review = buildTwoWeekReview(
    { week1: week1Actual.patientWeek, week2: week2Actual.patientWeek, warnings: [], blocking: [] },
    { week1: week1Actual.staffWeek, week2: week2Actual.staffWeek, warnings: [], blocking: [] },
  );
  const week1Start = currentWeekStart;
  const week2Start = addDays(currentWeekStart, 7);
  return {
    review,
    hasCycle,
    weekLabels: ["本周", "下周"],
    rangeText: `${formatShortDate(week1Start)}-${formatShortDate(addDays(week2Start, 5))}`,
  };
}

function buildActualWeekSchedulesForOverview(weekStart) {
  const patientWeek = {};
  const staffWeek = {};
  WORKING_DAY_KEYS.forEach((dayKey) => {
    const dateValue = formatDateInput(addDays(weekStart, Number(dayKey) - 1));
    const patientDay = getEffectivePatientScheduleForOverviewDate(dateValue);
    const nurseCount = Math.max(
      getNurseGroupProfileForDay(patientDay, state.settings).count,
      getExistingStaffNurseSlotCount(dateValue),
      1,
    );
    patientWeek[dayKey] = patientDay;
    staffWeek[dayKey] = getStaffScheduleForShiftSwapDate(dateValue, nurseCount);
  });
  return { patientWeek, staffWeek };
}

function getEffectivePatientScheduleForOverviewDate(dateValue) {
  const dayKey = getWeekdayKey(dateValue);
  const base = hasTwoWeekCycleTemplate()
    ? state.twoWeekCycle?.patientSchedules?.[getCycleWeekKey(getCycleWeekNumberForDate(dateValue))]?.[dayKey] || {}
    : state.weeklySchedules?.[dayKey] || {};
  return mergeScheduleDays(base, state.schedules?.[dateValue] || {});
}

function renderStaffTwoWeekOverview(overview) {
  const rows = (overview.review.staffRows || []).sort((left, right) =>
    Number(left.role === "doctor") - Number(right.role === "doctor") ||
    left.shiftCount - right.shiftCount ||
    String(left.name).localeCompare(String(right.name), "zh-CN"),
  );
  if (!rows.length) {
    return `
      <section class="staff-overview-empty">
        <strong>还没有在岗医护</strong>
        <span>请先在下方医护库新增医生和护士，再生成或保存2周排班。</span>
      </section>
    `;
  }

  const advice = buildStaffTwoWeekAdvice(rows, overview);
  const stats = buildStaffTwoWeekStats(rows);
  return `
    <section class="staff-overview-panel">
      ${renderStaffOverviewAdvice(advice, stats, overview)}
      <div class="staff-overview-card-grid">
        ${rows.map((row) => renderStaffOverviewPersonCard(row, overview.weekLabels)).join("")}
      </div>
    </section>
  `;
}

function buildStaffTwoWeekStats(rows = []) {
  const activeRows = rows.filter((row) => row.shiftCount > 0);
  const nurseRows = rows.filter((row) => row.role === "nurse");
  const activeNurseRows = nurseRows.filter((row) => row.shiftCount > 0);
  const totalHalfDayShifts = rows.reduce((sum, row) => sum + row.shiftCount, 0);
  const totalWorkedDays = rows.reduce((sum, row) => sum + row.workedDays, 0);
  const totalRestDays = rows.reduce((sum, row) => sum + row.restDays, 0);
  const maxShift = activeRows.length ? Math.max(...activeRows.map((row) => row.shiftCount)) : 0;
  const minRest = activeRows.length ? Math.min(...activeRows.map((row) => row.restDays)) : 12;
  const busiest = activeRows.filter((row) => row.shiftCount === maxShift).map((row) => row.name).slice(0, 4);
  return {
    totalStaff: rows.length,
    nurseCount: nurseRows.length,
    activeStaff: activeRows.length,
    activeNurses: activeNurseRows.length,
    noDutyStaff: rows.length - activeRows.length,
    totalHalfDayShifts,
    totalWorkedDays,
    totalRestDays,
    averageHalfDayShifts: rows.length ? totalHalfDayShifts / rows.length : 0,
    maxShift,
    minRest,
    busiest,
  };
}

function buildStaffTwoWeekAdvice(rows, overview) {
  const stats = buildStaffTwoWeekStats(rows);
  if (!stats.totalHalfDayShifts) {
    return {
      tone: "warning",
      title: "护士长建议：最近2周还没有医护排班",
      detail: "请先生成或保存2周排班；保存后这里会按每个医护显示工作天数、休息天数和半日班数量。",
    };
  }
  if (stats.minRest <= 2) {
    return {
      tone: "warning",
      title: "护士长建议：先复核休息偏少人员",
      detail: `最近2周最少只有${stats.minRest}天完整休息；半日班最多${stats.maxShift}个，重点看${stats.busiest.join("、") || "高负荷人员"}是否需要调整。`,
    };
  }
  if (stats.noDutyStaff > 0) {
    return {
      tone: "ok",
      title: "护士长建议：可以运行，但要确认无班人员安排",
      detail: `最近2周共有${stats.noDutyStaff}名医护没有排班；如果这是计划内休息可以保留，否则请在下方医护资料或2周排班里复核。`,
    };
  }
  return {
    tone: "ok",
    title: "护士长建议：最近2周医护负担基本可读",
    detail: `共${stats.totalHalfDayShifts}个半日班，平均${formatOneDecimal(stats.averageHalfDayShifts)}个/人；最少完整休息${stats.minRest}天。`,
  };
}

function summarizeStaffSwapItems(duties = [], swapOuts = []) {
  const coverCount = duties.filter((duty) => normalizeStaffSwapNote(duty.swapNote)?.type === "cover").length;
  const paybackCount = duties.filter((duty) => normalizeStaffSwapNote(duty.swapNote)?.type === "payback").length;
  const movedOutCount = swapOuts.length;
  const partnerNames = new Set();
  duties.forEach((duty) => {
    const note = normalizeStaffSwapNote(duty.swapNote);
    if (note?.partnerId) {
      partnerNames.add(getStaffDisplayName(note.partnerId));
    }
  });
  swapOuts.forEach((item) => {
    if (item.covererId) {
      partnerNames.add(getStaffDisplayName(item.covererId));
    }
  });
  return {
    total: coverCount + paybackCount + movedOutCount,
    coverCount,
    paybackCount,
    movedOutCount,
    partnerNames: [...partnerNames],
  };
}

function renderStaffOverviewAdvice(advice, stats, overview) {
  return `
    <div class="staff-overview-advice ${escapeHtml(advice.tone)}">
      <div>
        <strong>${escapeHtml(advice.title)}</strong>
        <span>${escapeHtml(advice.detail)}</span>
      </div>
      <div class="staff-overview-stat-strip">
        <span><b>${escapeHtml(stats.totalStaff)}</b>医护</span>
        <span><b>${escapeHtml(stats.totalHalfDayShifts)}</b>半日班</span>
        <span><b>${escapeHtml(stats.totalWorkedDays)}</b>工作日</span>
        <span><b>${escapeHtml(stats.totalRestDays)}</b>休息日</span>
      </div>
    </div>
  `;
}

function renderStaffOverviewPersonCard(row, weekLabels = ["本周", "下周"]) {
  const roleLabel = row.role === "doctor" ? "医生" : "护士";
  const loadTone = row.shiftCount === 0 ? "rest" : row.restDays <= 2 ? "warning" : "ok";
  const swapStats = row.swapStats || summarizeStaffSwapItems(row.duties, row.swapOuts);
  const hasSwaps = swapStats.total > 0;
  const swapPartnerText = swapStats.partnerNames?.length ? `；涉及 ${swapStats.partnerNames.slice(0, 4).join("、")}` : "";
  return `
    <article class="staff-overview-person-card ${escapeHtml(loadTone)} ${hasSwaps ? "has-swaps" : ""}">
      <div class="staff-overview-person-head">
        <div>
          <strong>${escapeHtml(row.name)}</strong>
          <span>${escapeHtml(roleLabel)} · ${escapeHtml(row.shiftCount)}个半日班 · 工作${escapeHtml(row.workedDays)}天 · 休息${escapeHtml(row.restDays)}天</span>
        </div>
        <div class="staff-overview-badges">
          <span>${escapeHtml(row.fullDays)}天整日班</span>
          <span>${row.shiftCount ? `${escapeHtml(row.restDays)}天休息` : "本轮无班"}</span>
        </div>
      </div>
      ${hasSwaps ? `
        <div class="staff-overview-swap-summary">
          调班记录：原班调出${escapeHtml(swapStats.movedOutCount)}个，替别人上${escapeHtml(swapStats.coverCount)}个，补回别人${escapeHtml(swapStats.paybackCount)}个${escapeHtml(swapPartnerText)}
        </div>
      ` : ""}
      ${renderStaffOverviewWeekLine(row, 1, weekLabels[0] || "本周")}
      ${renderStaffOverviewWeekLine(row, 2, weekLabels[1] || "下周")}
    </article>
  `;
}

function renderStaffOverviewWeekLine(row = {}, weekNumber = 1, label = "本周") {
  return `
    <div class="staff-overview-week-line">
      <span class="staff-overview-week-label">${escapeHtml(label)}</span>
      ${WORKING_DAY_KEYS.map((dayKey) => renderStaffOverviewDayCell(row, weekNumber, dayKey)).join("")}
    </div>
  `;
}

function renderStaffOverviewDayCell(row = {}, weekNumber, dayKey) {
  const duties = row.duties || [];
  const swapOuts = row.swapOuts || [];
  const dayItems = duties.filter((duty) => Number(duty.weekNumber) === Number(weekNumber) && String(duty.dayKey) === String(dayKey));
  const swapOutItems = swapOuts.filter((item) => Number(item.weekNumber) === Number(weekNumber) && String(item.dayKey) === String(dayKey));
  if (!dayItems.length && !swapOutItems.length) {
    return `
      <div class="staff-overview-day rest">
        <b>${escapeHtml(getWeekDayLabel(dayKey))}</b>
        <span>休</span>
      </div>
    `;
  }
  const hasBackup = dayItems.some((item) => String(item.role || "").includes("后备"));
  const onlySwapOut = !dayItems.length && swapOutItems.length;
  return `
    <div class="staff-overview-day ${hasBackup ? "backup" : "work"} ${onlySwapOut ? "swap-rest" : ""}">
      <b>${escapeHtml(getWeekDayLabel(dayKey))}</b>
      ${dayItems.map(renderStaffOverviewDuty).join("")}
      ${swapOutItems.map(renderStaffOverviewSwapOut).join("")}
    </div>
  `;
}

function renderStaffOverviewDuty(duty) {
  const role = String(duty.role || "")
    .replace("负责：", "")
    .replace(" · ", " ");
  const swapNote = normalizeStaffSwapNote(duty.swapNote);
  const swapText = formatStaffSwapNote(swapNote, "long");
  return `
    <span>
      ${escapeHtml(`${SHIFT_LABELS[duty.shift] || ""} ${role}`)}
      ${swapText ? `<em class="staff-overview-swap-note ${escapeHtml(swapNote?.type || "")}">${escapeHtml(swapText)}</em>` : ""}
    </span>
  `;
}

function renderStaffOverviewSwapOut(item) {
  const role = String(item.role || "")
    .replace("负责：", "")
    .replace(" · ", " ");
  const note = normalizeStaffSwapNote(item.swapNote);
  const groupText = note?.group ? `第${note.group}组` : "调班";
  const related = note?.relatedDateValue
    ? `；本人${formatDateLabel(note.relatedDateValue)}${note.relatedShift ? SHIFT_LABELS[note.relatedShift] : ""}补回`
    : "";
  return `
    <span class="staff-overview-swap-out">
      ${escapeHtml(`${SHIFT_LABELS[item.shift] || ""} 原${role}已调出`)}
      <em>${escapeHtml(`${groupText}：由 ${getStaffDisplayName(item.covererId)} 替班${related}`)}</em>
    </span>
  `;
}

function renderStaffShiftCard(shift, shiftSchedule, requiredGroups, date, patientCount = 0) {
  const hasExistingStaff = isStaffShiftFilled(shiftSchedule);
  if (!patientCount && !hasExistingStaff) {
    return `
      <section class="staff-shift-card">
        <div class="staff-shift-title">
          <h3>${SHIFT_LABELS[shift]}</h3>
          <span>0 个岗位</span>
        </div>
        <div class="staff-shift-empty">本班无患者，无需安排医护</div>
      </section>
    `;
  }

  const extraNurseIndexes = (shiftSchedule.nurses || [])
    .map((value, index) => (index >= requiredGroups.length && value ? index : -1))
    .filter((index) => index >= 0);
  const displayGroups = [
    ...requiredGroups,
    ...extraNurseIndexes.map((index) => ({ ...createEmptyNurseGroup(index), range: "多余旧岗位", zoneLabel: "待清理" })),
  ];
  const doctorFields = Array.from({ length: DOCTOR_COUNT }, (_, index) =>
    renderStaffField({
      shift,
      role: "doctor",
      index,
      label: `医生 ${index + 1}`,
      value: shiftSchedule.doctors[index],
    }),
  ).join("");

  const nurseFields = displayGroups
    .map((group, displayIndex) => {
      const index = group.index ?? displayIndex;
      return renderStaffField({
        shift,
        role: "nurse",
        index,
        label: `责任护士 ${index + 1}`,
        hint: formatNurseGroupHint(group),
        value: shiftSchedule.nurses[index],
        patientList: group.empty ? "" : renderNursePatientList(group, shift, date),
      });
    })
    .join("");

  const backupField = renderStaffField({
    shift,
    role: "backupNurse",
    index: 0,
    label: "后备护士",
    value: shiftSchedule.backupNurse,
  });
  const requiredPositions = patientCount ? DOCTOR_COUNT + requiredGroups.length + BACKUP_NURSE_COUNT : 0;
  const titleText = patientCount ? `${requiredPositions} 个岗位` : "无患者，但存在旧医护记录";

  return `
    <section class="staff-shift-card">
      <div class="staff-shift-title">
        <h3>${SHIFT_LABELS[shift]}</h3>
        <span>${titleText}</span>
      </div>
      ${!patientCount ? `<div class="staff-shift-warning">请清空本班旧医护记录，或先安排患者。</div>` : ""}
      <div class="staff-role-grid">
        ${doctorFields}
        ${nurseFields}
        ${backupField}
      </div>
    </section>
  `;
}

function isStaffShiftFilled(shiftSchedule = {}) {
  return (
    (shiftSchedule.doctors || []).some(isStaffScheduleValueFilled) ||
    (shiftSchedule.nurses || []).some(isStaffScheduleValueFilled) ||
    isStaffScheduleValueFilled(shiftSchedule.backupNurse)
  );
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
    showToast(getDynamicMessage("sundayNoWeeklyStaffTemplate"));
    return;
  }
  const daySchedule = getStaffScheduleForEdit(date, scope);
  const value = String(input.value || "");

  if (role === "doctor") {
    daySchedule[shift].doctors[index] = value;
  } else if (role === "nurse") {
    daySchedule[shift].nurses[index] = value;
    clearStaffSwapNote(daySchedule, shift, "nurse", index);
  } else if (role === "backupNurse") {
    daySchedule[shift].backupNurse = value;
    clearStaffSwapNote(daySchedule, shift, "backupNurse", -1);
  }

  if (scope === "weekly") {
    copyWeeklyViewBackToCycle();
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

function getRequiredNurseCountForShift(patientDaySchedule = {}, shift, settings = state.settings) {
  return getNurseGroupsForShift(patientDaySchedule, shift, settings)
    .filter((group) => group && !group.empty && group.patientCount > 0)
    .length;
}

function buildAutoWeeklyStaffSchedules(patientSchedules = {}, priority = state.settings.schedulePriority, options = {}) {
  const schedules = {};
  const warnings = [];
  const blocking = [];
  const doctors = state.staffMembers.filter((staff) => staff.role === "doctor" && staff.status === "active");
  const nurses = state.staffMembers.filter((staff) => staff.role === "nurse" && staff.status === "active");
  const assignmentCounts = options.assignmentCounts instanceof Map ? options.assignmentCounts : new Map();
  const nurseWorkedDays = options.nurseWorkedDays instanceof Map ? options.nurseWorkedDays : new Map();
  const doctorWorkedDays = options.doctorWorkedDays instanceof Map ? options.doctorWorkedDays : new Map();
  const periodPrefix = String(options.periodPrefix || "");
  const staffWorkMode = normalizeStaffWorkMode(state.settings.staffWorkMode);
  const fullDayMode = staffWorkMode === STAFF_WORK_MODE_FULL_DAY || staffWorkMode === STAFF_WORK_MODE_REST_MAX;
  const restMaxMode = staffWorkMode === STAFF_WORK_MODE_REST_MAX;
  const restMaxSoftShiftCap = Number.isFinite(Number(options.restMaxSoftShiftCap))
    ? Number(options.restMaxSoftShiftCap)
    : 0;
  const estimatedNurseDutyCount = estimateNurseDutyCountForPatientSchedules(patientSchedules);
  const estimatedTotalNurseDutyCount = Number.isFinite(Number(options.estimatedTotalNurseDutyCount))
    ? Number(options.estimatedTotalNurseDutyCount)
    : estimatedNurseDutyCount;
  const restMaxFairShiftTarget = restMaxMode && nurses.length
    ? Math.max(1, Math.ceil(estimatedTotalNurseDutyCount / nurses.length))
    : 0;
  const restMaxFairShiftCap = restMaxMode
    ? (restMaxSoftShiftCap || Math.max(2, restMaxFairShiftTarget + (periodPrefix ? 2 : 1)))
    : 0;
  const restMaxTargetActiveNurseCount = restMaxMode
    ? Math.max(1, Math.min(nurses.length, estimatedTotalNurseDutyCount))
    : nurses.length;

  [...doctors, ...nurses].forEach((staff) => {
    if (!assignmentCounts.has(staff.id)) assignmentCounts.set(staff.id, 0);
  });
  doctors.forEach((staff) => {
    if (!doctorWorkedDays.has(staff.id)) doctorWorkedDays.set(staff.id, new Set());
  });
  nurses.forEach((staff) => {
    if (!nurseWorkedDays.has(staff.id)) nurseWorkedDays.set(staff.id, new Set());
  });

  const getWorkedDays = (staff, role) => role === "doctor"
    ? doctorWorkedDays.get(staff.id) || new Set()
    : nurseWorkedDays.get(staff.id) || new Set();

  const markSelected = (staffIds, dayKey, role) => {
    const dayToken = `${periodPrefix}${dayKey}`;
    staffIds.filter(Boolean).forEach((staffId) => {
      assignmentCounts.set(staffId, (assignmentCounts.get(staffId) || 0) + 1);
      const workedDays = role === "doctor"
        ? doctorWorkedDays.get(staffId) || new Set()
        : nurseWorkedDays.get(staffId) || new Set();
      workedDays.add(dayToken);
      if (role === "doctor") {
        doctorWorkedDays.set(staffId, workedDays);
      } else {
        nurseWorkedDays.set(staffId, workedDays);
      }
    });
  };

  const selectStaff = (pool, count, shift, dayKey, role, exclude = new Set(), sameDayPreferred = new Set()) => {
    const dayToken = `${periodPrefix}${dayKey}`;
    const activeNurseCount = role === "nurse"
      ? nurses.filter((staff) => (assignmentCounts.get(staff.id) || 0) > 0).length
      : 0;
    return pool
      .filter((staff) => !exclude.has(staff.id))
      .map((staff) => {
        const workedDays = getWorkedDays(staff, role);
        const preferredShiftScore = scoreShiftPreference(staff, shift);
        const currentAssignments = assignmentCounts.get(staff.id) || 0;
        const hasWorkedThisDay = workedDays.has(dayToken);
        const hasAnyAssignment = currentAssignments > 0;
        const fullDayBonus = fullDayMode && shift === "afternoon" && sameDayPreferred.has(staff.id)
          ? restMaxMode ? -110 : -90
          : 0;
        const balancedSameDayPenalty = !fullDayMode && shift === "afternoon" && workedDays.has(dayToken) ? 12 : 0;
        const restMaxActivateUnusedBonus = restMaxMode && role === "nurse" && !hasAnyAssignment && activeNurseCount < restMaxTargetActiveNurseCount
          ? -130
          : 0;
        const restMaxPreserveRestPenalty = restMaxMode && role === "nurse" && !hasAnyAssignment && activeNurseCount >= restMaxTargetActiveNurseCount
          ? 25
          : 0;
        const restMaxSameDayBonus = restMaxMode && hasWorkedThisDay ? -25 : 0;
        const restMaxNewDayPenalty = restMaxMode && !hasWorkedThisDay ? 28 : 0;
        const restMaxOverFairPenalty = restMaxMode && currentAssignments >= restMaxFairShiftTarget
          ? (currentAssignments - restMaxFairShiftTarget + 1) * 70
          : 0;
        const restMaxOverCapPenalty = restMaxMode && currentAssignments >= restMaxFairShiftCap
          ? (currentAssignments - restMaxFairShiftCap + 1) * 130
          : 0;
        const restMaxLoadScore = restMaxMode
          ? currentAssignments * 18 + workedDays.size * 5
          : currentAssignments * 20 + workedDays.size * 5;
        return {
          staff,
          score:
            fullDayBonus +
            balancedSameDayPenalty +
            restMaxActivateUnusedBonus +
            restMaxPreserveRestPenalty +
            restMaxSameDayBonus +
            restMaxNewDayPenalty +
            restMaxOverFairPenalty +
            restMaxOverCapPenalty +
            restMaxLoadScore -
            preferredShiftScore * 2,
        };
      })
      .sort((left, right) => left.score - right.score || sortStaffMembers(left.staff, right.staff))
      .slice(0, Math.max(0, count))
      .map((item) => item.staff.id);
  };

  let activeShiftCount = 0;
  let doctorShiftCount = 0;
  let nurseShiftCount = 0;
  let backupShiftCount = 0;

  WORKING_DAY_KEYS.forEach((dayKey) => {
    const patientDaySchedule = patientSchedules?.[dayKey] || {};
    const staffDaySchedule = createEmptyStaffScheduleDay(0);
    const morningDoctorIds = new Set();
    const morningNurseIds = new Set();

    STAFF_SHIFT_KEYS.forEach((shift) => {
      const patientCount = countAssigned(patientDaySchedule, getMachineIds(), shift);
      if (!patientCount) {
        staffDaySchedule[shift] = { doctors: [], nurses: [], backupNurse: "" };
        return;
      }

      const requiredNurses = getRequiredNurseCountForShift(patientDaySchedule, shift);
      activeShiftCount += 1;
      if (doctors.length < DOCTOR_COUNT) {
        blocking.push(`${getWeekDayLabel(dayKey)}${SHIFT_LABELS[shift]}需要 ${DOCTOR_COUNT} 名医生，当前在岗医生 ${doctors.length} 名。`);
      }
      if (nurses.length < requiredNurses + BACKUP_NURSE_COUNT) {
        blocking.push(`${getWeekDayLabel(dayKey)}${SHIFT_LABELS[shift]}需要 ${requiredNurses} 名责任护士和 ${BACKUP_NURSE_COUNT} 名后备护士，当前在岗护士 ${nurses.length} 名。`);
      }

      const sameDayDoctors = shift === "afternoon" ? morningDoctorIds : new Set();
      const sameDayNurses = shift === "afternoon" ? morningNurseIds : new Set();
      const doctorsForShift = selectStaff(doctors, DOCTOR_COUNT, shift, dayKey, "doctor", new Set(), sameDayDoctors);
      markSelected(doctorsForShift, dayKey, "doctor");
      doctorsForShift.forEach((staffId) => {
        if (shift === "morning") morningDoctorIds.add(staffId);
      });

      const nursesForShift = selectStaff(nurses, requiredNurses, shift, dayKey, "nurse", new Set(), sameDayNurses);
      markSelected(nursesForShift, dayKey, "nurse");
      nursesForShift.forEach((staffId) => {
        if (shift === "morning") morningNurseIds.add(staffId);
      });

      const backupNurse = selectStaff(nurses, BACKUP_NURSE_COUNT, shift, dayKey, "nurse", new Set(nursesForShift), sameDayNurses)[0] || "";
      markSelected([backupNurse], dayKey, "nurse");
      if (shift === "morning" && backupNurse) morningNurseIds.add(backupNurse);

      staffDaySchedule[shift] = {
        doctors: doctorsForShift,
        nurses: nursesForShift,
        backupNurse,
      };
      doctorShiftCount += doctorsForShift.length;
      nurseShiftCount += nursesForShift.length;
      backupShiftCount += backupNurse ? 1 : 0;
    });

    schedules[dayKey] = staffDaySchedule;
  });

  if (restMaxMode) {
    warnings.push("医护排班采用休息最大化：系统会优先形成整日班，同时把半日班尽量分摊到所有在岗护士；超过平均负担的人会被自动降权。");
  } else if (fullDayMode) {
    warnings.push("医护排班采用整日优先：下午班会优先沿用当天上午已排人员。");
  }

  return {
    schedules,
    warnings,
    blocking: dedupeMessages(blocking),
    activeShiftCount,
    doctorShiftCount,
    nurseShiftCount,
    backupShiftCount,
  };
}

function getStaffCoverage(date) {
  const patientSchedule = getEffectiveScheduleForDate(date);
  const nurseCount = getRequiredNurseCountForDate(date);
  const staffSchedule = getEffectiveStaffScheduleForDate(date, nurseCount);
  let filled = 0;
  let required = 0;

  STAFF_SHIFT_KEYS.forEach((shift) => {
    const patientCount = countAssigned(patientSchedule, getMachineIds(), shift);
    if (!patientCount) {
      return;
    }
    const requiredNurses = getRequiredNurseCountForShift(patientSchedule, shift);
    const shiftSchedule = staffSchedule[shift];
    required += DOCTOR_COUNT + requiredNurses + BACKUP_NURSE_COUNT;
    filled += Math.min(DOCTOR_COUNT, shiftSchedule.doctors.filter(isStaffScheduleValueFilled).length);
    filled += Math.min(requiredNurses, shiftSchedule.nurses.filter(isStaffScheduleValueFilled).length);
    filled += shiftSchedule.backupNurse ? 1 : 0;
  });

  return { filled, required };
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
  const morningPatientCount = countAssigned(daySchedule, machines, "morning");
  const afternoonPatientCount = countAssigned(daySchedule, machines, "afternoon");
  const morningStaffCount = countStaffWorkingForShift(staffSchedule, "morning");
  const afternoonStaffCount = countStaffWorkingForShift(staffSchedule, "afternoon");
  const priorityLabel = getSchedulePriorityLabel();
  const pausedCount = getPausedMachineIds().length;
  ui.boardTitle.textContent =
    !isChineseLanguage()
      ? `Staff on duty: AM ${morningStaffCount}, PM ${afternoonStaffCount}; Patients: AM ${morningPatientCount}, PM ${afternoonPatientCount}`
      : `今日上班：上午 ${morningStaffCount} 人，下午 ${afternoonStaffCount} 人；今日透析：上午 ${morningPatientCount} 人，下午 ${afternoonPatientCount} 人`;
  ui.boardMeta.textContent =
    !isChineseLanguage()
      ? `${formatDateLabel(date)} schedule · ${state.settings.rowCount} rows, ${machines.length - pausedCount} available, ${pausedCount} paused · ${priorityLabel}`
      : `${formatDateLabel(date)}排班 · ${state.settings.rowCount} 排，可用 ${machines.length - pausedCount} 台，暂停 ${pausedCount} 台 · ${priorityLabel}`;

  ui.machineRows.innerHTML = rows
    .map((row, index) => {
      const activeSlots = row.filter((slot) => slot.active && slot.machineId);
      const conflictSet = new Set(conflicts.map((item) => `${item.machineId}:${item.shift}`));
      return `
        <section class="machine-row shift-separated-row strict-split-row">
          <div class="row-title">第 ${index + 1} 排</div>
          <div class="row-split-columns">
            ${renderShiftColumn(row, activeSlots, "morning", daySchedule, conflictSet, scheduleContext)}
            ${renderShiftColumn(row, activeSlots, "afternoon", daySchedule, conflictSet, scheduleContext)}
          </div>
        </section>
      `;
    })
    .join("");

  ui.machineRows.querySelectorAll(".shift-slot").forEach((slot) => {
    slot.addEventListener("click", () => openAssignmentDialog(slot.dataset.machine, slot.dataset.shift));
  });
}

function renderShiftColumn(row, activeSlots, shift, daySchedule, conflictSet, scheduleContext) {
  const bands = buildShiftBands(activeSlots, shift, scheduleContext, shift === "morning" ? 0 : 8);
  return `
    <section class="shift-column shift-column-${shift}">
      <div class="shift-column-label">${SHIFT_LABELS[shift]}</div>
      ${renderShiftBandPanel(shift, bands, scheduleContext)}
      <div class="machine-grid shift-column-grid">
        ${row.map((slot) => slot.active
          ? renderShiftOnlyMachineCard(slot.machineId, shift, daySchedule[slot.machineId], conflictSet, scheduleContext)
          : renderInactiveMergedSlot()).join("")}
      </div>
    </section>
  `;
}

function buildShiftBands(activeSlots, shift, scheduleContext, colorOffset = 0) {
  if (!scheduleContext) {
    return [];
  }
  const positionMap = new Map(activeSlots.map((slot, index) => [String(slot.machineId), index + 1]));
  const groups = scheduleContext.nurseProfile?.shiftGroups?.[shift] || [];
  const nurseIds = scheduleContext.staffSchedule?.[shift]?.nurses || [];
  return groups.map((group, groupIndex) => {
    if (!group || group.empty || !Array.isArray(group.machines) || !group.machines.length) {
      return null;
    }
    const rowMachines = group.machines
      .map(String)
      .filter((machineId) => positionMap.has(machineId))
      .sort((left, right) => positionMap.get(left) - positionMap.get(right));
    if (!rowMachines.length) {
      return null;
    }
    const columns = rowMachines.map((machineId) => positionMap.get(machineId));
    const startColumn = Math.min(...columns);
    const endColumn = Math.max(...columns) + 1;
    const nurseId = nurseIds[groupIndex];
    const nurseName = nurseId ? getStaffDisplayName(nurseId) : `护士${groupIndex + 1}（未安排）`;
    const swapNote = getStaffSwapNoteFromShift(scheduleContext.staffSchedule?.[shift], "nurse", groupIndex);
    const color = getNurseZoneColor(groupIndex + colorOffset);
    const zoneLabel = group.zoneLabel || (group.severeZone ? "重病区" : "普通区");
    return {
      shift,
      startColumn,
      endColumn,
      nurseId,
      nurseName,
      swapNote,
      swapText: formatStaffSwapNote(swapNote),
      color,
      zoneLabel,
      patientCount: group.patientCount,
      capacity: group.capacity,
      hdfCount: group.hemofiltrationMachineCount || 0,
      rowMachines,
    };
  })
    .filter(Boolean)
    .sort((left, right) => left.startColumn - right.startColumn || left.endColumn - right.endColumn);
}

function renderShiftBandPanel(shift, bands, scheduleContext = null) {
  const backupNurseId = scheduleContext?.staffSchedule?.[shift]?.backupNurse || "";
  const backupSwapText = formatStaffSwapNote(getStaffSwapNoteFromShift(scheduleContext?.staffSchedule?.[shift], "backupNurse", -1));
  return `
    <section class="shift-band-panel shift-band-${shift}">
      ${backupNurseId ? `
        <div class="shift-backup-nurse">
          <span>后备护士：${escapeHtml(getStaffDisplayName(backupNurseId))}</span>
          ${backupSwapText ? `<em>${escapeHtml(backupSwapText)}</em>` : ""}
        </div>
      ` : ""}
      ${bands.length ? `
        <div class="aligned-nurse-grid shift-panel-grid">
          ${bands.map((band) => {
            const machineButtons = band.rowMachines.map((machineId) => `
              <span class="aligned-nurse-machine ${isHemofiltrationMachine(machineId) ? "hdf" : ""}">${escapeHtml(machineId)}</span>
            `).join("");
            return `
              <article class="aligned-nurse-band packed-band ${band.shift === "morning" ? "shift-morning" : "shift-afternoon"}"
                style="grid-column:${band.startColumn} / ${band.endColumn};--nurse-accent:${escapeHtml(band.color.accent)};--nurse-soft:${escapeHtml(band.color.soft)};--nurse-border:${escapeHtml(band.color.border)}">
                <div class="aligned-nurse-name">${escapeHtml(band.nurseName)}</div>
                ${band.swapText ? `<div class="aligned-nurse-swap-note">${escapeHtml(band.swapText)}</div>` : ""}
                <div class="aligned-nurse-machines">${machineButtons}</div>
                <div class="aligned-nurse-meta">
                  <span>${escapeHtml(band.zoneLabel)}</span>
                  <span>${escapeHtml(`${band.patientCount}/${band.capacity}人`)}</span>
                  ${band.hdfCount ? `<span>血滤${escapeHtml(band.hdfCount)}台</span>` : ""}
                </div>
              </article>
            `;
          }).join("")}
        </div>
      ` : `<div class="aligned-nurse-empty shift-panel-empty">本班次暂无护士管区</div>`}
    </section>
  `;
}

function renderInactiveMergedSlot() {
  return `<div class="machine-card inactive-machine-slot"><span>空位</span></div>`;
}

function renderShiftOnlyMachineCard(machineId, shift, machineSchedule = {}, conflictSet, scheduleContext = null) {
  const machineType = getMachineType(machineId);
  const machineTypeLabel = getMachineTypeLabel(machineId);
  const machineZone = getMachineZone(machineId);
  const hasZone = machineZone !== MACHINE_ZONE_NORMAL;
  const paused = isMachinePaused(machineId);
  const assignment = machineSchedule?.[shift];
  return `
    <article class="machine-card ${getMachineTypeClass(machineType)} ${getMachineZoneClass(machineZone)} ${paused ? "machine-paused" : ""}">
      <div class="machine-card-header compact">
        <span class="machine-id">${escapeHtml(machineId)}</span>
        <div class="machine-card-actions">
          ${paused ? `<span class="machine-type-badge paused">暂停</span>` : ""}
          ${hasZone ? `<span class="machine-type-badge ${getMachineZoneClass(machineZone)}">${escapeHtml(getMachineZoneLabel(machineId))}</span>` : ""}
          <span class="machine-type-badge ${getMachineTypeClass(machineType)}">${escapeHtml(machineTypeLabel)}</span>
        </div>
      </div>
      ${renderShiftSlot(machineId, shift, assignment, conflictSet, scheduleContext, paused)}
    </article>
  `;
}

function renderShiftSlot(machineId, shift, assignment, conflictSet, scheduleContext = null, machinePaused = false) {
  const patient = assignment?.patientId ? findPatient(assignment.patientId) : null;
  const isConflict = conflictSet.has(`${machineId}:${shift}`);
  const nurseVisual = getNurseZoneVisual(machineId, shift, scheduleContext);
  const classes = [
    "shift-slot",
    patient ? "assigned" : "",
    patient?.temporaryInsert ? "temporary-patient-slot" : "",
    isConflict ? "conflict" : "",
    machinePaused ? "paused-machine-slot" : "",
    nurseVisual ? "nurse-zone-linked" : "",
  ].filter(Boolean).join(" ");
  const nurseStyle = nurseVisual
    ? `style="--nurse-accent:${escapeHtml(nurseVisual.color.accent)};--nurse-soft:${escapeHtml(nurseVisual.color.soft)};--nurse-border:${escapeHtml(nurseVisual.color.border)}"`
    : "";
  const source = getSlotSource(getCurrentDate(), machineId, shift);
  const sourceLabel = source === "date" ? "单日调整" : source === "weekly" ? "周模板" : "";
  const content = patient
    ? `
      <div class="slot-patient">${escapeHtml(patient.name)}</div>
      ${patient.temporaryInsert ? `<span class="slot-temporary-badge">临时插入</span>` : ""}
      <div class="patient-subline">${escapeHtml(buildPatientSubline(patient))}</div>
      ${assignment.note ? `<div class="slot-note">${escapeHtml(assignment.note)}</div>` : ""}
    `
    : `<div class="slot-empty">${machinePaused ? "机器暂停" : "未安排"}</div>`;

  return `
    <button class="${classes}" ${nurseStyle} type="button" data-machine="${escapeHtml(machineId)}" data-shift="${shift}">
      <span class="slot-topline">
        <span class="slot-label">${SHIFT_LABELS[shift]}</span>
        <span class="slot-add">${patient ? "编辑" : "安排"}</span>
      </span>
      ${nurseVisual ? `<span class="slot-nurse-dot" title="${escapeHtml(nurseVisual.nurseName)}负责"></span>` : ""}
      ${machinePaused && patient ? `<span class="slot-paused-warning">机器已暂停，请调整患者</span>` : ""}
      ${sourceLabel ? `<span class="slot-source">${sourceLabel}</span>` : ""}
      ${content}
    </button>
  `;
}

function getNurseZoneVisual(machineId, shift, scheduleContext) {
  if (!scheduleContext) {
    return null;
  }
  const groups = scheduleContext.nurseProfile?.shiftGroups?.[shift] || [];
  const groupIndex = getMachineGroupIndex(machineId, groups);
  if (groupIndex < 0) {
    return null;
  }
  const group = groups[groupIndex];
  if (!group || group.empty) {
    return null;
  }
  const nurseId = scheduleContext.staffSchedule?.[shift]?.nurses?.[groupIndex];
  return {
    group,
    groupIndex,
    nurseName: nurseId ? getStaffDisplayName(nurseId) : `护士${groupIndex + 1}`,
    color: getNurseZoneColor(groupIndex),
  };
}

function getNurseZoneColor(index = 0) {
  return NURSE_ZONE_COLORS[Math.abs(Number(index) || 0) % NURSE_ZONE_COLORS.length];
}

function openAssignmentDialog(machineId, shift) {
  selectedSlot = { machineId, shift };
  const date = getCurrentDate();
  const assignment = getEffectiveSlot(date, machineId, shift) || {};
  const patientOptions = state.patients
    .filter((patient) => patient.id === assignment.patientId || (patient.status === "active" && patientFitsMachine(patient, machineId)))
    .sort(sortPatients)
    .map((patient) => {
      const details = [patient.dialysisNo, getPatientTreatmentLabel(patient), getPatientCareLabel(patient), patient.vascularAccess, patient.infectionFlag, formatPreference(patient.preferredShift, patient.preferredDays, patient.forcePreferredDays)]
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
    isMachinePaused(machineId) ? "机器已暂停" : "",
  ].filter(Boolean).join(" · ");
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
    showToast(getDynamicMessage("sundayNoWeeklyPatientTemplate"));
    return;
  }

  if (patientId && isMachinePaused(machineId)) {
    window.alert(getDynamicMessage("machinePausedCannotAssign", { machineId }));
    return;
  }

  if (!patientId) {
    captureUndoSnapshot("手工清空机位");
    clearScheduleSlot(targetSchedule, targetKey, machineId, shift, scope === "date" && Boolean(getWeeklySlot(date, machineId, shift)));
  } else {
    const patient = findPatient(patientId);
    if (patient && !patientFitsMachine(patient, machineId)) {
      window.alert(getDynamicMessage("patientMachineMismatch", {
      patientName: patient.name,
      treatment: getPatientTreatmentLabel(patient),
      machineId,
      machineType: getMachineTypeLabel(machineId),
      machineZone: getMachineZoneLabel(machineId),
    }));
      return;
    }
    if (patient?.fixedMachineId && scope === "weekly" && machineId !== patient.fixedMachineId) {
      window.alert(getDynamicMessage("fixedMachineWeeklyConflict", {
      patientName: patient.name,
      fixedMachineId: patient.fixedMachineId,
      machineId,
    }));
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
      captureUndoSnapshot(`手工移动患者到${machineId}号机`);
      moveExistingAssignments(existing, date, shift, scope);
    } else {
      captureUndoSnapshot(`手工安排患者到${machineId}号机`);
    }
    setScheduleSlot(targetSchedule, targetKey, machineId, shift, {
      patientId,
      treatmentType: normalizeMachineType(patient.treatmentType),
      note,
      updatedAt: new Date().toISOString(),
    });
    if (scope === "weekly") {
      clearScheduleSlot(state.schedules, date, machineId, shift, false);
      pruneEmptySchedule(state.schedules, date, machineId);
    }
  }

  pruneEmptySchedule(targetSchedule, targetKey, machineId);
  if (scope === "weekly") {
    copyWeeklyViewBackToCycle();
  }
  saveState();
  ui.assignmentDialog.close();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast(getDynamicMessage("scheduleSaved"));
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
  captureUndoSnapshot("移除机位安排");
  clearScheduleSlot(targetSchedule, targetKey, machineId, shift, scope === "date" && Boolean(getWeeklySlot(date, machineId, shift)));
  pruneEmptySchedule(targetSchedule, targetKey, machineId);
  if (scope === "weekly") {
    copyWeeklyViewBackToCycle();
  }
  saveState();
  ui.assignmentDialog.close();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  showToast(scope === "weekly" ? getDynamicMessage("weeklyTemplateRemoved") : getDynamicMessage("dayScheduleRemoved"));
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

function syncMonthlyHdfAvailability() {
  if (!ui.monthlyHdfCount || !ui.patientTreatmentType) {
    return;
  }
  const supportsMonthlyHdf = ui.patientTreatmentType.value === DEFAULT_MACHINE_TYPE;
  ui.monthlyHdfCount.disabled = !supportsMonthlyHdf;
  if (!supportsMonthlyHdf) {
    ui.monthlyHdfCount.value = "0";
  }
  ui.monthlyHdfCount.title = supportsMonthlyHdf
    ? "普通血透患者可设置未来 4 周内的血滤次数"
    : "常规治疗不是血透时，不再另行生成月度血滤";
}

function getInsertFormField(name) {
  return ui.insertPatientForm?.elements?.[name] || null;
}

function getInsertCheckedDays() {
  return [...(ui.insertPatientForm?.querySelectorAll('input[name="preferredDays"]:checked') || [])]
    .map((input) => input.value);
}

function setInsertCheckedDays(values = []) {
  const selected = new Set(values.map(String));
  ui.insertPatientForm?.querySelectorAll('input[name="preferredDays"]').forEach((input) => {
    input.checked = selected.has(input.value);
  });
}

function openInsertPatientDialog() {
  ui.insertPatientForm.reset();
  getInsertFormField("scheduleScope").value = "date";
  getInsertFormField("treatmentType").value = DEFAULT_MACHINE_TYPE;
  getInsertFormField("weeklyTreatmentCount").value = "3";
  getInsertFormField("monthlyHdfCount").value = "2";
  getInsertFormField("careLevel").value = STANDARD_CARE_LEVEL;
  const currentDayKey = getWeekdayKey(getCurrentDate());
  setInsertCheckedDays(WORKING_DAY_KEYS.includes(currentDayKey) ? [currentDayKey] : []);
  renderMachineOptionsForSelect(getInsertFormField("fixedMachineId"), "", "首次自动排班后固定");
  syncInsertMonthlyHdfAvailability();
  ui.insertPatientDialog.showModal();
}

function closeInsertPatientDialog() {
  ui.insertPatientDialog.close();
}

function getActiveNurses() {
  return state.staffMembers
    .filter((staff) => staff.role === "nurse" && staff.status === "active")
    .sort(sortStaffMembers);
}

function openShiftSwapDialog() {
  renderShiftSwapNurseOptions();
  ui.shiftSwapStartDate.value = getCurrentDate();
  ui.shiftSwapDays.value = "7";
  ui.shiftSwapMode.value = "specified";
  renderShiftSwapCandidates();
  syncShiftSwapCandidateHint();
  ui.shiftSwapDialog.showModal();
}

function closeShiftSwapDialog() {
  ui.shiftSwapDialog.close();
}

function renderShiftSwapNurseOptions() {
  const nurses = getActiveNurses();
  ui.shiftSwapTarget.innerHTML = [
    `<option value="">${nurses.length ? "请选择护士" : "请先到医护库新增在岗护士"}</option>`,
    ...nurses.map((staff) => {
      const code = staff.code ? ` · ${staff.code}` : "";
      return `<option value="${escapeHtml(staff.id)}">${escapeHtml(staff.name + code)}</option>`;
    }),
  ].join("");
}

function renderShiftSwapCandidates() {
  const targetId = ui.shiftSwapTarget.value;
  const nurses = getActiveNurses().filter((staff) => staff.id !== targetId);
  if (!targetId) {
    ui.shiftSwapCandidates.innerHTML = `<div class="shift-swap-empty">先选择需要连续休息的护士。</div>`;
    return;
  }
  if (!nurses.length) {
    ui.shiftSwapCandidates.innerHTML = `<div class="shift-swap-empty">暂无其他在岗护士可调班。</div>`;
    return;
  }
  ui.shiftSwapCandidates.innerHTML = nurses
    .map((staff) => {
      const preference = staff.preferredShift ? SHIFT_LABELS[staff.preferredShift] : "不限";
      const code = staff.code ? ` · ${staff.code}` : "";
      return `
        <label>
          <input name="shiftSwapCandidate" type="checkbox" value="${escapeHtml(staff.id)}"/>
          <span>${escapeHtml(`${staff.name}${code}（${preference}）`)}</span>
        </label>
      `;
    })
    .join("");
}

function syncShiftSwapCandidateHint() {
  const specified = ui.shiftSwapMode.value === "specified";
  ui.shiftSwapCandidateHint.textContent = specified
    ? "当前为指定调班：只会从下面勾选的人里找人接班；如果不够，系统会停止并提示。"
    : "当前为自动调班：系统会从所有在岗护士里找合适人员；下面勾选的人不会限制系统。";
}

function getSelectedShiftSwapCandidateIds() {
  return [...ui.shiftSwapCandidates.querySelectorAll('input[name="shiftSwapCandidate"]:checked')]
    .map((input) => input.value);
}

async function handleShiftSwapSubmit(event) {
  event.preventDefault();
  const targetId = ui.shiftSwapTarget.value;
  const target = findStaff(targetId);
  const startDate = ui.shiftSwapStartDate.value || getCurrentDate();
  const days = clampNumber(ui.shiftSwapDays.value, 1, 31, 7);
  const mode = ui.shiftSwapMode.value === "auto" ? "auto" : "specified";
  const candidateIds = getSelectedShiftSwapCandidateIds();

  if (!target || target.role !== "nurse" || target.status !== "active") {
    window.alert("请先选择需要连续休息的在岗护士。");
    return;
  }
  if (mode === "specified" && !candidateIds.length) {
    window.alert("指定调班模式下，请至少勾选 1 名调班人。");
    return;
  }

  closeShiftSwapDialog();
  showTaskProgress("正在生成智能调班方案", "读取当前医护排班", 10);
  await waitForBrowserPaint();
  try {
    const plan = await buildShiftSwapPlan({ targetId, startDate, days, mode, candidateIds });
    if (!plan.changes.length && !plan.unresolved.length) {
      await closeTaskProgress("没有需要调班的班次", 0);
      window.alert(`${target.name} 在 ${plan.rangeText} 内没有已排医护班次，本来就可以休息。`);
      return;
    }
    if (plan.unresolved.length) {
      await closeTaskProgress("调班方案不完整", 0);
      window.alert([
        `${target.name} 还不能连续休息 ${days} 天，因为以下接班或补班没有安排完整：`,
        "",
        ...plan.unresolved.slice(0, 18).map((item) => `- ${item.label}`),
        plan.unresolved.length > 18 ? `- 其余 ${plan.unresolved.length - 18} 项未显示` : "",
        "",
        mode === "specified" ? "建议：增加指定调班人，或改用系统自动找人。" : "建议：延长后续可补班周期、新增在岗护士，或手动调整这些班次。",
      ].filter(Boolean).join("\n"));
      return;
    }

    await stepTaskProgress(76, "生成调班预览");
    const preview = formatShiftSwapPreview(plan);
    await closeTaskProgress("调班方案已生成", 0);
    if (!window.confirm(preview)) {
      return;
    }

    showTaskProgress("正在保存智能调班", "写入临时医护排班覆盖", 84);
    await waitForBrowserPaint();
    captureUndoSnapshot(`智能调班 ${target.name} 连休${days}天`);
    Object.entries(plan.daySchedules).forEach(([dateValue, daySchedule]) => {
      state.staffSchedules[dateValue] = structuredClone(daySchedule);
    });
    saveState();
    await stepTaskProgress(94, "刷新医护排班和排班台");
    renderStaffSchedule();
    renderSchedule();
    renderSummary();
    await closeTaskProgress("智能调班已完成");
    showShiftSwapResultDialog(plan);
    showToast(`${target.name} 已安排 ${days} 天连续休息，替班 ${plan.changes.length} 个半日班，后续补回 ${plan.compensations.length} 个半日班`);
  } catch (error) {
    console.error("智能调班失败", error);
    await closeTaskProgress("智能调班失败", 0);
    window.alert(`智能调班失败：${error?.message || error}`);
  }
}

async function buildShiftSwapPlan({ targetId, startDate, days, mode, candidateIds }) {
  const start = parseDateInput(startDate);
  const dates = Array.from({ length: days }, (_, index) => formatDateInput(addDays(start, index)));
  const protectedDateSet = new Set(dates);
  const candidatePool = getShiftSwapCandidatePool(targetId, mode, candidateIds);
  const loadMap = await buildShiftSwapLoadMap([findStaff(targetId), ...candidatePool].filter(Boolean), startDate);
  const usage = new Map();
  const daySchedules = {};
  const changes = [];
  const compensations = [];
  const unresolved = [];

  await stepTaskProgress(18, `准备 ${candidatePool.length} 名候选接班护士`);
  for (let dateIndex = 0; dateIndex < dates.length; dateIndex += 1) {
    const dateValue = dates[dateIndex];
    const nurseCount = getRequiredNurseCountForDate(dateValue);
    const daySchedule = getShiftSwapPlanDaySchedule(dateValue, daySchedules, nurseCount);
    const assignments = getNurseAssignmentsForStaff(daySchedule, targetId);
    assignments.forEach((assignment) => {
      const replacement = findShiftSwapReplacement({
        dateValue,
        daySchedule,
        assignment,
        candidatePool,
        targetId,
        usage,
        loadMap,
      });
      if (!replacement) {
        unresolved.push({
          type: "cover",
          dateValue,
          label: `找不到接班人：${formatDateLabel(dateValue)} ${SHIFT_LABELS[assignment.shift]} ${assignment.roleLabel}`,
        });
        return;
      }
      const groupNumber = changes.length + 1;
      setNurseAssignment(daySchedule, assignment, replacement.id, {
        type: "cover",
        partnerId: targetId,
        group: groupNumber,
        text: `替${getStaffDisplayName(targetId)}`,
      });
      usage.set(replacement.id, (usage.get(replacement.id) || 0) + 1);
      loadMap.set(replacement.id, (loadMap.get(replacement.id) || 0) + 1);
      loadMap.set(targetId, Math.max(0, (loadMap.get(targetId) || 0) - 1));
      changes.push({
        group: groupNumber,
        dateValue,
        shift: assignment.shift,
        role: assignment.role,
        index: assignment.index,
        roleLabel: assignment.roleLabel,
        fromId: targetId,
        toId: replacement.id,
      });
    });
    if (assignments.length) {
      daySchedules[dateValue] = normalizeStaffScheduleDay(daySchedule, getStoredStaffNurseCount(daySchedule));
    }
    await stepTaskProgress(20 + Math.round(((dateIndex + 1) / Math.max(dates.length, 1)) * 34), `检查连休窗口 ${dateIndex + 1}/${dates.length} 天`);
  }

  if (!unresolved.length) {
    for (let changeIndex = 0; changeIndex < changes.length; changeIndex += 1) {
      const change = changes[changeIndex];
      const compensation = await findShiftSwapCompensation({
        change,
        targetId,
        startSearchDate: formatDateInput(addDays(start, days)),
        protectedDateSet,
        daySchedules,
      });
      if (!compensation) {
        unresolved.push({
          type: "payback",
          dateValue: change.dateValue,
          label: `找不到补班位置：${getStaffDisplayName(change.toId)} 已替 ${getStaffDisplayName(targetId)} 上 ${formatDateLabel(change.dateValue)} ${SHIFT_LABELS[change.shift]}，但后续没有可让 ${getStaffDisplayName(targetId)} 补回的班次`,
        });
        break;
      }
      compensations.push(compensation);
      const coverSchedule = getShiftSwapPlanDaySchedule(change.dateValue, daySchedules);
      setNurseAssignment(coverSchedule, change, change.toId, {
        type: "cover",
        partnerId: targetId,
        group: change.group,
        relatedDateValue: compensation.dateValue,
        relatedShift: compensation.shift,
        text: `替${getStaffDisplayName(targetId)}；${getStaffDisplayName(targetId)}后续补回`,
      });
      daySchedules[change.dateValue] = normalizeStaffScheduleDay(coverSchedule, getStoredStaffNurseCount(coverSchedule));
      loadMap.set(targetId, (loadMap.get(targetId) || 0) + 1);
      loadMap.set(change.toId, Math.max(0, (loadMap.get(change.toId) || 0) - 1));
      await stepTaskProgress(56 + Math.round(((changeIndex + 1) / Math.max(changes.length, 1)) * 18), `安排后续补班 ${changeIndex + 1}/${changes.length}`);
    }
  }

  return {
    targetId,
    startDate: formatDateInput(start),
    endDate: formatDateInput(addDays(start, days - 1)),
    days,
    mode,
    candidatePool,
    changes,
    compensations,
    unresolved,
    daySchedules,
    rangeText: `${formatDateLabel(formatDateInput(start))} 至 ${formatDateLabel(formatDateInput(addDays(start, days - 1)))}`,
  };
}

function getShiftSwapCandidatePool(targetId, mode, candidateIds = []) {
  const activeNurses = getActiveNurses().filter((staff) => staff.id !== targetId);
  const allowed = mode === "specified" ? new Set(candidateIds.map(String)) : null;
  return activeNurses.filter((staff) => !allowed || allowed.has(staff.id));
}

async function buildShiftSwapLoadMap(staffList, centerDateValue) {
  const uniqueStaff = [...new Map(staffList.map((staff) => [staff.id, staff])).values()];
  const loadMap = new Map(uniqueStaff.map((staff) => [staff.id, 0]));
  const center = parseDateInput(centerDateValue);
  const dateValues = Array.from({ length: 14 }, (_, index) => formatDateInput(addDays(center, index - 6)));
  for (let index = 0; index < dateValues.length; index += 1) {
    const dateValue = dateValues[index];
    const daySchedule = getStaffScheduleForShiftSwapDate(dateValue, getRequiredNurseCountForDate(dateValue));
    uniqueStaff.forEach((staff) => {
      const count = STAFF_SHIFT_KEYS.filter((shift) => isNurseScheduledInShift(daySchedule, shift, staff.id)).length;
      if (count) {
        loadMap.set(staff.id, (loadMap.get(staff.id) || 0) + count);
      }
    });
    if ((index + 1) % 4 === 0) {
      await waitForBrowserPaint();
    }
  }
  return loadMap;
}

function getStaffScheduleForShiftSwapDate(dateValue, nurseCount) {
  if (state.staffSchedules?.[dateValue]) {
    return normalizeStaffScheduleDay(structuredClone(state.staffSchedules[dateValue]), nurseCount);
  }
  if (hasTwoWeekCycleTemplate()) {
    const weekKey = getCycleWeekKey(getCycleWeekNumberForDate(dateValue));
    const dayKey = getWeekdayKey(dateValue);
    const cycleDay = state.twoWeekCycle?.staffSchedules?.[weekKey]?.[dayKey];
    if (cycleDay) {
      return normalizeStaffScheduleDay(structuredClone(cycleDay), nurseCount);
    }
  }
  const weekly = state.weeklyStaffSchedules?.[getWeekdayKey(dateValue)];
  return weekly ? normalizeStaffScheduleDay(structuredClone(weekly), nurseCount) : createEmptyStaffScheduleDay(nurseCount);
}

function getShiftSwapPlanDaySchedule(dateValue, daySchedules, nurseCount = getRequiredNurseCountForDate(dateValue)) {
  if (!daySchedules[dateValue]) {
    daySchedules[dateValue] = getStaffScheduleForShiftSwapDate(dateValue, nurseCount);
  }
  return daySchedules[dateValue];
}

function getNurseAssignmentsForStaff(daySchedule = {}, staffId) {
  const assignments = [];
  STAFF_SHIFT_KEYS.forEach((shift) => {
    const entry = daySchedule?.[shift] || {};
    (entry.nurses || []).forEach((value, index) => {
      if (value === staffId) {
        assignments.push({ shift, role: "nurse", index, roleLabel: `责任护士${index + 1}` });
      }
    });
    if (entry.backupNurse === staffId) {
      assignments.push({ shift, role: "backupNurse", index: -1, roleLabel: "后备护士" });
    }
  });
  return assignments;
}

async function findShiftSwapCompensation({ change, targetId, startSearchDate, protectedDateSet, daySchedules }) {
  const start = parseDateInput(startSearchDate);
  const searchDays = 56;
  for (let offset = 0; offset < searchDays; offset += 1) {
    if (offset > 0 && offset % 7 === 0) {
      await waitForBrowserPaint();
    }
    const dateValue = formatDateInput(addDays(start, offset));
    if (protectedDateSet.has(dateValue)) {
      continue;
    }
    const daySchedule = getShiftSwapPlanDaySchedule(dateValue, daySchedules);
    const assignments = getNurseAssignmentsForStaff(daySchedule, change.toId)
      .filter((assignment) => !isNurseScheduledInShift(daySchedule, assignment.shift, targetId))
      .sort((left, right) =>
        Number(right.shift === change.shift) - Number(left.shift === change.shift) ||
        Number(right.role === change.role) - Number(left.role === change.role) ||
        STAFF_SHIFT_KEYS.indexOf(left.shift) - STAFF_SHIFT_KEYS.indexOf(right.shift) ||
        left.roleLabel.localeCompare(right.roleLabel, "zh-CN", { numeric: true }),
      );
    if (!assignments.length) {
      continue;
    }
    const assignment = assignments[0];
    setNurseAssignment(daySchedule, assignment, targetId, {
      type: "payback",
      partnerId: change.toId,
      group: change.group,
      relatedDateValue: change.dateValue,
      relatedShift: change.shift,
      text: `补回${getStaffDisplayName(change.toId)}`,
    });
    daySchedules[dateValue] = normalizeStaffScheduleDay(daySchedule, getStoredStaffNurseCount(daySchedule));
    return {
      dateValue,
      shift: assignment.shift,
      role: assignment.role,
      roleLabel: assignment.roleLabel,
      fromId: change.toId,
      toId: targetId,
      originalChange: change,
    };
  }
  return null;
}

function findShiftSwapReplacement({ dateValue, daySchedule, assignment, candidatePool, targetId, usage, loadMap }) {
  const available = candidatePool
    .filter((staff) => staff.id !== targetId)
    .filter((staff) => !isNurseScheduledInShift(daySchedule, assignment.shift, staff.id));
  if (!available.length) {
    return null;
  }
  return [...available].sort((left, right) => {
    const leftBusy = isNurseScheduledInDay(daySchedule, left.id) ? 1 : 0;
    const rightBusy = isNurseScheduledInDay(daySchedule, right.id) ? 1 : 0;
    const leftUsage = usage.get(left.id) || 0;
    const rightUsage = usage.get(right.id) || 0;
    const leftPreference = scoreShiftPreference(left, assignment.shift);
    const rightPreference = scoreShiftPreference(right, assignment.shift);
    const leftLoad = loadMap?.get(left.id) || 0;
    const rightLoad = loadMap?.get(right.id) || 0;
    return leftUsage - rightUsage ||
      leftBusy - rightBusy ||
      rightPreference - leftPreference ||
      leftLoad - rightLoad ||
      sortStaffMembers(left, right);
  })[0];
}

function isNurseScheduledInShift(daySchedule = {}, shift, staffId) {
  const entry = daySchedule?.[shift] || {};
  return (entry.nurses || []).includes(staffId) || entry.backupNurse === staffId;
}

function isNurseScheduledInDay(daySchedule = {}, staffId) {
  return STAFF_SHIFT_KEYS.some((shift) => isNurseScheduledInShift(daySchedule, shift, staffId));
}

function countNurseHalfDayAssignments(staffId, centerDateValue) {
  const center = parseDateInput(centerDateValue);
  return Array.from({ length: 14 }, (_, index) => formatDateInput(addDays(center, index - 6)))
    .reduce((count, dateValue) => {
      const daySchedule = getStaffScheduleForShiftSwapDate(dateValue, getRequiredNurseCountForDate(dateValue));
      return count + STAFF_SHIFT_KEYS.filter((shift) => isNurseScheduledInShift(daySchedule, shift, staffId)).length;
    }, 0);
}

function setNurseAssignment(daySchedule, assignment, replacementId, swapNote = null) {
  const entry = daySchedule[assignment.shift];
  if (assignment.role === "backupNurse") {
    entry.backupNurse = replacementId;
    setStaffSwapNote(daySchedule, assignment.shift, "backupNurse", -1, swapNote);
    return;
  }
  entry.nurses[assignment.index] = replacementId;
  setStaffSwapNote(daySchedule, assignment.shift, "nurse", assignment.index, swapNote);
}

function formatShiftSwapPreview(plan) {
  const targetName = getStaffDisplayName(plan.targetId);
  const replacementNames = [...new Set(plan.changes.map((item) => getStaffDisplayName(item.toId)))].join("、");
  const coverLines = plan.changes.slice(0, 14).map((item) =>
    `- ${formatDateLabel(item.dateValue)} ${SHIFT_LABELS[item.shift]} ${item.roleLabel}：${targetName} → ${getStaffDisplayName(item.toId)}`,
  );
  const paybackLines = plan.compensations.slice(0, 14).map((item) =>
    `- ${formatDateLabel(item.dateValue)} ${SHIFT_LABELS[item.shift]} ${item.roleLabel}：${getStaffDisplayName(item.fromId)} → ${targetName}`,
  );
  const hiddenCover = plan.changes.length > coverLines.length ? [`- 其余 ${plan.changes.length - coverLines.length} 个替班未显示`] : [];
  const hiddenPayback = plan.compensations.length > paybackLines.length ? [`- 其余 ${plan.compensations.length - paybackLines.length} 个补班未显示`] : [];
  const modeText = plan.mode === "specified"
    ? "只使用护士长指定的调班人。"
    : "系统自动找人；请护士长或该护士再与接班人确认。";
  return [
    `确认执行智能调班吗？`,
    "",
    `${targetName} 将在 ${plan.rangeText} 连续休息 ${plan.days} 天。`,
    `别人先替 ${targetName} 上 ${plan.changes.length} 个半日班；${targetName} 后面补回 ${plan.compensations.length} 个半日班。`,
    `接班人：${replacementNames || "无"}`,
    modeText,
    "",
    "一、休息期间谁替她：",
    ...coverLines,
    ...hiddenCover,
    "",
    "二、后面她替谁补回：",
    ...paybackLines,
    ...hiddenPayback,
  ].join("\n");
}

function showShiftSwapResultDialog(plan) {
  const targetName = getStaffDisplayName(plan.targetId);
  ui.shiftSwapResultTitle.textContent = `智能调班明细：${targetName}`;
  ui.shiftSwapResultMeta.textContent = `${plan.rangeText} 连续休息 ${plan.days} 天；休息期间替班 ${plan.changes.length} 个半日班，后续补班 ${plan.compensations.length} 个半日班。`;
  ui.shiftSwapResultContent.innerHTML = renderShiftSwapResultTable(plan);
  ui.shiftSwapResultDialog.showModal();
}

function renderShiftSwapResultTable(plan) {
  const targetName = getStaffDisplayName(plan.targetId);
  const rows = [
    ...plan.changes.map((item, index) => ({
      type: "休息期间替班",
      dateValue: item.dateValue,
      shift: item.shift,
      roleLabel: item.roleLabel,
      fromName: targetName,
      toName: getStaffDisplayName(item.toId),
      relation: `${getStaffDisplayName(item.toId)} 先替 ${targetName}；对应补班见第 ${index + 1} 组`,
      group: index + 1,
      tone: "cover",
    })),
    ...plan.compensations.map((item, index) => ({
      type: "后续补班",
      dateValue: item.dateValue,
      shift: item.shift,
      roleLabel: item.roleLabel,
      fromName: getStaffDisplayName(item.fromId),
      toName: targetName,
      relation: `${targetName} 补回 ${getStaffDisplayName(item.fromId)}；对应替班为第 ${index + 1} 组`,
      group: index + 1,
      tone: "payback",
    })),
  ].sort((left, right) =>
    left.group - right.group ||
    Number(left.tone === "payback") - Number(right.tone === "payback") ||
    String(left.dateValue).localeCompare(String(right.dateValue)),
  );

  const body = rows.map((row) => `
    <tr class="shift-swap-result-row ${escapeHtml(row.tone)}">
      <td>${escapeHtml(String(row.group))}</td>
      <td><span class="shift-swap-result-type">${escapeHtml(row.type)}</span></td>
      <td>${escapeHtml(formatDateLabel(row.dateValue))}</td>
      <td>${escapeHtml(SHIFT_LABELS[row.shift] || row.shift)}</td>
      <td>${escapeHtml(row.roleLabel)}</td>
      <td>${escapeHtml(row.fromName)}</td>
      <td>${escapeHtml(row.toName)}</td>
      <td>${escapeHtml(row.relation)}</td>
    </tr>
  `).join("");

  return `
    <section class="review-section shift-swap-result-summary">
      <h3>护士长核对重点</h3>
      <div class="shift-swap-summary-grid">
        <span><b>休息护士</b>${escapeHtml(targetName)}</span>
        <span><b>连续休息</b>${escapeHtml(`${plan.days} 天`)}</span>
        <span><b>替班</b>${escapeHtml(`${plan.changes.length} 个半日班`)}</span>
        <span><b>补班</b>${escapeHtml(`${plan.compensations.length} 个半日班`)}</span>
      </div>
    </section>
    <section class="review-section">
      <h3>换班明细表</h3>
      <div class="review-table-wrap shift-swap-result-table-wrap">
        <table class="review-table shift-swap-result-table">
          <thead>
            <tr>
              <th>组</th>
              <th>类型</th>
              <th>日期</th>
              <th>班次</th>
              <th>岗位</th>
              <th>原护士</th>
              <th>调整后护士</th>
              <th>对应关系</th>
            </tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </section>
  `;
}

function syncInsertMonthlyHdfAvailability() {
  const treatmentType = getInsertFormField("treatmentType");
  const monthlyHdfCount = getInsertFormField("monthlyHdfCount");
  if (!treatmentType || !monthlyHdfCount) return;
  const supportsMonthlyHdf = treatmentType.value === DEFAULT_MACHINE_TYPE;
  monthlyHdfCount.disabled = !supportsMonthlyHdf;
  if (!supportsMonthlyHdf) {
    monthlyHdfCount.value = "0";
  }
}

function createPatientFromInsertForm() {
  const selectedFixedMachine = String(getInsertFormField("fixedMachineId")?.value || "").trim();
  const scheduleScope = getInsertFormField("scheduleScope")?.value === "longTerm" ? "longTerm" : "date";
  const preferredDays = getInsertCheckedDays();
  const currentDayKey = getWeekdayKey(getCurrentDate());
  const patient = normalizePatient({
    id: createId(),
    name: getInsertFormField("name")?.value,
    dialysisNo: getInsertFormField("dialysisNo")?.value,
    gender: getInsertFormField("gender")?.value,
    age: getInsertFormField("age")?.value,
    phone: getInsertFormField("phone")?.value,
    dryWeight: getInsertFormField("dryWeight")?.value,
    vascularAccess: getInsertFormField("vascularAccess")?.value,
    treatmentType: getInsertFormField("treatmentType")?.value,
    weeklyTreatmentCount: getInsertFormField("weeklyTreatmentCount")?.value,
    monthlyHdfCount: getInsertFormField("monthlyHdfCount")?.value,
    status: "active",
    infectionFlag: getInsertFormField("infectionFlag")?.value,
    careLevel: getInsertFormField("careLevel")?.value,
    preferredShift: getInsertFormField("preferredShift")?.value,
    fixedMachineId: selectedFixedMachine,
    fixedMachineLockedAt: selectedFixedMachine ? new Date().toISOString() : "",
    preferredDays: preferredDays.length ? preferredDays : WORKING_DAY_KEYS.includes(currentDayKey) ? [currentDayKey] : [],
    forcePreferredDays: Boolean(getInsertFormField("forcePreferredDays")?.checked),
    temporaryInsert: scheduleScope === "date",
    note: getInsertFormField("note")?.value,
    updatedAt: new Date().toISOString(),
  });
  return { patient, scheduleScope };
}

function validateInsertPatient(patient, scheduleScope) {
  const problems = [];
  if (!patient) {
    problems.push("请先填写患者姓名。");
    return problems;
  }
  if (scheduleScope === "date" && !WORKING_DAY_KEYS.includes(getWeekdayKey(getCurrentDate()))) {
    problems.push("当前日期是周日休息日，不能临时插入治疗；请先切换到周一至周六。");
  }
  if (patient.fixedMachineId) {
    if (!getMachineIds().includes(patient.fixedMachineId)) {
      problems.push(`${patient.name} 选择的固定机位 ${patient.fixedMachineId} 号机当前不存在。`);
    } else if (isMachinePaused(patient.fixedMachineId)) {
      problems.push(`${patient.name} 选择的固定机位 ${patient.fixedMachineId} 号机已暂停。`);
    } else if (!patientFitsMachine(patient, patient.fixedMachineId)) {
      problems.push(`${patient.name} 选择的固定机位 ${patient.fixedMachineId} 号机与治疗类型或分区不匹配。`);
    }
  }
  if (scheduleScope === "longTerm") {
    problems.push(...validateForcedPreferredDaysPatients([patient]));
  }
  return problems;
}

async function handleInsertPatientSubmit(event) {
  event.preventDefault();
  if (event.submitter?.value === "cancel") {
    ui.insertPatientDialog.close();
    return;
  }

  const { patient, scheduleScope } = createPatientFromInsertForm();
  const problems = validateInsertPatient(patient, scheduleScope);
  if (problems.length) {
    window.alert(`无法插入患者：\n\n${problems.map((item) => `- ${item}`).join("\n")}`);
    return;
  }

  const duplicate = state.patients.find((item) => patient.dialysisNo && item.dialysisNo === patient.dialysisNo);
  if (duplicate && !window.confirm(`透析号 ${patient.dialysisNo} 已属于 ${duplicate.name}。仍要插入这名患者吗？`)) {
    return;
  }

  const submitButton = ui.insertPatientForm?.querySelector('[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  showTaskProgress("正在插入患者", "检查患者资料和排班范围", 8);
  await waitForBrowserPaint();

  try {
    await stepTaskProgress(
      28,
      scheduleScope === "longTerm" ? "正在检查长期2周循环空位" : "正在检查当前日期空位",
    );
    captureUndoSnapshot(`插入患者 ${patient.name}`);
    await stepTaskProgress(52, "优先寻找不移动原有患者的空位");
    const result = scheduleScope === "longTerm"
      ? insertLongTermPatient(patient)
      : insertTemporaryDatePatient(patient);

    if (!result.ok) {
      await closeTaskProgress("没有找到可用空位", 0);
      window.alert(`无法插入患者：\n\n${result.messages.map((item) => `- ${item}`).join("\n")}`);
      return;
    }

    await stepTaskProgress(76, "写入患者资料和排班结果");
    ui.insertPatientDialog.close();
    saveState();
    await stepTaskProgress(90, "刷新排班台和统计");
    renderPatientTable();
    renderWeekNavigation();
    renderStaffSchedule();
    renderSchedule();
    renderSummary();
    await closeTaskProgress("患者已插入");
    showToast(result.message);
  } catch (error) {
    console.error("插入患者失败", error);
    await closeTaskProgress("插入患者失败", 0);
    window.alert(`插入患者失败：${error?.message || error}`);
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

function insertTemporaryDatePatient(patient) {
  const date = getCurrentDate();
  const dayKey = getWeekdayKey(date);
  const previousDay = getEffectiveScheduleForDate(date);
  const direct = buildExactDayInsertion(patient, dayKey, previousDay, normalizeMachineType(patient.treatmentType));

  if (direct.assignment) {
    state.patients.push(patient);
    setScheduleSlot(state.schedules, date, direct.assignment.machineId, direct.assignment.shift, {
      patientId: patient.id,
      treatmentType: normalizeMachineType(patient.treatmentType),
      note: "临时插入患者",
      updatedAt: new Date().toISOString(),
    });
    return {
      ok: true,
      message: `${patient.name} 已插入 ${formatDateLabel(date)} ${SHIFT_LABELS[direct.assignment.shift]} ${direct.assignment.machineId}号机，没有移动原有患者。`,
    };
  }

  return {
    ok: false,
    messages: [
      `${patient.name} 当前日期没有可用空位。${explainInsertionNoSlot(patient, dayKey, previousDay, normalizeMachineType(patient.treatmentType))} 系统不会为了新人移动已经排好的患者；请改选日期、班次、治疗类型、机位，或先由护士长手动腾出空位后再插入。`,
    ],
  };
}

function insertLongTermPatient(patient) {
  ensureTwoWeekCycleState();
  copyWeeklyViewBackToCycle();
  const direct = buildLongTermNoMoveInsertionPlan(patient);
  if (direct.ok) {
    state.patients.push({ ...patient, temporaryInsert: false });
    state.twoWeekCycle.patientSchedules.week1 = direct.patientSchedules.week1;
    state.twoWeekCycle.patientSchedules.week2 = direct.patientSchedules.week2;
    state.twoWeekCycle.savedAt = new Date().toISOString();
    state.twoWeekCycle.anchorWeekStart = state.twoWeekCycle.anchorWeekStart || normalizeCycleAnchorWeekStart(getCurrentDate());
    syncCycleWeekToWeeklyView();
    return {
      ok: true,
      message: `${patient.name} 已加入长期2周循环，没有移动原有患者。`,
    };
  }

  return {
    ok: false,
    messages: [
      `${patient.name} 无法在现有长期2周循环中找到全程空位。系统不会为了新人移动已经排好的患者；请调整新人日期/班次/治疗类型/机位，或由护士长先手动腾出空位后再插入。`,
    ],
  };
}

function ensureTwoWeekCycleState() {
  if (!state.twoWeekCycle) {
    state.twoWeekCycle = structuredClone(DEFAULT_STATE.twoWeekCycle);
  }
  state.twoWeekCycle.patientSchedules ||= { week1: {}, week2: {} };
  state.twoWeekCycle.staffSchedules ||= { week1: {}, week2: {} };
  state.twoWeekCycle.patientSchedules.week1 ||= {};
  state.twoWeekCycle.patientSchedules.week2 ||= {};
  state.twoWeekCycle.staffSchedules.week1 ||= {};
  state.twoWeekCycle.staffSchedules.week2 ||= {};
}

function buildExactDayInsertion(patient, dayKey, baseDaySchedule = {}, treatmentType = patient?.treatmentType) {
  if (!WORKING_DAY_KEYS.includes(dayKey)) {
    return { assignment: null, daySchedule: structuredClone(baseDaySchedule || {}) };
  }
  const schedules = { [dayKey]: structuredClone(baseDaySchedule || {}) };
  const assignment = assignWeeklyPatientSession(
    {
      patient,
      originalDay: dayKey,
      requestedDay: dayKey,
      lockedDay: true,
      treatmentType: normalizeMachineType(treatmentType || patient.treatmentType),
    },
    schedules,
    [...getAvailableMachineIds()].sort(sortMachineIds),
    getSpecialMachines().filter((machineId) => !isMachinePaused(machineId)).sort(sortMachineIds),
    getAvailableMachineIds().filter((machineId) => getMachineZone(machineId) === MACHINE_ZONE_NORMAL).sort(sortMachineIds),
    new Map(),
    new Map(),
    SCHEDULE_PRIORITY_PATIENT,
    false,
  );
  return { assignment, daySchedule: schedules[dayKey] || {} };
}

function buildLongTermNoMoveInsertionPlan(patient) {
  const patientSchedules = {
    week1: structuredClone(state.twoWeekCycle?.patientSchedules?.week1 || {}),
    week2: structuredClone(state.twoWeekCycle?.patientSchedules?.week2 || {}),
  };
  const week1 = buildWeeklyInsertionForPatient(patient, patientSchedules.week1, 1);
  if (!week1.ok) return week1;
  const week2 = buildWeeklyInsertionForPatient(patient, patientSchedules.week2, 2);
  if (!week2.ok) return week2;
  return {
    ok: true,
    patientSchedules: {
      week1: week1.schedules,
      week2: week2.schedules,
    },
  };
}

function buildIncrementalPatientReplan(previousPatient, patient) {
  const patientIndex = getPatientPlanningIndex(patient.id);
  const result = {
    touched: false,
    complete: true,
    assignedCount: 0,
    removedCount: 0,
    messages: [],
    warnings: [],
    weeklySchedules: null,
    twoWeekPatientSchedules: null,
    dateSchedules: null,
  };

  const previousDateKeys = getDateKeysForPatientInSchedules(state.schedules, patient.id);
  const dateSchedules = structuredClone(state.schedules || {});
  const removedDateCount = removePatientFromScheduleCollectionWithCount(dateSchedules, patient.id);
  if (removedDateCount) {
    result.touched = true;
    result.removedCount += removedDateCount;
    result.dateSchedules = dateSchedules;
  }

  if (patient.temporaryInsert) {
    if (patient.status !== "paused") {
      previousDateKeys.forEach((dateValue) => {
        const dayKey = getWeekdayKey(dateValue);
        const baseDay = dateSchedules[dateValue] || {};
        const direct = buildExactDayInsertion(patient, dayKey, baseDay, normalizeMachineType(patient.treatmentType));
        if (direct.assignment) {
          dateSchedules[dateValue] = direct.daySchedule;
          setScheduleSlot(dateSchedules, dateValue, direct.assignment.machineId, direct.assignment.shift, {
            patientId: patient.id,
            treatmentType: normalizeMachineType(patient.treatmentType),
            note: "临时患者资料变更后自动重排",
            updatedAt: new Date().toISOString(),
          });
          result.assignedCount += 1;
        } else {
          result.complete = false;
          result.messages.push(`${formatDateLabel(dateValue)} 没有适合 ${patient.name} 的临时空位。${explainInsertionNoSlot(patient, dayKey, baseDay, normalizeMachineType(patient.treatmentType))}`);
        }
      });
    } else {
      result.warnings.push(`${patient.name} 已暂停，已从临时日期排班中移除。`);
    }
    result.dateSchedules = dateSchedules;
    result.touched = result.touched || Boolean(previousDateKeys.length);
    return result;
  }

  if (hasTwoWeekCycleTemplate()) {
    const patientSchedules = {
      week1: structuredClone(state.twoWeekCycle?.patientSchedules?.week1 || {}),
      week2: structuredClone(state.twoWeekCycle?.patientSchedules?.week2 || {}),
    };
    const activeWeekKey = getCycleWeekKey();
    if (state.weeklySchedules && Object.keys(state.weeklySchedules).length) {
      patientSchedules[activeWeekKey] = structuredClone(state.weeklySchedules);
    }

    result.removedCount += removePatientFromScheduleCollectionWithCount(patientSchedules.week1, patient.id);
    result.removedCount += removePatientFromScheduleCollectionWithCount(patientSchedules.week2, patient.id);
    result.touched = true;

    if (isSchedulablePatient(patient)) {
      const week1Base = structuredClone(patientSchedules.week1);
      const week1 = buildWeeklyInsertionForPatient(patient, week1Base, 1, patientIndex);
      if (week1.ok) {
        patientSchedules.week1 = week1.schedules;
        result.assignedCount += countPatientAssignmentsInWeeklySchedules(week1.schedules, patient.id);
      } else {
        result.complete = false;
        result.messages.push(...(week1.messages || []));
        patientSchedules.week1 = week1Base;
      }

      const week2Base = structuredClone(patientSchedules.week2);
      const week2 = buildWeeklyInsertionForPatient(patient, week2Base, 2, patientIndex);
      if (week2.ok) {
        patientSchedules.week2 = week2.schedules;
        result.assignedCount += countPatientAssignmentsInWeeklySchedules(week2.schedules, patient.id);
      } else {
        result.complete = false;
        result.messages.push(...(week2.messages || []));
        patientSchedules.week2 = week2Base;
      }
    } else {
      result.warnings.push(`${patient.name} 当前不是在透长期患者，已从长期排班中移除。`);
    }

    result.twoWeekPatientSchedules = patientSchedules;
    return result;
  }

  if (state.weeklySchedules && Object.keys(state.weeklySchedules).length) {
    const weeklyBase = structuredClone(state.weeklySchedules || {});
    result.removedCount += removePatientFromScheduleCollectionWithCount(weeklyBase, patient.id);
    result.touched = true;
    if (isSchedulablePatient(patient)) {
      const weekly = buildWeeklyInsertionForPatient(patient, weeklyBase, 1, patientIndex);
      if (weekly.ok) {
        result.weeklySchedules = weekly.schedules;
        result.assignedCount += countPatientAssignmentsInWeeklySchedules(weekly.schedules, patient.id);
      } else {
        result.complete = false;
        result.messages.push(...(weekly.messages || []));
        result.weeklySchedules = weeklyBase;
      }
    } else {
      result.weeklySchedules = weeklyBase;
      result.warnings.push(`${patient.name} 当前不是在透长期患者，已从周模板中移除。`);
    }
  }

  return result;
}

function applyIncrementalPatientReplan(result) {
  if (!result?.touched) {
    return;
  }
  if (result.dateSchedules) {
    state.schedules = result.dateSchedules;
  }
  if (result.twoWeekPatientSchedules) {
    ensureTwoWeekCycleState();
    state.twoWeekCycle.patientSchedules.week1 = result.twoWeekPatientSchedules.week1 || {};
    state.twoWeekCycle.patientSchedules.week2 = result.twoWeekPatientSchedules.week2 || {};
    state.twoWeekCycle.review = null;
    state.twoWeekCycle.savedAt = new Date().toISOString();
    state.twoWeekCycle.anchorWeekStart = state.twoWeekCycle.anchorWeekStart || normalizeCycleAnchorWeekStart(getCurrentDate());
    syncCycleWeekToWeeklyView();
    return;
  }
  if (result.weeklySchedules) {
    state.weeklySchedules = result.weeklySchedules;
  }
}

function removePatientFromScheduleCollectionWithCount(scheduleCollection, patientId) {
  let removedCount = 0;
  Object.entries(scheduleCollection || {}).forEach(([key, daySchedule]) => {
    Object.entries(daySchedule || {}).forEach(([machineId, item]) => {
      STAFF_SHIFT_KEYS.forEach((shift) => {
        if (item?.[shift]?.patientId === patientId) {
          delete item[shift];
          removedCount += 1;
        }
      });
      pruneEmptySchedule(scheduleCollection, key, machineId);
    });
  });
  return removedCount;
}

function getDateKeysForPatientInSchedules(scheduleCollection = {}, patientId) {
  return Object.entries(scheduleCollection || {})
    .filter(([, daySchedule]) => getAssignmentsForPatientInDay(patientId, daySchedule || {}).length)
    .map(([dateValue]) => dateValue);
}

function countPatientAssignmentsInWeeklySchedules(weeklySchedules = {}, patientId) {
  return Object.values(weeklySchedules || {}).reduce(
    (total, daySchedule) => total + getAssignmentsForPatientInDay(patientId, daySchedule || {}).length,
    0,
  );
}

function formatIncrementalPatientReplanNotice(patient, result) {
  if (!result?.touched) {
    return "";
  }
  const base = `${patient.name} 的资料已保存；系统已只重排该患者，未移动其他患者。`;
  if (result.complete) {
    return `${base} 新排入 ${result.assignedCount} 次治疗，移除旧位置 ${result.removedCount} 个。`;
  }
  return [
    `${base} 但没有找到完整空位，已移除旧位置 ${result.removedCount} 个，当前自动排入 ${result.assignedCount} 次。`,
    "请护士长在排班台或2周报告里为该患者人工补排缺少的治疗。",
    ...(result.messages || []).slice(0, 8),
  ].join("\n");
}

function explainInsertionNoSlot(patient, dayKey, daySchedule = {}, treatmentType = patient?.treatmentType) {
  if (!WORKING_DAY_KEYS.includes(String(dayKey))) {
    return "当前日期不是治疗日。";
  }
  const normalizedTreatment = normalizeMachineType(treatmentType || patient?.treatmentType);
  const compatibleMachines = getAvailableMachineIds()
    .filter((machineId) => patientFitsMachineForTreatment(patient, normalizedTreatment, machineId))
    .sort(sortMachineIds);
  const dayLabel = getWeekDayLabel(String(dayKey));
  const treatmentLabel = getTreatmentLabel(normalizedTreatment);
  if (!compatibleMachines.length) {
    return `${dayLabel}没有符合“${treatmentLabel}、${getMachineZoneLabelForPatient(patient)}”的可用机器。`;
  }

  const totalSlots = compatibleMachines.length * STAFF_SHIFT_KEYS.length;
  const openSlots = [];
  compatibleMachines.forEach((machineId) => {
    STAFF_SHIFT_KEYS.forEach((shift) => {
      if (!daySchedule?.[machineId]?.[shift]?.patientId) {
        openSlots.push(`${machineId}号机${SHIFT_LABELS[shift]}`);
      }
    });
  });
  const occupiedSlots = Math.max(0, totalSlots - openSlots.length);
  if (!openSlots.length) {
    return `${dayLabel}共有${compatibleMachines.length}台兼容机器、${totalSlots}个半日位，已经占用${occupiedSlots}个，没有剩余空位。`;
  }
  if (patient?.preferredShift) {
    const preferredOpen = openSlots.filter((slot) => slot.includes(SHIFT_LABELS[patient.preferredShift]));
    if (!preferredOpen.length) {
      return `${dayLabel}${SHIFT_LABELS[patient.preferredShift]}没有空位；其他班次还有${openSlots.length}个空位，但系统仍未能满足全部约束。`;
    }
  }
  return `${dayLabel}还有${openSlots.length}个理论空位，但治疗类型、分区、班次或固定机位组合后无法安全放入。`;
}

function getMachineZoneLabelForPatient(patient) {
  const infection = normalizeInfectionFlag(patient?.infectionFlag);
  if (infection) return `${infection}传染区`;
  return isSeverePatient(patient) ? "重病区/普通区" : "普通区";
}

function buildWeeklyInsertionForPatient(patient, baseWeeklySchedules = {}, weekNumber = 1, patientIndex = getPatientPlanningIndex(patient?.id)) {
  const schedules = structuredClone(baseWeeklySchedules || {});
  WORKING_DAY_KEYS.forEach((dayKey) => {
    schedules[dayKey] ||= {};
  });
  const plannedDays = getPatientPlannedDays(patient, patientIndex, SCHEDULE_PRIORITY_PATIENT)
    .filter((dayKey) => WORKING_DAY_KEYS.includes(dayKey));
  if (!plannedDays.length) {
    return { ok: false, schedules, messages: [`${patient.name} 没有可用的工作日透析倾向。`] };
  }

  const hdfCount = normalizeMachineType(patient.treatmentType) === DEFAULT_MACHINE_TYPE
    ? getTwoWeekHdfCountForWeek(patient, weekNumber, patientIndex)
    : 0;
  const hdfIndexes = getEvenlyDistributedSessionIndexes(plannedDays.length, hdfCount, patientIndex + weekNumber);
  const assignedDaysByPatient = new Map();
  const assignedMachineByPatient = new Map();

  for (const [index, dayKey] of plannedDays.entries()) {
    const treatmentType = hdfIndexes.has(index) ? "hemofiltration" : normalizeMachineType(patient.treatmentType);
    const assignment = assignWeeklyPatientSession(
      { patient, originalDay: dayKey, requestedDay: dayKey, lockedDay: true, treatmentType },
      schedules,
      [...getAvailableMachineIds()].sort(sortMachineIds),
      getSpecialMachines().filter((machineId) => !isMachinePaused(machineId)).sort(sortMachineIds),
      getAvailableMachineIds().filter((machineId) => getMachineZone(machineId) === MACHINE_ZONE_NORMAL).sort(sortMachineIds),
      assignedDaysByPatient,
      assignedMachineByPatient,
      SCHEDULE_PRIORITY_PATIENT,
      false,
    );
    if (!assignment) {
      return {
        ok: false,
        schedules,
        messages: [`第${weekNumber}周 ${getWeekDayLabel(dayKey)} 没有适合 ${patient.name} 的空位。${explainInsertionNoSlot(patient, dayKey, schedules[dayKey], treatmentType)} 系统不会移动已经排好的患者；请调整新人资料，或由护士长先手动腾出空位。`],
      };
    }
  }

  return { ok: true, schedules };
}

async function savePatientFromForm(event) {
  event.preventDefault();
  const previousPatient = ui.patientId.value ? findPatient(ui.patientId.value) : null;
  const selectedFixedMachine = String(ui.patientFixedMachine.value || "").trim();
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
    fixedMachineId: selectedFixedMachine,
    fixedMachineLockedAt:
      selectedFixedMachine && previousPatient?.fixedMachineId === selectedFixedMachine
        ? previousPatient.fixedMachineLockedAt
        : selectedFixedMachine
          ? new Date().toISOString()
          : "",
    preferredDays: getCheckedValues(ui.patientPreferredDays),
    forcePreferredDays: ui.forcePreferredDays.checked,
    temporaryInsert: Boolean(previousPatient?.temporaryInsert),
    note: ui.patientNote.value,
    demo: Boolean(previousPatient?.demo),
    updatedAt: new Date().toISOString(),
  });

  if (!patient) {
    showToast(getDynamicMessage("enterPatientName"));
    return;
  }

  const placementCriticalChanged = hasPatientPlacementCriticalChanges(previousPatient, patient);
  const schedulePlanChanged = hasPatientSchedulePlanChanges(previousPatient, patient);
  const fixedMachineChanged = (previousPatient?.fixedMachineId || "") !== (patient.fixedMachineId || "");
  if (patient.fixedMachineId && (!previousPatient || fixedMachineChanged || placementCriticalChanged)) {
    if (isMachinePaused(patient.fixedMachineId) && previousPatient?.fixedMachineId !== patient.fixedMachineId) {
      window.alert(getDynamicMessage("fixedMachinePaused", { machineId: patient.fixedMachineId }));
      return;
    }
    if (!getMachineIds().includes(patient.fixedMachineId)) {
      window.alert(getDynamicMessage("fixedMachineMissing", { machineId: patient.fixedMachineId }));
      return;
    }
    if (!patientFitsMachine(patient, patient.fixedMachineId)) {
      window.alert(getDynamicMessage("fixedMachineIncompatible", {
      patientName: patient.name,
      machineId: patient.fixedMachineId,
      machineType: getMachineTypeLabel(patient.fixedMachineId),
      machineZone: getMachineZoneLabel(patient.fixedMachineId),
    }));
      return;
    }
  }

  const previousFixedMachine = previousPatient?.fixedMachineId || "";
  if (previousPatient && previousFixedMachine !== patient.fixedMachineId) {
    const oldLabel = previousFixedMachine ? `${previousFixedMachine}号机` : "未固定";
    const newLabel = patient.fixedMachineId ? `${patient.fixedMachineId}号机` : "首次自动排班后重新固定";
    const weeklyLocations = getWeeklyLocationsForPatient(state.weeklySchedules, patient.id);
    const hasDifferentWeeklyLocation = weeklyLocations.some((location) => location.machineId !== patient.fixedMachineId);
    if (weeklyLocations.length && hasDifferentWeeklyLocation && !window.confirm(`固定机位将从“${oldLabel}”改为“${newLabel}”。保存后系统会只重排这名患者，尽量不影响其他患者。仍要保存吗？`)) {
      return;
    }
  }

  const duplicate = state.patients.find((item) => item.id !== patient.id && patient.dialysisNo && item.dialysisNo === patient.dialysisNo);
  if (duplicate && !window.confirm(getDynamicMessage("duplicateDialysisNoConfirm", { patientName: duplicate.name }))) {
    return;
  }

  showTaskProgress("正在保存患者资料", schedulePlanChanged ? "准备只重排这个患者" : "检查患者基础资料", 12);
  await waitForBrowserPaint();
  try {
    const index = state.patients.findIndex((item) => item.id === patient.id);
    let replanResult = null;
    if (schedulePlanChanged && previousPatient && index >= 0) {
      await stepTaskProgress(30, "从原排班中取出该患者并寻找新空位");
      replanResult = buildIncrementalPatientReplan(previousPatient, patient);
    }

    await stepTaskProgress(48, "创建撤销记录并写入患者库");
    captureUndoSnapshot(index >= 0 ? `编辑患者 ${patient.name}` : `新增患者 ${patient.name}`);
    if (index >= 0) {
      state.patients[index] = patient;
    } else {
      state.patients.push(patient);
    }
    if (replanResult) {
      await stepTaskProgress(64, "应用该患者的增量重排结果");
      applyIncrementalPatientReplan(replanResult);
    }

    saveState();
    await stepTaskProgress(82, "刷新患者库、排班台和统计");
    fillPatientForm(patient);
    renderPatientTable();
    renderWeekNavigation();
    renderStaffSchedule();
    renderSchedule();
    renderSummary();
    await closeTaskProgress("患者资料已保存");
    const replanNotice = formatIncrementalPatientReplanNotice(patient, replanResult);
    showToast(replanNotice || getDynamicMessage("patientSaved"));
    if (replanResult && !replanResult.complete) {
      window.alert(replanNotice);
    }
  } catch (error) {
    console.error("保存患者资料失败", error);
    await closeTaskProgress("保存患者资料失败", 0);
    window.alert(`保存患者资料失败：${error?.message || error}`);
  }
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
  ui.monthlyHdfCount.value = patient.monthlyHdfCount ?? 2;
  syncMonthlyHdfAvailability();
  ui.patientStatus.value = patient.status || "active";
  ui.infectionFlag.value = patient.infectionFlag || "";
  ui.careLevel.value = normalizeCareLevel(patient.careLevel);
  ui.preferredShift.value = patient.preferredShift || "";
  renderPatientFixedMachineOptions(patient.fixedMachineId || "");
  ui.patientFixedMachine.value = patient.fixedMachineId || "";
  setCheckedValues(ui.patientPreferredDays, patient.preferredDays || []);
  ui.forcePreferredDays.checked = Boolean(patient.forcePreferredDays);
  ui.patientNote.value = patient.note || "";
  ui.deletePatient.classList.remove("hidden");
}

function resetPatientForm() {
  ui.patientForm.reset();
  ui.patientId.value = "";
  ui.patientTreatmentType.value = DEFAULT_MACHINE_TYPE;
  ui.monthlyHdfCount.value = "2";
  syncMonthlyHdfAvailability();
  ui.patientStatus.value = "active";
  ui.infectionFlag.value = "";
  ui.careLevel.value = STANDARD_CARE_LEVEL;
  renderPatientFixedMachineOptions("");
  ui.patientFixedMachine.value = "";
  setCheckedValues(ui.patientPreferredDays, []);
  ui.forcePreferredDays.checked = false;
  ui.patientFormTitle.textContent = "新增患者";
  ui.deletePatient.classList.add("hidden");
}

async function deleteSelectedPatient() {
  const id = ui.patientId.value;
  if (!id) {
    return;
  }

  const patient = findPatient(id);
  if (!patient) {
    return;
  }

  if (!window.confirm(getDynamicMessage("deletePatientConfirm", { patientName: patient.name }))) {
    return;
  }

  showTaskProgress("正在删除患者", "创建撤销记录", 12);
  await waitForBrowserPaint();
  try {
    captureUndoSnapshot(`删除患者 ${patient.name}`);
    await stepTaskProgress(38, "从患者库移除");
    state.patients = state.patients.filter((item) => item.id !== id);
    await stepTaskProgress(62, "从长期模板和当前排班移除");
    removePatientFromSchedules(id);
    saveState();
    await stepTaskProgress(84, "刷新患者库、排班台和统计");
    resetPatientForm();
    renderPatientTable();
    renderWeekNavigation();
    renderStaffSchedule();
    renderSchedule();
    renderSummary();
    await closeTaskProgress("患者已删除");
    showToast(getDynamicMessage("patientDeleted"));
  } catch (error) {
    console.error("删除患者失败", error);
    await closeTaskProgress("删除患者失败", 0);
    window.alert(`删除患者失败：${error?.message || error}`);
  }
}

function removePatientFromSchedules(patientId) {
  removePatientFromScheduleCollection(state.schedules, patientId);
  removePatientFromScheduleCollection(state.weeklySchedules, patientId);
  ["week1", "week2"].forEach((weekKey) => {
    removePatientFromScheduleCollection(state.twoWeekCycle?.patientSchedules?.[weekKey], patientId);
  });
  if (state.twoWeekCycle) {
    state.twoWeekCycle.review = null;
  }
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
      const status = patient.temporaryInsert
        ? `<span class="tag demo">临时</span>`
        : patient.status === "paused" ? `<span class="tag off">暂停</span>` : `<span class="tag">在透</span>`;
      const shift = formatPreference(patient.preferredShift, getPatientPreferredDaysForDisplay(patient), patient.forcePreferredDays);
      const fixedMachine = patient.fixedMachineId ? `固定 ${patient.fixedMachineId}号机` : "待首次排班固定";
      const plan = `${patient.weeklyTreatmentCount || 3}次/周 · 血滤${patient.monthlyHdfCount ?? 2}次/4周`;
      return `
        <tr>
          <td>
            <div class="patient-name">${escapeHtml(patient.name)}${patient.demo ? ` <span class="tag demo">演示</span>` : ""}</div>
            <div class="patient-subline">${escapeHtml([patient.gender, patient.age && `${patient.age}岁`, patient.phone].filter(Boolean).join(" · ") || "基本资料待完善")}</div>
          </td>
          <td>${escapeHtml(patient.dialysisNo || "-")}</td>
          <td>${escapeHtml(patient.vascularAccess || "-")}</td>
          <td>${escapeHtml(`${getPatientTreatmentLabel(patient)} · ${getPatientCareLabel(patient)} · ${plan}`)}</td>
          <td>${escapeHtml(`${shift} · ${fixedMachine}`)}</td>
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
      showToast(patient
    ? getDynamicMessage("selectMachineForPatient", { patientName: patient.name })
    : getDynamicMessage("assignPatientInMachineGrid"));
    });
  });
}

function saveStaffFromForm(event) {
  event.preventDefault();
  const previousStaff = ui.staffId.value ? findStaff(ui.staffId.value) : null;
  const staff = normalizeStaffMember({
    id: ui.staffId.value || createId(),
    name: ui.staffName.value,
    code: ui.staffCode.value,
    role: ui.staffRole.value,
    phone: ui.staffPhone.value,
    preferredShift: ui.staffPreferredShift.value,
    status: ui.staffStatus.value,
    note: ui.staffNote.value,
    demo: Boolean(previousStaff?.demo),
    updatedAt: new Date().toISOString(),
  });

  if (!staff) {
    showToast(getDynamicMessage("enterStaffName"));
    return;
  }

  const duplicate = state.staffMembers.find((item) => item.id !== staff.id && staff.code && item.code === staff.code);
  if (duplicate && !window.confirm(getDynamicMessage("duplicateStaffNoConfirm", { staffName: duplicate.name }))) {
    return;
  }

  const index = state.staffMembers.findIndex((item) => item.id === staff.id);
  captureUndoSnapshot(index >= 0 ? `编辑医护 ${staff.name}` : `新增医护 ${staff.name}`);
  if (index >= 0) {
    state.staffMembers[index] = staff;
  } else {
    state.staffMembers.push(staff);
  }

  saveState();
  fillStaffForm(staff);
  renderStaffTable();
  renderStaffSchedule();
  showToast(getDynamicMessage("staffSaved"));
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

async function deleteSelectedStaff() {
  const id = ui.staffId.value;
  if (!id) {
    return;
  }

  const staff = findStaff(id);
  if (!staff) {
    return;
  }
  if (!window.confirm(getDynamicMessage("deleteStaffConfirm", { staffName: staff.name }))) {
    return;
  }

  showTaskProgress("正在删除医护", "创建撤销记录", 12);
  await waitForBrowserPaint();
  try {
    captureUndoSnapshot(`删除医护 ${staff.name}`);
    await stepTaskProgress(38, "从医护库移除");
    state.staffMembers = state.staffMembers.filter((item) => item.id !== id);
    await stepTaskProgress(64, "从长期模板和当前排班移除");
    removeStaffFromSchedules(id);
    saveState();
    await stepTaskProgress(86, "刷新医护库和排班统计");
    resetStaffForm();
    renderStaffTable();
    renderStaffSchedule();
    renderSummary();
    await closeTaskProgress("医护已删除");
    showToast(getDynamicMessage("staffDeleted"));
  } catch (error) {
    console.error("删除医护失败", error);
    await closeTaskProgress("删除医护失败", 0);
    window.alert(`删除医护失败：${error?.message || error}`);
  }
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
        showToast(getDynamicMessage("staffAvailableInSchedule", { staffName: staff.name }));
      }
    });
  });
}

function removeStaffFromSchedules(staffId) {
  const collections = [state.weeklyStaffSchedules, state.staffSchedules];
  ["week1", "week2"].forEach((weekKey) => {
    const collection = state.twoWeekCycle?.staffSchedules?.[weekKey];
    if (collection) collections.push(collection);
  });
  collections.forEach((collection) => {
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
  if (state.twoWeekCycle) {
    state.twoWeekCycle.review = null;
  }
}

async function generateDemoData() {
  const patientCount = clampNumber(ui.demoPatientCount.value, 0, 300, 194);
  const doctorCount = clampNumber(ui.demoDoctorCount.value, 0, 50, 4);
  const nurseCount = clampNumber(ui.demoNurseCount.value, 0, 200, 21);
  const infectionCounts = {
    HBC: clampNumber(ui.demoHbcCount.value, 0, 300, 0),
    HBV: clampNumber(ui.demoHbvCount.value, 0, 300, 24),
    HCV: clampNumber(ui.demoHcvCount.value, 0, 300, 0),
    T: clampNumber(ui.demoTCount.value, 0, 300, 4),
  };
  const infectiousCount = Object.values(infectionCounts).reduce((total, count) => total + count, 0);
  const severeCount = Math.min(patientCount, clampNumber(ui.demoSevereCount.value, 0, 300, 80));
  const demoMonthlyHdfCount = normalizeEvenHdfCount(ui.demoMonthlyHdfCount.value, 2);
  if (!patientCount && !doctorCount && !nurseCount) {
    showToast(getDynamicMessage("enterDemoCount"));
    return;
  }
  if (infectiousCount > patientCount) {
    showToast(getDynamicMessage("infectiousDemoCountExceeded", { infectiousCount, patientCount }));
    return;
  }

  ui.generateDemoData.disabled = true;
  try {
    showTaskProgress("正在生成演示数据", "准备患者、医护和感染分区参数", 8);
    await waitForBrowserPaint();
    const infectionFlags = DEMO_INFECTION_FLAGS.flatMap((flag) => Array(infectionCounts[flag]).fill(flag));
    const batch = Date.now().toString(36);
    await stepTaskProgress(24, "生成患者资料");
    const patients = Array.from({ length: patientCount }, (_, index) =>
      createDemoPatient(index, batch, infectionFlags, severeCount, demoMonthlyHdfCount),
    );
    await stepTaskProgress(52, "生成医生和护士资料");
    const doctors = Array.from({ length: doctorCount }, (_, index) => createDemoStaff(index, batch, "doctor"));
    const nurses = Array.from({ length: nurseCount }, (_, index) => createDemoStaff(index, batch, "nurse"));
    await stepTaskProgress(70, "写入演示数据");
    captureUndoSnapshot("生成演示数据");
    state.patients.push(...patients);
    state.staffMembers.push(...doctors, ...nurses);
    saveState();
    await stepTaskProgress(88, "刷新患者库、医护库和排班台");
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
    await closeTaskProgress("演示数据已生成");
    showToast(`已生成 ${patients.length} 名患者（${infectionSummary}）、${doctors.length + nurses.length} 名医护演示数据`);
  } catch (error) {
    console.error("Generate demo data failed", error);
    await closeTaskProgress("生成演示数据失败", 0);
    window.alert(`生成演示数据失败：${error?.message || error}`);
  } finally {
    ui.generateDemoData.disabled = false;
  }
}

function createDemoPatient(index, batch, infectionFlags, severeCount, demoMonthlyHdfCount) {
  const infectionFlag = infectionFlags[index] || "";
  const dayPattern = DEMO_DAY_PATTERNS[index % DEMO_DAY_PATTERNS.length];
  const patient = normalizePatient({
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
    forcePreferredDays: false,
    note: "演示数据",
    demo: true,
    updatedAt: new Date().toISOString(),
  });

  const hasCompatibleHdfMachine = getAvailableMachineIds().some((machineId) => patientFitsMachineForTreatment(patient, "hemofiltration", machineId));
  if (patient.monthlyHdfCount > 0 && !hasCompatibleHdfMachine) {
    patient.monthlyHdfCount = 0;
    patient.note = "演示数据；当前分区没有血滤机，月血滤次数自动设为 0";
  }
  return patient;
}

function createDemoStaff(index, batch, role) {
  const roleShort = role === "doctor" ? "医" : "护";
  const baseName = createDemoName(index + (role === "doctor" ? 40 : 80));
  return normalizeStaffMember({
    id: createId(),
    name: `${baseName}（${roleShort}）`,
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

async function clearDemoData() {
  const demoPatientIds = state.patients.filter((patient) => patient.demo).map((patient) => patient.id);
  const demoStaffIds = state.staffMembers.filter((staff) => staff.demo).map((staff) => staff.id);
  if (!demoPatientIds.length && !demoStaffIds.length) {
    showToast(getDynamicMessage("noDemoData"));
    return;
  }

  if (!window.confirm(getDynamicMessage("clearDemoConfirm", {
    patientCount: demoPatientIds.length,
    staffCount: demoStaffIds.length,
  }))) {
    return;
  }

  ui.clearDemoData.disabled = true;
  try {
    showTaskProgress("正在清除演示数据", "查找演示患者和医护", 10);
    await waitForBrowserPaint();
    await stepTaskProgress(35, "从排班中移除演示患者");
    captureUndoSnapshot("清除演示数据");
    demoPatientIds.forEach(removePatientFromSchedules);
    await stepTaskProgress(58, "从医护排班中移除演示医护");
    demoStaffIds.forEach(removeStaffFromSchedules);
    await stepTaskProgress(72, "清理患者库和医护库");
    state.patients = state.patients.filter((patient) => !patient.demo);
    state.staffMembers = state.staffMembers.filter((staff) => !staff.demo);
    pruneEmptyStaffSchedules();
    saveState();
    await stepTaskProgress(88, "刷新界面");
    resetPatientForm();
    resetStaffForm();
    renderPatientTable();
    renderStaffTable();
    renderWeekNavigation();
    renderStaffSchedule();
    renderSchedule();
    renderSummary();
    await closeTaskProgress("演示数据已清除");
    showToast(getDynamicMessage("demoDataCleared"));
  } catch (error) {
    console.error("Clear demo data failed", error);
    await closeTaskProgress("清除演示数据失败", 0);
    window.alert(`清除演示数据失败：${error?.message || error}`);
  } finally {
    ui.clearDemoData.disabled = false;
  }
}

async function saveLayout(event) {
  event.preventDefault();
  const settings = {
    roomName: ui.roomName.value.trim() || DEFAULT_STATE.settings.roomName,
    layoutPresetVersion: DEFAULT_LAYOUT_PRESET_VERSION,
    rowCount: clampNumber(ui.rowCount.value, 1, 20, DEFAULT_STATE.settings.rowCount),
    machinesPerRow: clampNumber(ui.machinesPerRow.value, 1, 30, DEFAULT_STATE.settings.machinesPerRow),
    numberingStartSide: ui.numberingStartSide.value === "right" ? "right" : "left",
    inactiveSlots: [],
    pausedMachines: [],
    schedulePriority: normalizeSchedulePriority(state.settings.schedulePriority),
    staffWorkMode: normalizeStaffWorkMode(state.settings.staffWorkMode),
    specialZoneName: ui.specialZoneName.value.trim().slice(0, 16) || DEFAULT_STATE.settings.specialZoneName,
    machineTypes: {},
    machineZones: {},
    specialMachines: [],
    language: !isChineseLanguage() ? "en" : "zh",
  };

  const oldMachines = new Set(getMachineIds());
  settings.inactiveSlots = normalizeInactiveSlots(state.settings.inactiveSlots, settings);
  const nextMachines = new Set(getMachineIds(settings));
  settings.pausedMachines = normalizeMachineIdList(state.settings.pausedMachines, nextMachines);
  settings.machineTypes = normalizeMachineTypeMap(state.settings.machineTypes, nextMachines, state.settings.hdfMachines);
  settings.machineZones = normalizeMachineZoneMap(state.settings.machineZones, nextMachines, state.settings.specialMachines);
  settings.specialMachines = getInfectionMachineIds(settings);
  if (!isSameMachineLayout(settings, state.settings) && (hasAnyMachineAssignments() || hasFixedMachineAssignments())) {
    const compatibilityIssues = getLayoutCompatibilityIssues(settings);
    if (compatibilityIssues.length) {
      window.alert(`不能应用新布局。以下排班或长期固定机位会失效：\n\n${compatibilityIssues.slice(0, 20).map((item) => `- ${item}`).join("\n")}\n\n请先调整相关排班或解除固定机位。`);
      return;
    }
    const message = "新布局会改变机器在房间中的物理位置。现有机器编号仍兼容，但请确认固定机位的实际位置不会因此改变。仍要应用吗？";
    if (!window.confirm(message)) {
      return;
    }
  }
  const removedAssigned = countAssignmentsOutsideNextLayout(oldMachines, nextMachines);
  if (removedAssigned && !window.confirm(getDynamicMessage("layoutHidesAssignmentsConfirm", { count: removedAssigned }))) {
    return;
  }

  showTaskProgress("正在应用布局设置", "创建撤销快照", 12);
  await waitForBrowserPaint();
  captureUndoSnapshot("修改布局设置");
  await stepTaskProgress(38, "写入机器行列、类型和分区");
  state.settings = settings;
  saveState();
  await stepTaskProgress(70, "刷新统计、机位和固定机位选项");
  renderHeader();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderPatientFixedMachineOptions(ui.patientFixedMachine?.value || "");
  renderLayoutPreviewFromForm();
  await closeTaskProgress("布局设置已应用");
  showToast(getDynamicMessage("layoutApplied"));
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

function hasFixedMachineAssignments() {
  return state.patients.some((patient) => Boolean(patient.fixedMachineId));
}

function getLayoutCompatibilityIssues(nextSettings) {
  const issues = [];
  const seen = new Set();
  const validMachines = new Set(getMachineIds(nextSettings));
  const addIssue = (message) => {
    if (!seen.has(message)) {
      seen.add(message);
      issues.push(message);
    }
  };

  const scan = (collection, labelForKey) => {
    Object.entries(collection || {}).forEach(([key, daySchedule]) => {
      Object.entries(daySchedule || {}).forEach(([machineId, item]) => {
        STAFF_SHIFT_KEYS.forEach((shift) => {
          const slot = item?.[shift];
          const patient = slot?.patientId ? findPatient(slot.patientId) : null;
          if (!patient) {
            return;
          }
          if (!validMachines.has(machineId)) {
            addIssue(`${labelForKey(key)} ${SHIFT_LABELS[shift]}：${patient.name} 使用的 ${machineId} 号机在新布局中不存在`);
            return;
          }
          const treatmentType = normalizeMachineType(slot.treatmentType || patient.treatmentType);
          if (!patientFitsMachineSettings(patient, getMachineType(machineId, nextSettings), getMachineZone(machineId, nextSettings), treatmentType)) {
            addIssue(`${labelForKey(key)} ${SHIFT_LABELS[shift]}：${patient.name} 与新布局的 ${machineId} 号机类型或分区不匹配`);
          }
        });
      });
    });
  };

  scan(state.weeklySchedules, (key) => `每周${getWeekDayLabel(key)}`);
  scan(state.schedules, (key) => formatDateLabel(key));
  state.patients.forEach((patient) => {
    if (!patient.fixedMachineId) {
      return;
    }
    if (!validMachines.has(patient.fixedMachineId)) {
      addIssue(`长期固定机位：${patient.name} 的 ${patient.fixedMachineId} 号机在新布局中不存在`);
      return;
    }
    if (!patientFitsMachineSettings(
      patient,
      getMachineType(patient.fixedMachineId, nextSettings),
      getMachineZone(patient.fixedMachineId, nextSettings),
      patient.treatmentType,
    )) {
      addIssue(`长期固定机位：${patient.name} 与新布局的 ${patient.fixedMachineId} 号机类型或分区不匹配`);
    }
  });
  return issues;
}

async function restoreDefaultLayout() {
  const nextSettings = {
    ...structuredClone(DEFAULT_STATE.settings),
    roomName: state.settings.roomName || DEFAULT_STATE.settings.roomName,
    language: !isChineseLanguage() ? "en" : "zh",
    schedulePriority: normalizeSchedulePriority(state.settings.schedulePriority),
    staffWorkMode: normalizeStaffWorkMode(state.settings.staffWorkMode),
    pausedMachines: normalizeMachineIdList(state.settings.pausedMachines, new Set(getMachineIds(DEFAULT_STATE.settings))),
  };
  const compatibilityIssues = getLayoutCompatibilityIssues(nextSettings);
  if (compatibilityIssues.length) {
    window.alert(`暂时不能恢复默认布局。以下排班或长期固定机位与默认布局不兼容：\n\n${compatibilityIssues.slice(0, 20).map((item) => `- ${item}`).join("\n")}\n\n请先调整相关排班或解除固定机位。`);
    return;
  }

  const message = hasAnyMachineAssignments() || hasFixedMachineAssignments()
    ? "确定恢复为默认 6 排 × 10 台布局吗？现有排班和固定机位已经通过兼容性检查，科室名称、排班策略和机器暂停状态会保留。"
    : "确定恢复为默认 60 台机器布局吗？";
  if (!window.confirm(message)) {
    return;
  }

  showTaskProgress("正在恢复默认布局", "创建撤销快照", 12);
  await waitForBrowserPaint();
  captureUndoSnapshot("恢复默认布局");
  await stepTaskProgress(42, "恢复默认60台机器布局");
  state.settings = nextSettings;
  saveState();
  await stepTaskProgress(76, "刷新布局和排班界面");
  renderSettingsForm();
  renderHeader();
  renderSummary();
  renderStaffSchedule();
  renderSchedule();
  renderPatientFixedMachineOptions(ui.patientFixedMachine?.value || "");
  renderLayoutPreviewFromForm();
  await closeTaskProgress("默认布局已恢复");
  showToast(getDynamicMessage("default60LayoutRestored"));
}

function renderSettingsForm() {
  ui.roomName.value = state.settings.roomName;
  ui.rowCount.value = state.settings.rowCount;
  ui.machinesPerRow.value = state.settings.machinesPerRow;
  ui.numberingStartSide.value = state.settings.numberingStartSide || "left";
  ui.specialZoneName.value = state.settings.specialZoneName || DEFAULT_STATE.settings.specialZoneName;
  ui.languageSelect.innerHTML = SUPPORTED_LANGUAGE_LIST
    .map((item) => `<option value="${escapeHtml(item.code)}">${escapeHtml(item.name)}</option>`)
    .join("");
  ui.languageSelect.value = normalizeLanguageCode(state.settings.language);
  ui.themeSelect.innerHTML = UI_THEMES
    .map((item) => `<option value="${escapeHtml(item.key)}">${escapeHtml(item.label)}</option>`)
    .join("");
  ui.themeSelect.value = normalizeTheme(state.settings.theme);
  ui.schedulePriority.value = normalizeSchedulePriority(state.settings.schedulePriority);
  ui.staffWorkMode.value = normalizeStaffWorkMode(state.settings.staffWorkMode);
  renderPatientFixedMachineOptions(ui.patientFixedMachine?.value || "");
}

function renderPatientFixedMachineOptions(selectedValue = "") {
  if (!ui.patientFixedMachine) {
    return;
  }
  renderMachineOptionsForSelect(ui.patientFixedMachine, selectedValue, "首次自动排班后固定");
}

function renderMachineOptionsForSelect(selectElement, selectedValue = "", emptyLabel = "首次自动排班后固定") {
  if (!selectElement) {
    return;
  }
  const machineIds = [...getMachineIds()].sort(sortMachineIds);
  const hasSelected = selectedValue && machineIds.includes(selectedValue);
  const options = [`<option value="">${escapeHtml(emptyLabel)}</option>`];
  if (selectedValue && !hasSelected) {
    options.push(`<option value="${escapeHtml(selectedValue)}" selected>${escapeHtml(selectedValue)}号机（当前布局不存在）</option>`);
  }
  machineIds.forEach((machineId) => {
    const pausedLabel = isMachinePaused(machineId) ? " · 已暂停" : "";
    const label = `${machineId}号机 · ${getMachineTypeLabel(machineId)} · ${getMachineZoneLabel(machineId)}${pausedLabel}`;
    options.push(`<option value="${escapeHtml(machineId)}"${machineId === selectedValue ? " selected" : ""}>${escapeHtml(label)}</option>`);
  });
  selectElement.innerHTML = options.join("");
}

function getPatientFixedMachineLabel(patient) {
  return patient?.fixedMachineId ? `${patient.fixedMachineId}号机` : "待首次自动排班固定";
}

function renderLanguage() {
  const text = getText();
  const languageMeta = getLanguageMeta();
  document.documentElement.lang = languageMeta.code;
  document.documentElement.dir = languageMeta.dir || "ltr";
  document.body.classList.toggle("rtl-layout", languageMeta.dir === "rtl");
  document.title = `${state.settings.roomName} ${text.titleSuffix}`;
  document.querySelector(".date-control span").textContent = text.date;
  ui.tabs.forEach((button, index) => {
    if (text.tabs[index]) {
      button.textContent = text.tabs[index];
    }
  });
  ui.printSchedule.textContent = text.print;
  ui.exportData.textContent = text.export;
  ui.importDataLabel.textContent = text.import;
  ui.resetAllData.textContent = text.reset;
  ui.clearAllCache.textContent = text.clearCache;
  ui.openAboutDialog.textContent = text.about;
  ui.aboutDialogTitle.textContent = text.aboutTitle;
  ui.aboutDialogSubtitle.textContent = text.aboutSubtitle;
  ui.aboutAuthorText.textContent = text.aboutAuthorText || "The author is a dialysis patient. This program is fully open source and completely free.";
  ui.aboutThanksText.textContent = text.aboutThanksText || "Thank you to all healthcare workers around the world. May you be happy and healthy every day.";
  ui.aboutContactText.innerHTML = `${escapeHtml(text.aboutContactPrefix || "For requests, suggestions, or questions, contact:")} <a href="mailto:434881918@qq.com">434881918@qq.com</a>`;
  ui.aboutForm.querySelector(".primary-button").textContent = text.aboutClose;
  renderStaticTranslations();
  startRuntimeTranslationObserver();
  ui.schedulePriorityLabel.textContent = text.schedulePriority;
  ui.prevWeek.textContent = "本周";
  ui.nextWeek.textContent = "下周";
  ui.todayButton.textContent = "回到本周";
  ui.languageSelect.setAttribute("aria-label", text.language);
}

function renderTheme() {
  const theme = normalizeTheme(state.settings.theme);
  document.documentElement.dataset.theme = theme;
  if (ui.themeSelect) {
    ui.themeSelect.value = theme;
  }
}

function saveLanguage() {
  state.settings.language = normalizeLanguageCode(ui.languageSelect.value);
  saveState();
  renderAll();
  showToast(getText().languageUpdated || "Language updated");
}

function saveTheme() {
  state.settings.theme = normalizeTheme(ui.themeSelect.value);
  renderTheme();
  saveState();
  const themeLabel = UI_THEMES.find((item) => item.key === state.settings.theme)?.label || "明亮";
  showToast(`已切换为${themeLabel}界面`);
}

function saveSchedulePriority() {
  state.settings.schedulePriority = normalizeSchedulePriority(ui.schedulePriority.value);
  saveState();
  renderSummary();
  renderSchedule();
  const messages = {
    [SCHEDULE_PRIORITY_PATIENT]: "已切换为患者优先：尽量保持患者原有星期、班次和固定机位",
    [SCHEDULE_PRIORITY_STAFF]: "已切换为医护优先：患者尽量集中到更少的开班日和班次",
    [SCHEDULE_PRIORITY_SMART]: "已切换为灵巧排班：全部每周3次患者使用安全弹性组合，优先减少单人和低负荷班组",
  };
  showToast(messages[state.settings.schedulePriority]);
}

function saveStaffWorkMode() {
  state.settings.staffWorkMode = normalizeStaffWorkMode(ui.staffWorkMode.value);
  saveState();
  const messages = {
    [STAFF_WORK_MODE_BALANCED]: "已切换为均衡轮班：尽量分散上午、下午班次，避免连续整日上班",
    [STAFF_WORK_MODE_FULL_DAY]: "已切换为整日优先：尽量让同一名护士连续上上午、下午，集中工作日并空出整天休息",
    [STAFF_WORK_MODE_REST_MAX]: "已切换为休息最大化：优先整日班，同时把半日班尽量均衡分给所有在岗护士",
  };
  showToast(messages[state.settings.staffWorkMode] || messages[STAFF_WORK_MODE_BALANCED]);
}

function getText() {
  const code = normalizeLanguageCode(state.settings.language);
  return {
    ...(I18N.en || {}),
    ...(I18N[code] || {}),
  };
}

function getDynamicMessage(key, variables = {}) {
  const code = normalizeLanguageCode(state.settings.language);
  const packs = window.DYNAMIC_MESSAGES || {};
  const template =
    packs[code]?.[key] ??
    packs.en?.[key] ??
    packs["zh-CN"]?.[key] ??
    key;
  return String(template).replace(/\{(\w+)\}/g, (_, name) =>
    Object.prototype.hasOwnProperty.call(variables, name) ? String(variables[name]) : `{${name}}`
  );
}

function translateRuntimeText(value) {
  const text = String(value ?? "");
  if (!text || isChineseLanguage()) {
    return text;
  }
  const code = normalizeLanguageCode(state.settings.language);
  const packs = window.RUNTIME_TEXT_MESSAGES || {};
  const exactPack = packs[code] || packs.en || {};
  if (Object.prototype.hasOwnProperty.call(exactPack, text)) {
    return exactPack[text];
  }
  const englishPack = packs.en || {};
  if (Object.prototype.hasOwnProperty.call(englishPack, text)) {
    return englishPack[text];
  }

  const patterns = window.RUNTIME_TEXT_PATTERNS || [];
  for (const item of patterns) {
    const regex = new RegExp(item.pattern);
    const match = text.match(regex);
    if (!match) {
      continue;
    }
    const localized = item.replacements?.[code] || item.replacements?.en;
    if (!localized) {
      continue;
    }
    return localized.replace(/\$(\d+)/g, (_, index) => match[Number(index)] ?? "");
  }
  return text;
}

function translateRuntimeElement(root = document) {
  if (isChineseLanguage() || !root) {
    return 0;
  }

  let changedCount = 0;
  const rootNode = root.nodeType === Node.TEXT_NODE ? root.parentElement : root;
  if (!rootNode) {
    return 0;
  }

  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "OPTION"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return /[\u4e00-\u9fff]/.test(node.nodeValue || "")
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    },
  );

  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const original = node.nodeValue || "";
    const translated = translateRuntimeText(original);
    // 关键修复：只有文本确实发生变化时才写回DOM。
    // 旧逻辑即使翻译结果与原文相同也反复写回，会触发MutationObserver无限循环。
    if (translated !== original) {
      node.nodeValue = translated;
      changedCount += 1;
    }
  });

  rootNode.querySelectorAll?.("[title], [placeholder], [aria-label]").forEach((element) => {
    ["title", "placeholder", "aria-label"].forEach((attribute) => {
      const original = element.getAttribute(attribute);
      if (!original || !/[\u4e00-\u9fff]/.test(original)) {
        return;
      }
      const translated = translateRuntimeText(original);
      if (translated !== original) {
        element.setAttribute(attribute, translated);
        changedCount += 1;
      }
    });
  });

  return changedCount;
}

let lastScheduleReview = null;
let pendingScheduleReviewResolver = null;
let runtimeTranslationObserver = null;
let runtimeTranslationFrame = 0;
const pendingTranslationRoots = new Set();

function stopRuntimeTranslationObserver() {
  runtimeTranslationObserver?.disconnect();
  runtimeTranslationObserver = null;
  if (runtimeTranslationFrame) {
    cancelAnimationFrame(runtimeTranslationFrame);
    runtimeTranslationFrame = 0;
  }
  pendingTranslationRoots.clear();
}

function observeRuntimeTranslations() {
  if (!runtimeTranslationObserver || isChineseLanguage()) {
    return;
  }
  runtimeTranslationObserver.observe(document.body, {
    subtree: true,
    childList: true,
    // 不监听characterData，避免翻译自身写回再次触发观察器。
    characterData: false,
    attributes: false,
  });
}

function flushRuntimeTranslations() {
  runtimeTranslationFrame = 0;
  if (isChineseLanguage() || !pendingTranslationRoots.size) {
    pendingTranslationRoots.clear();
    return;
  }

  const roots = [...pendingTranslationRoots];
  pendingTranslationRoots.clear();

  // 翻译期间暂时断开观察器，彻底阻断自触发。
  runtimeTranslationObserver?.disconnect();
  roots.forEach((root) => translateRuntimeElement(root));
  observeRuntimeTranslations();
}

function scheduleRuntimeTranslation(root) {
  if (isChineseLanguage() || !root) {
    return;
  }
  const normalizedRoot = root.nodeType === Node.TEXT_NODE ? root.parentElement : root;
  if (!normalizedRoot) {
    return;
  }
  pendingTranslationRoots.add(normalizedRoot);
  if (!runtimeTranslationFrame) {
    runtimeTranslationFrame = requestAnimationFrame(flushRuntimeTranslations);
  }
}

function startRuntimeTranslationObserver() {
  stopRuntimeTranslationObserver();
  if (isChineseLanguage()) {
    return;
  }

  runtimeTranslationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => scheduleRuntimeTranslation(node));
    });
  });

  // 首次翻译也在断开观察器的状态下执行。
  translateRuntimeElement(document.body);
  observeRuntimeTranslations();
}


window.addEventListener("pagehide", stopRuntimeTranslationObserver);
window.addEventListener("beforeunload", stopRuntimeTranslationObserver);

const nativeAlert = window.alert.bind(window);
const nativeConfirm = window.confirm.bind(window);

window.alert = (message) => nativeAlert(translateRuntimeText(message));
window.confirm = (message) => nativeConfirm(translateRuntimeText(message));

function renderStaticTranslations() {
  const code = normalizeLanguageCode(state.settings.language);
  const packs = window.STATIC_UI_MESSAGES || {};
  const selected = {
    ...(packs.en || {}),
    ...(packs[code] || {}),
  };

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (selected[key] != null) {
      element.textContent = selected[key];
    }
  });

  ["placeholder", "title", "aria-label"].forEach((attribute) => {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
      const key = element.getAttribute(`data-i18n-${attribute}`);
      if (selected[key] != null) {
        element.setAttribute(attribute, selected[key]);
      }
    });
  });
}

function renderLayoutPreviewFromForm() {
  const settings = {
    roomName: ui.roomName.value || DEFAULT_STATE.settings.roomName,
    rowCount: clampNumber(ui.rowCount.value, 1, 20, DEFAULT_STATE.settings.rowCount),
    machinesPerRow: clampNumber(ui.machinesPerRow.value, 1, 30, DEFAULT_STATE.settings.machinesPerRow),
    numberingStartSide: ui.numberingStartSide.value === "right" ? "right" : "left",
    pausedMachines: state.settings.pausedMachines || [],
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
      const paused = isMachinePaused(slot.machineId, settings);
      return `
        <button class="preview-machine ${getMachineTypeClass(machineType)} ${getMachineZoneClass(machineZone)} ${paused ? "paused" : ""}" type="button" data-slot="${escapeHtml(slot.slotKey)}" data-machine="${escapeHtml(slot.machineId)}">
          <span>${escapeHtml(slot.machineId)}</span>
          <small>${escapeHtml(machineTypeLabel)}</small>
          ${hasZone ? `<small>${escapeHtml(machineZoneLabel)}</small>` : ""}
          ${paused ? `<small>已暂停</small>` : ""}
        </button>
      `;
    })
    .join("");

  ui.layoutPreviewGrid.querySelectorAll(".preview-machine").forEach((button) => {
    button.addEventListener("click", () => {
      if (!isSameMachineLayout(settings, state.settings)) {
        showToast(getDynamicMessage("applyLayoutFirst"));
        return;
      }
      const editMode = ui.layoutEditMode.value;
      if (editMode === "inactive") {
        toggleInactiveSlot(button.dataset.slot);
      } else if (editMode === "paused") {
        if (!button.dataset.machine) {
          showToast(getDynamicMessage("emptySlotCannotPause"));
        } else {
          togglePausedMachine(button.dataset.machine);
        }
      } else if (!button.dataset.machine) {
        showToast(getDynamicMessage("emptySlotOnlyRestore"));
      } else if (editMode === "special") {
        toggleSpecialMachine(button.dataset.machine);
      } else if (editMode.startsWith("zone:")) {
        setMachineZone(button.dataset.machine, editMode.slice(5));
      } else if (editMode.startsWith("type:")) {
        setMachineType(button.dataset.machine, editMode.slice(5));
      } else {
        showToast(getDynamicMessage("selectMachineType"));
      }
    });
  });
}

function getFixedMachineTemplateIssues(daySchedule) {
  const issues = [];
  Object.entries(daySchedule || {}).forEach(([machineId, item]) => {
    STAFF_SHIFT_KEYS.forEach((shift) => {
      const patient = item?.[shift]?.patientId ? findPatient(item[shift].patientId) : null;
      if (patient?.fixedMachineId && patient.fixedMachineId !== machineId) {
        issues.push(`${patient.name}：固定 ${patient.fixedMachineId} 号机，当前为 ${machineId} 号机 ${SHIFT_LABELS[shift]}`);
      }
    });
  });
  return issues;
}

async function saveCurrentWeekAsWeeklyTemplate() {
  const selectedDate = parseDateInput(getCurrentDate());
  const weekStart = getWeekStart(selectedDate);
  const weekEnd = addDays(weekStart, 5);
  const weekEntries = WORKING_DAY_KEYS.map((dayKey, index) => {
    const dateValue = formatDateInput(addDays(weekStart, index));
    return {
      dayKey,
      dateValue,
      dayLabel: getWeekDayLabel(dayKey),
      schedule: getEffectiveScheduleForDate(dateValue),
      staffSchedule: getEffectiveStaffScheduleForDate(dateValue),
    };
  });

  const fixedMachineIssues = weekEntries.flatMap((entry) =>
    getFixedMachineTemplateIssues(entry.schedule).map((issue) => `${entry.dayLabel}（${formatDateLabel(entry.dateValue)}）：${issue}`),
  );
  if (fixedMachineIssues.length) {
    window.alert(
      `本周包含临时换位，不能直接保存为长期周模板：\n\n${fixedMachineIssues
        .slice(0, 30)
        .map((item) => `- ${item}`)
        .join("\n")}\n\n请把临时换位保留为“仅当前日期”，或先在患者资料中修改长期固定机位。`,
    );
    return;
  }

  const hasAnySchedule = weekEntries.some(
    (entry) => Object.keys(entry.schedule || {}).length || isStaffScheduleFilled(entry.staffSchedule),
  );
  if (!hasAnySchedule) {
    showToast(getDynamicMessage("nothingToSaveThisWeek"));
    return;
  }

  const patientSessionCount = weekEntries.reduce(
    (total, entry) => total + countAssigned(entry.schedule, getMachineIds(), "morning") + countAssigned(entry.schedule, getMachineIds(), "afternoon"),
    0,
  );
  const activeDayCount = weekEntries.filter(
    (entry) => Object.keys(entry.schedule || {}).length || isStaffScheduleFilled(entry.staffSchedule),
  ).length;
  const confirmMessage = [
    `确定把本周（${formatShortDate(weekStart)}—${formatShortDate(weekEnd)}）保存为以后长期循环的周模板吗？`,
    "",
    `有效排班日：${activeDayCount} 天`,
    `患者治疗安排：${patientSessionCount} 人次`,
    "周一至周六将分别覆盖对应的长期模板。",
    "本周已有的单日调整会转入长期模板，并从这些日期的临时调整中移除。",
    "周日仍作为休息日；周日临时加班不会写入长期模板。",
  ].join("\n");
  if (!window.confirm(confirmMessage)) {
    return;
  }

  showTaskProgress("正在保存当前周模板", "创建撤销快照", 12);
  await waitForBrowserPaint();
  captureUndoSnapshot("保存当前周为长期周模板");
  await stepTaskProgress(42, "写入周一至周六患者和医护模板");
  weekEntries.forEach((entry) => {
    if (Object.keys(entry.schedule || {}).length) {
      state.weeklySchedules[entry.dayKey] = structuredClone(entry.schedule);
    } else {
      delete state.weeklySchedules[entry.dayKey];
    }

    if (isStaffScheduleFilled(entry.staffSchedule)) {
      state.weeklyStaffSchedules[entry.dayKey] = structuredClone(entry.staffSchedule);
    } else {
      delete state.weeklyStaffSchedules[entry.dayKey];
    }

    delete state.schedules[entry.dateValue];
    delete state.staffSchedules[entry.dateValue];
  });

  delete state.weeklySchedules[REST_DAY_KEY];
  delete state.weeklyStaffSchedules[REST_DAY_KEY];
  saveState();
  await stepTaskProgress(78, "刷新排班台和医护统计");
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  await closeTaskProgress("当前周模板已保存");
  showToast(getDynamicMessage("weekSavedAsRecurringTemplate"));
}

async function autoScheduleWeeklyTemplate() {
  showTaskProgress("正在自动生成周模板", "生成患者治疗安排", 8);
  await waitForBrowserPaint();
  const priority = normalizeSchedulePriority(state.settings.schedulePriority);
  await stepTaskProgress(24, "排列患者日期、班次和机位");
  const patientResult = buildAutoWeeklyPatientSchedules(getCurrentDate(), priority);
  await stepTaskProgress(50, "安排医生、责任护士和后备护士");
  const staffResult = buildAutoWeeklyStaffSchedules(patientResult.schedules, priority);
  await stepTaskProgress(68, "执行安全检查");
  const safetyErrors = validateGeneratedWeeklySafety(patientResult.schedules, staffResult.schedules);
  const blocking = [...patientResult.blocking, ...staffResult.blocking, ...safetyErrors];

  if (blocking.length) {
    await closeTaskProgress("周模板自动排班已阻止", 0);
    window.alert(`周模板自动排班未保存：\n\n${blocking.map((item) => `- ${item}`).join("\n")}`);
    return;
  }

  const smartOptimizationSummary = priority === SCHEDULE_PRIORITY_SMART
    ? buildSmartOptimizationSummary(patientResult, staffResult)
    : null;
  const warnings = [...patientResult.warnings, ...staffResult.warnings];
  const newFixedMachineCount = Object.entries(patientResult.fixedMachineAssignments || {}).filter(([patientId]) => !findPatient(patientId)?.fixedMachineId).length;
  const confirmLines = [
    "将生成并保存为以后长期循环的周模板。",
    `排班策略：${priority === SCHEDULE_PRIORITY_SMART ? "灵巧排班（全部每周3次患者采用安全弹性组合，优化护士班组）" : priority === SCHEDULE_PRIORITY_STAFF ? "医护优先（集中患者，尽量减少开班班次）" : "患者优先（尽量保持患者原星期和班次倾向）"}`,
    "范围：周一至周六排班，周日休息。",
    `患者治疗次数：${patientResult.assignedCount} 次`,
    `未来 4 周血滤计划：${patientResult.monthlyHdfCount} 次`,
    `长期固定机位：${newFixedMachineCount ? `首次固定 ${newFixedMachineCount} 名患者` : "沿用已有固定机位"}`,
    `实际开班：${staffResult.activeShiftCount} 个班次，关闭 ${WORKING_DAY_KEYS.length * STAFF_SHIFT_KEYS.length - staffResult.activeShiftCount} 个空班次`,
    `医护岗位：医生 ${staffResult.doctorShiftCount} 岗，责任护士 ${staffResult.nurseShiftCount} 岗，后备护士 ${staffResult.backupShiftCount} 岗`,
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
  confirmLines.push("", "确认把这份建议保存为以后长期循环的周模板吗？");

  const scheduleReview = buildAutoScheduleReview({
    patientResult,
    staffResult,
    priority,
    warnings,
    blocking: [],
    confirmLines,
  });
  lastScheduleReview = scheduleReview;
  await closeTaskProgress("周模板建议已生成，请复核", 0);
  const approved = await showScheduleReviewDialog(scheduleReview, true);
  if (!approved) {
    return;
  }

  showTaskProgress("正在保存自动周模板", "创建撤销快照", 12);
  await waitForBrowserPaint();
  captureUndoSnapshot("生成长期周模板");
  await stepTaskProgress(32, "清理旧的月度血滤调整");
  clearGeneratedMonthlyHdfOverrides();
  await stepTaskProgress(52, "写入周模板排班");
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
  const fixedAt = new Date().toISOString();
  await stepTaskProgress(70, "固定首次自动分配机位");
  Object.entries(patientResult.fixedMachineAssignments || {}).forEach(([patientId, machineId]) => {
    const patient = findPatient(patientId);
    if (patient && !patient.fixedMachineId && machineId) {
      patient.fixedMachineId = machineId;
      patient.fixedMachineLockedAt = fixedAt;
      patient.updatedAt = fixedAt;
    }
  });
  Object.entries(patientResult.monthlyHdfOverrides).forEach(([date, override]) => {
    state.schedules[date] = mergeDateOverrideDays(state.schedules[date] || {}, override);
  });
  saveState();
  await stepTaskProgress(88, "刷新患者、医护和排班台");
  renderPatientTable();
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  await closeTaskProgress("自动周模板已保存");
  showToast(newFixedMachineCount ? `已生成长期周模板，并为 ${newFixedMachineCount} 名患者固定机位` : "已生成长期循环周模板并沿用固定机位");
  if (lastScheduleReview) {
    lastScheduleReview.savedAt = new Date().toISOString();
    lastScheduleReview.status = "saved";
  }
  if (smartOptimizationSummary) {
    window.alert(formatSmartOptimizationSummary(smartOptimizationSummary));
  }
}


function buildAutoScheduleReview({ patientResult, staffResult, priority, warnings = [], blocking = [], confirmLines = [] }) {
  const patientRows = buildPatientReviewRows(patientResult.schedules || {});
  const staffRows = buildStaffReviewRows(staffResult.schedules || {});
  const positionAdjustments = buildPositionAdjustmentRows(patientRows);
  const timeAdjustments = (patientResult.timeAdjustments || []).map((item) => ({
    patientId: item.patientId,
    patientName: item.name,
    day: getWeekDayLabel(item.day),
    from: SHIFT_LABELS[item.from] || item.from,
    to: SHIFT_LABELS[item.to] || item.to,
  }));
  const dayAdjustments = (patientResult.dayAdjustments || []).map((item) => ({
    patientId: item.patientId,
    patientName: item.name,
    from: getWeekDayLabel(item.from),
    to: getWeekDayLabel(item.to),
  }));
  const fixedAssignments = Object.entries(patientResult.fixedMachineAssignments || {}).map(([patientId, machineId]) => ({
    patientId,
    patientName: findPatient(patientId)?.name || patientId,
    machineId,
    isNew: !findPatient(patientId)?.fixedMachineId,
  }));
  const recommendations = buildScheduleReviewRecommendations({
    patientResult,
    staffResult,
    patientRows,
    staffRows,
    positionAdjustments,
    warnings,
  });

  return {
    generatedAt: new Date().toISOString(),
    status: "preview",
    priority,
    patientRows,
    staffRows,
    dayAdjustments,
    timeAdjustments,
    positionAdjustments,
    fixedAssignments,
    warnings: [...warnings],
    blocking: [...blocking],
    recommendations,
    stats: {
      activePatients: patientRows.filter((row) => row.assignmentCount > 0).length,
      totalTreatments: patientRows.reduce((sum, row) => sum + row.assignmentCount, 0),
      activeShifts: staffResult.activeShiftCount || 0,
      doctorPositions: staffResult.doctorShiftCount || 0,
      nursePositions: staffResult.nurseShiftCount || 0,
      backupPositions: staffResult.backupShiftCount || 0,
      dayAdjustmentCount: dayAdjustments.length,
      timeAdjustmentCount: timeAdjustments.length,
      positionAdjustmentCount: positionAdjustments.length,
    },
    sourceSummary: [...confirmLines],
  };
}

function buildPatientReviewRows(weeklySchedules = {}) {
  const rowMap = new Map(
    state.patients
      .filter((patient) => patient.status === "active")
      .map((patient) => [patient.id, {
        patientId: patient.id,
        name: patient.name,
        dialysisNo: patient.dialysisNo || "",
        fixedMachineId: patient.fixedMachineId || "",
        preferredShift: patient.preferredShift || "",
        preferredDays: [...(patient.preferredDays || [])],
        days: {},
        assignmentCount: 0,
      }]),
  );

  WORKING_DAY_KEYS.forEach((dayKey) => {
    const daySchedule = weeklySchedules?.[dayKey] || {};
    Object.entries(daySchedule).forEach(([machineId, machineSchedule]) => {
      STAFF_SHIFT_KEYS.forEach((shift) => {
        const patientId = machineSchedule?.[shift]?.patientId;
        if (!patientId) return;
        const patient = findPatient(patientId);
        if (!rowMap.has(patientId)) {
          rowMap.set(patientId, {
            patientId,
            name: patient?.name || patientId,
            dialysisNo: patient?.dialysisNo || "",
            fixedMachineId: patient?.fixedMachineId || "",
            preferredShift: patient?.preferredShift || "",
            preferredDays: [...(patient?.preferredDays || [])],
            days: {},
            assignmentCount: 0,
          });
        }
        const row = rowMap.get(patientId);
        row.days[dayKey] = {
          shift,
          machineId,
          machineType: getMachineTypeLabel(machineId),
          machineZone: getMachineZoneLabel(machineId),
        };
        row.assignmentCount += 1;
      });
    });
  });

  return [...rowMap.values()].sort((left, right) =>
    String(left.name).localeCompare(String(right.name), "zh-CN")
  );
}

function buildStaffReviewRows(weeklyStaffSchedules = {}) {
  const rowMap = new Map();

  function ensureRow(staffId) {
    if (!staffId) return null;
    const staff = findStaff(staffId);
    if (!rowMap.has(staffId)) {
      rowMap.set(staffId, {
        staffId,
        name: staff?.name || staffId,
        staffCode: staff?.staffCode || "",
        role: staff?.role || "",
        days: {},
        shiftCount: 0,
      });
    }
    return rowMap.get(staffId);
  }

  WORKING_DAY_KEYS.forEach((dayKey) => {
    const daySchedule = weeklyStaffSchedules?.[dayKey] || {};
    STAFF_SHIFT_KEYS.forEach((shift) => {
      const shiftSchedule = daySchedule?.[shift] || {};
      (shiftSchedule.doctors || []).forEach((staffId, index) => {
        const row = ensureRow(staffId);
        if (!row) return;
        if (!row.days[dayKey]) row.days[dayKey] = [];
        row.days[dayKey].push({ shift, roleLabel: `医生${index + 1}` });
        row.shiftCount += 1;
      });
      const shiftGroups = getNurseGroupsForShift(
        state.weeklySchedules?.[dayKey] || {},
        shift,
        state.settings,
      ).filter((group) => group && !group.empty);

      (shiftSchedule.nurses || []).forEach((staffId, index) => {
        const row = ensureRow(staffId);
        if (!row) return;
        if (!row.days[dayKey]) row.days[dayKey] = [];
        const group = shiftGroups[index];
        row.days[dayKey].push({
          shift,
          roleLabel: `责任护士${index + 1}`,
          zoneLabel: getNurseGroupReviewLabel(group),
          machineIds: [...(group?.machines || [])],
        });
        row.shiftCount += 1;
      });
      if (shiftSchedule.backupNurse) {
        const row = ensureRow(shiftSchedule.backupNurse);
        if (row) {
          if (!row.days[dayKey]) row.days[dayKey] = [];
          row.days[dayKey].push({ shift, roleLabel: "后备护士" });
          row.shiftCount += 1;
        }
      }
    });
  });

  return [...rowMap.values()].sort((left, right) =>
    String(left.name).localeCompare(String(right.name), "zh-CN")
  );
}

function getNurseGroupReviewLabel(group) {
  if (!group || group.empty) {
    return "未分配管区";
  }
  const machines = [...(group.machines || [])]
    .map((machineId) => Number(machineId))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const machineText = machines.length
    ? machines.length === 1
      ? `${machines[0]}号机`
      : `${machines[0]}—${machines[machines.length - 1]}号机`
    : "未标明机位";
  const zoneText = group.zoneLabel || group.zone || "普通区";
  return `${zoneText} · ${machineText}`;
}

function buildPositionAdjustmentRows(patientRows = []) {
  const adjustments = [];
  patientRows.forEach((row) => {
    if (!row.fixedMachineId) return;
    Object.entries(row.days || {}).forEach(([dayKey, assignment]) => {
      if (String(assignment.machineId) !== String(row.fixedMachineId)) {
        adjustments.push({
          patientId: row.patientId,
          patientName: row.name,
          day: getWeekDayLabel(dayKey),
          shift: SHIFT_LABELS[assignment.shift] || assignment.shift,
          fromMachineId: row.fixedMachineId,
          toMachineId: assignment.machineId,
        });
      }
    });
  });
  return adjustments;
}

function buildScheduleReviewRecommendations({
  patientResult,
  staffResult,
  patientRows,
  staffRows,
  positionAdjustments,
  warnings,
}) {
  const recommendations = [];

  if ((patientResult.dayAdjustments || []).length) {
    recommendations.push({
      level: "warning",
      title: "透析日期发生调整",
      detail: `共有 ${new Set(patientResult.dayAdjustments.map((item) => item.patientId)).size} 名患者、${patientResult.dayAdjustments.length} 次治疗被调到其他日期，必须逐人确认患者是否能够到院。`,
    });
  }

  if ((patientResult.timeAdjustments || []).length) {
    recommendations.push({
      level: "warning",
      title: "上午/下午班次发生调整",
      detail: `共有 ${patientResult.timeAdjustments.length} 次班次变化，建议逐人电话或现场确认。`,
    });
  }

  if (positionAdjustments.length) {
    recommendations.push({
      level: "warning",
      title: "固定机位发生临时变化",
      detail: `发现 ${positionAdjustments.length} 次患者机位与长期固定机位不同，执行前应确认换位原因并通知患者与责任护士。`,
    });
  }

  const sameDayZoneChanges = [];
  staffRows.forEach((row) => {
    WORKING_DAY_KEYS.forEach((dayKey) => {
      const entries = row.days?.[dayKey] || [];
      const morning = entries.find((entry) => entry.shift === "morning" && entry.zoneLabel);
      const afternoon = entries.find((entry) => entry.shift === "afternoon" && entry.zoneLabel);
      if (morning && afternoon && morning.zoneLabel !== afternoon.zoneLabel) {
        sameDayZoneChanges.push({
          staffName: row.name,
          day: getWeekDayLabel(dayKey),
          morning: morning.zoneLabel,
          afternoon: afternoon.zoneLabel,
        });
      }
    });
  });
  if (sameDayZoneChanges.length) {
    recommendations.push({
      level: "advice",
      title: "同日上下班负责区域发生变化",
      detail: `发现 ${sameDayZoneChanges.length} 次同一护士上午、下午负责不同区域。系统已尽量保持同区连续，但受护士组数量变化或安全规则限制，建议人工复核。`,
    });
  }

  const shiftCounts = staffRows.map((row) => row.shiftCount).filter((count) => count > 0);
  if (shiftCounts.length) {
    const min = Math.min(...shiftCounts);
    const max = Math.max(...shiftCounts);
    if (max - min >= 2) {
      const heavy = staffRows.filter((row) => row.shiftCount === max).map((row) => row.name).join("、");
      const light = staffRows.filter((row) => row.shiftCount === min).map((row) => row.name).join("、");
      recommendations.push({
        level: "advice",
        title: "医护班次数量存在差异",
        detail: `最多 ${max} 个班次：${heavy}；最少 ${min} 个班次：${light}。建议人工检查是否需要轮换。`,
      });
    }
  }

  WORKING_DAY_KEYS.forEach((dayKey) => {
    const daySchedule = patientResult.schedules?.[dayKey] || {};
    STAFF_SHIFT_KEYS.forEach((shift) => {
      const groups = getNurseGroupsForShift(daySchedule, shift, state.settings)
        .filter((group) => group && !group.empty);
      groups.forEach((group) => {
        if (group.patientCount <= 2) {
          const machineRows = [...new Set(
            (group.machines || [])
              .map((machineId) => getMachinePositionMap(state.settings).get(String(machineId))?.row)
              .filter(Number.isInteger),
          )];
          recommendations.push({
            level: group.patientCount === 1 ? "warning" : "advice",
            title: "低负荷护士管区",
            detail: `${getWeekDayLabel(dayKey)}${SHIFT_LABELS[shift]}，第 ${machineRows.length ? machineRows[0] + 1 : "?"} 排，${group.patientCount} 人/护士。若医学与患者条件允许，可人工评估是否调整日期或班次。`,
          });
        }
      });
    });
  });

  (warnings || []).forEach((warning) => recommendations.push({
    level: "warning",
    title: "系统警告",
    detail: warning,
  }));

  if (!recommendations.length) {
    recommendations.push({
      level: "ok",
      title: "未发现明显需要调整的项目",
      detail: "仍需由科室负责人、责任护士和院感人员逐项核对后执行。",
    });
  }

  return recommendations;
}

function openCurrentScheduleReview() {
  const patientSchedules = WORKING_DAY_KEYS.reduce((result, dayKey) => {
    result[dayKey] = structuredClone(state.weeklySchedules?.[dayKey] || {});
    return result;
  }, {});
  const staffSchedules = WORKING_DAY_KEYS.reduce((result, dayKey) => {
    result[dayKey] = structuredClone(state.weeklyStaffSchedules?.[dayKey] || createEmptyStaffScheduleDay(0));
    return result;
  }, {});

  const patientResult = {
    schedules: patientSchedules,
    dayAdjustments: [],
    timeAdjustments: [],
    fixedMachineAssignments: {},
  };
  const staffResult = {
    schedules: staffSchedules,
    activeShiftCount: countActiveStaffShifts(staffSchedules),
    doctorShiftCount: countStaffPositions(staffSchedules, "doctor"),
    nurseShiftCount: countStaffPositions(staffSchedules, "nurse"),
    backupShiftCount: countStaffPositions(staffSchedules, "backup"),
  };
  lastScheduleReview = buildAutoScheduleReview({
    patientResult,
    staffResult,
    priority: normalizeSchedulePriority(state.settings.schedulePriority),
    warnings: [],
    blocking: [],
    confirmLines: [],
  });
  showScheduleReviewDialog(lastScheduleReview, false);
}

function countActiveStaffShifts(weeklyStaffSchedules = {}) {
  let count = 0;
  WORKING_DAY_KEYS.forEach((dayKey) => {
    STAFF_SHIFT_KEYS.forEach((shift) => {
      const entry = weeklyStaffSchedules?.[dayKey]?.[shift];
      if (entry && ((entry.doctors || []).some(Boolean) || (entry.nurses || []).some(Boolean) || entry.backupNurse)) {
        count += 1;
      }
    });
  });
  return count;
}

function countStaffPositions(weeklyStaffSchedules = {}, type = "nurse") {
  let count = 0;
  WORKING_DAY_KEYS.forEach((dayKey) => {
    STAFF_SHIFT_KEYS.forEach((shift) => {
      const entry = weeklyStaffSchedules?.[dayKey]?.[shift] || {};
      if (type === "doctor") count += (entry.doctors || []).filter(Boolean).length;
      if (type === "nurse") count += (entry.nurses || []).filter(Boolean).length;
      if (type === "backup") count += entry.backupNurse ? 1 : 0;
    });
  });
  return count;
}

function showScheduleReviewDialog(review, confirmMode = false) {
  lastScheduleReview = review;
  ui.confirmScheduleReview.hidden = !confirmMode;
  ui.scheduleReviewMeta.textContent = [
    `生成时间：${new Date(review.generatedAt).toLocaleString()}`,
    `策略：${getSchedulePriorityLabel(review.priority)}`,
    `护士上班方式：${getStaffWorkModeLabel()}`,
    review.status === "saved" ? "状态：已保存" : "状态：待人工复核",
  ].join(" · ");
  ui.scheduleReviewContent.innerHTML = renderScheduleReview(review);
  ui.scheduleReviewDialog.showModal();

  if (!confirmMode) {
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    pendingScheduleReviewResolver = resolve;
  });
}

function closeScheduleReview(approved = false) {
  if (ui.scheduleReviewDialog.open) {
    ui.scheduleReviewDialog.close();
  }
  const resolver = pendingScheduleReviewResolver;
  pendingScheduleReviewResolver = null;
  if (resolver) resolver(Boolean(approved));
}

function getSchedulePriorityLabel(priority = state?.settings?.schedulePriority) {
  const normalizedPriority = normalizeSchedulePriority(priority);
  return normalizedPriority === SCHEDULE_PRIORITY_SMART
    ? "灵巧排班"
    : normalizedPriority === SCHEDULE_PRIORITY_STAFF
      ? "医护优先"
      : "患者优先";
}

function renderScheduleReview(review) {
  const statCards = [
    ["在排患者", `${review.stats.activePatients} 人`],
    ["本周治疗", `${review.stats.totalTreatments} 次`],
    ["实际开班", `${review.stats.activeShifts} 个`],
    ["责任护士岗位", `${review.stats.nursePositions} 个`],
    ["日期调整", `${review.stats.dayAdjustmentCount} 次`],
    ["班次调整", `${review.stats.timeAdjustmentCount} 次`],
    ["位置调整", `${review.stats.positionAdjustmentCount} 次`],
  ].map(([label, value]) => `
    <article class="review-stat-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `).join("");

  return `
    <section class="review-section">
      <h3>一、总体概览</h3>
      <div class="review-stat-grid">${statCards}</div>
    </section>

    <section class="review-section">
      <h3>二、必须人工确认的变化</h3>
      ${renderReviewChanges(review)}
    </section>

    <section class="review-section">
      <h3>三、全体患者每周班次表</h3>
      <div class="review-table-wrap">${renderPatientReviewTable(review.patientRows)}</div>
    </section>

    <section class="review-section">
      <h3>四、全体医护每周班次表</h3>
      <div class="review-table-wrap">${renderStaffReviewTable(review.staffRows)}</div>
    </section>

    <section class="review-section">
      <h3>五、系统建议与警告</h3>
      ${renderReviewRecommendations(review.recommendations)}
    </section>
  `;
}

function renderReviewChanges(review) {
  const blocks = [];

  if (review.dayAdjustments.length) {
    blocks.push(`
      <div class="review-change-block warning">
        <h4>透析日期调整（${review.dayAdjustments.length}）</h4>
        <ul>${review.dayAdjustments.map((item) =>
          `<li><strong>${escapeHtml(item.patientName)}</strong>：${escapeHtml(item.from)} → ${escapeHtml(item.to)}</li>`
        ).join("")}</ul>
      </div>
    `);
  }

  if (review.timeAdjustments.length) {
    blocks.push(`
      <div class="review-change-block warning">
        <h4>上午/下午调整（${review.timeAdjustments.length}）</h4>
        <ul>${review.timeAdjustments.map((item) =>
          `<li><strong>${escapeHtml(item.patientName)}</strong>（${escapeHtml(item.day)}）：${escapeHtml(item.from)} → ${escapeHtml(item.to)}</li>`
        ).join("")}</ul>
      </div>
    `);
  }

  if (review.positionAdjustments.length) {
    blocks.push(`
      <div class="review-change-block warning">
        <h4>机位调整（${review.positionAdjustments.length}）</h4>
        <ul>${review.positionAdjustments.map((item) =>
          `<li><strong>${escapeHtml(item.patientName)}</strong>（${escapeHtml(item.day)} ${escapeHtml(item.shift)}）：${escapeHtml(item.fromMachineId)}号机 → ${escapeHtml(item.toMachineId)}号机</li>`
        ).join("")}</ul>
      </div>
    `);
  }

  const newFixed = review.fixedAssignments.filter((item) => item.isNew);
  if (newFixed.length) {
    blocks.push(`
      <div class="review-change-block info">
        <h4>首次固定机位（${newFixed.length}）</h4>
        <ul>${newFixed.map((item) =>
          `<li><strong>${escapeHtml(item.patientName)}</strong>：固定到 ${escapeHtml(item.machineId)} 号机</li>`
        ).join("")}</ul>
      </div>
    `);
  }

  return blocks.length ? blocks.join("") : `<div class="review-empty">本次未记录日期、班次或固定机位变化。</div>`;
}

function renderPatientReviewTable(rows = []) {
  const headers = WORKING_DAY_KEYS.map((dayKey) => `<th>${escapeHtml(getWeekDayLabel(dayKey))}</th>`).join("");
  const body = rows.map((row) => `
    <tr>
      <td class="review-name-cell"><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.dialysisNo || "")}</small></td>
      <td>${escapeHtml(row.fixedMachineId ? `${row.fixedMachineId}号机` : "未固定")}</td>
      ${WORKING_DAY_KEYS.map((dayKey) => {
        const entry = row.days?.[dayKey];
        return `<td>${entry
          ? `<span class="review-assignment">${escapeHtml(SHIFT_LABELS[entry.shift])}<br>${escapeHtml(entry.machineId)}号机</span>`
          : `<span class="review-none">—</span>`}</td>`;
      }).join("")}
    </tr>
  `).join("");
  return `
    <table class="review-table">
      <thead><tr><th>患者</th><th>固定机位</th>${headers}</tr></thead>
      <tbody>${body || `<tr><td colspan="${WORKING_DAY_KEYS.length + 2}">暂无患者排班</td></tr>`}</tbody>
    </table>
  `;
}

function renderStaffReviewTable(rows = []) {
  const headers = WORKING_DAY_KEYS.map((dayKey) => `<th>${escapeHtml(getWeekDayLabel(dayKey))}</th>`).join("");
  const body = rows.map((row) => `
    <tr>
      <td class="review-name-cell"><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.staffCode || "")}</small></td>
      <td>${escapeHtml(row.role === "doctor" ? "医生" : "护士")}</td>
      <td>${escapeHtml(`${row.shiftCount}个班次`)}</td>
      ${WORKING_DAY_KEYS.map((dayKey) => {
        const entries = row.days?.[dayKey] || [];
        return `<td>${entries.length
          ? entries.map((entry) => {
              if (entry.zoneLabel) {
                return `<span class="review-staff-duty">
                  <strong>${escapeHtml(SHIFT_LABELS[entry.shift])}</strong>
                  <span>负责：${escapeHtml(entry.zoneLabel)}</span>
                </span>`;
              }
              return `<span class="review-staff-duty">
                <strong>${escapeHtml(SHIFT_LABELS[entry.shift])}</strong>
                <span>${escapeHtml(entry.roleLabel)}</span>
              </span>`;
            }).join("<br>")
          : `<span class="review-none">休</span>`}</td>`;
      }).join("")}
    </tr>
  `).join("");
  return `
    <table class="review-table">
      <thead><tr><th>医护</th><th>角色</th><th>总班次</th>${headers}</tr></thead>
      <tbody>${body || `<tr><td colspan="${WORKING_DAY_KEYS.length + 3}">暂无医护排班</td></tr>`}</tbody>
    </table>
  `;
}

function renderReviewRecommendations(items = []) {
  return `
    <div class="review-recommendation-list">
      ${items.map((item) => `
        <article class="review-recommendation ${escapeHtml(item.level || "advice")}">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.detail)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function printScheduleReview() {
  if (!lastScheduleReview) return;
  document.body.classList.add("printing-schedule-review");
  window.print();
  setTimeout(() => document.body.classList.remove("printing-schedule-review"), 300);
}

function buildSmartOptimizationSummary(smartPatientResult, smartStaffResult) {
  const baselinePatientResult = buildAutoWeeklyPatientSchedules(getCurrentDate(), SCHEDULE_PRIORITY_PATIENT);
  const baselineStaffResult = buildAutoWeeklyStaffSchedules(baselinePatientResult.schedules, SCHEDULE_PRIORITY_PATIENT);
  const baselineErrors = [
    ...(baselinePatientResult.blocking || []),
    ...(baselineStaffResult.blocking || []),
    ...validateGeneratedWeeklySafety(baselinePatientResult.schedules, baselineStaffResult.schedules),
  ];

  const adjustedPatientIds = new Set((smartPatientResult.dayAdjustments || []).map((item) => item.patientId).filter(Boolean));
  const adjustedPatients = [...adjustedPatientIds]
    .map((patientId) => findPatient(patientId)?.name || patientId)
    .filter(Boolean);
  const smartLoadStats = getWeeklyNurseLoadStats(smartPatientResult.schedules);
  const baselineLoadStats = baselineErrors.length ? null : getWeeklyNurseLoadStats(baselinePatientResult.schedules);

  return {
    baselineAvailable: baselineErrors.length === 0,
    adjustedPatientCount: adjustedPatientIds.size,
    adjustedTreatmentCount: (smartPatientResult.dayAdjustments || []).length,
    adjustedPatients,
    timeAdjustmentCount: (smartPatientResult.timeAdjustments || []).length,
    currentActiveShiftCount: smartStaffResult.activeShiftCount || 0,
    reducedActiveShiftCount: baselineErrors.length ? null : Math.max(0, (baselineStaffResult.activeShiftCount || 0) - (smartStaffResult.activeShiftCount || 0)),
    currentNurseShiftCount: smartStaffResult.nurseShiftCount || 0,
    reducedNurseShiftCount: baselineErrors.length ? null : Math.max(0, (baselineStaffResult.nurseShiftCount || 0) - (smartStaffResult.nurseShiftCount || 0)),
    currentSingleGroupCount: smartLoadStats.singleGroupCount,
    reducedSingleGroupCount: baselineLoadStats ? Math.max(0, baselineLoadStats.singleGroupCount - smartLoadStats.singleGroupCount) : null,
    currentLowLoadGroupCount: smartLoadStats.lowLoadGroupCount,
    reducedLowLoadGroupCount: baselineLoadStats ? Math.max(0, baselineLoadStats.lowLoadGroupCount - smartLoadStats.lowLoadGroupCount) : null,
    totalTreatmentCount: smartPatientResult.assignedCount || 0,
  };
}

function getWeeklyNurseLoadStats(weeklySchedules) {
  let groupCount = 0;
  let singleGroupCount = 0;
  let lowLoadGroupCount = 0;
  let unusedCapacity = 0;
  WORKING_DAY_KEYS.forEach((dayKey) => {
    const daySchedule = weeklySchedules?.[dayKey] || {};
    STAFF_SHIFT_KEYS.forEach((shift) => {
      getNurseGroupsForShift(daySchedule, shift, state.settings)
        .filter((group) => group && !group.empty)
        .forEach((group) => {
          const patientCount = Number(group.patientCount) || 0;
          const capacity = Number(group.capacity) || 0;
          groupCount += 1;
          if (patientCount === 1) singleGroupCount += 1;
          if (patientCount > 0 && patientCount <= 2) lowLoadGroupCount += 1;
          unusedCapacity += Math.max(0, capacity - patientCount);
        });
    });
  });
  return { groupCount, singleGroupCount, lowLoadGroupCount, unusedCapacity };
}

function formatSmartOptimizationSummary(summary) {
  const lines = [
    "灵巧排班优化完成",
    "",
    `本周治疗总次数：${summary.totalTreatmentCount} 次`,
    `调整透析日期：${summary.adjustedPatientCount} 名患者，共 ${summary.adjustedTreatmentCount} 次治疗`,
    `调整上午/下午班次：${summary.timeAdjustmentCount} 次`,
  ];

  if (summary.baselineAvailable) {
    lines.push(
      "",
      "与“患者优先”排班方案相比：",
      `减少开班班次：${summary.reducedActiveShiftCount} 个（当前 ${summary.currentActiveShiftCount} 个）`,
      `减少责任护士岗位：${summary.reducedNurseShiftCount} 个（当前 ${summary.currentNurseShiftCount} 个）`,
      `减少单人护士组：${summary.reducedSingleGroupCount} 个（当前 ${summary.currentSingleGroupCount} 个）`,
      `减少低负荷护士组（1—2人）：${summary.reducedLowLoadGroupCount} 个（当前 ${summary.currentLowLoadGroupCount} 个）`,
    );
  } else {
    lines.push(
      "",
      "患者优先基准方案未通过完整安全校验，本次仅显示灵巧排班自身结果：",
      `实际开班：${summary.currentActiveShiftCount} 个班次`,
      `责任护士岗位：${summary.currentNurseShiftCount} 个`,
      `单人护士组：${summary.currentSingleGroupCount} 个`,
      `低负荷护士组（1—2人）：${summary.currentLowLoadGroupCount} 个`,
    );
  }

  if (summary.adjustedPatients.length) {
    const preview = summary.adjustedPatients.slice(0, 12).join("、");
    const remainder = summary.adjustedPatients.length > 12 ? `等 ${summary.adjustedPatients.length} 人` : "";
    lines.push("", `调整日期患者：${preview}${remainder}`);
  }
  lines.push("", "所有结果仍需医护人员人工复核后执行。");
  return lines.join("\n");
}

function buildAutoWeeklyPatientSchedules(selectedDate = getCurrentDate(), priority = state.settings.schedulePriority, options = {}) {
  const allMachines = [...getMachineIds()].sort(sortMachineIds);
  const machines = [...getAvailableMachineIds()].sort(sortMachineIds);
  const specialMachines = getSpecialMachines().filter((machineId) => !isMachinePaused(machineId)).sort(sortMachineIds);
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
  const fixedMachineAssignments = {};
  const assignedMachineByPatient = new Map();
  Object.entries(options.preferredMachineAssignments || {}).forEach(([patientIdOrKey, machineId]) => {
    if (!machineId) return;
    const assignmentKey = patientIdOrKey.includes(":")
      ? patientIdOrKey
      : getPatientMachineAssignmentKey(patientIdOrKey, DEFAULT_MACHINE_TYPE);
    assignedMachineByPatient.set(assignmentKey, String(machineId));
  });
  const sessionTreatmentResolver = typeof options.sessionTreatmentResolver === "function"
    ? options.sessionTreatmentResolver
    : null;
  const skipMonthlyHdfOverrides = Boolean(options.skipMonthlyHdfOverrides);
  blocking.push(...validateForcedPreferredDaysPatients());
  ensureDefaultDialysisDaysForSchedulablePatients(priority);
  const activePatients = getSchedulablePatients();
  const missingDayPreference = [];
  const insufficientDayPreference = activePatients.filter(
    (patient) => patient.preferredDays?.length && patient.preferredDays.length < clampNumber(patient.weeklyTreatmentCount, 1, 6, 3),
  );
  const patientsWithSunday = activePatients.filter((patient) => patient.preferredDays?.includes(REST_DAY_KEY));
  activePatients.forEach((patient) => {
    if (!patient.fixedMachineId) {
      return;
    }
    if (!allMachines.includes(patient.fixedMachineId)) {
      blocking.push(`${patient.name} 的固定机位 ${patient.fixedMachineId} 当前不存在。请在患者资料中解除或重新选择固定机位。`);
      return;
    }
    if (!patientFitsMachineForTreatment(patient, patient.treatmentType, patient.fixedMachineId)) {
      blocking.push(`${patient.name} 的固定机位 ${patient.fixedMachineId} 与当前治疗类型或分区不匹配。`);
      return;
    }
    if (isMachinePaused(patient.fixedMachineId)) {
      warnings.push(`${patient.name} 的固定机位 ${patient.fixedMachineId} 已暂停，本次自动排班会临时安排到其他兼容机器；恢复后可重新生成并回到原机位。`);
    } else {
      assignedMachineByPatient.set(getPatientMachineAssignmentKey(patient.id, patient.treatmentType), patient.fixedMachineId);
    }
  });

  if (blocking.length) {
    return { schedules, monthlyHdfOverrides, warnings, blocking, timeAdjustments, dayAdjustments, fixedMachineAssignments, monthlyHdfCount: 0, assignedCount: 0 };
  }

  const flexibleDemand = new Map();
  let flexiblePatternPatientCount = 0;
  activePatients.forEach((patient, patientIndex) => {
    const requestedDays = getPatientPlannedDays(patient, patientIndex, SCHEDULE_PRIORITY_PATIENT);
    const frequency = clampNumber(patient.weeklyTreatmentCount, 1, 6, 3);
    const canOptimizeDays = isFlexibleDayPriority(priority) && frequency === 3 && !hasForcedPreferredDays(patient);
    const plannedDays = canOptimizeDays
      ? chooseOptimizedThriceWeeklyPattern(patient, flexibleDemand, patientIndex)
      : getPatientPlannedDays(patient, patientIndex, priority);
    if (canOptimizeDays) {
      registerFlexiblePatternDemand(patient, plannedDays, flexibleDemand);
      if (!sameDayPattern(plannedDays, requestedDays)) {
        flexiblePatternPatientCount += 1;
      }
    }
    plannedDays.forEach((dayKey, index) => {
      const defaultTreatmentType = normalizeMachineType(patient.treatmentType);
      const resolvedTreatmentType = sessionTreatmentResolver
        ? sessionTreatmentResolver({ patient, patientIndex, index, dayKey, plannedDays, requestedDays, defaultTreatmentType })
        : defaultTreatmentType;
      sessions.push({
        patient,
        originalDay: dayKey,
        requestedDay: requestedDays[index] || dayKey,
        lockedDay: hasForcedPreferredDays(patient),
        treatmentType: normalizeMachineType(resolvedTreatmentType || defaultTreatmentType),
      });
    });
  });
  if (isFlexibleDayPriority(priority) && flexiblePatternPatientCount) {
    const modeLabel = priority === SCHEDULE_PRIORITY_SMART ? "灵巧排班" : "医护优先";
    warnings.push(`${modeLabel}已将 ${flexiblePatternPatientCount} 名每周3次患者在安全组合 1-3-5、2-4-6、1-3-6、1-4-6 中优化透析日期，以减少单人或低负荷护士组。`);
  }
  sessions.sort((a, b) => sortAutoPatients(a.patient, b.patient) || getDaySortValue(a.originalDay) - getDaySortValue(b.originalDay));
  if (options.preassignMachines) {
    const preassigned = buildSessionMachineAssignments(sessions, assignedMachineByPatient);
    preassigned.forEach((machineId, assignmentKey) => {
      assignedMachineByPatient.set(assignmentKey, machineId);
    });
  }
  const infectiousDue = sessions.filter((session) => isInfectiousPatient(session.patient));

  if (!sessions.length) {
    blocking.push("当前没有可生成周模板的可排班患者。请确认患者库中至少有1名未暂停患者；星期未设置时系统会自动分配，不需要手动填写。");
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
    if (shouldFallbackToPatientPriority(priority, options)) {
      return buildPatientPriorityFallbackSchedule(selectedDate, priority, options, warnings, blocking.join("；"));
    }
    return { schedules, monthlyHdfOverrides, warnings, blocking, timeAdjustments, dayAdjustments, fixedMachineAssignments, monthlyHdfCount: 0, assignedCount: 0 };
  }

  const unassigned = [];
  const assignedDaysByPatient = new Map();
  sessions.forEach((session) => {
    const assignment = assignWeeklyPatientSession(session, schedules, machines, specialMachines, regularMachines, assignedDaysByPatient, assignedMachineByPatient, priority, Boolean(options.fastMachineSelection));
    if (!assignment) {
      unassigned.push({
        label: `${session.patient.name}（${session.lockedDay ? "强制" : "原"}${getWeekDayLabel(session.originalDay)}）`,
        lockedDay: Boolean(session.lockedDay),
      });
      return;
    }
    const patientDays = assignedDaysByPatient.get(session.patient.id) || new Set();
    patientDays.add(assignment.day);
    assignedDaysByPatient.set(session.patient.id, patientDays);
    if (assignment.day !== session.requestedDay) {
      dayAdjustments.push({ patientId: session.patient.id, name: session.patient.name, from: session.requestedDay, to: assignment.day });
    }
    if (session.patient.preferredShift && assignment.shift !== session.patient.preferredShift) {
      timeAdjustments.push({ patientId: session.patient.id, name: session.patient.name, day: assignment.day, from: session.patient.preferredShift, to: assignment.shift });
    }
  });

  if (unassigned.length) {
    const forcedHint = unassigned.some((item) => item.lockedDay)
      ? "强制个性化患者不会自动改到其他星期；如果当天容量不足，请增加当天可用机位，或取消该患者的强制个性化后重新生成。"
      : "";
    const reason = `周模板仍有治疗次数未能安排：${unassigned.map((item) => item.label).join("、")}。${forcedHint}系统已尝试固定机位、推荐机位和全部兼容机位；请检查该患者分区、治疗类型、血滤机数量、暂停机器和同日治疗间隔。`;
    if (shouldFallbackToPatientPriority(priority, options)) {
      return buildPatientPriorityFallbackSchedule(selectedDate, priority, options, warnings, reason);
    }
    blocking.push(reason);
  }

  if (!blocking.length && !skipMonthlyHdfOverrides) {
    const hdfResult = buildMonthlyHdfOverrides(selectedDate, schedules, specialMachines, regularMachines);
    Object.assign(monthlyHdfOverrides, hdfResult.overrides);
    warnings.push(...hdfResult.warnings);
    blocking.push(...hdfResult.blocking);
  }

  activePatients.forEach((patient) => {
    const machineId = assignedMachineByPatient.get(getPatientMachineAssignmentKey(patient.id, patient.treatmentType));
    if (machineId && !patient.fixedMachineId) {
      fixedMachineAssignments[patient.id] = machineId;
    }
  });

  return {
    schedules,
    monthlyHdfOverrides,
    warnings,
    blocking,
    timeAdjustments,
    dayAdjustments,
    fixedMachineAssignments,
    monthlyHdfCount: countMonthlyHdfOverrides(monthlyHdfOverrides),
    assignedCount: sessions.length - unassigned.length,
  };
}

function shouldFallbackToPatientPriority(priority, options = {}) {
  return isFlexibleDayPriority(priority) && !options.disableFlexibleFallback;
}

function buildPatientPriorityFallbackSchedule(selectedDate, priority, options = {}, currentWarnings = [], reason = "") {
  const modeLabel = priority === SCHEDULE_PRIORITY_SMART ? "灵巧排班" : "医护优先";
  let triedStaffPriorityFirst = false;
  if (priority === SCHEDULE_PRIORITY_SMART) {
    const staffFallback = buildAutoWeeklyPatientSchedules(selectedDate, SCHEDULE_PRIORITY_STAFF, {
      ...options,
      disableFlexibleFallback: true,
    });
    if (!staffFallback.blocking?.length) {
      staffFallback.warnings = dedupeMessages([
        `${modeLabel}集中排班在当前患者数量、血滤、传染/非传染分区和严重组约束下无法完整生成，已优先改用医护优先排班法。${reason ? `原因为：${reason}` : ""}`,
        ...(currentWarnings || []),
        ...(staffFallback.warnings || []),
      ]);
      return staffFallback;
    }
    triedStaffPriorityFirst = true;
  }
  const fallback = buildAutoWeeklyPatientSchedules(selectedDate, SCHEDULE_PRIORITY_PATIENT, {
    ...options,
    disableFlexibleFallback: true,
  });
  const fallbackMessage = triedStaffPriorityFirst
    ? `${modeLabel}集中排班在当前患者数量、血滤、传染/非传染分区和严重组约束下无法完整生成；系统已先尝试医护优先排班法，但医护优先仍放不下，最后改用患者优先安全排班：先按患者设置的星期几倾向安排，放不下才调整到其他工作日。${reason ? `原因为：${reason}` : ""}`
    : `${modeLabel}集中排班在当前患者数量、血滤、传染/非传染分区和严重组约束下无法完整生成，已自动改用患者优先安全排班：先按患者设置的星期几倾向安排，放不下才调整到其他工作日。${reason ? `原因为：${reason}` : ""}`;
  fallback.warnings = dedupeMessages([
    fallbackMessage,
    ...(currentWarnings || []),
    ...(fallback.warnings || []),
  ]);
  return fallback;
}

function buildMonthlyHdfOverrides(selectedDate, weeklySchedules = {}, specialMachines = [], regularMachines = []) {
  const overrides = {};
  const warnings = [];
  const blocking = [];
  const hdfMachineByPatient = new Map();
  const weekStart = getWeekStart(parseDateInput(selectedDate));
  const activePatients = getSchedulablePatients()
    .filter((patient) => normalizeMachineType(patient.treatmentType) === DEFAULT_MACHINE_TYPE)
    .filter((patient) => normalizeEvenHdfCount(patient.monthlyHdfCount, 0) > 0);

  activePatients.forEach((patient, patientIndex) => {
    const sessions = getFourWeekPatientSessions(patient.id, weeklySchedules, weekStart);
    const targetCount = Math.min(normalizeEvenHdfCount(patient.monthlyHdfCount, 0), sessions.length);
    if (!targetCount) {
      warnings.push(`${patient.name} 未找到可转换为月度血滤的常规血透排班。`);
      return;
    }

    const selectedIndexes = getEvenlyDistributedSessionIndexes(sessions.length, targetCount, patientIndex);
    selectedIndexes.forEach((sessionIndex) => {
      const session = sessions[sessionIndex];
      const result = addMonthlyHdfOverrideForSession({
        patient,
        session,
        weeklySchedules,
        overrides,
        specialMachines,
        regularMachines,
        hdfMachineByPatient,
      });
      if (result.blocking) blocking.push(result.blocking);
      if (result.warning) warnings.push(result.warning);
    });
  });

  return { overrides, warnings: dedupeMessages(warnings), blocking: dedupeMessages(blocking) };
}

function getFourWeekPatientSessions(patientId, weeklySchedules, weekStart) {
  const sessions = [];
  for (let weekOffset = 0; weekOffset < 4; weekOffset += 1) {
    WORKING_DAY_KEYS.forEach((dayKey, dayIndex) => {
      const date = formatDateInput(addDays(weekStart, weekOffset * 7 + dayIndex));
      const daySchedule = weeklySchedules?.[dayKey] || {};
      Object.entries(daySchedule).forEach(([machineId, machine]) => {
        STAFF_SHIFT_KEYS.forEach((shift) => {
          const slot = machine?.[shift];
          if (slot?.patientId === patientId && normalizeMachineType(slot.treatmentType) === DEFAULT_MACHINE_TYPE) {
            sessions.push({ date, dayKey, machineId, shift, slot });
          }
        });
      });
    });
  }
  return sessions;
}

function addMonthlyHdfOverrideForSession({ patient, session, weeklySchedules, overrides, specialMachines, regularMachines, hdfMachineByPatient }) {
  const weeklyDay = weeklySchedules?.[session.dayKey] || {};
  const overrideDay = overrides[session.date] || {};
  const effectiveDay = removePatientSessionFromDay(
    mergeScheduleDays(weeklyDay, overrideDay),
    patient.id,
    session.machineId,
    session.shift,
  );
  const preferredHdfMachineId = hdfMachineByPatient?.get(patient.id) || "";
  const targetMachineId = findMonthlyHdfMachine(patient, session, effectiveDay, specialMachines, regularMachines, preferredHdfMachineId);
  if (!targetMachineId) {
    return {
      blocking: `${patient.name} 在 ${formatDateLabel(session.date)} ${SHIFT_LABELS[session.shift]} 未找到可用血滤机，请检查血滤机数量、分区和暂停机器。`,
    };
  }
  if (hdfMachineByPatient && !hdfMachineByPatient.has(patient.id)) {
    hdfMachineByPatient.set(patient.id, String(targetMachineId));
  }

  const now = new Date().toISOString();
  const note = `每月血滤；原${session.machineId}号机${SHIFT_LABELS[session.shift]}`;
  if (String(targetMachineId) !== String(session.machineId)) {
    setScheduleSlot(overrides, session.date, session.machineId, session.shift, {
      removed: true,
      source: AUTO_OVERRIDE_SOURCE_MONTHLY_HDF,
      note,
      updatedAt: now,
    });
  }
  setScheduleSlot(overrides, session.date, targetMachineId, session.shift, {
    patientId: patient.id,
    treatmentType: "hemofiltration",
    source: AUTO_OVERRIDE_SOURCE_MONTHLY_HDF,
    note,
    updatedAt: now,
  });
  return {};
}

function removePatientSessionFromDay(daySchedule, patientId, machineId, shift) {
  const result = structuredClone(daySchedule || {});
  if (result?.[machineId]?.[shift]?.patientId === patientId) {
    delete result[machineId][shift];
    if (!result[machineId].morning && !result[machineId].afternoon) {
      delete result[machineId];
    }
  }
  return result;
}

function findMonthlyHdfMachine(patient, session, effectiveDay, specialMachines = [], regularMachines = [], preferredHdfMachineId = "") {
  const preferredMachineId = preferredHdfMachineId ? String(preferredHdfMachineId) : "";
  const pool = getEligibleMachinePoolForTreatment(patient, "hemofiltration", specialMachines, regularMachines)
    .filter((machineId) => machineSupportsTreatment(machineId, "hemofiltration"))
    .sort((left, right) =>
      Number(Boolean(preferredMachineId) && String(left) !== preferredMachineId) - Number(Boolean(preferredMachineId) && String(right) !== preferredMachineId) ||
      Number(String(left) !== String(session.machineId)) - Number(String(right) !== String(session.machineId)) ||
      getMachineZonePreferenceScore(patient, left) - getMachineZonePreferenceScore(patient, right) ||
      sortMachineIds(left, right),
    );
  return pool.find((machineId) => {
    if (effectiveDay?.[machineId]?.[session.shift]?.patientId) {
      return false;
    }
    return candidateKeepsNurseGroupsValid(machineId, session.shift, effectiveDay, patient, "hemofiltration");
  }) || "";
}

function countMonthlyHdfOverrides(overrides = {}) {
  let count = 0;
  Object.values(overrides || {}).forEach((daySchedule) => {
    Object.values(daySchedule || {}).forEach((machine) => {
      STAFF_SHIFT_KEYS.forEach((shift) => {
        const slot = machine?.[shift];
        if (
          slot?.patientId &&
          normalizeMachineType(slot.treatmentType) === "hemofiltration" &&
          normalizeScheduleSlotSource(slot.source, slot.note) === AUTO_OVERRIDE_SOURCE_MONTHLY_HDF
        ) {
          count += 1;
        }
      });
    });
  });
  return count;
}

function clearGeneratedMonthlyHdfOverrides() {
  Object.keys(state.schedules || {}).forEach((date) => {
    const daySchedule = state.schedules[date];
    Object.keys(daySchedule || {}).forEach((machineId) => {
      STAFF_SHIFT_KEYS.forEach((shift) => {
        const slot = daySchedule?.[machineId]?.[shift];
        if (slot && normalizeScheduleSlotSource(slot.source, slot.note) === AUTO_OVERRIDE_SOURCE_MONTHLY_HDF) {
          delete daySchedule[machineId][shift];
        }
      });
      if (!daySchedule[machineId]?.morning && !daySchedule[machineId]?.afternoon) {
        delete daySchedule[machineId];
      }
    });
    if (!Object.keys(daySchedule || {}).length) {
      delete state.schedules[date];
    }
  });
}

function getPatientPlannedDays(patient, patientIndex = 0, priority = SCHEDULE_PRIORITY_PATIENT) {
  const frequency = clampNumber(patient.weeklyTreatmentCount, 1, 6, 3);
  const selected = normalizeDayPreference(patient.preferredDays);
  if (hasForcedPreferredDays(patient)) {
    return [...selected];
  }
  if (isCompactResourcePriority(priority)) {
    return getStaffPriorityDayPattern(frequency);
  }

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

function getStaffPriorityDayPattern(frequency) {
  const patterns = {
    1: ["3"],
    2: ["1", "4"],
    3: ["1", "3", "5"],
    4: ["1", "2", "4", "5"],
    5: ["1", "2", "3", "4", "5"],
    6: ["1", "2", "3", "4", "5", "6"],
  };
  return [...(patterns[frequency] || patterns[3])];
}

function getDaySortValue(dayKey) {
  const index = WORKING_DAY_KEYS.indexOf(String(dayKey));
  return index >= 0 ? index : WORKING_DAY_KEYS.length;
}

function sortAutoPatients(a, b) {
  return Number(isInfectiousPatient(b)) - Number(isInfectiousPatient(a)) ||
    Number(isSeverePatient(b)) - Number(isSeverePatient(a)) ||
    Number(Boolean(b.fixedMachineId)) - Number(Boolean(a.fixedMachineId)) ||
    normalizeMachineType(b.treatmentType).localeCompare(normalizeMachineType(a.treatmentType)) ||
    clampNumber(b.weeklyTreatmentCount, 1, 6, 3) - clampNumber(a.weeklyTreatmentCount, 1, 6, 3) ||
    sortPatients(a, b);
}

function getDayTreatmentLoad(schedules, dayKey, machines = getMachineIds()) {
  const day = schedules?.[dayKey] || {};
  return STAFF_SHIFT_KEYS.reduce((sum, shift) => sum + countAssigned(day, machines, shift), 0);
}

function getWorkingDaysForStaffPriority(schedules, machines = getMachineIds()) {
  return [...WORKING_DAY_KEYS].sort((left, right) => {
    const leftLoad = getDayTreatmentLoad(schedules, left, machines);
    const rightLoad = getDayTreatmentLoad(schedules, right, machines);
    return Number(leftLoad === 0) - Number(rightLoad === 0) ||
      rightLoad - leftLoad ||
      getDaySortValue(left) - getDaySortValue(right);
  });
}

function getWorkingDaysByCurrentLoad(schedules, machines = getMachineIds()) {
  return [...WORKING_DAY_KEYS].sort((left, right) =>
    getDayTreatmentLoad(schedules, left, machines) - getDayTreatmentLoad(schedules, right, machines) ||
    getDaySortValue(left) - getDaySortValue(right),
  );
}

function getShiftTreatmentLoad(daySchedule, machines = getMachineIds(), shift) {
  return countAssigned(daySchedule || {}, machines, shift);
}

function getShiftsForStaffPriority(daySchedule, machines = getMachineIds()) {
  return [...STAFF_SHIFT_KEYS].sort((left, right) => {
    const leftLoad = getShiftTreatmentLoad(daySchedule, machines, left);
    const rightLoad = getShiftTreatmentLoad(daySchedule, machines, right);
    return Number(leftLoad === 0) - Number(rightLoad === 0) ||
      rightLoad - leftLoad ||
      STAFF_SHIFT_KEYS.indexOf(left) - STAFF_SHIFT_KEYS.indexOf(right);
  });
}

function getShiftsByCurrentLoad(daySchedule, machines = getMachineIds()) {
  return [...STAFF_SHIFT_KEYS].sort((left, right) =>
    getShiftTreatmentLoad(daySchedule, machines, left) - getShiftTreatmentLoad(daySchedule, machines, right) ||
    STAFF_SHIFT_KEYS.indexOf(left) - STAFF_SHIFT_KEYS.indexOf(right),
  );
}

function chooseOptimizedThriceWeeklyPattern(patient, demandMap, patientIndex = 0) {
  const preferred = normalizeDayPreference(patient.preferredDays).filter((day) => WORKING_DAY_KEYS.includes(day));
  const groupKey = getFlexibleDemandGroupKey(patient);
  const capacity = isSeverePatient(patient) ? 5 : 6;
  const candidates = SAFE_THRICE_WEEKLY_PATTERNS.filter(isSafeThriceWeeklyPattern);
  let bestPattern = candidates[patientIndex % candidates.length] || SAFE_THRICE_WEEKLY_PATTERNS[0];
  let bestScore = Number.POSITIVE_INFINITY;

  candidates.forEach((pattern, patternIndex) => {
    const hypothetical = WORKING_DAY_KEYS.map((day) => {
      const current = demandMap.get(`${groupKey}|${day}`) || 0;
      return current + (pattern.includes(day) ? 1 : 0);
    });
    const nurseGroups = hypothetical.reduce((sum, count) => sum + (count ? Math.ceil(count / capacity) : 0), 0);
    const singleGroups = hypothetical.reduce((sum, count) => sum + (count > 0 && count % capacity === 1 ? 1 : 0), 0);
    const underfilledSeats = hypothetical.reduce((sum, count) => {
      if (!count) return sum;
      return sum + (Math.ceil(count / capacity) * capacity - count);
    }, 0);
    const activeDays = hypothetical.filter(Boolean).length;
    const preferenceDistance = preferred.length
      ? symmetricPatternDifference(pattern, preferred)
      : 0;
    // 优先级：减少护士组 > 消除单人组 > 减少空余容量 > 少开班日 > 少改患者原日期。
    const score = nurseGroups * 10000 + singleGroups * 1000 + underfilledSeats * 20 + activeDays * 5 + preferenceDistance * 2 + patternIndex * 0.001;
    if (score < bestScore) {
      bestScore = score;
      bestPattern = pattern;
    }
  });

  return [...bestPattern];
}

function registerFlexiblePatternDemand(patient, pattern, demandMap) {
  const groupKey = getFlexibleDemandGroupKey(patient);
  pattern.forEach((day) => {
    const key = `${groupKey}|${day}`;
    demandMap.set(key, (demandMap.get(key) || 0) + 1);
  });
}

function getFlexibleDemandGroupKey(patient) {
  const infection = normalizeInfectionFlag(patient.infectionFlag) || "NON_INFECTIOUS";
  const care = isSeverePatient(patient) ? "SEVERE" : "STANDARD";
  const treatment = normalizeMachineType(patient.treatmentType);
  const shift = patient.preferredShift || "ANY_SHIFT";
  return [infection, care, treatment, shift].join("|");
}

function isSafeThriceWeeklyPattern(pattern) {
  const days = [...new Set((pattern || []).map(Number))].sort((a, b) => a - b);
  if (days.length !== 3 || days.some((day) => day < 1 || day > 6)) {
    return false;
  }
  const circularGaps = [days[1] - days[0], days[2] - days[1], 7 + days[0] - days[2]];
  return circularGaps.every((gap) => gap >= 2);
}

function symmetricPatternDifference(left, right) {
  const leftSet = new Set((left || []).map(String));
  const rightSet = new Set((right || []).map(String));
  let difference = 0;
  leftSet.forEach((day) => { if (!rightSet.has(day)) difference += 1; });
  rightSet.forEach((day) => { if (!leftSet.has(day)) difference += 1; });
  return difference;
}

function sameDayPattern(left, right) {
  const a = [...new Set((left || []).map(String))].sort();
  const b = [...new Set((right || []).map(String))].sort();
  return a.length === b.length && a.every((day, index) => day === b[index]);
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
      machines: getAvailableMachineIds().filter((machineId) => {
        const zone = getMachineZone(machineId);
        return zone === MACHINE_ZONE_NORMAL || zone === MACHINE_ZONE_SEVERE;
      }),
    },
    ...MACHINE_ZONE_INFECTION_FLAGS.map((flag) => ({
      label: `${flag}区`,
      sessions: sessions.filter((session) => normalizeInfectionFlag(session.patient.infectionFlag) === flag),
      machines: getAvailableMachineIds().filter((machineId) => [MACHINE_ZONE_INFECTION, flag].includes(getMachineZone(machineId))),
    })),
  ];
}

function buildSessionMachineAssignments(sessions, existingAssignments = new Map()) {
  const groups = new Map();
  sessions.forEach((session) => {
    const key = getPatientMachineAssignmentKey(session.patient.id, session.treatmentType);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        patient: session.patient,
        treatmentType: session.treatmentType,
        days: [],
      });
    }
    groups.get(key).days.push(session.originalDay);
  });

  const dayLoads = new Map();
  const totalLoads = new Map();
  getAvailableMachineIds().forEach((machineId) => {
    dayLoads.set(machineId, new Map(WORKING_DAY_KEYS.map((dayKey) => [dayKey, 0])));
    totalLoads.set(machineId, 0);
  });

  const result = new Map();
  const orderedGroups = [...groups.values()].sort((left, right) => {
    const leftFixed = Number(
      normalizeMachineType(left.treatmentType) === normalizeMachineType(left.patient.treatmentType) &&
      Boolean(left.patient.fixedMachineId),
    );
    const rightFixed = Number(
      normalizeMachineType(right.treatmentType) === normalizeMachineType(right.patient.treatmentType) &&
      Boolean(right.patient.fixedMachineId),
    );
    return rightFixed - leftFixed ||
      Number(isInfectiousPatient(right.patient)) - Number(isInfectiousPatient(left.patient)) ||
      right.days.length - left.days.length ||
      sortAutoPatients(left.patient, right.patient);
  });

  const reserve = (machineId, group) => {
    result.set(group.key, machineId);
    totalLoads.set(machineId, (totalLoads.get(machineId) || 0) + group.days.length);
    const loads = dayLoads.get(machineId);
    group.days.forEach((dayKey) => loads.set(dayKey, (loads.get(dayKey) || 0) + 1));
  };

  orderedGroups.forEach((group) => {
    const compatible = getAvailableMachineIds()
      .filter((machineId) => !isMachinePaused(machineId))
      .filter((machineId) => patientFitsMachineForTreatment(group.patient, group.treatmentType, machineId));
    if (!compatible.length) return;

    const preferred = existingAssignments.get(group.key);
    const fixed =
      normalizeMachineType(group.treatmentType) === normalizeMachineType(group.patient.treatmentType) &&
      group.patient.fixedMachineId &&
      compatible.includes(group.patient.fixedMachineId)
        ? group.patient.fixedMachineId
        : "";
    const candidates = [...new Set([fixed, preferred, ...compatible].filter(Boolean))];
    const scored = candidates.map((machineId) => {
      const loads = dayLoads.get(machineId);
      const dayOverflow = group.days.reduce(
        (total, dayKey) => total + Math.max(0, (loads.get(dayKey) || 0) + 1 - STAFF_SHIFT_KEYS.length),
        0,
      );
      const totalOverflow = Math.max(
        0,
        (totalLoads.get(machineId) || 0) + group.days.length - WORKING_DAY_KEYS.length * STAFF_SHIFT_KEYS.length,
      );
      const dayLoadScore = group.days.reduce((total, dayKey) => total + (loads.get(dayKey) || 0), 0);
      return {
        machineId,
        fixedPenalty: fixed && machineId !== fixed ? 1 : 0,
        preferredPenalty: preferred && machineId !== preferred ? 1 : 0,
        overflow: dayOverflow * 100 + totalOverflow * 1000,
        dayLoadScore,
        totalLoad: totalLoads.get(machineId) || 0,
      };
    }).sort((left, right) =>
      left.fixedPenalty - right.fixedPenalty ||
      left.preferredPenalty - right.preferredPenalty ||
      left.overflow - right.overflow ||
      left.dayLoadScore - right.dayLoadScore ||
      left.totalLoad - right.totalLoad ||
      sortMachineIds(left.machineId, right.machineId),
    );
    if (scored.length) reserve(scored[0].machineId, group);
  });

  return result;
}

function getPatientMachineAssignmentKey(patientId, treatmentType) {
  return `${String(patientId)}:${normalizeMachineType(treatmentType)}`;
}

function assignWeeklyPatientSession(session, schedules, machines, specialMachines, regularMachines, assignedDaysByPatient, assignedMachineByPatient, priority = SCHEDULE_PRIORITY_PATIENT, fastMachineSelection = false) {
  const patient = session.patient;
  const eligiblePool = getEligibleMachinePoolForTreatment(patient, session.treatmentType, specialMachines, regularMachines)
    .filter((machineId) => !isMachinePaused(machineId));
  const assignmentKey = getPatientMachineAssignmentKey(patient.id, session.treatmentType);
  const preferredMachineId = assignedMachineByPatient.get(assignmentKey) || "";
  const fixedMachineAvailable =
    normalizeMachineType(session.treatmentType) === normalizeMachineType(patient.treatmentType) &&
    patient.fixedMachineId &&
    !isMachinePaused(patient.fixedMachineId) &&
    eligiblePool.includes(patient.fixedMachineId);
  const fixedMachineId = fixedMachineAvailable ? patient.fixedMachineId : "";

  if (!eligiblePool.length) {
    return null;
  }

  const alreadyAssignedDays = assignedDaysByPatient.get(patient.id) || new Set();
  const primaryDays =
    WORKING_DAY_KEYS.includes(session.originalDay) && !alreadyAssignedDays.has(session.originalDay)
      ? [session.originalDay]
      : [];
  const fallbackDays = session.lockedDay ? [] : (isCompactResourcePriority(priority)
    ? getWorkingDaysForStaffPriority(schedules, machines)
    : getWorkingDaysByCurrentLoad(schedules, machines))
    .filter((dayKey) => !primaryDays.includes(dayKey) && !alreadyAssignedDays.has(dayKey));
  const dayChoices = [...primaryDays, ...fallbackDays];

  const shiftChoicesForDay = (dayKey, relaxed = false) => {
    if (relaxed || !patient.preferredShift) {
      return isCompactResourcePriority(priority)
        ? getShiftsForStaffPriority(schedules[dayKey], machines)
        : getShiftsByCurrentLoad(schedules[dayKey], machines);
    }
    return [patient.preferredShift, ...STAFF_SHIFT_KEYS.filter((shift) => shift !== patient.preferredShift)];
  };

  const buildPoolAttempts = () => {
    const attempts = [];

    // 第1层：原规则。固定机位或前一周推荐机位优先。
    if (fixedMachineId) {
      attempts.push({
        label: "固定机位",
        pool: [fixedMachineId],
        relaxed: false,
      });
    } else if (preferredMachineId && eligiblePool.includes(preferredMachineId)) {
      attempts.push({
        label: "推荐机位",
        pool: [preferredMachineId, ...eligiblePool.filter((machineId) => machineId !== preferredMachineId)],
        relaxed: false,
      });
    } else {
      attempts.push({
        label: "常规机位",
        pool: [...eligiblePool],
        relaxed: false,
      });
    }

    // 第2层：如果固定/推荐机位导致个别患者卡住，放宽到全部兼容机位。
    // 这一步只在本次自动排班中临时换机，不会自动覆盖患者资料中的长期固定机位。
    const fullPool = [...eligiblePool];
    const firstPool = attempts[0]?.pool || [];
    const samePool = firstPool.length === fullPool.length &&
      firstPool.every((machineId, index) => String(machineId) === String(fullPool[index]));
    if (!samePool) {
      attempts.push({
        label: "全部兼容机位",
        pool: fullPool,
        relaxed: true,
      });
    }

    // 第3层：最后按机器当前负载重新排序，减少“先到先占”导致的局部死锁。
    attempts.push({
      label: "低负载兼容机位",
      pool: fullPool.sort((left, right) => getMachineWeeklyLoad(schedules, left) - getMachineWeeklyLoad(schedules, right) || sortMachineIds(left, right)),
      relaxed: true,
    });

    return attempts;
  };

  for (const attempt of buildPoolAttempts()) {
    for (const dayKey of dayChoices) {
      const shiftChoices = shiftChoicesForDay(dayKey, attempt.relaxed);
      for (const shift of shiftChoices) {
        const machineId = findBestMachineForPatient(patient, attempt.pool, shift, schedules[dayKey], priority, fastMachineSelection, session.treatmentType);
        if (machineId) {
          const notes = [];
          if (dayKey !== session.requestedDay) {
            notes.push(`原倾向日期：${getWeekDayLabel(session.requestedDay)}`);
          }
          if (patient.preferredShift && shift !== patient.preferredShift) {
            notes.push(`原倾向：${SHIFT_LABELS[patient.preferredShift]}`);
          }
          if (patient.fixedMachineId && isMachinePaused(patient.fixedMachineId)) {
            notes.push(`固定${patient.fixedMachineId}号机暂停`);
          }
          if (attempt.relaxed && patient.fixedMachineId && String(machineId) !== String(patient.fixedMachineId)) {
            notes.push(`固定机位已临时调整`);
          }
          if (attempt.relaxed && preferredMachineId && String(machineId) !== String(preferredMachineId)) {
            notes.push(`为完成排班临时换机`);
          }
          if (
            !assignedMachineByPatient.get(assignmentKey) ||
            (!fixedMachineId && attempt.relaxed && preferredMachineId && String(machineId) !== String(preferredMachineId))
          ) {
            assignedMachineByPatient.set(assignmentKey, machineId);
          }
          setScheduleSlot({ weekly: schedules[dayKey] }, "weekly", machineId, shift, {
            patientId: patient.id,
            treatmentType: session.treatmentType,
            note: notes.join("；"),
            updatedAt: new Date().toISOString(),
          });
          return { day: dayKey, shift, machineId, relaxed: attempt.relaxed, attempt: attempt.label };
        }
      }
    }
  }

  return null;
}

function getMachineWeeklyLoad(schedules, machineId) {
  return WORKING_DAY_KEYS.reduce((sum, dayKey) => {
    const day = schedules?.[dayKey] || {};
    const machine = day?.[machineId] || {};
    return sum + STAFF_SHIFT_KEYS.filter((shift) => machine?.[shift]?.patientId).length;
  }, 0);
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

async function copyPreviousDay() {
  const current = new Date(`${getCurrentDate()}T00:00:00`);
  current.setDate(current.getDate() - 1);
  const previousDate = formatDateInput(current);
  const previous = getEffectiveScheduleForDate(previousDate);
  const previousStaff = getEffectiveStaffScheduleForDate(previousDate);

  if ((!previous || !Object.keys(previous).length) && !isStaffScheduleFilled(previousStaff)) {
    showToast(getDynamicMessage("noPreviousDaySchedule"));
    return;
  }
  const hasCurrentData = state.schedules[getCurrentDate()] || isStaffScheduleFilled(state.staffSchedules?.[getCurrentDate()]);
  if (hasCurrentData && !window.confirm(getDynamicMessage("copyOverwritesCurrentDateConfirm"))) {
    return;
  }

  showTaskProgress("正在复制前一天排班", "创建撤销快照", 12);
  await waitForBrowserPaint();
  captureUndoSnapshot("复制前一天排班");
  await stepTaskProgress(42, "复制患者机位安排");
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
  await stepTaskProgress(78, "刷新排班台");
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  await closeTaskProgress("前一天排班已复制");
  showToast(getDynamicMessage("previousDayCopied"));
}

async function clearCurrentDay() {
  const date = getCurrentDate();
  const effectiveSchedule = getEffectiveScheduleForDate(date);
  const hasMachineSchedule = Object.keys(effectiveSchedule).length;
  const hasStaffSchedule = isStaffScheduleFilled(state.staffSchedules?.[date]);
  if (!hasMachineSchedule && !hasStaffSchedule) {
    showToast(getDynamicMessage("noScheduleToday"));
    return;
  }

  if (!window.confirm(getDynamicMessage("clearDateScheduleConfirm", { date: formatDateLabel(date) }))) {
    return;
  }

  showTaskProgress("正在清空当天排班", "创建撤销快照", 12);
  await waitForBrowserPaint();
  captureUndoSnapshot(`清空${formatDateLabel(date)}排班`);
  await stepTaskProgress(45, "清空患者和医护排班");
  if (hasMachineSchedule) {
    state.schedules[date] = createRemovedOverrideDay(effectiveSchedule);
  } else {
    delete state.schedules[date];
  }
  if (state.staffSchedules) {
    delete state.staffSchedules[date];
  }
  saveState();
  await stepTaskProgress(78, "刷新当天排班界面");
  renderWeekNavigation();
  renderStaffSchedule();
  renderSchedule();
  renderSummary();
  await closeTaskProgress("当天排班已清空");
  showToast(getDynamicMessage("dayScheduleCleared"));
}

async function exportData() {
  showTaskProgress("正在导出数据", "整理患者、排班、医护和布局资料", 15);
  await waitForBrowserPaint();
  try {
    pruneEmptyStaffSchedules();
    await stepTaskProgress(55, "生成 JSON 备份文件");
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `血透室排班数据-${getCurrentDate()}.json`;
    document.body.appendChild(link);
    await stepTaskProgress(82, "准备下载");
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    await closeTaskProgress("数据导出完成");
  } catch (error) {
    console.error("Export data failed", error);
    await closeTaskProgress("导出数据失败", 0);
    window.alert(`导出数据失败：${error?.message || error}`);
  }
}

function isSchedulerDataObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return ["settings", "patients", "staffMembers", "weeklySchedules", "schedules", "weeklyStaffSchedules", "staffSchedules"]
    .some((key) => Object.prototype.hasOwnProperty.call(value, key));
}

function importData(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    showTaskProgress("正在导入数据", "读取 JSON 文件", 10);
    await waitForBrowserPaint();
    try {
      await stepTaskProgress(28, "解析文件内容");
      const parsed = JSON.parse(reader.result);
      if (!isSchedulerDataObject(parsed)) {
        throw new Error("Not a scheduler data export");
      }
      await stepTaskProgress(48, "规范化患者、医护和排班数据");
      const imported = normalizeState(parsed);
      await stepTaskProgress(68, "执行导入安全检查");
      const audit = validateImportedStateSafety(imported);
      if (audit.errors.length) {
        await closeTaskProgress("导入已阻止", 0);
        window.alert(`导入已阻止：检测到可能影响排班安全的数据错误。\n\n${audit.errors.slice(0, 24).map((item) => `- ${item}`).join("\n")}${audit.errors.length > 24 ? `\n- 其余 ${audit.errors.length - 24} 项未显示` : ""}`);
        return;
      }
      const warningText = audit.warnings.length
        ? `\n\n需要人工复核：\n${audit.warnings.slice(0, 16).map((item) => `- ${item}`).join("\n")}`
        : "";
      if (!window.confirm(`导入会替换当前本地数据，继续吗？${warningText}`)) {
        await closeTaskProgress("已取消导入", 0);
        return;
      }
      await stepTaskProgress(82, "写入本地数据");
      captureUndoSnapshot("导入数据");
      state.settings = imported.settings;
      state.patients = imported.patients;
      state.staffMembers = imported.staffMembers;
      state.weeklySchedules = imported.weeklySchedules;
      state.schedules = imported.schedules;
      state.weeklyStaffSchedules = imported.weeklyStaffSchedules;
      state.staffSchedules = imported.staffSchedules;
      saveState();
      await stepTaskProgress(92, "刷新界面");
      renderAll();
      await closeTaskProgress("数据导入完成");
      showToast(getDynamicMessage("dataImported"));
    } catch (error) {
      console.error(error);
      await closeTaskProgress("导入失败", 0);
      showToast(getDynamicMessage("importFileUnrecognized"));
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

async function resetAllData() {
  const message = "确定全部重置吗？这会清空本地保存的患者资料、患者排班、医护排班、机器类型和特殊区机器设置。";
  if (!window.confirm(message)) {
    return;
  }

  showTaskProgress("正在全部重置", "创建撤销快照", 10);
  await waitForBrowserPaint();
  captureUndoSnapshot("全部重置");
  await stepTaskProgress(38, "恢复默认资料和布局");
  const fresh = structuredClone(DEFAULT_STATE);
  state.settings = fresh.settings;
  state.patients = fresh.patients;
  state.staffMembers = fresh.staffMembers;
  state.weeklySchedules = fresh.weeklySchedules;
  state.schedules = fresh.schedules;
  state.weeklyStaffSchedules = fresh.weeklyStaffSchedules;
  state.staffSchedules = fresh.staffSchedules;
  localStorage.removeItem(STORAGE_KEY);
  await stepTaskProgress(72, "清空界面状态");
  ui.scheduleDate.value = formatDateInput(new Date());
  ui.patientSearch.value = "";
  ui.staffSearch.value = "";
  ui.staffScheduleScope.value = "weekly";
  resetPatientForm();
  resetStaffForm();
  renderAll();
  ui.storageStatus.textContent = "已全部重置，本地数据已清空";
  await closeTaskProgress("全部重置完成");
  showToast(getDynamicMessage("allReset"));
}

async function clearAllAppCache() {
  const language = !isChineseLanguage() ? "en" : "zh";
  const message = language === "en"
    ? "Clear this app's saved data and refresh its page cache? Patient, schedule, staff, layout, and app-specific browser storage will be removed. Storage belonging to other apps on the same site will not be intentionally deleted. Export a JSON backup first if needed."
    : "确定清空本程序的全部数据与页面缓存吗？患者、排班、医护、布局设置以及本程序专用的浏览器存储都会被删除；不会主动删除同一网站其他程序的数据。需要保留资料时，请先导出 JSON 备份。";
  if (!window.confirm(message)) {
    return;
  }

  const button = ui.clearAllCache;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = language === "en" ? "Clearing…" : "正在清空…";
  showTaskProgress("正在清空缓存", "清除本地排班数据", 8);
  await waitForBrowserPaint();

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(UNDO_STORAGE_KEY);
    removeAppSessionStorage();

    if (typeof caches !== "undefined" && caches?.keys) {
      await stepTaskProgress(30, "清理浏览器缓存文件");
      const cacheKeys = await caches.keys();
      const appCacheKeys = cacheKeys.filter(isAppOwnedStorageName);
      await Promise.all(appCacheKeys.map((key) => caches.delete(key)));
    }

    if (typeof indexedDB !== "undefined" && typeof indexedDB.databases === "function") {
      await stepTaskProgress(58, "清理浏览器数据库");
      const databases = await indexedDB.databases();
      const appDatabaseNames = databases
        .map((database) => database?.name)
        .filter((name) => name && isAppOwnedStorageName(name));
      await Promise.all(
        appDatabaseNames.map((name) => new Promise((resolve) => {
          const request = indexedDB.deleteDatabase(name);
          request.onsuccess = request.onerror = request.onblocked = () => resolve();
        })),
      );
    }

    if (navigator.serviceWorker?.getRegistrations) {
      await stepTaskProgress(78, "注销本程序缓存服务");
      const registrations = await navigator.serviceWorker.getRegistrations();
      const appBaseUrl = new URL(".", window.location.href).href;
      const appRegistrations = registrations.filter((registration) => {
        const scope = String(registration.scope || "");
        const scriptUrl = String(registration.active?.scriptURL || registration.waiting?.scriptURL || registration.installing?.scriptURL || "");
        return scope.startsWith(appBaseUrl) || scriptUrl.startsWith(appBaseUrl);
      });
      await Promise.all(appRegistrations.map((registration) => registration.unregister()));
    }

    await stepTaskProgress(92, "重新载入最新版页面");
    const url = new URL(window.location.href);
    url.searchParams.set("cacheReset", Date.now().toString());
    window.location.replace(url.toString());
  } catch (error) {
    console.error("Failed to clear app cache", error);
    await closeTaskProgress("清空缓存失败", 0);
    const fresh = structuredClone(DEFAULT_STATE);
    state.settings = fresh.settings;
    state.patients = fresh.patients;
    state.staffMembers = fresh.staffMembers;
    state.weeklySchedules = fresh.weeklySchedules;
    state.schedules = fresh.schedules;
    state.weeklyStaffSchedules = fresh.weeklyStaffSchedules;
    state.staffSchedules = fresh.staffSchedules;
    renderAll();
    showToast(language === "en" ? "App data was cleared, but automatic reload failed." : "本程序数据已清空，但自动刷新失败，请手动重新打开页面");
    button.disabled = false;
    button.textContent = originalText;
  }
}

function isAppOwnedStorageName(name) {
  const normalized = String(name || "").toLowerCase();
  return normalized.includes("hemodialysis") || normalized.includes("hd-scheduler") || normalized.includes(STORAGE_KEY.toLowerCase());
}

function removeAppSessionStorage() {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  const keys = [];
  for (let index = 0; index < sessionStorage.length; index += 1) {
    const key = sessionStorage.key(index);
    if (key && (key === STORAGE_KEY || key.startsWith(`${STORAGE_KEY}:`))) {
      keys.push(key);
    }
  }
  keys.forEach((key) => sessionStorage.removeItem(key));
  sessionStorage.removeItem?.(STORAGE_KEY);
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

function getPausedMachineIds(settings = state.settings) {
  return normalizeMachineIdList(settings.pausedMachines, new Set(getMachineIds(settings))).sort(sortMachineIds);
}

function isMachinePaused(machineId, settings = state.settings) {
  return getPausedMachineIds(settings).includes(String(machineId));
}

function getAvailableMachineIds(settings = state.settings) {
  const paused = new Set(getPausedMachineIds(settings));
  return getMachineIds(settings).filter((machineId) => !paused.has(machineId));
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

function getMachineType(machineId, settings = state.settings) {
  return normalizeMachineType(settings.machineTypes?.[machineId]);
}

function getMachineTypeLabel(machineId, settings = state.settings) {
  return MACHINE_TYPE_LABELS[getMachineType(machineId, settings)] || MACHINE_TYPE_LABELS[DEFAULT_MACHINE_TYPE];
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

function machineSupportsTreatment(machineId, treatmentType, settings = state.settings) {
  return getMachineType(machineId, settings) === normalizeMachineType(treatmentType);
}

function patientFitsMachineSettings(patient, machineType, machineZone, treatmentType = patient?.treatmentType) {
  if (!patient) return false;
  const requiredType = normalizeMachineType(treatmentType || patient.treatmentType);
  const type = normalizeMachineType(machineType);
  if (type !== requiredType) {
    return false;
  }

  const zone = normalizeMachineZone(machineZone);
  const infection = normalizeInfectionFlag(patient.infectionFlag);
  if (infection) {
    return zone === MACHINE_ZONE_INFECTION || zone === infection;
  }
  return zone === MACHINE_ZONE_NORMAL || zone === MACHINE_ZONE_SEVERE;
}

function patientFitsMachine(patient, machineId, settings = state.settings) {
  return patientFitsMachineForTreatment(patient, patient?.treatmentType, machineId, settings);
}

function patientFitsMachineForTreatment(patient, treatmentType, machineId, settings = state.settings) {
  const id = String(machineId || "");
  return Boolean(
    id &&
    getMachineIds(settings).includes(id) &&
    patientFitsMachineSettings(
      patient,
      getMachineType(id, settings),
      getMachineZone(id, settings),
      treatmentType,
    )
  );
}

function getMachineZonePreferenceScore(patient, machineId, settings = state.settings) {
  const zone = getMachineZone(machineId, settings);
  const infection = normalizeInfectionFlag(patient?.infectionFlag);
  if (infection) {
    if (zone === infection) return 0;
    if (zone === MACHINE_ZONE_INFECTION) return 1;
    return 20;
  }
  if (isSeverePatient(patient)) {
    return zone === MACHINE_ZONE_SEVERE ? 0 : 2;
  }
  return zone === MACHINE_ZONE_NORMAL ? 0 : 1;
}

function getEligibleMachinePoolForTreatment(patient, treatmentType, specialMachines = getSpecialMachines(), regularMachines = getAvailableMachineIds()) {
  const available = new Set(getAvailableMachineIds());
  const infection = normalizeInfectionFlag(patient?.infectionFlag);
  const base = infection
    ? [...specialMachines, ...getAvailableMachineIds().filter((machineId) => isInfectionMachineZone(getMachineZone(machineId)))]
    : [
        ...regularMachines,
        ...getSevereMachines(),
        ...getAvailableMachineIds().filter((machineId) => {
          const zone = getMachineZone(machineId);
          return zone === MACHINE_ZONE_NORMAL || zone === MACHINE_ZONE_SEVERE;
        }),
      ];

  return [...new Set(base.map(String))]
    .filter((machineId) => available.has(machineId))
    .filter((machineId) => patientFitsMachineForTreatment(patient, treatmentType, machineId))
    .sort((left, right) =>
      getMachineZonePreferenceScore(patient, left) - getMachineZonePreferenceScore(patient, right) ||
      sortMachineIds(left, right),
    );
}

function findBestMachineForPatient(patient, machinePool, shift, daySchedule = {}, priority = state.settings.schedulePriority, fastMachineSelection = false, treatmentType = patient?.treatmentType) {
  const schedule = getScheduleDay(daySchedule);
  const resolvedTreatmentType = normalizeMachineType(treatmentType || patient?.treatmentType);
  const candidates = [...new Set((machinePool || []).map(String))]
    .filter((machineId) => !schedule?.[machineId]?.[shift]?.patientId)
    .filter((machineId) => !isMachinePaused(machineId))
    .filter((machineId) => patientFitsMachineForTreatment(patient, resolvedTreatmentType, machineId))
    .filter((machineId) => !isPatientAlreadyAssignedInDay(patient.id, schedule))
    .filter((machineId) => fastMachineSelection || candidateKeepsNurseGroupsValid(machineId, shift, schedule, patient, resolvedTreatmentType));

  if (!candidates.length) {
    return "";
  }

  const compactPriority = isCompactResourcePriority(priority);
  return candidates
    .map((machineId) => ({
      machineId,
      zonePreference: getMachineZonePreferenceScore(patient, machineId),
      machineLoad: STAFF_SHIFT_KEYS.filter((key) => schedule?.[machineId]?.[key]?.patientId).length,
      shiftLoad: countAssigned(schedule, getMachineIds(), shift),
      weeklyOrder: getNurseMachinePathIndex(machineId),
    }))
    .sort((left, right) =>
      left.zonePreference - right.zonePreference ||
      (compactPriority ? right.machineLoad - left.machineLoad : left.machineLoad - right.machineLoad) ||
      left.shiftLoad - right.shiftLoad ||
      left.weeklyOrder - right.weeklyOrder ||
      sortMachineIds(left.machineId, right.machineId),
    )[0].machineId;
}

function isPatientAlreadyAssignedInDay(patientId, daySchedule = {}) {
  if (!patientId) return false;
  return Object.values(daySchedule || {}).some((machine) =>
    STAFF_SHIFT_KEYS.some((shift) => machine?.[shift]?.patientId === patientId),
  );
}

function candidateKeepsNurseGroupsValid(machineId, shift, daySchedule, patient, treatmentType) {
  const simulated = structuredClone(daySchedule || {});
  if (!simulated[machineId]) simulated[machineId] = {};
  simulated[machineId][shift] = {
    patientId: patient.id,
    treatmentType: normalizeMachineType(treatmentType),
    updatedAt: new Date().toISOString(),
  };
  return getNurseGroupsForShift(simulated, shift, state.settings)
    .filter((group) => group && !group.empty)
    .every((group) =>
      group.patientCount <= group.capacity &&
      group.hemofiltrationMachineCount <= MAX_HEMOFILTRATION_MACHINES_PER_NURSE,
    );
}

async function setMachineType(machineId, type) {
  const validMachines = new Set(getMachineIds());
  if (!validMachines.has(machineId)) {
    showToast(getDynamicMessage("machineNotInLayout"));
    return;
  }

  const machineType = normalizeMachineType(type);
  showTaskProgress("正在修改机器类型", "检查现有排班是否兼容", 12);
  await waitForBrowserPaint();
  try {
    const issues = getAssignmentCompatibilityIssues(machineId, machineType, getMachineZone(machineId));
    if (issues.length) {
      await closeTaskProgress("机器类型暂不能修改", 0);
      window.alert(`不能修改 ${machineId} 的机器类型。以下现有排班会不匹配，请先移动或清空：\n\n${issues.slice(0, 12).map((item) => `- ${item}`).join("\n")}`);
      return;
    }

    await stepTaskProgress(46, "写入机器类型");
    const machineTypes = { ...(state.settings.machineTypes || {}) };
    if (machineType === DEFAULT_MACHINE_TYPE) {
      delete machineTypes[machineId];
    } else {
      machineTypes[machineId] = machineType;
    }
    state.settings.machineTypes = normalizeMachineTypeMap(machineTypes, validMachines);
    saveState();
    await stepTaskProgress(80, "刷新统计、医护和排班台");
    renderSummary();
    renderStaffSchedule();
    renderSchedule();
    renderLayoutPreviewFromForm();
    await closeTaskProgress("机器类型已修改");
    showToast(`${machineId} 已设为${MACHINE_TYPE_LABELS[machineType]}`);
  } catch (error) {
    console.error("修改机器类型失败", error);
    await closeTaskProgress("修改机器类型失败", 0);
    window.alert(`修改机器类型失败：${error?.message || error}`);
  }
}

async function setMachineZone(machineId, zone) {
  const validMachines = new Set(getMachineIds());
  if (!validMachines.has(machineId)) {
    showToast(getDynamicMessage("machineNotInLayout"));
    return;
  }

  const machineZone = normalizeMachineZone(zone);
  showTaskProgress("正在修改机器分区", "检查现有排班是否兼容", 12);
  await waitForBrowserPaint();
  try {
    const issues = getAssignmentCompatibilityIssues(machineId, getMachineType(machineId), machineZone);
    if (issues.length) {
      await closeTaskProgress("机器分区暂不能修改", 0);
      window.alert(`不能修改 ${machineId} 的机器分区。以下现有排班会不匹配，请先移动或清空：\n\n${issues.slice(0, 12).map((item) => `- ${item}`).join("\n")}`);
      return;
    }

    await stepTaskProgress(46, "写入机器分区");
    const machineZones = { ...(state.settings.machineZones || {}) };
    if (machineZone === MACHINE_ZONE_NORMAL) {
      delete machineZones[machineId];
    } else {
      machineZones[machineId] = machineZone;
    }
    state.settings.machineZones = normalizeMachineZoneMap(machineZones, validMachines);
    state.settings.specialMachines = getInfectionMachineIds(state.settings);
    saveState();
    await stepTaskProgress(80, "刷新统计、医护和排班台");
    renderSummary();
    renderStaffSchedule();
    renderSchedule();
    renderLayoutPreviewFromForm();
    await closeTaskProgress("机器分区已修改");
    showToast(`${machineId} 已设为${getMachineZoneLabel(machineId)}`);
  } catch (error) {
    console.error("修改机器分区失败", error);
    await closeTaskProgress("修改机器分区失败", 0);
    window.alert(`修改机器分区失败：${error?.message || error}`);
  }
}

async function togglePausedMachine(machineId) {
  const validMachines = new Set(getMachineIds());
  if (!validMachines.has(machineId)) {
    showToast(getDynamicMessage("machineNotInLayout"));
    return;
  }
  const paused = new Set(getPausedMachineIds());
  const willPause = !paused.has(machineId);
  if (willPause) {
    const assignedCount = countAssignmentsForMachine(machineId);
    const fixedPatients = state.patients.filter((patient) => patient.fixedMachineId === machineId && patient.status === "active");
    const details = [
      `确定暂停 ${machineId} 号机吗？`,
      "机器编号、分区和长期固定关系都会保留。自动排班会临时绕开该机器；恢复后重新生成即可回到原固定机位。",
      assignedCount ? `当前已有 ${assignedCount} 条排班需要重新生成或人工调整。` : "当前没有患者排在该机器上。",
      fixedPatients.length ? `长期固定患者：${fixedPatients.map((patient) => patient.name).join("、")}` : "",
    ].filter(Boolean);
    if (!window.confirm(details.join("\n\n"))) {
      return;
    }
    paused.add(machineId);
  } else {
    paused.delete(machineId);
  }
  showTaskProgress(willPause ? "正在暂停机器" : "正在恢复机器", "写入机器状态", 16);
  await waitForBrowserPaint();
  try {
    state.settings.pausedMachines = normalizeMachineIdList([...paused], validMachines);
    saveState();
    await stepTaskProgress(74, "刷新统计、排班台和固定机位选项");
    renderSummary();
    renderStaffSchedule();
    renderSchedule();
    renderPatientFixedMachineOptions(ui.patientFixedMachine?.value || "");
    renderLayoutPreviewFromForm();
    await closeTaskProgress(willPause ? "机器已暂停" : "机器已恢复");
    showToast(willPause ? `${machineId} 号机已暂停` : `${machineId} 号机已恢复`);
  } catch (error) {
    console.error("修改机器暂停状态失败", error);
    await closeTaskProgress("修改机器状态失败", 0);
    window.alert(`修改机器状态失败：${error?.message || error}`);
  }
}

function countAssignmentsForMachine(machineId) {
  return [...Object.values(state.weeklySchedules || {}), ...Object.values(state.schedules || {})].reduce((count, daySchedule) => {
    const item = daySchedule?.[machineId];
    return count + STAFF_SHIFT_KEYS.filter((shift) => item?.[shift]?.patientId).length;
  }, 0);
}

async function toggleInactiveSlot(slotKey) {
  const validSlots = new Set(getAllSlotKeys());
  if (!validSlots.has(slotKey)) {
    showToast(getDynamicMessage("slotNotInLayout"));
    return;
  }
  if (hasAnyMachineAssignments() || hasFixedMachineAssignments()) {
    window.alert("已有患者排班或长期固定机位时不能删除或恢复机位。机位变化会让机器重新编号，请先清空相关排班并解除固定机位后再调整。");
    return;
  }

  const inactiveSlots = new Set(normalizeInactiveSlots(state.settings.inactiveSlots, state.settings));
  const isRemoving = !inactiveSlots.has(slotKey);
  if (isRemoving && getMachineIds().length <= 1) {
    showToast(getDynamicMessage("keepAtLeastOneMachine"));
    return;
  }

  showTaskProgress(isRemoving ? "正在删除机位" : "正在恢复机位", "保存原有机器属性", 14);
  await waitForBrowserPaint();
  try {
    const oldAttributes = getMachineAttributesBySlot(getMachineSlots());
    if (isRemoving) {
      inactiveSlots.add(slotKey);
    } else {
      inactiveSlots.delete(slotKey);
    }

    await stepTaskProgress(46, "重新计算机器编号和分区");
    const nextSettings = {
      ...state.settings,
      inactiveSlots: normalizeInactiveSlots([...inactiveSlots], state.settings),
    };
    const nextSlots = getMachineSlots(nextSettings);
    state.settings.inactiveSlots = nextSettings.inactiveSlots;
    applyMachineAttributesBySlot(oldAttributes, nextSlots);
    saveState();
    await stepTaskProgress(80, "刷新统计、医护和排班台");
    renderSummary();
    renderStaffSchedule();
    renderSchedule();
    renderLayoutPreviewFromForm();
    await closeTaskProgress(isRemoving ? "机位已删除" : "机位已恢复");
    showToast(isRemoving ? "机位已删除，机器已重新编号" : "机位已恢复，机器已重新编号");
  } catch (error) {
    console.error("修改机位失败", error);
    await closeTaskProgress("修改机位失败", 0);
    window.alert(`修改机位失败：${error?.message || error}`);
  }
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
          paused: isMachinePaused(slot.machineId),
        },
      ]),
  );
}

function applyMachineAttributesBySlot(attributes, nextSlots) {
  const machineTypes = {};
  const machineZones = {};
  const specialMachines = [];
  const pausedMachines = [];
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
    if (attribute?.paused) {
      pausedMachines.push(slot.machineId);
    }
  });
  const validMachines = new Set(nextSlots.filter((slot) => slot.active).map((slot) => slot.machineId));
  state.settings.machineTypes = normalizeMachineTypeMap(machineTypes, validMachines);
  state.settings.machineZones = normalizeMachineZoneMap(machineZones, validMachines);
  state.settings.specialMachines = normalizeMachineIdList(specialMachines, validMachines);
  state.settings.pausedMachines = normalizeMachineIdList(pausedMachines, validMachines);
}

function toggleSpecialMachine(machineId) {
  const validMachines = new Set(getMachineIds());
  if (!validMachines.has(machineId)) {
    showToast(getDynamicMessage("machineNotInLayout"));
    return;
  }
  setMachineZone(machineId, isSpecialMachine(machineId) ? MACHINE_ZONE_NORMAL : MACHINE_ZONE_INFECTION);
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
  const machinesByZone = new Map();

  [...getMachineIds(settings)].sort(sortMachineIds).forEach((machineId) => {
    const assignment = schedule[machineId]?.[shift];
    const patient = assignment?.patientId ? findPatient(assignment.patientId) : null;
    if (!patient) {
      return;
    }

    const zoneKey = getNurseZoneKey(machineId, settings);
    if (!machinesByZone.has(zoneKey)) {
      machinesByZone.set(zoneKey, []);
    }
    machinesByZone.get(zoneKey).push(machineId);
  });

  const positionMap = getMachinePositionMap(settings);
  const groups = [...machinesByZone.entries()]
    .flatMap(([zoneKey, machineIds]) => {
      const capacity = zoneKey === MACHINE_ZONE_SEVERE ? SEVERE_PATIENT_NURSE_CAPACITY : MACHINES_PER_NURSE;
      return buildNurseGroupsForMachines(machineIds, capacity, zoneKey, settings);
    })
    .sort((left, right) => getNurseGroupPosition(left, positionMap, settings) - getNurseGroupPosition(right, positionMap, settings));

  return groups.length ? groups.map((group, index) => ({ ...group, index })) : [createEmptyNurseGroup(0)];
}

function getNurseZoneKey(machineId, settings = state.settings) {
  const zone = getMachineZone(machineId, settings);
  if (zone === MACHINE_ZONE_NORMAL || zone === MACHINE_ZONE_SEVERE || zone === MACHINE_ZONE_INFECTION) {
    return zone;
  }
  return MACHINE_ZONE_INFECTION_FLAGS.includes(zone) ? MACHINE_ZONE_INFECTION : MACHINE_ZONE_NORMAL;
}

function getNurseZoneLabel(zoneKey, settings = state.settings) {
  if (zoneKey === MACHINE_ZONE_NORMAL) {
    return "普通区";
  }
  if (zoneKey === MACHINE_ZONE_SEVERE) {
    return "重病区";
  }
  if (zoneKey === MACHINE_ZONE_INFECTION) {
    return settings.specialZoneName || "传染区";
  }
  return MACHINE_ZONE_INFECTION_FLAGS.includes(zoneKey) ? (settings.specialZoneName || "传染区") : "普通区";
}

function buildNurseGroupsForMachines(machineIds, capacity, zoneKey, settings = state.settings) {
  const assignedMachines = [...new Set(machineIds.map(String))].filter(Boolean);
  if (!assignedMachines.length) {
    return [];
  }

  const assignedSet = new Set(assignedMachines);
  const positionMap = getMachinePositionMap(settings);
  const components = getNurseCareComponents(settings, zoneKey);
  const groups = [];

  components.forEach((component) => {
    const componentMachines = component.filter((machineId) => assignedSet.has(machineId));
    if (!componentMachines.length) {
      return;
    }
    componentMachines.forEach((machineId) => assignedSet.delete(machineId));
    // 二次防护：即使旧数据或异常布局把不同排机位放入同一组件，
    // 也必须先按物理排拆开，再分别进行护士分组。
    const machinesByRow = new Map();
    componentMachines.forEach((machineId) => {
      const row = positionMap.get(String(machineId))?.row;
      const rowKey = Number.isInteger(row) ? row : `unknown-${machineId}`;
      if (!machinesByRow.has(rowKey)) {
        machinesByRow.set(rowKey, []);
      }
      machinesByRow.get(rowKey).push(machineId);
    });
    [...machinesByRow.values()].forEach((sameRowMachines) => {
      groups.push(...partitionCompactNurseGroups(sameRowMachines, capacity, zoneKey, settings, positionMap));
    });
  });

  // 兼容旧数据或异常布局：未找到坐标的机器仍然按编号紧凑分组，
  // 但有坐标的机位继续严格按物理排拆分。
  if (assignedSet.size) {
    const unmatchedByRow = new Map();
    [...assignedSet].forEach((machineId) => {
      const row = positionMap.get(String(machineId))?.row;
      const rowKey = Number.isInteger(row) ? row : `unknown-${machineId}`;
      if (!unmatchedByRow.has(rowKey)) {
        unmatchedByRow.set(rowKey, []);
      }
      unmatchedByRow.get(rowKey).push(machineId);
    });
    [...unmatchedByRow.values()].forEach((sameRowMachines) => {
      groups.push(...partitionCompactNurseGroups(sameRowMachines, capacity, zoneKey, settings, positionMap));
    });
  }

  const indexedGroups = groups
    .sort((left, right) => getNurseGroupPosition(left, positionMap, settings) - getNurseGroupPosition(right, positionMap, settings))
    .map((group, index) => ({ ...group, index }));
  assertNurseGroupsStayWithinRows(indexedGroups, settings, zoneKey);
  return indexedGroups;
}

function getMachinePositionMap(settings = state.settings) {
  return new Map(
    getMachineSlots(settings)
      .filter((slot) => slot.active && slot.machineId)
      .map((slot) => [slot.machineId, { row: slot.row, column: slot.column }]),
  );
}

function getNurseCareComponents(settings = state.settings, zoneKey = MACHINE_ZONE_NORMAL) {
  const slots = getMachineSlots(settings).filter((slot) => {
    if (!slot.active || !slot.machineId) {
      return false;
    }
    return getNurseZoneKey(slot.machineId, settings) === zoneKey;
  });
  const byCoordinate = new Map(slots.map((slot) => [`${slot.row}:${slot.column}`, slot]));
  const visited = new Set();
  const components = [];

  slots.forEach((slot) => {
    if (visited.has(slot.slotKey)) {
      return;
    }
    const queue = [slot];
    const component = [];
    visited.add(slot.slotKey);
    while (queue.length) {
      const current = queue.shift();
      component.push(current.machineId);
      // 护士责任管区禁止跨越物理机器排。
      // 这里只连接同一排左右相邻机位，不再连接上一排或下一排。
      [
        [current.row, current.column - 1],
        [current.row, current.column + 1],
      ].forEach(([row, column]) => {
        const neighbor = byCoordinate.get(`${row}:${column}`);
        if (neighbor && !visited.has(neighbor.slotKey)) {
          visited.add(neighbor.slotKey);
          queue.push(neighbor);
        }
      });
    }
    components.push(component);
  });

  return components.sort((left, right) => {
    const leftPosition = Math.min(...left.map((machineId) => getNurseMachinePathIndex(machineId, settings)));
    const rightPosition = Math.min(...right.map((machineId) => getNurseMachinePathIndex(machineId, settings)));
    return leftPosition - rightPosition;
  });
}

function partitionCompactNurseGroups(machineIds, capacity, zoneKey, settings = state.settings, positionMap = getMachinePositionMap(settings)) {
  const ordered = [...machineIds].sort(
    (left, right) => getNurseMachinePathIndex(left, settings, positionMap) - getNurseMachinePathIndex(right, settings, positionMap) || sortMachineIds(left, right),
  );
  const count = ordered.length;
  const best = Array(count + 1).fill(null);
  best[0] = { groupCount: 0, balancePenalty: 0, compactness: 0, previous: -1 };

  for (let end = 1; end <= count; end += 1) {
    let hdfCount = 0;
    for (let start = end - 1; start >= Math.max(0, end - capacity); start -= 1) {
      if (isHemofiltrationMachine(ordered[start], settings)) {
        hdfCount += 1;
      }
      if (hdfCount > MAX_HEMOFILTRATION_MACHINES_PER_NURSE) {
        continue;
      }
      const previous = best[start];
      if (!previous) {
        continue;
      }
      const segment = ordered.slice(start, end);
      const candidate = {
        groupCount: previous.groupCount + 1,
        // 在护士组数量相同的前提下，优先让各组人数更接近。
        // 平方惩罚会明显抑制“1人/2人一组 + 另一组满载”的失衡情况。
        balancePenalty: previous.balancePenalty + Math.pow(capacity - segment.length, 2),
        compactness: previous.compactness + getNurseSegmentCompactness(segment, settings, positionMap),
        previous: start,
      };
      if (isBetterNursePartition(candidate, best[end])) {
        best[end] = candidate;
      }
    }
  }

  const segments = [];
  let cursor = count;
  while (cursor > 0 && best[cursor]) {
    const segmentStart = best[cursor].previous;
    segments.unshift(ordered.slice(segmentStart, cursor));
    cursor = segmentStart;
  }

  const severeZone = zoneKey === MACHINE_ZONE_SEVERE;
  const zoneLabel = getNurseZoneLabel(zoneKey, settings);
  return segments.map((machines, index) => {
    const sortedMachines = [...machines].sort(sortMachineIds);
    const hemofiltrationMachineCount = sortedMachines.filter((machineId) => isHemofiltrationMachine(machineId, settings)).length;
    return {
      index,
      range: formatMachineRangeList(sortedMachines),
      machines: sortedMachines,
      patientCount: sortedMachines.length,
      severeCount: severeZone ? sortedMachines.length : 0,
      capacity,
      severeZone,
      zoneKey,
      zoneLabel,
      hemofiltrationMachineCount,
    };
  });
}

function isBetterNursePartition(candidate, current) {
  if (!current) {
    return true;
  }
  if (candidate.groupCount !== current.groupCount) {
    return candidate.groupCount < current.groupCount;
  }
  if (candidate.balancePenalty !== current.balancePenalty) {
    return candidate.balancePenalty < current.balancePenalty;
  }
  return candidate.compactness < current.compactness;
}

function validateNurseGroupsDoNotCrossRows(groups = [], settings = state.settings) {
  const positionMap = getMachinePositionMap(settings);
  return groups.flatMap((group) => {
    if (!group || group.empty || !Array.isArray(group.machines)) {
      return [];
    }
    const rows = [...new Set(
      group.machines
        .map((machineId) => positionMap.get(String(machineId))?.row)
        .filter(Number.isInteger),
    )];
    return rows.length > 1
      ? [{
          type: "nurse_group_crosses_rows",
          groupIndex: group.index,
          machines: [...group.machines],
          rows,
        }]
      : [];
  });
}

function assertNurseGroupsStayWithinRows(groups = [], settings = state.settings, context = "") {
  const violations = validateNurseGroupsDoNotCrossRows(groups, settings);
  if (violations.length) {
    console.error("[safety] Nurse responsibility zone crossed physical rows", {
      context,
      violations,
    });
  }
  return violations;
}

function getNurseLoadBalanceSummary(groups = []) {
  const activeGroups = groups.filter((group) => group && !group.empty && group.patientCount > 0);
  if (!activeGroups.length) {
    return { min: 0, max: 0, difference: 0, average: 0 };
  }
  const loads = activeGroups.map((group) => group.patientCount);
  const total = loads.reduce((sum, value) => sum + value, 0);
  return {
    min: Math.min(...loads),
    max: Math.max(...loads),
    difference: Math.max(...loads) - Math.min(...loads),
    average: total / loads.length,
  };
}

function getNurseSegmentCompactness(machineIds, settings = state.settings, positionMap = getMachinePositionMap(settings)) {
  if (!machineIds.length) {
    return 0;
  }
  const positions = machineIds.map((machineId) => positionMap.get(machineId)).filter(Boolean);
  if (!positions.length) {
    const numeric = machineIds.map(Number).filter(Number.isFinite);
    return numeric.length ? Math.max(...numeric) - Math.min(...numeric) : 0;
  }
  const rows = positions.map((item) => item.row);
  const columns = positions.map((item) => item.column);
  const rowSpan = Math.max(...rows) - Math.min(...rows);
  const columnSpan = Math.max(...columns) - Math.min(...columns);
  const pathIndexes = machineIds.map((machineId) => getNurseMachinePathIndex(machineId, settings, positionMap));
  const pathSpan = Math.max(...pathIndexes) - Math.min(...pathIndexes) + 1;
  const emptyGap = Math.max(0, pathSpan - machineIds.length);
  return rowSpan * settings.machinesPerRow * 4 + columnSpan * 2 + emptyGap * 6 + pathSpan;
}

function getNurseMachinePathIndex(machineId, settings = state.settings, positionMap = getMachinePositionMap(settings)) {
  const position = positionMap.get(String(machineId));
  if (!position) {
    return Number(machineId) || Number.MAX_SAFE_INTEGER;
  }
  const firstRowLeftToRight = settings.numberingStartSide !== "right";
  const leftToRight = position.row % 2 === 0 ? firstRowLeftToRight : !firstRowLeftToRight;
  const columnIndex = leftToRight ? position.column : settings.machinesPerRow - 1 - position.column;
  return position.row * settings.machinesPerRow + columnIndex;
}

function getNurseGroupPosition(group, positionMap, settings = state.settings) {
  if (!group.machines?.length) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Math.min(...group.machines.map((machineId) => getNurseMachinePathIndex(machineId, settings, positionMap)));
}

function isHemofiltrationMachine(machineId, settings = state.settings) {
  return normalizeMachineType(settings.machineTypes?.[machineId]) === "hemofiltration";
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


function createEmptyNurseGroup(index) {
  return {
    index,
    range: "备用责任区",
    machines: [],
    patientCount: 0,
    severeCount: 0,
    capacity: MACHINES_PER_NURSE,
    severeZone: false,
    zoneKey: "",
    zoneLabel: "备用",
    hemofiltrationMachineCount: 0,
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
  const level = group.zoneLabel || (group.severeZone ? "重病区" : "普通区");
  const hdf = group.hemofiltrationMachineCount ? ` · 血滤机 ${group.hemofiltrationMachineCount} 台` : "";
  return `${group.range} · ${group.patientCount}/${group.capacity} · ${level}${hdf}`;
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

function getWeeklyLocationsForPatient(weeklySchedules = {}, patientId) {
  const locations = [];
  Object.entries(weeklySchedules || {}).forEach(([dayKey, daySchedule]) => {
    getAssignmentsForPatientInDay(patientId, daySchedule).forEach((assignment) => {
      locations.push({ dayKey, ...assignment });
    });
  });
  return locations;
}

function getPatientCompatibilityIssues(patient) {
  const issues = [];
  const scanDay = (label, daySchedule) => {
    Object.entries(daySchedule || {}).forEach(([machineId, machine]) => {
      STAFF_SHIFT_KEYS.forEach((shift) => {
        const slot = machine?.[shift];
        if (!slot || slot.removed || slot.patientId !== patient.id) {
          return;
        }
        if (!getMachineIds().includes(String(machineId))) {
          issues.push(`${label}${SHIFT_LABELS[shift]}：${machineId} 号机不存在`);
          return;
        }
        const treatmentType = normalizeScheduleSlotSource(slot.source, slot.note) === AUTO_OVERRIDE_SOURCE_MONTHLY_HDF
          ? slot.treatmentType
          : patient.treatmentType;
        if (!patientFitsMachineSettings(patient, getMachineType(machineId), getMachineZone(machineId), treatmentType)) {
          issues.push(`${label}${SHIFT_LABELS[shift]}：${machineId} 号机与新的治疗类型、感染标识或护理组别不匹配`);
        }
      });
    });
  };

  Object.entries(state.weeklySchedules || {}).forEach(([dayKey, daySchedule]) => {
    scanDay(`周模板${getWeekDayLabel(dayKey)}`, daySchedule);
  });
  ["week1", "week2"].forEach((weekKey, index) => {
    Object.entries(state.twoWeekCycle?.patientSchedules?.[weekKey] || {}).forEach(([dayKey, daySchedule]) => {
      scanDay(`2周循环第${index + 1}周${getWeekDayLabel(dayKey)}`, daySchedule);
    });
  });
  Object.entries(state.schedules || {}).forEach(([date, daySchedule]) => {
    scanDay(`${formatDateLabel(date)}`, daySchedule);
  });
  return dedupeMessages(issues);
}

function getAssignmentCompatibilityIssues(machineId, machineType, machineZone) {
  const issues = [];
  const id = String(machineId);
  const scanDay = (label, daySchedule) => {
    const machine = daySchedule?.[id];
    if (!machine) {
      return;
    }
    STAFF_SHIFT_KEYS.forEach((shift) => {
      const slot = machine?.[shift];
      if (!slot || slot.removed || !slot.patientId) {
        return;
      }
      const patient = findPatient(slot.patientId);
      if (!patient) {
        return;
      }
      const treatmentType = slot.treatmentType || patient.treatmentType;
      if (!patientFitsMachineSettings(patient, machineType, machineZone, treatmentType)) {
        issues.push(`${label}${SHIFT_LABELS[shift]}：${patient.name}`);
      }
    });
  };

  Object.entries(state.weeklySchedules || {}).forEach(([dayKey, daySchedule]) => {
    scanDay(`周模板${getWeekDayLabel(dayKey)}`, daySchedule);
  });
  Object.entries(state.schedules || {}).forEach(([date, daySchedule]) => {
    scanDay(`${formatDateLabel(date)}`, daySchedule);
  });
  state.patients
    .filter((patient) => patient.fixedMachineId === id)
    .forEach((patient) => {
      if (!patientFitsMachineSettings(patient, machineType, machineZone, patient.treatmentType)) {
        issues.push(`长期固定机位：${patient.name}`);
      }
    });
  return dedupeMessages(issues);
}


function validateGeneratedWeeklySafety(weeklySchedules, weeklyStaffSchedules) {
  const errors = [];
  const activePatients = getSchedulablePatients();
  const weeklyCounts = new Map(activePatients.map((patient) => [patient.id, 0]));

  WORKING_DAY_KEYS.forEach((dayKey) => {
    const daySchedule = weeklySchedules?.[dayKey] || {};
    errors.push(...validateDayPatientSafety(daySchedule, {
      label: getWeekDayLabel(dayKey),
      weekly: true,
      settings: state.settings,
      patientMap: new Map(state.patients.map((patient) => [patient.id, patient])),
      weeklyCounts,
    }));

    const nurseProfile = getNurseGroupProfileForDay(daySchedule, state.settings, 0);
    STAFF_SHIFT_KEYS.forEach((shift) => {
      (nurseProfile.shiftGroups?.[shift] || []).forEach((group) => {
        if (!group || group.empty) {
          return;
        }
        if (group.patientCount > group.capacity) {
          errors.push(`${getWeekDayLabel(dayKey)}${SHIFT_LABELS[shift]}护士管区超员：${group.range} 为 ${group.patientCount}/${group.capacity} 人。`);
        }
        if (group.hemofiltrationMachineCount > MAX_HEMOFILTRATION_MACHINES_PER_NURSE) {
          errors.push(`${getWeekDayLabel(dayKey)}${SHIFT_LABELS[shift]}护士管区 ${group.range} 同时包含 ${group.hemofiltrationMachineCount} 台血滤机。`);
        }
      });
    });

    errors.push(...validateStaffScheduleSafety(
      daySchedule,
      weeklyStaffSchedules?.[dayKey] || {},
      `${getWeekDayLabel(dayKey)}`,
      state.staffMembers,
    ));
  });

  activePatients.forEach((patient) => {
    const actual = weeklyCounts.get(patient.id) || 0;
    const expected = clampNumber(patient.weeklyTreatmentCount, 1, 6, 3);
    if (actual !== expected) {
      errors.push(`${patient.name} 每周计划 ${expected} 次，但自动模板实际生成 ${actual} 次。`);
    }
  });

  if (weeklySchedules?.[REST_DAY_KEY] && Object.keys(weeklySchedules[REST_DAY_KEY]).length) {
    errors.push("自动周模板错误地包含周日患者排班。");
  }
  return dedupeMessages(errors);
}

function validateImportedStateSafety(imported) {
  const errors = [];
  const warnings = [];
  const patientMap = new Map(imported.patients.map((patient) => [patient.id, patient]));
  const today = formatDateInput(new Date());

  Object.entries(imported.weeklySchedules || {}).forEach(([dayKey, daySchedule]) => {
    errors.push(...validateDayPatientSafety(daySchedule, {
      label: `周模板${getWeekDayLabel(dayKey)}`,
      weekly: true,
      settings: imported.settings,
      patientMap,
    }));
  });

  Object.entries(imported.schedules || {}).forEach(([date, daySchedule]) => {
    if (date < today) {
      return;
    }
    errors.push(...validateDayPatientSafety(daySchedule, {
      label: date,
      weekly: false,
      settings: imported.settings,
      patientMap,
    }));
  });

  Object.entries(imported.weeklyStaffSchedules || {}).forEach(([dayKey, staffSchedule]) => {
    errors.push(...validateStoredStaffReferences(staffSchedule, `周模板${getWeekDayLabel(dayKey)}`, imported.staffMembers));
  });
  Object.entries(imported.staffSchedules || {}).forEach(([date, staffSchedule]) => {
    if (date >= today) {
      errors.push(...validateStoredStaffReferences(staffSchedule, date, imported.staffMembers));
    }
  });

  imported.patients.forEach((patient) => {
    if (!patient.fixedMachineId) {
      return;
    }
    const validMachineIds = new Set(getMachineIds(imported.settings));
    if (!validMachineIds.has(patient.fixedMachineId)) {
      errors.push(`${patient.name} 的长期固定机位 ${patient.fixedMachineId} 不存在。`);
    } else if (!patientFitsMachineSettings(
      patient,
      getMachineType(patient.fixedMachineId, imported.settings),
      getMachineZone(patient.fixedMachineId, imported.settings),
      patient.treatmentType,
    )) {
      errors.push(`${patient.name} 的长期固定机位 ${patient.fixedMachineId} 与治疗类型或分区不匹配。`);
    } else if ((imported.settings.pausedMachines || []).includes(patient.fixedMachineId)) {
      warnings.push(`${patient.name} 的长期固定机位 ${patient.fixedMachineId} 当前处于暂停状态。`);
    }
  });

  return { errors: dedupeMessages(errors), warnings: dedupeMessages(warnings) };
}

function validateDayPatientSafety(daySchedule, options = {}) {
  const {
    label = "排班",
    weekly = false,
    settings = state.settings,
    patientMap = new Map(state.patients.map((patient) => [patient.id, patient])),
    weeklyCounts = null,
  } = options;
  const errors = [];
  const validMachines = new Set(getMachineIds(settings));
  const pausedMachines = new Set(normalizeMachineIdList(settings.pausedMachines, validMachines));
  const seenPatients = new Map();

  Object.entries(daySchedule || {}).forEach(([machineId, item]) => {
    if (!validMachines.has(String(machineId))) {
      errors.push(`${label}包含不存在的 ${machineId} 号机。`);
      return;
    }
    STAFF_SHIFT_KEYS.forEach((shift) => {
      const slot = item?.[shift];
      if (!slot || slot.removed || !slot.patientId) {
        return;
      }
      const patient = patientMap.get(String(slot.patientId));
      if (!patient) {
        errors.push(`${label}${SHIFT_LABELS[shift]} ${machineId} 号机引用了不存在的患者。`);
        return;
      }
      if (patient.status !== "active") {
        errors.push(`${label}${SHIFT_LABELS[shift]}仍安排了暂停治疗患者 ${patient.name}。`);
      }
      if (pausedMachines.has(String(machineId))) {
        errors.push(`${label}${SHIFT_LABELS[shift]}把 ${patient.name} 安排在已暂停的 ${machineId} 号机。`);
      }
      const treatmentType = normalizeMachineType(slot.treatmentType || patient.treatmentType);
      const machineType = getMachineType(machineId, settings);
      const machineZone = getMachineZone(machineId, settings);
      if (machineType !== treatmentType) {
        errors.push(`${label}${SHIFT_LABELS[shift]} ${machineId} 号机机型为${MACHINE_TYPE_LABELS[machineType]}，但 ${patient.name} 的治疗为${MACHINE_TYPE_LABELS[treatmentType]}。`);
      }
      if (!patientFitsMachineSettings(patient, machineType, machineZone, treatmentType)) {
        errors.push(`${label}${SHIFT_LABELS[shift]} ${patient.name} 与 ${machineId} 号机分区或机型不匹配。`);
      }
      const isBaseTreatment = normalizeMachineType(treatmentType) === normalizeMachineType(patient.treatmentType);
      if (weekly && isBaseTreatment && patient.fixedMachineId && String(patient.fixedMachineId) !== String(machineId)) {
        errors.push(`${label}${SHIFT_LABELS[shift]} ${patient.name} 未使用其长期固定机位 ${patient.fixedMachineId}。`);
      }
      const patientKey = String(patient.id);
      if (!seenPatients.has(patientKey)) {
        seenPatients.set(patientKey, []);
      }
      seenPatients.get(patientKey).push(`${machineId}${SHIFT_LABELS[shift]}`);
      if (weeklyCounts) {
        weeklyCounts.set(patientKey, (weeklyCounts.get(patientKey) || 0) + 1);
      }
    });
  });

  seenPatients.forEach((locations, patientId) => {
    if (locations.length > 1) {
      const patient = patientMap.get(patientId);
      errors.push(`${label}同一天重复安排患者 ${patient?.name || patientId}：${locations.join("、")}。`);
    }
  });
  return errors;
}

function validateStaffScheduleSafety(patientDaySchedule, staffDaySchedule, label, staffMembers = state.staffMembers) {
  const errors = [];
  const staffMap = new Map(staffMembers.map((staff) => [staff.id, staff]));
  STAFF_SHIFT_KEYS.forEach((shift) => {
    const patientCount = countAssigned(patientDaySchedule || {}, getMachineIds(), shift);
    if (!patientCount) {
      return;
    }
    const requiredNurses = getRequiredNurseCountForShift(patientDaySchedule || {}, shift);
    const shiftSchedule = staffDaySchedule?.[shift] || {};
    const doctors = (shiftSchedule.doctors || []).filter(Boolean);
    const nurses = (shiftSchedule.nurses || []).filter(Boolean);
    const backup = shiftSchedule.backupNurse || "";

    if (new Set(doctors).size !== DOCTOR_COUNT || doctors.length !== DOCTOR_COUNT) {
      errors.push(`${label}${SHIFT_LABELS[shift]}医生岗位应为 ${DOCTOR_COUNT} 名且不能重复。`);
    }
    doctors.forEach((id) => {
      const staff = staffMap.get(id);
      if (!staff || staff.status !== "active" || staff.role !== "doctor") {
        errors.push(`${label}${SHIFT_LABELS[shift]}存在无效或非在岗医生。`);
      }
    });
    const responsibleNurses = nurses.slice(0, requiredNurses);
    if (responsibleNurses.length !== requiredNurses || new Set(responsibleNurses).size !== requiredNurses) {
      errors.push(`${label}${SHIFT_LABELS[shift]}责任护士应为 ${requiredNurses} 名且不能重复。`);
    }
    responsibleNurses.forEach((id) => {
      const staff = staffMap.get(id);
      if (!staff || staff.status !== "active" || staff.role !== "nurse") {
        errors.push(`${label}${SHIFT_LABELS[shift]}存在无效或非在岗责任护士。`);
      }
    });
    const backupStaff = staffMap.get(backup);
    if (!backup || !backupStaff || backupStaff.status !== "active" || backupStaff.role !== "nurse") {
      errors.push(`${label}${SHIFT_LABELS[shift]}缺少有效后备护士。`);
    }
    if (backup && responsibleNurses.includes(backup)) {
      errors.push(`${label}${SHIFT_LABELS[shift]}后备护士与责任护士重复。`);
    }
  });
  return errors;
}

function validateStoredStaffReferences(staffDaySchedule, label, staffMembers) {
  const errors = [];
  const staffMap = new Map(staffMembers.map((staff) => [staff.id, staff]));
  STAFF_SHIFT_KEYS.forEach((shift) => {
    const shiftSchedule = staffDaySchedule?.[shift] || {};
    const doctorIds = (shiftSchedule.doctors || []).filter(Boolean);
    const nurseIds = (shiftSchedule.nurses || []).filter(Boolean);
    const backupId = shiftSchedule.backupNurse || "";
    if (new Set(doctorIds).size !== doctorIds.length) {
      errors.push(`${label}${SHIFT_LABELS[shift]}医生名单存在重复。`);
    }
    if (new Set(nurseIds).size !== nurseIds.length) {
      errors.push(`${label}${SHIFT_LABELS[shift]}护士名单存在重复。`);
    }
    doctorIds.forEach((id) => {
      const staff = staffMap.get(id);
      if (!staff || staff.role !== "doctor") {
        errors.push(`${label}${SHIFT_LABELS[shift]}引用了不存在或角色错误的医生。`);
      }
    });
    nurseIds.forEach((id) => {
      const staff = staffMap.get(id);
      if (!staff || staff.role !== "nurse") {
        errors.push(`${label}${SHIFT_LABELS[shift]}引用了不存在或角色错误的护士。`);
      }
    });
    if (backupId) {
      const backup = staffMap.get(backupId);
      if (!backup || backup.role !== "nurse") {
        errors.push(`${label}${SHIFT_LABELS[shift]}后备护士无效。`);
      }
      if (nurseIds.includes(backupId)) {
        errors.push(`${label}${SHIFT_LABELS[shift]}后备护士与责任护士重复。`);
      }
    }
  });
  return errors;
}

function dedupeMessages(items) {
  return [...new Set((items || []).filter(Boolean).map(String))];
}

function findConflicts(daySchedule) {
  const seen = new Map();
  const conflicts = [];
  Object.entries(daySchedule || {}).forEach(([machineId, item]) => {
    STAFF_SHIFT_KEYS.forEach((shift) => {
      const patientId = item?.[shift]?.patientId;
      if (!patientId) {
        return;
      }
      const key = String(patientId);
      if (!seen.has(key)) {
        seen.set(key, []);
      }
      seen.get(key).push({ machineId, shift });
    });
  });

  seen.forEach((items) => {
    // 同一患者同一天无论同班还是跨上午/下午重复，都视为冲突。
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

  return [patient.name, patient.dialysisNo, patient.phone, patient.vascularAccess, getPatientTreatmentLabel(patient), getPatientCareLabel(patient), patient.infectionFlag, formatDayPreference(patient.preferredDays), patient.forcePreferredDays && "强制个性化", patient.temporaryInsert && "临时患者"]
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

function getTreatmentLabel(treatmentType) {
  return MACHINE_TYPE_LABELS[normalizeMachineType(treatmentType)] || MACHINE_TYPE_LABELS[DEFAULT_MACHINE_TYPE];
}

function formatPreference(preferredShift, preferredDays = [], forcePreferredDays = false) {
  const shift = preferredShift ? SHIFT_LABELS[preferredShift] : "不限";
  const days = formatDayPreference(preferredDays);
  const base = days ? `${shift} · ${days}` : shift;
  return forcePreferredDays ? `${base} · 强制个性化` : base;
}

function formatDayPreference(preferredDays = []) {
  const labels = preferredDays
    .map((key) => getWeekDayLabel(key))
    .filter(Boolean);
  return labels.join(!isChineseLanguage() ? ", " : "、");
}

function getWeekDayLabel(key) {
  const index = WEEK_DAYS.findIndex((day) => day.key === key);
  const labels = WEEK_DAY_LABELS[!isChineseLanguage() ? "en" : "zh"];
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
  const plan = `${patient.weeklyTreatmentCount || 3}次/周，血滤${patient.monthlyHdfCount ?? 2}次/4周`;
  return [patient.dialysisNo && `透析号 ${patient.dialysisNo}`, getPatientTreatmentLabel(patient), getPatientCareLabel(patient), `机位 ${getPatientFixedMachineLabel(patient)}`, plan, patient.temporaryInsert && "临时患者", patient.forcePreferredDays && "强制个性化", patient.vascularAccess, patient.infectionFlag]
    .filter(Boolean)
    .join(" · ") || "资料待完善";
}

function formatDateLabel(dateValue) {
  if (!dateValue) {
    return "今日";
  }
  const date = parseDateInput(dateValue);
  return date.toLocaleDateString(getLanguageMeta().code, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function formatShortDate(date) {
  if (!isChineseLanguage()) {
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
