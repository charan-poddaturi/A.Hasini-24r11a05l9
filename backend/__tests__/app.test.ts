import request from "supertest";
import app from "../src/app";

describe("SafeHub API", () => {
  it("should respond at root", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "SafeHub API is running");
  });
});
