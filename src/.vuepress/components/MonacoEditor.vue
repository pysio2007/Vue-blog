<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script>
import loader from '@monaco-editor/loader';

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
      editor: null,
      monaco: null
    }
  },
  watch: {
    modelValue(newValue) {
      if (this.editor && newValue !== this.editor.getValue()) {
        this.editor.setValue(newValue);
      }
    }
  },
  mounted() {
    this.initMonaco();
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.dispose();
    }
  },
  methods: {
    async initMonaco() {
      try {
        this.monaco = await loader.init();
        this.editor = this.monaco.editor.create(this.$refs.editorContainer, {
          value: this.modelValue,
          language: this.language,
          theme: this.theme,
          ...this.options
        });

        this.editor.onDidChangeModelContent(() => {
          const value = this.editor.getValue();
          this.$emit('update:modelValue', value);
        });
      } catch (error) {
        console.error('Monaco initialization error:', error);
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
