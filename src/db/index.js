import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async()=>{
    try {
        const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("Mongo Db FAILED",error )
        process.exit(1)
    }
}

export default connectDB
// our application is running on  a new process and the "procces" here is a refrence to that

//ASSIGNMENT _console log the connectionInstace it can be knowledgable