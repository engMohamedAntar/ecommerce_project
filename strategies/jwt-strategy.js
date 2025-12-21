//jwt-strategy.js
const { Strategy, ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const User = require("../models/userModel");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};


passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);

      if (!user) {
        return done(null, false); // user not found
      }

      return done(null, user); // success
    } catch (err) {
      return done(err, false); // error
    }
  })
);
module.exports= passport;