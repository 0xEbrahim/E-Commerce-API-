import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/userModel.js";
import dotnev from "dotenv";
dotnev.config();

export const strategy = new GoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    try {
      const user = await User.findOne({ googleId: profile.id });
      if (!user)
        await User.create({
          googleId: profile.id,
          email: profile.email,
          avatar: profile.picture,
          name: profile.name,
          emailConfirmed: true,
          password: (Math.random() * 10000000000 + " ").toString(),
        });
    } catch (err) {}
    return done(null, profile);
  }
);

passport.use(strategy);
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
