import mongoose from 'mongoose'
import { dev } from '$app/env';
async function connection() {
  if (mongoose.connection.readyState === 1) return true
  let DATABASE = "mongodb+srv://aronian666:miqevid21@cluster0.h2xqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  //if (dev) DATABASE = 'mongodb://localhost:27017/glass'
  try {
    await mongoose.connect(DATABASE)
    console.log("i've connected")
    return true
  } catch {
    return false
  }
}

export default connection
