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
          { name: 'Google', url: 'stun:stun.l.google.com:19302', result: { status: 'connecting', statusClass: 'note' } },
          { name: 'BlackBerry', url: 'stun:stun.voip.blackberry.com:3478', result: { status: 'connecting', statusClass: 'note' } },
          { name: 'Twilio', url: 'stun:global.stun.twilio.com', result: { status: 'connecting', statusClass: 'note' } },
          { name: 'Cloudflare', url: 'stun:stun.cloudflare.com', result: { status: 'connecting', statusClass: 'note' } }
        ]
      };
    },
    mounted() {
      this.servers.forEach(server => {
        this.testServer(server);
      });
    },
    methods: {
      testServer(server) {
        const pc = new RTCPeerConnection({ iceServers: [{ urls: server.url }] });
        pc.createDataChannel('');
        pc.createOffer().then(offer => pc.setLocalDescription(offer));
        pc.onicecandidate = event => {
          if (event.candidate && event.candidate.candidate) {
            const candidate = event.candidate.candidate;
            const ipMatch = candidate.match(/(\d{1,3}\.){3}\d{1,3}/);
            const typeMatch = candidate.match(/typ (\w+)/);
            server.result.ip = ipMatch ? ipMatch[0] : '未知';
            server.result.natType = typeMatch ? typeMatch[1] : '未知';
            server.result.status = 'success';
            server.result.statusClass = 'tip';
          } else if (!event.candidate) {
            server.result.status = 'failed';
            server.result.statusClass = 'caution';
          }
        };
        pc.oniceconnectionstatechange = () => {
          if (pc.iceConnectionState === 'failed' && server.result.status !== 'success') {
            server.result.status = 'failed';
            server.result.statusClass = 'caution';
          }
        };
      }
    }
  };
  </script>