<template>
  <div class="wordle">
    <div v-for="i in MAX_TRIES" :key="i" class="wordle-row">
      <span v-for="j in WORD_LENGTH" :key="j" :class="`wordle-letter ${getLetterClass(i - 1, j - 1)}`">
        {{ guesses[i - 1] && guesses[i - 1][j - 1] }}
      </span>
    </div>
    <input type="text" v-model="currentGuess" maxlength="5" @keyup.enter="submitGuess">
    <button @click="newGame">New Game</button>
  </div>
</template>

<script>
import { WORD_LENGTH, MAX_TRIES, getRandomWord, checkGuess } from './wordleLogic';

export default {
  data() {
    return {
      WORD_LENGTH,
      MAX_TRIES,
      answer: getRandomWord(),
      guesses: Array(MAX_TRIES).fill(null).map(() => Array(WORD_LENGTH).fill(null)),
      currentGuess: '',
      gameOver: false,
    };
  },
  methods: {
    submitGuess() {
      if (this.gameOver || this.currentGuess.length !== WORD_LENGTH) return;

      const currentGuessArray = this.currentGuess.split('');
      const result = checkGuess(this.currentGuess, this.answer);
      this.guesses[this.guesses.findIndex(row => !row.some(letter => letter))] = currentGuessArray;
      this.currentGuess = '';

      if (result.every(color => color === 'green')) {
        alert('You win!');
        this.gameOver = true;
      } else if (this.guesses.every(row => row.some(letter => letter))) {
        alert('You lose! The answer was ' + this.answer);
        this.gameOver = true;
      }
    },
    getLetterClass(guessIndex, letterIndex) {
      if (this.guesses[guessIndex] && this.guesses[guessIndex][letterIndex]) {
        const color = checkGuess(this.guesses[guessIndex].join(''), this.answer)[letterIndex];
        return `wordle-letter-${color}`;
      }
      return '';
    },
    newGame() {
      this.answer = getRandomWord();
      this.guesses = Array(MAX_TRIES).fill(null).map(() => Array(WORD_LENGTH).fill(null));
      this.currentGuess = '';
      this.gameOver = false;
    },
  },
};
</script>
  
  <style scoped>
  .wordle {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: sans-serif;
  }
  
  .wordle-row {
    display: flex;
  }
  
  .wordle-letter {
    width: 2em;
    height: 2em;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
    margin: 0.2em;
    text-transform: uppercase;
  }
  
  .wordle-letter-green {
    background-color: #6aaa64;
    color: white;
    border-color: #6aaa64;
  }
  
  .wordle-letter-yellow {
    background-color: #c9b458;
    color: white;
    border-color: #c9b458;
  }
  
  .wordle-letter-gray {
    background-color: #787c7e;
    color: white;
    border-color: #787c7e;
  }
  </style>