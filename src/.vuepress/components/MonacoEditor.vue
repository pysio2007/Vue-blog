<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script>
import * as monaco from 'monaco-editor'

export default {
  name: 'MonacoEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'plaintext'
    },
    theme: {
      type: String,
      default: 'vs-dark'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.initMonaco()
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.dispose()
    }
  },
  methods: {
    initMonaco() {
      const options = {
        value: this.modelValue,
        language: this.language,
        theme: this.theme,
        automaticLayout: true,
        ...this.options
      }

      this.editor = monaco.editor.create(this.$refs.editorContainer, options)

      this.editor.onDidChangeModelContent(() => {
        const value = this.editor.getValue()
        this.$emit('update:modelValue', value)
      })
    }
  },
  watch: {
    modelValue(newValue) {
      if (this.editor && newValue !== this.editor.getValue()) {
        this.editor.setValue(newValue)
      }
    },
    options: {
      deep: true,
      handler(newVal) {
        if (this.editor) {
          this.editor.updateOptions(newVal)
        }
      }
    }
  }
}
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
}
</style>
