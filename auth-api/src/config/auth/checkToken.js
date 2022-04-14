import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import * as secrets from "../constants/secrets.js";
import HTTP_CODE from "../constants/httpStatus.js";
import AuthException from './AuthException.js';

const bearer = "bearer ";

export default async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            throw new AuthException(HTTP_CODE.UNATHORIZED, "Access Token was not informed.");
        }
        let accessToken = authorization;
        if (accessToken.includes(" ")) {
            accessToken = accessToken.split(" ")[1];
        } else {
            accessToken = authorization;
        }

        const decoded = await promisify(jwt.verify)(
            accessToken,
            secrets.apiSecret
        );

        console.log(decoded);
        req.authUser = decoded.authUser;
        return next();
    } catch (error) {
        const status = error.status ? error.status : HTTP_CODE.INTERNAL_SERVER_ERROR;
        return res.status(status).json({
            status: status,
            message: error.message
        });
    }
}