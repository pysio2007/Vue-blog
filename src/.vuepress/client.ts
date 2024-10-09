import { defineClientConfig } from "vuepress/client";
import GithubIssues from "./components/GithubIssues.vue";
import GitHubPRList from './components/GitHubPRList.vue';
import AsciinemaPlayer from './components/AsciinemaPlayer.vue';
import Fastfetch from "./components/Fastfetch.vue";
import OnlineOrDead from "./components/OnlineOrDead.vue";


export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component('GitHubPRList', GitHubPRList);
    app.component("GithubIssues", GithubIssues);
    app.component('AsciinemaPlayer', AsciinemaPlayer);
    app.component('Fastfetch',Fastfetch);
    app.component('OnlineOrDead',OnlineOrDead);
  },
});