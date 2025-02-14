import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./db/mongoose.js"
import userRoutes from "./routers/userRoutes.js"
dotenv.config({
    path: "./config/config.env"
})
const app = express()


//PORT
const PORT = process.env.PORT || 8000;

async function startServer() {
    await connectDB.conncet()

    //Body Parser...
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))



    //Routes
    app.use("/api/v1/users", userRoutes)




    app.get("/test", (req, res) => {
        res.send(`Server is up and running at ${new Date(Date.now())}`)
    })
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`The server is running on the PORT:${PORT} and the mode is ${process.env.NODE_ENV}`.blue.inverse)
    })
}

startServer()


