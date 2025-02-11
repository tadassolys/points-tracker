import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Trash2, Minus, Plus, Save, History } from "lucide-react";

const PlayerCard = ({
  player,
  onToggleEditName,
  onUpdatePlayerName,
  onConfirmRemovePlayer,
  onAddPoints,
  onOpenScoreDialog,
  onSavePlayerScore, // Save function
  onViewPlayerHistory, // History function
}) => {
  // State to handle the button countdown and disable
  const [isSaving, setIsSaving] = useState(false);
  const [countdown, setCountdown] = useState(3); // 3-second countdown

  const handleSave = (playerId) => {
    if (isSaving) return; // Prevent clicking when saving is in progress

    setIsSaving(true);
    onSavePlayerScore(playerId); // Call the save function

    // Start the countdown
    let countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval); // Stop the countdown
          setIsSaving(false); // Enable button again
          return 3; // Reset the countdown
        }
        return prev - 1;
      });
    }, 1000); // Update every second
  };

  return (
    <Card className="w-full dark:bg-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {player.isEditing ? (
            <input
              type="text"
              value={player.name}
              onChange={(e) => onUpdatePlayerName(player.id, e.target.value)}
              onBlur={() => onToggleEditName(player.id)}
              className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
          ) : (
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                {player.name}
                <button
                  onClick={() => onToggleEditName(player.id)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit2 size={16} />
                </button>
              </CardTitle>
              <button
                onClick={() => onConfirmRemovePlayer(player.id)}
                className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Score controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onAddPoints(player.id, -1)}
            className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
          >
            <Minus size={20} />
          </button>

          <button
            onClick={() => onOpenScoreDialog(player.id)}
            className="text-3xl font-bold dark:text-white hover:opacity-75"
          >
            {player.points}
          </button>

          <button
            onClick={() => onAddPoints(player.id, 1)}
            className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Updated buttons row: Switched positions and made them round */}
        <div className="flex justify-between">
          <button
            onClick={() => onViewPlayerHistory(player.id)}
            className="p-3 rounded-full bg-gray-300 text-black hover:bg-gray-400"
          >
            <History size={20} />
          </button>

          <button
            onClick={() => handleSave(player.id)} // Save button functionality
            className={`p-3 rounded-full ${isSaving ? "bg-gray-400" : "bg-blue-500"} text-white hover:bg-blue-600`}
            disabled={isSaving} // Disable the button when saving
          >
            {isSaving ? `${countdown}s` : <Save size={20} />}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm dark:text-gray-300 mt-2">
          <div className="flex items-center gap-2">
            <span>Wins: {player.stats.wins}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Games: {player.stats.gamesPlayed}</span>
          </div>
          <div>High Score: {player.stats.highScore}</div>
          <div>Avg Score: {player.stats.avgScore}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
