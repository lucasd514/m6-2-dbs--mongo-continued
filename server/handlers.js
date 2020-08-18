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

module.exports = { getSeats };
