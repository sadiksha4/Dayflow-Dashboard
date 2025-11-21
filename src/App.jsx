import { useState, useEffect } from "react";
import "./index.css";

function App() {
  // Tasks
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [filter, setFilter] = useState("all");

  // Notes
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);

  // Timer (25 min)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const resetTimer = () => {
    setSecondsLeft(25 * 60);
    setIsRunning(false);
  };

  // Task handlers
  const addTask = () => {
    const title = taskTitle.trim();
    if (!title) return;

    const newTask = {
      id: Date.now(),
      title,
      done: false,
    };

    setTasks([newTask, ...tasks]);
    setTaskTitle("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.done).length;

  // Notes handlers
  const addNote = () => {
    const text = noteText.trim();
    if (!text) return;

    const newNote = {
      id: Date.now(),
      text,
    };

    setNotes([newNote, ...notes]);
    setNoteText("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="df-page">
      {/* HEADER */}
      <header className="df-top-bar">
        <div className="df-top-inner">
          <div className="df-logo">
            Day<span>Flow</span>
          </div>
          <p className="df-tagline">Soft, modern productivity dashboard in React.</p>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="df-layout">
        {/* LEFT PANEL: TASKS */}
        <section className="df-panel">
          <h2>Today&apos;s Tasks</h2>
          <p className="df-sub">Add what you want to focus on and track progress.</p>

          <div className="df-field">
            <label>Task</label>
            <input
              type="text"
              placeholder="e.g. Study React"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
          </div>

          <button className="df-btn-primary" onClick={addTask}>
            Add Task
          </button>

          <div className="df-stats-row">
            <div className="df-stat-card">
              <span className="df-stat-label">Total</span>
              <span className="df-stat-value">{totalTasks}</span>
            </div>
            <div className="df-stat-card">
              <span className="df-stat-label">Completed</span>
              <span className="df-stat-value">{completedTasks}</span>
            </div>
            <div className="df-stat-card">
              <span className="df-stat-label">Active</span>
              <span className="df-stat-value">
                {totalTasks - completedTasks}
              </span>
            </div>
          </div>

          <div className="df-filter-row">
            <button
              className={
                filter === "all" ? "df-filter-btn df-filter-active" : "df-filter-btn"
              }
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={
                filter === "active"
                  ? "df-filter-btn df-filter-active"
                  : "df-filter-btn"
              }
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={
                filter === "done"
                  ? "df-filter-btn df-filter-active"
                  : "df-filter-btn"
              }
              onClick={() => setFilter("done")}
            >
              Done
            </button>
          </div>

          <div className="df-task-list-wrapper">
            {filteredTasks.length === 0 ? (
              <p className="df-empty">No tasks in this view.</p>
            ) : (
              <ul className="df-task-list">
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className={
                      task.done ? "df-task-item df-task-done" : "df-task-item"
                    }
                  >
                    <div className="df-task-main">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className="df-task-title">{task.title}</span>
                    </div>
                    <button
                      className="df-delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: TIMER + NOTES */}
        <section className="df-right-column">
          {/* TIMER */}
          <div className="df-panel df-timer-panel">
            <h2>Focus Timer</h2>
            <p className="df-sub">
              Classic 25-minute session. Stay focused, then take a short break.
            </p>

            <div className="df-timer-display">
              {minutes}:{seconds}
            </div>

            <div className="df-timer-controls">
              <button
                className="df-btn-secondary"
                onClick={() => setIsRunning(true)}
                disabled={isRunning || secondsLeft === 0}
              >
                Start
              </button>
              <button
                className="df-btn-secondary"
                onClick={() => setIsRunning(false)}
                disabled={!isRunning}
              >
                Pause
              </button>
              <button className="df-btn-secondary" onClick={resetTimer}>
                Reset
              </button>
            </div>
          </div>

          {/* NOTES */}
          <div className="df-panel df-notes-panel">
            <h2>Quick Notes</h2>
            <p className="df-sub">
              Capture reminders, ideas or anything you don&apos;t want to forget.
            </p>

            <div className="df-field">
              <label>Note</label>
              <textarea
                rows="3"
                placeholder="Write a short note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>

            <button className="df-btn-primary" onClick={addNote}>
              Add Note
            </button>

            {notes.length === 0 ? (
              <p className="df-empty">No notes yet.</p>
            ) : (
              <div className="df-notes-grid">
                {notes.map((note) => (
                  <div key={note.id} className="df-note-card">
                    <p className="df-note-text">{note.text}</p>
                    <button
                      className="df-delete-note"
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="df-footer">
        DayFlow · React Productivity Dashboard · Built by Sadiksha
      </footer>
    </div>
  );
}

export default App;
