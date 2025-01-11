import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


// Request limiters 
app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public"))
app.use(cookieParser())

// Routes import

// import userRouter from './routes/user.routes';
// import projectRouter from './routes/project.routes';
// import taskRouter from './routes/task.routes';

// // Routes declaration

// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/project", projectRouter);
// app.use("/api/v1/task", taskRouter);


export { app }