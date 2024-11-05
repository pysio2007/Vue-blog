<template>
    <div>
      <div v-if="loading" class="hint-container note">
        <p class="hint-container-title">加载中</p>
        <p>正在获取数据,这可能需要一些时间...</p>
      </div>
  
      <div v-if="error" class="hint-container caution">
        <p class="hint-container-title">错误</p>
        <p>{{ error }}</p>
      </div>
  
      <!-- 当 API 超速时，显示警告信息 -->
      <div v-if="isApiLimited" class="hint-container warning">
        <p class="hint-container-title">注意</p>
        <p>因为 API 超速，仅展示部分信息</p>
      </div>
  
      <!-- 展示 IP 基本信息 -->
      <div v-if="ipData" class="hint-container tip">
        <p class="hint-container-title">你的 IP 是：{{ ipData.ip }}</p>
        <p>国家：{{ ipData.country }}</p>
        <p>省：{{ ipData.region }}</p>
        <p>城市：{{ ipData.city }}</p>
        <p>运营商：{{ ipData.org }}</p>
      </div>
  
      <!-- 当未超速时，展示详细信息 -->
      <div v-if="ipData && !isApiLimited">
        <div v-if="isFamilyIP" class="hint-container tip">
          <p class="hint-container-title">恭喜！</p>
          <p>你的 IP 地址是家庭地址</p>
        </div>
        <div v-if="isVPN" class="hint-container warning">
          <p class="hint-container-title">注意：</p>
          <p>你的 IP 地址是 VPN 地址。</p>
        </div>
        <div v-if="isProxy" class="hint-container warning">
          <p class="hint-container-title">注意：</p>
          <p>你的 IP 地址是代理地址。</p>
        </div>
        <div v-if="isTor" class="hint-container warning">
          <p class="hint-container-title">注意：</p>
          <p>你的 IP 地址是 Tor 地址。</p>
        </div>
        <div v-if="isHosting" class="hint-container warning">
          <p class="hint-container-title">注意：</p>
          <p>你的 IP 地址是 IDC 地址。</p>
        </div>
        <div class="hint-container tip">
          <p class="hint-container-title">服务提供商</p>
          <p>提供商：{{ ipData.data.company.name }}</p>
          <p>服务商域名：{{ ipData.data.company.domain }}</p>
          <p>服务商类型：{{ ipData.data.company.type }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true,
        error: null,
        ipData: null,
        isApiLimited: false,
      };
    },
    computed: {
      isFamilyIP() {
        return (
          this.ipData &&
          this.ipData.data &&
          !this.isVPN &&
          !this.isProxy &&
          !this.isTor &&
          !this.isHosting
        );
      },
      isVPN() {
        return this.ipData && this.ipData.data?.privacy?.vpn;
      },
      isProxy() {
        return this.ipData && this.ipData.data?.privacy?.proxy;
      },
      isTor() {
        return this.ipData && this.ipData.data?.privacy?.tor;
      },
      isHosting() {
        return this.ipData && this.ipData.data?.privacy?.hosting;
      },
    },
    mounted() {
      this.fetchIPData();
    },
    methods: {
      async fetchIPData() {
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipJson = await ipResponse.json();
          const userIP = ipJson.ip;
  
          const dataResponse = await fetch(
            `https://blogapi.pysio.online/ipcheck?ip=${userIP}`
          );
          if (!dataResponse.ok) {
            throw new Error(`HTTP error! status: ${dataResponse.status}`);
          }
          const data = await dataResponse.json();
  
          // 检查是否超速
          if (data['429'] === 'true') {
            this.isApiLimited = true;
          }
  
          this.ipData = data;
        } catch (err) {
          this.error = err.toString();
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>