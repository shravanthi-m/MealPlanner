/** integrations tests for express routes */

// testing libraries
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

// application to test
import { createApp } from "../routes/index.js";

import mongoose from "mongoose";

// app instance
let app;

// jwt token
let token;

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

describe("Integration Tests for all routes", () => {
    // Test login and registration routes
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
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("token");
            token = res.body.token; // save token for authenticated routes
        });
    });
    
    describe("Test Food Item Routes", () => {
        let newFood;
        let ingredients;

        // try adding existing food item from API to user database
        it("should not create duplicate food items", async () => {            
            // query some food
            let res = await request(app)
                .get("/api/food/search")
                .query({ query: "chicken" })
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.api).toBeInstanceOf(Array);

            // get first food item from results
            newFood = res.body.api[0];

            // parse ingredients
            ingredients = newFood.ingredients.map(ing => ({
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit
            }));

            // add food 
            res = await request(app)
                .post("/api/food/save")
                .send({
                    name: newFood.name,
                    category: newFood.category,
                    ingredients: ingredients
                })
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(201);

            // try adding same food again
             res = await request(app)
                .post("/api/food/save")
                .send({
                    name: newFood.name,
                    category: newFood.category,
                })
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("message", "Food already exists");

            // verify new food item exists in user database
            res = await request(app)
                .get("/api/food")
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            const foodNames = res.body.map(f => f.name);
            expect(foodNames).toContain(newFood.name);
        });

        // try adding new food item from API to user database
        it("should create new food item", async () => {
            // create some food
            let res = await request(app)
                .post("/api/food")
                .send({
                    name: "cake",
                    category: "dessert"
                })
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("name", "cake");

            // verify new food item exists in user database
            res = await request(app)
                .get("/api/food")
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            const foodNames = res.body.map(f => f.name);
            expect(foodNames).toContain("cake");
            expect(foodNames).toContain(newFood.name);
        });
    });

    // TODO: Meal Plan Routes
    describe("Test Meal Plan Routes", () => {
        // Add tests for creating and retrieving meal plans
    });

    // TODO: Shopping List Routes
    describe("Test Shopping List Routes", () => {
        // Add tests for creating and retrieving shopping lists
    });

    // TODO: PDF Generation Routes
    describe("Test PDF Generation Routes", () => {
        // Add tests for PDF generation
    });
})