<!-- 展示Github项目 https://github.com/pysio2007/HuoShen80Hub 中的图片 -->

<template>
    <div class="image-gallery">
      <div v-for="(url, index) in sortedUrls" :key="index">
        <h3>{{ getFileName(url) }}</h3>
        <div v-if="info[getFileName(url)]" class="hint-container info">
          <p class="hint-container-title">相关信息</p>
          <p>{{ info[getFileName(url)] }}</p>
        </div>
        <img :src="url" :alt="getFileName(url)">
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
        }
      }
  
      const getFileName = (url) => {
        return url.split('/').pop()
      }
  
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
        sortedUrls,
        info,
        getFileName
      }
    }
  }
  </script>
  
  <style scoped>
  .image-gallery img {
    max-width: 100%;
    height: auto;
  }
  
  </style>