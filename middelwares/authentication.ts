import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    token = token.trim();
    const secretKey = process.env.TOKEN_SECRET as string;

    jwt.verify(token, Buffer.from(secretKey, 'base64'), (err: any, data: any) => {

        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.userId = String(data.userId);
        next();
    })
}