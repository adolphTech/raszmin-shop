import mongoose from "mongoose";
import 'dotenv/config'


const connectDB = async()=>{
    try{
        // const conn = await mongoose.connect(process.env.MONGO_URI)
        const username = process.env.DB_USERNAME;
        const password = process.env.DB_PASSWORD;
        const cluster = process.env.DB_CLUSTER;
        const dbname = process.env.DB_NAME;
        console.log(password)
        // "mongodb+srv://<username>:<password>@depls-ady.lmq844j.mongodb.net/?retryWrites=true&w=majority"
    
       const conn = await mongoose.connect(`mongodb+srv://${username}:${password}@depls-ady.lmq844j.mongodb.net/?retryWrites=true&w=majority`);
      
        console.log(`mongoDb connected :${conn.connection.host}`)
    }catch(e){
        console.log(e)
        process.exit(1)
    }
}
export default connectDB;