<template>
  <div class="stats-detail-view">
    <div class="stats-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>统计详情</h2>
    </div>

    <div class="stats-content">
      <div class="stats-section">
        <h3>今日数据</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ state.todayDone }}</div>
            <div class="stat-label">完成次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ Math.floor(state.todayWorkMinutes / 60) }}h</div>
            <div class="stat-label">工作时长</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ state.todaySkipCount }}</div>
            <div class="stat-label">跳过休息</div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <h3>连续天数</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ state.currentStreak }}</div>
            <div class="stat-label">当前连续</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ state.maxStreak }}</div>
            <div class="stat-label">最长连续</div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <h3>总体数据</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ state.totalCount }}</div>
            <div class="stat-label">总完成次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ state.completedCycles }}</div>
            <div class="stat-label">完成周期</div>
          </div>
        </div>
      </div>

      <div v-if="state.earnedBadge" class="stats-section">
        <h3>获得徽章</h3>
        <div class="badge-card">
          <div class="badge-icon">{{ state.earnedBadge.icon }}</div>
          <div class="badge-name">{{ state.earnedBadge.name }}</div>
        </div>
      </div>

      <div v-if="state.nextBadge" class="stats-section">
        <h3>下一个徽章</h3>
        <div class="badge-card next">
          <div class="badge-icon">{{ state.nextBadge.icon }}</div>
          <div class="badge-name">{{ state.nextBadge.name }}</div>
          <div class="badge-progress">还需 {{ state.nextBadge.days - state.currentStreak }} 天</div>
        </div>
      </div>

      <div class="stats-section">
        <h3>本周数据</h3>
        <div class="week-chart">
          <div v-for="(day, index) in state.weekData" :key="index" class="day-bar">
            <div class="bar-container">
              <div 
                class="bar" 
                :style="{ height: (day.count / 10 * 100) + '%' }"
              ></div>
            </div>
            <div class="day-label">{{ getDayLabel(index) }}</div>
            <div class="day-count">{{ day.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '../store'

export default {
  name: 'StatsDetailView',
  props: {
    onBack: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const state = useAppStore()

    const goBack = () => {
      props.onBack()
    }

    const getDayLabel = (index) => {
      const days = ['日', '一', '二', '三', '四', '五', '六']
      return days[(new Date().getDay() + index) % 7]
    }

    return {
      state,
      goBack,
      getDayLabel
    }
  }
}
</script>

<style scoped>
.stats-detail-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.stats-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.stats-content {
  padding: 16px;
}

.stats-section {
  margin-bottom: 24px;
}

.stats-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stats-grid:has(.stat-card:nth-child(2)) {
  grid-template-columns: repeat(2, 1fr);
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.badge-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.badge-card.next {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
  opacity: 0.8;
}

.badge-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.badge-name {
  font-size: 16px;
  font-weight: 600;
}

.badge-progress {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.8;
}

.week-chart {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.day-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-container {
  height: 80px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.bar {
  width: 60%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.day-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.day-count {
  font-size: 14px;
  font-weight: 600;
}
</style>
