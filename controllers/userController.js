import User from "../models/User.js"


//@desc     create a user
//@route
//@access
export const createUser = async (req, res, next) => {
    const { username, email, password } = req.body

    try {
        const foundUser = await User.findOne({ username })
        if (foundUser) {
            return res.status(400).json({
                success: false,
                message: "This user name is already taken!"
            })
        }
        const foundUseEmail = await User.findOne({ email })
        if (foundUseEmail) {
            return res.status(400).json({
                success: false,
                message: `This user email already taken`
            })
        }
        let newUser = await User.create({ email, password, username })
        newUser = newUser.toJSON()
        res.status(201).json({
            success: true,
            data: newUser
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: error
        })
    }
}


//@desc     get all the user
//@route     /api/v1/users/all
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            data: {}
        })
    }
}


//@desc     login
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        //This part should be delagated to the exception filter!
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please include password and email'
            })
        }
        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalud Credentials"
            })
        }

        const pwMatch = await user.matchPassword(password)
        if (!pwMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        res.status(200).json({
            success: true,
            token: user.generateAuthToken()
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            success: false,
            message: error
        })
    }
}