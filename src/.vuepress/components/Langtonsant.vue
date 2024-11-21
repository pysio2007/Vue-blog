<template>
    <div class="langtons-ant" :class="{ fullscreen: isFullscreen }">
      <div :class="['buttons', { 'fullscreen-buttons': isFullscreen }]">
        <button @click="startGame" :disabled="isRunning">开始</button>
        <button @click="pauseGame" :disabled="!isRunning">暂停</button>
        <button @click="resetGame">重置</button>
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
            :class="['cell', { alive: cell, ant: isAntPosition(rowIndex, cellIndex) }]"
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
        visibleRows: 20,
        visibleCols: 20,
        isDragging: false,
        ant: { x: 10, y: 10, direction: 'up' },
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
      startGame() {
        this.isRunning = true;
        this.intervalId = setInterval(this.nextStep, 100);
      },
      pauseGame() {
        this.isRunning = false;
        clearInterval(this.intervalId);
      },
      resetGame() {
        this.pauseGame();
        this.initializeGrid();
        this.ant = { x: 10, y: 10, direction: 'up' };
      },
      nextStep() {
        const { x, y, direction } = this.ant;
        const currentCell = this.grid[y][x];
  
        // Toggle the cell color
        this.grid[y][x] = !currentCell;
  
        // Determine new direction
        let newDirection;
        if (currentCell) {
          // Turn left
          newDirection = this.turnLeft(direction);
        } else {
          // Turn right
          newDirection = this.turnRight(direction);
        }
  
        // Move ant to the new position
        const { newX, newY } = this.moveForward(x, y, newDirection);
  
        // Update ant's position and direction
        this.ant = { x: newX, y: newY, direction: newDirection };
      },
      turnLeft(direction) {
        switch (direction) {
          case 'up': return 'left';
          case 'left': return 'down';
          case 'down': return 'right';
          case 'right': return 'up';
        }
      },
      turnRight(direction) {
        switch (direction) {
          case 'up': return 'right';
          case 'right': return 'down';
          case 'down': return 'left';
          case 'left': return 'up';
        }
      },
      moveForward(x, y, direction) {
        switch (direction) {
          case 'up': return { newX: x, newY: y - 1 };
          case 'right': return { newX: x + 1, newY: y };
          case 'down': return { newX: x, newY: y + 1 };
          case 'left': return { newX: x - 1, newY: y };
        }
      },
      isAntPosition(row, col) {
        return this.ant.x === col && this.ant.y === row;
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
    },
    mounted() {
      this.initializeGrid();
    },
  };
  </script>
  
  <style scoped>
  .langtons-ant {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .langtons-ant.fullscreen {
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
  [disabled] {
    cursor: not-allowed;
    opacity: 0.7;
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
  .cell.ant {
    background-color: red;
  }
  </style>