import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import config from "../../config/config";
import BackButton from "../../components/BackButton";
import { Button } from "../../components/Button";

const FRAME_INTERVAL_MS = 350;
const DEFAULT_EXERCISE = "push_up";

const ExerciseTracker = () => {
  const [exerciseType, setExerciseType] = useState(DEFAULT_EXERCISE);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [metrics, setMetrics] = useState({
    reps: 0,
    stage: "-",
    poseDetected: false,
    accuracy: 0,
    feedback: "Align full body in frame",
  });
  const [annotatedFrame, setAnnotatedFrame] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef(null);
  const frameIntervalRef = useRef(null);

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

  const clearFrameLoop = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  };

  const captureAndSendFrame = async () => {
    if (!videoRef.current) return;
    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) return;
    if (isProcessing) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const base64Image = canvas.toDataURL("image/jpeg", 0.75);

    try {
      setIsProcessing(true);
      const res = await fetch(`${config.flaskUrl}/process_frame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          exercise: exerciseType || DEFAULT_EXERCISE,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to process frame");
        return;
      }

      setMetrics({
        reps: data.reps ?? 0,
        stage: data.stage || "-",
        poseDetected: Boolean(data.pose_detected),
        accuracy: Number(data.accuracy || 0),
        feedback: data.feedback || "Tracking",
      });

      if (data.annotated_image) {
        setAnnotatedFrame(data.annotated_image);
      }

      setErrorMessage("");
    } catch (err) {
      setErrorMessage(`Error sending frame: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsRunning(true);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Camera access denied or not available.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    clearFrameLoop();
    setIsRunning(false);
    setExerciseType(DEFAULT_EXERCISE);
    setMetrics({ reps: 0, stage: "-", poseDetected: false, accuracy: 0, feedback: "Align full body in frame" });
    setAnnotatedFrame("");
  };

  const resetCounter = async () => {
    try {
      const response = await fetch(`${config.flaskUrl}/reset_counter`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to reset counters");
        return;
      }

      setMetrics({ reps: 0, stage: "-", poseDetected: false, accuracy: 0, feedback: "Align full body in frame" });
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`Error resetting counters: ${error.message}`);
    }
  };

  const selectExercise = (type) => {
    setExerciseType(type);
    setIsModalOpen(false);
  };

  useEffect(() => {
    clearFrameLoop();

    if (!isRunning) return undefined;

    frameIntervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, FRAME_INTERVAL_MS);

    return () => {
      clearFrameLoop();
    };
  }, [isRunning, exerciseType]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      clearFrameLoop();
    };
  }, [stream]);

  return (
    <div className="flex flex-col w-full items-center bg-background text-foreground p-4 transition-colors duration-300">
      <div className="w-full max-w-4xl mb-4 self-start">
        <BackButton />
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-4">Exercise Tracker</h1>

      {errorMessage && <p className="text-destructive text-sm font-semibold">{errorMessage}</p>}

      <div className="flex flex-col items-center bg-card border border-border shadow-lg rounded-lg p-6 w-full max-w-md">
        {!isRunning ? (
          <Button onClick={startCamera} className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90">
            Start Camera
          </Button>
        ) : (
          <Button onClick={stopCamera} variant="destructive">
            Stop Camera
          </Button>
        )}

        {isRunning && (
          <div className="flex gap-4 mt-4">
            <Button onClick={resetCounter} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Reset Counters
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
              Select Exercise
            </Button>
          </div>
        )}
      </div>

      {isRunning && (
        <div className="mt-6 bg-card border border-border shadow-lg rounded-lg p-4 w-full max-w-lg">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Current Exercise: {routes[exerciseType] || routes[DEFAULT_EXERCISE]}
          </h2>
          <p className="text-sm text-foreground/90">Reps: {metrics.reps}</p>
          <p className="text-sm text-foreground/90">Stage: {metrics.stage}</p>
          <p className="text-sm text-foreground/90">Pose Detected: {metrics.poseDetected ? "Yes" : "No"}</p>
          <p className="text-sm text-foreground/90">Accuracy: {metrics.accuracy.toFixed(1)}%</p>
          <p className="text-sm text-foreground/90">Feedback: {metrics.feedback}</p>
        </div>
      )}

      {annotatedFrame && (
        <img
          src={annotatedFrame}
          alt="Annotated exercise frame"
          className="w-full rounded-lg border border-border mt-4 max-w-4xl"
        />
      )}

      <video
        ref={videoRef}
        className="w-full rounded-lg border border-border mt-4 max-w-md opacity-80"
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
            <Button key={key} onClick={() => selectExercise(key)} variant="outline" className="justify-start">
              {value}
            </Button>
          ))}
        </div>
        <Button onClick={() => setIsModalOpen(false)} variant="destructive" className="mt-4 w-full">
          Close
        </Button>
      </Modal>
    </div>
  );
};

export default ExerciseTracker;
