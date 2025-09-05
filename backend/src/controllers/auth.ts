import passport from "passport";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { sanitizeUser } from "../utils";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

function authController() {
  // These now return middleware functions that Express can use
  const googleLogin = (req: Request, res: Response, next: NextFunction) => {
    const redirectTo = req.query.redirectTo || "/upload";
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString(
      "base64"
    );

    const authenticator = passport.authenticate("google", {
      scope: ["profile", "email"],
      state: state,
    });

    authenticator(req, res, next);
  };

  // Google Callback with dynamic redirect and JWT
  const googleCallback = [
    passport.authenticate("google", {
      failureRedirect: "/login",
      failureMessage: true,
    }),
    (req: Request, res: Response) => {
      try {
        // Get the state parameter and parse it
        const state = req.query.state as string;
        let redirectPath = "/upload";
        if (state) {
          const decodedState = JSON.parse(
            Buffer.from(state, "base64").toString()
          );
          if (decodedState.redirectTo) {
            redirectPath = decodedState.redirectTo;
          }
        }
        // Generate tokens
        const user = req.user as any;
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        // Redirect with tokens as query params (or set cookies in production)
        const redirectUrl = `${frontendUrl}${redirectPath}?accessToken=${accessToken}&refreshToken=${refreshToken}`;
        return res.redirect(redirectUrl);
      } catch (error) {
        console.error("Error processing callback:", error);
        res.redirect(`${frontendUrl}/upload`); // Fallback to dashboard
      }
    },
  ];

  const localLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(400).json({
          message: "Login failed",
          error: info?.message || "Login failed",
        });
      }

      req.logIn(user, (err) => {
        if (err) return next({ message: "Login failed", error: err });
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        return res.json({
          message: "Login successful",
          user: sanitizeUser(user),
          accessToken,
        });
      });
    })(req, res, next);
  };

  const localRegister = async (req: Request, res: Response) => {
    const { fullName, email, password, phone } = req.body;

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing)
        return res.status(400).json({ error: "User already exists" });

      const hash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          fullName,
          phone,
          passwordHash: hash,
        },
      });

      req.login(user, (err) => {
        if (err)
          return res.status(500).send({
            status: "error",
            message: "Login failed",
            error: err,
          });
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).send({
          status: "success",
          message: "Registration successful",
          user: sanitizeUser(user),
          accessToken,
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Registration failed" });
    }
  };

  const logout = (req: Request, res: Response) => {
    req.logout(() => res.send("Logged out"));
  };

  const isAuthenticated = (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });
    // Optionally, issue a new access token
    const accessToken = generateAccessToken(req.user as any);
    res.json({ user: sanitizeUser(req.user), accessToken });
  };

  const refreshToken = (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh token provided" });
    }
    Promise.resolve(verifyRefreshToken(refreshToken))
      .then((decoded: any) => {
        return prisma.user
          .findUnique({ where: { id: decoded.id } })
          .then((user) => {
            if (!user) return res.status(401).json({ error: "User not found" });
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            return res.json({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });
          });
      })
      .catch(() => {
        return res
          .status(401)
          .json({ error: "Invalid or expired refresh token" });
      });
  };

  return {
    googleLogin,
    googleCallback,
    localLogin,
    localRegister,
    logout,
    isAuthenticated,
    refreshToken,
  };
}

export default authController;
