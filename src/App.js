import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ExerciseForm from "./components/ExerciseForm";
import Timer from "./components/Timer";

function App() {
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: "Regular Squeeze",
      reps: 3,
      squeezeTime: 10,
      restTime: 10,
    },
    {
      id: 2,
      name: "Phased Squeeze",
      reps: 3,
      phases: [
        { level: "50%", duration: 5 },
        { level: "100%", duration: 5 },
        { level: "50%", duration: 5 },
      ],
      restTime: 10,
    },
  ]);

  const [currentExercise, setCurrentExercise] = useState(null);
  const navigate = useNavigate();

  // Load exercises from localStorage when the app starts
  useEffect(() => {
    const savedExercises = localStorage.getItem("exercises");
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    }
  }, []);

  // Save exercises to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }, [exercises]);

  // Function to add a new exercise
  const handleAddExercise = (exercise) => {
    setExercises((prev) => [...prev, { ...exercise, id: Date.now() }]);
  };

  // Function to delete an exercise
  const handleDeleteExercise = (id) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  };

  // Function to start an exercise (navigates to Timer screen)
  const handleStartExercise = (exercise) => {
    setCurrentExercise(exercise);
    navigate("/timer");
  };

  return (
    <div className="container">
      <Routes>
        <Route
          path="/"
          element={
            <ExerciseForm
              exercises={exercises}
              onStartExercise={handleStartExercise}
              onAddExercise={handleAddExercise}
              onDeleteExercise={handleDeleteExercise}
            />
          }
        />
        <Route
          path="/timer"
          element={
            currentExercise ? (
              <Timer
                exercise={currentExercise}
                onFinish={() => {
                  setCurrentExercise(null);
                  navigate("/"); // Navigate back to exercise selection
                }}
              />
            ) : (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <p>No active exercise. Please select one.</p>
                <button onClick={() => navigate("/")}>Go Back</button>
              </div>
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
