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
      <div class="hint-container" 
           :class="containerClass"
           :data-is-jetbrains="isJetbrains">
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
      content: '',
      isJetbrains: false,
      jetbrainsConfig: {
        'IntelliJ IDEA': {
          name: 'IntelliJ IDEA',
          introduce: '熊猫正在吃 Java',
          gradient: 'linear-gradient(135deg, rgba(87,147,236,0.25), rgba(255,106,106,0.25))',
          textGradient: 'linear-gradient(45deg, rgb(87,147,236) 30%, rgb(255,106,106) 70%)'
        },
        'PyCharm': {
          name: 'PyCharm',
          introduce: '熊猫正在吃 Python',
          gradient: 'linear-gradient(135deg, rgba(33,215,137,0.25), rgba(23,67,172,0.25))',
          textGradient: 'linear-gradient(45deg, rgb(33,215,137) 30%, rgb(23,67,172) 70%)'
        },
        'WebStorm': {
          name: 'WebStorm',
          introduce: '熊猫正在吃 TypeScript',
          gradient: 'linear-gradient(135deg, rgba(0,209,255,0.25), rgba(66,132,244,0.25))',
          textGradient: 'linear-gradient(45deg, rgb(0,209,255) 30%, rgb(66,132,244) 70%)'
        },
        'CLion': {
          name: 'CLion',
          introduce: '熊猫正在吃 C/C++',
          gradient: 'linear-gradient(135deg, rgba(248,167,26,0.25), rgba(236,86,72,0.25))',
          textGradient: 'linear-gradient(45deg, rgb(248,167,26) 30%, rgb(236,86,72) 70%)'
        },
        'GoLand': {
          name: 'GoLand',
          introduce: '熊猫正在吃 Go',
          gradient: 'linear-gradient(135deg, rgba(78,167,234,0.25), rgba(125,95,255,0.25))',
          textGradient: 'linear-gradient(45deg, rgb(78,167,234) 30%, rgb(125,95,255) 70%)'
        },
        'Rider': {
          name: 'Rider',
          introduce: '熊猫正在吃 .NET',
          gradient: 'linear-gradient(135deg, rgba(252,109,38,0.25), rgba(169,56,165,0.25))',
          textGradient: 'linear-gradient(45deg, rgb(252,109,38) 30%, rgb(169,56,165) 70%)'
        },
        'DataGrip': {
          name: 'DataGrip',
          introduce: '熊猫正在吃芒果(Mongo)',
          gradient: 'linear-gradient(135deg, rgba(148,66,159,0.25), rgba(74,178,212,0.25))',
          textGradient: 'linear-gradient(45deg, rgb(148,66,159) 30%, rgb(74,178,212) 70%)'
        },
        'PhpStorm': {
          name: 'PhpStorm',
          introduce: '熊猫正在吃 PHP',
          gradient: 'linear-gradient(135deg, rgba(183,69,207,0.25), rgba(111,66,193,0.25))',
          textGradient: 'linear-gradient(45deg, rgb(183,69,207) 30%, rgb(111,66,193) 70%)'
        },
        'RubyMine': {
          name: 'RubyMine',
          introduce: '熊猫正在吃 Ruby',
          gradient: 'linear-gradient(135deg, rgba(251,53,80,0.25), rgba(215,0,95,0.25))',
          textGradient: 'linear-gradient(45deg, rgb(251,53,80) 30%, rgb(215,0,95) 70%)'
        }
      }
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
          
          // 根据API返回的application内容判断IDE
          const ideName = Object.keys(this.jetbrainsConfig).find(key => 
            this.data.application.includes(key)
          );

          if (ideName) {
            const config = this.jetbrainsConfig[ideName];
            this.title = `熊猫正在使用 ${config.name}`;
            this.content = config.introduce;
            
            this.hasCustomBg = true;
            this.isJetbrains = true;
            this.customStyle = {
              '--custom-bg': config.gradient,
              '--custom-text-gradient': config.textGradient
            };
            return;
          }

          // 非JetBrains应用时，使用 application 字段做标题，并显示 introduce 或默认文案
          this.isJetbrains = false;
          this.title = `${this.data.application}`;
          this.content = this.data.introduce || '熊猫正在写代码 - Vue-blog-Dev';
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

      this.isJetbrains = false;
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
  background: var(--custom-bg) !important;
}

.custom-container.has-custom-bg :deep(.hint-container-title) {
  color: var(--custom-title-color) !important;
  transition: all 0.5s ease;
}

.custom-container.has-custom-bg :deep([data-is-jetbrains="true"] .hint-container-title) {
  background: var(--custom-text-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent !important;
  font-weight: bold;
}

.custom-container.has-custom-bg :deep(.hint-container.tip > .hint-container-title::before) {
  opacity: 0.8;
  filter: brightness(0.7);
}

/* 调整JetBrains模式下的提示图标样式 */
.custom-container.has-custom-bg :deep([data-is-jetbrains="true"].hint-container.tip > .hint-container-title::before) {
  background-color:rgb(18, 91, 228) !important; /* 使用固定的深色 */
  opacity: 1;
  filter: brightness(0.9);
}

:deep(.hint-container) {
  transition: all 0.5s ease;
}

</style>