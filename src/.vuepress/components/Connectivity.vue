<template>
    <div>
      <div v-if="loading" class="hint-container note">
        测速中，请稍作等待...
      </div>
      <div v-for="result in results" :key="result.name" :class="['hint-container', result.error ? 'caution' : 'tip']">
        <p class="hint-container-title">{{ result.name }}</p>
        <div v-if="result.error">
          访问失败
        </div>
        <div v-else>
          访问时间：{{ result.time }} ms
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true,
        results: [
          { name: 'Taobao', url: 'https://www.taobao.com', time: null, error: false },
          { name: 'Baidu', url: 'https://www.baidu.com', time: null, error: false },
          { name: 'WeChat', url: 'https://pc.weixin.qq.com/', time:null, error: false},
          { name: 'GitHub', url: 'https://github.com', time: null, error: false },
          { name: 'YouTube', url: 'https://www.youtube.com', time: null, error: false },
          { name: 'OpenAi', url: 'https://chat.openai.com/', time: null, error: false },
        ]
      };
    },
    mounted() {
      this.testConnectivity();
    },
    methods: {
      async testConnectivity() {
        for (let result of this.results) {
          const startTime = performance.now();
          try {
            await fetch(result.url, { mode: 'no-cors' });
            const endTime = performance.now();
            result.time = Math.round(endTime - startTime);
          } catch (error) {
            result.error = true;
          }
        }
        this.loading = false;
      }
    }
  };
  </script>
  
  <style scoped>

  </style>