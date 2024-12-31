<!-- Pastebin组件：提供文本分享和在线存储功能 -->
<template>
  <!-- 主容器 -->
  <div class="pastebin-container">
    <!-- 输入区域：当没有响应数据时显示 -->
    <div v-if="!response && !queryResponse" class="input-controls">
      <!-- 文本输入区 -->
      <div class="input-section">
        <textarea v-model="inputText" placeholder="输入文本" class="input-textarea"></textarea>
        <button @click="submitText" class="submit-button">提交</button>
      </div>
      <!-- UUID查询区 -->
      <div class="query-section">
        <input v-model="uuid" placeholder="输入UUID查询" class="uuid-input" />
        <button @click="fetchByUUID" class="query-button">查询</button>
      </div>
      <!-- 错误信息显示 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <!-- 加载指示器 -->
      <div v-if="loading" class="loading-indicator">
        <div class="hint-container tip">
          <p class="hint-container-title" v-if="isSubmitting">上传中 请稍等片刻...</p>
          <p class="hint-container-title" v-else>查询中 请稍等片刻...</p>
        </div>
      </div>
    </div>

    <!-- 结果显示区域 -->
    <div v-if="response || queryResponse" class="result-container">
      <!-- 操作按钮栏 -->
      <div class="action-bar">
        <button class="action-button back-button" @click="resetForm">
          <i class="fas fa-arrow-left"></i> 返回
        </button>
        <button class="action-button copy-button" @click="copyLink">
          <i class="fas fa-clipboard"></i> 复制链接
        </button>
        <button class="action-button fullscreen-button" @click="toggleFullscreen">
          <i class="fas" :class="isFullscreen ? 'fa-compress-alt' : 'fa-expand-alt'"></i>
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
      </div>

      <!-- 元数据显示区 -->
      <div class="metadata-bar">
        <div class="metadata-info">
          <div class="timestamp-row">
            上传时间: {{ formatTimestamp((response || queryResponse).createdAt) }} | 到期时间: {{ formatTimestamp((response || queryResponse).expiresAt) }}
          </div>
          <div class="uuid-display">UUID: {{ currentUUID }}</div>
        </div>
      </div>
      
      <!-- Monaco编辑器容器 -->
      <div class="editor-container">
        <MonacoEditor
          v-model="displayedText"
          language="plaintext"
          theme="vs"
          :options="{
            readOnly: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            automaticLayout: true, // 添加自动布局选项
          }"
          class="monaco-editor-instance"
        />
      </div>

      <!-- AI分析结果显示区 -->
      <div class="ai-analysis">
        <span class="ai-label">AI 解析：</span>
        <div class="ai-content" v-html="renderedSummary"></div>
      </div>

      <!-- 复制成功提示 -->
      <div v-if="copySuccess" class="copy-success-tooltip">
        链接已复制到剪贴板！
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { marked } from 'marked' // 用于Markdown渲染

export default {
  // 异步加载Monaco编辑器组件
  components: {
    MonacoEditor: defineAsyncComponent(() => 
      import('./MonacoEditor.vue')
    )
  },
  // 组件数据
  data() {
    return {
      inputText: '', // 用户输入的文本
      response: null, // 提交响应数据
      uuid: '', // 查询用的UUID
      queryResponse: null, // 查询响应数据
      loading: false, // 加载状态
      error: null, // 错误信息
      copySuccess: false, // 复制成功标志
      baseUrl: 'https://www.pysio.online/tools/Pastebin.html?uuid=', // 分享链接基础URL
      isSubmitting: false, // 是否正在提交（区分提交和查询状态）
      isFullscreen: false, // 添加全屏状态标记
    }
  },
  // 计算属性
  computed: {
    // 获取显示文本
    displayedText() {
      return (this.response || this.queryResponse)?.text || ''
    },
    // 将Markdown格式的摘要转换为HTML
    renderedSummary() {
      const summary = (this.response || this.queryResponse)?.summary
      return summary ? marked(summary) : ''
    },
    // 获取当前UUID（优先使用id字段）
    currentUUID() {
      const data = this.response || this.queryResponse;
      if (data) {
        return data.id || data.uuid;
      }
      return this.uuid;
    }
  },
  // 组件挂载时检查URL参数
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUuid = urlParams.get('uuid');
    if (urlUuid) {
      this.uuid = urlUuid;
      this.fetchByUUID();
    }
  },
  // 方法定义
  methods: {
    // 提交文本到服务器
    async submitText() {
      this.loading = true;
      this.isSubmitting = true;
      this.error = null;
      try {
        const res = await fetch('https://pastbin.akaere.online', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
          body: this.inputText,
          timeout: 30000,
        });
        if (!res.ok) throw new Error('提交失败');
        this.response = await res.json();
        // 更新URL参数
        if (this.response) {
          const uuid = this.response.id || this.response.uuid;
          history.pushState({}, '', `?uuid=${uuid}`);
        }
      } catch (error) {
        this.error = `提交错误: ${error.message}`;
        console.error('Error:', error);
      } finally {
        this.loading = false;
        this.isSubmitting = false;
      }
    },
    // 通过UUID查询文本
    async fetchByUUID() {
      this.loading = true;
      this.isSubmitting = false;
      this.error = null;
      try {
        const res = await fetch(`https://pastbin.akaere.online/paste/${this.uuid}`, {
          timeout: 30000,
        });
        if (!res.ok) throw new Error('查询失败');
        this.queryResponse = await res.json();
        if (this.queryResponse) {
          const uuid = this.queryResponse.id || this.queryResponse.uuid;
          history.pushState({}, '', `?uuid=${uuid}`);
        }
      } catch (error) {
        this.error = `查询错误: ${error.message}`;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },
    // 格式化时间戳为本地时间字符串
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    },
    // 重置表单并清除URL参数
    resetForm() {
      this.response = null;
      this.queryResponse = null;
      this.inputText = '';
      this.uuid = '';
      this.error = null;
      history.pushState({}, '', window.location.pathname);
    },
    // 复制分享链接到剪贴板
    async copyLink() {
      const url = `${this.baseUrl}${this.currentUUID}`;
      try {
        await navigator.clipboard.writeText(url);
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    },
    // 切换全屏状态
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      const container = document.querySelector('.result-container');
      if (this.isFullscreen) {
        container.classList.add('fullscreen');
        document.body.style.overflow = 'hidden';
      } else {
        container.classList.remove('fullscreen');
        document.body.style.overflow = '';
      }
    }
  },
};
</script>

