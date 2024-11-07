<template>
    <div class="game-of-life">
      <div class="buttons">
        <button @click="startGame" :disabled="isRunning">开始</button>
        <button @click="pauseGame" :disabled="!isRunning">暂停</button>
        <button @click="resetGame">重置</button>
      </div>
      <div class="grid" :style="gridStyle">
        <div
          v-for="(row, rowIndex) in grid"
          :key="rowIndex"
          class="row"
        >
          <div
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            :class="['cell', { alive: cell }]"
            @click="toggleCell(rowIndex, cellIndex)"
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
      };
    },
    computed: {
      gridStyle() {
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${this.cols}, 1fr)`,
          gridTemplateRows: `repeat(${this.rows}, 1fr)`,
        };
      },
    },
    methods: {
      initializeGrid() {
        this.grid = Array.from({ length: this.rows }, () =>
          Array(this.cols).fill(false)
        );
      },
      toggleCell(row, col) {
        if (!this.isRunning) {
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
    },
    mounted() {
      this.initializeGrid();
    },
  };
  </script>
  
  <style scoped>
  .game-of-life {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .buttons {
    margin-bottom: 10px;
  }
  button {
    margin: 0 5px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .grid {
    display: grid;
    gap: 1px;
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