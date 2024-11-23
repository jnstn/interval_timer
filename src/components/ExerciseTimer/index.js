"use client";

import { useState, useEffect } from "react";

const ExerciseTimer = () => {
  const [exercises, setExercises] = useState([
    { id: 1, name: "Exercise 1", duration: 30, rest: 10 },
  ]);
  const [originalExercises, setOriginalExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bulkEditDuration, setBulkEditDuration] = useState("");
  const [bulkEditRest, setBulkEditRest] = useState("");
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  useEffect(() => {
    if (!isWorkoutStarted || isPaused || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkoutStarted, isPaused, timer]);

  useEffect(() => {
    if (isWorkoutStarted && timer === 0) {
      if (!isResting) {
        setIsResting(true);
        setTimer(exercises[currentExerciseIndex]?.rest || 0);
      } else {
        const updatedExercises = [...exercises];
        updatedExercises.splice(currentExerciseIndex, 1);
        setExercises(updatedExercises);

        if (currentExerciseIndex < updatedExercises.length) {
          setIsResting(false);
          setTimer(updatedExercises[currentExerciseIndex]?.duration || 0);
        } else {
          setIsWorkoutStarted(false);
          setIsResting(false);
          setExercises(originalExercises);
        }
      }
    }
  }, [
    timer,
    isResting,
    isWorkoutStarted,
    exercises,
    currentExerciseIndex,
    originalExercises,
  ]);

  const handleFieldUpdate = (id, field, value) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: exercises.length + 1,
        name: `Exercise ${exercises.length + 1}`,
        duration: 30,
        rest: 10,
      },
    ]);
  };

  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const handleStartWorkout = () => {
    const hasEmptyFields = exercises.some(
      (exercise) =>
        !exercise.name || exercise.duration <= 0 || exercise.rest <= 0
    );

    if (hasEmptyFields) {
      alert(
        "Please ensure all exercises have valid names and positive durations/rests."
      );
      return;
    }

    setOriginalExercises([...exercises]);
    setCurrentExerciseIndex(0);
    setTimer(exercises[0]?.duration || 0);
    setIsWorkoutStarted(true);
  };

  const handlePauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const handleResetWorkout = () => {
    setIsWorkoutStarted(false);
    setIsResting(false);
    setIsPaused(false);
    setTimer(0);
    setExercises([...originalExercises]);
  };

  const handleBulkEdit = () => {
    setExercises(
      exercises.map((exercise) => ({
        ...exercise,
        duration: bulkEditDuration
          ? Math.max(1, parseInt(bulkEditDuration, 10))
          : exercise.duration,
        rest: bulkEditRest
          ? Math.max(1, parseInt(bulkEditRest, 10))
          : exercise.rest,
      }))
    );
    setBulkEditDuration("");
    setBulkEditRest("");
    setShowBulkEdit(false); // Hide the bulk edit modal
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 bg-white">
      <h1 className="text-4xl font-semibold text-center mb-6 text-black">
        Exercise Interval Timer
      </h1>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-black">
          Timer:{" "}
          <span className="text-blue-500">
            {isWorkoutStarted ? timer : "00:00"}
          </span>
        </h2>
        {isWorkoutStarted && (
          <h3 className="text-xl text-gray-600 mt-2">
            {isResting ? (
              <span className="text-red-500">Resting</span>
            ) : (
              `Current Exercise: ${exercises[currentExerciseIndex]?.name || ""}`
            )}
          </h3>
        )}
      </div>

      {!isWorkoutStarted && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowBulkEdit((prev) => !prev)}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
          >
            {showBulkEdit ? "Hide Bulk Edit" : "Show Bulk Edit"}
          </button>
        </div>
      )}

      {!isWorkoutStarted && showBulkEdit && (
        <div className="mb-6 p-4 border-t border-b border-gray-300">
          <h3 className="text-lg font-semibold mb-2 text-black">Bulk Edit</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-800">
                Duration (sec)
              </label>
              <input
                type="number"
                value={bulkEditDuration}
                onChange={(e) => setBulkEditDuration(e.target.value)}
                placeholder="Duration"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-800">
                Rest (sec)
              </label>
              <input
                type="number"
                value={bulkEditRest}
                onChange={(e) => setBulkEditRest(e.target.value)}
                placeholder="Rest"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleBulkEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition sm:mt-6"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className={`relative grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_4rem] gap-2 sm:gap-4 py-4 border-b ${
              isWorkoutStarted
                ? index === currentExerciseIndex
                  ? isResting
                    ? "bg-gray-200"
                    : "bg-gray-100"
                  : "bg-white"
                : "bg-white"
            }`}
          >
            {isWorkoutStarted && index === currentExerciseIndex && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-md">
                <span className="text-white text-xl font-bold">
                  {isResting
                    ? `Resting: ${exercise.name} (${timer}s)`
                    : `Exercise: ${exercise.name} (${timer}s)`}
                </span>
              </div>
            )}

            <div className="w-full col-span-2 sm:col-auto">
              <label className="block text-sm font-medium text-gray-800">
                Name
              </label>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) =>
                  handleFieldUpdate(exercise.id, "name", e.target.value)
                }
                placeholder="Exercise Name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isWorkoutStarted && index === currentExerciseIndex}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800">
                Duration (sec)
              </label>
              <input
                type="number"
                value={exercise.duration}
                onChange={(e) =>
                  handleFieldUpdate(exercise.id, "duration", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isWorkoutStarted && index === currentExerciseIndex}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800">
                Rest (sec)
              </label>
              <input
                type="number"
                value={exercise.rest}
                onChange={(e) =>
                  handleFieldUpdate(exercise.id, "rest", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isWorkoutStarted && index === currentExerciseIndex}
              />
            </div>
            <div className="col-span-2 sm:col-auto flex-initial flex items-end">
              <button
                onClick={() => handleDeleteExercise(exercise.id)}
                className={`w-full px-2 py-2 rounded-md transition ${
                  isWorkoutStarted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                disabled={isWorkoutStarted}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        {!isWorkoutStarted ? (
          <>
            <button
              onClick={handleAddExercise}
              className="w-full sm:w-auto px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition"
            >
              Add Exercise
            </button>
            <button
              onClick={handleStartWorkout}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Start Workout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handlePauseWorkout}
              className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={handleResetWorkout}
              className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExerciseTimer;
