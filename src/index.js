import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import _ from "colors";
import { connectD } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`.green);
    connectD();
});
