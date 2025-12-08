/** integrations tests for express routes */

// testing libraries
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

// application to test
import { createApp } from "../routes/index.js";
import mongoose from "mongoose";

// app instance
let app;

// TODO: create a mock database for testing
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

async function clearMockDB() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

beforeAll(async () => {
    app = createApp();
    await setupMockDB();
});

afterAll(async () => {
    await teardownMockDB();
});

// TODO: Test Login/Registration
describe("Test Login/Registration", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                email: "testuser@example.com",
                password: "testpassword"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "User registered successfully");
    });

    it("should not register a user with existing email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser2",
                email: "testuser@example.com",
                password: "testpassword2"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("message", "Email already exists");
    });

    it("should login an existing user", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "testuser@example.com",
                password: "testpassword"
            });
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
    });
});

// TODO: Test Authenticated Routes (Meal Plans, Shopping Lists, Food Items, PDF Generation)

// TODO: Meal Plan Routes

// TODO: Shopping List Routes

// TODO: Food Item Routes

// TODO: PDF Generation Routes