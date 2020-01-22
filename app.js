var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const mongoose = require("mongoose");
var app = express();
app.use(express.json());

//dash_db = mongodb+srv://JaneDoe:<password>@adiascloud-stqqj.mongodb.net/test?retryWrites=true&w=majority

mongoose
  .connect("dash_db")
  .then(() => console.log("Connected to MongoDB...You got it Adia"))
  .catch(err => console.error("could not connect", err));

// create schema
const healthSchema = new mongoose.Schema({
  name: String,
  calorieTarget: Number,
  week: [
    {
      name: String,
      if: Number,
      workout: Number,
      calories: Number,
      calPercent: Number,
      fats: Number,
      protien: Number,
      carbs: Number,
      sleep: Number
    }
  ]
});

//set class
const HealthTrack = mongoose.model("HealthTrack", healthSchema);

//create goal
async function createHealthTrack() {
  //create an object with schema data
  const healthTrack = new HealthTrack({});

  //need to wrap this in a try catch
  const result = await healthTrack.save();
  console.log(result);
}

app.get("/healthtracker", async (req, res) => {
  try {
    const healthtracker = await HealthTrack.find();
    console.log(healthtracker);
    res.send(healthtracker);
  } catch (error) {
    console.log(error);
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//PORT Environment variable
const port = process.env.PORT || 3001;
//listen on a port
app.listen(port, () => console.log(`Listening on port ${port}.. `));

module.exports = app;
