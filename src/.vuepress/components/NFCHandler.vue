<template>
  <teleport to="body">
    <NFCCard 
      v-if="showNFCCard"
      :title="pageTitle"
      :description="pageDescription"
      :icon="siteIcon"
      :url="currentUrl"
    />
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { usePageData, useSiteData } from 'vuepress/client'
import NFCCard from './NFCCard.vue'

const pageData = usePageData()
const siteData = useSiteData()

const showNFCCard = ref(false)
const pageTitle = ref('')
const pageDescription = ref('')
const siteIcon = ref('/logo.svg')
const currentUrl = ref('')

/**
 * Updates page information from VuePress data
 */
const updatePageInfo = () => {
  pageTitle.value = pageData.value.title || siteData.value.title
  pageDescription.value = pageData.value.frontmatter?.description || siteData.value.description
  currentUrl.value = window.location.href
}

onMounted(() => {
  updatePageInfo()
  
  // 监听全局 NFC 触发事件
  if (typeof window !== 'undefined') {
    window.addEventListener('show-nfc-card', () => {
      showNFCCard.value = true
    })
  }
})

watch(() => pageData.value.path, () => {
  updatePageInfo()
})


// 监听自定义事件，允许手动触发 NFC 卡片
if (typeof window !== 'undefined') {
  window.addEventListener('show-nfc-card', () => {
    showNFCCard.value = true
  })
}
</script>