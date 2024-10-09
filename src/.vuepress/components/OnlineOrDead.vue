<template>
    <div v-html="sanitizeHtml(htmlContent)"></div>
  </template>
  
  <script>
  import sanitizeHtml from 'sanitize-html'; 
  
  export default {
    data() {
      return {
        data: null,
        htmlContent: '',
      }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
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
          });
      },
      renderContent() {
        const containerClass = this.data.alive ? 'tip' : 'warning';
        const title = this.data.alive ? '好耶!' : 'Oops';
        const content = this.data.alive 
          ? '熊猫活着,快去骚扰他w!' 
          : `这只熊猫睡死了QWQ,死于${this.formatDate(this.data.last_heartbeat)}`;
  
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
            'div': ['class'],
            'p': ['class']
          }
        });
      }
    }
  }
  </script>