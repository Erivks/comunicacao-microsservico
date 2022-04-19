import jwt from 'jsonwebtoken';
import { promisify } from 'util'; 

import AuthException from './AuthException.js';

import { apiSecret } from '../constants/secrets.js';
import { HTTP_CODE } from '../constants/httpStatus.js';

const emptySpace = " ";

export default async (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if (!authorization) {
            throw new AuthException(
                HTTP_CODE.UNATHORIZED,
                "Access token was not informed!"
            );
        }
        let accessToken = authorization;
        if (accessToken.includes(emptySpace)) {
            accessToken = accessToken.split(emptySpace)[1];
        } else {
            accessToken = authorization;
        }

        const decoded = await promisify(jwt.verify)(
            accessToken,
            apiSecret
        );
        req.authUser = decoded.authUser;
        return next();
    } catch (err) {
        const status = err.status ? err.status : HTTP_CODE.INTERNAL_SERVER_ERROR;
        return res.status(status).json({
            status,
            message: err.message
        });
    }
}