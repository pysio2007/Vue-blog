<template>
    <div>
      <div v-if="loading" class="loading-container">
        正在检测中...
      </div>
      <div v-else class="hint-container tip">
        <p class="hint-container-title">PWA状态</p>
        <p>是否使用PWA: {{ isPwa ? '是' : '否' }}</p>
        <p>缓存大小: {{ cacheSize }} KB</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true,
        isPwa: false,
        cacheSize: 0
      };
    },
    mounted() {
      this.checkPwaStatus();
    },
    methods: {
      async checkPwaStatus() {
        // 检测是否使用PWA
        this.isPwa = window.matchMedia('(display-mode: standalone)').matches;
  
        // 获取缓存大小
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          let totalSize = 0;
          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            for (const request of requests) {
              const response = await cache.match(request);
              if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
              }
            }
          }
          this.cacheSize = (totalSize / 1024).toFixed(2); // 转换为KB
        }
  
        this.loading = false;
      }
    }
  };
  </script>