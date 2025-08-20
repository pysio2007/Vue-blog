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
import GameofLife from "./components/GameofLife.vue";
import Langtonsant from "./components/Langtonsant.vue";
import DNSLeak from "./components/DNSLeak.vue";
import GitCommits from "./components/GitCommits.vue";
import MinecarftMod from "./components/MinecarftMod.vue";
import PwaCheck from "./components/PwaCheck.vue";
import CraftingTable from "./components/CraftingTable.vue";
import StatusCheak from "./components/StatusCheak.vue";
import Statusissues from "./components/Statusissues.vue";
import Pastebin from "./components/Pastebin.vue";
import PictureList from "./components/PictureList.vue";
import game2048 from "./components/game2048.vue";
import GithubUserStats from "./components/GithubUserStats.vue";
import Ghub from "./components/Ghub.vue";
import NFCCard from "./components/NFCCard.vue";
import NFCHandler from "./components/NFCHandler.vue";

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
    app.component("GameofLife", GameofLife);
    app.component("Langtonsant", Langtonsant);
    app.component("DNSLeak", DNSLeak);
    app.component("GitCommits", GitCommits);
    app.component("MinecarftMod", MinecarftMod);
    app.component("PwaCheck", PwaCheck);
    app.component("CraftingTable", CraftingTable);
    app.component("StatusCheak", StatusCheak);
    app.component("Statusissues", Statusissues);
    app.component("Pastebin", Pastebin);
    app.component('PictureList',PictureList);
    app.component('game2048',game2048);
    app.component('GithubUserStats',GithubUserStats);
    app.component("Ghub",Ghub);
    app.component("NFCCard",NFCCard);
    app.component("NFCHandler",NFCHandler)
    
    router.beforeEach((to, from, next) => {
      if (to.path === '/sponsor') {
        window.location.href = 'https://donate.stripe.com/bIY7tG8Xsb7c75K7ss';
        return;
      }
      next();
    });

    // NFC 卡片全局检测
    if (typeof window !== 'undefined') {
      /**
       * Checks for NFC triggers and shows card if conditions are met
       */
      const checkAndShowNFCCard = () => {
        const userAgent = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        const hasNFCTrigger = 
          window.location.search.includes('nfc=1') ||
          window.location.search.includes('source=nfc') ||
          sessionStorage.getItem('nfc-triggered') ||
          document.referrer.includes('shortcuts://');
        
        if (isIOS && hasNFCTrigger && !sessionStorage.getItem('nfc-card-shown')) {
          // 触发自定义事件显示 NFC 卡片
          window.dispatchEvent(new CustomEvent('show-nfc-card'));
          sessionStorage.setItem('nfc-card-shown', 'true');
        }
      };

      router.afterEach(() => {
        setTimeout(checkAndShowNFCCard, 300);
      });
    }
    
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
