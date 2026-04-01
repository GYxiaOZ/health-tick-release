<template>
  <div class="app">
    <div v-if="currentView === 'menu'" class="view-container">
      <MenuView />
      <div class="view-nav">
        <button class="nav-btn" @click="showSettings">
          ⚙️ 设置
        </button>
        <button class="nav-btn" @click="showStats">
          📊 统计
        </button>
      </div>
    </div>
    <div v-else-if="currentView === 'settings'" class="view-container">
      <SettingsView :on-back="showMenu" />
    </div>
    <div v-else-if="currentView === 'stats'" class="view-container">
      <StatsDetailView :on-back="showMenu" />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useAppStore } from './store'
import MenuView from './components/MenuView.vue'
import SettingsView from './components/SettingsView.vue'
import StatsDetailView from './components/StatsDetailView.vue'

export default {
  name: 'App',
  components: {
    MenuView,
    SettingsView,
    StatsDetailView
  },
  setup() {
    const state = useAppStore()
    const currentView = ref('menu')

    const showMenu = () => {
      currentView.value = 'menu'
    }

    const showSettings = () => {
      currentView.value = 'settings'
    }

    const showStats = () => {
      currentView.value = 'stats'
    }

    onMounted(() => {
      // 初始化应用
      state.startWork()
      state.refreshStats()
      // 每30秒检查一次休息时段
      setInterval(() => {
        state.checkQuietHours()
      }, 30000)
    })

    return {
      state,
      currentView,
      showMenu,
      showSettings,
      showStats
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f7;
  color: #1d1d1f;
}

.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(245, 245, 247, 0.95);
  backdrop-filter: blur(10px);
}

.view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.view-nav {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}

.nav-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: #e0e0e0;
}
</style>