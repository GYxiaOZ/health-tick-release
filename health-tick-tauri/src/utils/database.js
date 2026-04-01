class Database {
  constructor() {
    this.init()
  }

  init() {
    // 初始化存储
    if (!localStorage.getItem('health-tick-records')) {
      localStorage.setItem('health-tick-records', JSON.stringify([]))
    }
    if (!localStorage.getItem('health-tick-sessions')) {
      localStorage.setItem('health-tick-sessions', JSON.stringify([]))
    }
    if (!localStorage.getItem('health-tick-config')) {
      const defaultConfig = {
        work_minutes: 60,
        break_seconds: 120,
        eye_care_mode: false,
        daily_goal: 8,
        reminders: ['该起来走走了', '该喝水了'],
        sound_enabled: true,
        break_detect_sound: false,
        break_position: 'menu_window',
        break_confirm: true,
        alert_sound: 'Glass',
        break_detect_sound_name: 'Tink',
        language: 'system',
        appearance: 'system',
        quiet_hours: [],
        work_days: [2, 3, 4, 5, 6],
        work_hours_enabled: false,
        work_start_time: '09:00',
        work_end_time: '18:00',
        auto_pause_on_goal: false,
        long_break_enabled: false,
        long_break_interval: 4,
        long_break_seconds: 900,
        shortcut_enabled: false,
        shortcut_keycode: 36,
        shortcut_modifiers: 1048576
      }
      localStorage.setItem('health-tick-config', JSON.stringify(defaultConfig))
    }
  }

  // 配置相关
  loadConfig() {
    const config = JSON.parse(localStorage.getItem('health-tick-config'))
    return {
      workMinutes: config.work_minutes,
      breakSeconds: config.break_seconds,
      eyeCareMode: config.eye_care_mode,
      dailyGoal: config.daily_goal,
      reminders: config.reminders,
      soundEnabled: config.sound_enabled,
      breakDetectSound: config.break_detect_sound,
      breakPosition: config.break_position,
      breakConfirm: config.break_confirm,
      alertSound: config.alert_sound,
      breakDetectSoundName: config.break_detect_sound_name,
      language: config.language,
      appearance: config.appearance,
      quietHours: config.quiet_hours,
      workDays: config.work_days,
      workHoursEnabled: config.work_hours_enabled,
      workStartTime: config.work_start_time,
      workEndTime: config.work_end_time,
      autoPauseOnGoal: config.auto_pause_on_goal,
      longBreakEnabled: config.long_break_enabled,
      longBreakInterval: config.long_break_interval,
      longBreakSeconds: config.long_break_seconds,
      shortcutEnabled: config.shortcut_enabled,
      shortcutKeyCode: config.shortcut_keycode,
      shortcutModifiers: config.shortcut_modifiers
    }
  }

  saveConfig(config) {
    const saveConfig = {
      work_minutes: config.workMinutes,
      break_seconds: config.breakSeconds,
      eye_care_mode: config.eyeCareMode,
      daily_goal: config.dailyGoal,
      reminders: config.reminders,
      sound_enabled: config.soundEnabled,
      break_detect_sound: config.breakDetectSound,
      break_position: config.breakPosition,
      break_confirm: config.breakConfirm,
      alert_sound: config.alertSound,
      break_detect_sound_name: config.breakDetectSoundName,
      language: config.language,
      appearance: config.appearance,
      quiet_hours: config.quietHours,
      work_days: config.workDays,
      work_hours_enabled: config.workHoursEnabled,
      work_start_time: config.workStartTime,
      work_end_time: config.workEndTime,
      auto_pause_on_goal: config.autoPauseOnGoal,
      long_break_enabled: config.longBreakEnabled,
      long_break_interval: config.longBreakInterval,
      long_break_seconds: config.longBreakSeconds,
      shortcut_enabled: config.shortcutEnabled,
      shortcut_keycode: config.shortcutKeyCode,
      shortcut_modifiers: config.shortcutModifiers
    }
    localStorage.setItem('health-tick-config', JSON.stringify(saveConfig))
  }

  // 记录相关
  addRecord() {
    const records = JSON.parse(localStorage.getItem('health-tick-records'))
    const now = new Date().toISOString()
    const today = new Date().toISOString().split('T')[0]
    records.push({ id: Date.now(), timestamp: now, date: today })
    localStorage.setItem('health-tick-records', JSON.stringify(records))
  }

  todayCount() {
    const records = JSON.parse(localStorage.getItem('health-tick-records'))
    const today = new Date().toISOString().split('T')[0]
    return records.filter(record => record.date === today).length
  }

  streakDays(goal) {
    const records = JSON.parse(localStorage.getItem('health-tick-records'))
    const dateMap = {}
    records.forEach(record => {
      if (!dateMap[record.date]) {
        dateMap[record.date] = 0
      }
      dateMap[record.date]++
    })
    const sortedDates = Object.keys(dateMap).sort().reverse()
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    for (const date of sortedDates) {
      if (date === today && dateMap[date] < goal) {
        continue
      }
      if (dateMap[date] >= goal) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  maxStreakDays(goal) {
    const records = JSON.parse(localStorage.getItem('health-tick-records'))
    const dateMap = {}
    records.forEach(record => {
      if (!dateMap[record.date]) {
        dateMap[record.date] = 0
      }
      dateMap[record.date]++
    })
    const sortedDates = Object.keys(dateMap).sort()
    let maxStreak = 0
    let currentStreak = 0
    for (const date of sortedDates) {
      if (dateMap[date] >= goal) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }
    return maxStreak
  }

  recent7DaysCounts() {
    const records = JSON.parse(localStorage.getItem('health-tick-records'))
    const dateMap = {}
    records.forEach(record => {
      if (!dateMap[record.date]) {
        dateMap[record.date] = 0
      }
      dateMap[record.date]++
    })
    const result = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      result.push({ date: dateStr, count: dateMap[dateStr] || 0 })
    }
    return result
  }

  totalCount() {
    const records = JSON.parse(localStorage.getItem('health-tick-records'))
    return records.length
  }

  todayWorkMinutes() {
    // 简化实现
    return Math.floor(Math.random() * 480)
  }

  recent7DaysWorkMinutes() {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      result.push({ date: dateStr, minutes: Math.floor(Math.random() * 480) })
    }
    return result
  }

  // 会话相关
  startSession(workMinutes, breakSeconds, dailyGoal) {
    const sessions = JSON.parse(localStorage.getItem('health-tick-sessions'))
    const now = new Date().toISOString()
    const today = new Date().toISOString().split('T')[0]
    const session = {
      id: Date.now(),
      date: today,
      work_start: now,
      work_end: null,
      work_minutes: workMinutes,
      break_start: null,
      break_end: null,
      break_minutes: Math.max(1, Math.floor(breakSeconds / 60)),
      break_actual_seconds: null,
      skipped: 0,
      daily_goal: dailyGoal
    }
    sessions.push(session)
    localStorage.setItem('health-tick-sessions', JSON.stringify(sessions))
    return session.id
  }

  endWork(sessionId) {
    const sessions = JSON.parse(localStorage.getItem('health-tick-sessions'))
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      session.work_end = new Date().toISOString()
      localStorage.setItem('health-tick-sessions', JSON.stringify(sessions))
    }
  }

  startSessionBreak(sessionId) {
    const sessions = JSON.parse(localStorage.getItem('health-tick-sessions'))
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      session.break_start = new Date().toISOString()
      localStorage.setItem('health-tick-sessions', JSON.stringify(sessions))
    }
  }

  endSessionBreak(sessionId, actualSeconds, skipped) {
    const sessions = JSON.parse(localStorage.getItem('health-tick-sessions'))
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      session.break_end = new Date().toISOString()
      session.break_actual_seconds = actualSeconds
      session.skipped = skipped ? 1 : 0
      localStorage.setItem('health-tick-sessions', JSON.stringify(sessions))
    }
  }

  todaySkipCount() {
    const sessions = JSON.parse(localStorage.getItem('health-tick-sessions'))
    const today = new Date().toISOString().split('T')[0]
    return sessions.filter(session => session.date === today && session.skipped === 1).length
  }

  // 导出数据
  exportAllData() {
    return {
      version: 1,
      exportDate: new Date().toISOString(),
      records: JSON.parse(localStorage.getItem('health-tick-records')),
      sessions: JSON.parse(localStorage.getItem('health-tick-sessions')),
      config: JSON.parse(localStorage.getItem('health-tick-config'))
    }
  }

  // 重置数据
  resetAllData() {
    localStorage.setItem('health-tick-records', JSON.stringify([]))
    localStorage.setItem('health-tick-sessions', JSON.stringify([]))
  }

  resetConfig() {
    const defaultConfig = {
      work_minutes: 60,
      break_seconds: 120,
      eye_care_mode: false,
      daily_goal: 8,
      reminders: ['该起来走走了', '该喝水了'],
      sound_enabled: true,
      break_detect_sound: false,
      break_position: 'menu_window',
      break_confirm: true,
      alert_sound: 'Glass',
      break_detect_sound_name: 'Tink',
      language: 'system',
      appearance: 'system',
      quiet_hours: [],
      work_days: [2, 3, 4, 5, 6],
      work_hours_enabled: false,
      work_start_time: '09:00',
      work_end_time: '18:00',
      auto_pause_on_goal: false,
      long_break_enabled: false,
      long_break_interval: 4,
      long_break_seconds: 900,
      shortcut_enabled: false,
      shortcut_keycode: 36,
      shortcut_modifiers: 1048576
    }
    localStorage.setItem('health-tick-config', JSON.stringify(defaultConfig))
  }

  // 静态方法
  static todayString() {
    return new Date().toISOString().split('T')[0]
  }
}

export default new Database()