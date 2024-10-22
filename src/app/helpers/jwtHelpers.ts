import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../config';

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
    const token = jwt.sign(
        payload,
        secret,
        {
            algorithm: 'HS256',
            expiresIn
        }
    );

    return token;
};

const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload;
}

export const decodeToken = (token: string) => {
    const decodeToken = jwtHelpers.verifyToken(token, config.secret_access_token as string)
    return decodeToken
}

export const jwtHelpers = {
    generateToken,
    verifyToken
}