import { defineClientConfig } from "vuepress/client";
import GithubIssues from "./components/GithubIssues.vue";
import GitHubPRList from './components/GitHubPRList.vue';
import AsciinemaPlayer from './components/AsciinemaPlayer.vue';
import Fastfetch from "./components/Fastfetch.vue";
import OnlineOrDead from "./components/OnlineOrDead.vue";
import SteamStatus from "./components/SteamStatus.vue";
import HuoShen80Hub from "./components/HuoShen80Hub.vue";


export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component('GitHubPRList', GitHubPRList);
    app.component("GithubIssues", GithubIssues);
    app.component('AsciinemaPlayer', AsciinemaPlayer);
    app.component('Fastfetch',Fastfetch);
    app.component('OnlineOrDead',OnlineOrDead);
    app.component("SteamStatus", SteamStatus);
    app.component("HuoShen80Hub", HuoShen80Hub);
  },
});