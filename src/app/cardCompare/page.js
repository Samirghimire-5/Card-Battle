"use client";
import React, { useEffect, useState } from "react";

const Cards = () => {
  const [playerSelect, setPlayerSelect] = useState(null);
  const [computerSelect, setComputerSelect] = useState(null);
  const [shuffledCardDeck, setShuffledCardDeck] = useState([]);
  const [result, setResult] = useState(null)

  const suits = [
    { name: "Spades", symbol: "♠️", power: 4 },
    { name: "Hearts", symbol: "♥️", power: 3 },
    { name: "Diamonds", symbol: "♦️", power: 2 },
    { name: "Clubs", symbol: "♣️", power: 1 },
  ];

  const ranks = [
    { card: "A", baseId: 13 },
    { card: "K", baseId: 12 },
    { card: "Q", baseId: 11 },
    { card: "J", baseId: 10 },
    { card: "10", baseId: 9 },
    { card: "9", baseId: 8 },
    { card: "8", baseId: 7 },
    { card: "7", baseId: 6 },
    { card: "6", baseId: 5 },
    { card: "5", baseId: 4 },
    { card: "4", baseId: 3 },
    { card: "3", baseId: 2 },
    { card: "2", baseId: 1 },
  ];

  const cardDeck = [];

  suits.forEach((suit, suitIndex) => {
    ranks.forEach((rank) => {
      cardDeck.push({
        card: `${rank.card}${suit.symbol}`,
        suit: suit.name,
        suitPower: suit.power,
        id: rank.baseId + suitIndex * 13,
        generalId: rank.baseId,
      });
    });
  });

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  useEffect(() => {
    setShuffledCardDeck(shuffleDeck([...cardDeck]));
  }, []);

  const computerPick = () => {
    if (shuffledCardDeck.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * shuffledCardDeck.length);
    const selectedCard = shuffledCardDeck[randomIndex];
    setComputerSelect(selectedCard);
    return selectedCard;
  };

  const compareCard = (playerCard, computerCard) => {
    if (!playerCard || !computerCard) return "Select a card first";
    if (playerCard.card === computerCard.card) computerPick()

    if (playerCard.generalId !== computerCard.generalId) {
      return playerCard.generalId > computerCard.generalId ? "You Win" : "You Lose";
    } else {
      return playerCard.suitPower > computerCard.suitPower ? "You Win" : "You Lose";
    } 
  };

  const handleClick = (item) => {
    setPlayerSelect(item);
    const computerSelectedCard = computerPick();

    setTimeout(() => {
      const comparisionResult = compareCard(item, computerSelectedCard);
      setResult(comparisionResult);
    }, 100);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">Card Battle Game</h1>
      <section className="flex flex-col items-center w-full text-lg md:text-xl mb-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-6 text-center">
          <p>You picked: {playerSelect ? playerSelect.card : ""}</p>
          <p>Computer picked: {computerSelect ? computerSelect.card : ""}</p>
        </div>
        <p className="mt-2 text-green-400 text-2xl font-semibold">{result}</p>
        <button 
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all"
          onClick={() => {
            setComputerSelect(null)
            setPlayerSelect(null)
            setResult(null)
          }}
          >Restart
          </button>
      </section>

      <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 w-full max-w-5xl">
        {shuffledCardDeck.map((item) => {
          const isSelected =
            (playerSelect && playerSelect.id === item.id) ||
            (computerSelect && computerSelect.id === item.id);

          return (
            <div
              key={item.id}
              className={`relative bg-blue-500 text-xl font-bold flex justify-center items-center w-16 h-24 sm:w-20 sm:h-28 shadow-md rounded-lg transition-transform transform hover:scale-110 cursor-pointer 
              ${item.suit === "Spades" || item.suit === "Clubs" ? "text-black" : "text-red-700"} 
              ${playerSelect?.id === item.id ? "bg-purple-300 text-white scale-110" : ""} 
              ${computerSelect?.id === item.id ? "bg-orange-400 text-white scale-110" : ""}`}
              onClick={!isSelected ? () => handleClick(item) : undefined}
            >
              {isSelected ? item.card : ""}
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Cards;
