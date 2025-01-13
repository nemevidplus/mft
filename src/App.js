import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const savedExercises = localStorage.getItem("exercises");
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }, [exercises]);

  const handleAddExercise = (exercise) => {
    setExercises((prev) => [...prev, { ...exercise, id: Date.now() }]);
  };

  const handleDeleteExercise = (id) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  };

  const handleStartExercise = (exercise) => {
    setCurrentExercise(exercise);
  };

  return (
    <div className="container">
      <h1>Workout Timer</h1>
      {currentExercise ? (
        <Timer exercise={currentExercise} onFinish={() => setCurrentExercise(null)} />
      ) : (
        <ExerciseForm
          exercises={exercises}
          onStartExercise={handleStartExercise}
          onAddExercise={handleAddExercise}
          onDeleteExercise={handleDeleteExercise} // Pass delete function
        />
      )}
    </div>
  );
}

export default App;
