<!-- 展示Github项目 https://github.com/pysio2007/HuoShen80Hub 中的图片 -->

<template>
  <!-- 只在非加载状态显示搜索框 -->
  <div v-if="!loading" class="search-container">
    <input v-model="searchQuery" type="text" placeholder="搜索图片..." class="search-input">
  </div>
  
  <!-- 加载提示 -->
  <div v-if="loading" class="hint-container note">
    <p class="hint-container-title">加载中</p>
    <p>正在获取图片列表...</p>
  </div>

  <div class="image-gallery">
    <div v-for="(url, index) in filteredUrls" :key="index">
      <h3>{{ getFileName(url) }}</h3>
      <div v-if="info[getFileName(url)]" class="hint-container info">
        <p class="hint-container-title">相关信息</p>
        <p>{{ info[getFileName(url)] }}</p>
      </div>
      <img :src="url" :alt="getFileName(url)" :data-title="getFileName(url)" class="vp-image">
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'HuoShen80Hub',
  setup() {
    const urls = ref([])
    const info = ref({})
    const searchQuery = ref('')
    const loading = ref(true) // 添加loading状态

    const fetchUrls = async () => {
      try {
        const response = await fetch('https://cdn.akaere.online/raw.githubusercontent.com/pysio2007/HuoShen80Hub/refs/heads/master/url.csv')
        const text = await response.text()
        urls.value = text.split('\n').filter(url => url.trim() !== '')
      } catch (error) {
        console.error('Error fetching URLs:', error)
      }
    }

    const fetchInfo = async () => {
      try {
        const response = await fetch('https://cdn.akaere.online/raw.githubusercontent.com/pysio2007/HuoShen80Hub/refs/heads/master/info.json')
        info.value = await response.json()
      } catch (error) {
        console.error('Error fetching info:', error)
      } finally {
        loading.value = false // 数据加载完成
      }
    }

    const getFileName = (url) => {
      return url.split('/').pop()
    }

    const filteredUrls = computed(() => {
      if (!searchQuery.value) {
        return sortedUrls.value
      }
      return sortedUrls.value.filter(url =>
        getFileName(url).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (info.value[getFileName(url)] || '').toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const sortedUrls = computed(() => {
      return [...urls.value].sort((a, b) => {
        const fileNameA = getFileName(a).toLowerCase()
        const fileNameB = getFileName(b).toLowerCase()
        return fileNameA.localeCompare(fileNameB)
      })
    })

    onMounted(() => {
      fetchUrls()
      fetchInfo()
    })

    return {
      filteredUrls,
      info,
      getFileName,
      searchQuery,
      loading
    }
  }
}
</script>

<style scoped>
.search-container {
  margin: 20px 0;
  text-align: center;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.image-gallery img {
  max-width: 100%;
  height: auto;
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.image-gallery img:hover {
  transform: scale(1.02);
}
</style>