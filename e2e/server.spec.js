const request = require("supertest");
const createApp = require("../createApp");
const dbConnection = require("../config/dbConnection");
const mongoose = require("mongoose");

describe("server.js", () => {
  it("shold return product", async () => {
    dbConnection();

    const app = createApp();
    const res = await request(app).get("/api/v1/categories/");
    expect(res.statusCode).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
