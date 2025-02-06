import React, { useState, useEffect } from "react";

const KeepScreenOnButton = () => {
  const [wakeLock, setWakeLock] = useState(null);

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        const newWakeLock = await navigator.wakeLock.request("screen");
        setWakeLock(newWakeLock);

        newWakeLock.addEventListener("release", () => {
          console.log("Wake lock released");
          setWakeLock(null);
        });
      } else {
        alert("Wake Lock API is not supported on this device.");
      }
    } catch (err) {
      console.error("Failed to acquire wake lock:", err);
    }
  };

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        releaseWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <button
      onClick={wakeLock ? releaseWakeLock : requestWakeLock}
      className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
        wakeLock ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-500 text-white hover:bg-gray-600"
      }`}
    >
      {wakeLock ? "Screen On (Active)" : "Keep Screen On"}
    </button>
  );
};

export default KeepScreenOnButton;
