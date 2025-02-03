"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Users,
  RotateCcw,
  Save,
  Edit2,
  Clock,
  Moon,
  Sun,
  Trophy,
  Activity,
  Trash2,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GAME_PRESETS = {
  uno: {
    name: "UNO",
    increment: 1,
    players: 4,
    description: "Classic card game scoring",
    winCondition: "lowest",
  },
  yahtzee: {
    name: "Yahtzee",
    increment: 5,
    players: 4,
    description: "Dice game with multiples of 5",
    winCondition: "highest",
  },
  scrabble: {
    name: "Scrabble",
    increment: 1,
    players: 4,
    description: "Word game with letter scores",
    winCondition: "highest",
  },
  poker: {
    name: "Poker",
    increment: 5,
    players: 6,
    description: "Chip-based scoring",
    winCondition: "highest",
  },
  hearts: {
    name: "Hearts",
    increment: 1,
    players: 4,
    description: "Heart cards = penalty points",
    winCondition: "lowest",
  },
  monopoly: {
    name: "Monopoly",
    increment: 100,
    players: 6,
    description: "Property trading game",
    winCondition: "highest",
  },
  rummy: {
    name: "Rummy",
    increment: 10,
    players: 4,
    description: "Card melding game",
    winCondition: "lowest",
  },
  custom: {
    name: "Custom Game",
    increment: 1,
    players: 2,
    description: "Customize your own scoring",
    winCondition: "highest",
  },
};

const PointsCalculator = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [gameType, setGameType] = useState("custom");
  const [selectedIncrement, setSelectedIncrement] = useState(1);
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [scoreInput, setScoreInput] = useState("");
  const [isDeleteHistoryDialogOpen, setIsDeleteHistoryDialogOpen] =
    useState(false);
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "Player 1",
      points: 0,
      isEditing: false,
      stats: { wins: 0, gamesPlayed: 0, highScore: 0, avgScore: 0 },
    },
    {
      id: 2,
      name: "Player 2",
      points: 0,
      isEditing: false,
      stats: { wins: 0, gamesPlayed: 0, highScore: 0, avgScore: 0 },
    },
  ]);
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    // Load saved state from localStorage
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

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("gameType", gameType);
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
    localStorage.setItem("selectedIncrement", selectedIncrement.toString());
  }, [darkMode, gameType, players, gameHistory, selectedIncrement]);

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
        player.id === playerId
          ? { ...player, isEditing: !player.isEditing }
          : player
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

  const removePlayer = (playerId) => {
    setPlayers(players.filter((player) => player.id !== playerId));
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
      preset.winCondition === "highest"
        ? b.points - a.points
        : a.points - b.points
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

    alert("Game saved successfully! ✅");
  };

  const incrementOptions = [1, 5, 10, 25, 50, 100];

  return (
    <div
      className={`max-w-2xl mx-auto p-4 space-y-4 ${darkMode ? "dark" : ""}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl font-bold dark:text-white">
            Points Calculator
          </h1>
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

      <div className="space-y-4">
        {players.map((player) => (
          <Card key={player.id} className="w-full dark:bg-gray-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                {player.isEditing ? (
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) =>
                      updatePlayerName(player.id, e.target.value)
                    }
                    onBlur={() => toggleEditName(player.id)}
                    className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                      {player.name}
                      <button
                        onClick={() => toggleEditName(player.id)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit2 size={16} />
                      </button>
                    </CardTitle>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => handleAddPoints(player.id, -1)}
                  className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <Minus size={20} />
                </button>

                <button
                  onClick={() => {
                    setSelectedPlayerId(player.id);
                    setIsScoreDialogOpen(true);
                  }}
                  className="text-3xl font-bold dark:text-white hover:opacity-75"
                >
                  {player.points}
                </button>

                <button
                  onClick={() => handleAddPoints(player.id, 1)}
                  className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Trophy size={16} />
                  <span>Wins: {player.stats.wins}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity size={16} />
                  <span>Games: {player.stats.gamesPlayed}</span>
                </div>
                <div>High Score: {player.stats.highScore}</div>
                <div>Avg Score: {player.stats.avgScore}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
            <Clock size={20} />
            Game History
          </CardTitle>
          {gameHistory.length > 0 && (
            <button
              onClick={() => setIsDeleteHistoryDialogOpen(true)}
              className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <Trash2 size={16} />
            </button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gameHistory.map((game, index) => (
              <div key={index} className="border-b dark:border-gray-700 pb-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{game.gameType}</span>
                  <span>{game.timestamp}</span>
                </div>
                <div className="mt-1">
                  {game.scores.map((score, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm dark:text-gray-300"
                    >
                      <span>{score.name}</span>
                      <span className="font-medium">{score.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {gameHistory.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No game history yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Score Input Dialog */}
      <AlertDialog open={isScoreDialogOpen} onOpenChange={setIsScoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Points</AlertDialogTitle>
            <AlertDialogDescription>
              <input
                type="number"
                pattern="[0-9]*"
                inputMode="numeric"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                className="w-full p-2 border rounded-md mt-2"
                placeholder="Enter points to add"
                autoFocus
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setScoreInput("");
                setSelectedPlayerId(null);
                setIsScoreDialogOpen(false); 
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleScoreSubmit}>
              Add Points
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear History Confirmation Dialog */}
      <AlertDialog
        open={isDeleteHistoryDialogOpen}
        onOpenChange={setIsDeleteHistoryDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Game History</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all game history? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setScoreInput("");
                setSelectedPlayerId(null);
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={clearGameHistory}
              className="bg-red-500 hover:bg-red-600"
            >
              Clear History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <button
        onClick={saveGame}
        className="w-full py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
      >
        <Save size={20} />
        Save Game
      </button>
    </div>
  );
};

export default PointsCalculator;
