import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const port = process.env.PORT || 5000;

const app = express();

app.listen(port, () => console.log(`Ahoy listening on port ${port} 🐱‍🐉`));
