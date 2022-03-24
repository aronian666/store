import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Data validating

const hash = "5214b8178ba6bee6f9da60c2fbe5b3a69010fb192ad6901fcead3848ed0830f8f741424169e8c5a21fa22c97b97746fef965f8a2ab1549008125bb5629c8eb029d7f61a3e36ddf70607efb18a18082ac66a9a9b174378ce81402041331da1297"
const validateString = {
  type: String,
  required: true
}
const userSchema = new mongoose.Schema({
  name: validateString,
  email: { ...validateString, unique: [true, "Este correo ya esta registrado."], lowercase: true },
  password: { ...validateString, minlength: 6 },
  role: {
    type: Number,
    default: 3
  },
  code: String,
})
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10)
  next()
})
// Model methods
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this.id }, hash, { expiresIn: 30 * 24 * 60 * 60 })
}

// Other config
const User = mongoose.model("User", userSchema)
User.auth = async function (token) {
  if (!token) return
  try {
    const decode = jwt.verify(token, hash)
    const user = await User.findById(decode.id)
    return user
  }
  catch {
    return null
  }

}
export default User