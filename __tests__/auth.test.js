import request from "supertest";
import app from "../src/app.js";

jest.setTimeout(70 * 1000);

const userCredentials = {
  email: "hema@gmail.com",
  password: "test123",
};
const fakeUserCredentials = {
  email: "hema@gmail.com",
  password: "test121",
};

const unverifiedUser = { email: "hmmda@gmail.com", password: "123456798" };

const signUpDate = {
  name: "Ebrahim El-Sayed",
  email: "hmmda@gmail.com",
  password: "123456798",
};

describe("POST /auth", () => {
  describe("POST /auth/login", () => {
    it("should return 200 and token as a response body property", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(userCredentials);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return 401 ", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(fakeUserCredentials);
      expect(res.statusCode).toBe(401);
    });

    it("Should return 403", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(unverifiedUser);
      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /auth/signup", () => {
    it("Should return 201 and a message property", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send(signUpDate);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message");
    });
  });
});
