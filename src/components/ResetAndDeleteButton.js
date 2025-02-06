import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ResetAndDeleteButton = ({ onReset }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReset = () => {
    onReset();
    setIsDialogOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="w-full py-3 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-600"
      >
        Reset and Delete Everything
      </button>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reset and Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset and delete all data? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, Reset and Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ResetAndDeleteButton;
