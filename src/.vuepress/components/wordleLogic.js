const WORD_LENGTH = 5;
const MAX_TRIES = 6;

const wordList = ['apple', 'crane', 'table', 'audio', 'train', 'about', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone', 'along', 'aloud', 'alter', 'always', 'amend', 'among'];

function getRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function checkGuess(guess, answer) {
  const result = [];
  const answerLetterCounts = {};

  for (let i = 0; i < WORD_LENGTH; i++) {
    const answerLetter = answer[i];
    answerLetterCounts[answerLetter] = (answerLetterCounts[answerLetter] || 0) + 1;
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    const guessLetter = guess[i];
    if (guessLetter === answer[i]) {
      result.push('green');
      answerLetterCounts[guessLetter]--;
    } else if (answer.includes(guessLetter) && answerLetterCounts[guessLetter] > 0) {
      result.push('yellow');
      answerLetterCounts[guessLetter]--;
    } else {
      result.push('gray');
    }
  }

  return result;
}

export { WORD_LENGTH, MAX_TRIES, getRandomWord, checkGuess };
