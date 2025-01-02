<template>
  <div class="game-container">
    <div class="header">
      <div class="scores">
        <div class="score">分数: {{ score }}</div>
        <div class="best-score">最高分: {{ bestScore }}</div>
      </div>
      <div class="buttons">
        <button class="game-btn" @click="resetGame">重新开始</button>
        <button class="game-btn auto-play" @click="toggleAutoPlay">
          {{ isAutoPlaying ? '停止自动' : '自动游玩' }}
        </button>
      </div>
    </div>
    <div class="game-board">
      <div v-for="(row, i) in board" :key="i" class="row">
        <div v-for="(cell, j) in row" :key="j" 
             class="cell" 
             :class="[`cell-${cell}`, { 'new-tile': isNew(i, j) }]">
          {{ cell || '' }}
        </div>
      </div>
    </div>
    <!-- 游戏结束弹窗 -->
    <div v-if="gameOver" class="modal game-over-modal">
      <div class="modal-content">
        <h2>游戏结束!</h2>
        <p>最终得分: {{ score }}</p>
        <button class="game-btn" @click="resetGame">再玩一次</button>
      </div>
    </div>
    <!-- 胜利弹窗 -->
    <div v-if="won && !wonContinue" class="modal win-modal">
      <div class="modal-content">
        <h2>恭喜胜利!</h2>
        <p>得分: {{ score }}</p>
        <div class="modal-buttons">
          <button class="game-btn continue-btn" @click="continueGame">继续游戏</button>
          <button class="game-btn" @click="resetGame">重新开始</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '2048Game',
  data() {
    return {
      board: Array(4).fill().map(() => Array(4).fill(0)),
      score: 0,
      newTiles: new Set(),
      isAutoPlaying: false,
      autoPlayInterval: null,
      bestScore: 0, // 初始值设为0
      gameOver: false,
      won: false,
      wonContinue: false
    }
  },
  mounted() {
    // 在mounted钩子中安全地访问localStorage
    this.bestScore = parseInt(localStorage?.getItem('2048-best-score') || '0');
    this.initGame();
    window.addEventListener('keydown', this.handleKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress)
    this.stopAutoPlay()
  },
  watch: {
    score(newScore) {
      if (newScore > this.bestScore && typeof window !== 'undefined') {
        this.bestScore = newScore;
        localStorage?.setItem('2048-best-score', newScore.toString());
      }
    }
  },
  methods: {
    initGame() {
      this.board = Array(4).fill().map(() => Array(4).fill(0))
      this.score = 0
      this.addNewTile()
      this.addNewTile()
    },
    handleKeyPress(event) {
      if (this.gameOver || (this.won && !this.wonContinue)) return;
      
      const key = event.key.toLowerCase()
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        event.preventDefault()
        this.newTiles.clear()
        
        let moved = false
        switch(key) {
          case 'arrowup':
          case 'w':
            moved = this.moveUp()
            break
          case 'arrowdown':
          case 's':
            moved = this.moveDown()
            break
          case 'arrowleft':
          case 'a':
            moved = this.moveLeft()
            break
          case 'arrowright':
          case 'd':
            moved = this.moveRight()
            break
        }
        
        if (moved) {
          this.addNewTile()
          this.checkWin();
          this.checkGameOver();
        }
      }
    },
    moveRow(row) {
      let arr = row.filter(x => x !== 0)
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2
          this.score += arr[i]
          arr.splice(i + 1, 1)
        }
      }
      while (arr.length < 4) arr.push(0)
      return arr
    },
    moveLeft() {
      let moved = false
      let newBoard = this.board.map(row => {
        const oldRow = [...row]
        const newRow = this.moveRow([...row])
        if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) moved = true
        return newRow
      })
      this.board = newBoard
      return moved
    },
    moveRight() {
      let moved = false
      let newBoard = this.board.map(row => {
        const oldRow = [...row]
        const newRow = this.moveRow([...row].reverse()).reverse()
        if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) moved = true
        return newRow
      })
      this.board = newBoard
      return moved
    },
    moveUp() {
      let moved = false
      for (let col = 0; col < 4; col++) {
        let column = this.board.map(row => row[col])
        const oldColumn = [...column]
        column = this.moveRow(column)
        if (JSON.stringify(oldColumn) !== JSON.stringify(column)) moved = true
        for (let row = 0; row < 4; row++) {
          this.board[row][col] = column[row]
        }
      }
      return moved
    },
    moveDown() {
      let moved = false
      for (let col = 0; col < 4; col++) {
        let column = this.board.map(row => row[col]).reverse()
        const oldColumn = [...column]
        column = this.moveRow(column).reverse()
        if (JSON.stringify(oldColumn) !== JSON.stringify(column)) moved = true
        for (let row = 0; row < 4; row++) {
          this.board[row][col] = column[row]
        }
      }
      return moved
    },
    addNewTile() {
      const emptyCells = []
      this.board.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell === 0) emptyCells.push([i, j])
        })
      })
      if (emptyCells.length) {
        const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        this.board[i][j] = Math.random() < 0.9 ? 2 : 4
        this.newTiles.add(`${i}-${j}`)
      }
    },
    isNew(i, j) {
      return this.newTiles.has(`${i}-${j}`)
    },
    toggleAutoPlay() {
      if (this.isAutoPlaying) {
        this.stopAutoPlay()
      } else {
        this.startAutoPlay()
      }
    },

    stopAutoPlay() {
      clearInterval(this.autoPlayInterval)
      this.isAutoPlaying = false
    },

    startAutoPlay() {
      this.isAutoPlaying = true
      this.autoPlayInterval = setInterval(this.makeAutoMove, 300)
    },

    evaluatePosition(board) {
      let score = 0
      const weights = [
        [4096, 1024, 256, 64],
        [1024, 256, 64, 16],
        [256, 64, 16, 4],
        [64, 16, 4, 1]
      ]
      
      // 评分策略：左上角权重最大
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          score += (board[i][j] || 0) * weights[i][j]
        }
      }

      // 奖励相邻相同数字
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] && board[i][j] === board[i][j + 1]) {
            score += board[i][j] * 2
          }
        }
      }

      return score
    },

    makeAutoMove() {
      if (this.gameOver || (this.won && !this.wonContinue)) {
        this.stopAutoPlay();
        return;
      }

      const moves = ['up', 'left', 'down', 'right'];
      let bestScore = -Infinity;
      let bestMove = null;
      
      // 模拟每个可能的移动
      for (const move of moves) {
        const boardCopy = JSON.parse(JSON.stringify(this.board));
        let moved = false;
        let tempBoard = {
          board: boardCopy,
          score: 0,
          moveRow: this.moveRow
        };
        
        switch(move) {
          case 'up':
            moved = this.moveUp.call(tempBoard);
            break;
          case 'down':
            moved = this.moveDown.call(tempBoard);
            break;
          case 'left':
            moved = this.moveLeft.call(tempBoard);
            break;
          case 'right':
            moved = this.moveRight.call(tempBoard);
            break;
        }
        
        if (moved) {
          const score = this.evaluatePosition(tempBoard.board);
          if (score > bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }
      }
      
      if (bestMove) {
        this.handleKeyPress({
          key: bestMove === 'up' ? 'ArrowUp' :
               bestMove === 'down' ? 'ArrowDown' :
               bestMove === 'left' ? 'ArrowLeft' : 'ArrowRight',
          preventDefault: () => {}
        });
      } else {
        this.checkGameOver();
      }
    },

    simulateMove(moveFunction, board) {
      const originalBoard = JSON.stringify(board);
      const result = moveFunction.call({ board: board, score: 0 });
      return originalBoard !== JSON.stringify(board);
    },

    hasValidMoves() {
      // 检查是否有空格
      if (this.board.some(row => row.some(cell => cell === 0))) {
        return true;
      }
      
      // 检查是否有可合并的相邻方块
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const current = this.board[i][j];
          // 检查右侧
          if (j < 3 && current === this.board[i][j + 1]) return true;
          // 检查下方
          if (i < 3 && current === this.board[i + 1][j]) return true;
        }
      }
      return false;
    },

    checkGameOver() {
      if (!this.hasValidMoves()) {
        this.gameOver = true;
        this.stopAutoPlay();
      }
    },

    checkWin() {
      if (!this.won && this.board.some(row => row.some(cell => cell === 2048))) {
        this.won = true;
        if (this.isAutoPlaying) {
          this.stopAutoPlay();
        }
      }
    },

    continueGame() {
      this.wonContinue = true;
      if (this.isAutoPlaying) {
        this.startAutoPlay();
      }
    },

    resetGame() {
      this.stopAutoPlay();
      this.gameOver = false;
      this.board = Array(4).fill().map(() => Array(4).fill(0));
      this.score = 0;
      this.newTiles.clear();
      this.won = false;
      this.wonContinue = false;
      this.addNewTile();
      this.addNewTile();
    },
  }
}
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: #bbada0;
  border-radius: 10px;
  width: fit-content;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.scores {
  display: flex;
  gap: 20px;
}

