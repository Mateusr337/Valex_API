import express, { json } from "express";
import "express-async-errors";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import * as errors from "./utils/errorFunctions.js";


import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(json());

app.use(router);
router.use(errors.errorHandlingMiddleware);


app.listen(process.env.PORT, () => {
    console.log(`running on port ${process.env.PORT}`);
});