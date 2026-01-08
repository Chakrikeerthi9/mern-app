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
      const taskId = String(task._id || task.id);
      const updated = await updateTask(taskId, {
        completed: !task.completed
      });
      
      // Use consistent string comparison for IDs
      const updatedId = String(updated._id || updated.id);
      
      setTasks((prev) =>
        prev.map((t) => {
          const currentId = String(t._id || t.id);
          return currentId === updatedId ? updated : t;
        })
      );
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      const taskId = String(task._id || task.id);
      await deleteTask(taskId);
      setTasks((prev) => {
        return prev.filter((t) => {
          const currentId = String(t._id || t.id);
          return currentId !== taskId;
        });
      });
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleEditTask = async (task, updates) => {
    try {
      const taskId = String(task._id || task.id);
      const updated = await updateTask(taskId, updates);
      
      // Use consistent string comparison for IDs
      const updatedId = String(updated._id || updated.id);
      
      setTasks((prev) =>
        prev.map((t) => {
          const currentId = String(t._id || t.id);
          return currentId === updatedId ? updated : t;
        })
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


