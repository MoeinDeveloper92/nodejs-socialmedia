import express from "express"
import { createUser, getUsers, loginUser } from "../controllers/userController.js"

const router = express.Router()

router.route("/register")
    .post(createUser)
router.route("/all").get(getUsers)
router.route("/login").post(loginUser)


export default router