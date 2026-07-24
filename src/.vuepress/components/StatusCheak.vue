<template>
  <div class="status-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="hint-container note">
      <p class="hint-container-title">加载中</p>
      <p>正在获取服务状态信息...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="hint-container caution">
      <p class="hint-container-title">错误</p>
      <p>{{ error }}</p>
    </div>

    <template v-else>
      <!-- 总体状态横幅 -->
      <div :class="['hint-container', overallStatus.hintClass]">
        <p class="hint-container-title">{{ pageTitle || '服务状态' }}</p>
        <p class="overall-line">
          <span class="status-dot" :class="overallStatus.dotClass"></span>
          {{ overallStatus.text }}
        </p>
      </div>

      <!-- 进行中的事件 -->
      <section v-if="ongoingIncidents.length" class="status-section">
        <h3 class="section-title">⚠️ 进行中的事件</h3>
        <div class="incident-grid">
          <a
            v-for="(inc, idx) in ongoingIncidents"
            :key="incidentKey(inc, idx)"
            :href="pageUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="incident-card"
          >
            <div class="incident-card-header">
              <span :class="['impact-badge', impactClass(inc)]">{{ impactLabel(inc) }}</span>
              <span v-if="incidentDate(inc)" class="incident-date">{{ formatDate(incidentDate(inc)) }}</span>
            </div>
            <h4>{{ incidentName(inc) }}</h4>
            <p v-if="incidentMessage(inc)" class="incident-msg">{{ incidentMessage(inc) }}</p>
          </a>
        </div>
      </section>

      <!-- 正在进行的维护 -->
      <section v-if="inProgressMaintenances.length" class="status-section">
        <h3 class="section-title">🛠️ 正在进行的维护</h3>
        <div class="incident-grid">
          <a
            v-for="(m, idx) in inProgressMaintenances"
            :key="incidentKey(m, idx)"
            :href="pageUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="incident-card"
          >
            <div class="incident-card-header">
              <span :class="['impact-badge', impactClass(m)]">{{ impactLabel(m) }}</span>
              <span v-if="incidentDate(m)" class="incident-date">{{ formatDate(incidentDate(m)) }}</span>
            </div>
            <h4>{{ incidentName(m) }}</h4>
            <p v-if="incidentMessage(m)" class="incident-msg">{{ incidentMessage(m) }}</p>
          </a>
        </div>
      </section>

      <!-- 计划中的维护 -->
      <section v-if="scheduledMaintenances.length" class="status-section">
        <h3 class="section-title">📅 计划中的维护</h3>
        <div class="incident-grid">
          <a
            v-for="(m, idx) in scheduledMaintenances"
            :key="incidentKey(m, idx)"
            :href="pageUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="incident-card"
          >
            <div class="incident-card-header">
              <span :class="['impact-badge', impactClass(m)]">{{ impactLabel(m) }}</span>
              <span v-if="incidentDate(m)" class="incident-date">{{ formatDate(incidentDate(m)) }}</span>
            </div>
            <h4>{{ incidentName(m) }}</h4>
            <p v-if="incidentMessage(m)" class="incident-msg">{{ incidentMessage(m) }}</p>
          </a>
        </div>
      </section>

      <!-- 链接到完整状态页 -->
      <p v-if="pageUrl" class="status-footer">
        <a :href="pageUrl" target="_blank" rel="noopener noreferrer">
          在 {{ pageTitle || '状态页' }} 查看完整状态 →
        </a>
      </p>
    </template>
  </div>
</template>

<script>
// incident.io 公共状态页 Widget API (只读)
// https://docs.incident.io/status-pages/api
const SUMMARY_URL = 'https://status.akae.re/api/v1/summary'

