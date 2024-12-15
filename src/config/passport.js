import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/userModel.js";
import dotnev from "dotenv";
import APIError from "../utils/APIError.js";
dotnev.config();

export const strategy = new GoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile._json.sub,
          email: profile._json.email,
          avatar: profile._json.picture,
          name: profile._json.name,
          emailConfirmed: true,
          password: (Math.random() * 10000000000 + " ").toString(),
        });
      }
      done(null, user);
    } catch (err) {
      throw new APIError(err.message, 500);
    }
  }
);

passport.use(strategy);
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
