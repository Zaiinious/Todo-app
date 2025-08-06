import "./App.css";

export default function App() {
  return (
    <div className="page-wrap">
      <div className="card">
        <h1 className="title">Get Things Done!</h1>

        <div className="form-row">
          <input className="task-input" placeholder="What is the task today?" />
          <button className="add-btn">Add Task</button>
        </div>

        <ul className="list">
          {/* nanti isi list muncul di sini */}
        </ul>
      </div>
    </div>
  );
}
