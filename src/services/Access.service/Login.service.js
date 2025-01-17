const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { getUsers , getIDByUsername, getPasswordHashByUserName, getPasswordHashByUserID, userById } = require('../../models/repo/user.repo');
const { creatTokenPair } = require('../../auth/authUtils');
const keyTokenService = require('../ApiKey.service');


class AccessService {

    // Đăng nhập
    Login = async ( payload ) => {
        const { userName , password } = payload;

        // check userName and password từ client
        if( !userName || !password ) {
            return {
                error: 'All fields are required'
            };
        };

        // lấy thông tin user từ database nếu tồn tại thì trả về user không thì lỗi
        const user_id = await getIDByUsername( userName );

        console.log(user_id[0].user_id);

        if(!user_id) {
            return {
                error: 'User not found'
            };
        }


        // lấy mật khẩu hash từ user nếu tồn tại thì so sánh với mật khẩu từ client
        const exitsPassword = await getPasswordHashByUserID( user_id[0].user_id );

        // const comparePassword = await bcrypt.compare( password , exitsPassword );

        console.log(exitsPassword[0].password);

        if( exitsPassword[0].password.toString() == password.toString()) {

            // tạo 2 keypair cho user pulicKey và privateKey, puclikKey trả về client, privateKey lưu vào database
            const { privateKey , publicKey } = crypto.generateKeyPairSync('rsa', {
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

            const tokens = await creatTokenPair({ ID : user_id[0].ID } , publicKey , privateKey);

            await keyTokenService.createKeyToken({
                user_id: user_id[0].user_id,
                refreshToken: tokens.refreshToken,
                publicKey,
                privateKey
            });

            const user = await userById( user_id[0].user_id );

            return {
                message: 'User logged in successfully',
                user,
                tokens
            };
        }
    }

    // đăng xuất
    logout = async (req, res, next) => {
        try {
            const userName = req.keyStore.user;

            await keyTokenService.removeKeyByUserName(userName);

            return res.status(200).json({
                message: req.keyStore.user + " logout success!",
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = new AccessService();



    // login = async () => {
    //     try {
    //         const { userNameOrEmail , password } = req.body;
    
    //         if(!userNameOrEmail || !password ) {
    //             return res.status(400).json({
    //                 error: 'All fields are required'
    //             });
    //         }
    
    //         let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //         const data = regexEmail.test(userNameOrEmail)
    //             ? { email: userNameOrEmail, userName: null }
    //             : { userName: userNameOrEmail, email: null };
    
            
    //         const user = await User.getUser(data);
    //         const existPassword = await User.getPassword(data);
    //         console.log(existPassword)

    //         const passwords1 = req.body.password;
    
    //         const comparePassword = await bcrypt.compare( passwords1 , existPassword[0].password);
    
    //         if(!user) {
    //             return res.status(400).json({
    //                 error: 'User not found'
    //             });
    //         }
    //         if(user && ( comparePassword === true)) {
    //             const { privateKey , publicKey } = crypto.generateKeyPairSync('rsa', {
    //                 modulusLength: 4096,
    //                 publicKeyEncoding: {
    //                     type: 'pkcs1',
    //                     format: 'pem'
    //                 },
    //                 privateKeyEncoding: {
    //                     type: 'pkcs1',
    //                     format: 'pem'
    //                 }
    //             });

    //             console.log(publicKey , privateKey);

    //             const tokens = await creatTokenPair({user : user[0].userName  } , publicKey , privateKey);

    //             await keyTokenService.createKeyToken({
    //                 user: user[0].userName,
    //                 refreshToken: tokens.refreshToken,
    //                 publicKey,
    //                 privateKey
    //             });

    //             return res.status(200).json({
    //                 message: 'User logged in successfully',
    //                 user,
    //                 tokens
    //             });

    //         }
    //         else if(user && ( comparePassword === false)) {
    //             return res.status(400).json({
    //                 error: 'Password is incorrect'
    //             });
    //         }
    //         res.status(200).json({
    //             message: 'User logged in successfully',
    //             user
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // };
