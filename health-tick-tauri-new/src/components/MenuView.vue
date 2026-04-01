<template>
  <div class="menu-view">
    <div class="header">
      <div v-if="state.todayDone >= state.config.dailyGoal" class="goal-reached">
        <span class="icon">✅</span>
        <span class="text">今日目标已完成！</span>
      </div>
      <div v-else-if="state.todaySkipCount >= 3" class="skip-warning">
        <span class="icon">⚠️</span>
        <span class="text">今日多次跳过休息，注意健康</span>
      </div>
      <div v-else-if="state.isInQuietHours || state.goalAutoStopped" class="quiet-hours">
        <span class="icon">🌙</span>
        <span class="text">休息时段中</span>
      </div>
    </div>

    <div v-if="isBreakPhase" class="break-card">
      <BreakCardView />
    </div>
    <div v-else class="timer-section">
      <MenuTimerCircle />
      <MenuStatsContent />
      <div class="divider"></div>
      <MenuControls />
    </div>

    <div class="divider"></div>
    <button class="quit-btn" @click="quitApp">退出 HealthTick</button>
  </div>
</template>

<script>
import { computed, inject } from 'vue'
import { useAppStore } from '../store'
import MenuTimerCircle from './MenuTimerCircle.vue'
import MenuStatsContent from './MenuStatsContent.vue'
import MenuControls from './MenuControls.vue'
import BreakCardView from './BreakCardView.vue'

export default {
  name: 'MenuView',
  components: {
    MenuTimerCircle,
    MenuStatsContent,
    MenuControls,
    BreakCardView
  },
  setup() {
    const state = useAppStore()
    
    const isBreakPhase = computed(() => {
      return !state.isInQuietHours && !state.goalAutoStopped && 
        (state.phase === 'alerting' || state.phase === 'breaking' || state.phase === 'waiting')
    })

    const quitApp = () => {
      // 退出应用
      window.close()
    }

    return {
      state,
      isBreakPhase,
      quitApp
    }
  }
}
</script>

<style scoped>
.menu-view {
  width: 240px;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.header {
  margin-bottom: 12px;
}

.goal-reached,
.skip-warning,
.quiet-hours {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.goal-reached {
  background-color: rgba(0, 128, 0, 0.1);
  color: green;
}

.skip-warning {
  background-color: rgba(255, 165, 0, 0.1);
  color: orange;
}

.quiet-hours {
  background-color: rgba(128, 0, 128, 0.1);
  color: purple;
}

.icon {
  font-size: 12px;
}

.break-card {
  margin-bottom: 12px;
}

.timer-section {
  margin-bottom: 12px;
}

.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 8px 4px;
}

.quit-btn {
  width: 100%;
  padding: 8px;
  border: none;
  background: none;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.75);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.quit-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>