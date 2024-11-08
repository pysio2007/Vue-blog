<template>
  <div class="game-of-life" :class="{ fullscreen: isFullscreen }">
    <div :class="['buttons', { 'fullscreen-buttons': isFullscreen }]">
      <button @click="startGame" :disabled="isRunning">开始</button>
      <button @click="pauseGame" :disabled="!isRunning">暂停</button>
      <button @click="resetGame">重置</button>
      <button @click="toggleFullscreen">{{ isFullscreen ? '退出全屏' : '全屏' }}</button>
    </div>
    <div class="grid" :style="gridStyle" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag">
      <div
        v-for="(row, rowIndex) in visibleGrid"
        :key="rowIndex"
        class="row"
      >
        <div
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="['cell', { alive: cell }]"
          @mousedown.stop="cellMouseDown(rowIndex, cellIndex)"
          @mouseup.stop="cellMouseUp(rowIndex, cellIndex)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rows: 20,
      cols: 20,
      grid: [],
      isRunning: false,
      intervalId: null,
      isFullscreen: false,
      dragStart: null,
      dragOffset: { x: 0, y: 0 },
      cellDragStart: null,
      visibleRows: 20,
      visibleCols: 20,
      isDragging: false,
    };
  },
  computed: {
    gridStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${this.visibleCols}, 1fr)`,
        gridTemplateRows: `repeat(${this.visibleRows}, 1fr)`,
        transform: `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px)`,
      };
    },
    visibleGrid() {
      const startRow = Math.max(0, Math.floor(-this.dragOffset.y / 20));
      const endRow = Math.min(this.rows, startRow + this.visibleRows);
      const startCol = Math.max(0, Math.floor(-this.dragOffset.x / 20));
      const endCol = Math.min(this.cols, startCol + this.visibleCols);
      return this.grid.slice(startRow, endRow).map(row => row.slice(startCol, endCol));
    },
  },
  methods: {
    initializeGrid() {
      this.grid = Array.from({ length: this.rows }, () =>
        Array(this.cols).fill(false)
      );
    },
    toggleCell(row, col) {
      if (!this.isRunning && !this.isDragging) {
        this.grid[row][col] = !this.grid[row][col];
      }
    },
    startGame() {
      this.isRunning = true;
      this.intervalId = setInterval(this.nextGeneration, 100);
    },
    pauseGame() {
      this.isRunning = false;
      clearInterval(this.intervalId);
    },
    resetGame() {
      this.pauseGame();
      this.initializeGrid();
    },
    nextGeneration() {
      const newGrid = this.grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
          const aliveNeighbors = this.countAliveNeighbors(rowIndex, cellIndex);
          if (cell && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
            return false;
          }
          if (!cell && aliveNeighbors === 3) {
            return true;
          }
          return cell;
        })
      );
      this.grid = newGrid;
    },
    countAliveNeighbors(row, col) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1],
      ];
      return directions.reduce((count, [dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (
          newRow >= 0 &&
          newRow < this.rows &&
          newCol >= 0 &&
          newCol < this.cols &&
          this.grid[newRow][newCol]
        ) {
          count++;
        }
        return count;
      }, 0);
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      if (this.isFullscreen) {
        this.rows = 1024;
        this.cols = 1024;
        this.visibleRows = 60;
        this.visibleCols = 90;
      } else {
        this.rows = 20;
        this.cols = 20;
        this.visibleRows = 20;
        this.visibleCols = 20;
        this.dragOffset = { x: 0, y: 0 };
      }
      this.initializeGrid();
      if (!this.isFullscreen) {
        window.location.reload();
      }
    },
    startDrag(event) {
      if (this.isFullscreen) {
        this.dragStart = { x: event.clientX, y: event.clientY };
        this.isDragging = true;
      }
    },
    onDrag(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.dragStart.x;
        const deltaY = event.clientY - this.dragStart.y;
        this.dragOffset.x += deltaX;
        this.dragOffset.y += deltaY;
        this.dragStart = { x: event.clientX, y: event.clientY };
        requestAnimationFrame(() => {
          this.$forceUpdate();
        });
      }
    },
    endDrag() {
      this.dragStart = null;
      this.isDragging = false;
    },
    cellMouseDown(row, col) {
      this.cellDragStart = { row, col };
    },
    cellMouseUp(row, col) {
      if (this.cellDragStart && this.cellDragStart.row === row && this.cellDragStart.col === col) {
        this.toggleCell(row, col);
      }
      this.cellDragStart = null;
    },
  },
  mounted() {
    this.initializeGrid();
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isFullscreen) {
        this.toggleFullscreen();
      }
    });
  },
};
</script>

<style scoped>
.game-of-life {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.game-of-life.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: white;
  z-index: 1000;
  overflow: hidden;
}
.buttons {
  position: relative;
  display: flex;
  gap: 7px;
  bottom: 2px;
}
.fullscreen-buttons {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1001;
}

button {
  border: 1px solid #cccccc0c;
  padding: 5px 10px;
  height: 2rem;
  background-color: var(--vp-c-bg);
  box-shadow: 1.5px 1px 2px #00000021;
  border-radius: 4px;
  color: var(--vp-c-text);
  cursor: pointer;
}

.grid {
  display: grid;
  gap: 1px;
  cursor: grab;
}
.grid:active {
  cursor: grabbing;
}
.row {
  display: contents;
}
.cell {
  width: 20px;
  height: 20px;
  background-color: white;
  border: 1px solid #ddd;
}
.cell.alive {
  background-color: black;
}
</style>