.score {
  font-size: 24px;
  color: white;
}

.best-score {
  font-size: 24px;
  color: #edc22e;
}

.buttons {
  display: flex;
  gap: 10px;
}

.game-btn {
  padding: 10px 20px;
  font-size: 16px;
  background: #8f7a66;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.game-btn:hover {
  background: #9f8a76;
}

.auto-play {
  padding: 10px 20px;
  font-size: 16px;
  background: #8f7a66;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.auto-play:hover {
  background: #9f8a76;
}

.game-board {
  display: grid;
  gap: 10px;
  background: #bbada0;
  padding: 10px;
  border-radius: 8px;
}

.row {
  display: flex;
  gap: 10px;
}

.cell {
  width: 80px;
  height: 80px;
  background: rgba(238, 228, 218, 0.35);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #776e65;
  transition: all 0.15s ease;
}

.new-tile {
  animation: appear 0.2s ease;
}

@keyframes appear {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.cell-2 { background: #eee4da; }
.cell-4 { background: #ede0c8; }
.cell-8 { background: #f2b179; color: white; }
.cell-16 { background: #f59563; color: white; }
.cell-32 { background: #f67c5f; color: white; }
.cell-64 { background: #f65e3b; color: white; }
.cell-128 { background: #edcf72; color: white; font-size: 20px; }
.cell-256 { background: #edcc61; color: white; font-size: 20px; }
.cell-512 { background: #edc850; color: white; font-size: 20px; }
.cell-1024 { background: #edc53f; color: white; font-size: 18px; }
.cell-2048 { background: #edc22e; color: white; font-size: 18px; }

.game-over-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #faf8ef;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}

.modal-content h2 {
  color: #776e65;
  font-size: 30px;
  margin-bottom: 20px;
}

.modal-content p {
  color: #776e65;
  font-size: 20px;
  margin-bottom: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.win-modal .modal-content {
  background: #faf8ef;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  border: 4px solid #edc22e;
}

.win-modal h2 {
  color: #edc22e;
  font-size: 36px;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.continue-btn {
  background: #edc22e;
}

.continue-btn:hover {
  background: #edcf72;
}
</style>
