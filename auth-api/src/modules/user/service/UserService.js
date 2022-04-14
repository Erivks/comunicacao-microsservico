import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from "../repository/UserRepository.js";
import HTTP_CODE from "../../../config/constants/httpStatus.js";
import UserException from "../exception/UserException.js";
import * as secrets from '../../../config/constants/secrets.js';

class UserService {

    async findByEmail(req) {
        try {
            const { email } = req.params;
            const { authUser } = req;
            this.validateDataRequest(email);
            let user = await UserRepository.findByEmail(email);
            this.validateUserNotFound(user);
            this.validateAuthenticatedUser(user, authUser);
            return {
                status: HTTP_CODE.OK,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        } catch (error) {
            return {
                status: error.status ? error.status : HTTP_CODE.INTERNAL_SERVER_ERROR,
                message: error.message
            }    
        }
    }

    validateDataRequest(email) {
        if (!email) {
            throw new UserException(HTTP_CODE.BAD_REQUEST, "User email was not informed!");
        }
    }

    validateUserNotFound(user) {
        if (!user) {
            throw new UserException(HTTP_CODE.BAD_REQUEST, "User not found!");
        }
    } 

    validateAuthenticatedUser(user, authUser) {
        if (!authUser || user.id !== authUser.id) {
            throw new UserException(HTTP_CODE.FORBIDDEN, "Your cannot see this user data.");
        }
    }

    async getAcessToken(req) {
        try {
            const { email, password } = req.body;
            this.validateAcessTokenData(email, password);
            
            let user = await UserRepository.findByEmail(email);
            this.validateUserNotFound(user);

            await this.validatePassword(password, user.password);

            const authUser = {id: user.id, name: user.name, email: user.email};
            const accessToken = jwt.sign({ authUser }, secrets.apiSecret, { expiresIn: "1d" });

            return {
                status: HTTP_CODE.OK,
                accessToken
            }
        } catch (error) {
            return {
                status: error.status ? error.status : HTTP_CODE.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    validateAcessTokenData(email, password) {
        if (!email || !password) {
            throw new UserException(HTTP_CODE.UNATHORIZED, "Email and password must be informed.");
        }
    }

    async validatePassword(password, hashpassword) {
        if (!await bcrypt.compare(password, hashpassword)) {
            throw new UserException(HTTP_CODE.UNATHORIZED, "Password doesn't match.");
        }
    }
}

export default new UserService();