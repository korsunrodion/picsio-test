import { randomUUID } from "crypto";
import express from "express";
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.post(
  '/get-token',
  async (req, res) => {
    const token = jwt.sign(randomUUID(), process.env.TOKEN_SECRET as string, { expiresIn: '1800s' });
    res.status(200).json({
      token,
    })
  }
)

export default authRouter;