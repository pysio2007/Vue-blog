<template>
    <div>
      <div v-if="loading" class="hint-container note">
        <p class="hint-container-title">加载中</p>
        <p>正在获取Steam状态 这可能需要一些时间...</p>
      </div>
      <div v-else-if="error" class="hint-container caution">
        <p class="hint-container-title">错误</p>
        <p>{{ error }}</p>
      </div>
      <div v-else-if="status === '离线'" class="hint-container note">
        <p class="hint-container-title">离线</p>
        <p>熊猫没有运行Steam QAQ </p>
      </div>
      <div v-else-if="status === '在线'" class="hint-container tip">
        <p class="hint-container-title">在线</p>
        <p>熊猫在线!但是没有运行游戏 快去找他玩w!</p>
      </div>
      <div v-else-if="game" class="hint-container info">
        <p class="hint-container-title">熊猫正在玩: {{ game }} </p>
        <p>价格: {{ price }}</p>
        <p>{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true,
        error: null,
        status: '',
        game: '',
        price: '',
        description: ''
      }
    },
    mounted() {
      this.fetchSteamStatus()
    },
    methods: {
      async fetchSteamStatus() {
        try {
          const response = await fetch('https://blogapi.pysio.online/steam_status')
          const data = await response.json()
          
          if (data.status === "\u79bb\u7ebf") {
            this.status = '离线'
          } else if (data.status === "\u5728\u7ebf") {
            this.status = '在线'
          } else if (data.game) {
            this.game = data.game
            this.price = data.price
            this.description = data.description
          }
        } catch (error) {
          this.error = '获取Steam状态失败'
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>