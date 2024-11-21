<template>
  <div>
    <div v-for="server in servers" :key="server.name" :class="['hint-container', server.result.statusClass]">
      <p class="hint-container-title">{{ server.name }}</p>
      <p v-if="server.result.status === 'connecting'">连接中...</p>
      <p v-if="server.result.status === 'success'">IP: {{ server.result.ip }}</p>
      <p v-if="server.result.status === 'success'">NAT 类型: {{ server.result.natType }}</p>
      <p v-if="server.result.status === 'failed'">连接失败</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      servers: [
        { name: 'Pysio Home', url: 'stun:stun.pysio.tech:3478', result: { status: 'connecting', statusClass: 'note' } },
        { name: 'Nerv Games', url: 'stun:stun.nerv.games:3478', result: { status: 'connecting', statusClass: 'note' } },
        { name: 'Google', url: 'stun:stun.l.google.com:19302', result: { status: 'connecting', statusClass: 'note' } },
        { name: 'BlackBerry', url: 'stun:stun.voip.blackberry.com:3478', result: { status: 'connecting', statusClass: 'note' } },
        { name: 'Twilio', url: 'stun:global.stun.twilio.com:3478', result: { status: 'connecting', statusClass: 'note' } },
        { name: 'Cloudflare', url: 'stun:stun.cloudflare.com:3478', result: { status: 'connecting', statusClass: 'note' } }
      ]
    };
  },
  mounted() {
    this.servers.forEach(server => {
      this.testServer(server);
    });
  },
  methods: {
    async testServer(server) {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: server.url }]
      });

      return new Promise((resolve) => {
        let candidateFound = false;
        let bestCandidate = null;

        const timeout = setTimeout(() => {
          if (!candidateFound) {
            server.result.status = 'failed';
            server.result.statusClass = 'caution';
            pc.close();
            resolve();
          }
        }, 5000);

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate;

            // 只处理srflx类型的候选者（这表示公网IP）
            if (candidate.type === 'srflx') {
              candidateFound = true;
              bestCandidate = candidate;
              
              server.result.ip = candidate.address || '未知';
              server.result.natType = candidate.type || '未知';
              server.result.status = 'success';
              server.result.statusClass = 'tip';

              clearTimeout(timeout);
              pc.close();
              resolve();
            }
          }
        };

        pc.onicegatheringstatechange = () => {
          if (pc.iceGatheringState === 'complete' && !candidateFound) {
            server.result.status = 'failed';
            server.result.statusClass = 'caution';
            clearTimeout(timeout);
            pc.close();
            resolve();
          }
        };

        try {
          // 创建数据通道触发ICE收集
          pc.createDataChannel('test');
          pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .catch(error => {
              console.error('创建offer失败:', error);
              server.result.status = 'failed';
              server.result.statusClass = 'caution';
              clearTimeout(timeout);
              pc.close();
              resolve();
            });
        } catch (error) {
          console.error('测试STUN服务器时出错:', error);
          server.result.status = 'failed';
          server.result.statusClass = 'caution';
          clearTimeout(timeout);
          pc.close();
          resolve();
        }
      });
    }
  }
};
</script>