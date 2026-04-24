import express from "express"
import { ENV } from "./lib/env.js";

const app = express();


app.get('/',(req,res)=>{
  res.status(200).json({message:"omala deii"})
})

app.listen(ENV.PORT,()=>console.log(`http://localhost:${ENV.PORT}`))