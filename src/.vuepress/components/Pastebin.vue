<template>
  <div class="pastebin-container">
    <div v-if="!queryResponse" class="input-controls">
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
      <div class="metadata-bar">
        <span class="timestamp">
          上传时间: {{ formatTimestamp((response || queryResponse).createdAt) }} | 
          到期时间: {{ formatTimestamp((response || queryResponse).expiresAt) }}
        </span>
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
        <p class="ai-content">{{ (response || queryResponse).summary }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

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
    }
  },
  computed: {
    displayedText() {
      return (this.response || this.queryResponse)?.text || ''
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
}

.timestamp {
  color: #666;
  font-size: 0.9em;
}

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
  color: #ff4444;
  padding: 10px;
  margin: 10px 0;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
}

.loading-indicator {
  text-align: center;
  padding: 10px;
  color: #666;
}
</style>