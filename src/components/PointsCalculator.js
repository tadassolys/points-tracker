// PointsCalculator.jsx
"use client";

import React, { useState, useEffect } from "react";
import KeepScreenOnButton from "./KeepScreenOnButton";
import ResetAndDeleteButton from "./ResetAndDeleteButton";
import PlayerCard from "./PlayerCard";
import GameHistory from "./GameHistory";
import ScoreInputDialog from "./ScoreInputDialog";
import DeleteHistoryDialog from "./DeleteHistoryDialog";
import DeletePlayerDialog from "./DeletePlayerDialog";
import PlayerHistoryDialog from "./PlayerHistoryDialog"; // new

import { Plus, Minus, Users, RotateCcw, Save, Moon, Sun } from "lucide-react";



const GAME_PRESETS = {
  uno: { name: "UNO", increment: 1, players: 4, description: "Classic card game scoring", winCondition: "lowest" },
  yahtzee: { name: "Yahtzee", increment: 5, players: 4, description: "Dice game with multiples of 5", winCondition: "highest" },
  scrabble: { name: "Scrabble", increment: 1, players: 4, description: "Word game with letter scores", winCondition: "highest" },
  poker: { name: "Poker", increment: 5, players: 6, description: "Chip-based scoring", winCondition: "highest" },
  hearts: { name: "Hearts", increment: 1, players: 4, description: "Heart cards = penalty points", winCondition: "lowest" },
  monopoly: { name: "Monopoly", increment: 100, players: 6, description: "Property trading game", winCondition: "highest" },
  rummy: { name: "Rummy", increment: 10, players: 4, description: "Card melding game", winCondition: "lowest" },
  custom: { name: "Custom Game", increment: 1, players: 2, description: "Customize your own scoring", winCondition: "highest" },
};

