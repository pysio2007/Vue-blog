<template>
  <div class="hint-container tip">
    <p class="hint-container-title">
      截至 {{ currentTime }}，API总请求次数是：
      <span v-if="loading">获取中...</span>
      <span v-else>{{ count }}</span>
    </p>
    <!-- <p v-if="lastUpdated">最后请求时间：{{ formatLastUpdated }}</p> -->
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      count: 0,
      currentTime: '',
      loading: false,
      lastUpdated: null
    };
  },
  computed: {
    formatLastUpdated() {
      return this.lastUpdated ? new Date(this.lastUpdated).toLocaleString() : '';
    }
  },
  created() {
    this.fetchData();
    this.updateTime();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await fetch('https://blogapi.pysio.online/api_stats/random_image');
        const data = await response.json();
        this.count = data.count;
        this.lastUpdated = data.lastUpdated;
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString();
    }
  }
};
</script>