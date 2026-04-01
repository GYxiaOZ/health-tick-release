<template>
  <div class="break-card">
    <div v-if="state.phase === 'alerting'" class="alerting-body">
      <div class="icon">🔔</div>
      <div v-if="state.currentReminder" class="reminder">{{ state.currentReminder }}</div>
      <button class="confirm-btn" @click="confirmBreak">
        好的，我去休息
      </button>
    </div>

    <div v-else-if="state.phase === 'breaking'" class="breaking-body">
      <div class="timer">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle
            cx="65"
            cy="65"
            r="60"
            fill="none"
            stroke="#e0e0e0"
            stroke-width="4"
          />
          <circle
            cx="65"
            cy="65"
            r="60"
            fill="none"
            stroke="#ff9800"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            transform="rotate(-90 65 65)"
          />
          <text x="65" y="65" text-anchor="middle" dominant-baseline="middle" class="time-text">
            {{ state.formattedTime }}
          </text>
          <text x="65" y="85" text-anchor="middle" dominant-baseline="middle" class="phase-text">
            {{ state.phaseLabel }}
          </text>
        </svg>
      </div>
      <div v-if="state.currentReminder" class="reminder">{{ state.currentReminder }}</div>
      <div class="activity" v-if="state.currentBreakActivity">
        <span class="activity-icon">{{ getActivityIcon(state.currentBreakActivity.icon) }}</span>
        <span class="activity-text">{{ state.currentBreakActivity.text }}</span>
      </div>
      <div v-if="state.breakWarning" class="warning">
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">{{ state.breakWarning }}</span>
      </div>
      <button class="skip-btn" @click="skipBreakClicked">
        跳过 ({{ state.breakSkipCount }}/{{ state.breakSkipNeeded }})
      </button>
    </div>

    <div v-else-if="state.phase === 'waiting'" class="waiting-body">
      <div class="icon">✅</div>
      <div class="message">休息结束啦！准备好继续工作了吗？</div>
      <button class="confirm-btn" @click="confirmReturn">
        我回来了
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '../store'

export default {
  name: 'BreakCardView',
  setup() {
    const state = useAppStore()

    const circumference = 2 * Math.PI * 60
    const dashOffset = computed(() => {
      const total = state.config.breakSeconds
      return circumference * (1 - (state.remainingSeconds / total))
    })

    const confirmBreak = () => {
      state.confirmBreak()
    }

    const confirmReturn = () => {
      state.confirmReturn()
    }

    const skipBreakClicked = () => {
      state.skipBreakClicked()
    }

    const getActivityIcon = (iconName) => {
      const iconMap = {
        'figure.walk': '🚶',
        'eye': '👁️',
        'drop.fill': '💧',
        'figure.flexibility': '🧘',
        'wind': '🌬️'
      }
      return iconMap[iconName] || '🏃'
    }

    return {
      state,
      circumference,
      dashOffset,
      confirmBreak,
      confirmReturn,
      skipBreakClicked,
      getActivityIcon
    }
  }
}
</script>

<style scoped>
.break-card {
  padding: 16px;
  text-align: center;
}

.alerting-body,
.breaking-body,
.waiting-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  font-size: 40px;
  margin-bottom: 16px;
  color: #ff9800;
}

.reminder {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
  line-height: 1.4;
}

.confirm-btn {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
}

.timer {
  margin-bottom: 16px;
}

.time-text {
  font-size: 32px;
  font-weight: 300;
  font-family: 'Courier New', monospace;
  fill: #333;
}

.phase-text {
  font-size: 12px;
  fill: rgba(0, 0, 0, 0.6);
}

.activity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0;
  color: rgba(76, 175, 80, 0.75);
  font-size: 12px;
}

.activity-icon {
  font-size: 14px;
}

.warning {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: rgba(255, 165, 0, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  margin: 8px 0;
  font-size: 11px;
  color: rgba(255, 165, 0, 0.9);
}

.warning-icon {
  font-size: 11px;
}

.skip-btn {
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.6);
  font-size: 11px;
  font-weight: 500;
  padding: 5px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 14px;
}

.skip-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.message {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 20px;
  line-height: 1.4;
}
</style>