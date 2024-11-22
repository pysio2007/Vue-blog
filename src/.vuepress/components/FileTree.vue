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
            <div v-if="editingFile" class="modal">
                <div class="modal-content edit-modal">
                    <h2>正在编辑: {{ editingFile.name || editingFile.path }}</h2>
                    <div class="form-group">
                        <div class="editor-wrapper">
                            <div class="editor-preview" ref="preview"
                                v-html="highlightCode(editingFile.content || '', getFileLanguage(editingFile))" />
                            <textarea v-model="editingFile.content" class="editor-textarea" spellcheck="false"
                                ref="textarea" @input="updatePreview" @scroll="syncScroll" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>提交说明:</label>
                        <input v-model="editingFile.commitMessage" class="commit-input" placeholder="请输入提交说明" />
                    </div>
                    <div class="modal-actions">
                        <button @click="saveFile(editingFile)" class="save-btn">
                            <i class="fas fa-save"></i> 保存
                        </button>
                        <button @click="cancelEdit(editingFile)" class="cancel-btn">
                            <i class="fas fa-times"></i> 取消
                        </button>
                    </div>
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
                    <div class="editor-wrapper">
                        <div class="editor-preview" ref="newFilePreview"
                            v-html="highlightCode(newFile.content || '', getFileLanguage(newFile))" />
                        <textarea v-model="newFile.content" class="editor-textarea" spellcheck="false"
                            ref="newFileTextarea" @input="updatePreviewNewFile" @scroll="syncScrollNewFile" />
                    </div>
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
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

export default {
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
            showNewFileModal: false,
            editingFile: null,
            newFile: {
                path: '',
                content: '',
                commitMessage: ''
            },
            expandedDirs: new Set()
        }
    },

    methods: {

        highlightCode(code, language) {
            if (!code) return ''
            return Prism.highlight(
                code,
                Prism.languages[language] || Prism.languages.text,
                language
            )
        },
        updatePreview() {
            // 更新编辑文件的预览内容
            if (this.$refs.preview) {
                this.$refs.preview.innerHTML = this.highlightCode(this.editingFile.content || '', this.getFileLanguage(this.editingFile));
            }
        },

        updatePreviewNewFile() {
            // 更新新建文件的预览内容
            if (this.$refs.newFilePreview) {
                this.$refs.newFilePreview.innerHTML = this.highlightCode(this.newFile.content || '', this.getFileLanguage(this.newFile));
            }
        },

        syncScroll() {
            const preview = this.$refs.preview;
            const textarea = this.$refs.textarea;

            if (preview && textarea) {
                preview.scrollTop = textarea.scrollTop;
                preview.scrollLeft = textarea.scrollLeft;
            }
        },

        syncScrollNewFile() {
            const preview = this.$refs.newFilePreview;
            const textarea = this.$refs.newFileTextarea;

            if (preview && textarea) {
                preview.scrollTop = textarea.scrollTop;
                preview.scrollLeft = textarea.scrollLeft;
            }
        },

        showCreateFileModal() {
            this.showNewFileModal = true;
            this.$nextTick(() => {
                this.updatePreviewNewFile();
            });
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
                this.editingFile = file;
                this.updatePreview();
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
                this.editingFile = null; // 清除当前编辑的文件
            } catch (error) {
                console.error('Failed to save file:', error);
                alert('保存文件失败');
            }
        },

        cancelEdit(file) {
            file.content = '';
            file.commitMessage = '';
            this.editingFile = null; // 清除当前编辑的文件
        },

        getFileLanguage(file) {
            const ext = (file.path || '').split('.').pop().toLowerCase()
            const languageMap = {
                'js': 'javascript',
                'ts': 'typescript',
                'tsx': 'typescript',
                'vue': 'markup',
                'md': 'markdown',
                'py': 'python',
                'css': 'css',
                'html': 'markup',
                'json': 'javascript'
            }
            return languageMap[ext] || 'text'
        },
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
    height: 300px;
    border: 1px solid #e1e4e8;
    border-radius: 4px;
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

.modal-content {
    width: 90%;
    /* 增大宽度 */
    max-width: 1200px;
    /* 增大最大宽度 */
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    background: white;
    padding: 24px;
    border-radius: 8px;
}

.editor-wrapper {
    flex: 1;
    min-height: 300px;
    height: calc(80vh - 200px);
    position: relative;
    border: 1px solid #e1e4e8;
    border-radius: 4px;
    overflow: hidden;
}

/* 修复预览和编辑区域样式 */
.editor-preview,
.editor-textarea {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 1rem;
    overflow: auto;
    white-space: pre;
    font-size: 14px;
    line-height: 1.5;
    tab-size: 2;
    box-sizing: border-box;
}

.editor-preview {
    pointer-events: none;
    background: #f6f8fa;
    z-index: 1;
    color: #000;
}

.editor-textarea {
    color: transparent;
    background: transparent;
    caret-color: #000;
    resize: none;
    border: none;
    outline: none;
    z-index: 2;

    /* 添加选择文本样式 */
    &::selection {
        background: rgba(0, 0, 0, 0.1);
    }
}

/* 确保预览区域内容正确显示 */
.editor-preview pre {
    margin: 0;
    background: transparent !important;
}

.editor-preview code {
    background: transparent !important;
    font-family: inherit;
}

/* 修复滚动条样式 */
.editor-preview::-webkit-scrollbar,
.editor-textarea::-webkit-scrollbar {
    width: 12px;
    height: 12px;
}

.editor-preview::-webkit-scrollbar-thumb,
.editor-textarea::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    border: 3px solid #f6f8fa;
}

.editor-preview::-webkit-scrollbar-track,
.editor-textarea::-webkit-scrollbar-track {
    background: #f6f8fa;
}

pre {
    margin: 0;
    padding: 0;
}

code {
    padding: 0;
}
</style>