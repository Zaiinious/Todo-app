import { useEffect, useState } from "react";
import "./App.css";

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem("todos_v2");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos_v2", JSON.stringify(todos));
  }, [todos]);

  const addOrUpdateTodo = () => {
    const text = input.trim();
    if (!text) return;
    if (editingId) {
      setTodos((prev) => prev.map((t) => (t.id === editingId ? { ...t, text } : t)));
      setEditingId(null);
    } else {
      const newTodo = { id: makeId(), text, done: false, removing: false };
      setTodos((prev) => [...prev, newTodo]);
    }
    setInput("");
  };

  const toggleDone = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const startEdit = (id) => {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    setEditingId(id);
    setInput(t.text);
  };

  const deleteTodo = (id) => {
    // mark removing first so CSS animation can play
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));

    // remove after animation duration (match CSS: 320ms)
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setInput("");
      }
    }, 320);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") addOrUpdateTodo();
    if (e.key === "Escape") {
      setEditingId(null);
      setInput("");
    }
  };

  return (
    <div className="page-wrap">
      <div className="card center-card" role="region" aria-label="todo card">
        <h1 className="title">Get Things Done!</h1>

        <div className="form-row">
          <input
            className="task-input"
            type="text"
            placeholder="What is the task today?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="task input"
          />
          <button className="add-btn" onClick={addOrUpdateTodo}>
            {editingId ? "Update" : "Add Task"}
          </button>
        </div>

        <ul className="list" aria-live="polite">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`list-item ${todo.removing ? "removing" : "enter"}`}
            >
              <label className="left-part">
                <input
                  type="checkbox"
                  checked={!!todo.done}
                  onChange={() => toggleDone(todo.id)}
                />
                <span className={`task-text ${todo.done ? "done" : ""}`}>
                  {todo.text}
                </span>
              </label>

              <div className="icons">
                <button
                  className="icon-btn edit"
                  onClick={() => startEdit(todo.id)}
                  title="Edit"
                  aria-label={`Edit ${todo.text}`}
                >
                  ✎
                </button>
                <button
                  className="icon-btn delete"
                  onClick={() => deleteTodo(todo.id)}
                  title="Delete"
                  aria-label={`Delete ${todo.text}`}
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;