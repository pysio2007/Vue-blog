<template>
  <div class="fastfetch-output" v-html="markdownOutput"></div>
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
    const convert = new Convert();

    const fetchData = async () => {
      try {
        const response = await fetch('https://blogapi.pysio.online/fastfetch');
        const data = await response.json();
        output.value = data.output;
        formatOutput();
      } catch (error) {
        console.error('Error fetching ', error);
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
      markdownOutput
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
</style>