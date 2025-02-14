import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add a username"],
        unqiue: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        trim: true,
        select: false,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain the word Password")
            }
        },
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})


//decode the password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    const passwordMatch = await bcrypt.compare(enteredPassword, this.password)
    return passwordMatch
}

//generate token
UserSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })

    //Add it to the end of the list
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}


//excluding user once it's created
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject["password"]
    return userObject
}

//Encrypt the password
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


UserSchema.statics.findByCredentials = async function (email, password) {
    const user = User.findOne(email)
    if (!user) {
        console.log("User Could not be found!")
    }
    const isMatch = await bcrypt.compare(password, this.password)
    if (!isMatch) {
        console.log("Passwords Do not Match!")
    }


    return user
}


const User = mongoose.model("User", UserSchema)

export default User