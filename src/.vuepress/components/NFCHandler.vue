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

/**
 * Checks for various NFC trigger conditions and shows card if needed
 */
const checkNFCTrigger = () => {
  if (typeof window === 'undefined') return

  const userAgent = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  
  // 检查多种 NFC 触发条件
  const nfcTriggers = [
    // URL 参数
    window.location.search.includes('nfc=1'),
    window.location.search.includes('source=nfc'),
    window.location.hash.includes('nfc'),
    
    // 会话存储标记
    sessionStorage.getItem('nfc-triggered'),
    sessionStorage.getItem('nfc-card-trigger'),
    
    // Referrer 检查
    document.referrer.includes('shortcuts://'),
    document.referrer === '',
    
    // 特殊的用户代理标记（一些 NFC 应用会设置）
    userAgent.includes('NFCTrigger'),
    
    // 检查是否有特殊的 localStorage 标记
    localStorage.getItem('nfc-access')
  ]

  const hasNFCTrigger = nfcTriggers.some(condition => condition)
  
  if (isIOS && hasNFCTrigger && !sessionStorage.getItem('nfc-card-shown')) {
    showNFCCard.value = true
    sessionStorage.setItem('nfc-card-shown', 'true')
  }
}

// 监听自定义事件，允许手动触发 NFC 卡片
if (typeof window !== 'undefined') {
  window.addEventListener('show-nfc-card', () => {
    showNFCCard.value = true
  })
}
</script>