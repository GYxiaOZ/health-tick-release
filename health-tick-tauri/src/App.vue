<template>
  <div class="app">
    <MenuView />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAppStore } from './store'
import MenuView from './components/MenuView.vue'

export default {
  name: 'App',
  components: {
    MenuView
  },
  setup() {
    const state = useAppStore()

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
      state
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
}
</style>