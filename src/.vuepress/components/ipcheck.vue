<template>
  <div>
    <div v-if="loading" class="hint-container note">
      <p class="hint-container-title">加载中</p>
      <p>正在获取数据,这可能需要一些时间...</p>
    </div>

    <!-- 当 IP 地址不一致时，展示警告信息 -->
    <div v-if="ipMismatch" class="hint-container warning">
      <p class="hint-container-title">注意</p>
      <p>你可能使用了代理</p>
      <p>工具检测到了2个不同的IP地址，这可能是启用了分流代理导致的</p>
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
      <p class="hint-container-title">你的 IP 是：{{ ipData.ip || ipData.data.ip }}</p>
      <p>国家：{{ ipData.country || ipData.data.country }}</p>
      <p>省：{{ ipData.region || ipData.data.region }}</p>
      <p>城市：{{ ipData.city || ipData.data.city }}</p>
      <p>运营商：{{ ipData.org || ipData.data.org }}</p>
    </div>

    <!-- 展示第二个 IP 的基本信息 -->
    <div v-if="ipMismatch && ipData2" class="hint-container tip">
      <p class="hint-container-title">你的第二个 IP 是：{{ ipData2.ip || ipData2.data.ip }}</p>
      <p>国家：{{ ipData2.country || ipData2.data.country }}</p>
      <p>省：{{ ipData2.region || ipData2.data.region }}</p>
      <p>城市：{{ ipData2.city || ipData2.data.city }}</p>
      <p>运营商：{{ ipData2.org || ipData2.data.org }}</p>
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
      <div v-if="ipData.data && ipData.data.company" class="hint-container tip">
        <p class="hint-container-title">服务提供商</p>
        <p>提供商：{{ ipData.data.company.name }}</p>
        <p>服务商域名：{{ ipData.data.company.domain }}</p>
        <p>服务商类型：{{ ipData.data.company.type }}</p>
      </div>
      <div v-if="ipData.data && ipData.data.asn" class="hint-container tip">
        <p class="hint-container-title">ASN 信息</p>
        <p>ASN 编号：{{ ipData.data.asn.asn }}</p>
        <p>运营商名称：{{ ipData.data.asn.name }}</p>
        <p>运营商域名：{{ ipData.data.asn.domain }}</p>
        <p>IP 路由：{{ ipData.data.asn.route }}</p>
        <p>网络类型：{{ ipData.data.asn.type }}</p>
      </div>
    </div>

    <!-- 当未超速时，展示第二个 IP 的详细信息 -->
    <div v-if="ipMismatch && ipData2 && !isApiLimited">
      <div v-if="isFamilyIP2" class="hint-container tip">
        <p class="hint-container-title">恭喜！</p>
        <p>你的第二个 IP 地址是家庭地址</p>
      </div>
      <div v-if="isVPN2" class="hint-container warning">
        <p class="hint-container-title">注意：</p>
        <p>你的第二个 IP 地址是 VPN 地址。</p>
      </div>
      <div v-if="isProxy2" class="hint-container warning">
        <p class="hint-container-title">注意：</p>
        <p>你的第二个 IP 地址是代理地址。</p>
      </div>
      <div v-if="isTor2" class="hint-container warning">
        <p class="hint-container-title">注意：</p>
        <p>你的第二个 IP 地址是 Tor 地址。</p>
      </div>
      <div v-if="isHosting2" class="hint-container warning">
        <p class="hint-container-title">注意：</p>
        <p>你的第二个 IP 地址是 IDC 地址。</p>
      </div>
      <div v-if="ipData2.data && ipData2.data.company" class="hint-container tip">
        <p class="hint-container-title">服务提供商</p>
        <p>提供商：{{ ipData2.data.company.name }}</p>
        <p>服务商域名：{{ ipData2.data.company.domain }}</p>
        <p>服务商类型：{{ ipData2.data.company.type }}</p>
      </div>
      <div v-if="ipData2.data && ipData2.data.asn" class="hint-container tip">
        <p class="hint-container-title">ASN 信息</p>
        <p>ASN 编号：{{ ipData2.data.asn.asn }}</p>
        <p>运营商名称：{{ ipData2.data.asn.name }}</p>
        <p>运营商域名：{{ ipData2.data.asn.domain }}</p>
        <p>IP 路由：{{ ipData2.data.asn.route }}</p>
        <p>网络类型：{{ ipData2.data.asn.type }}</p>
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
      ipData2: null,
      isApiLimited: false,
      ipMismatch: false,
    };
  },
  computed: {
    isFamilyIP() {
      return (
        this.ipData?.data &&
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
    isFamilyIP2() {
      return (
        this.ipData2?.data &&
        !this.isVPN2 &&
        !this.isProxy2 &&
        !this.isTor2 &&
        !this.isHosting2
      );
    },
    isVPN2() {
      return this.ipData2 && this.ipData2.data?.privacy?.vpn;
    },
    isProxy2() {
      return this.ipData2 && this.ipData2.data?.privacy?.proxy;
    },
    isTor2() {
      return this.ipData2 && this.ipData2.data?.privacy?.tor;
    },
    isHosting2() {
      return this.ipData2 && this.ipData2.data?.privacy?.hosting;
    },
  },
  mounted() {
    this.fetchIPData();
  },
  methods: {
    async fetchIPData() {
      try {
        let userIP, userIP2;
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          if (!ipResponse.ok) {
            throw new Error(`HTTP error! status: ${ipResponse.status}`);
          }
          const ipJson = await ipResponse.json();
          userIP = ipJson.ip;
        } catch (err) {
          // 第一个 API 获取失败，尝试第二个 API
          const ipResponse = await fetch('https://ipinfo.io/json?token=8b1cd5f6e7c400');
          if (!ipResponse.ok) {
            throw new Error(`HTTP error! status: ${ipResponse.status}`);
          }
          const ipJson = await ipResponse.json();
          userIP = ipJson.ip;
        }

        // 获取第二个 IP 地址
        const ipResponse2 = await fetch('https://2024.ipchaxun.com/');
        if (!ipResponse2.ok) {
          throw new Error(`HTTP error! status: ${ipResponse2.status}`);
        }
        const ipJson2 = await ipResponse2.json();
        
        if (ipJson2.ret === 'ok') {
          userIP2 = ipJson2.ip;
          // 创建一个兼容的数据结构
          const compatibleData = {
            ip: ipJson2.ip,
            country: ipJson2.data[0],
            region: ipJson2.data[1],
            city: ipJson2.data[2],
            org: ipJson2.data[4],
            data: {
              ip: ipJson2.ip,
              country: ipJson2.data[0],
              region: ipJson2.data[1],
              city: ipJson2.data[2],
              org: ipJson2.data[4]
            }
          };
          this.ipData2 = compatibleData;
        } else {
          throw new Error('Failed to get IP data from ipchaxun');
        }

        // 比较两个 IP 地址
        if (userIP !== userIP2) {
          this.ipMismatch = true;
        }

        const dataResponse = await fetch(
          `https://blogapi.pysio.online/ipcheck?ip=${userIP}`
        );
        if (!dataResponse.ok) {
          throw new Error(`HTTP error! status: ${dataResponse.status}`);
        }
        const data = await dataResponse.json();

        // 检查是否超速
        if (data['429'] === 'true') {
          // 尝试从 ipinfo.io 获取数据
          const demoResponse = await fetch(`https://ipinfo.io/widget/demo/${userIP}`);
          if (demoResponse.status === 429) {
            // 如果仍然是 429，设置 isApiLimited = true
            this.isApiLimited = true;
            this.ipData = data;
          } else {
            const demoData = await demoResponse.json();
            // 处理 demoData，根据需要更新 ipData 或其他逻辑
            this.ipData = demoData;
          }
        } else {
          this.ipData = data;
        }

        // 获取第二个 IP 的详细信息
        const dataResponse2 = await fetch(
          `https://blogapi.pysio.online/ipcheck?ip=${userIP2}`
        );
        if (!dataResponse2.ok) {
          throw new Error(`HTTP error! status: ${dataResponse2.status}`);
        }
        const data2 = await dataResponse2.json();

        // 检查是否超速
        if (data2['429'] === 'true') {
          // 尝试从 ipinfo.io 获取数据
          const demoResponse2 = await fetch(`https://ipinfo.io/widget/demo/${userIP2}`);
          if (demoResponse2.status === 429) {
            // 如果仍然是 429，设置 isApiLimited = true
            this.isApiLimited = true;
            this.ipData2 = data2;
          } else {
            const demoData2 = await demoResponse2.json();
            // 处理 demoData2，根据需要更新 ipData2 或其他逻辑
            this.ipData2 = demoData2;
          }
        } else {
          this.ipData2 = data2;
        }
      } catch (err) {
        this.error = err.toString();
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>