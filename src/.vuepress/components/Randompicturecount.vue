<template>
    <div class="hint-container tip">
      <p class="hint-container-title">截至 {{ currentTime }}，API总请求次数是：{{ count }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        count: 0,
        currentTime: ''
      };
    },
    created() {
      this.fetchData();
      this.updateTime();
    },
    methods: {
      async fetchData() {
        try {
          const response = await fetch('https://blogapi.pysio.online/random_image_count');
          const data = await response.json();
          this.count = data.count;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      updateTime() {
        const now = new Date();
        this.currentTime = now.toLocaleString();
      }
    }
  };
  </script>