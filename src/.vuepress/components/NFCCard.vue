<template>
  <div class="nfc-card" v-if="showNFCCard">
    <div class="nfc-card-content">
      <div class="nfc-card-header">
        <img :src="icon" alt="Site Icon" class="nfc-card-icon" />
        <div class="nfc-card-info">
          <h3 class="nfc-card-title">{{ title }}</h3>
          <p class="nfc-card-description">{{ description }}</p>
        </div>
        <button @click="closeCard" class="nfc-card-close">×</button>
      </div>
      <div class="nfc-card-actions">
        <button @click="openInApp" class="nfc-card-button primary">
          在应用中打开
        </button>
        <button @click="openInBrowser" class="nfc-card-button secondary">
          在Safari中打开
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  title?: string
  description?: string
  icon?: string
  url?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: "Pysio's Home",
  description: "一个温暖的家",
  icon: "/logo.svg",
  url: ""
})

const showNFCCard = ref(false)

/**
 * Closes the NFC card popup and clears trigger state
 */
const closeCard = () => {
  showNFCCard.value = false
  sessionStorage.removeItem('nfc-triggered')
}

/**
 * Opens URL in browser and closes the card
 */
const openInBrowser = () => {
  const url = props.url || window.location.href
  window.open(url, '_blank')
  closeCard()
}

/**
 * Attempts to open in a custom app, falls back to browser
 */
const openInApp = () => {
  // 尝试打开自定义 URL Scheme，如果有的话
  const customScheme = `pysiohome://open?url=${encodeURIComponent(window.location.href)}`
  window.location.href = customScheme

  // 如果没有自定义应用，回退到浏览器
  setTimeout(() => {
    if (document.hidden) return
    openInBrowser()
  }, 1000)
}

onMounted(() => {
  // 检测是否是通过 NFC 标签或 Apple Shortcuts 访问
  const userAgent = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  const hasNFCRef = document.referrer.includes('shortcuts://') ||
    window.location.search.includes('nfc=1') ||
    window.location.search.includes('source=nfc') ||
    sessionStorage.getItem('nfc-triggered')

  if (isIOS && hasNFCRef && !sessionStorage.getItem('nfc-card-shown')) {
    showNFCCard.value = true
    sessionStorage.setItem('nfc-card-shown', 'true')
  }

  // 监听全局 NFC 触发事件
  if (typeof window !== 'undefined') {
    window.addEventListener('show-nfc-card', () => {
      if (!sessionStorage.getItem('nfc-card-shown')) {
        showNFCCard.value = true
        sessionStorage.setItem('nfc-card-shown', 'true')
      }
    })
  }
})
</script>

<style scoped>
.nfc-card {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.nfc-card-content {
  background: var(--card-bg-color, #fff);
  border-radius: 16px;
  max-width: 320px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.nfc-card-header {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  gap: 12px;
  position: relative;
}

.nfc-card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.nfc-card-info {
  flex: 1;
  min-width: 0;
}

.nfc-card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text-color, #000);
  word-wrap: break-word;
}

.nfc-card-description {
  font-size: 14px;
  color: var(--text-color-light, #666);
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
}

.nfc-card-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-color-light, #666);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
}

.nfc-card-close:hover {
  background: var(--hover-bg-color, #f0f0f0);
}

.nfc-card-actions {
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nfc-card-button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nfc-card-button.primary {
  background: #007AFF;
  color: white;
}

.nfc-card-button.primary:hover {
  background: #0056CC;
}

.nfc-card-button.secondary {
  background: var(--secondary-bg-color, #f1f1f1);
  color: var(--text-color, #000);
}

.nfc-card-button.secondary:hover {
  background: var(--secondary-bg-hover, #e1e1e1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .nfc-card-content {
    --card-bg-color: #1c1c1e;
    --text-color: #ffffff;
    --text-color-light: #99999b;
    --hover-bg-color: #2c2c2e;
    --secondary-bg-color: #2c2c2e;
    --secondary-bg-hover: #3a3a3c;
  }
}
</style>
