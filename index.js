const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const joi = require("joi");

const app = express();

async function server(port) {
  app.listen(port, console.log(`Server running on port ${port}`));
}

// A method to connect database
async function connectDB(urlDB) {
  try {
    mongoose.connect(urlDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Database connection error"));
    db.once("open", function () {
      winston.info("Connected to Database");
    });
  } catch (e) {
    console.log(e);
  }
}

// Passport local strategy
async function auth(model) {
  const { error } = validator(userData);
  if (error) return error.details[0].message;
  passport.use(
    new localStrategy({}, async (username, password, done) => {
      if (username.includes("@")) email = username;
      else if (username.match(/^[0-9]+$/) != null) phone = username;
      else username = username;

      const user = await model.findOne({ username });
      if (!user) return "User is not found";

      const validPW = await bcrypt.compare(password, user.password);
      if (!validPW) return "Invalid password";

      const token = await user.generateAuthToken();

      res.json({ user: user, token: token });
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
}

app.use(passport.initialize());

function validator(obj) {
  const schema = joi.object({
    password: joi.string(),
    email: joi.string().email(),
    phone: joi.string(),
    username: joi.string(),
    name: joi.string(),
    rating: joi.number(),
    address: joi.string(),
    openingDate: joi.string(),
  });
  return schema.validate(obj);
}

module.exports = { server, connectDB, validator, auth };
