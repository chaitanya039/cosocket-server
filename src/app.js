import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(cors({
    // This specifies the origin(s) that are allowed to access the resources on your server.
    origin : process.env.CORS_ORIGIN,
    // Credentials allows client to send and recieve cookies, headers to a server.
    credentials : true
}));

app.use(express.json({ limit : "16kb" }));
app.use(express.urlencoded({ extended : true, limit : "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.route.js";
import gptRouter from "./routes/gpt.route.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import manufacturerRouter from "./routes/manufacturer.route.js";

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/gpt", gptRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/manufacturer", manufacturerRouter);
app

export { app };