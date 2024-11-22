<script>
export default {
  data() {
    return {
      servers: [
        {
          name: 'IP-API EDNS测试',
          checkUrl: 'https://1732270485609jason5ng32pn50pg5lc.edns.ip-api.com/json',
          type: 'ipapi'
        },
        {
          name: 'Surfshark DNS测试 1',
          checkUrl: 'https://jn3251p89cbk2.ipv4.surfsharkdns.com/',
          type: 'surfshark'  
        },
        {
          name: 'IP-API EDNS测试 2',
          checkUrl: 'https://1732270486343jason5ng32e0le66xag.edns.ip-api.com/json',
          type: 'ipapi'
        },
        {
          name: 'Surfshark DNS测试 2', 
          checkUrl: 'https://jn32k8apxopfr.ipv4.surfsharkdns.com/',
          type: 'surfshark'
        }
      ].map(server => ({
        ...server,
        result: { status: 'checking', statusClass: 'note' }
      }))
    };
  },

  created() {
    this.startCheck();
  },

  methods: {
    startCheck() {
      this.servers.forEach(server => {
        this.checkDNS(server);
      });
    },

    async parseIPFromResponse(response, type) {
      const data = await response.json();
      
      if (type === 'ipapi') {
        return {
          ips: [{
            ip: data.dns.ip,
            location: data.dns.geo
          }, {
            ip: data.edns?.ip, 
            location: data.edns?.geo
          }].filter(item => item.ip)
        };
      } else if (type === 'surfshark') {
        return {
          ips: Object.values(data).map(item => ({
            ip: item.IP,
            location: `${item.City}, ${item.Country}`,
            leaked: item.Leak
          }))
        };
      }
    },

    async checkDNS(server) {
      try {
        server.result.status = 'checking';
        server.result.statusClass = 'note';
        
        const response = await fetch(server.checkUrl);
        if (!response.ok) throw new Error('Check failed');

        const result = await this.parseIPFromResponse(response, server.type);
        
        server.result.status = 'success';
        server.result.statusClass = result.ips.some(ip => ip.leaked) ? 'warning' : 'tip';
        server.result.ips = result.ips;
        
      } catch (error) {
        console.error(`${server.name} 检测失败:`, error);
        server.result.status = 'failed';
        server.result.statusClass = 'caution';
      }
    },

    getChinaIPs(ips) {
      return ips?.filter(ip => ip.location.includes('China')) || [];
    },

    getNonChinaIPs(ips) {
      return ips?.filter(ip => !ip.location.includes('China')) || [];
    },

    refreshAll() {
      this.servers.forEach(server => {
        this.checkDNS(server);
      });
    }
  }
};
</script>

<template>
  <div>
    
    <div v-for="server in servers" 
         :key="server.name" 
         :class="['hint-container', server.result.statusClass]">
      <p class="hint-container-title">{{ server.name }}</p>
      <p v-if="server.result.status === 'checking'">检测中...</p>
      
      <template v-if="server.result.status === 'success'">
        <!-- 中国区IP -->
        <div v-if="getChinaIPs(server.result.ips).length" class="ip-group">
          <h4>中国区域</h4>
          <div v-for="(ip, index) in getChinaIPs(server.result.ips)" 
               :key="'cn-'+index" 
               class="ip-result">
            <p>解析IP: {{ ip.ip }}</p>
            <p>解析位置: {{ ip.location }}</p>
            <p v-if="ip.leaked" class="warning">
              <span class="leak-text">存在DNS泄露!</span>
            </p>
          </div>
        </div>

        <!-- 海外区IP -->
        <div v-if="getNonChinaIPs(server.result.ips).length" class="ip-group">
          <h4>海外区域</h4>
          <div v-for="(ip, index) in getNonChinaIPs(server.result.ips)" 
               :key="'other-'+index" 
               class="ip-result">
            <p>解析IP: {{ ip.ip }}</p>
            <p>解析位置: {{ ip.location }}</p>
            <p v-if="ip.leaked" class="warning">
              <span class="leak-text">存在DNS泄露!</span>
            </p>
          </div>
        </div>
      </template>
      
      <p v-if="server.result.status === 'failed'" class="error">检测失败</p>
    </div>
  </div>
</template>

<style scoped>

/* .ip-group {
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
} */

/* .ip-group h4 {
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
} */

.ip-result {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

.leak-text {
  color: #ff0000;
  font-weight: bold;
}

</style>