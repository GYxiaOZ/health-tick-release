<template>
  <div class="stats-content">
    <!-- 今日进度 -->
    <div class="today-progress">
      <div class="stat-item">
        <div class="value">{{ state.todayDone }}</div>
        <div class="label">已完成</div>
      </div>
      <div class="stat-item">
        <div class="value">{{ state.config.dailyGoal }}</div>
        <div class="label">目标</div>
      </div>
      <div class="stat-item">
        <div class="value">{{ state.currentStreak }}</div>
        <div class="label">连续</div>
      </div>
      <div v-if="state.todaySkipCount > 0" class="stat-item">
        <div class="value skip">{{ state.todaySkipCount }}</div>
        <div class="label">跳过</div>
      </div>
    </div>

    <!-- 今日工时 -->
    <div class="work-time">
      <span class="icon">✍️</span>
      <span class="text">今日已工作</span>
      <span class="time">{{ formatWorkTime(state.todayWorkMinutes) }}</span>
      <button class="share-btn" @click="share">
        <span class="icon">📤</span>
      </button>
    </div>

    <!-- 7天数据 -->
    <div class="week-data">
      <div v-for="(item, index) in state.weekData" :key="index" class="day-item">
        <div class="bar" :style="{ height: `${Math.max(10, (item.count / state.config.dailyGoal) * 80)}%`, backgroundColor: getBarColor(item.count) }"></div>
        <div class="day">{{ getDayLabel(item.date) }}</div>
      </div>
    </div>

    <!-- 徽章提示 -->
    <div v-if="state.nextBadge" class="badge-hint">
      <span>🎯</span>
      <span>距 {{ state.nextBadge.icon }} {{ state.nextBadge.name }} 还差 {{ state.nextBadge.days - state.currentStreak }} 天</span>
    </div>
    <div v-else-if="state.earnedBadge" class="badge-hint">
      <span>{{ state.earnedBadge.icon }}</span>
      <span>{{ state.earnedBadge.name }}</span>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '../store'

export default {
  name: 'MenuStatsContent',
  setup() {
    const state = useAppStore()

    const formatWorkTime = (minutes) => {
      if (minutes < 60) {
        return `${minutes}分钟`
      }
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`
    }

    const getDayLabel = (dateStr) => {
      const date = new Date(dateStr)
      return date.getDate().toString()
    }

    const getBarColor = (count) => {
      if (count === 0) return '#e0e0e0'
      if (count >= state.config.dailyGoal) return '#4caf50'
      return 'rgba(76, 175, 80, 0.35)'
    }

    const share = () => {
      // 分享功能
      console.log('分享')
    }

    return {
      state,
      formatWorkTime,
      getDayLabel,
      getBarColor,
      share
    }
  }
}
</script>

<style scoped>
.stats-content {
  margin-top: 16px;
}

.today-progress {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-item .value {
  font-size: 18px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #333;
  margin-bottom: 2px;
}

.stat-item .value.skip {
  color: #f44336;
}

.stat-item .label {
  font-size: 9px;
  color: rgba(0, 0, 0, 0.5);
}

.work-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  margin-bottom: 16px;
}

.work-time .icon {
  font-size: 12px;
}

.work-time .text {
  color: rgba(0, 0, 0, 0.6);
}

.work-time .time {
  font-size: 12px;
  font-weight: 600;
  color: #2196f3;
  margin-left: 4px;
}

.share-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.share-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.share-btn .icon {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.35);
}

.week-data {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.day-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.bar {
  width: 22px;
  min-height: 4px;
  border-radius: 3px;
  position: relative;
}

.bar::after {
  content: attr(data-count);
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 500;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.day {
  font-size: 8px;
  color: rgba(0, 0, 0, 0.45);
}

.badge-hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  margin-top: 8px;
  padding: 4px;
  border-radius: 4px;
  background-color: rgba(76, 175, 80, 0.1);
}

.badge-hint span:first-child {
  margin-right: 4px;
}
</style>