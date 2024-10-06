<template>
  <div class="github-issues">
    <ul class="issue-list">
      <li v-for="issue in openIssues" :key="issue.id" class="issue-item">
        <div class="issue-header" @click="toggleIssue(issue)">
          <span class="issue-title">
            <span class="issue-state" :class="{ 'open': issue.state === 'open' }">●</span>
            {{ issue.title }}
          </span>
          <span class="issue-meta">
            #{{ issue.number }} opened {{ formatDate(issue.created_at) }} by {{ issue.user.login }}
          </span>
        </div>
        <div class="issue-labels">
          <span v-for="label in issue.labels" :key="label.id" 
                :style="{ backgroundColor: `#${label.color}`, color: getContrastYIQ(label.color) }" 
                class="label">
            {{ label.name }}
          </span>
        </div>
        <div v-if="issue.showDetails" class="issue-details">
          <div class="issue-body" v-html="markdownToHtml(issue.body)"></div>
          <div class="issue-comments" v-if="issue.comments > 0">
            <h4>评论 ({{ issue.comments }})</h4>
            <div v-for="comment in issue.commentList" :key="comment.id" class="comment">
              <div class="comment-header">
                <img :src="comment.user.avatar_url" :alt="comment.user.login" class="avatar">
                <span class="comment-author">{{ comment.user.login }}</span>
                <span class="comment-date">commented on {{ formatDate(comment.created_at) }}</span>
              </div>
              <div class="comment-body" v-html="markdownToHtml(comment.body)"></div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { marked } from 'marked';
import moment from 'moment';

export default {
  setup() {
    const issues = ref([]);

    const openIssues = computed(() => {
      return issues.value.filter(issue => issue.state === 'open');
    });

    const getContrastYIQ = (hexcolor) => {
      hexcolor = hexcolor.replace("#", "");
      var r = parseInt(hexcolor.substr(0,2),16);
      var g = parseInt(hexcolor.substr(2,2),16);
      var b = parseInt(hexcolor.substr(4,2),16);
      var yiq = ((r*299)+(g*587)+(b*114))/1000;
      return (yiq >= 128) ? 'black' : 'white';
    }

    const formatDate = (date) => {
      return moment(date).fromNow();
    }

    const markdownToHtml = (markdown) => {
      return marked(markdown);
    }

    const toggleIssue = async (issue) => {
      issue.showDetails = !issue.showDetails;
      if (issue.showDetails && !issue.commentList) {
        try {
          const response = await fetch(`https://api.github.com/repos/pysio2007/Vue-Blog/issues/${issue.number}/comments`, {
            headers: {
              'Authorization': `token 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`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          issue.commentList = await response.json();
        } catch (error) {
          console.error('Error fetching issue comments:', error);
        }
      }
    }

    onMounted(async () => {
      try {
        const response = await fetch('https://api.github.com/repos/pysio2007/Vue-Blog/issues?state=open', {
          headers: {
            'Authorization': `token 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`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        issues.value = await response.json();
        issues.value.forEach(issue => issue.showDetails = false);
      } catch (error) {
        console.error('Error fetching GitHub issues:', error);
      }
    });

    return { openIssues, getContrastYIQ, formatDate, markdownToHtml, toggleIssue };
  }
}
</script>

<style scoped>
.github-issues {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
}

.issue-list {
  list-style-type: none;
  padding: 0;
}

.issue-item {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  margin-bottom: 16px;
  padding: 16px;
}

.issue-header {
  cursor: pointer;
}

.issue-title {
  font-weight: 600;
  font-size: 16px;
}

.issue-state {
  margin-right: 8px;
}

.issue-state.open {
  color: #28a745;
}

.issue-meta {
  color: #586069;
  font-size: 12px;
}

.issue-labels {
  margin-top: 8px;
}

.label {
  display: inline-block;
  padding: 2px 5px;
  margin-right: 5px;
  border-radius: 3px;
  font-size: 12px;
}

.issue-details {
  margin-top: 16px;
  border-top: 1px solid #e1e4e8;
  padding-top: 16px;
}

.issue-body, .comment-body {
  font-size: 14px;
  line-height: 1.5;
}

.comment {
  border-top: 1px solid #e1e4e8;
  padding-top: 16px;
  margin-top: 16px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.comment-author {
  font-weight: 600;
  margin-right: 8px;
}

.comment-date {
  color: #586069;
  font-size: 12px;
}
</style>