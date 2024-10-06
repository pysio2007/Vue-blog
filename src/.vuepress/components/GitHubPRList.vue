<template>
    <div class="pr-list">
      <ul class="pr-items">
        <li v-for="pr in openPRs" :key="pr.number" class="pr-item">
          <div class="pr-header" @click="togglePRDetails(pr)">
            <span class="pr-icon">
              <svg class="octicon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path>
              </svg>
            </span>
            <a :href="pr.html_url" target="_blank" class="pr-title">{{ pr.title }}</a>
            <span class="pr-number">#{{ pr.number }}</span>
          </div>
          <div class="pr-meta">
            <span>Opened by {{ pr.user.login }} {{ formatDate(pr.created_at) }}</span>
          </div>
          <div class="pr-labels">
            <span v-for="label in pr.labels" :key="label.id" class="pr-label" :style="{ backgroundColor: `#${label.color}` }">
              {{ label.name }}
            </span>
          </div>
          <div v-if="pr.showDetails" class="pr-details">
            <div class="pr-description" v-html="markdownToHtml(pr.body)"></div>
            <div class="pr-comments" v-if="pr.comments > 0">
              <h4>Comments ({{ pr.comments }})</h4>
              <ul v-if="pr.commentList">
                <li v-for="comment in pr.commentList" :key="comment.id" class="comment">
                  <div class="comment-header">
                    <img :src="comment.user.avatar_url" :alt="comment.user.login" class="avatar">
                    <span class="comment-author">{{ comment.user.login }}</span>
                    <span class="comment-date">commented {{ formatDate(comment.created_at) }}</span>
                  </div>
                  <div class="comment-body" v-html="markdownToHtml(comment.body)"></div>
                </li>
              </ul>
            </div>
            <div class="pr-commits">
              <h4>Commits</h4>
              <ul v-if="pr.commitList">
                <li v-for="commit in pr.commitList" :key="commit.sha" class="commit">
                  <span class="commit-sha">{{ commit.sha.substring(0, 7) }}</span>
                  <span class="commit-message">{{ commit.commit.message }}</span>
                  <span class="commit-author">by {{ commit.commit.author.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { marked } from 'marked';
  
  export default {
    data() {
      return {
        openPRs: [],
      };
    },
    mounted() {
      this.fetchPRs();
    },
    methods: {
      async fetchPRs() {
        try {
          const response = await fetch('https://api.github.com/repos/pysio2007/Vue-Blog/pulls?state=open', {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          this.openPRs = await response.json();
          this.openPRs.forEach(pr => pr.showDetails = false);
        } catch (error) {
          console.error('Failed to fetch PRs:', error);
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1 ? 'yesterday' : `${diffDays} days ago`;
      },
      markdownToHtml(markdown) {
        return marked(markdown);
      },
      async togglePRDetails(pr) {
        pr.showDetails = !pr.showDetails;
        if (pr.showDetails && !pr.commentList) {
          await this.fetchPRComments(pr);
          await this.fetchPRCommits(pr);
        }
      },
      async fetchPRComments(pr) {
        try {
          const response = await fetch(`https://api.github.com/repos/pysio2007/Vue-Blog/issues/${pr.number}/comments`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          pr.commentList = await response.json();
        } catch (error) {
          console.error('Failed to fetch PR comments:', error);
        }
      },
      async fetchPRCommits(pr) {
        try {
          const response = await fetch(`https://api.github.com/repos/pysio2007/Vue-Blog/pulls/${pr.number}/commits`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          pr.commitList = await response.json();
        } catch (error) {
          console.error('Failed to fetch PR commits:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .pr-list {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .pr-items {
    list-style-type: none;
    padding: 0;
  }
  
  .pr-item {
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    margin-bottom: 16px;
    padding: 16px;
  }
  
  .pr-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    cursor: pointer;
  }
  
  .pr-icon {
    margin-right: 8px;
    color: #28a745;
  }
  
  .pr-title {
    font-weight: 600;
    color: #24292e;
    text-decoration: none;
  }
  
  .pr-number {
    color: #586069;
    margin-left: 8px;
  }
  
  .pr-meta {
    font-size: 12px;
    color: #586069;
    margin-bottom: 8px;
  }
  
  .pr-labels {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .pr-label {
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
  }
  
  .pr-details {
    margin-top: 16px;
    border-top: 1px solid #e1e4e8;
    padding-top: 16px;
  }
  
  .pr-description, .comment-body {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
  }
  
  .comment, .commit {
    border-top: 1px solid #e1e4e8;
    padding-top: 16px;
    margin-top: 16px;
  }
  
  .comment-header, .commit {
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
  
  .comment-author, .commit-sha {
    font-weight: 600;
    margin-right: 8px;
  }
  
  .comment-date, .commit-author {
    color: #586069;
    font-size: 12px;
  }
  
  .commit-message {
    flex-grow: 1;
    margin: 0 8px;
  }
  </style>