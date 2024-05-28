import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import errorMiddleware from "./src/middleware/errorMidleware.js";
import connectDB from "./src/config/db.js";
import router from "./src/routers/index.js";

const app = express();

dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8080;

//log requests
app.use(morgan("tiny"));
app.use(express.json());
app.use(errorMiddleware);

connectDB().then(() => {
  // Start the server after successfully connecting to the database
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
app.use("/", router());
