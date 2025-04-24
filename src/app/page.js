"use client";
import React, { useEffect, useState, useMemo } from "react";

const Cards = () => {
  const [playerSelect, setPlayerSelect] = useState(null);
  const [computerSelect, setComputerSelect] = useState(null);
  const [shuffledCardDeck, setShuffledCardDeck] = useState([]);
  const [result, setResult] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showCards, setShowCards] = useState(true);
  const [revealedCardId, setRevealedCardId] = useState(null);
  const [roundOver, setRoundOver] = useState(false);

  const cardDeck = useMemo(() => {
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

    const deck = [];
    suits.forEach((suit, suitIndex) => {
      ranks.forEach((rank) => {
        deck.push({
          card: `${rank.card}${suit.symbol}`,
          suit: suit.name,
          suitPower: suit.power,
          id: rank.baseId + suitIndex * 13,
          generalId: rank.baseId,
        });
      });
    });
    return deck;
  }, []);

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  useEffect(() => {
    setShuffledCardDeck(shuffleDeck([...cardDeck]));
  }, [cardDeck]); // Now cardDeck will only change if suits or ranks change

  const computerPick = () => {
    if (shuffledCardDeck.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * shuffledCardDeck.length);
    const selectedCard = shuffledCardDeck[randomIndex];
    setComputerSelect(selectedCard);
    return selectedCard;
  };

  const compareCard = (playerCard, computerCard) => {
    if (!playerCard || !computerCard) return "Select a card first";
    if (playerCard.card === computerCard.card) computerPick();

    if (playerCard.generalId !== computerCard.generalId) {
      return playerCard.generalId > computerCard.generalId
        ? "You Win"
        : "You Lose";
    } else {
      return playerCard.suitPower > computerCard.suitPower
        ? "You Win"
        : "You Lose";
    }
  };

  const handleCardClick = (item) => {
    if (playerSelect || roundOver) {
      // If a card is already selected or the round is over, do nothing
      return;
    }

    // Reveal the card first
    setRevealedCardId(item.id);

    // After a short delay, process the selection
    setTimeout(() => {
      setPlayerSelect(item);
      const computerSelectedCard = computerPick();

      setTimeout(() => {
        const comparisonResult = compareCard(item, computerSelectedCard);
        setResult(comparisonResult);
        setGameHistory([
          {
            playerCard: item,
            computerCard: computerSelectedCard,
            result: comparisonResult,
          },
          ...gameHistory,
        ]);
        setRoundOver(true); // Mark the round as over
        setRevealedCardId(null); // Hide the revealed card
      }, 100);
    }, 500);
  };

  const handleNextRoundClick = () => {
    setPlayerSelect(null);
    setComputerSelect(null);
    setResult(null);
    setRoundOver(false);
    setShuffledCardDeck(shuffleDeck([...cardDeck]));
  };

  const restartGame = () => {
    setComputerSelect(null);
    setPlayerSelect(null);
    setResult(null);
    setRevealedCardId(null);
    setRoundOver(false);
    setShuffledCardDeck(shuffleDeck([...cardDeck]));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-white">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400 tracking-wider">
        Card Battle Game
      </h1>

      <div className="w-full max-w-4xl mb-8">
        <div className="flex justify-between mb-4">
          <button
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg transition-all"
            onClick={restartGame}
          >
            New Game
          </button>
          <button
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg transition-all"
            onClick={() => setShowCards(!showCards)}
          >
            {showCards ? "Hide Cards" : "Show Cards"}
          </button>
        </div>

        {/* Battle Arena */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-around items-center gap-6">
            {/* Player Side */}
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold mb-2 text-blue-400">
                Your Card
              </h2>
              {playerSelect ? (
                <div
                  className={`w-32 h-44 rounded-lg flex items-center justify-center text-4xl font-bold shadow-lg transform transition-all duration-300 ${
                    playerSelect.suit === "Hearts" ||
                    playerSelect.suit === "Diamonds"
                      ? "bg-gradient-to-br from-red-100 to-red-200 text-red-600"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
                  }`}
                >
                  {playerSelect.card}
                </div>
              ) : (
                <div className="w-32 h-44 rounded-lg bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center text-xl font-bold shadow-lg">
                  Select a card
                </div>
              )}
            </div>

            {/* VS */}
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">VS</div>
              {result && (
                <div
                  className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                    result === "You Win"
                      ? "bg-green-600 text-white"
                      : result === "You Lose"
                      ? "bg-red-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {result}
                </div>
              )}
              {roundOver && (
                <button
                  className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white font-semibold transition-all"
                  onClick={handleNextRoundClick}
                >
                  Next Round
                </button>
              )}
            </div>

            {/* Computer Side */}
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold mb-2 text-red-400">
                Computer&apos;s Card
              </h2>
              {computerSelect ? (
                <div
                  className={`w-32 h-44 rounded-lg flex items-center justify-center text-4xl font-bold shadow-lg transform transition-all duration-300 ${
                    computerSelect.suit === "Hearts" ||
                    computerSelect.suit === "Diamonds"
                      ? "bg-gradient-to-br from-red-100 to-red-200 text-red-600"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
                  }`}
                >
                  {computerSelect.card}
                </div>
              ) : (
                <div className="w-32 h-44 rounded-lg bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center text-xl font-bold shadow-lg">
                  Computer
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game History */}
        {gameHistory.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 mb-8">
            <h2 className="text-xl font-bold mb-2 text-yellow-400">
              Game History
            </h2>
            <div className="max-h-40 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2">Round</th>
                    <th className="py-2">Your Card</th>
                    <th className="py-2">Computer&apos;s Card</th>
                    <th className="py-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((game, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 text-center"
                    >
                      <td className="py-2">{gameHistory.length - index}</td>
                      <td className="py-2">{game.playerCard.card}</td>
                      <td className="py-2">{game.computerCard.card}</td>
                      <td
                        className={`py-2 font-medium ${
                          game.result === "You Win"
                            ? "text-green-400"
                            : game.result === "You Lose"
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {game.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cards Deck */}
      {showCards && (
        <section className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2 w-full max-w-6xl">
          {shuffledCardDeck.map((item) => {
            const isSelected =
              (playerSelect && playerSelect.id === item.id) ||
              (computerSelect && computerSelect.id === item.id);

            const isHeartOrDiamond =
              item.suit === "Hearts" || item.suit === "Diamonds";

            const isRevealed = revealedCardId === item.id;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between items-center w-16 h-24 sm:w-20 sm:h-28 shadow-lg rounded-lg cursor-pointer transition-all duration-200
    ${isSelected || roundOver ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
    ${
      isRevealed || isSelected
        ? isHeartOrDiamond
          ? "bg-gradient-to-br from-red-100 to-red-200 text-red-600"
          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
        : "bg-gradient-to-br from-blue-600 to-blue-800 text-white"
    }
    ${playerSelect?.id === item.id ? "ring-4 ring-blue-500" : ""}
    ${computerSelect?.id === item.id ? "ring-4 ring-red-500" : ""}`}
                onClick={!isSelected && !roundOver ? () => handleCardClick(item) : undefined}
              >
                {isRevealed || isSelected ? (
                  <>
                    <span className="absolute top-1 left-1 text-xl font-bold p-1">
                      {item.card.replace(/[♠️♥️♦️♣️]/g, "")}
                    </span>
                    <span className="absolute text-2xl top-10">
                      {item.card.match(/[♠️♥️♦️♣️]/)[0]}
                    </span>
                    <span className="absolute bottom-1 right-1 text-xl font-bold p-1 transform rotate-180">
                      {item.card.replace(/[♠️♥️♦️♣️]/g, "")}
                    </span>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <span className="text-4xl">?</span>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Game Rules */}
      <div className="mt-8 bg-gray-800 p-4 rounded-lg max-w-lg text-center">
        <h3 className="text-xl font-bold mb-2 text-yellow-400">Game Rules</h3>
        <p className="text-gray-300">
          Select a card to reveal its value and play against the computer. Higher card value wins. If
          cards have the same value, suit power decides (♠️ &gt; ♥️ &gt; ♦️
          &gt; ♣️). Click &apos;Next Round&apos; to shuffle the cards and play again after a round ends.
        </p>
      </div>
    </div>
  );
};

export default Cards;