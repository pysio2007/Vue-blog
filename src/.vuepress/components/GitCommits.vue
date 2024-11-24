<template>
    <div class="git-commits">
      <div class="actions">
        <!-- <button @click="refreshCommits" :disabled="loading">
          刷新
        </button>
        <button @click="clearCache">
          清除缓存
        </button> -->
      </div>
  
      <div v-if="loading" class="hint-container note">
        <p class="hint-container-title">加载中</p>
        <p>正在获取Git提交记录...</p>
      </div>
      <div v-else-if="error" class="hint-container caution">
        <p class="hint-container-title">错误</p>
        <p>{{ error }}</p>
        <p v-if="isRateLimited">
          API请求次数已达上限,请等待: {{ rateLimitResetTime }}
        </p>
      </div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Commit ID</th>
              <th>提交日期</th>
              <th>提交内容</th>
              <th>提交者</th>
              <!-- <th>操作</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="commit in commits" :key="commit.sha">
              <td>
                <a :href="commit.html_url" target="_blank">{{ commit.sha.substring(0, 7) }}</a>
              </td>
              <td>{{ formatDate(commit.commit.author.date) }}</td>
              <td class="commit-message">{{ commit.commit.message }}</td>
              <td>{{ commit.commit.author.name }}</td>
              <!-- <td>
                <button @click="copyCommitInfo(commit)">复制</button>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  
  export default {
    name: 'GitCommits',
    setup() {
      const commits = ref([])
      const loading = ref(true)
      const error = ref(null)
      const isRateLimited = ref(false)
      const rateLimitResetTime = ref('')
  
      const CACHE_KEY = 'git_commits_cache'
      const CACHE_EXPIRY = 3600000 // 1小时过期
  
      const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
  
      const setCookie = (name, value, hours) => {
        const expires = new Date(Date.now() + hours * 3600000).toUTCString()
        document.cookie = `${name}=${value}; expires=${expires}; path=/`
      }
  
      const getCookie = (name) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop().split(';').shift()
      }
  
      const saveToCache = (data) => {
        const cache = {
          data,
          timestamp: Date.now()
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
        setCookie('commits_cached', 'true', 1)
      }
  
      const loadFromCache = () => {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            return data
          }
        }
        return null
      }
  
      const clearCache = () => {
        localStorage.removeItem(CACHE_KEY)
        document.cookie = 'commits_cached=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      }
  
      const copyCommitInfo = (commit) => {
        const info = `提交: ${commit.sha}\n日期: ${formatDate(commit.commit.author.date)}\n信息: ${commit.commit.message}\n作者: ${commit.commit.author.name}`
        navigator.clipboard.writeText(info)
          .then(() => alert('已复制到剪贴板'))
          .catch(() => alert('复制失败'))
      }
  
      const fetchCommits = async () => {
        loading.value = true
        error.value = null
        isRateLimited.value = false
  
        try {
          // 先尝试从缓存加载
          const cached = loadFromCache()
          if (cached) {
            commits.value = cached
            loading.value = false
            return
          }
  
          const response = await fetch(
            'https://api.github.com/repos/pysio2007/Vue-blog/commits?per_page=20'
          )
          
          if (response.status === 403) {
            const resetTime = response.headers.get('X-RateLimit-Reset')
            isRateLimited.value = true
            rateLimitResetTime.value = formatDate(resetTime * 1000)
            throw new Error('API 请求次数已达上限')
          }
  
          if (!response.ok) {
            throw new Error('获取提交记录失败')
          }
  
          const data = await response.json()
          commits.value = data
          saveToCache(data)
  
        } catch (e) {
          error.value = e.message
        } finally {
          loading.value = false
        }
      }
  
      const refreshCommits = () => {
        clearCache()
        fetchCommits()
      }
  
      onMounted(() => {
        fetchCommits()
      })
  
      return {
        commits,
        loading,
        error,
        formatDate,
        refreshCommits,
        clearCache,
        copyCommitInfo,
        isRateLimited,
        rateLimitResetTime
      }
    }
  }
  </script>
  
  <style scoped>
  .git-commits {
    margin: 1rem 0;
  }
  
  .actions {
    margin-bottom: 1rem;
  }
  
  .actions button {
    margin-right: 0.5rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 0.5rem;
    border: 1px solid var(--vp-c-border);
    text-align: left;
  }
  
  th {
    background-color: var(--vp-c-bg-soft);
    font-weight: 600;
  }
  
  .commit-message {
    max-width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  a {
    color: var(--vp-c-brand);
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  button {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--vp-c-border);
    background-color: var(--vp-c-bg-soft);
    cursor: pointer;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>