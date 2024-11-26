import cookieparser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import { apiRouter } from "./routes/api.route";
import { errorHandler } from "./middlewares/errorHandler";
import { config } from "dotenv";
config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieparser());
app.use(errorHandler);

app.use("/api/v1", apiRouter);

app.get("/", (_req, res) => {
  res.send(`<h1>Welcome</h1>
    <p>You have hit the ADHD endpoint for Project 101</p>`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});