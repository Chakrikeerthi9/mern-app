const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Task = require('../src/models/Task');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  await Task.deleteMany({});
});

describe('API health check', () => {
  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Tasks API', () => {
  it('POST /api/tasks should create a task', async () => {
    const payload = { title: 'Test task', description: 'Test description' };
    const res = await request(app).post('/api/tasks').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(payload.title);
    expect(res.body.completed).toBe(false);
  });

  it('DELETE /api/tasks/:id should delete a task', async () => {
    // First create a task directly in the DB
    const task = await Task.create({ title: 'To delete' });

    const res = await request(app).delete(`/api/tasks/${task._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Task deleted' });

    const found = await Task.findById(task._id);
    expect(found).toBeNull();
  });

  it('GET /api/tasks should return created tasks', async () => {
    await Task.create({ title: 'Task 1' });
    await Task.create({ title: 'Task 2' });

    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('title');
  });

  it('PUT /api/tasks/:id should update a task', async () => {
    const task = await Task.create({ title: 'Original', completed: false });

    const res = await request(app)
      .put(`/api/tasks/${task._id.toString()}`)
      .send({ completed: true, title: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
    expect(res.body.title).toBe('Updated');
  });
});


