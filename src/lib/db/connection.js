import mongoose from 'mongoose'

async function connection() {
  if (mongoose.connection.readyState === 1) return true
  //const DATABASE = "mongodb+srv://aronian666:miqevid21@cluster0.h2xqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  const DATABASE = 'mongodb://localhost:27017/glass'
  try {
    await mongoose.connect(DATABASE)
    console.log("i've connected")
    return true
  } catch {
    return false
  }
}

export default connection
