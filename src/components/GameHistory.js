// GameHistory.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trash2 } from "lucide-react";

const GameHistory = ({ gameHistory, onDeleteHistory }) => {
  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
          <Clock size={20} />
          Game History
        </CardTitle>
        {gameHistory.length > 0 && (
          <button
            onClick={onDeleteHistory}
            className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <Trash2 size={16} />
          </button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {gameHistory.length > 0 ? (
            gameHistory.map((game, index) => (
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
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No game history yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameHistory;
