// Import the modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./MongoDb.js";
import boardRoutes from "./Routes/BoardRoutes.js";
import taskRoutes from "./Routes/TaskRoutes.js";

// Express routes
dotenv.config();
connectDatabase();
const app = express();
app.use(cors());
app.use(express.json());

// Var
const PORT = process.env.PORT || 1000;

// API

app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);

app.get('/',(req,res) => {
    res.send("This is a Atom-Kanban API")
})

// Listen the server
app.listen(PORT, console.log(`server run in port ${PORT}`));
