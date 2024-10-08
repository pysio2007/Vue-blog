<template>
    <div ref="container" class="asciinema-player-container"></div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  
  export default defineComponent({
    name: 'AsciinemaPlayer',
    props: {
      src: {
        type: String,
        required: true,
      },
      options: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const container = ref<HTMLElement | null>(null);
      let player: any = null;
  
      const createPlayer = async () => {
        if (container.value) {
          const AsciinemaPlayerModule = await import('asciinema-player');
          const AsciinemaPlayer = AsciinemaPlayerModule.default || AsciinemaPlayerModule;
          
          if (typeof AsciinemaPlayer.create === 'function') {
            player = AsciinemaPlayer.create(props.src, container.value, props.options);
          } else {
            console.error('AsciinemaPlayer.create is not a function');
          }
        }
      };
  
      onMounted(() => {
        createPlayer();
      });
  
      watch(() => props.src, () => {
        if (player && typeof player.dispose === 'function') {
          player.dispose();
        }
        createPlayer();
      });
  
      return { container };
    },
  });
  </script>
  
  <style>
  @import 'asciinema-player/dist/bundle/asciinema-player.css';
  
  .asciinema-player-container {
    width: 100%;
    max-width: 100%;
  }
  </style>