import express from "express";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import {register} from "./controllers/auth.js"
import { verifyToken } from "./middleware/auth.js";
import {createPost} from "./controllers/posts.js"
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users,posts} from "./data/index.js"

// Configs
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//File Storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// Whenever someone uploads a file to your website it will be saved to the destination folder

const upload = multer({storage}) //This upload variable will be used each time you want to save an uploaded file


app.post("/auth/register", upload.single("picture"), register)
app.post("/routes",verifyToken,upload.single("picture"), createPost)

//The reason we have that verifyToken middleware is because this should be only allowed for users that have been verified by our authentication

app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/posts",postRoutes)


//Setting up mongoose

const port = process.env.PORT || 6001

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, () => console.log("Server Started"))

    // User.insertMany(users)
    // Post.insertMany(posts)
}).catch((err) => console.log(err))