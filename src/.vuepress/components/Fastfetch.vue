<template>
  <div>
    <div v-if="loading" class="hint-container note">
      <p class="hint-container-title">加载中</p>
      <p>正在获取数据，这可能需要一些时间...</p>
    </div>
    <div v-else class="fastfetch-output" v-html="markdownOutput"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Convert from 'ansi-to-html';
import { marked } from 'marked';

export default {
  name: 'Fastfetch',
  setup() {
    const output = ref('');
    const markdownOutput = ref('');
    const loading = ref(true); // 添加loading状态
    const convert = new Convert();

    const fetchData = async () => {
      try {
        const response = await fetch('https://blogapi.pysio.online/fastfetch');
        const data = await response.json();
        output.value = data.output;
        formatOutput();
      } catch (error) {
        console.error('Error fetching ', error);
      } finally {
        loading.value = false; // 数据获取完成后设置loading为false
      }
    };

    const formatOutput = () => {
      // Convert ANSI to HTML
      let html = convert.toHtml(output.value);
      
      // Wrap the HTML in a Markdown code block
      const markdownCode = "```bash\n" + html + "\n```";
      
      // Use marked to convert Markdown to HTML
      markdownOutput.value = marked(markdownCode);
    };

    onMounted(() => {
      fetchData();
    });

    return {
      markdownOutput,
      loading // 返回loading状态
    };
  }
}
</script>

<style scoped>
.fastfetch-output {
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.hint-container.note {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.hint-container-title {
  font-weight: bold;
  margin-bottom: 5px;
}
</style>