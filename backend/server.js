const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const familyRoutes = require("./routes/familyRoutes");
connectDB();

const app = express();


const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://walmart-sparkathon-git-main-jatin-guptas-projects-cd954d5c.vercel.app",
  "https://walmart-sparkathon.vercel.app", // production domain if deployed
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user/", userRoutes);
app.use("/api/family", familyRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
