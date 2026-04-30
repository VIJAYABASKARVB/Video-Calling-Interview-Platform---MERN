import {ErrorFromResponse, StreamChat} from "stream-chat";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey ||!apiSecret){
  console.error("Missing Stream API key or API Secret");
}

export const chatClient = StreamChat.getInstance(apiKey,apiSecret);


export const upsertStreamUsers = async (userData) => {
  try{
    await chatClient.upsertUser(userData);
    console.log("Stream user upserted successfully:",userData);
  }catch(error){
    console.error("Error  in upsertStreamUsers:",error);
  }
}

export const deleteStreamUser = async(userId) => {
  try{
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully:",userId);
  }catch(error){
    console.error("Error deleteStreamUser:",error);
  }
}