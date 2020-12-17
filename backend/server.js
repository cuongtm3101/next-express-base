const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const globalErrorHandler = require('./controllers/err.controller');

// bring routes
const blogRoutes = require("./routes/blog.routes");
const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");

// app
const app = express();

// database
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

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

app.use(globalErrorHandler)
// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${8000}`);
});
