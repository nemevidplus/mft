import React, { useState, useEffect } from "react";

function Timer({ exercise, onFinish }) {
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

  useEffect(() => {
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
  }, [timeLeft, currentPhaseIndex, currentRep, exercise, isResting, onFinish]);

  const notify = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(message);
    } else if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const backgroundColor = isResting
    ? `rgba(173, 216, 230, ${progress / 100})`
    : `rgba(128, 0, 128, ${progress / 100})`;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor,
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.5s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#fff",
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
      </div>
    </div>
  );
}

export default Timer;
