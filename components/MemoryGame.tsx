"use client";
import React, { useState, useEffect } from "react";

interface Card {
  id: number;
  number: number;
}

const MemoryGame = () => {
  // Initialize state with proper types.
  const [gridSize, setGridSize] = useState<number>(2);
  const [cardList, setCardList] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  // Handle changes from the grid size input.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setGridSize(value);
  };

  // Initialize the game only when gridSize is valid (2 to 10).
  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    // Duplicate numbers, shuffle them, and limit the array to the total number of cards.
    const cardData = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((n, i) => ({ id: i, number: n }));
    setCardList(cardData);
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    setWon(false);
  };

  // Reinitialize game only if the grid size is valid.
  useEffect(() => {
    if (gridSize < 2 || gridSize > 10) return;
    initializeGame();
  }, [gridSize]);
  useEffect(()=>{
    if(matched.length === cardList.length && cardList.length>0){
      setWon(true);
     
    }

  },[matched,cardList])

  // Now both handleMatch and handleClick work with card IDs (numbers)
  const handleMatch = (secondId: number) => {
    const [firstId] = flipped;
    // Get the corresponding card objects from cardList.
    const firstCard = cardList.find((card:Card) => card.id === firstId);
    const secondCard = cardList.find((card:Card) => card.id === secondId);
    if (!firstCard || !secondCard) return;

    if (firstCard.number === secondCard.number) {
      setMatched([...matched, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id: number) => {
    if (disabled || won) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
    }

    if (flipped[0] !== id) {
      setFlipped([...flipped, id]);
      handleMatch(id);
    } else {
      // If clicking the same card, reset flipped and matched.
      setFlipped([]);
      setMatched([]);
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="grid-size" className="text-white font-semibold">
          Grid Size (2-10)
        </label>
        <input
          id="grid-size"
          type="number"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleChange}
          placeholder="Enter grid size from 2 to 10"
          className="min-w-[min(100vw,300px)] p-3 border-0 rounded shadow-[2px_2px_7px_0_rgba(0,0,0,0.2)] outline-none text-gray-600 focus:ring-3 focus:ring-blue-400 invalid:animate-justshake invalid:text-red-500"
        />
      </div>
      <div
        className="grid gap-2 my-4 place-items-center"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cardList.map((card:Card) => {
          // Determine if the card is flipped or matched.
          const isFaceUp =
            flipped.includes(card.id) || matched.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className="relative w-[100px] h-[100px] cursor-pointer"
              // The outer container provides the 3D perspective.
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative w-full h-full transition-transform duration-700 ease-in-out"
                // Rotate the inner container based on the card state.
                style={{
                  transform: isFaceUp ? "rotateY(180deg)" : "rotateY(0deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Back face (card back) */}
                <div
                  className="absolute w-full h-full bg-gray-200 border-2 border-gray-400 rounded-md flex justify-center items-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-xl text-gray-500 font-bold">?</span>
                </div>
                {/* Front face (card front) */}
                <div
                  className={`absolute w-full h-full ${matched.includes(card.id)?"bg-green-500 border-green-600":"bg-blue-500 border-blue-700 "}  border-2 rounded-md flex justify-center items-center`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-xl font-bold">{card.number}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {won && (
        <div className="text-center text-4xl my-4 text-green-500 animate-bounce font-bold">
          You won! 
        </div>
      )}
      <div className="flex items-center justify-center">
      <button
      onClick={()=>initializeGame()}
  className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
  type="button"
>
  <div
    className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      height="25px"
      width="25px"
    >
      <path
        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
        fill="#000000"
      ></path>
      <path
        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
        fill="#000000"
      ></path>
    </svg>
  </div>
  <p className="translate-x-4">{!won?"Reset":"Play Again"}</p>
</button>
</div>
    </div>
  );
};

export default MemoryGame;
