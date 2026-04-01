import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 配置
    config: {
      workMinutes: 60,
      breakSeconds: 120,
      eyeCareMode: false,
      dailyGoal: 8,
      reminders: ['该起来走走了', '该喝水了'],
      soundEnabled: true,
      breakDetectSound: false,
      breakPosition: 'menu_window',
      breakConfirm: true,
      alertSound: 'Glass',
      breakDetectSoundName: 'Tink',
      language: 'system',
      appearance: 'system',
      quietHours: [],
      workDays: [2, 3, 4, 5, 6],
      workHoursEnabled: false,
      workStartTime: '09:00',
      workEndTime: '18:00',
      autoPauseOnGoal: false,
      longBreakEnabled: false,
      longBreakInterval: 4,
      longBreakSeconds: 900,
      shortcutEnabled: false,
      shortcutKeyCode: 36,
      shortcutModifiers: 1048576
    },
    // 状态
    phase: 'working', // working, alerting, breaking, waiting, paused
    remainingSeconds: 0,
    todayDone: 0,
    currentStreak: 0,
    maxStreak: 0,
    breakWarning: '',
    breakSkipCount: 0,
    breakSkipNeeded: 3,
    lastSkipClickTime: null,
    weekData: [],
    totalCount: 0,
    todayWorkMinutes: 0,
    weekWorkData: [],
    isInQuietHours: false,
    skippedQuietReasons: new Set(),
    goalAutoStopped: false,
    showOnboarding: false,
    currentBreakActivity: null,
    currentReminder: null,
    celebrateBadge: null,
    todaySkipCount: 0,
    quietRemainingSeconds: 0,
    completedCycles: 0,
    // 内部状态
    currentSessionId: null,
    currentSessionWorkConfig: 0,
    breakStartDate: null,
    targetTime: new Date(),
    pausedRemaining: 0,
    pausedPhase: null,
    timer: null,
    alertRepeatTimer: null,
    quietCheckTimer: null,
    quietCountdownTimer: null,
    autoQuietPaused: false,
    lastActiveDate: new Date().toISOString().split('T')[0],
    lastWorkMinutesRefresh: new Date(0),
    pendingBadge: null
  }),
  getters: {
    formattedTime: (state) => {
      const m = Math.floor(state.remainingSeconds / 60)
      const s = state.remainingSeconds % 60
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    },
    phaseIcon: (state) => {
      switch (state.phase) {
        case 'working': return '🟢'
        case 'alerting': case 'breaking': return '🟡'
        case 'waiting': return '🔴'
        case 'paused': return '⏸'
        default: return '🟢'
      }
    },
    phaseLabel: (state) => {
      switch (state.phase) {
        case 'working': return '工作中'
        case 'alerting': return '该休息了！'
        case 'breaking': return '休息中'
        case 'waiting': return '等待确认...'
        case 'paused': return '已暂停'
        default: return '工作中'
      }
    },
    goalProgress: (state) => {
      return Math.min(state.todayDone, state.config.dailyGoal) / state.config.dailyGoal
    },
    earnedBadge: (state) => {
      const badges = [
        { days: 3, icon: '👣', name: '迈出第一步' },
        { days: 7, icon: '🌱', name: '初心者' },
        { days: 14, icon: '🌿', name: '习惯养成' },
        { days: 21, icon: '🌳', name: '三周达人' },
        { days: 30, icon: '🛡️', name: '健康卫士' },
        { days: 50, icon: '⭐', name: '半百之约' },
        { days: 60, icon: '💪', name: '钢铁意志' },
        { days: 90, icon: '👑', name: '季度王者' },
        { days: 100, icon: '🏆', name: '传奇坚持' },
        { days: 180, icon: '💎', name: '半年之星' },
        { days: 365, icon: '🐉', name: '年度传说' }
      ]
      return badges.reverse().find(badge => state.maxStreak >= badge.days)
    },
    nextBadge: (state) => {
      const badges = [
        { days: 3, icon: '👣', name: '迈出第一步' },
        { days: 7, icon: '🌱', name: '初心者' },
        { days: 14, icon: '🌿', name: '习惯养成' },
        { days: 21, icon: '🌳', name: '三周达人' },
        { days: 30, icon: '🛡️', name: '健康卫士' },
        { days: 50, icon: '⭐', name: '半百之约' },
        { days: 60, icon: '💪', name: '钢铁意志' },
        { days: 90, icon: '👑', name: '季度王者' },
        { days: 100, icon: '🏆', name: '传奇坚持' },
        { days: 180, icon: '💎', name: '半年之星' },
        { days: 365, icon: '🐉', name: '年度传说' }
      ]
      return badges.find(badge => state.currentStreak < badge.days)
    },
    earnedTotalBadges: (state) => {
      const totalBadges = [
        { days: 10, icon: '📌', name: '初始积累' },
        { days: 20, icon: '✌️', name: '渐入佳境' },
        { days: 50, icon: '🎖️', name: '半百积累' },
        { days: 100, icon: '💯', name: '百次里程' },
        { days: 200, icon: '🎯', name: '双百突破' },
        { days: 500, icon: '🚀', name: '五百征途' },
        { days: 1000, icon: '🌟', name: '千次大师' },
        { days: 2000, icon: '🔥', name: '两千巅峰' },
        { days: 5000, icon: '🏅', name: '五千传奇' }
      ]
      return totalBadges.filter(badge => state.totalCount >= badge.days)
    },
    nextTotalBadge: (state) => {
      const totalBadges = [
        { days: 10, icon: '📌', name: '初始积累' },
        { days: 20, icon: '✌️', name: '渐入佳境' },
        { days: 50, icon: '🎖️', name: '半百积累' },
        { days: 100, icon: '💯', name: '百次里程' },
        { days: 200, icon: '🎯', name: '双百突破' },
        { days: 500, icon: '🚀', name: '五百征途' },
        { days: 1000, icon: '🌟', name: '千次大师' },
        { days: 2000, icon: '🔥', name: '两千巅峰' },
        { days: 5000, icon: '🏅', name: '五千传奇' }
      ]
      return totalBadges.find(badge => state.totalCount < badge.days)
    }
  },
  actions: {
    startWork() {
      this.goalAutoStopped = false
      this.phase = 'working'
      this.currentSessionWorkConfig = this.config.workMinutes
      this.targetTime = new Date(Date.now() + this.config.workMinutes * 60 * 1000)
      this.remainingSeconds = this.config.workMinutes * 60
      this.startTicking()
    },
    startTicking() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (this.phase === 'working') {
          const newVal = Math.max(0, Math.floor((this.targetTime.getTime() - Date.now()) / 1000))
          if (newVal !== this.remainingSeconds) {
            this.remainingSeconds = newVal
          }
          if (this.remainingSeconds <= 0) {
            this.onWorkDone()
          }
        }
      }, 1000)
    },
    onWorkDone() {
      this.currentReminder = this.config.reminders[Math.floor(Math.random() * this.config.reminders.length)] || '该休息了'
      if (this.config.breakConfirm) {
        this.phase = 'alerting'
        this.remainingSeconds = 0
      } else {
        this.startBreak()
      }
    },
    confirmBreak() {
      this.phase = 'breaking'
      this.breakWarning = ''
      this.breakSkipCount = 0
      this.breakStartDate = new Date()
      const breakActivities = [
        { icon: 'figure.walk', text: '起来走走，活动一下身体' },
        { icon: 'eye', text: '远眺窗外，放松眼睛' },
        { icon: 'drop.fill', text: '喝杯水，补充水分' },
        { icon: 'figure.flexibility', text: '做几个简单的拉伸动作' },
        { icon: 'wind', text: '深呼吸，放松身心' }
      ]
      this.currentBreakActivity = breakActivities[Math.floor(Math.random() * breakActivities.length)]
      const isLongBreak = this.config.longBreakEnabled && 
        this.config.longBreakInterval > 0 && 
        this.completedCycles > 0 && 
        this.completedCycles % this.config.longBreakInterval === 0
      const secs = isLongBreak ? this.config.longBreakSeconds : this.config.breakSeconds
      this.remainingSeconds = secs
      // 休息倒计时逻辑
      this.startBreakTicking()
    },
    startBreakTicking() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (this.phase === 'breaking') {
          this.remainingSeconds--
          if (this.remainingSeconds <= 0) {
            this.onBreakDone()
          }
        }
      }, 1000)
    },
    onBreakDone() {
      this.phase = 'waiting'
      this.remainingSeconds = 0
      this.breakWarning = ''
      this.completedCycles++
      // 模拟添加记录
      this.todayDone++
      this.totalCount++
      this.refreshStats()
    },
    confirmReturn() {
      if (this.config.autoPauseOnGoal && this.todayDone >= this.config.dailyGoal) {
        this.goalAutoStopped = true
        this.phase = 'paused'
        this.remainingSeconds = 0
        if (this.timer) {
          clearInterval(this.timer)
        }
      } else {
        this.startWork()
      }
    },
    togglePause() {
      if (this.phase === 'paused' && this.pausedPhase) {
        this.phase = this.pausedPhase
        this.pausedPhase = null
        if (this.pausedPhase === 'working') {
          this.targetTime = new Date(Date.now() + this.pausedRemaining * 1000)
          this.remainingSeconds = this.pausedRemaining
          this.startTicking()
        }
      } else if (this.phase === 'working' || this.phase === 'breaking') {
        this.pausedRemaining = this.remainingSeconds
        this.pausedPhase = this.phase
        this.phase = 'paused'
        if (this.timer) {
          clearInterval(this.timer)
        }
      }
    },
    reset() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.phase = 'working'
      this.remainingSeconds = this.config.workMinutes * 60
      this.targetTime = new Date(Date.now() + this.remainingSeconds * 1000)
      this.startTicking()
    },
    refreshStats() {
      // 模拟统计数据
      this.weekData = [
        { date: '2026-03-25', count: 8 },
        { date: '2026-03-26', count: 7 },
        { date: '2026-03-27', count: 8 },
        { date: '2026-03-28', count: 6 },
        { date: '2026-03-29', count: 8 },
        { date: '2026-03-30', count: 0 },
        { date: '2026-03-31', count: this.todayDone }
      ]
      this.weekWorkData = [
        { date: '2026-03-25', minutes: 480 },
        { date: '2026-03-26', minutes: 420 },
        { date: '2026-03-27', minutes: 480 },
        { date: '2026-03-28', minutes: 360 },
        { date: '2026-03-29', minutes: 480 },
        { date: '2026-03-30', minutes: 0 },
        { date: '2026-03-31', minutes: this.todayWorkMinutes }
      ]
    },
    skipBreakClicked() {
      this.lastSkipClickTime = new Date()
      this.breakSkipCount++
      if (this.breakSkipCount >= this.breakSkipNeeded) {
        this.forceEndBreak()
      }
    },
    forceEndBreak() {
      if (this.phase === 'breaking') {
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.phase = 'working'
        this.remainingSeconds = this.config.workMinutes * 60
        this.targetTime = new Date(Date.now() + this.remainingSeconds * 1000)
        this.startTicking()
      }
    },
    checkQuietHours() {
      // 简化的休息时段检查
      const now = new Date()
      const hour = now.getHours()
      const minute = now.getMinutes()
      const currentTime = hour * 60 + minute
      
      // 检查是否在工作时间外
      if (this.config.workHoursEnabled) {
        const workStart = this.config.workStartTime.split(':').map(Number)
        const workEnd = this.config.workEndTime.split(':').map(Number)
        const workStartMinutes = workStart[0] * 60 + workStart[1]
        const workEndMinutes = workEnd[0] * 60 + workEnd[1]
        
        if (currentTime < workStartMinutes || currentTime >= workEndMinutes) {
          this.isInQuietHours = true
          if (this.phase === 'working') {
            this.togglePause()
          }
          return
        }
      }
      
      // 检查休息时段
      for (const period of this.config.quietHours) {
        const start = period.start.split(':').map(Number)
        const end = period.end.split(':').map(Number)
        const startMinutes = start[0] * 60 + start[1]
        const endMinutes = end[0] * 60 + end[1]
        
        if (startMinutes <= endMinutes) {
          if (currentTime >= startMinutes && currentTime < endMinutes) {
            this.isInQuietHours = true
            if (this.phase === 'working') {
              this.togglePause()
            }
            return
          }
        } else {
          if (currentTime >= startMinutes || currentTime < endMinutes) {
            this.isInQuietHours = true
            if (this.phase === 'working') {
              this.togglePause()
            }
            return
          }
        }
      }
      
      this.isInQuietHours = false
    }
  }
})