<template>
  <div class="pastebin-container">
    <div v-if="!response && !queryResponse" class="input-controls">
      <div class="input-section">
        <textarea v-model="inputText" placeholder="输入文本" class="input-textarea"></textarea>
        <button @click="submitText" class="submit-button">提交</button>
      </div>
      <div class="query-section">
        <input v-model="uuid" placeholder="输入UUID查询" class="uuid-input" />
        <button @click="fetchByUUID" class="query-button">查询</button>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="loading" class="loading-indicator">
        加载中...
      </div>
    </div>

    <div v-if="response || queryResponse" class="result-container">
      <div class="action-bar">
        <button class="action-button back-button" @click="resetForm">
          <i class="fas fa-arrow-left"></i> 返回
        </button>
        <button class="action-button copy-button" @click="copyLink">
          <i class="fas fa-clipboard"></i> 复制链接
        </button>
      </div>

      <div class="metadata-bar">
        <div class="metadata-info">
          <div class="timestamp-row">
            上传时间: {{ formatTimestamp((response || queryResponse).createdAt) }} | 到期时间: {{ formatTimestamp((response || queryResponse).expiresAt) }}
          </div>
          <div class="uuid-display">UUID: {{ currentUUID }}</div>
        </div>
      </div>
      
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
          }"
        />
      </div>

      <div class="ai-analysis">
        <span class="ai-label">AI 解析：</span>
        <div class="ai-content" v-html="renderedSummary"></div>
      </div>

      <div v-if="copySuccess" class="copy-success-tooltip">
        链接已复制到剪贴板！
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { marked } from 'marked'

export default {
  components: {
    MonacoEditor: defineAsyncComponent(() => 
      import('./MonacoEditor.vue')
    )
  },
  data() {
    return {
      inputText: '',
      response: null,
      uuid: '',
      queryResponse: null,
      loading: false,
      error: null,
      copySuccess: false,
      baseUrl: 'https://www.pysio.online/tools/Pastebin.html?uuid='
    }
  },
  computed: {
    displayedText() {
      return (this.response || this.queryResponse)?.text || ''
    },
    renderedSummary() {
      const summary = (this.response || this.queryResponse)?.summary
      return summary ? marked(summary) : ''
    },
    currentUUID() {
      const data = this.response || this.queryResponse;
      if (data) {
        // 无论是提交还是查询，都优先使用id字段，后备使用uuid字段
        return data.id || data.uuid;
      }
      return this.uuid;
    }
  },
  mounted() {
    // 检查URL参数中是否包含uuid
    const urlParams = new URLSearchParams(window.location.search);
    const urlUuid = urlParams.get('uuid');
    if (urlUuid) {
      this.uuid = urlUuid;
      this.fetchByUUID();
    }
  },
  methods: {
    async submitText() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch('https://pastbin.akaere.online', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
          body: this.inputText,
          timeout: 30000, // 30秒超时
        });
        if (!res.ok) throw new Error('提交失败');
        this.response = await res.json();
        if (this.response) {
          const uuid = this.response.id || this.response.uuid; // 使用id字段
          history.pushState({}, '', `?uuid=${uuid}`);
        }
      } catch (error) {
        this.error = `提交错误: ${error.message}`;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchByUUID() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`https://pastbin.akaere.online/paste/${this.uuid}`, {
          timeout: 30000,
        });
        if (!res.ok) throw new Error('查询失败');
        this.queryResponse = await res.json();
        // 更新URL参数，保持一致性
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
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    },
    resetForm() {
      this.response = null;
      this.queryResponse = null;
      this.inputText = '';
      this.uuid = '';
      this.error = null;
      history.pushState({}, '', window.location.pathname); // 清除URL中的uuid参数
    },
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
    }
  },
};
</script>

<style scoped>
.pastebin-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.input-controls {
  margin-bottom: 20px;
}

.result-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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

.editor-container {
  height: 400px;
  width: 100%;
}

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

.error-message {
  color: #ff4444;  padding: 10px;  margin: 10px 0;  background-color: #ffebee;  border: 1px solid #ffcdd2;
  border-radius: 4px;
}

.loading-indicator {
  text-align: center;
  padding: 10px;
  color: #666;
}

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

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  15% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}
</style>