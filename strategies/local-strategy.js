//local-strategy.js
const passport = require("passport");
const { Strategy } = require("passport-local");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/apiError");

//set user.id as a session cookie & send it to client
passport.serializeUser((user, done) => {
  console.log('serializeUser');
  
  done(null, user.id);
});

//extract user from the session (id) and attach it to req.user
passport.deserializeUser(async (id, done) => {
  console.log('deserializeUser');
  
  try {
    const user = await userModel.findById(id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new Strategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      console.log('local strategy');
      
      try {
        const user = await userModel.findOne({ email: username });
        if (!user || !(await bcrypt.compare(password, user.password)))
          throw new ApiError("invaid email or password", 401);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
