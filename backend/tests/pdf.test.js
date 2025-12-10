/** integration tests for PDF routes */

// testing libraries
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

// application to test
import { createApp } from "../routes/index.js";

import mongoose from "mongoose";

let app;
let token;
let mongoServer;

async function setupMockDB() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}

async function teardownMockDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
}

beforeAll(async () => {
  app = createApp();
  await setupMockDB();
});

afterAll(async () => {
  await teardownMockDB();
});

describe("PDF Generation Integration Tests", () => {
  it("registers and logs in a user", async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ username: 'pdfuser', email: 'pdfuser@example.com', password: 'secret' });
    expect(reg.statusCode).toEqual(200);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pdfuser@example.com', password: 'secret' });
    expect(login.statusCode).toEqual(200);
    expect(login.body).toHaveProperty('token');
    token = login.body.token;
  });

  it('returns a PDF for an existing shopping list', async () => {
    const weekStart = '2024-12-07';
    const items = [
      { name: 'milk', quantity: 2, unit: 'L', category: 'Dairy' },
      { name: 'eggs', quantity: 12, unit: 'pcs', category: 'Eggs' }
    ];

    // create shopping list (upsert)
    const createRes = await request(app)
      .post('/api/shopping-list')
      .set('Authorization', `Bearer ${token}`)
      .send({ weekStart, items });

    expect(createRes.statusCode).toEqual(200);
    expect(createRes.body).toHaveProperty('weekStart');

    // request PDF
    const pdfRes = await request(app)
      .get('/api/shopping-list/pdf')
      .query({ weekStart })
      .set('Authorization', `Bearer ${token}`);

    expect(pdfRes.statusCode).toEqual(200);
    const contentType = pdfRes.headers['content-type'] || pdfRes.header['content-type'];
    expect(contentType).toMatch(/application\/pdf/);
    const contentDisp = pdfRes.headers['content-disposition'] || pdfRes.header['content-disposition'];
    expect(contentDisp).toBeDefined();

    // body should be a non-empty buffer
    expect(pdfRes.body).toBeDefined();
    expect(Buffer.isBuffer(pdfRes.body)).toBe(true);
    expect(pdfRes.body.length).toBeGreaterThan(0);
  });

  it('returns 404 when shopping list is missing', async () => {
    const missingWeek = '2025-01-01';
    const res = await request(app)
      .get('/api/shopping-list/pdf')
      .query({ weekStart: missingWeek })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
  });
});
