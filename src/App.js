/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import styled from 'styled-components'
import WordList from './WordList.json'
import { Button, Chip, Snackbar, Alert } from '@mui/material'
import Tile from './components/Tile'

function App() {
  const [usedWords, setUsedWords] = useState([]);
  const [scrambled, setScrambled] = useState([]);
  const [word, setWord] = useState(generateWord())
  const [won, setWon] = useState(false);
  const [gamesWon, setGamesWon] = useState(0);
  const [guesses, setGuesses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  let currentI;
  let newI;

  function generateWord() {
    const max = WordList.length;
    const random = Math.floor(Math.random() * max);
    const validWords = WordList.filter((word) => !usedWords.includes(word))
    return validWords[random].toLowerCase();
  }
  function handleReset() {
    if (!won) setStreak(0)
    setWon(false);
    setUsedWords([...usedWords, word]);
    setWord(generateWord())
  }
  function scrambleWord(array) {
    let currentIndex = array.length
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return setScrambled(array);

  }

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev, i) {
    currentI = i;
  }

  function drop(ev, i) {
    ev.preventDefault();
    newI = i;
    swap();
  }

  function swap() {
    let newArr = scrambled;
    [newArr[newI], newArr[currentI]] = [newArr[currentI], newArr[newI]]
    console.log(scrambled, newArr)
    setScrambled([...newArr]);
  }

  function checkGame() {
    if (scrambled.join('') === word) {
      setGamesWon(gamesWon + 1)
      setStreak(streak + 1)
      return setWon(true)
    } else {
      setStreak(0)
      setGuesses(guesses + 1)
    }
  }

  useEffect(() => {
    scrambleWord(word.split(''))
  }, [word])

  const Main = styled.main`
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
  `
  const Game = styled.div`
    width: 70vw;
    display: grid;
    grid-template-rows: 50px 100px auto 100px;
    grid-template-columns: repeat(5, 1fr);
    gap: 1vw;
    position: relative;
  `
  const GameHeader = styled.div`
    grid-column: span 5;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10%;
  `

  const GameSpace = styled.div`
    aspect-ratio: 1;
    border: 1px solid grey;
    z-index: 10;
    background-color: ${won ? '#228B22' : 'none'}
  `

  return (
    <Main>
      <h1 style={{ fontSize: '4rem', margin: '0' }}>Scramble</h1>
      <Game>
        <GameHeader>
          <Chip label={`Correct: ${gamesWon}`} variant="outlined" color="success" />
          <Chip label={`Wrong: ${guesses}`} variant="outlined" color="warning" />

        </GameHeader>
        <GameHeader>
          <Chip label={`Streak: ${streak}`} variant="outlined" color="success" />
          <Button onClick={() => {
            navigator.clipboard.writeText(`Scramble:\n Correct:${gamesWon}\n Streak:${streak}\n Wrong:${guesses}`)
            setOpen(true);
          }}>
            Share Score
          </Button>
        </GameHeader>
        {
          scrambled.map((char, i) =>
          (
            <GameSpace
              key={i}
              onDrop={(e) => drop(e, i)}
              onDragOver={allowDrop}
            >
              <Tile
                letter={char}
                won={won}
                drag={(e) => drag(e, i)}
              />
            </GameSpace>
          )
          )
        }
        <GameHeader>
          <Button variant="outlined" size="large" onClick={handleReset}>{won ? 'Next' : 'Skip'}</Button>
          <Button variant="contained" size="large" color="success" disabled={!!won} onClick={checkGame}>Guess</Button>
        </GameHeader>
      </Game>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Copied Scores
        </Alert>
      </Snackbar>
    </Main>
  );
}

export default App;
