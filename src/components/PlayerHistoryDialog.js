// PlayerHistoryDialog.jsx
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const PlayerHistoryDialog = ({ isOpen, onOpenChange, player, onClose }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {player ? `${player.name} Score History` : "Score History"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {player && player.scoreHistory && player.scoreHistory.length > 0 ? (
              <ul className="list-disc pl-5">
                {player.scoreHistory.map((entry, index) => (
                  <li key={index}>
                    {entry.timestamp}: {entry.score}
                  </li>
                ))}
              </ul>
            ) : (
              <div>No saved scores.</div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PlayerHistoryDialog;
