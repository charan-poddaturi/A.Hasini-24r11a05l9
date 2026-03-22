import request from "supertest";
import app from "../src/app";
import { connectDb, disconnectDb } from "../src/db";

jest.setTimeout(60000); // allow up to 60s for in-memory MongoDB to start

beforeAll(async () => {
  await connectDb();
});

afterAll(async () => {
  await disconnectDb();
});

describe("SafeHub API", () => {
  it("should respond at root", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "SafeHub API is running");
  });
});
