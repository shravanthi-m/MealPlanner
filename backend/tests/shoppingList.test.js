/** integration tests for shopping list routes */

// testing libraries
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

// application to test
import { createApp } from "../routes/index.js";

import mongoose from "mongoose";

// test variables
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

describe("Shopping List Integration Tests", () => {
    // register & login user
    it("registers and logs in a user", async () => {
        const reg = await request(app)
            .post("/api/auth/register")
            .send({ username: "shopuser", email: "shopuser@example.com", password: "secret" });
        expect(reg.statusCode).toEqual(200);

        const login = await request(app)
            .post("/api/auth/login")
            .send({ email: "shopuser@example.com", password: "secret" });
        expect(login.statusCode).toEqual(200);
        expect(login.body).toHaveProperty("token");
        token = login.body.token;
    });

    it("creates foods and a meal plan then generates a shopping list", async () => {
        // create two foods with known ingredients
        const foodAres = await request(app)
            .post("/api/food")
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "chicken soup",
                category: "soup",
                ingredients: [
                    { name: "chicken", quantity: 2, unit: "pcs" },
                    { name: "carrot", quantity: 3, unit: "pcs" }
                ]
            });
        expect(foodAres.statusCode).toEqual(201);
        const foodA = foodAres.body;

        const foodBres = await request(app)
            .post("/api/food")
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "garden salad",
                category: "salad",
                ingredients: [
                    { name: "lettuce", quantity: 1, unit: "head" },
                    { name: "tomato", quantity: 2, unit: "pcs" }
                ]
            });
        expect(foodBres.statusCode).toEqual(201);
        const foodB = foodBres.body;

        // create meal plan referencing the foods
        const weekStart = "2024-12-07";
        const mealPlanRes = await request(app)
            .post("/api/meal-plan")
            .set('Authorization', `Bearer ${token}`)
            .send({
                weekStart,
                days: [
                    { date: "2024-12-07", breakfast: [{ foodId: foodA._id, servings: 2 }], lunch: [], dinner: [], snacks: [] },
                    { date: "2024-12-08", breakfast: [], lunch: [{ foodId: foodB._id, servings: 1 }], dinner: [], snacks: [] }
                ]
            });
        expect(mealPlanRes.statusCode).toEqual(200);

        // generate shopping list
        const genRes = await request(app)
            .post("/api/shopping-list/generate")
            .query({ weekStart })
            .set('Authorization', `Bearer ${token}`);

        expect(genRes.statusCode).toEqual(200);
        expect(genRes.body).toHaveProperty("weekStart");
        expect(new Date(genRes.body.weekStart)).toEqual(new Date(weekStart));
        expect(Array.isArray(genRes.body.items)).toBe(true);

        // verify aggregated quantities
        const items = genRes.body.items;
        const findItem = (name) => items.find(i => i.name.toLowerCase() === name.toLowerCase());

        const chicken = findItem('chicken');
        expect(chicken).toBeDefined();
        expect(chicken.quantity).toEqual(4); // 2 quantity * 2 servings
        expect(chicken.unit).toEqual('pcs');
        expect(chicken.category).toEqual('Poultry');

        const carrot = findItem('carrot');
        expect(carrot).toBeDefined();
        expect(carrot.quantity).toEqual(6); // 3 * 2

        const lettuce = findItem('lettuce');
        expect(lettuce).toBeDefined();
        expect(lettuce.quantity).toEqual(1);

        const tomato = findItem('tomato');
        expect(tomato).toBeDefined();
        expect(tomato.quantity).toEqual(2);

        // GET the shopping list
        const getRes = await request(app)
            .get("/api/shopping-list")
            .query({ weekStart })
            .set('Authorization', `Bearer ${token}`);
        expect(getRes.statusCode).toEqual(200);
        expect(getRes.body).toHaveProperty('items');
        expect(getRes.body.items.length).toBeGreaterThanOrEqual(4);
    });

    it("allows manual creation/upsert of a shopping list", async () => {
        const weekStart = "2024-12-14";
        const items = [
            { name: 'milk', quantity: 2, unit: 'L', category: 'Dairy' }
        ];

        const res = await request(app)
            .post('/api/shopping-list')
            .set('Authorization', `Bearer ${token}`)
            .send({ weekStart, items });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('weekStart');
        expect(new Date(res.body.weekStart)).toEqual(new Date(weekStart));
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items[0].name).toEqual('milk');
    });
});
