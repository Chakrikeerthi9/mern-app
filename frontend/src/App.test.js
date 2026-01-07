import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as api from './api';

// Mock API module
jest.mock('./api');

describe('To-Do App UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a task and displays it in the list', async () => {
    api.fetchTasks.mockResolvedValueOnce([]);
    api.createTask.mockResolvedValueOnce({
      _id: '1',
      title: 'New Task',
      description: '',
      completed: false
    });

    render(<App />);

    // Wait for initial load
    await waitFor(() => expect(api.fetchTasks).toHaveBeenCalled());

    const titleInput = screen.getByLabelText(/task title/i);
    const addButton = screen.getByRole('button', { name: /add task/i });

    await userEvent.type(titleInput, 'New Task');
    await userEvent.click(addButton);

    expect(api.createTask).toHaveBeenCalledWith({
      title: 'New Task',
      description: ''
    });

    // Check that new task appears
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('marks a task as complete and updates its status', async () => {
    const initialTask = {
      _id: '1',
      title: 'Existing Task',
      description: '',
      completed: false
    };

    api.fetchTasks.mockResolvedValueOnce([initialTask]);
    api.updateTask.mockResolvedValueOnce({
      ...initialTask,
      completed: true
    });

    render(<App />);

    // Wait for tasks to load
    expect(await screen.findByText('Existing Task')).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', {
      name: /mark existing task as complete/i
    });

    await userEvent.click(toggleButton);

    expect(api.updateTask).toHaveBeenCalledWith('1', { completed: true });

    // After marking complete, button label should flip
    expect(
      await screen.findByRole('button', {
        name: /mark existing task as incomplete/i
      })
    ).toBeInTheDocument();
  });
});


