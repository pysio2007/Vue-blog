<template>
  <div class="macro-container">
    <div class="mode-switch">
      <span :class="{ active: !asciiMode }">图形</span>
      <label class="switch">
        <input type="checkbox" v-model="asciiMode">
        <span class="slider"></span>
      </label>
      <span :class="{ active: asciiMode }">ASCII</span>
    </div>
    
    <div v-if="asciiMode" class="ascii-view">
      <pre class="ascii-content">{{ getAsciiRepresentation() }}</pre>
    </div>
    
    <div v-else class="graphic-view">
      <div class="sequence">
        <div v-for="(action, index) in macroActions" :key="index" class="action-step">
          <div class="action-content">
            <div v-if="action.state === 'up'" class="arrow">▲</div>
            <div class="key-block" :class="action.type">
              {{ getActionLabel(action) }}
            </div>
            <div v-if="action.state === 'down'" class="arrow">▼</div>
          </div>
          <div v-if="action.delay" class="delay-info">
            <span class="delay-line">{{ getDelayLine() }}</span>
            <span class="delay-time">{{ action.delay }}ms</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Ghub',
  props: {
    // 宏序列
    sequence: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      macroActions: [],
      asciiMode: true, // 默认 ASCII
      mouseIcons: {
        '左键': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMTIgMUM3LjAzIDEgMyA1LjAzIDMgMTB2OGMwIDQuOTcgNC4wMyA5IDkgOXM5LTQuMDMgOS05di04YzAtNC45Ny00LjAzLTktOS05em0wIDJjMy44NiAwIDcgMy4xNCA3IDd2OGMwIDMuODYtMy4xNCA3LTcgN3MtNy0zLjE0LTctN3YtOGMwLTMuODYgMy4xNC03IDctN3oiLz48cGF0aCBkPSJNMTIgNnYxMGgyVjZoLTJ6Ii8+PC9zdmc+',
        '右键': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMTIgMUM3LjAzIDEgMyA1LjAzIDMgMTB2OGMwIDQuOTcgNC4wMyA5IDkgOXM5LTQuMDMgOS05di04YzAtNC45Ny00LjAzLTktOS05em0wIDJjMy44NiAwIDcgMy4xNCA3IDd2OGMwIDMuODYtMy4xNCA3LTcgN3MtNy0zLjE0LTctN3YtOGMwLTMuODYgMy4xNC03IDctN3oiLz48cGF0aCBkPSJNMTAgNnYxMGgyVjZoLTJ6Ii8+PC9zdmc+',
        '中键': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMTIgMUM3LjAzIDEgMyA1LjAzIDMgMTB2OGMwIDQuOTcgNC4wMyA5IDkgOXM5LTQuMDMgOS05di04YzAtNC45Ny00LjAzLTktOS05em0wIDJjMy44NiAwIDcgMy4xNCA3IDd2OGMwIDMuODYtMy4xNCA3LTcgN3MtNy0zLjE0LTctN3YtOGMwLTMuODYgMy4xNC03IDctN3oiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIyIi8+PC9zdmc+'
      }
    }
  },
  created() {
    this.macroActions = this.sequence
  },
  methods: {
    getMouseIcon(button) {
      return this.mouseIcons[button]
    },
    getActionLabel(action) {
      if (action.type === 'mouse') {
        return action.button === 'left' ? '[LMB]' : '[RMB]'
      }
      return `[${action.key}]`
    },
    getDelayLine() {
      return '─'.repeat(4)
    },
    getAsciiRepresentation() {
      let result = []
      let arrows = []
      let keys = []
      let delays = []
      
      this.macroActions.forEach((action, index) => {
        const key = action.type === 'mouse' ? 
          (action.button === 'left' ? 'LMB' : 'RMB') : 
          action.key
        
        // 计算对齐
        const keyWidth = key.length
        const arrowStr = action.state === 'up' ? '↑' : '↓'
        const delayStr = action.delay ? `${action.delay}ms` : ''
        
        // 添加箭头和按键
        arrows.push(arrowStr.padStart(keyWidth))
        keys.push(key)
        if (delayStr) delays.push(delayStr.padStart(keyWidth))
        
        // 添加连接符
        if (index < this.macroActions.length - 1) {
          arrows.push(' ')
          keys.push('─>')
          if (delays.length) delays.push(' ')
        }
      })
      
      result.push(arrows.join(''))
      result.push(keys.join(''))
      if (delays.length) result.push(delays.join(''))

      let asciiOutput = []
      asciiOutput.push(...result)
      return asciiOutput.join('\n')
    }
  }
}
</script>

<style scoped>
.macro-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.mode-switch {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e0e0e0;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.active {
  color: #2196F3;
  font-weight: 500;
}

.ascii-view {
  font-family: 'Consolas', 'Monaco', monospace;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  overflow-x: auto;
}

.ascii-content {
  margin: 0;
  color: #333;
  line-height: 1.4;
  font-size: 1rem;
  white-space: pre;
}

.graphic-view {
  overflow-x: auto;
}

.sequence {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.action-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.key-block {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  color: #fff;
  background: #5c6bc0; /* 柔和蓝色 */
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
}

.key-block.mouse {
  background: #ab47bc; /* 柔和紫色 */
  box-shadow: 0 2px 4px rgba(155, 89, 182, 0.2);
}

.state-line {
  color: #666;
  font-size: 0.9rem;
}

.delay-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.9rem;
}

.delay-line {
  color: #999;
}

.delay-time {
  color: #2196F3;
  font-weight: 500;
}

.arrow {
  font-size: 0.8rem;
  color: #607d8b; /* 柔和箭头 */
  height: 1rem;
  line-height: 1;
  font-weight: bold;
}

@media (max-width: 768px) {
  .macro-container {
    padding: 1rem;
  }
  
  .sequence {
    gap: 0.75rem;
  }
  
  .key-block {
    padding: 0.4rem 0.8rem;
  }
}
</style>
