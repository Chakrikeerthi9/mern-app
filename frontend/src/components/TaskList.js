import React, { useState, useEffect } from 'react';

function TaskList({ tasks, onToggleComplete, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitles, setEditTitles] = useState({});

  // Reset editing when tasks change (task was deleted or list was refreshed)
  // This hook MUST be called before any early returns
  useEffect(() => {
    if (editingId) {
      const editingTaskExists = tasks.some(t => String(t._id || t.id) === String(editingId));
      if (!editingTaskExists) {
        setEditingId(null);
        setEditTitles({});
      }
    }
  }, [tasks, editingId]);

  if (!tasks.length) {
    return <p className="empty-state">No tasks yet. Add one above.</p>;
  }

  const handleEditClick = (task) => {
    const taskId = String(task._id || task.id); // Ensure it's a string for consistent comparison
    // Only allow one task to be edited at a time - clear previous state
    if (editingId && editingId !== taskId) {
      setEditTitles((prev) => {
        const newTitles = { ...prev };
        delete newTitles[editingId];
        return newTitles;
      });
    }
    setEditingId(taskId);
    setEditTitles((prev) => ({
      ...prev,
      [taskId]: task.title
    }));
  };

  const handleSaveEdit = async (task) => {
    const taskId = String(task._id || task.id);
    const editTitle = editTitles[taskId] || '';
    
    if (editTitle.trim() && editTitle !== task.title) {
      await onEdit(task, { title: editTitle.trim() });
    }
    
    // Clear editing state for this specific task only
    if (String(editingId) === taskId) {
      setEditingId(null);
    }
    setEditTitles((prev) => {
      const newTitles = { ...prev };
      delete newTitles[taskId];
      return newTitles;
    });
  };

  const handleCancelEdit = (task) => {
    const taskId = String(task._id || task.id);
    // Only clear if this is the task being edited
    if (String(editingId) === taskId) {
      setEditingId(null);
    }
    setEditTitles((prev) => {
      const newTitles = { ...prev };
      delete newTitles[taskId];
      return newTitles;
    });
  };

  const handleEditChange = (taskId, value) => {
    // Ensure taskId is a string for consistent key access
    const stringId = String(taskId);
    setEditTitles((prev) => ({
      ...prev,
      [stringId]: value
    }));
  };

  const handleKeyDown = (e, task) => {
    if (e.key === 'Enter') {
      handleSaveEdit(task);
    } else if (e.key === 'Escape') {
      handleCancelEdit(task);
    }
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const taskId = String(task._id || task.id); // Ensure string for consistent comparison
        const isEditing = String(editingId) === taskId; // Ensure both are strings

        return (
          <li key={taskId} className={task.completed ? 'completed' : ''}>
            <div className="task-content">
              {isEditing ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editTitles[taskId] || task.title || ''}
                  onChange={(e) => handleEditChange(taskId, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, task)}
                  autoFocus
                  aria-label="Edit task title"
                />
              ) : (
                <>
                  <strong>{task.title}</strong>
                  {task.description && <p>{task.description}</p>}
                </>
              )}
            </div>
            <div className="task-actions">
              {isEditing ? (
                <>
                  <button
                    className="save-btn"
                    onClick={() => handleSaveEdit(task)}
                    aria-label="Save changes"
                  >
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelEdit(task)}
                    aria-label="Cancel editing"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(task)}
                    aria-label={`Edit ${task.title}`}
                  >
                    Edit
                  </button>
                  <button
                    className="toggle-btn"
                    onClick={() => onToggleComplete(task)}
                    aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                  >
                    {task.completed ? 'Undo' : 'Done'}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(task)}
                    aria-label={`Delete ${task.title}`}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
