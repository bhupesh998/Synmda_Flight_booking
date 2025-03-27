const { describe, it } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); // Adjust the path based on your actual Express app file

chai.use(chaiHttp);
const { expect } = chai; // Use expect instead of should for better compatibility

describe("Flight Booking API Tests", function () {
    
    describe("GET /getJourneyDetails", function () {
        it("should return journey details for a valid email", function (done) {
            chai.request(app)
                .get("/getJoureyDetails")
                .send({ email: "test@example.com" })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.have.property("status").equal(true);
                    expect(res.body).to.have.property("result").that.is.an("array");
                    done();
                });
        });

        it("should return 417 for missing email", function (done) {
            chai.request(app)
                .get("/getJoureyDetails")
                .send({})
                .end(function (err, res) {
                    expect(res).to.have.status(417);
                    expect(res.body).to.have.property("message").equal("Please Provide Valid Inputs");
                    done();
                });
        });
    });

    describe("GET /getSeatsBooked", function () {
        it("should return booked seats for a valid flight number", function (done) {
            chai.request(app)
                .get("/getSeatsBooked")
                .send({ flightNumber: "FL123" })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.have.property("status").equal(true);
                    expect(res.body).to.have.property("result").that.is.an("array");
                    done();
                });
        });

        it("should return 417 for missing flight number", function (done) {
            chai.request(app)
                .get("/getSeatsBooked")
                .send({})
                .end(function (err, res) {
                    expect(res).to.have.status(417);
                    expect(res.body).to.have.property("message").equal("Please Provide Valid Inputs");
                    done();
                });
        });
    });
});
