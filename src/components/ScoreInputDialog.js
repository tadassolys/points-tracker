// ScoreInputDialog.jsx
import React from "react";
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

const ScoreInputDialog = ({
  isOpen,
  onOpenChange,
  scoreInput,
  onScoreInputChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Points</AlertDialogTitle>
          <AlertDialogDescription>
            <input
              type="number"
              pattern="[0-9]*"
              inputMode="numeric"
              value={scoreInput}
              onChange={onScoreInputChange}
              className="w-full p-2 border rounded-md mt-2"
              placeholder="Enter points to add"
              autoFocus
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>Add Points</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ScoreInputDialog;
