import mongoose from 'mongoose'

const connectDb = async()=>{
    
    try {
        const connectionInstance = await mongoose.connect
        (`${process.env.MONGODB_URI}`)
    
        console.log(`\n MongoDb connected !! DB Host : 
        ${connectionInstance.connection.host}`);
    } catch (error) {

        console.log("MongoDb connection Error :" , error)
        process.exit(1)

    }
}

export default connectDb