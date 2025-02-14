import mongoose from "mongoose";

class MongoClient {
    async conncet() {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URL)
            console.log(`MONGODB Connected Successfully! ${conn.connection.host} `.green.underline.bold)
        } catch (error) {
            console.error(err?.message)
            process.exit(1)
        }
    }
}

const connectDB = new MongoClient()
Object.freeze(connectDB)

export default connectDB