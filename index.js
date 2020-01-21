import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import format from "pg-format";
import db from "./config/db";

const port = process.env.PORT || 5000;

const app = express();

app.get("/create-table", async (req, res, next) => {
  const createTableQuery =
    "CREATE TABLE dailyTrades (open FLOAT, high FLOAT, low FLOAT, close FLOAT, volume int, dividend_amount FLOAT, split_coefficient FLOAT, date DATE)";

  try {
    await db.query(createTableQuery, (err, response) => {
      if (err) {
        console.log({ err });
        return next(err);
      }

      console.log({ response });
      res.send({ status: 200, response: "created new table in db!" });
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/fetch-data", async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&outputsize=full&apikey=${process.env.STOCK_API_KEY}`
    );
    const results = data["Time Series (Daily)"];

    const dataSet = [];

    for (const key in results) {
      const {
        "1. open": open,
        "2. high": high,
        "3. low": low,
        "4. close": close,
        "5. adjusted close": adjusted_close,
        "6. volume": volume,
        "7. dividend amount": dividend_amount,
        "8. split coefficient": split_coefficient
      } = results[key];

      const item = [
        open * 1,
        high * 1,
        low * 1,
        close * 1,
        volume,
        dividend_amount * 1,
        split_coefficient * 1,
        key
      ];
      dataSet.push(item);
    }

    const query = format(
      "INSERT INTO dailyTrades (open, high, low, close, volume, dividend_amount, split_coefficient, date) VALUES %L",
      dataSet
    );

    const { rows } = await db.query(query);

    res.send({ status: 200, response: rows });
  } catch (e) {
    console.log(e);
  }
});

app.get("/find-table", async (req, res, next) => {
  try {
    const q = "SELECT * FROM dailyTrades";
    await db.query(q, (err, response) => {
      if (err) throw err;
      console.log({ response });
      res.send({ response: response.rows });
    });
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => console.log(`Ahoy listening on port ${port} 🐱‍🐉`));
