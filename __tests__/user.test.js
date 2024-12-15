import request from "supertest";
import app from "../src/app.js";

jest.setTimeout(70 * 1000);

const adminData = {
  email: "admin@gmail.com",
  password: "test123",
};

describe("User tests for admin roles", () => {
  // Admin login to test his endpoints;
  let adminToken;
  beforeAll(async () => {
    const res = await request(app).post("/api/v1/auth/login").send(adminData);
    adminToken = res.body.token;
  });

  describe("GET /api/v1/users/", () => {
    it("Should return 200 and success", async () => {
      const res = await request(app)
        .get("/api/v1/users/")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toMatch("success");
      expect(res.body).toHaveProperty("data");
    });
  });

  describe("GET /api/v1/users/", () => {
    it("Should return 401 and success", async () => {
      const res = await request(app).get("/api/v1/users/");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/v1/users/:id", () => {
    it("Should return 200 and success", async () => {
      const response = await request(app)
        .get("/api/v1/users/67597714f6d4b9efdd3ac51e")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toMatch("success");
    });
  });

  describe("GET /api/v1/users/:id", () => {
    it("Should return 404", async () => {
      const response = await request(app)
        .get("/api/v1/users/675ad685d7e2909014431bcf")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/v1/users/:id", () => {
    it("Should return 404", async () => {
      const res = await request(app)
        .delete("/api/v1/users/675ad685d7e2909014431bcf")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/v1/users/:id", () => {
    it("Should return 204", async () => {
      const res = await request(app)
        .delete("/api/v1/users/675ad56542cb96be101a3fa7")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204);
    });
  });
});
