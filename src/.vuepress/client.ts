import { defineClientConfig } from "vuepress/client";
import GithubIssues from "./components/GithubIssues.vue";

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component("GithubIssues", GithubIssues);
  },
});