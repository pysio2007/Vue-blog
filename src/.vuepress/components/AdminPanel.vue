<template>
  <div class="admin-panel">
    <div v-if="!isLoggedIn" class="login-section">
      <button @click="loginWithGithub" class="github-login-btn">
        <i class="fa-brands fa-github"></i>
        使用GitHub登录
      </button>
    </div>

    <div v-else class="file-manager">
      <div class="user-info">
        <img :src="user.avatar_url" class="avatar" />
        <span>欢迎, {{ user.login }}</span>
        <button @click="logout" class="logout-btn">登出</button>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> 加载中...
      </div>

      <div v-else class="file-list">
        <FileTree :files="files" :githubToken="githubToken" :owner="owner" :repo="repo" @refresh="fetchFiles" />
      </div>
    </div>
  </div>
</template>

<script>
import FileTree from './FileTree.vue'
import Cookies from 'js-cookie'

export default {
  name: 'AdminPanel',
  components: {
    FileTree
  },

  data() {
    return {
      isLoggedIn: false,
      user: null,
      files: [],
      githubToken: null,
      loading: false,
      owner: 'PysioHub',
      repo: 'Vue-blog-Dev'
    }
  },

  methods: {
    saveAuthToCookie(token, user) {
      const expires = 7
      Cookies.set('github_token', token, { expires })
      Cookies.set('user_info', JSON.stringify(user), { expires })
    },

    restoreAuthFromCookie() {
      const token = Cookies.get('github_token')
      const userInfo = Cookies.get('user_info')

      if (token && userInfo) {
        this.githubToken = token
        this.user = JSON.parse(userInfo)
        this.isLoggedIn = true
        this.fetchFiles()
      }
    },

    clearAuthCookie() {
      Cookies.remove('github_token')
      Cookies.remove('user_info')
    },

    async loginWithGithub() {
      const clientId = 'Ov23li2r083J9g6MV9gW';
      const redirectUri = 'http://localhost:8080/admin.html';
      const scope = 'repo user';

      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    },

    async handleAuthCallback() {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        try {
          const response = await fetch('http://localhost:5000/auth/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          this.githubToken = data.access_token;
          await this.fetchUserInfo();
          await this.fetchFiles();

          this.saveAuthToCookie(this.githubToken, this.user);
        } catch (error) {
          // console.error('Authentication failed:', error);
          // alert('登录失败，请重试');
        }
      }
    },

    async fetchUserInfo() {
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${this.githubToken}`
          }
        });
        if (!response.ok) throw new Error('获取用户信息失败');

        this.user = await response.json();
        this.isLoggedIn = true;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        this.logout();
      }
    },

    async fetchFiles() {
      this.loading = true;
      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.owner}/${this.repo}/contents`,
          {
            headers: {
              'Authorization': `token ${this.githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        if (!response.ok) throw new Error('获取文件列表失败');

        const data = await response.json();
        this.files = data.map(file => ({
          path: file.path,
          name: file.name,
          sha: file.sha,
          download_url: file.download_url,
          content: '',
          isEditing: false,
          commitMessage: '',
          type: file.type,
          children: []
        }));
      } catch (error) {
        console.error('Failed to fetch files:', error);
        alert('获取文件列表失败');
      } finally {
        this.loading = false;
      }
    },

    async editFile(file) {
      try {
        const response = await fetch(file.download_url);
        if (!response.ok) throw new Error('获取文件内容失败');

        file.content = await response.text();
        file.isEditing = true;
      } catch (error) {
        console.error('Failed to load file content:', error);
        alert('加载文件内容失败');
      }
    },

    async saveFile(file) {
      if (!file.commitMessage.trim()) {
        alert('请输入提交说明');
        return;
      }

      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${file.path}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `token ${this.githubToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: file.commitMessage,
              content: btoa(file.content),
              sha: file.sha
            })
          }
        );

        if (!response.ok) throw new Error('保存文件失败');

        await this.fetchFiles();
        file.isEditing = false;
      } catch (error) {
        console.error('Failed to save file:', error);
        alert('保存文件失败');
      }
    },

    cancelEdit(file) {
      file.isEditing = false;
      file.content = '';
      file.commitMessage = '';
    },

    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.githubToken = null;
      this.files = [];
      this.clearAuthCookie();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },

  mounted() {
    this.restoreAuthFromCookie();
    this.handleAuthCallback();
  }
}
</script>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.github-login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #24292e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.github-login-btn:hover {
  background: #2c3238;
}

.file-manager {
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f6f8fa;
  border-radius: 6px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-item {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  overflow: hidden;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
}

.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.file-icon {
  color: #586069;
}

.actions {
  display: flex;
  gap: 8px;
}

.editor {
  padding: 12px;
}

.file-editor {
  width: 100%;
  padding: 8px;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  font-family: monospace;
  resize: vertical;
}

.commit-section {
  margin: 12px 0;
}

.commit-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
}

.editor-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn {
  background: #0366d6;
  color: white;
}

.save-btn {
  background: #28a745;
  color: white;
}

.cancel-btn {
  background: #d73a49;
  color: white;
}

.logout-btn {
  background: #d73a49;
  color: white;
}

button:hover {
  opacity: 0.9;
}

.file-tree {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  cursor: pointer;
}

.file-name:hover {
  color: #0366d6;
}

.file-icon {
  width: 16px;
  text-align: center;
  margin-right: 8px;
}
</style>