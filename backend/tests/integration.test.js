/** integrations tests for express routes */

// testing libraries
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

// application to test
import { createApp } from "../routes/index.js";

import mongoose from "mongoose";

// test variables
// app instance
let app;
// jwt token
let token;
let newFood;
let ingredients;

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

    describe("Test Meal Plan Routes", () => {
        // Add tests for creating and retrieving meal plans

        it("should create or update a meal plan", async () => {
            // get foods from database
            const foodsRes = await request(app)
                .get("/api/food")
                .set('Authorization', `Bearer ${token}`);

            const foods = foodsRes.body;

            // create meal plan
            const res = await request(app)
                .post("/api/meal-plan")
                .send({
                    weekStart: "2024-12-07",
                    days: [ 
                        { date: "2024-12-07", breakfast: [{ foodId: foods[0]._id, servings: 2 }], lunch: [], dinner: [], snacks: [] },
                        { date: "2024-12-08", breakfast: [], lunch: [{ foodId: foods[1]._id }], dinner: [], snacks: [] }
                    ]
                })
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("weekStart");
            expect(new Date(res.body.weekStart)).toEqual(new Date("2024-12-07"));

            // verify meal plan saved
            const getRes = await request(app)
                .get("/api/meal-plan")
                .query({ weekStart: "2024-12-07" })
                .set('Authorization', `Bearer ${token}`);
            expect(getRes.statusCode).toEqual(200);
            expect(getRes.body).toHaveProperty("days");
            expect(getRes.body.days.length).toEqual(2);
            expect(new Date(getRes.body.days[0].date)).toEqual(new Date("2024-12-07"));
            expect(new Date(getRes.body.days[1].date)).toEqual(new Date("2024-12-08"));
            expect(getRes.body.days[0].breakfast[0].servings).toEqual(2);
            expect(getRes.body.days[1].lunch[0].servings).toEqual(1); // default servings
            expect(getRes.body.days[0].breakfast[0].foodId).toEqual(foods[0]._id.toString());
            expect(getRes.body.days[1].lunch[0].foodId).toEqual(foods[1]._id.toString());

            // update meal plan
            const updateRes = await request(app)
                .post("/api/meal-plan")
                .send({
                    weekStart: "2024-12-07",
                    days: [
                        { date: "2024-12-07", breakfast: [{ foodId: foods[0]._id, servings: 1 }], lunch: [], dinner: [], snacks: [] },
                        { date: "2024-12-08", breakfast: [{ foodId: foods[1]._id, servings: 3 }], lunch: [], dinner: [], snacks: [] }
                    ]
                })
                .set('Authorization', `Bearer ${token}`);
            expect(updateRes.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("weekStart");
            expect(new Date(res.body.weekStart)).toEqual(new Date("2024-12-07"));

            // verify meal plan updated
            const updateGetRes = await request(app)
                .get("/api/meal-plan")
                .query({ weekStart: "2024-12-07" })
                .set('Authorization', `Bearer ${token}`);
            expect(updateGetRes.body.days[0].breakfast[0].servings).toEqual(1);
            expect(updateGetRes.body.days[1].breakfast[0].servings).toEqual(3);
            expect(updateGetRes.body.days[0].breakfast[0].foodId).toEqual(foods[0]._id.toString());
            expect(updateGetRes.body.days[1].breakfast[0].foodId).toEqual(foods[1]._id.toString());
            expect(updateGetRes.body.days[0].lunch.length).toEqual(0);
        });
    });
})