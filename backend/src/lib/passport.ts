import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./prisma"; // Your initialized Prisma client

// Serialize/deserialize
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash)
        return done(null, false, { message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch)
        return done(null, false, { message: "Invalid credentials" });

      return done(null, user);
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (_, __, profile, done) => {
      const existingUser = await prisma.user.findUnique({
        where: { googleId: profile.id },
      });
      if (existingUser) return done(null, existingUser);

      const user = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails?.[0].value!,
          fullName: profile.displayName,
        },
      });

      return done(null, user);
    }
  )
);
