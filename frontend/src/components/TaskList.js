import React, { useState } from 'react';

function TaskList({ tasks, onToggleComplete, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  if (!tasks.length) {
    return <p className="empty-state">No tasks yet. Add one above.</p>;
  }

  const handleEditClick = (task) => {
    setEditingId(task._id || task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = async (task) => {
    if (editTitle.trim() && editTitle !== task.title) {
      await onEdit(task, { title: editTitle.trim() });
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e, task) => {
    if (e.key === 'Enter') {
      handleSaveEdit(task);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const taskId = task._id || task.id;
        const isEditing = editingId === taskId;

        return (
          <li key={taskId} className={task.completed ? 'completed' : ''}>
            <div className="task-content">
              {isEditing ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
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
                    onClick={handleCancelEdit}
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
