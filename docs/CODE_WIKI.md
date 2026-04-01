# HealthTick 项目架构文档

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [核心架构](#核心架构)
- [主要模块详解](#主要模块详解)
- [数据模型](#数据模型)
- [关键类与函数说明](#关键类与函数说明)
- [依赖关系](#依赖关系)
- [项目运行方式](#项目运行方式)
- [开发指南](#开发指南)

---

## 项目概述

**HealthTick** 是一款 macOS 菜单栏久坐提醒工具，旨在帮助用户养成健康的工作习惯。主要功能包括：

- 🕐 **智能计时**：自定义工作时长（1-120 分钟）和休息时长（1-15 分钟）
- 💪 **强制休息**：休息时弹窗提醒，支持多种显示模式
- 🔍 **操作检测**：休息期间检测键鼠操作，确保真正休息
- 🎯 **每日目标**：设定每天休息次数目标，追踪完成进度
- 🔥 **连续打卡**：记录连续达标天数，激励持续坚持
- 🏆 **徽章系统**：18 枚徽章等你解锁
- 📊 **数据统计**：7 天柱状图、30 天热力图、周/月达标率

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Swift | 5.9+ | 主要开发语言 |
| SwiftUI | - | UI 框架 |
| macOS | 14+ (Sonoma) | 目标平台 |
| SQLite | 系统内置 | 本地数据持久化 |
| CryptoKit | - | 数据加密导出 |
| Combine | - | 响应式编程 |

### 核心框架依赖

- **SwiftUI**: 声明式 UI 框架
- **AppKit**: macOS 原生窗口管理
- **SQLite3**: 轻量级数据库
- **ServiceManagement**: 开机自启动管理
- **CryptoKit/CommonCrypto**: 数据加密

---

## 项目结构

```
health-tick-release/
├── Sources/                    # 源代码目录
│   ├── HealthTickApp.swift    # 应用入口
│   ├── AppState.swift         # 全局状态管理
│   ├── Database.swift         # 数据库操作层
│   ├── Strings.swift          # 国际化字符串
│   ├── MenuView.swift         # 菜单栏主视图
│   ├── BreakOverlay.swift     # 休息弹窗管理
│   ├── SettingsView.swift     # 设置界面
│   ├── StatsWindowView.swift  # 统计窗口
│   ├── OnboardingView.swift   # 新手引导
│   ├── HelpView.swift         # 帮助文档
│   ├── UpdateChecker.swift    # 版本更新检查
│   ├── UpdateDialogView.swift # 更新对话框
│   ├── BadgeCelebrationView.swift # 徽章庆祝动画
│   ├── ShareCardView.swift    # 分享卡片
│   ├── ShareManager.swift     # 分享管理器
│   ├── DataExporter.swift     # 数据导出
│   ├── Info.plist             # 应用配置
│   └── Resources/             # 资源文件
│       ├── AppIcon.icns       # 应用图标
│       ├── stats.html         # 统计页面
│       ├── alipay.png         # 支付二维码
│       └── wechat-pay.jpg     # 微信支付二维码
├── Tests/                      # 测试文件
│   ├── test_streak.swift      # 连续打卡测试
│   ├── test_time_logic.swift  # 时间逻辑测试
│   └── test_update_checker.swift # 更新检查测试
├── docs/                       # 文档目录
│   ├── index.html             # 文档首页
│   └── screenshots/           # 截图资源
├── Package.swift               # Swift Package 配置
├── build.sh                    # 开发构建脚本
├── release.sh                  # 发布构建脚本
├── README.md                   # 项目说明
└── TODO.md                     # 功能规划
```

---

## 核心架构

### 架构模式

HealthTick 采用 **MVVM (Model-View-ViewModel)** 架构模式，结合 SwiftUI 的声明式特性：

```
┌─────────────────────────────────────────────────────────────┐
│                         View Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ MenuView │  │SettingsView│ │StatsView │  │Onboarding│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    State Management                         │
│                     ┌──────────────┐                        │
│                     │   AppState   │                        │
│                     │  (Observable)│                        │
│                     └──────┬───────┘                        │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│                     ┌──────────────┐                        │
│                     │   Database   │                        │
│                     │   (SQLite)   │                        │
│                     └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### 应用生命周期

```
App Launch
    │
    ├─── HealthTickApp.init()
    │         │
    │         ├─── AppState.init()
    │         │      ├─── Load config from Database
    │         │      ├─── Restore timer state
    │         │      ├─── Refresh stats
    │         │      └─── Start quiet hours check
    │         │
    │         └─── AppDelegate.applicationDidFinishLaunching
    │                ├─── Load app icon
    │                ├─── Schedule update check
    │                └─── Setup window close observer
    │
    ├─── MenuBarExtra created
    │
    └─── Check onboarding status
           └─── Show OnboardingView if needed
```

---

## 主要模块详解

### 1. 应用入口模块 (HealthTickApp.swift)

**职责**：应用生命周期管理、窗口管理、菜单栏图标

**核心组件**：

- `HealthTickApp`: 主应用结构体，使用 `@main` 标记
- `MenuBarLabel`: 菜单栏图标显示
- `AppDelegate`: 应用生命周期回调

**关键代码**：

```swift
@main
struct HealthTickApp: App {
    @State private var state = AppState()
    @StateObject private var updater = UpdateChecker.shared
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        MenuBarExtra {
            MenuView()
                .environment(state)
        } label: {
            MenuBarLabel()
                .environment(state)
        }
        // ... 窗口定义
    }
}
```

### 2. 状态管理模块 (AppState.swift)

**职责**：全局状态管理、计时器逻辑、业务逻辑

**核心状态**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `config` | `AppConfig` | 应用配置 |
| `phase` | `AppPhase` | 当前阶段（工作/休息/暂停等） |
| `remainingSeconds` | `Int` | 剩余秒数 |
| `todayDone` | `Int` | 今日完成次数 |
| `currentStreak` | `Int` | 当前连续天数 |
| `maxStreak` | `Int` | 最长连续天数 |

**阶段流转**：

```
┌─────────┐  work done   ┌──────────┐  confirm   ┌──────────┐
│ working │──────────────▶│ alerting │───────────▶│ breaking │
└────┬────┘               └──────────┘            └────┬─────┘
     │                                                 │
     │                    pause                        │ break done
     │                    ┌───┐                        │
     └───────────────────▶│paused│◀────────────────────┘
                          └───┘
                             │
                             │ break done
                             ▼
                          ┌────────┐
                          │waiting │
                          └────────┘
```

### 3. 数据库模块 (Database.swift)

**职责**：数据持久化、统计查询

**数据表结构**：

#### records 表（打卡记录）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| timestamp | TEXT | ISO8601 时间戳 |
| date | TEXT | 日期 (yyyy-MM-dd) |

#### sessions 表（工作会话）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| date | TEXT | 日期 |
| work_start | TEXT | 工作开始时间 |
| work_end | TEXT | 工作结束时间 |
| work_minutes | INTEGER | 配置的工作分钟数 |
| break_start | TEXT | 休息开始时间 |
| break_end | TEXT | 休息结束时间 |
| break_minutes | INTEGER | 配置的休息分钟数 |
| break_actual_seconds | INTEGER | 实际休息秒数 |
| skipped | INTEGER | 是否跳过 |
| daily_goal | INTEGER | 当日目标 |

#### config 表（配置）

| 字段 | 类型 | 说明 |
|------|------|------|
| key | TEXT | 配置键 |
| value | TEXT | 配置值 |

**关键方法**：

```swift
// 获取今日完成次数
func todayCount() -> Int

// 计算连续达标天数
func streakDays(goal: Int) -> Int

// 获取近7天数据
func recent7DaysCounts() -> [(String, Int)]

// 计算周/月达标率
func weekCompletionRate(goal: Int) -> (Int, Int)
func monthCompletionRate(goal: Int) -> (Int, Int)
```

### 4. 休息弹窗模块 (BreakOverlay.swift)

**职责**：休息窗口显示、用户活动检测

**核心组件**：

- `BreakOverlayManager`: 管理休息窗口的显示和隐藏
- `BreakCardView`: 休息卡片 UI
- `VisualEffectBackground`: 毛玻璃背景效果

**休息窗口位置模式**：

```swift
enum BreakPosition: String, CaseIterable {
    case menuWindow = "menu_window"  // 主窗口提醒
    case topRight = "top_right"      // 右上角
    case topLeft = "top_left"        // 左上角
    case center = "center"           // 屏幕中央
    case fullscreen = "fullscreen"   // 全屏强制
}
```

**用户活动检测**：

```swift
func getUserIdleSeconds() -> Double {
    let idle = CGEventSource.secondsSinceLastEventType(
        .combinedSessionState, 
        eventType: .mouseMoved
    )
    let idleKey = CGEventSource.secondsSinceLastEventType(
        .combinedSessionState, 
        eventType: .keyDown
    )
    return min(idle, idleKey)
}
```

### 5. 设置界面模块 (SettingsView.swift)

**职责**：应用配置界面

**设置分类**：

| Tab | 功能 |
|-----|------|
| System | 语言、外观、开机自启、重置 |
| App | 工作时长、休息时长、每日目标、工作时间 |
| Break | 休息窗口位置、确认模式、提示音、快捷键 |
| Reminders | 自定义提醒语 |
| About | 版本信息、检查更新、捐赠 |

### 6. 统计窗口模块 (StatsWindowView.swift)

**职责**：数据可视化、徽章展示

**统计内容**：

- 今日完成 / 当前连续 / 最长连续 / 累计次数
- 本周达标 / 本月达标
- 近 7 天柱状图
- 近 30 天热力图（打卡次数 / 工作时长）
- 徽章墙

### 7. 更新检查模块 (UpdateChecker.swift)

**职责**：检查 GitHub/Gitee 更新、下载安装

**更新流程**：

```
check(silent: false)
    │
    ├─── Check Gitee API (primary)
    │         │
    │         └─── On failure → Check GitHub API (fallback)
    │
    ├─── Compare versions
    │
    └─── Show update dialog if new version available
              │
              ├─── downloadUpdate()
              │         │
              │         └─── Download with progress
              │
              └─── installAndRestart()
```

### 8. 国际化模块 (Strings.swift)

**职责**：多语言支持（中文/英文）

**语言枚举**：

```swift
enum AppLanguage: String, CaseIterable {
    case system = "system"  // 跟随系统
    case zh = "zh"          // 中文
    case en = "en"          // English
}
```

**使用方式**：

```swift
struct L {
    static var lang: AppLanguage = .system
    private static var isZh: Bool { lang.resolved == .zh }
    
    static var appName: String { "HealthTick" }
    static var phaseWorking: String { isZh ? "工作中" : "Working" }
    // ...
}
```

---

## 数据模型

### AppConfig（应用配置）

```swift
struct AppConfig: Equatable {
    var workMinutes: Int = 60              // 工作时长（分钟）
    var breakSeconds: Int = 120            // 休息时长（秒）
    var eyeCareMode: Bool = false          // 护眼模式
    var dailyGoal: Int = 8                 // 每日目标
    var reminders: [String] = [...]        // 提醒语列表
    var soundEnabled: Bool = true          // 提示音开关
    var breakPosition: BreakPosition = .menuWindow
    var breakConfirm: Bool = true          // 休息前确认
    var language: AppLanguage = .system
    var appearance: AppAppearance = .system
    var quietHours: [QuietHourPeriod] = [] // 休息时段
    var workDays: Set<Int> = [2,3,4,5,6]   // 工作日
    var workHoursEnabled: Bool = false     // 工作时间开关
    var workStartTime: String = "09:00"
    var workEndTime: String = "18:00"
    var autoPauseOnGoal: Bool = false      // 达标后自动停止
    var longBreakEnabled: Bool = false     // 长休息开关
    var longBreakInterval: Int = 4         // 长休息间隔轮数
    var longBreakSeconds: Int = 900        // 长休息时长
    var shortcutEnabled: Bool = false      // 快捷键开关
    var shortcutKeyCode: UInt16 = 36       // 快捷键码
    var shortcutModifiers: UInt = 1048576  // 修饰键
}
```

### QuietHourPeriod（休息时段）

```swift
struct QuietHourPeriod: Codable, Equatable, Identifiable {
    var id: UUID
    var start: String           // "HH:mm"
    var end: String             // "HH:mm"
    var weekdays: Set<Int>?     // 生效的星期几
    
    func isActive(at date: Date) -> Bool
}
```

### Badge（徽章）

```swift
struct Badge {
    let days: Int           // 达标天数
    let icon: String        // emoji 图标
    let isTotal: Bool       // 是否为累计徽章
    var name: String        // 徽章名称
    var desc: String        // 徽章描述
}
```

### BreakActivity（休息活动建议）

```swift
struct BreakActivity {
    let icon: String        // SF Symbol 名称
    let textZh: String      // 中文描述
    let textEn: String      // 英文描述
}
```

---

## 关键类与函数说明

### AppState 关键方法

| 方法 | 功能 |
|------|------|
| `startWork()` | 开始工作计时 |
| `togglePause()` | 暂停/继续 |
| `reset()` | 重置计时器 |
| `manualBreak()` | 手动开始休息 |
| `confirmBreak()` | 确认开始休息 |
| `confirmReturn()` | 确认返回工作 |
| `forceEndBreak()` | 强制结束休息 |
| `refreshStats()` | 刷新统计数据 |
| `checkQuietHours()` | 检查休息时段 |
| `showBadgeCelebration(_:)` | 显示徽章庆祝动画 |

### Database 关键方法

| 方法 | 功能 |
|------|------|
| `loadConfig() -> AppConfig` | 加载配置 |
| `saveConfig(_:)` | 保存配置 |
| `addRecord()` | 添加打卡记录 |
| `todayCount() -> Int` | 今日完成次数 |
| `streakDays(goal:) -> Int` | 连续达标天数 |
| `maxStreakDays(goal:) -> Int` | 最长连续天数 |
| `recent7DaysCounts() -> [(String, Int)]` | 近7天数据 |
| `todayWorkMinutes() -> Int` | 今日工作分钟数 |
| `exportAllData() -> [String: Any]` | 导出所有数据 |

### BreakOverlayManager 关键方法

| 方法 | 功能 |
|------|------|
| `show(seconds:)` | 显示休息窗口（浮动/全屏） |
| `showMenuWindow(seconds:)` | 在菜单窗口显示 |
| `hide()` | 隐藏休息窗口 |
| `hideAll()` | 隐藏所有窗口 |
| `preview(position:)` | 预览休息窗口 |

---

## 依赖关系

### 模块依赖图

```
┌─────────────────────────────────────────────────────────────┐
│                      HealthTickApp                          │
│                         (入口)                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
           ┌────────────┼────────────┐
           │            │            │
           ▼            ▼            ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ MenuView │  │SettingsView│ │StatsView │
    └────┬─────┘  └────┬─────┘  └────┬─────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
                       ▼
              ┌────────────────┐
              │    AppState    │
              │  (状态管理)     │
              └────────┬───────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Database │  │BreakOverlay│ │UpdateChecker│
  │          │  │  Manager   │ │            │
  └──────────┘  └──────────┘  └──────────┘
```

### 外部依赖

| 依赖 | 用途 |
|------|------|
| SQLite3 | 数据持久化 |
| CryptoKit | 数据加密 |
| CommonCrypto | PBKDF2 密钥派生 |
| ServiceManagement | 开机自启动 |
| AppKit | 窗口管理 |

---

## 项目运行方式

### 环境要求

- macOS 14 (Sonoma) 或更高版本
- Xcode 15+ / Swift 5.9+
- Apple Silicon / Intel 均支持

### 开发构建

```bash
# 克隆仓库
git clone https://github.com/lifedever/health-tick-release.git
cd health-tick-release

# 开发构建（使用 build.sh）
./build.sh
# 构建产物安装到 ~/Applications/HealthTick Dev.app

# 或使用 Swift Package Manager
swift build -c release
```

### 构建脚本说明

#### build.sh（开发构建）

```bash
#!/bin/bash
# 1. 尝试构建通用二进制（arm64 + x86_64）
# 2. 失败则构建当前架构
# 3. 安装到 ~/Applications/HealthTick Dev.app
# 4. 创建独立的 Info.plist（使用 .dev 后缀的 bundle ID）
# 5. 复制资源文件
# 6. 进行 ad-hoc 签名
```

### 发布构建

```bash
# 使用 release.sh
./release.sh
```

### 安装方式

#### Homebrew（推荐）

```bash
brew tap lifedever/tap
brew install --cask health-tick
```

#### 手动下载

从 [Releases](https://github.com/lifedever/health-tick-release/releases/latest) 下载 DMG 文件。

---

## 开发指南

### 添加新功能

1. **状态管理**：在 `AppState.swift` 中添加状态变量
2. **数据持久化**：在 `Database.swift` 中添加存储逻辑
3. **UI 实现**：创建或修改 SwiftUI 视图
4. **国际化**：在 `Strings.swift` 中添加多语言支持

### 代码风格

- 使用 Swift 5.9 特性（`@Observable`、`@Bindable`）
- 遵循 SwiftUI 最佳实践
- 使用 `// MARK: -` 组织代码区块
- 私有方法放在 `private` extension 中

### 测试

测试文件位于 `Tests/` 目录：

- `test_streak.swift`: 连续打卡逻辑测试
- `test_time_logic.swift`: 时间计算测试
- `test_update_checker.swift`: 更新检查测试

### 调试技巧

1. **开发模式标识**：
   ```swift
   private static let isDev = Bundle.main.bundleIdentifier?.hasSuffix(".dev") == true
   ```

2. **菜单栏图标区分**：
   - 开发版使用不同的 SF Symbol
   - 便于同时运行开发版和正式版

3. **日志输出**：
   - 使用 `print()` 或 `os_log` 进行调试

---

## 附录

### 徽章列表

#### 连续打卡徽章

| 天数 | 名称 | 图标 |
|------|------|------|
| 3 | 迈出第一步 / First Steps | 👣 |
| 7 | 初心者 / Beginner | 🌱 |
| 14 | 习惯养成 / Habit Formed | 🌿 |
| 21 | 三周达人 / 3-Week Pro | 🌳 |
| 30 | 健康卫士 / Health Guardian | 🛡️ |
| 50 | 半百之约 / Half Century | ⭐ |
| 60 | 钢铁意志 / Iron Will | 💪 |
| 90 | 季度王者 / Quarter King | 👑 |
| 100 | 传奇坚持 / Legendary | 🏆 |
| 180 | 半年之星 / Half-Year Star | 💎 |
| 365 | 年度传说 / Annual Legend | 🐉 |

#### 累计打卡徽章

| 次数 | 名称 | 图标 |
|------|------|------|
| 10 | 初始积累 / First Ten | 📌 |
| 20 | 渐入佳境 / Getting Started | ✌️ |
| 50 | 半百积累 / Fifty Mark | 🎖️ |
| 100 | 百次里程 / Century | 💯 |
| 200 | 双百突破 / Double Century | 🎯 |
| 500 | 五百征途 / Five Hundred | 🚀 |
| 1000 | 千次大师 / Thousand Master | 🌟 |
| 2000 | 两千巅峰 / Two Thousand Peak | 🔥 |
| 5000 | 五千传奇 / Five Thousand Legend | 🏅 |

### 许可证

本项目采用 [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html) 许可证。

---

*文档生成日期: 2026-04-01*
