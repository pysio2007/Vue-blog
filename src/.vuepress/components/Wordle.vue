<template>
  <div class="wordle-container">
    <header>
      <!-- <h1>Wordle Game</h1> -->
      <div class="message" v-if="message">{{ message }}</div>
    </header>

    <div class="game-board">
      <div v-for="i in MAX_TRIES" :key="i" class="wordle-row">
        <div v-for="j in WORD_LENGTH" :key="j" :class="['wordle-tile', getLetterClass(i - 1, j - 1)]">
          {{ guesses[i - 1] && guesses[i - 1][j - 1] }}
        </div>
      </div>
    </div>

    <div class="input-section">
      <input type="text" v-model="currentGuess" maxlength="5" @keyup.enter="submitGuess" :disabled="gameOver"
        placeholder="Type your guess" class="guess-input">
      <button @click="submitGuess" :disabled="currentGuess.length !== 5 || gameOver" class="submit-btn">
        Submit
      </button>
      <button @click="newGame" class="new-game-btn">New Game</button>
    </div>

    <div class="keyboard">
      <!-- 可以添加虚拟键盘 -->
    </div>
  </div>
</template>

<script>
const WORD_LENGTH = 5;
const MAX_TRIES = 6;
const API_URL = 'https://random-word-api.vercel.app/api?words=1&length=5';

export default {
  data() {
    return {
      WORD_LENGTH,
      MAX_TRIES,
      answer: '',
      guesses: Array(MAX_TRIES).fill(null).map(() => Array(WORD_LENGTH).fill('')),
      currentGuess: '',
      gameOver: false,
      message: '',
      isLoading: false,
      // validWords: new Set(),
      isLoading: false,
    };
  },
  async created() {
    await this.fetchNewWord();
    await this.loadValidWords();
  },
  methods: {
    async fetchNewWord() {
      try {
        const response = await fetch(API_URL);
        const [word] = await response.json();
        this.answer = word.toLowerCase();
      } catch (error) {
        console.error('Failed to fetch word:', error);
        this.answer = 'nowan'; // 降级方案
      }
    },
    async loadValidWords() {
      try {
        const response = await fetch('/word-list.txt'); // 需要提供有效词列表
        const text = await response.text();
        this.validWords = new Set(text.split('\n').map(w => w.trim().toLowerCase()));
      } catch (error) {
        console.error('Failed to load valid words:', error);
      }
    },
    async isValidWord(word) {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        return response.ok;
      } catch (error) {
        console.error('词典验证失败:', error);
        return true; // 如果API失败，默认允许
      }
    },

    async submitGuess() {
      if (this.gameOver || this.currentGuess.length !== WORD_LENGTH) return;

      const guess = this.currentGuess.toLowerCase();
      this.isLoading = true;
      const isValid = await this.isValidWord(guess);
      this.isLoading = false;
      // if (!this.validWords.has(guess)) {
      //   this.message = 'Not in word list';
      //   setTimeout(() => this.message = '', 2000);
      //   return;
      // }

      if (!isValid) {
        this.message = '无效单词';
        setTimeout(() => this.message = '', 5000);
        return;
      }

      const currentGuessArray = guess.split('');
      const result = this.checkGuess(guess);

      const currentRow = this.guesses.findIndex(row => !row.some(letter => letter));
      this.guesses[currentRow] = currentGuessArray;

      if (guess === this.answer) {
        this.message = 'Victorie!';
        this.gameOver = true;
      } else if (currentRow === MAX_TRIES - 1) {
        this.message = `Game Over! The word was ${this.answer}`;
        this.gameOver = true;
      }

      this.currentGuess = '';
    },
    checkGuess(guess) {
      const result = Array(WORD_LENGTH).fill('gray');
      const answerArray = this.answer.split('');

      // Check for correct letters in correct positions
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === answerArray[i]) {
          result[i] = 'green';
          answerArray[i] = null;
        }
      }

      // Check for correct letters in wrong positions
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (result[i] === 'green') continue;

        const index = answerArray.indexOf(guess[i]);
        if (index !== -1) {
          result[i] = 'yellow';
          answerArray[index] = null;
        }
      }

      return result;
    },
    getLetterClass(guessIndex, letterIndex) {
      if (!this.guesses[guessIndex][letterIndex]) return '';
      return `wordle-tile-${this.checkGuess(this.guesses[guessIndex].join(''))[letterIndex]}`;
    },
    async newGame() {
      await this.fetchNewWord();
      this.guesses = Array(MAX_TRIES).fill(null).map(() => Array(WORD_LENGTH).fill(''));
      this.currentGuess = '';
      this.gameOver = false;
      this.message = '';
    },
  },
};
</script>

<style scoped>
.wordle-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #1a1a1a;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.message {
  color: #666;
  font-size: 1.2rem;
  height: 24px;
  transition: all 0.3s ease;
}

.game-board {
  margin-bottom: 30px;
}

.wordle-row {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 5px;
}

.wordle-tile {
  width: 62px;
  height: 62px;
  border: 2px solid #d3d6da;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.wordle-tile-green {
  background-color: #6aaa64;
  color: white;
  border-color: #6aaa64;
}

.wordle-tile-yellow {
  background-color: #c9b458;
  color: white;
  border-color: #c9b458;
}

.wordle-tile-gray {
  background-color: #787c7e;
  color: white;
  border-color: #787c7e;
}

.input-section {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.guess-input {
  padding: 10px 15px;
  font-size: 1.2rem;
  border: 2px solid #d3d6da;
  border-radius: 4px;
  text-transform: uppercase;
}

.guess-input:focus {
  outline: none;
  border-color: #878a8c;
}

button {
  padding: 10px 20px;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn {
  background-color: #6aaa64;
  color: white;
}

.submit-btn:disabled {
  background-color: #d3d6da;
  cursor: not-allowed;
}

.new-game-btn {
  background-color: #538d4e;
  color: white;
}

button:hover:not(:disabled) {
  filter: brightness(1.1);
}

.guess-input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.loading {
  opacity: 0.7;
  pointer-events: none;
}
</style>