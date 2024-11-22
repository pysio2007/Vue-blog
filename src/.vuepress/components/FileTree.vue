<template>
    <div class="file-tree">
        <!-- 新建文件按钮 -->
        <div class="create-file-btn">
            <button @click="showCreateFileModal" class="new-btn">
                <i class="fas fa-plus"></i> 新建文件
            </button>
        </div>

        <!-- 文件列表 -->
        <div v-for="file in files" :key="file.path" class="file-item">
            <!-- 文件/文件夹头部 -->
            <div class="file-header"
                :style="{ paddingLeft: `${(path ? parseInt(path.split('/').length) : 0) * 20}px` }">
                <span class="file-name" @click="file.type === 'dir' && toggleDir(file)">
                    <i :class="getFileIconClass(file)"></i>
                    {{ file.name || file.path }}
                </span>
                <div class="actions">
                    <button v-if="file.type === 'file'" @click="editFile(file)" class="edit-btn">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                </div>
            </div>

            <!-- 文件编辑器部分 -->
            <div v-if="file.isEditing" class="editor">
                <MonacoEditor :key="`editor-${file.path}`" :value="file.content" v-model="file.content"
                    :language="getFileLanguage(file)" />
                <div class="commit-section">
                    <input v-model="file.commitMessage" class="commit-input" placeholder="请输入提交说明" />
                </div>
                <div class="editor-actions">
                    <button @click="saveFile(file)" class="save-btn">
                        <i class="fas fa-save"></i> 保存
                    </button>
                    <button @click="cancelEdit(file)" class="cancel-btn">
                        <i class="fas fa-times"></i> 取消
                    </button>
                </div>
            </div>

            <!-- 子目录内容 -->
            <div v-if="file.type === 'dir' && expandedDirs.has(file.path)" class="subdirectory">
                <FileTree v-if="file.children.length" :files="file.children" :githubToken="githubToken" :owner="owner"
                    :repo="repo" :path="file.path" @refresh="$emit('refresh')" />
            </div>
        </div>

        <!-- 新建文件模态框 -->
        <div v-if="showNewFileModal" class="modal">
            <div class="modal-content">
                <h2>新建文件</h2>
                <div class="form-group">
                    <label>文件路径:</label>
                    <input v-model="newFile.path" class="path-input" placeholder="例如: docs/example.md" />
                </div>
                <div class="form-group">
                    <label>文件内容:</label>
                    <MonacoEditor 
                        :value="newFile.content" 
                        v-model="newFile.content"
                        :language="getFileLanguage(newFile)" 
                    />
                </div>
                <div class="form-group">
                    <label>提交说明:</label>
                    <input v-model="newFile.commitMessage" class="commit-input" placeholder="请输入提交说明" />
                </div>
                <div class="modal-actions">
                    <button @click="createNewFile" class="save-btn">
                        <i class="fas fa-save"></i> 创建
                    </button>
                    <button @click="closeCreateFileModal" class="cancel-btn">
                        <i class="fas fa-times"></i> 取消
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MonacoEditor from './MonacoEditor.vue'

export default {
    components: {
        MonacoEditor
    },

    name: 'FileTree',
    props: {
        files: Array,
        githubToken: String,
        owner: String,
        repo: String,
        path: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            expandedDirs: new Set(),
            showNewFileModal: false,
            newFile: {
                path: '',
                content: '',
                commitMessage: ''
            }
        }
    },

    methods: {
        showCreateFileModal() {
            this.showNewFileModal = true;
        },

        closeCreateFileModal() {
            this.showNewFileModal = false;
            this.newFile = {
                path: '',
                content: '',
                commitMessage: ''
            };
        },

        async createNewFile() {
            if (!this.newFile.path.trim()) {
                alert('请输入文件路径');
                return;
            }
            if (!this.newFile.commitMessage.trim()) {
                alert('请输入提交说明');
                return;
            }

            try {
                const response = await fetch(
                    `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.newFile.path}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `token ${this.githubToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: this.newFile.commitMessage,
                            content: btoa(this.newFile.content)
                        })
                    }
                );

                if (!response.ok) throw new Error('创建文件失败');

                this.$emit('refresh');
                this.closeCreateFileModal();
            } catch (error) {
                console.error('Failed to create file:', error);
                alert('创建文件失败');
            }
        },

        toggleDir(file) {
            if (this.expandedDirs.has(file.path)) {
                this.expandedDirs.delete(file.path);
                file.children = [];
            } else {
                this.expandedDirs.add(file.path);
                this.loadDirContents(file);
            }
        },

        getFileIconClass(file) {
            if (file.type === 'dir') {
                return [
                    'fas',
                    this.expandedDirs.has(file.path) ? 'fa-folder-open' : 'fa-folder'
                ]
            }
            return ['fas', 'fa-file']
        },

        async loadDirContents(dir) {
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${dir.path}`,
                    {
                        headers: {
                            'Authorization': `token ${this.githubToken}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );

                if (!response.ok) throw new Error('获取文件列表失败');

                const data = await response.json();
                dir.children = data.map(file => ({
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
                console.error('Failed to fetch directory contents:', error);
                alert('获取目录内容失败');
            }
        },

        async editFile(file) {
            try {
                const response = await fetch(file.download_url);
                if (!response.ok) throw new Error('获取文件内容失败');

                const content = await response.text();

                file.content = content;
                await this.$nextTick();
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

                this.$emit('refresh');
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

        getFileLanguage(file) {
            const ext = (file.name || file.path || '').split('.').pop().toLowerCase()
            const languageMap = {
                'js': 'javascript',
                'ts': 'typescript',
                'vue': 'html',
                'json': 'json',
                'md': 'markdown',
                'py': 'python',
                'css': 'css',
                'html': 'html',
                'scss': 'scss'
            }
            return languageMap[ext] || 'plaintext'
        }
    }
}
</script>

<style scoped>
.file-tree {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.create-file-btn {
    margin: 12px;
}

.new-btn {
    background: #2ea44f;
    color: white;
}

.file-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 2px 0;
}

.file-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: 4px;
    width: 100%;
}

.file-name {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.file-name i {
    margin-right: 8px;
    color: #586069;
}

.file-name:hover {
    color: #0366d6;
}

.subdirectory {
    width: 100%;
    margin-left: 20px;
}

.editor {
    padding: 12px;
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
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 12px;
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

button:hover {
    opacity: 0.9;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 24px;
    border-radius: 8px;
    width: 80%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
}

.path-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #e1e4e8;
    border-radius: 4px;
    margin-bottom: 16px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
}
</style>