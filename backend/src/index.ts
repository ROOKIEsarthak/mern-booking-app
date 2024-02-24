import { app } from "./app";

import connectDb from "./db";
const port = process.env.PORT || 8000

connectDb().then(()=>{

    try {

        app.listen(port,()=>{
            console.log(`server running on port : ${port}`);
            
        })
        
    } catch (error) {
        console.error("Error: ",error)
        throw error;
        
    }

})
.catch((err)=>{
    console.log("MOngo Db connection failed !!! ",err);
    
})

