一个透析患者上次，偶然看见透析室的医护还在用纸币排版，所以想提供点帮助。 :D


CN:
# 血透室排班系统

这是一个本地单页血透室排班工具，可直接用浏览器打开 `index.html`。

## 功能

- 自定义血透机器排数、每排机器数量、机器编号前缀。
- 按周建立每台机器的上午、下午患者模板，默认每周重复。
- 可对某一天、某个患者做单日调整，不影响之后每周模板。
- 患者资料支持常用班次和透析星期倾向。
- 医护资料有独立医护库，可管理医生、护士、工号、电话、状态和上班倾向。
- 按日期安排上午、下午医护人员：每班 2 名医生，每 6 台机器 1 名责任护士，另设 1 名后备护士。
- 医护排班也支持每周重复和仅当前日期两种保存范围。
- 医护排班从医护库中选择，并按上班倾向优先排序。
- 责任护士下方会显示其负责机器范围内的当班患者姓名。
- 可单独将某台机器标记为血滤机器，并在机器排班、护士患者列表和布局预览中显示。
- 管理患者基础资料、透析号、血管通路、干体重、感染标识、常用班次和备注。
- 自动提示同一患者在同一班次重复排班。
- 支持复制前一天排班、清空当日排班、打印、全部重置、导入和导出 JSON 数据。
- 支持中文和英文界面切换。

## 数据说明

数据自动保存在当前浏览器的 `localStorage` 中，下次打开 `index.html` 会默认读取。正式用于科室前，建议接入账号权限、自动备份和院内数据存储策略。





EN:
**# Hemodialysis Room Scheduling System**

This is a local single-page scheduling tool for the hemodialysis room. It can be opened directly in a web browser by accessing `index.html`.

## Features

- Customize the number of hemodialysis machine rows, the number of machines per row, and the machine numbering prefix.
- Create morning and afternoon patient templates for each machine on a weekly basis, with automatic weekly repetition by default.
- Allow single-day adjustments for any specific date or patient without affecting the weekly templates for subsequent weeks.
- Patient records support common shift patterns and preferred days of the week for dialysis.
- Medical staff records are maintained in an independent medical staff database, enabling management of doctors, nurses, employee IDs, contact numbers, status, and work shift preferences.
- Schedule medical staff for morning and afternoon shifts by date: 2 doctors per shift, 1 primary nurse for every 6 machines, and 1 backup nurse.
- Medical staff scheduling supports two save scopes: weekly repetition and current date only.
- Medical staff are selected from the medical staff database and prioritized according to their work shift preferences.
- The names of patients scheduled for the current shift within each primary nurse’s assigned machine range are displayed below the nurse’s information.
- Individual machines can be marked as hemofiltration machines; these designations are reflected in machine scheduling, nurse-patient lists, and layout previews.
- Manage patient basic information, dialysis ID, vascular access type, dry weight, infection markers, common shift patterns, and remarks.
- Automatically alert when the same patient is scheduled repeatedly for the same shift.
- Support copying the previous day’s schedule, clearing the current day’s schedule, printing, full reset, and importing/exporting data in JSON format.
- Support switching between Chinese and English user interfaces.

## Data Notes

Data is automatically saved in the browser’s `localStorage` and is loaded by default the next time `index.html` is opened. Before formal deployment in a clinical department, it is recommended to implement account permission controls, automatic backup mechanisms, and internal hospital data storage protocols.
