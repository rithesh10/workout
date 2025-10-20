import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import config from "../../config/config";

const ExerciseTracker = () => {
  const [exerciseType, setExerciseType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [frameInterval, setFrameInterval] = useState(null);

  const routes = {
    push_up: "Push Up",
    left_bicep_curl: "Left Bicep Curl",
    right_bicep_curl: "Right Bicep Curl",
    lunge: "Lunge",
    plank: "Plank",
    deadlift: "Deadlift",
    side_plank: "Side Plank",
    shoulder_press: "Shoulder Press",
    squat: "Squat",
  };

  const startCamera = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(mediaStream);
    videoRef.current.srcObject = mediaStream;
    videoRef.current.play();
    setIsRunning(true);
    setErrorMessage("");
  } catch (err) {
    console.error("Camera access error:", err);
    setErrorMessage("Camera access denied or not available.");
  }
};


  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (frameInterval) {
      clearInterval(frameInterval);
      setFrameInterval(null);
    }
    setIsRunning(false);
    setExerciseType("");
  };

  const resetCounter = async () => {
    try {
      const response = await fetch(`${config.flaskUrl}/reset_counter`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to reset counters");
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("Error resetting counters: " + error.message);
    }
  };

const selectExercise = (type) => {
  setExerciseType(type); // don't use routes[type] — backend expects 'push_up', not 'Push Up'
  setIsModalOpen(false);

  // Only start sending frames AFTER exercise is selected
  if (!frameInterval) {
    const interval = setInterval(() => {
      // console.log("⏱️ Sending frame for:", type);
      captureAndSendFrame(type);
    }, 1000);
    setFrameInterval(interval);
  }
};

 const captureAndSendFrame = async (exercise) => {
  if (!videoRef.current || !exercise) return;

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoRef.current, 0, 0);
  const base64Image = canvas.toDataURL("image/jpeg");

  try {
    const res = await fetch(`${config.flaskUrl}/process_frame`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64Image,
        exercise: exercise
      }),
    });

    const data = await res.json();
    // alert(data)
    
    console.log("📦 Response from backend:", data);
  } catch (err) {
    console.error("Error sending frame:", err);
  }
};


  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden items-center h-screen bg-black p-4">
      <h1 className="text-4xl font-bold text-white mb-4">Exercise Tracker</h1>
      {errorMessage && (
        <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
      )}

      <div className="flex flex-col items-center bg-gray-700 shadow-lg rounded-lg p-6 w-full max-w-md">
        {!isRunning ? (
          <button
            onClick={startCamera}
            className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-red-700 to-red-900 hover:opacity-90"
          >
            Stop Camera
          </button>
        )}

        {isRunning && (
          <>
            <button
              onClick={resetCounter}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:opacity-90"
            >
              Reset Counters
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:opacity-90"
            >
              Select Exercise
            </button>
          </>
        )}
      </div>

      {isRunning && exerciseType && (
        <div className="mt-6 bg-gray-700 shadow-lg rounded-lg p-4 w-full max-w-lg">
          <h2 className="text-lg font-semibold text-white mb-2">
          Current Exercise: {routes[exerciseType]}
        </h2>

        </div>
      )}
      <video
        ref={videoRef}
        className="w-full rounded-lg border"
        autoPlay
        muted
        playsInline
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-gray-800 rounded-lg p-4 max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold text-white mb-4">Select Exercise</h2>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(routes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => selectExercise(key)}
              className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-800 hover:opacity-90"
            >
              {value}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-4 text-white px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ExerciseTracker;