<style scoped>
/* 容器样式 */
.pastebin-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

/* 输入控件样式 */
.input-controls {
  margin-bottom: 20px;
}

/* 结果容器样式 */
.result-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 元数据栏样式 */
.metadata-bar {
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metadata-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timestamp-row, .uuid-display {
  color: #666;
  font-size: 0.9em;
}

/* 删除这个样式 */
/* .uuid-display {
  margin-left: 15px;
} */

/* 编辑器容器基础样式 */
.editor-container {
  height: 400px;
  width: 100%;
  position: relative;
  display: flex; /* 使用flex布局 */
}

/* Monaco编辑器实例样式 */
.monaco-editor-instance {
  flex: 1;
  width: 100% !important;
  height: 100% !important;
}

/* 全屏模式下的容器样式 */
.result-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  border-radius: 0;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden; /* 防止出现滚动条 */
}

/* 全屏模式下的元数据栏样式 */
.result-container.fullscreen .metadata-bar {
  flex-shrink: 0;
}

/* 全屏模式下的操作栏样式 */
.result-container.fullscreen .action-bar {
  flex-shrink: 0;
}

/* 全屏模式下的编辑器容器样式 */
.result-container.fullscreen .editor-container {
  flex: 1;
  min-height: 0; /* 重要：允许flex子项缩小 */
  height: auto;
}

/* 确保编辑器内容区域填满容器 */
.result-container.fullscreen .monaco-editor-instance {
  width: 100% !important;
  height: 100% !important;
}

/* 编辑器内部样式调整 */
:deep(.monaco-editor) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.monaco-editor .overflow-guard) {
  width: 100% !important;
  height: 100% !important;
}

/* AI分析样式 */
.ai-analysis {
  padding: 12px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
}

.ai-label {
  color: #0066cc;
  font-weight: bold;
}

.ai-content {
  color: #333;
  margin: 8px 0 0 0;
}

.ai-content :deep(p) {
  margin: 0.5em 0;
}

.ai-content :deep(a) {
  color: #0066cc;
  text-decoration: none;
}

.ai-content :deep(ul), .ai-content :deep(ol) {
  padding-left: 20px;
  margin: 0.5em 0;
}

.ai-content :deep(code) {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

/* 输入区和查询区样式 */
.input-section, .query-section {
  margin-bottom: 20px;
}

.input-textarea, .uuid-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.submit-button, .query-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover, .query-button:hover {
  background-color: #0056b3;
}

/* 响应区样式 */
.response-section, .query-response-section {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.response-section h3, .query-response-section h3 {
  margin-top: 0;
}

.response-section p, .query-response-section p {
  margin: 5px 0;
}

/* 错误信息样式 */
.error-message {
  color: #ff4444;  padding: 10px;  margin: 10px 0;  background-color: #ffebee;  border: 1px solid #ffcdd2;
  border-radius: 4px;
}

/* 加载指示器样式 */
.loading-indicator {
  text-align: center;
  padding: 10px;
  color: #666;
}

/* 操作按钮栏样式 */
.action-bar {
  display: flex;
  gap: 10px;
  padding: 12px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.back-button {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
}

.back-button:hover {
  background-color: #e9ecef;
}

.copy-button {
  background-color: #28a745;
  color: white;
}

.copy-button:hover {
  background-color: #218838;
}

/* 全屏按钮样式 */
.fullscreen-button {
  background-color: #6c757d;
  color: white;
  margin-left: auto; /* 将全屏按钮推到右侧 */
}

.fullscreen-button:hover {
  background-color: #5a6268;
}

/* 全屏模式样式 */
.result-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  border-radius: 0;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* 全屏模式下的元数据栏样式 */
.result-container.fullscreen .metadata-bar {
  flex-shrink: 0;
}

/* 全屏模式下的操作栏样式 */
.result-container.fullscreen .action-bar {
  flex-shrink: 0;
}

/* 全屏模式下的编辑器容器样式 */
.result-container.fullscreen .editor-container {
  flex: 1;
  height: auto; /* 移除固定高度 */
  min-height: 0; /* 允许容器缩小 */
}

/* 全屏模式下的AI分析区域样式 */
.result-container.fullscreen .ai-analysis {
  flex-shrink: 0;
  max-height: 200px;
  overflow-y: auto;
}

/* 编辑器容器样式基础调整 */
.editor-container {
  height: 400px;
  width: 100%;
  position: relative;
}

/* Monaco编辑器样式调整 */
.editor-container :deep(.monaco-editor) {
  width: 100% !important;
  height: 100% !important;
}

/* 调整全屏模式下的按钮间距 */
.action-button i {
  margin-right: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* 复制成功提示样式 */
.copy-success-tooltip {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  animation: fadeInOut 2s ease;
  z-index: 1000;
}

/* 动画效果 */
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  15% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}
</style>