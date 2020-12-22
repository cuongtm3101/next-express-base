const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AppError = require("./utils/appError")

const db = require('./helpers/dbConnect');

require("dotenv").config();

const globalErrorHandler = require('./controllers/err.controller');

// bring routes
const blogRoutes = require("./routes/blog.routes");
const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const sectionRoutes = require("./routes/section.routes");
const lessonRoutes = require("./routes/lesson.routes");
const orderRoutes = require("./routes/order.routes");

// app
const app = express();

// database
db.Connect();

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

// cors
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: `${process.env.CLIENT_URL}`,
    })
  );
}

// routes middleware
app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use('/api', courseRoutes)
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", orderRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't not found this path : ${req.originalUrl} on server`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${8000}`);
});
