import express, { json } from "express";
import "express-async-errors";
import cors from 'cors';
import dotenv from 'dotenv';
import * as errors from "./utils/errorFunctions.js";
dotenv.config();
import router from "./routes/index.js";
var app = express();
app.use(cors());
app.use(json());
app.use(router);
router.use(errors.errorHandlingMiddleware);
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log("running on port ".concat(PORT));
});
