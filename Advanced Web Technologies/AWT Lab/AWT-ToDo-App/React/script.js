
const STORAGE_KEY = "tasks-react";

function App() {
  const [tasks, setTasks] = React.useState([]);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setTasks(data);
    } catch (e) {}
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    const t = text.trim();
    if (!t) return;
    setTasks(prev => [...prev, { text: t, done: false }]);
    setText("");
  }
  function toggle(i) {
    setTasks(prev => prev.map((it, idx) => idx === i ? { ...it, done: !it.done } : it));
  }
  function remove(i) {
    setTasks(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="controls">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Enter task"
          type="text"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>
            <span className={"task" + (t.done ? " completed" : "")}>{t.text}</span>
            <button onClick={() => toggle(i)}>Done</button>
            <button onClick={() => remove(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
