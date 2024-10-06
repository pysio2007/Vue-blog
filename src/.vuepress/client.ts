import { defineClientConfig } from "vuepress/client";
import GithubIssues from "./components/GithubIssues.vue";
import GitHubPRList from './components/GitHubPRList.vue';

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component('GitHubPRList', GitHubPRList);
    app.component("GithubIssues", GithubIssues);
  },
});