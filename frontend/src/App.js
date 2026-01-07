import React, { useEffect, useState } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddTask = async (task) => {
    try {
      const created = await createTask(task);
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updated = await updateTask(task._id || task.id, {
        completed: !task.completed
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id || t.id === updated.id ? updated : t))
      );
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      await deleteTask(task._id || task.id);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== (task._id || task.id)));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleEditTask = async (task, updates) => {
    try {
      const updated = await updateTask(task._id || task.id, updates);
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id || t.id === updated.id ? updated : t))
      );
    } catch (err) {
      setError('Failed to edit task');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>To-Do List</h1>
      </header>
      <main>
        {error && <div className="error">{error}</div>}
        <TaskForm onAdd={handleAddTask} />
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        )}
      </main>
    </div>
  );
}

export default App;


