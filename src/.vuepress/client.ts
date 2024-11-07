import { defineClientConfig } from "vuepress/client";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import GithubIssues from "./components/GithubIssues.vue";
import GitHubPRList from './components/GitHubPRList.vue';
import AsciinemaPlayer from './components/AsciinemaPlayer.vue';
import Fastfetch from "./components/Fastfetch.vue";
import OnlineOrDead from "./components/OnlineOrDead.vue";
import SteamStatus from "./components/SteamStatus.vue";
import HuoShen80Hub from "./components/HuoShen80Hub.vue";
import Wordle from "./components/Wordle.vue";
import console from "./components/console.vue";
import ipcheck from "./components/ipcheck.vue";
import Connectivity from "./components/Connectivity.vue";
import WebRTC from "./components/WebRTC.vue";
import Randompicturecount from "./components/Randompicturecount.vue";


export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component('GitHubPRList', GitHubPRList);
    app.component("GithubIssues", GithubIssues);
    app.component('AsciinemaPlayer', AsciinemaPlayer);
    app.component('Fastfetch',Fastfetch);
    app.component('OnlineOrDead',OnlineOrDead);
    app.component("SteamStatus", SteamStatus);
    app.component("HuoShen80Hub", HuoShen80Hub);
    app.component("Wordle", Wordle);
    app.component("console", console);
    app.component("ipcheck", ipcheck);
    app.component("Connectivity", Connectivity);
    app.component("WebRTC", WebRTC);
    app.component("Randompicturecount", Randompicturecount);
    Sentry.init({
      dsn: "https://188c5d205854b35b009d4ad76674d3bc@o4508158776705024.ingest.us.sentry.io/4508158792826880", // 替换为你的 Sentry DSN
      integrations: [
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0, // 采样率，1.0 表示 100% 采样
      replaysSessionSampleRate: 0.1, 
      replaysOnErrorSampleRate: 1.0,
    });
  },
});