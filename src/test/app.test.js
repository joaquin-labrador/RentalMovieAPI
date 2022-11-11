const { expect } = require("chai");
const { response } = require("express");
const assert = require("chai").assert;
const bcrypt = require("bcrypt");
const request = require("supertest");
const { app } = require("../app");
const { PrismaClient } = require("@prisma/client");
const { describe } = require("mocha");
const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.user.deleteMany();
});

beforeEach(async () => {
  await prisma.user.create({
    data: {
      email: "test@gmail.com",
      dni: "12345678",
      phone: "123456789",
      isAdmin: true,
      isValidate: true,
      password: "$2a$12$W9.m1i0NnA5BWVIT4RYp5.FyanRjmb66oU.gOhFm0OieDZFPUEN2y",
    },
  });
});

describe("GET /api/movies", () => {
  it("Should return status 200", (done) => {
    request(app).get("/api/movies").expect(200).end(done);
  });

  it("Should return json", (done) => {
    request(app)
      .get("/api/movies")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done);
  });

  it("Should return movies", (done) => {
    request(app)
      .get("/api/movies")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body);
        assert.isArray(response._body);
        response._body.forEach((movie) =>
          assert.containsAllKeys(movie, [
            "title",
            "description",
            "director",
            "producer",
            "release_date",
            "running_time",
            "rt_score",
          ])
        );
      })
      .then(() => done(), done); // soluciona el problema de  Error: Timeout of 2000ms exceeded.
  });
});

describe("GET /api/movies/:id", () => {
  it("Get Movie Details By ID", (done) => {
    request(app)
      .get("/api/movies/58611129-2dbc-4a81-a72f-77ddfc1b1b49")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body, [
          "title",
          "description",
          "director",
          "producer",
          "release_date",
          "running_time",
          "rt_score",
        ]);
      })
      .then(() => done(), done);
  });
});

it("should return 201 when you singup", (done) => {
  request(app)
    .post("/api/auth/signup")
    .send({
      email: "testTets@gmail.com",
      password: "12345678TestTets",
      repassword: "12345678TestTets",
      dni: "dsfwer2345r",
      phone: "3242342",
    })
    .expect(201)
    .end((err, response) => {
      if (err) return done(err);
      done();
    });
});
describe("POST /api/auth/login", () => {
  it("should return status", (done) => {
    request(app)
      .post("/api/auth/login")
      .send({ email: "test@gmail.com", password: "12345678Test" })
      .expect(200)
      .end((err, response) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /api/auth/logout", () => {
  "POST /api/auth/logout",
    () => {
      it("should return status 200", (done) => {
        request(app).post("/api/auth/logout").expect(200).end(done);
      });
    };
});

it("should return status 200 get all rents", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .get("/api/rent")
        .set("Cookie",  [`token=${response._body.token}`])
        .expect(200)
        .then((response) => {
          assert.isNotEmpty(response._body); //no esta vacio
          assert.isNotArray(response._body);
          assert.containsAllKeys(response._body, [
            "title",
            "description",
            "director",
            "producer",
            "release_date",
            "running_time",
            "rt_score",
          ]);
        })
        .then(() => done(), done);
    });
});

it("should return status 200 get rent by user id", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .get("/api/rent/user")
        .set("Cookie",  [`token=${response._body.token}`])
        .expect(200)
        .then((response) => {
          assert.isNotEmpty(response._body); //no esta vacio
          assert.isNotArray(response._body);
          assert.containsAllKeys(response._body, [
            "title",
            "description",
            "director",
            "producer",
            "release_date",
            "running_time",
            "rt_score",
          ]);
        })
        .then(() => done(), done);
    });
});

it("should return status 200 get rent by id", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .get("/api/rent/1")
        .set("Cookie",  [`token=${response._body.token}`])
        .expect(200)
        .then((response) => {
          assert.isNotEmpty(response._body); //no esta vacio
          assert.isNotArray(response._body);
          assert.containsAllKeys(response._body, [
            "id",
            "id_user",
            "id_movie",
            "rent_date",
            "return_date",
            "user_return_date",
          ]);
        })
        .then(() => done(), done);
    });
});

it("should return 201 status when you add a rent", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .post("/api/rent")
        .set("Cookie",  [`token=${response._body.token}`])
        .send({
          movie_id: "112c1e67-726f-40b1-ac17-6974127bb9b9",
        })
        .expect(201)
        .end((err, response) => {
          if (err) return done(err);
          done();
        });
    });
});

it("should return 200 status when you return a movie", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .put("/api/rent/1")
        .set("Cookie",  [`token=${response._body.token}`])
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          done();
        });
    });
});

it("should return 200 status when you delete a rent", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .delete("/api/rent/1")
        .set("Cookie",  [`token=${response._body.token}`])
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          done();
        });
    });
});

it("should return 201 status add favourite movie", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .post("/api/favourite")
        .set("Cookie",  [`token=${response._body.token}`])
        .send({
          film_id: "112c1e67-726f-40b1-ac17-6974127bb9b9",
          review: "test review",
        })
        .expect(201)
        .end((err, response) => {
          if (err) return done(err);
          done();
        });
    });
});

it("should return 200 status get all favourite movies", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .get("/api/favourite")
        .set("Cookie",  [`token=${response._body.token}`])
        .expect(201)
        .then((response) => {
          assert.isNotEmpty(response._body); //no esta vacio
          assert.isNotArray(response._body);
          assert.containsAllKeys(response._body, [
            "id",
            "id_user",
            "id_movie",
            "review",
          ]);
        })
        .end((err, response) => {
          if (err) return done(err);
          done();
        });
    });
});

it("should return 200 status get favourite movie by id", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .get("/api/favourite/1")
        .set("Cookie",  [`token=${response._body.token}`])
        .expect(200)
        .then((response) => {
          assert.isNotEmpty(response._body); //no esta vacio
          assert.isNotArray(response._body);
          assert.containsAllKeys(response._body, [
            "id",
            "id_user",
            "id_movie",
            "review",
          ]);
        })
        .end((err, response) => {
          if (err) return done(err);
          done();
        });
    });
});

it("should return 200 status when you delete a favourite movie", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .delete("/api/favourite/1")
        .set("Cookie",  [`token=${response._body.token}`])
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          done();
        });
    });
});

it("should return 200 status when you update a review of a favourite movie", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "12345678Test" })
    .expect(200)
    .then((response) => {
      request(app)
        .put("/api/favourite/1")
        .set("Cookie",  [`token=${response._body.token}`])
        .send({
          id: 1,
          review: "test review",
        })
        .expect(200)
        .end((err, response) => {
          if (err) return done(err);
          done();
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
