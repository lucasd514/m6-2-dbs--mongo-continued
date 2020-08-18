"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");

  const data = await db.collection("seats").find().toArray();
  let seats = {};
  data.forEach((seat) => {
    // { _id: 'H-4', price: 225, isBooked: false }
    seats[seat._id] = seat;
  });
  console.log(seats);
  client.close();
  res.status(200).json({ seats: seats, numOfRows: 8, seatsPerRow: 12 });
  return seats;
};

const putPurchase = async (req, res) => {
  const _id = req.body.seatId;
  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db("exercise_1");
    const newValues = {
      $set: { isBooked: true, user: req.body.fullName, email: req.body.email },
    };
    if (req.body === undefined) {
      throw new Error("Missing info");
    }
    console.log("SEATID", _id);
    const greetings = await db
      .collection("seats")
      .updateOne({ _id }, newValues);
    // assert.equal(1, greetings.matchedCount);
    // assert.equal(1, greetings.modifiedCount);
    res.status(200).json({ status: 200, data: { _id } });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, data: { ...req.body }, message: err.message });
  }
  client.close();
};
module.exports = { getSeats, putPurchase };
