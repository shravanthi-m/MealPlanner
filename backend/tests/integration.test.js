/** integrations tests for express routes */

// testing libraries
import request from "supertest";

// application to test
import { start } from "../server.js";

// TODO: create a mock database for testing
async function setupMockDB() {
    // Implement mock database setup
}

// TODO: Test Login/Registration
describe("Test Login/Registration", () => {
    it("should register a new user", async () => {
        const app = await start();
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                email: "testuser@example.com",
                password: "testpassword"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
    });

    it("should not register a user with existing email", async () => {
        const app = await start();
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
        const app = await start();
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "testuser@example.com",
                password: "testpassword"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
    });
});

// TODO: Test Authenticated Routes (Meal Plans, Shopping Lists, Food Items, PDF Generation)

// TODO: Meal Plan Routes

// TODO: Shopping List Routes

// TODO: Food Item Routes

// TODO: PDF Generation Routes