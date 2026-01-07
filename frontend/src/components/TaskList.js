import React from 'react';

function TaskList({ tasks, onToggleComplete, onDelete }) {
  if (!tasks.length) {
    return <p className="empty-state">No tasks yet. Add one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id || task.id} className={task.completed ? 'completed' : ''}>
          <div>
            <strong>{task.title}</strong>
            {task.description && <p>{task.description}</p>}
          </div>
          <div className="task-actions">
            <button
              onClick={() => onToggleComplete(task)}
              aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
            >
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;


