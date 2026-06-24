# Dialysis-Scheduler

Privacy-friendly local scheduling assistant for hemodialysis rooms.

Dialysis-Scheduler is a free, open-source, local-first scheduling tool for dialysis units. It runs directly in the browser with plain HTML, CSS, and JavaScript. It does not require a server, database, account system, or internet connection. Patient records, staff records, machine layouts, recurring schedules, and date-specific adjustments stay on the local computer by default.

This project was created by a dialysis patient to reduce repetitive scheduling work, make fixed patient seats easier to manage, and give nurses and administrators a clearer way to review hemodialysis-room schedules before use.

## Why This Matters

Hemodialysis scheduling is difficult because it is not just a calendar problem. Real dialysis rooms must consider patient frequency, fixed machine positions, morning and afternoon shifts, infection isolation, severe-care areas, machine failures, treatment-machine compatibility, nurse capacity, doctor coverage, and temporary changes.

Many small or resource-limited dialysis units still manage these constraints manually. Dialysis-Scheduler aims to provide a transparent, inspectable, low-cost tool that keeps sensitive data local and always leaves final decisions to healthcare staff.

## Key Features

- Fully local browser app: open `index.html` and use it without a backend.
- Patient, staff, and machine management.
- Long-term fixed machine positions for patients.
- Two-week recurring scheduling cycle.
- Morning and afternoon shift scheduling.
- Patient Priority, Staff Priority, and Smart Scheduling modes.
- Strict treatment-machine matching for hemodialysis, hemofiltration, and hemoperfusion.
- Standard, severe-care, shared infection, HBV, HCV, HBC, and T-zone separation.
- Severe-care nurse ratio: 1 nurse per 5 patients.
- Standard-area nurse ratio: 1 nurse per 6 patients.
- No more than 1 hemofiltration machine per responsible nurse.
- Nurse responsibility zones kept within physical machine rows.
- Machine pause and failure handling.
- Temporary patient insertion without moving existing patients.
- Smart staff shift swapping for leave and short-term coverage.
- Safety self-check before long-term use.
- Printable schedule and review reports.
- JSON import, export, and backup.
- Demo data generation for testing and training.
- Multilingual UI, including LTR and RTL language support.
- Light, eye-comfort, and dark themes.

## Quick Start

1. Download the repository files.
2. Keep these files in the same folder:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `languages.js`
3. Double-click `index.html`.
4. Configure the machine layout, patients, staff, and scheduling strategy.
5. Generate a schedule, review the report, then export a JSON backup.

No installation is required.

## Local-First Privacy Design

Dialysis-Scheduler does not automatically upload patient or staff data to any server. The default storage is the current browser's `localStorage` on the local computer.

Important notes:

- Export JSON backups regularly.
- Do not publish real patient data in GitHub issues.
- Clear local data before sharing a computer.
- For institutional use, add access control, audit logs, secure backups, and internal privacy review.

## Scheduling Rules

### Machine Types

The system treats treatment-machine compatibility as a hard rule:

| Treatment | Required machine |
|---|---|
| Hemodialysis | Hemodialysis machine |
| Hemofiltration | Hemofiltration machine |
| Hemoperfusion | Hemoperfusion machine |

The program does not silently convert one machine type into another.

### Zones

The default layout supports standard, severe-care, and infectious-disease separation.

| Zone | Purpose |
|---|---|
| Standard zone | Routine non-infectious patients |
| Severe-care zone | Severe-care or high-attention patients |
| Shared infection zone | General infectious isolation area |
| HBV / HCV / HBC / T zones | Specific infectious-disease separation |

Infectious patients must be assigned to a compatible infection zone. Non-infectious patients are kept out of infection zones.

### Staff Rules

- Each active shift requires doctor coverage.
- Each active shift requires responsible nurses based on patient load.
- A backup nurse can be assigned.
- Responsible nurses must not be duplicated in the same shift.
- A backup nurse must not also be a responsible nurse in the same shift.
- Nurse groups are checked for load, row boundaries, severe-care capacity, and hemofiltration-machine count.

## Safety Self-Check

The self-check report looks for problems such as:

