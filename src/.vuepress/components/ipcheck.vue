<template>
    <div>
      <div v-if="loading" class="hint-container note">
        <p class="hint-container-title">加载中</p>
        <p>正在获取数据,这可能需要一些时间...</p>
      </div>
      <div v-if="error" class="hint-container caution">
        <p class="hint-container-title">错误</p>
        <p> {{ error }} </p>
      </div>
      <div v-if="isFamilyIP" class="hint-container tip">
        <p class="hint-container-title">恭喜！</p>
        <p> 你的 IP 地址是家庭地址 </p>
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
      <div v-if="ipData" class="hint-container tip">
        <p class="hint-container-title">你的 IP 是：{{ ipData.data.ip }}</p>
        <p><br>国家：{{ ipData.data.country }}</p>
        <p><br>省：{{ ipData.data.region }}</p>
        <p><br>城市：{{ ipData.data.city }}</p>
        <p><br>运营商：{{ ipData.data.org }}</p>
      </div>
      <div v-if="ipData" class="hint-container tip">
        <p class="hint-container-title">服务提供商</p>
        <p><br>提供商：{{ ipData.data.company.name }}</p>
        <p><br>服务商域名：{{ ipData.data.company.domain }}</p>
        <p><br>服务商类型：{{ ipData.data.company.type }}</p>
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
      };
    },
    computed: {
      isFamilyIP() {
        return this.ipData && !this.isVPN && !this.isProxy && !this.isTor && !this.isHosting;
      },
      isVPN() {
        return this.ipData && this.ipData.data.privacy.vpn;
      },
      isProxy() {
        return this.ipData && this.ipData.data.privacy.proxy;
      },
      isTor() {
        return this.ipData && this.ipData.data.privacy.tor;
      },
      isHosting() {
        return this.ipData && this.ipData.data.privacy.hosting;
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
  
          const dataResponse = await fetch(`https://blogapi.pysio.online/ipcheck?ip=${userIP}`);
          if (!dataResponse.ok) {
            throw new Error(`HTTP error! status: ${dataResponse.status}`);
          }
          this.ipData = await dataResponse.json();
        } catch (err) {
          this.error = err.toString();
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>