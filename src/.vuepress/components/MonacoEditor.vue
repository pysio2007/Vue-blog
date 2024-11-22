<!-- 因优化问题 本文件废弃 -->
<template>
    <div class="monaco-editor-wrapper">
        <div class="monaco-editor-container" ref="editorContainer"></div>
    </div>
</template>

<script>
import * as monaco from 'monaco-editor'

export default {
    name: 'MonacoEditor',
    props: {
        value: {
            type: String,
            required: true
        },
        language: {
            type: String,
            default: 'plaintext'
        }
    },

    data() {
        return {
            editor: null,
            preventChange: false
        }
    },

    mounted() {
        this.initMonaco()
    },

    beforeDestroy() {
        if (this.editor) {
            this.editor.dispose()
        }
    },

    methods: {
        initMonaco() {
            // 创建编辑器之前确保有容器
            if (!this.$refs.editorContainer) return

            const options = {
                value: this.value,
                language: this.language,
                theme: 'vs',
                minimap: { enabled: false },
                automaticLayout: true,
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on'
            }

            this.editor = monaco.editor.create(this.$refs.editorContainer, options)

            // 监听内容变化
            this.editor.onDidChangeModelContent(() => {
                if (!this.preventChange) {
                    const value = this.editor.getValue()
                    this.$emit('input', value)
                }
            })

            // 强制布局更新
            setTimeout(() => {
                this.editor.layout()
            }, 100)
        }
    },

    watch: {
        value: {
            handler(newValue) {
                if (this.editor && newValue !== this.editor.getValue()) {
                    this.preventChange = true
                    this.editor.setValue(newValue)
                    this.preventChange = false
                }
            },
            immediate: true
        },

        language(newLang) {
            if (this.editor) {
                monaco.editor.setModelLanguage(this.editor.getModel(), newLang)
            }
        }
    }
}
</script>

<style scoped>
.monaco-editor-wrapper {
    width: 100%;
    height: 500px;
    border: 1px solid #e1e4e8;
    border-radius: 4px;
    overflow: hidden;
}

.monaco-editor-container {
    width: 100%;
    height: 100%;
}
</style>