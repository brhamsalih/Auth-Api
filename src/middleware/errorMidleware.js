import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const errorMiddleware = (err, req, res, next) => {
  console.log("Error Middleware");
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
export default errorMiddleware;
