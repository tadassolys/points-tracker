
import { Dialog } from "@headlessui/react";
import React from "react";

export const AlertDialog = ({ open, onOpenChange, children }) => {
  return (
    <Dialog open={open} onClose={onOpenChange}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
          {children}
        </div>
      </div>
    </Dialog>
  );
};

export const AlertDialogContent = ({ children }) => (
  <div className="p-6">{children}</div>
);

export const AlertDialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const AlertDialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-800">{children}</h2>
);

export const AlertDialogDescription = ({ children }) => (
  <p className="text-gray-600">{children}</p>
);

export const AlertDialogFooter = ({ children }) => (
  <div className="flex justify-end gap-2 mt-4">{children}</div>
);

export const AlertDialogCancel = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
  >
    {children}
  </button>
);

export const AlertDialogAction = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${className}`}
  >
    {children}
  </button>
);
