const router = require("express").Router();
const { MongoClient } = require("mongodb");
const { getSeats, putPurchase } = require("./handlers");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// Code that is generating the seats.
// ----------------------------------
// const seats = {};
// const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
// for (let r = 0; r < row.length; r++) {
//   for (let s = 1; s < 13; s++) {
//     seats[`${row[r]}-${s}`] = {
//       _id: `${row[r]}-${s}`,
//       price: 225,
//       isBooked: false,
//     };
//   }
// }

// let sendSeats = Object.values(seats);
// const batchImport = async () => {
//   try {
//     const client = await MongoClient(MONGO_URI, options);
//     await client.connect();
//     const db = client.db("exercise_1");
//     const r = await db.collection("seats").insertMany(sendSeats);
//     assert.equal(1, r.insertedCount);
//     client.close();

//     console.log("ale roma");
//   } catch (err) {
//     console.log(err);
//   }
// };

// batchImport();
// ----------------------------------
//////// HELPERS
const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);

    const seatId = `${getRowName(row)}-${seat + 1}`;

    bookedSeats[seatId] = true;

    num--;
  }

  return bookedSeats;
};

let state;

// router.get("/api/seat-availability", async (req, res) => {
//   // if (!state) {
//   //   state = {
//   //     bookedSeats: randomlyBookSeats(30),
//   //   };
//   // }

//   return res.json({
//     seats: getSeats(),
//     bookedSeats: state.bookedSeats,
//     numOfRows: 8,
//     seatsPerRow: 12,
//   });
// });

router.get("/api/seat-availability", getSeats);

let lastBookingAttemptSucceeded = false;

router.put("/api/book-seat", putPurchase);

module.exports = router;
