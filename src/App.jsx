import { useState, useEffect, useRef } from "react";
import { shuffle } from "./utility.js";
import { initialPokemons } from "./config.js";
import Card from "./Card.jsx";

export default function App() {
  const [pokemons, setPokemons] = useState(initialPokemons);
  const [currentScore, setCurrentScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const initialPokemonsRef = useRef(null);
  const prevPokemonsRef = useRef([]);

  function resetGame() {
    setPokemons(initialPokemonsRef.current);
    setCurrentScore(0);
    prevPokemonsRef.current.length = 0;
  }

  function handleClick(pokemonName) {
    if (!prevPokemonsRef.current.includes(pokemonName)) {
      setCurrentScore((prevCurrentScore) => {
        const newCurrentScore = prevCurrentScore + 1;
        setHighscore((prevHighscore) => Math.max(prevHighscore, newCurrentScore));
        return newCurrentScore;
      });
      prevPokemonsRef.current.push(pokemonName);
      setPokemons((prevPokemons) => shuffle(prevPokemons));
    } else {
      resetGame();
    }
  }

  useEffect(() => {
    async function fetchSprites() {
      try {
        const sprites = await Promise.all(
          pokemons.map(async ({ name }) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, { mode: "cors" });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.sprites.front_default;
          })
        );

        const updatedPokemons = pokemons.map((pokemon, index) => ({ ...pokemon, src: sprites[index] }));

        initialPokemonsRef.current = updatedPokemons;
        setPokemons(updatedPokemons);
      } catch (error) {
        console.error("Error fetching sprites:", error);
      }
    }

    fetchSprites();
  }, []);

  return (
    <div>
      <h1>Memory Game</h1>
      {pokemons.map(({ name, src }) => (
        <Card key={name} name={name} src={src} onClick={() => handleClick(name)} />
      ))}
      <h2>Score: {currentScore}</h2>
      <h2>Highscore: {highscore}</h2>
      <button type="button" aria-describedby="desc" onClick={resetGame}>
        Reset
      </button>
      <p>Retains your highscore.</p>
    </div>
  );
}
