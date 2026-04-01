<template>
  <div class="settings-view">
    <div class="settings-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>设置</h2>
    </div>

    <div class="settings-content">
      <div class="setting-section">
        <h3>工作时长</h3>
        <div class="setting-item">
          <label>工作时长 (分钟)</label>
          <input 
            type="number" 
            v-model.number="state.config.workMinutes" 
            min="1" 
            max="240"
          />
        </div>
      </div>

      <div class="setting-section">
        <h3>休息设置</h3>
        <div class="setting-item">
          <label>休息时长 (秒)</label>
          <input 
            type="number" 
            v-model.number="state.config.breakSeconds" 
            min="10" 
            max="3600"
          />
        </div>
        <div class="setting-item">
          <label>休息前需要确认</label>
          <input type="checkbox" v-model="state.config.breakConfirm" />
        </div>
      </div>

      <div class="setting-section">
        <h3>每日目标</h3>
        <div class="setting-item">
          <label>每日目标 (次)</label>
          <input 
            type="number" 
            v-model.number="state.config.dailyGoal" 
            min="1" 
            max="24"
          />
        </div>
      </div>

      <div class="setting-section">
        <h3>声音</h3>
        <div class="setting-item">
          <label>启用声音</label>
          <input type="checkbox" v-model="state.config.soundEnabled" />
        </div>
      </div>

      <div class="setting-section">
        <h3>外观</h3>
        <div class="setting-item">
          <label>护眼模式</label>
          <input type="checkbox" v-model="state.config.eyeCareMode" />
        </div>
      </div>

      <div class="setting-section">
        <h3>长时间休息</h3>
        <div class="setting-item">
          <label>启用长时间休息</label>
          <input type="checkbox" v-model="state.config.longBreakEnabled" />
        </div>
        <div v-if="state.config.longBreakEnabled" class="setting-item">
          <label>长休息间隔 (周期)</label>
          <input 
            type="number" 
            v-model.number="state.config.longBreakInterval" 
            min="1" 
            max="10"
          />
        </div>
        <div v-if="state.config.longBreakEnabled" class="setting-item">
          <label>长休息时长 (秒)</label>
          <input 
            type="number" 
            v-model.number="state.config.longBreakSeconds" 
            min="60" 
            max="3600"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '../store'

export default {
  name: 'SettingsView',
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

    return {
      state,
      goBack
    }
  }
}
</script>

<style scoped>
.settings-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.settings-header {
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

.settings-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.settings-content {
  padding: 16px;
}

.setting-section {
  margin-bottom: 24px;
}

.setting-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #666;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.setting-item label {
  flex: 1;
}

.setting-item input[type="number"] {
  width: 80px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.setting-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
