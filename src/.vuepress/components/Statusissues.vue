<template>
    <div class="issues-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="hint-container note">
        <p class="hint-container-title">加载中</p>
        <p>正在获取事件信息...</p>
      </div>
  
      <!-- 错误状态 -->
      <div v-if="error" class="hint-container caution">
        <p class="hint-container-title">错误</p>
        <p>{{ error }}</p>
      </div>
  
      <!-- 活动事件 -->
      <div v-if="activeIncidents.length" class="hint-container warning">
        <p class="hint-container-title">当前活动事件</p>
        <div v-for="incident in activeIncidents" :key="incident.id" class="incident-card">
          <div class="incident-header">
            <span class="incident-status">进行中</span>
            <span class="incident-date">{{ formatDate(incident.created_at) }}</span>
          </div>
          <h3>{{ incident.title }}</h3>
          <p class="incident-body">{{ incident.body }}</p>
        </div>
      </div>
  
      <!-- 维护事件 -->
      <div v-if="maintenanceEvents.length" class="hint-container note">
        <p class="hint-container-title">维护事件</p>
        <div v-for="event in maintenanceEvents" :key="event.id" class="incident-card">
          <div class="incident-header">
            <span :class="['incident-status', event.state]">
              {{ event.state === 'open' ? '计划中' : '已完成' }}
            </span>
            <span class="incident-date">{{ formatDate(event.created_at) }}</span>
          </div>
          <h3>{{ event.title }}</h3>
          <p class="incident-body">{{ event.body }}</p>
        </div>
      </div>
  
      <!-- 历史事件 -->
      <div v-if="pastIncidents.length" class="hint-container tip">
        <p class="hint-container-title">历史事件</p>
        <div v-for="incident in pastIncidents" :key="incident.id" class="incident-card">
          <div class="incident-header">
            <span class="incident-status resolved">已解决</span>
            <span class="incident-date">{{ formatDate(incident.created_at) }}</span>
          </div>
          <h3>{{ incident.title }}</h3>
          <p class="incident-body">{{ incident.body }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true,
        error: null,
        activeIncidents: [],
        pastIncidents: [],
        maintenanceEvents: []
      }
    },
    mounted() {
      this.fetchAllIssues()
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date)
      },
      async fetchData(url) {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
      },
      async fetchAllIssues() {
        try {
          const [openStatus, openMaintenance, closedMaintenance, closedStatus] = await Promise.all([
            this.fetchData('https://api.github.com/repos/pysio2007/upptime/issues?state=open&labels=status'),
            this.fetchData('https://api.github.com/repos/pysio2007/upptime/issues?state=open&labels=maintenance'),
            this.fetchData('https://api.github.com/repos/pysio2007/upptime/issues?state=closed&labels=maintenance'),
            this.fetchData('https://api.github.com/repos/pysio2007/upptime/issues?state=closed&labels=status')
          ])
  
          this.activeIncidents = openStatus
          this.pastIncidents = closedStatus
          this.maintenanceEvents = [...openMaintenance, ...closedMaintenance].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        } catch (err) {
          this.error = `获取事件信息失败: ${err.message}`
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .issues-container {
    padding: 1rem;
  }
  
  .incident-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    margin: 0.5rem 0;
    background: white;
  }
  
  .incident-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .incident-status {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .incident-status.open {
    background-color: #ff9800;
    color: white;
  }
  
  .incident-status.closed,
  .incident-status.resolved {
    background-color: #4caf50;
    color: white;
  }
  
  .incident-date {
    color: #666;
    font-size: 0.9rem;
  }
  
  .incident-body {
    margin-top: 0.5rem;
    color: #444;
    white-space: pre-line;
  }
  
  h3 {
    margin: 0.5rem 0;
    color: #333;
  }
  </style>