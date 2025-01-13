import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ExerciseForm({ exercises, onStartExercise, onAddExercise, onDeleteExercise }) {
  const [showForm, setShowForm] = useState(false);
  const [isPhasedExercise, setIsPhasedExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    reps: 1,
    squeezeTime: 5,
    restTime: 5,
    phases: null,
  });
  const [phases, setPhases] = useState([
    { level: "50%", duration: 5 },
    { level: "100%", duration: 5 },
    { level: "50%", duration: 5 },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const exerciseToAdd = isPhasedExercise
      ? { ...newExercise, phases, restTime: newExercise.restTime }
      : { ...newExercise, phases: null };
    onAddExercise(exerciseToAdd);
    setShowForm(false);
    setNewExercise({
      name: "",
      reps: 1,
      squeezeTime: 5,
      restTime: 5,
      phases: null,
    });
    setPhases([
      { level: "50%", duration: 5 },
      { level: "100%", duration: 5 },
      { level: "50%", duration: 5 },
    ]);
  };

  const handlePhaseChange = (index, field, value) => {
    const updatedPhases = [...phases];
    updatedPhases[index][field] = field === "duration" ? parseInt(value) : value;
    setPhases(updatedPhases);
  };

  const addPhase = () => {
    setPhases([...phases, { level: "", duration: 5 }]);
  };

  return (
    <div className="exercise-form-container" style={styles.container}>
      <h2 style={styles.title}>Select an Exercise</h2>
      <ul className="list-group" style={{ padding: 0 }}>
        {exercises.map((exercise) => (
          <li key={exercise.id} style={styles.listItem}>
            <span style={styles.exerciseName}>{exercise.name}</span>
            <div>
              <Button
                size="sm"
                style={styles.startButton}
                onClick={() => onStartExercise(exercise)}
              >
                Start
              </Button>
              <Button
                size="sm"
                style={styles.deleteButton}
                onClick={() => onDeleteExercise(exercise.id)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Button style={styles.addButton} onClick={() => setShowForm(true)}>
        Add New Exercise
      </Button>

      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={styles.modalTitle}>Add New Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newExercise.name}
                onChange={(e) =>
                  setNewExercise({ ...newExercise, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reps</Form.Label>
              <Form.Control
                type="number"
                value={newExercise.reps}
                onChange={(e) =>
                  setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })
                }
                min="1"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Phased Exercise"
                checked={isPhasedExercise}
                onChange={(e) => setIsPhasedExercise(e.target.checked)}
              />
            </Form.Group>
            {!isPhasedExercise && (
              <>
                <Form.Group>
                  <Form.Label>Squeeze Time (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newExercise.squeezeTime}
                    onChange={(e) =>
                      setNewExercise({
                        ...newExercise,
                        squeezeTime: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Rest Time (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newExercise.restTime}
                    onChange={(e) =>
                      setNewExercise({
                        ...newExercise,
                        restTime: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    required
                  />
                </Form.Group>
              </>
            )}
            {isPhasedExercise && (
              <>
                <Form.Label>Phases</Form.Label>
                {phases.map((phase, index) => (
                  <div key={index} style={styles.phaseContainer}>
                    <Form.Control
                      type="text"
                      placeholder="Level (e.g., 50%)"
                      value={phase.level}
                      onChange={(e) =>
                        handlePhaseChange(index, "level", e.target.value)
                      }
                      style={styles.phaseInput}
                    />
                    <Form.Control
                      type="number"
                      placeholder="Duration (seconds)"
                      value={phase.duration}
                      onChange={(e) =>
                        handlePhaseChange(index, "duration", e.target.value)
                      }
                      style={styles.phaseInput}
                      min="1"
                    />
                  </div>
                ))}
                <Button style={styles.addPhaseButton} onClick={addPhase}>
                  Add Phase
                </Button>
                <Form.Group>
                  <Form.Label>Rest Time After Each Rep (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newExercise.restTime}
                    onChange={(e) =>
                      setNewExercise({
                        ...newExercise,
                        restTime: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    required
                  />
                </Form.Group>
              </>
            )}
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <Button type="submit" style={styles.saveButton}>
                Save Exercise
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "10px 15px",
    marginBottom: "10px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  exerciseName: {
    fontWeight: "500",
    color: "#333",
  },
  startButton: {
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    color: "#fff",
  },
  addButton: {
    display: "block",
    margin: "20px auto",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    color: "#fff",
    fontSize: "1.2rem",
  },
  modalTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "bold",
    color: "#333",
  },
  phaseContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  phaseInput: {
    flex: "1",
  },
  addPhaseButton: {
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    color: "#fff",
  },
};

export default ExerciseForm;



