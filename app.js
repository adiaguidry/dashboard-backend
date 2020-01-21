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

//mongodb+srv://JaneDoe:<password>@adiascloud-stqqj.mongodb.net/test?retryWrites=true&w=majority

mongoose
  .connect("mongodb://localhost/HealthTracker")
  .then(() => console.log("Connected to MongoDB...You got it Adia"))
  .catch(err => console.error("could not connect", err));

//create schema
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
  //create an object
  const healthTrack = new HealthTrack({
    name: "Adia",
    calorieTarget: 2000,
    week: [
      {
        name: "Sun",
        if: 16,
        workout: 40,
        calories: 1919,
        calPercent: 90,
        fats: 133,
        protien: 132,
        carbs: 18,
        sleep: 4
      },
      {
        name: "Mon",
        if: 18,
        workout: 30,
        calories: 1789,
        calPercent: 80,
        fats: 157,
        protien: 132,
        carbs: 48,
        sleep: 8
      },
      {
        name: "Tues",
        if: 10,
        workout: 30,
        calories: 2119,
        calPercent: 100,
        fats: 163,
        protien: 112,
        carbs: 38,
        sleep: 6
      },
      {
        name: "Wed",
        if: 16,
        workout: 15,
        calories: 1519,
        calPercent: 75,
        fats: 153,
        protien: 152,
        carbs: 22,
        sleep: 8
      },
      {
        name: "Thur",
        if: 12,
        workout: 15,
        calories: 2000,
        calPercent: 100,
        fats: 133,
        protien: 102,
        carbs: 20,
        sleep: 7
      },
      {
        name: "Fri",
        if: 13,
        workout: 10,
        calories: 2219,
        calPercent: 100,
        fats: 143,
        protien: 172,
        carbs: 55,
        sleep: 5
      },
      {
        name: "Sat",
        if: 14,
        workout: 10,
        calories: 1902,
        calPercent: 95,
        fats: 163,
        protien: 123,
        carbs: 21,
        sleep: 4
      }
    ]
  });

  const result = await healthTrack.save();
  console.log(result);
}

// createHealthTrack();

app.get("/healthtracker", async (req, res) => {
  const healthtracker = await HealthTrack.find();
  console.log(healthtracker);
  res.send(healthtracker);
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
