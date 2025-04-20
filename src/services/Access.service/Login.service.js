const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { getUsers, getIDByUsername, getPasswordHashByUserName, getPasswordHashByUserID, findUserById } = require('../../models/repo/user.repo');
const { creatTokenPair } = require('../../auth/authUtils');
const keyTokenService = require('../ApiKey.service');
const { BadRequestError, NotFoundError, InternalServerError } = require('../../core/error');
const e = require('express');


class AccessService {
    // Đăng nhập
    Login = async (payload) => {
        const { userName, password } = payload;

        // check userName and password từ client
        if (!userName || !password) {
            throw new BadRequestError('Missing userName or password!');
        };

        const user_id = await getIDByUsername(userName);

        if (!user_id[0]) {
            throw new NotFoundError('User not found!');
        }
        // lấy mật khẩu hash từ user nếu tồn tại thì so sánh với mật khẩu từ client
        const exitsPassword = await getPasswordHashByUserID(user_id[0].user_id);

        if (exitsPassword[0].password.toString() == password.toString()) {

            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            });

            const tokens = await creatTokenPair({ ID: user_id[0].user_id }, publicKey, privateKey);

            await keyTokenService.createKeyToken({
                user_id: user_id[0].user_id,
                refreshToken: tokens.refreshToken,
                publicKey,
                privateKey
            });

            const user = await findUserById(user_id[0].user_id);

            return {
                user: user,
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                }
            };
        }else {
            throw new BadRequestError('Password is incorrect!');
        }


    }


    refreshToken = async (payload, keyStore) => {
        const { refreshToken } = payload;
        const { user_id } = keyStore;

        if (!refreshToken) {
            throw new BadRequestError('Missing refresh token!');
        }

        const keyToken = await keyTokenService.findByUserId(user_id);

        if (!keyToken[0]) {
            throw new NotFoundError('Refresh token not found!');
        }

        const { publicKey, privateKey } = keyToken;

        const tokens = await creatTokenPair({ ID: refreshToken.user_id }, publicKey, privateKey);

        await keyTokenService.createKeyToken({
            user_id: refreshToken.user_id,
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey
        });

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };

    }
    // đăng xuất
    logout = async (payload) => {
        const { user_id } = payload;

        const logout = await keyTokenService.removeKeyByUserId(user_id);

        return logout;
    }
};

module.exports = new AccessService();