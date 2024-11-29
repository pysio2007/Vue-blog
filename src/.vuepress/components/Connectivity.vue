<template>
  <div>
    <div v-if="anyLoading" class="hint-container note">
      正在测试连接...
    </div>
    <div v-for="result in results" :key="result.name" :class="['hint-container', getStatusClass(result)]">
      <p class="hint-container-title">{{ result.name }}</p>
      <div v-if="result.error">
        {{ result.error === 'timeout' ? '连接超时' : '访问失败' }}
      </div>
      <div v-else-if="result.loading">
        测试中: {{ result.time || 0 }} ms...
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
      results: [
        { name: 'Taobao', url: 'https://www.taobao.com', time: null, error: false, loading: false },
        { name: 'Baidu', url: 'https://www.baidu.com', time: null, error: false, loading: false },
        { name: 'WeChat', url: 'https://pc.weixin.qq.com/', time: null, error: false, loading: false },
        { name: 'GitHub', url: 'https://github.com', time: null, error: false, loading: false },
        { name: 'YouTube', url: 'https://www.youtube.com', time: null, error: false, loading: false },
        { name: 'OpenAi', url: 'https://chat.openai.com/', time: null, error: false, loading: false },
      ]
    };
  },
  computed: {
    anyLoading() {
      return this.results.some(result => result.loading);
    }
  },
  mounted() {
    this.testConnectivity();
  },
  methods: {
    getStatusClass(result) {
      if (result.loading) return 'note';
      return result.error ? 'caution' : 'tip';
    },

    createTimeout(timeout = 60000) {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), timeout);
      });
    },

    async testSingleUrl(result) {
      result.loading = true;
      const startTime = performance.now();
      const updateTime = () => {
        if (result.loading) {
          result.time = Math.round(performance.now() - startTime);
          requestAnimationFrame(updateTime);
        }
      };
      updateTime();

      try {
        await Promise.race([
          fetch(result.url, { mode: 'no-cors' }),
          this.createTimeout()
        ]);
        result.time = Math.round(performance.now() - startTime);
      } catch (error) {
        result.error = error.message === 'timeout' ? 'timeout' : 'error';
      } finally {
        result.loading = false;
      }
    },

    async testConnectivity() {
      const promises = this.results.map(result => this.testSingleUrl(result));
      await Promise.allSettled(promises);
    }
  }
};
</script>