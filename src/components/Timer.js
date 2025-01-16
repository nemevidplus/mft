import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

function Timer({ exercise, onFinish }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(
    exercise.phases && exercise.phases.length > 0
      ? exercise.phases[0].duration
      : exercise.squeezeTime
  );
  const [currentRep, setCurrentRep] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [totalTime, setTotalTime] = useState(
    exercise.phases && exercise.phases.length > 0
      ? exercise.phases[0].duration
      : exercise.squeezeTime
  );
  const [isPaused, setIsPaused] = useState(false); // Track pause state

  useEffect(() => {
    if (isPaused) return; // Pause the timer

    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      if (isResting) {
        if (currentRep < exercise.reps) {
          setIsResting(false);
          setCurrentPhaseIndex(0);
          setTimeLeft(
            exercise.phases && exercise.phases.length > 0
              ? exercise.phases[0].duration
              : exercise.squeezeTime
          );
          setTotalTime(
            exercise.phases && exercise.phases.length > 0
              ? exercise.phases[0].duration
              : exercise.squeezeTime
          );
          setCurrentRep((prev) => prev + 1);
        } else {
          notify("Session Completed!");
          onFinish();
        }
      } else if (exercise.phases && exercise.phases.length > 0) {
        const nextPhaseIndex = currentPhaseIndex + 1;
        if (nextPhaseIndex < exercise.phases.length) {
          setCurrentPhaseIndex(nextPhaseIndex);
          setTimeLeft(exercise.phases[nextPhaseIndex].duration);
          setTotalTime(exercise.phases[nextPhaseIndex].duration);
        } else {
          setIsResting(true);
          setTimeLeft(exercise.restTime);
          setTotalTime(exercise.restTime);
        }
      } else {
        setIsResting(true);
        setTimeLeft(exercise.restTime);
        setTotalTime(exercise.restTime);
      }
    }
  }, [timeLeft, currentPhaseIndex, currentRep, exercise, isResting, onFinish, isPaused]);

  const notify = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(message);
    } else if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  // Calculate the percentage of the time left
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Line position based on the progress
  const linePosition = `${progress}%`;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Navigation Back Arrow */}
      <div
        onClick={() => navigate("/")} // Navigate back to home
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#fff",
          cursor: "pointer",
          zIndex: 5,
        }}
      >
        &lt;
      </div>

      {/* Top Half - Squeeze or Rest */}
      <div
        style={{
          width: "100%",
          height: linePosition,
          backgroundColor: isResting ? "rgb(255, 223, 0)" : "rgb(128, 0, 128)",
          transition: "height 1s linear",
        }}
      ></div>

      {/* Line Divider */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: linePosition,
          width: "100%",
          height: "4px",
          backgroundColor: "black",
          zIndex: 2,
          transition: "top 1s linear",
        }}
      ></div>

      {/* Bottom Half */}
      <div
        style={{
          width: "100%",
          height: `calc(100% - ${linePosition})`,
          backgroundColor: isResting ? "rgb(128, 0, 128)" : "rgb(255, 223, 0)",
          transition: "height 1s linear",
        }}
      ></div>

      {/* Content */}
      <div
        style={{
          position: "absolute",
          zIndex: 3,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textShadow: "0px 0px 10px rgba(0, 0, 0, 0.8)",
        }}
      >
        <h2 style={{ fontSize: "3rem", marginBottom: "1rem" }}>{exercise.name}</h2>
        <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          {isResting
            ? "Rest Phase"
            : exercise.phases && exercise.phases.length > 0
            ? `Squeeze at ${exercise.phases[currentPhaseIndex].level}`
            : "Squeeze Phase"}
        </p>
        <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          Time Left: {timeLeft}s
        </p>
        <p style={{ fontSize: "1.2rem" }}>
          Rep: {currentRep}/{exercise.reps}
        </p>

        {/* Pause/Resume Button */}
        <button
          onClick={() => setIsPaused((prev) => !prev)} // Toggle pause state
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            color: "#fff",
            backgroundColor: isPaused ? "#8a1253" : "#e8751a", // Green for Resume, Red for Pause
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}

export default Timer;
