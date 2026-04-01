<template>
  <div class="menu-controls">
    <button class="control-btn" @click="togglePause">
      <div class="icon">{{ state.phase === 'paused' ? '▶️' : '⏸️' }}</div>
      <div class="label">{{ state.phase === 'paused' ? '继续' : '暂停' }}</div>
    </button>
    <button class="control-btn" @click="reset">
      <div class="icon">🔄</div>
      <div class="label">重置</div>
    </button>
    <div class="spacer"></div>
    <button class="control-btn" @click="openStats">
      <div class="icon">🏆</div>
      <div class="label">成就</div>
    </button>
    <button class="control-btn" @click="openHelp">
      <div class="icon">❓</div>
      <div class="label">帮助</div>
    </button>
    <button class="control-btn" @click="openSettings">
      <div class="icon">⚙️</div>
      <div class="label">设置</div>
    </button>
  </div>
</template>

<script>
import { useAppStore } from '../store'

export default {
  name: 'MenuControls',
  setup() {
    const state = useAppStore()

    const togglePause = () => {
      if (state.goalAutoStopped) {
        state.goalAutoStopped = false
        state.startWork()
      } else {
        state.togglePause()
      }
    }

    const reset = () => {
      state.reset()
    }

    const openStats = () => {
      // 打开统计窗口
      console.log('打开统计窗口')
    }

    const openHelp = () => {
      // 打开帮助窗口
      console.log('打开帮助窗口')
    }

    const openSettings = () => {
      // 打开设置窗口
      console.log('打开设置窗口')
    }

    return {
      state,
      togglePause,
      reset,
      openStats,
      openHelp,
      openSettings
    }
  }
}
</script>

<style scoped>
.menu-controls {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  width: 36px;
  height: 32px;
}

.control-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.control-btn .icon {
  font-size: 13px;
}

.control-btn .label {
  font-size: 9px;
  color: rgba(0, 0, 0, 0.5);
}

.spacer {
  flex: 1;
}
</style>