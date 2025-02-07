<template>
    <div class="status-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="hint-container note">
        <p class="hint-container-title">加载中</p>
        <p>正在获取服务状态信息...</p>
      </div>
  
      <!-- 错误状态 -->
      <div v-if="error" class="hint-container caution">
        <p class="hint-container-title">错误</p>
        <p>{{ error }}</p>
      </div>
  
      <!-- 状态卡片 -->
      <div v-if="filteredServices" class="status-grid">
        <div v-for="service in filteredServices" 
             :key="service.name" 
             class="status-card"
             @click="showCharts(service)">
          <!-- 服务标题和图标 -->
          <div class="service-header">
            <img v-if="service.icon" :src="service.icon" :alt="service.name" class="service-icon">
            <h3>{{ service.name }}</h3>
          </div>
  
          <!-- 状态指示器 -->
          <div :class="['status-indicator', service.status]">
            {{ service.status === 'up' ? '正常' : '故障' }}
          </div>
  
          <!-- 统计信息 -->
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">可用性:</span>
              <span class="stat-value">{{ service.uptime }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">响应时间:</span>
              <span class="stat-value">{{ service.time }}ms</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">今日可用性:</span>
              <span class="stat-value">{{ service.uptimeDay }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">本月可用性:</span>
              <span class="stat-value">{{ service.uptimeMonth }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表模态框 -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeModal">&times;</button>
          <h2>{{ selectedService.name }} 响应时间统计</h2>
          
          <!-- 自绘图表区域 -->
          <div class="custom-charts-container">
            <div class="chart-item">
              <h3>近30天响应时间趋势</h3>
              <canvas ref="dayChart"></canvas>
              <div class="chart-loading" v-if="chartLoading">加载中...</div>
            </div>
          </div>

          <!-- 原始图表区域 -->
          <div class="charts-container">
            <div class="chart-item">
              <h3>24小时响应时间</h3>
              <img :src="getChartUrl(selectedService.slug, 'day')" alt="24小时响应时间">
            </div>
            <!-- <div class="chart-item">
              <h3>一周响应时间</h3>
              <img :src="getChartUrl(selectedService.slug, 'week')" alt="一周响应时间">
            </div>
            <div class="chart-item">
              <h3>一月响应时间</h3>
              <img :src="getChartUrl(selectedService.slug, 'month')" alt="一月响应时间">
            </div> -->
            <div class="chart-item">
              <h3>一年响应时间</h3>
              <img :src="getChartUrl(selectedService.slug, 'year')" alt="一年响应时间">
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto'

  export default {
    name: "StatusCheck",
    data() {
      return {
        loading: true,
        error: null,
        services: null,
        showModal: false,
        selectedService: null,
        chartLoading: false,
        chartInstance: null,
        commitData: [],
        filterParam: null
      }
    },
    mounted() {
      this.fetchStatusData()
      const searchParams = new URLSearchParams(window.location.search)
      this.filterParam = [...searchParams.keys()][0] || null
    },
    computed: {
      filteredServices() {
        if (!this.services) return null
        if (!this.filterParam) return this.services
        const prefix = `${this.filterParam}-`
        return this.services?.filter(s => s.name?.startsWith(prefix)) ?? null
      }
    },
    methods: {
      async fetchStatusData() {
        try {
          const response = await fetch('https://files.pysio.online/status/summary.json')
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          this.services = await response.json()
        } catch (err) {
          this.error = `获取状态信息失败: ${err.message}`
        } finally {
          this.loading = false
        }
      },
      async showCharts(service) {
        this.selectedService = service;
        this.showModal = true;
        this.chartLoading = true;
        
        await this.fetchCommitHistory(service.slug);
        this.$nextTick(() => {
          this.renderChart();
        });
      },
      
      closeModal() {
        this.showModal = false;
        this.selectedService = null;
        if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }
      },
      
      getChartUrl(slug, period) {
        return `https://cdn.akaere.online/https://raw.githubusercontent.com/pysio2007/upptime/master/graphs/${slug}/response-time-${period}.png`;
      },

      async fetchCommitHistory(slug) {
        try {
          // 修改为获取30天的记录
          const response = await fetch(`https://api.github.com/repos/pysio2007/upptime/commits?path=history%2F${slug}.yml&per_page=30`);
          const commits = await response.json();
          
          this.commitData = commits.map(commit => {
            const message = commit.commit.message;
            const match = message.match(/in (\d+) ms/);
            const timestamp = new Date(commit.commit.author.date);
            return {
              time: match ? parseInt(match[1]) : null,
              date: timestamp
            };
          }).filter(data => data.time !== null);
        } catch (error) {
          console.error('获取commit历史失败:', error);
        } finally {
          this.chartLoading = false;
        }
      },

      renderChart() {
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }
  
        const ctx = this.$refs.dayChart?.getContext('2d');
        if (!ctx) return;
  
        const sortedData = [...this.commitData].sort((a, b) => a.date - b.date);
        
        this.chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            // 修改日期显示格式
            labels: sortedData.map(d => d.date.toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })),
            datasets: [{
              label: '响应时间 (ms)',
              data: sortedData.map(d => d.time),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: '近30天响应时间变化趋势'
              },
              tooltip: {
                callbacks: {
                  // 自定义提示框显示完整日期时间
                  title: (tooltipItems) => {
                    const date = sortedData[tooltipItems[0].dataIndex].date;
                    return date.toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: '响应时间 (ms)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: '日期'
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                }
              }
            }
          }
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .status-container {
    padding: 1rem;
  }
  
  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .status-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .status-card:hover {
    transform: translateY(-2px);
  }
  
  .service-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .service-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
  
  .status-indicator {
    padding: 0.5rem;
    border-radius: 4px;
    text-align: center;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  
  .status-indicator.up {
    background-color: #4caf50;
    color: white;
  }
  
  .status-indicator.down {
    background-color: #f44336;
    color: white;
  }
  
  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #666;
  }
  
  .stat-value {
    font-weight: bold;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    right: 1rem;
    top: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .chart-item {
    text-align: center;
  }
  
  .chart-item img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .chart-item h3 {
    margin-bottom: 0.5rem;
    color: #666;
  }

  .custom-charts-container {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .chart-loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  canvas {
    background: white;
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  </style>