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
      <div v-html="sanitizeHtml(htmlContent)"></div>
    </div>
  </div>
</template>

<script>
import sanitizeHtml from 'sanitize-html';

export default {
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
      customStyle: {}
    }
  },
  mounted() {
    this.fetchData(true); // 初始加载显示加载状态
    // 设置30秒自动更新
    this.updateTimer = setInterval(() => {
      this.fetchData(false); // 定时刷新不显示加载状态
    }, 30000);
  },
  beforeDestroy() {
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
      let containerClass = 'warning';
      let title = 'Oops';
      let content = '这只熊猫睡死了QWQ';

      if (this.data.alive) {
        if (this.data.applicationOnline) {
          containerClass = 'tip';
          title = this.data.application;
          content = this.data.introduce;
          
          // 处理自定义背景色
          this.hasCustomBg = true;
          const colors = this.processRGBA(this.data.rgba);
          this.customStyle = {
            '--custom-bg': colors.background,
            '--custom-title-color': colors.titleColor
          };
          
          this.htmlContent = this.createHintContainer(containerClass, title, content);
          return;
        } else {
          containerClass = 'tip';
          title = '这只熊猫正在摸鱼中';
          content = ' 这只熊猫活着,快去骚扰他w! 或者找他打游戏w!';
        }
      } else {
        containerClass = 'warning';
        title = '失联了';
        content = this.data.last_heartbeat ? 
          `这只熊猫睡死了QWQ,死于${this.formatDate(this.data.last_heartbeat)}` :
          '这只熊猫睡死了QWQ,没有留下最后的时间';
      }

      // 重置自定义样式
      this.hasCustomBg = false;
      this.customStyle = {};
      this.htmlContent = this.createHintContainer(containerClass, title, content);
    },
    renderErrorContent(errorMessage) {
      const containerClass = 'caution';
      const title = 'Error';
      const content = `获取数据时出错: ${errorMessage}`;

      this.htmlContent = this.createHintContainer(containerClass, title, content);
    },
    createHintContainer(className, title, content) {
      return `
        <div class="hint-container ${className}">
          <p class="hint-container-title">${title}</p>
          <p>${content}</p>
        </div>
      `;
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