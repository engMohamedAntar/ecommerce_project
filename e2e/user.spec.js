const request = require("supertest");
const createApp = require("../createApp");
const dbConnection = require("../config/dbConnection");
const mongoose = require("mongoose");

beforeAll(async () => {
  await dbConnection();
});

it("getMe", async () => {
  let app = createApp();

  //login with a user
  const res = await request(app).post("/api/v1/auth/login").send({
    email: "marwa@gmail.com",
    password: "pass123",
  });
  const token = res.body.token;

  expect(res.status).toBe(200);
  expect(res.body.data).toBeDefined();
  expect(res.body.token).toBeDefined();

  //call the getMe route
  const response = await request(app)
    .get("/api/v1/users/getme")
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body.data).toBeDefined();
  console.log(response.body.data);
  expect(response.body.data.email).toBeDefined();
  expect(response.body.data.password).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});
