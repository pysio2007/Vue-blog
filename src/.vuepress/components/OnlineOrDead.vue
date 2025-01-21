<template>
  <div>
    <div v-if="loading" class="hint-container note">
      <p class="hint-container-title">加载中</p>
      <p>正在获取数据,这可能需要一些时间...</p>
    </div>
    <div v-else 
         class="custom-container"
         :class="{ 'has-custom-bg': hasCustomBg }"
         :style="customStyle">
      <div class="hint-container" :class="containerClass">
        <p class="hint-container-title">{{ title }}</p>
        <p>{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import sanitizeHtml from 'sanitize-html';

export default {
  name: 'OnlineOrDead',
  
  data() {
    return {
      data: null,
      htmlContent: '',
      loading: true,
      updateTimer: null,
      containerStyle: {
        transition: 'background-color 0.5s ease'
      },
      hasCustomBg: false,
      customStyle: {},
      containerClass: '',
      title: '',
      content: ''
    }
  },
  
  mounted() {
    this.fetchData(true); // 初始加载显示加载状态
    // 设置30秒自动更新
    this.updateTimer = setInterval(() => {
      this.fetchData(false); // 定时刷新不显示加载状态
    }, 30000);
  },
  
  beforeUnmount() {
    // 组件销毁时清除定时器
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  },
  
  methods: {
    fetchData(showLoading = true) {
      if (showLoading) {
        this.loading = true;
      }
      
      fetch('https://blogapi.pysio.online/check')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.data = data;
          this.renderContent();
        })
        .catch(error => {
          this.renderErrorContent(error.message);
        })
        .finally(() => {
          if (showLoading) {
            this.loading = false;
          }
        });
    },
    renderContent() {
      if (this.data.alive) {
        if (this.data.applicationOnline) {
          this.containerClass = 'tip';
          this.title = this.data.application;
          this.content = this.data.introduce;
          
          this.hasCustomBg = true;
          const colors = this.processRGBA(this.data.rgba);
          this.customStyle = {
            '--custom-bg': colors.background,
            '--custom-title-color': colors.titleColor
          };
          return;
        } else {
          this.containerClass = 'tip';
          this.title = '这只熊猫正在摸鱼中';
          this.content = '这只熊猫活着,快去骚扰他w! 或者找他打游戏w!';
        }
      } else {
        this.containerClass = 'warning';
        this.title = '失联了';
        this.content = this.data.last_heartbeat ? 
          `这只熊猫睡死了QWQ,死于${this.formatDate(this.data.last_heartbeat)}` :
          '这只熊猫睡死了QWQ,没有留下最后的时间';
      }

      this.hasCustomBg = false;
      this.customStyle = {};
    },
    
    renderErrorContent(errorMessage) {
      this.containerClass = 'caution';
      this.title = 'Error';
      this.content = `获取数据时出错: ${errorMessage}`;
    },
    
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('zh-CN', { 
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    },
    sanitizeHtml(html) {
      return sanitizeHtml(html, {
        allowedTags: ['div', 'p'],
        allowedAttributes: {
          'div': ['class', 'style'],
          'p': ['class']
        }
      });
    },
    processRGBA(rgba) {
      const [r, g, b, a] = rgba.split(',').map(Number);
      // 创建加深的文字颜色（减少透明度并加深RGB值）
      const darkerR = Math.max(0, r - 30);
      const darkerG = Math.max(0, g - 30);
      const darkerB = Math.max(0, b - 30);
      return {
        background: `rgba(${r},${g},${b},${a})`,
        titleColor: `rgba(${darkerR},${darkerG},${darkerB},1)`
      };
    }
  }
}
</script>

<style scoped>
.custom-container {
  transition: all 0.5s ease;
}

.custom-container.has-custom-bg :deep(.hint-container) {
  background-color: var(--custom-bg) !important;
}

.custom-container.has-custom-bg :deep(.hint-container-title) {
  color: var(--custom-title-color) !important;
  transition: color 0.5s ease;
}

:deep(.hint-container) {
  transition: all 0.5s ease;
}
</style>