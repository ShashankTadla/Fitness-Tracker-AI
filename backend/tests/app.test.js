const request = require("supertest"); //It allows us to send fake HTTP requests (GET, POST, PUT, DELETE) to our Express app.
const app = require("../app"); //Imports your Express application.

describe("Backend API", () => {

  test("GET / should return status 200", async () => {
    const response = await request(app).get("/"); //"Send a GET request to the / route and see what comes back."

    expect(response.statusCode).toBe(200);
  });

  test("GET / should return correct message", async () => {
    const response = await request(app).get("/");

    expect(response.text)
      .toBe("Health & Fitness Tracker Backend is running ✅");
  });

});

// note:
// Use toBe():
// When checking a value

// Use toHaveBeenCalledWith()
// When checking how a mock function was called
