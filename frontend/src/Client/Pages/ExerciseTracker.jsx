import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import config from "../../config/config";
import BackButton from "../../components/BackButton";
import { Button } from "../../components/Button";

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
    <div className="flex flex-col w-full items-center bg-background text-foreground p-4 transition-colors duration-300">
      <div className="w-full max-w-4xl mb-4 self-start">
        <BackButton />
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-4">Exercise Tracker</h1>
      {errorMessage && (
        <p className="text-destructive text-sm font-semibold">{errorMessage}</p>
      )}

      <div className="flex flex-col items-center bg-card border border-border shadow-lg rounded-lg p-6 w-full max-w-md">
        {!isRunning ? (
          <Button
            onClick={startCamera}
            className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90"
          >
            Start Camera
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            variant="destructive"
          >
            Stop Camera
          </Button>
        )}

        {isRunning && (
          <div className="flex gap-4 mt-4">
            <Button
              onClick={resetCounter}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Reset Counters
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Select Exercise
            </Button>
          </div>
        )}
      </div>

      {isRunning && exerciseType && (
        <div className="mt-6 bg-card border border-border shadow-lg rounded-lg p-4 w-full max-w-lg">
          <h2 className="text-lg font-semibold text-foreground mb-2">
          Current Exercise: {routes[exerciseType]}
        </h2>

        </div>
      )}
      <video
        ref={videoRef}
        className="w-full rounded-lg border border-border mt-6 max-w-4xl"
        autoPlay
        muted
        playsInline
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-card border border-border rounded-lg p-4 max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center z-50"
      >
        <h2 className="text-xl font-bold text-foreground mb-4">Select Exercise</h2>
        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
          {Object.entries(routes).map(([key, value]) => (
            <Button
              key={key}
              onClick={() => selectExercise(key)}
              variant="outline"
              className="justify-start"
            >
              {value}
            </Button>
          ))}
        </div>
        <Button
          onClick={() => setIsModalOpen(false)}
          variant="destructive"
          className="mt-4 w-full"
        >
          Close
        </Button>
      </Modal>
    </div>
  );
};

export default ExerciseTracker;
