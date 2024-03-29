import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app =  express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//this mean swe are accepting Json data (it is for data which comes from form)
app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))
// The express.urlencoded() middleware in Express.js is used to parse incoming request bodies with URL-encoded payloads. It's a middleware specifically designed to handle form submissions and allows Express to interpret data sent from HTML forms submitted via the POST method.

app.use(express.static("public"))
// The express.static() middleware in Express.js is used to serve static files, such as HTML, CSS, images, JavaScript files, and other assets, from a specific directory to the client.

app.use(cookieParser());

//routes import adn rote declaration for user
import userRouter from './routes/user.routes.js'
app.use("/api/v1/users",userRouter)


//routes declaratio for videos
import videoRouter from './routes/video.routes.js'
app.use("/api/v1/videos",videoRouter)


import commentRouter from './routes/comment.routes.js'
app.use("/api/v1/comments", commentRouter)


import tweetRouter from './routes/tweet.routes.js'
app.use("/api/v1/tweets", tweetRouter)

import likeRouter from './routes/like.routes.js'
app.use("/api/v1/likes", likeRouter)

import playlistRouter from './routes/playlist.routes.js'
app.use("/api/v1/playlist", playlistRouter)

import subscriptionRouter from './routes/subscription.routes.js'
app.use("/api/v1/subscription", subscriptionRouter)


import dashBoardRouter from './routes/dashboard.routes.js'
app.use("/api/v1/dash", dashBoardRouter)

import healthcheckRouter from './routes/./healthcheck.routes.js'
app.use("/api/v1/health", healthcheckRouter)



export {app}

// Middlewares execute between the incoming request and the corresponding route handler, allowing you to perform operations like logging, authentication, data validation, request parsing, and more. This helps preprocess incoming data before it reaches the route handler