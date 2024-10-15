import dotenv from "dotenv";
import connectToMongoDB from "./database/index.js";
import { app } from "./app.js";

dotenv.config({
    path : "./.env"
});
const port =8000||process.env.PORT;
connectToMongoDB()
.then(() => {
    app.listen(port, () => {
        app.on("error", (error) => {
            console.log("Error encountered in DB Connection : ", error);
            throw error;
        });
        console.log(`⚙️  Server is running at port : ${port}`);
    });
})
.catch((err) => {
    console.log("MongoDB connection failed! ", err);
});