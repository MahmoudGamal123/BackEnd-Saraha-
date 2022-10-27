import dotenv from 'dotenv'
dotenv.config()
import * as indexRouter from './modules/index.router.js'
import express from 'express'
import connectDB from './DB/connection.js'
const app = express()
const port = 3000
const BaseURl = process.env.BASEURL

app.use(express.json())
app.use(`${BaseURl}/Auth`, indexRouter.authRouter)
app.use(`${BaseURl}/user`, indexRouter.userRouter)
app.use(`${BaseURl}/message`, indexRouter.messageRouter)

app.use('*', (req, res) => {
    const url  = `${req.protocol}://${req.headers.host} ${process.env.BASEURL}/auth/confirmEmail/12545646547897`
    console.log(req.protocol);
    console.log(req.headers.host);
    res.json({ message: "In-valid Routing" , url})
})

connectDB()
app.listen(port, () => {
    console.log(`Server is running on port ....... ${port}`);
})