export default {
  name: 'StatusCheck',
  data() {
    return {
      loading: true,
      error: null,
      summary: null,
    }
  },
  mounted() {
    this.fetchStatusData()
  },
  computed: {
    pageTitle() {
      return this.summary?.page_title || ''
    },
    pageUrl() {
      return this.summary?.page_url || 'https://status.akae.re/'
    },
    ongoingIncidents() {
      return this.summary?.ongoing_incidents || []
    },
    inProgressMaintenances() {
      return this.summary?.in_progress_maintenances || []
    },
    scheduledMaintenances() {
      return this.summary?.scheduled_maintenances || []
    },
    overallStatus() {
      if (this.ongoingIncidents.length) {
        const worst = this.worstImpactLabel(this.ongoingIncidents)
        return {
          hintClass: 'caution',
          dotClass: 'down',
          text: `存在 ${this.ongoingIncidents.length} 个进行中的事件${worst ? `（${worst}）` : ''}`,
        }
      }
      if (this.inProgressMaintenances.length) {
        return {
          hintClass: 'note',
          dotClass: 'maintenance',
          text: `正在进行 ${this.inProgressMaintenances.length} 项维护`,
        }
      }
      if (this.scheduledMaintenances.length) {
        return {
          hintClass: 'warning',
          dotClass: 'maintenance',
          text: `已计划 ${this.scheduledMaintenances.length} 项维护`,
        }
      }
      return {
        hintClass: 'tip',
        dotClass: 'up',
        text: '全部系统正常运行',
      }
    },
  },
  methods: {
    async fetchStatusData() {
      try {
        const response = await fetch(SUMMARY_URL)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.summary = await response.json()
      } catch (err) {
        this.error = `获取状态信息失败: ${err.message}`
      } finally {
        this.loading = false
      }
    },

    // ---- 防御性字段访问（兼容 incident.io widget API 的实际返回）----
    incidentKey(item, idx) {
      return item?.id != null ? item.id : item?.name || idx
    },
    incidentName(item) {
      return item?.name || '未命名事件'
    },
    impactValue(item) {
      // 不同事件类型字段名不同，逐一兼容
      return (
        item?.current_worst_impact ||
        item?.impact ||
        item?.incident_status ||
        item?.maintenance_status ||
        item?.status ||
        ''
      )
    },
    lastUpdate(item) {
      const upds = item?.updates
      if (Array.isArray(upds) && upds.length) {
        return upds[upds.length - 1]
      }
      return null
    },
    incidentMessage(item) {
      const last = this.lastUpdate(item)
      if (last?.message) return last.message
      return item?.last_update_message || item?.message || ''
    },
    incidentDate(item) {
      const last = this.lastUpdate(item)
      if (last?.published_at) return last.published_at
      return item?.updated_at || item?.started_at || item?.published_at || ''
    },

    // ---- 展示映射 ----
    impactLabel(item) {
      const map = {
        operational: '正常',
        degraded_performance: '性能下降',
        partial_outage: '部分中断',
        full_outage: '全面中断',
        investigating: '调查中',
        identified: '已定位',
        monitoring: '监控中',
        resolved: '已解决',
        maintenance_scheduled: '已计划维护',
        maintenance_in_progress: '维护中',
        in_progress: '进行中',
        scheduled: '已计划',
      }
      const v = this.impactValue(item)
      return map[v] || (v ? v : '事件')
    },
    impactClass(item) {
      const v = this.impactValue(item)
      if (v === 'full_outage' || v === 'partial_outage') return 'impact-critical'
      if (v === 'degraded_performance') return 'impact-warning'
      if (
        v === 'maintenance_scheduled' ||
        v === 'maintenance_in_progress' ||
        v === 'in_progress' ||
        v === 'scheduled'
      ) {
        return 'impact-maintenance'
      }
      return 'impact-info'
    },
    worstImpactLabel(incidents) {
      // 从严重到轻
      const order = ['full_outage', 'partial_outage', 'degraded_performance']
      for (const lvl of order) {
        if (incidents.some((i) => this.impactValue(i) === lvl)) {
          return this.impactLabel({ current_worst_impact: lvl })
        }
      }
      return ''
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    },
  },
}
</script>

<style scoped>
.status-container {
  padding: 1rem;
}

.overall-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.up {
  background-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.25);
}

.status-dot.down {
  background-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.25);
}

.status-dot.maintenance {
  background-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.25);
}

.status-section {
  margin-top: 1.5rem;
}

.section-title {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.incident-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.incident-card {
  display: block;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: var(--bg-color, #fff);
  color: inherit;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.incident-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.incident-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.impact-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
}

.impact-critical {
  background-color: #f44336;
}

.impact-warning {
  background-color: #ff9800;
}

.impact-maintenance {
  background-color: #2196f3;
}

.impact-info {
  background-color: #607d8b;
}

.incident-date {
  color: #888;
  font-size: 0.85rem;
}

.incident-card h4 {
  margin: 0.25rem 0 0.5rem;
}

.incident-msg {
  margin: 0;
  color: #555;
  white-space: pre-line;
  font-size: 0.92rem;
  line-height: 1.5;
}

.status-footer {
  margin-top: 1.5rem;
  text-align: right;
  font-size: 0.9rem;
}

.status-footer a {
  color: var(--vp-c-brand, #2196f3);
}
</style>
