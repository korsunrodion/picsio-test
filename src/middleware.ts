import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    next()
  })
}