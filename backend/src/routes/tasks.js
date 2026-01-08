const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// GET /api/tasks - get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/tasks/:id - get a single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'Invalid task ID', error: err.message });
  }
});

// POST /api/tasks - create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: !!completed
    });

    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/tasks/:id - update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Validate title if provided
    if (req.body.title != null) {
      const trimmedTitle = req.body.title.trim();
      if (!trimmedTitle) {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      task.title = trimmedTitle;
    }

    if (req.body.description != null) {
      task.description = req.body.description ? req.body.description.trim() : '';
    }

    if (req.body.completed != null) {
      task.completed = req.body.completed;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid task ID', error: err.message });
  }
});

module.exports = router;