const PointsCalculator = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [gameType, setGameType] = useState("custom");
  const [selectedIncrement, setSelectedIncrement] = useState(1);
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [scoreInput, setScoreInput] = useState("");
  const [isDeleteHistoryDialogOpen, setIsDeleteHistoryDialogOpen] = useState(false);
  const [isDeletePlayerDialogOpen, setIsDeletePlayerDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  
  // New state for player history dialog
  const [isPlayerHistoryDialogOpen, setIsPlayerHistoryDialogOpen] = useState(false);
  const [selectedPlayerForHistory, setSelectedPlayerForHistory] = useState(null);

  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "Player 1",
      points: 0,
      isEditing: false,
      stats: { wins: 0, gamesPlayed: 0, highScore: 0, avgScore: 0 },
      scoreHistory: []
    },
    {
      id: 2,
      name: "Player 2",
      points: 0,
      isEditing: false,
      stats: { wins: 0, gamesPlayed: 0, highScore: 0, avgScore: 0 },
      scoreHistory: []
    },
  ]);
  const [gameHistory, setGameHistory] = useState([]);

  // Load saved state from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));

    const savedGameType = localStorage.getItem("gameType");
    if (savedGameType) setGameType(savedGameType);

    const savedPlayers = localStorage.getItem("players");
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));

    const savedGameHistory = localStorage.getItem("gameHistory");
    if (savedGameHistory) setGameHistory(JSON.parse(savedGameHistory));

    const savedIncrement = localStorage.getItem("selectedIncrement");
    if (savedIncrement) setSelectedIncrement(parseInt(savedIncrement));
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("gameType", gameType);
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
    localStorage.setItem("selectedIncrement", selectedIncrement.toString());
  }, [darkMode, gameType, players, gameHistory, selectedIncrement]);

  const resetAndDeleteAll = () => {
    setPlayers([]);
    setGameHistory([]);
    localStorage.clear();
  };

  const handleAddPoints = (playerId, amount) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId
          ? { ...player, points: player.points + amount * selectedIncrement }
          : player
      )
    );
  };

  const handleScoreSubmit = () => {
    const points = parseInt(scoreInput);
    if (!isNaN(points) && scoreInput.trim() !== "") {
      setPlayers(
        players.map((player) =>
          player.id === selectedPlayerId
            ? { ...player, points: player.points + points }
            : player
        )
      );
    }
    setIsScoreDialogOpen(false);
    setScoreInput("");
    setSelectedPlayerId(null);
  };

  const toggleEditName = (playerId) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId ? { ...player, isEditing: !player.isEditing } : player
      )
    );
  };

  const updatePlayerName = (playerId, newName) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, name: newName } : player
      )
    );
  };

  const confirmRemovePlayer = (playerId) => {
    setPlayerToDelete(playerId);
    setIsDeletePlayerDialogOpen(true);
  };

  const handleRemovePlayer = () => {
    if (playerToDelete !== null) {
      setPlayers(players.filter((player) => player.id !== playerToDelete));
      setIsDeletePlayerDialogOpen(false);
      setPlayerToDelete(null);
    }
  };

  const addNewPlayer = () => {
    setPlayers([
      ...players,
      {
        id: players.length > 0 ? Math.max(...players.map((p) => p.id)) + 1 : 1,
        name: `Player ${players.length + 1}`,
        points: 0,
        isEditing: false,
        stats: { wins: 0, gamesPlayed: 0, highScore: 0, avgScore: 0 },
        scoreHistory: []
      },
    ]);
  };

  const clearGameHistory = () => {
    setGameHistory([]);
    setIsDeleteHistoryDialogOpen(false);
  };

  const updatePlayerStats = () => {
    const preset = GAME_PRESETS[gameType];
    const sortedPlayers = [...players].sort((a, b) =>
      preset.winCondition === "highest" ? b.points - a.points : a.points - b.points
    );
    const highestScore = sortedPlayers[0].points;
    const winners = sortedPlayers.filter((p) => p.points === highestScore);

    return players.map((player) => {
      const newGamesPlayed = player.stats.gamesPlayed + 1;
      const newHighScore = Math.max(player.stats.highScore, player.points);
      const newWins = winners.some((w) => w.id === player.id)
        ? player.stats.wins + 1
        : player.stats.wins;
      const newAvgScore =
        (player.stats.avgScore * player.stats.gamesPlayed + player.points) /
        newGamesPlayed;

      return {
        ...player,
        stats: {
          wins: newWins,
          gamesPlayed: newGamesPlayed,
          highScore: newHighScore,
          avgScore: Math.round(newAvgScore * 100) / 100,
        },
      };
    });
  };

  const resetGame = () => {
    const currentGame = {
      timestamp: new Date().toLocaleString(),
      gameType: GAME_PRESETS[gameType].name,
      scores: players.map((p) => ({ name: p.name, score: p.points })),
    };
    setGameHistory([currentGame, ...gameHistory]);
    const updatedPlayers = updatePlayerStats();
    setPlayers(updatedPlayers.map((player) => ({ ...player, points: 0 })));
  };

  const changeGameType = (type) => {
    setGameType(type);
    setSelectedIncrement(GAME_PRESETS[type].increment);
  };

  const saveGame = () => {
    if (players.every((player) => player.points === 0)) {
      alert("No game data to save! Add points before saving.");
      return;
    }

    const newGame = {
      timestamp: new Date().toLocaleString(),
      gameType: GAME_PRESETS[gameType].name,
      scores: players.map((p) => ({ name: p.name, score: p.points })),
    };

    const updatedGameHistory = [newGame, ...gameHistory];
    setGameHistory(updatedGameHistory);
    localStorage.setItem("gameHistory", JSON.stringify(updatedGameHistory));
  };

  // New: Save current score for a player
  const savePlayerScore = (playerId) => {
    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          const newEntry = {
            score: player.points,
            timestamp: new Date().toLocaleString(),
          };
          const updatedHistory = player.scoreHistory
            ? [...player.scoreHistory, newEntry]
            : [newEntry];
          return { ...player, scoreHistory: updatedHistory };
        }
        return player;
      })
    );
  };

  // New: Open the player history dialog
  const openPlayerHistory = (playerId) => {
    const player = players.find((p) => p.id === playerId);
    setSelectedPlayerForHistory(player);
    setIsPlayerHistoryDialogOpen(true);
  };

  const incrementOptions = [1, 5, 10, 25, 50, 100];

  return (
    <div className={`max-w-2xl mx-auto p-4 space-y-4 ${darkMode ? "dark" : ""}`}>
      {/* Game Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl font-bold dark:text-white">Points Calculator</h1>
          <select
            className="block w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            value={gameType}
            onChange={(e) => changeGameType(e.target.value)}
          >
            {Object.entries(GAME_PRESETS).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.name} - {preset.description}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={addNewPlayer}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            disabled={players.length >= 25}
          >
            <Users size={20} />
          </button>
          <button
            onClick={resetGame}
            className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Increment Options */}
      <div className="flex gap-2 overflow-x-auto py-2">
        {incrementOptions.map((inc) => (
          <button
            key={inc}
            onClick={() => setSelectedIncrement(inc)}
            className={`px-4 py-2 rounded-full ${
              selectedIncrement === inc
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            +{inc}
          </button>
        ))}
      </div>

      <KeepScreenOnButton />

      {/* Players List */}
      <div className="space-y-4">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onToggleEditName={toggleEditName}
            onUpdatePlayerName={updatePlayerName}
            onConfirmRemovePlayer={confirmRemovePlayer}
            onAddPoints={handleAddPoints}
            onOpenScoreDialog={(playerId) => {
              setSelectedPlayerId(playerId);
              setIsScoreDialogOpen(true);
            }}
            onSavePlayerScore={savePlayerScore}       // new
            onViewPlayerHistory={openPlayerHistory}     // new
          />
        ))}
      </div>

      <button
        onClick={saveGame}
        className="w-full py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
      >
        <Save size={20} />
        Save Game
      </button>

      <ResetAndDeleteButton onReset={resetAndDeleteAll} />

      <GameHistory
        gameHistory={gameHistory}
        onDeleteHistory={() => setIsDeleteHistoryDialogOpen(true)}
      />

      {/* Dialogs */}
      <ScoreInputDialog
        isOpen={isScoreDialogOpen}
        onOpenChange={setIsScoreDialogOpen}
        scoreInput={scoreInput}
        onScoreInputChange={(e) => setScoreInput(e.target.value)}
        onCancel={() => {
          setScoreInput("");
          setSelectedPlayerId(null);
          setIsScoreDialogOpen(false);
        }}
        onSubmit={handleScoreSubmit}
      />

      <DeleteHistoryDialog
        isOpen={isDeleteHistoryDialogOpen}
        onOpenChange={setIsDeleteHistoryDialogOpen}
        onCancel={() => setIsDeleteHistoryDialogOpen(false)}
        onConfirm={clearGameHistory}
      />

      <DeletePlayerDialog
        isOpen={isDeletePlayerDialogOpen}
        onOpenChange={setIsDeletePlayerDialogOpen}
        onCancel={() => setIsDeletePlayerDialogOpen(false)}
        onConfirm={handleRemovePlayer}
      />

      <PlayerHistoryDialog
        isOpen={isPlayerHistoryDialogOpen}
        onOpenChange={setIsPlayerHistoryDialogOpen}
        player={selectedPlayerForHistory}
        onClose={() => setIsPlayerHistoryDialogOpen(false)}
      />
    </div>
  );
};

export default PointsCalculator;