- Missing patient sessions.
- Duplicate patient scheduling on the same day.
- Incompatible treatment and machine type.
- Infection-zone mismatch.
- Severe-care and standard-area capacity problems.
- Paused machines still being used.
- Invalid or inactive staff references.
- Missing doctor, nurse, or backup nurse coverage.
- Long-term fixed machine conflicts.

The report is designed for human review. It is not a clinical decision system.

## Screenshots

Recommended screenshots to add before submitting grant or open-source support applications:

- Main schedule board.
- Two-week schedule review report.
- Patient library.
- Staff schedule board.
- Machine layout editor.
- Safety self-check report.

Place images in a `docs/images/` folder and reference them here.

## Project Status

This project is under active development. It is suitable for local testing, workflow exploration, and open-source collaboration. Before use in a real healthcare institution, it should be reviewed by clinical, nursing, infection-control, IT, and privacy teams.

## Roadmap

See `ROADMAP.md`.

## Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` before opening issues or pull requests.

Do not include real patient information in any public issue, pull request, screenshot, demo file, or discussion.

## Security

Please read `SECURITY.md` for privacy and vulnerability reporting guidance.

## License

This project is released under the MIT License.

---

# 血透室本地排班系统

面向血液透析室的隐私友好、本地优先、免费开源排班辅助工具。

Dialysis-Scheduler 使用原生 HTML、CSS、JavaScript 编写，直接在浏览器中运行。它不需要服务器、数据库、账号系统或网络连接。患者资料、医护资料、机器布局、长期模板和单日调整默认保存在当前电脑浏览器本地。

本项目由透析患者创建，目标是在保留人工复核和安全规则的前提下，帮助血透室减少重复排班工作，让患者固定机位更清晰，也让医护排班更容易检查和调整。

## 项目价值

血透室排班不是简单的日历问题。真实场景中需要同时处理患者透析频率、固定机位、上午/下午班次、传染病隔离、重病区、机器故障、血透/血滤/灌流机型匹配、护士责任区、医生覆盖和临时调整。

很多中小型或资源有限的透析单位仍然依靠手工方式处理这些复杂约束。本项目希望提供一个透明、可检查、低成本、数据本地保存的开源工具，并且始终保留医护人员最终复核。

## 主要功能

- 纯本地浏览器运行，打开 `index.html` 即可使用。
- 患者库、医护库、机器布局管理。
- 患者长期固定机位。
- 长期 2 周循环排班。
- 上午、下午独立班次。
- 患者优先、医护优先、灵巧排班三种策略。
- 血透、血滤、灌流机型严格匹配。
- 普通区、重病区、通用传染区、HBV、HCV、HBC、T 区隔离。
- 重病区 5 名患者配置 1 名护士。
- 其他区域 6 名患者配置 1 名护士。
- 每名责任护士最多负责 1 台血滤机。
- 护士责任区不跨越物理机器排。
- 机器故障暂停与恢复。
- 临时插入患者，不移动已排好的患者。
- 智能调班，适合请假和短期替班。
- 排班自检和人工复核报告。
- 打印排班和复核报告。
- JSON 导入、导出和备份。
- 演示数据生成，便于测试和培训。
- 多语言界面，支持 LTR 和 RTL 语言。
- 明亮、护眼绿、暗黑主题。

## 使用方法

1. 下载项目文件。
2. 确认以下文件在同一个文件夹：
   - `index.html`
   - `app.js`
   - `styles.css`
   - `languages.js`
3. 双击打开 `index.html`。
4. 设置机器布局、患者、医护和排班策略。
5. 生成排班，复核报告，然后导出 JSON 备份。

无需安装。

## 本地隐私设计

程序不会自动上传患者或医护数据。默认数据保存在当前电脑浏览器的 `localStorage` 中。

使用提醒：

- 定期导出 JSON 备份。
- 不要在 GitHub issue 中上传真实患者资料。
- 共用电脑前请清理本地数据。
- 医疗机构正式使用前，应补充账号权限、审计日志、安全备份和院内隐私审查。

## 安全说明

本项目是排班辅助工具，不是医疗诊断系统，也不是经过认证的临床决策系统。所有排班结果都必须由医护人员人工复核后再执行。

## 贡献

欢迎提出 issue 和 pull request。请先阅读 `CONTRIBUTING.md`。

公开交流中请勿包含任何真实患者身份信息、联系方式、病历内容或截图。

## 许可证

本项目使用 MIT License。
