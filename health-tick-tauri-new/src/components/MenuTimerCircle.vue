<template>
  <div class="timer-circle">
    <div class="circle-container">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <!-- 背景圆环 -->
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#e0e0e0"
          stroke-width="3"
        />
        <!-- 进度圆环 -->
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          :stroke="phaseColor"
          stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div class="timer-content">
        <template v-if="isOffDuty">
          <button class="continue-btn" @click="continueWorking">
            <div class="icon">⚡</div>
            <div class="text">点击继续工作</div>
          </button>
        </template>
        <template v-else>
          <div class="time">{{ state.formattedTime }}</div>
          <button v-if="state.phase === 'working'" class="break-btn" @click="manualBreak">
            <div class="icon">☕</div>
            <div class="text">去休息</div>
          </button>
          <div v-else class="phase-label">{{ state.phaseLabel }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '../store'

export default {
  name: 'MenuTimerCircle',
  setup() {
    const state = useAppStore()

    const isOffDuty = computed(() => {
      return state.isInQuietHours || state.goalAutoStopped
    })

    const timerProgress = computed(() => {
      if (isOffDuty.value) {
        return 0
      }
      if (state.phase === 'working' || (state.phase === 'paused' && state.remainingSeconds > 0)) {
        const total = state.config.workMinutes * 60
        return total > 0 ? state.remainingSeconds / total : 0
      }
      return 0
    })

    const phaseColor = computed(() => {
      if (isOffDuty.value) return '#ff9800'
      switch (state.phase) {
        case 'working': return '#4caf50'
        case 'breaking': return '#ff9800'
        case 'alerting': return '#f44336'
        case 'paused': return '#ff9800'
        case 'waiting': return '#2196f3'
        default: return '#4caf50'
      }
    })

    const circumference = 2 * Math.PI * 54
    const dashOffset = computed(() => {
      return circumference * (1 - timerProgress.value)
    })

    const continueWorking = () => {
      if (state.goalAutoStopped) {
        state.goalAutoStopped = false
        state.startWork()
      } else {
        state.isInQuietHours = false
        state.startWork()
      }
    }

    const manualBreak = () => {
      state.confirmBreak()
    }

    return {
      state,
      isOffDuty,
      phaseColor,
      circumference,
      dashOffset,
      continueWorking,
      manualBreak
    }
  }
}
</script>

<style scoped>
.timer-circle {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.circle-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.timer-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.time {
  font-size: 28px;
  font-weight: 300;
  font-family: 'Courier New', monospace;
  color: #333;
}

.phase-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 4px;
}

.break-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.5);
  font-size: 11px;
  font-weight: 500;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.break-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.break-btn .icon {
  font-size: 10px;
}

.continue-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #ff9800;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.continue-btn:hover {
  background-color: rgba(255, 152, 0, 0.1);
}

.continue-btn .icon {
  font-size: 18px;
}

.continue-btn .text {
  font-size: 11px;
  font-weight: 500;
}
</style>