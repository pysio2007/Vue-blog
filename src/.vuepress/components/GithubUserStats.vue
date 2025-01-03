<!-- <GithubUserStats :users="['Pysio2007', 'stuffed-cat']" :year="2024" /> -->

<!-- <GithubUserStats users="Pysio2007" :year="2024" /> -->

<!-- 在这里偷偷放两行备忘录注释QAQ -->

<template>
  <div class="github-stats">
    <!-- API限制提示和Token输入 -->
    <div v-if="showTokenInput" class="token-input-container">
      <div class="token-message">
        检测到API访问受限，请输入GitHub Token以继续查看
        <a href="https://github.com/settings/tokens" target="_blank">获取Token</a>
      </div>
      <input 
        type="password" 
        v-model="userToken" 
        placeholder="输入GitHub Token"
        class="token-input"
      />
      <button @click="retryWithToken" class="token-button">确认</button>
    </div>

    <!-- 原有的用户统计内容 -->
    <div v-for="user in usersList" :key="user" class="user-section">
      <h2>
        <img :src="userData[user]?.avatar_url" class="avatar" />
        {{ user }}
      </h2>
      
      <!-- 年度统计 -->
      <div class="stats-container">
        <div class="stat-card">
          <h3>年度提交</h3>
          <p>{{ yearlyStats[user]?.totalCommits || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>PR数量</h3>
          <p>{{ yearlyStats[user]?.totalPRs || 0 }}</p>
        </div>
      </div>

      <!-- 提交热点图 -->
      <div class="heatmap" style="height: 120px;">
        <canvas :ref="el => heatmapRefs[user] = el"></canvas>
      </div>

      <!-- 仓库列表 -->
      <div class="repos-timeline">
        <div v-for="repo in userRepos[user]" :key="repo.name" class="repo-item">
          <div class="repo-header" @click="toggleRepo(repo)" :class="{ 'is-expanded': expandedRepos[repo.name] }">
            <h3>{{ repo.name }}</h3>
            <div class="repo-stats">
              <span class="commit-count">
                <i class="fas fa-code-commit"></i> 
                <span v-if="repo.loading" class="loading-dots">...</span>
                <span v-else>{{ repo.commits }}</span>
              </span>
              <span class="pr-count">
                <i class="fas fa-code-pull-request"></i> 
                <span v-if="repo.loading" class="loading-dots">...</span>
                <span v-else>{{ repo.prs }}</span>
              </span>
              <i :class="['fas', expandedRepos[repo.name] ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </div>
          </div>
          <div class="timeline" v-show="expandedRepos[repo.name]">
            <div class="timeline-entries">
              <div v-for="event in repo.events" 
                   :key="event.id" 
                   class="timeline-entry"
                   :class="{ 'is-clickable': true }"
                   @click="showEventDetails(event, user, repo.name)">
                <span class="event-date">{{ formatDate(event.created_at) }}</span>
                <span class="event-type">{{ event.type }}</span>
                <span class="event-title">{{ event.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 修改 PR 和 commit 详情弹窗部分 -->
  <div v-if="showModal" class="commit-modal" @click="closeModal">
    <div class="commit-modal-content" @click.stop>
      <div class="commit-modal-header">
        <h3>{{ selectedEvent?.type === 'PR' ? 'Pull Request 详情' : '提交详情' }}</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="commit-modal-body">
        <p class="commit-message">{{ selectedEvent?.title }}</p>
        <p class="commit-date">{{ selectedEvent?.type === 'PR' ? '创建' : '提交' }}时间：{{ formatDate(selectedEvent?.created_at) }}</p>
        <a :href="selectedEvent?.html_url" 
           target="_blank" 
           class="github-link">
          <i class="fab fa-github"></i> 在 GitHub 上查看
        </a>
        <div v-if="selectedEvent?.files && selectedEvent.files.length > 0" class="commit-files">
          <h4>文件变更</h4>
          <div v-for="file in selectedEvent.files" :key="file.filename" class="commit-file">
            <div class="file-header" @click="toggleFile(file)">
              <span>{{ file.filename }}</span>
              <span class="file-stats">
                <span class="additions">+{{ file.additions }}</span>
                <span class="deletions">-{{ file.deletions }}</span>
              </span>
              <i :class="['fas', file.expanded ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </div>
            <div v-if="file.expanded" class="file-diff">
              <MonacoEditor
                v-model="file.patch"
                language="diff"
                :options="{
                  readOnly: true,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  theme: 'vs'
                }"
                class="diff-editor"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import MonacoEditor from './MonacoEditor.vue'

// 修改 props 定义，确保正确解析数组
const props = defineProps({
  users: {
    type: [String, Array],
    required: true,
    validator(value) {
      if (typeof value === 'string') {
        try {
          return Array.isArray(JSON.parse(value))
        } catch {
          return true // 单个用户名字符串
        }
      }
      return Array.isArray(value)
    }
  },
  year: {
    type: [Number, String],
    default: () => new Date().getFullYear()
  }
})

// 改进用户列表解析
const usersList = computed(() => {
  if (typeof props.users === 'string') {
    try {
      return JSON.parse(props.users)
    } catch {
      return [props.users]
    }
  }
  return props.users
})

const userData = ref({})
const yearlyStats = ref({})
const userRepos = ref({})
const heatmapRefs = ref({})
const showTokenInput = ref(false)
const userToken = ref('')
const expandedRepos = ref({})
const showModal = ref(false)
const selectedEvent = ref(null)

// 使用Token的API请求函数
async function fetchWithToken(url) {
  const headers = userToken.value ? 
    { Authorization: `token ${userToken.value}` } : 
    {}
  
  try {
    const response = await fetch(url, { headers })
    if (response.status === 403) {
      showTokenInput.value = true
      throw new Error('API rate limit exceeded')
    }
    return await response.json()
  } catch (error) {
    console.error('API请求错误:', error)
    if (error.message !== 'API rate limit exceeded') {
      return []
    }
  }
}

// 修改重试函数
async function retryWithToken() {
  if (userToken.value) {
    setTokenCookie(userToken.value)
    showTokenInput.value = false
    await fetchAllData()
  }
}

// 统一的数据获取函数
async function fetchAllData() {
  userData.value = {}
  userRepos.value = {}
  yearlyStats.value = {}
  
  for (const user of usersList.value) {
    await fetchUserStats(user)
  }
}

async function fetchUserData(username) {
  return await fetchWithToken(`https://api.github.com/users/${username}`)
}

async function fetchUserRepos(username) {
  return await fetchWithToken(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
}

// 修改获取commits的函数以支持分页
async function fetchAllCommits(username, repo, since, until, page = 1, allCommits = []) {
  try {
    const response = await fetchWithToken(
      `https://api.github.com/repos/${username}/${repo}/commits?since=${since}&until=${until}&per_page=100&page=${page}`
    )  
    
    if (!Array.isArray(response) || response.length === 0) {
      return allCommits
    }

    allCommits.push(...response)

    // 如果返回了100条数据，说明可能还有更多，继续获取下一页
    if (response.length === 100) {
      return await fetchAllCommits(username, repo, since, until, page + 1, allCommits)
    }

    return allCommits
  } catch (error) {
    console.warn(`Error fetching commits for ${username}/${repo} page ${page}:`, error)
    return allCommits
  }
}

// 更新原有的fetchCommits函数
async function fetchCommits(username, repo) {
  const year = parseInt(props.year)
  const since = `${year}-01-01T00:00:00Z`
  const until = `${year}-12-31T23:59:59Z`
  
  return await fetchAllCommits(username, repo, since, until)
}

// 修改 fetchPRs 函数 - 更改获取PR的逻辑
async function fetchAllPRs(username, repo, since, until, page = 1, allPRs = []) {
  try {
    // 不指定creator参数,获取仓库的所有PR
    const response = await fetchWithToken(
      `https://api.github.com/repos/${username}/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=100&page=${page}`
    )

    if (!Array.isArray(response) || response.length === 0) {
      return allPRs
    }

    allPRs.push(...response)

    // 如果返回了100条数据，说明可能还有更多，继续获取下一页
    if (response.length === 100) {
      return await fetchAllPRs(username, repo, since, until, page + 1, allPRs)
    }

    // 在获取完所有PR后进行过滤
    const year = parseInt(props.year)
    return allPRs.filter(pr => {
      const prDate = new Date(pr.created_at)
      return pr.user.login === username && 
             prDate.getFullYear() === year
    })
  } catch (error) {
    console.warn(`Error fetching PRs for ${username}/${repo}:`, error)
    return []
  }
}

// 修改原有的fetchPRs函数调用
async function fetchPRs(username, repo) {
  const year = parseInt(props.year)
  const since = `${year}-01-01T00:00:00Z`
  const until = `${year}-12-31T23:59:59Z`
  
  return await fetchAllPRs(username, repo, since, until)
}

// 添加获取 PR 详情的函数
async function fetchPRFiles(username, repoName, prNumber) {
  try {
    const response = await fetchWithToken(`https://api.github.com/repos/${username}/${repoName}/pulls/${prNumber}/files`)
    return response || []
  } catch (error) {
    console.error(`获取 ${username}/${repoName} 的 PR 文件变更信息失败:`, error)
    return []
  }
}

// 修改数据获取逻辑
async function fetchUserStats(username) {
  try {
    // 初始化该用户的数据存储
    userData.value[username] = await fetchUserData(username)
    userRepos.value[username] = []
    yearlyStats.value[username] = { totalCommits: 0, totalPRs: 0 }

    const repos = await fetchUserRepos(username)
    if (!Array.isArray(repos)) {
      console.error(`获取 ${username} 的仓库列表失败`)
      return
    }

    // 保存所有提交数据用于热力图
    const allCommits = []
    
    // 依次处理每个仓库
    for (const repo of repos) {
      if (!repo.fork) { // 只统计非fork的仓库
        // 添加加载状态
        userRepos.value[username] = userRepos.value[username] || []
        const loadingRepo = {
          name: repo.name,
          commits: '加载中...',
          prs: '加载中...',
          events: [],
          loading: true
        }
        userRepos.value[username].push(loadingRepo)
        
        const [commits, prs] = await Promise.all([
          fetchCommits(username, repo.name),
          fetchPRs(username, repo.name)
        ])

        // 更新实际数据
        if (Array.isArray(commits)) {
          allCommits.push(...commits)

          const repoIndex = userRepos.value[username].findIndex(r => r.name === repo.name)
          if (repoIndex !== -1) {
            const repoStats = {
              name: repo.name,
              commits: commits.length,
              prs: Array.isArray(prs) ? prs.length : 0,
              loading: false,
              events: [
                ...(Array.isArray(prs) ? prs.map(pr => ({
                  id: pr.id,
                  type: 'PR',
                  created_at: pr.created_at,
                  title: pr.title,
                  number: pr.number,
                  html_url: pr.html_url
                })) : []),
                ...commits.map(c => ({
                  id: c.sha,
                  type: 'Commit',
                  created_at: c.commit.author.date,
                  title: c.commit.message,
                  html_url: c.html_url
                }))
              ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            }

            userRepos.value[username][repoIndex] = repoStats
            yearlyStats.value[username].totalCommits += repoStats.commits
            yearlyStats.value[username].totalPRs += repoStats.prs
          }
        }
      }
    }

    // 创建热力图
    if (heatmapRefs.value[username]) {
      createHeatmap(heatmapRefs.value[username], allCommits)
    }
  } catch (error) {
    console.error(`处理用户 ${username} 数据时出错:`, error)
  }
}

// 修改初始化函数
onMounted(async () => {
  // 设置canvas尺寸
  const resizeCanvas = () => {
    for (const user of usersList.value) {
      const canvas = heatmapRefs.value[user]
      if (canvas) {
        const container = canvas.parentElement
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }
  }

  window.addEventListener('resize', resizeCanvas)
  // 初始设置尺寸
  setTimeout(resizeCanvas, 0)

  for (const user of usersList.value) {
    await fetchUserStats(user)
  }

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas)
  })
  userToken.value = getTokenFromCookie()
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生成提交热力图数据
function generateHeatmapData(commits) {
  const year = parseInt(props.year)
  const data = new Array(53).fill(0).map((_, weekIndex) => 
    new Array(7).fill(0).map((_, dayIndex) => ({
      x: weekIndex,
      y: dayIndex,
      v: 0
    }))
  ).flat()

  commits.forEach(commit => {
    const date = new Date(commit.commit.author.date)
    if (date.getFullYear() === year) {
      const weekIndex = Math.floor((date - new Date(year, 0, 1)) / (7 * 24 * 60 * 60 * 1000))
      const dayIndex = date.getDay()
      const dataIndex = weekIndex * 7 + dayIndex
      if (dataIndex >= 0 && dataIndex < data.length) {
        data[dataIndex].v++
      }
    }
  })

  return data
}

// 修改热力图创建函数
function createHeatmap(canvas, commits) {
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const data = generateHeatmapData(commits)
  const width = canvas.width
  const height = canvas.height
  
  // 调整单元格大小和间距
  const cellSize = 10 // GitHub风格的固定大小
  const cellPadding = 2 // 单元格之间的间距
  const labelWidth = 30 // 左侧标签宽度
  const totalCellWidth = cellSize + cellPadding
  
  // 计算起始位置，确保居中
  const startX = labelWidth + (width - labelWidth - totalCellWidth * 53) / 2
  const startY = (height - (cellSize + cellPadding) * 13) / 2

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 绘制标签
  const days = ['日', '一', '二', '三', '四', '五', '六']
  ctx.font = '10px -apple-system,system-ui,Segoe UI,Helvetica,Arial,sans-serif'
  ctx.fillStyle = '#666'
  days.forEach((day, i) => {
    ctx.fillText(day, 8, startY + i * totalCellWidth + cellSize / 2 + 4)
  })

  // 绘制热力图
  data.forEach((cell) => {
    const x = startX + cell.x * totalCellWidth
    const y = startY + cell.y * totalCellWidth
    
    // 计算颜色深浅
    const intensity = Math.min(cell.v / 5, 1)
    ctx.fillStyle = cell.v === 0 
      ? '#ebedf0' 
      : `rgba(40, 167, 69, ${intensity})`
    
    // 绘制圆角矩形
    ctx.beginPath()
    const radius = 2
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + cellSize - radius, y)
    ctx.quadraticCurveTo(x + cellSize, y, x + cellSize, y + radius)
    ctx.lineTo(x + cellSize, y + cellSize - radius)
    ctx.quadraticCurveTo(x + cellSize, y + cellSize, x + cellSize - radius, y + cellSize)
    ctx.lineTo(x + radius, y + cellSize)
    ctx.quadraticCurveTo(x, y + cellSize, x, y + cellSize - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.fill()
  })

  // 添加交互
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left - startX - 20
    const mouseY = event.clientY - rect.top - startY
    
    const cellX = Math.floor(mouseX / totalCellWidth)
    const cellY = Math.floor(mouseY / totalCellWidth)
    
    if (cellX >= 0 && cellX < 53 && cellY >= 0 && cellY < 7) {
      const cell = data.find(d => d.x === cellX && d.y === cellY)
      if (cell) {
        const tooltip = document.createElement('div')
        tooltip.className = 'heatmap-tooltip'
        tooltip.textContent = `${props.year}年第${cell.x + 1}周 周${days[cell.y]}: ${cell.v}次提交`
        
        document.body.appendChild(tooltip)
        tooltip.style.left = event.pageX + 10 + 'px'
        tooltip.style.top = event.pageY + 10 + 'px'
        
        canvas.addEventListener('mouseleave', () => {
          tooltip.remove()
        }, { once: true })
      }
    }
  })
}

// 折叠/展开功能
function toggleRepo(repo) {
  expandedRepos.value[repo.name] = !expandedRepos.value[repo.name]
}

// 显示事件详情（PR或commit）
async function showEventDetails(event, username, repoName) {
  if (event.type === 'PR') {
    selectedEvent.value = {
      ...event,
      html_url: `https://github.com/${username}/${repoName}/pull/${event.number}`,
      files: await fetchPRFiles(username, repoName, event.number)
    }
  } else {
    selectedEvent.value = {
      ...event,
      html_url: `https://github.com/${username}/${repoName}/commit/${event.id}`,
      files: await fetchCommitFiles(username, repoName, event.id)
    }
  }
  showModal.value = true
}

// 关闭弹窗
function closeModal() {
  showModal.value = false
  selectedEvent.value = null
}

// 获取 commit 文件变更信息
async function fetchCommitFiles(username, repoName, commitSha) {
  try {
    const response = await fetchWithToken(`https://api.github.com/repos/${username}/${repoName}/commits/${commitSha}`)
    return response.files || []
  } catch (error) {
    console.error(`获取 ${username}/${repoName} 的 commit 文件变更信息失败:`, error)
    return []
  }
}

// Cookie 相关函数
function setTokenCookie(token) {
  if (typeof window !== 'undefined') {
    document.cookie = `github_token=${token}; max-age=2592000; path=/` // 30天过期
  }
}

function getTokenFromCookie() {
  if (typeof window === 'undefined') {
    return ''
  }
  const match = document.cookie.match(new RegExp('(^| )github_token=([^;]+)'))
  return match ? match[2] : ''
}

// 添加切换文件展开状态的函数
function toggleFile(file) {
  file.expanded = !file.expanded
}
</script>

<style scoped>
.github-stats {
  padding: 20px;
}

.user-section {
  margin-bottom: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  padding: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.stats-container {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  flex: 1;
  padding: 20px;
  background: #f6f8fa;
  border-radius: 6px;
  text-align: center;
}

.heatmap {
  margin: 20px 0;
  padding: 20px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e1e4e8;
  position: relative;
}

.heatmap canvas {
  width: 100% !important;
  height: 200px !important;
}

.repos-timeline {
  margin-top: 20px;
}

.repo-item {
  margin-bottom: 20px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  overflow: hidden;
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #f6f8fa;
  cursor: pointer;
  transition: background-color 0.2s;
}

.repo-header:hover {
  background-color: #f0f3f6;
}

.repo-header.is-expanded {
  border-bottom: 1px solid #e1e4e8;
}

.repo-stats {
  display: flex;
  gap: 15px;
}

.timeline {
  padding: 20px;
}

.timeline-entry {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background: #f6f8fa;
  border-radius: 4px;
}

.timeline-entry.is-clickable {
  cursor: pointer;
  transition: background-color 0.2s;
}

.timeline-entry.is-clickable:hover {
  background-color: #f0f3f6;
}

.event-date {
  color: #586069;
  font-size: 0.9em;
}

.event-type {
  color: #0366d6;
  font-weight: 500;
}

.event-title {
  color: #24292e;
}

.year-selector {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.year-selector label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.year-selector input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
}

.token-input-container {
  margin-bottom: 20px;
  padding: 15px;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  text-align: center;
}

.token-message {
  margin-bottom: 10px;
}

.token-message a {
  color: #0366d6;
  text-decoration: none;
  margin-left: 8px;
}

.token-input {
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  width: 300px;
  margin-right: 8px;
}

.token-button {
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.token-button:hover {
  background: #218838;
}

.heatmap-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
}

.commit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.commit-modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 90vw; /* 调整最大宽度 */
  max-height: 90vh; /* 调整最大高度 */
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 确保内容不会溢出 */
}

.commit-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.commit-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.commit-message {
  font-size: 16px;
  margin-bottom: 15px;
  white-space: pre-wrap;
}

.commit-date {
  color: #666;
  margin-bottom: 15px;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #24292e;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.github-link:hover {
  background: #1a1f23;
}

.loading-dots {
  animation: loading 1.4s infinite;
}

@keyframes loading {
  0%, 20% { content: '.'; }
  40%, 60% { content: '..'; }
  80%, 100% { content: '...'; }
}

.commit-files {
  margin-top: 20px;
}

.commit-file {
  margin-bottom: 10px;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  overflow: hidden;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f6f8fa;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-header:hover {
  background-color: #f0f3f6;
}

.file-stats {
  display: flex;
  gap: 10px;
}

.additions {
  color: #28a745;
}

.deletions {
  color: #cb2431;
}

.file-diff {
  height: 400px; /* 设置固定高度 */
  border-top: 1px solid #e1e4e8;
}

.diff-editor {
  height: 100%;
  width: 100%;
}
</style>
