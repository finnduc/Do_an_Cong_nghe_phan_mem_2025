const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../services/access.service');
const session = require('express-session');
const creatCodeVerify = require('../utils/creatCodeVerify');
const sendEmail = require('../helpers/send.codeVerify');
const { set } = require('mongoose');
const promise = require('promise');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const token = require('../utils/createToken');
const keyTokenService = require('../services/keyToken.service');
const { creatTokenPair } = require('../auth/authUtils');
const  logData  = require('../utils/logData');
const { InternalServerError, BadRequestError } = require('../core/error.respone');
const { CREATED } = require('../core/success.respone');

const roleShop = ['user', 'admin' , 'shop'];

const codeVerify = creatCodeVerify(6);
class AccessController {
    signUp = async (req, res, next) => {
            console.log(req.body);
            console.log(User);
            const { userName , email, password } = req.body;

            if(!userName || !email || !password) {
                throw new BadRequestError('Missing required fields', 400);
            }

            const existEmail = await User.getByEmail(email);
            if(existEmail.length) {
                throw new BadRequestError('Email already exists' , 400);
            }
            
            const existUserName = await User.getByUserName(userName);
            if(existUserName.length) {
                throw new BadRequestError('UserName already exists' , 400);
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const dataSignup = ({
                firstName : "admin",
                lastName : "admin",
                userName : userName,
                email: email.toLowerCase(),
                password: hashPassword,
                isConfirmation : false,
                role : "admin"
            });


            const user = await User.createUser(dataSignup);
            // send email
            sendEmail({ email, userName, codeVerify, res });

            // delete user after 120s if user not verify

            const deleUser = async (email) => {
                setTimeout( async () => {
                    const valueConfimation = await User.getConfirmation(email);
                    console.log(valueConfimation[0].confirmationCode)
                    if(valueConfimation[0].confirmationCode === 0) {
                        await User.deleteUser(email);
                        console.log('Delete user because user do not verify');
                    }else {
                        console.log("User signup success!")
                    }
                }, 120000);
                // await User.deleteUser(email);
            }

            deleUser(email);

            // return res.status(201).json({
            //     message: 'Signup success!',
            //     data: dataSignup
            // });
            return new CREATED({
                message: 'Signup success!',
                status: 201,
                metadata: dataSignup
            }).send(res);
    };
    
    verify = async (req, res) => {
        try {
            const confirmationToken = req.params.confirmationToken;
            // const userName = confirmation.becrypt( confirmationToken );
            console.log(confirmationToken)

            const codeVerifyUser = req.body.codeVerify;
            console.log(codeVerifyUser)
            if(!codeVerifyUser) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            if(codeVerifyUser.length !== 6) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            if(codeVerifyUser.toString() === codeVerify.toString()) {
                console.log('success')
                await User.updateConfirmation(confirmationToken);
                return res.status(200).json({ message: 'Verify success' });
            }
            else {
                return res.status(400).json( { message : "Verify not true!"} )
            }

        } catch (err) {
            console.log(err);
            // res.status(500).json({ error: 'Internal server error' });
            // next(err);
        }
    };

    login = async (req, res, next) => {
        try {
            const refreshToken = null ;
            const { userNameOrEmail , password } = req.body;
            console.log( "Data login: " , userNameOrEmail ,"password" ,  password);
    
            if(!userNameOrEmail || !password ) {
                return res.status(400).json({
                    error: 'All fields are required'
                });
            }
    
            let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            const data = regexEmail.test(userNameOrEmail)
                ? { email: userNameOrEmail, userName: null }
                : { userName: userNameOrEmail, email: null };
    
            
            // const valueConfimation = await User.getConfirmationByData(data);
            // if( valueConfimation[0].confirmationCode === 0 ) {
            //     return res.status(400).json({
            //         error: 'User not found'
            //     });
            // }
            
            const user = await User.getUser(data);
            const existPassword = await User.getPassword(data);
            console.log(existPassword)

            const passwords1 = req.body.password;
    
            const comparePassword = await bcrypt.compare( passwords1 , existPassword[0].password);
            console.log(comparePassword)
    
            if(!user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            if(user && ( comparePassword === true)) {
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

                console.log(publicKey , privateKey);

                const tokens = await creatTokenPair({user : user[0].userName  } , publicKey , privateKey);

                await keyTokenService.createKeyToken({
                    user: user[0].userName,
                    refreshToken: tokens.refreshToken,
                    publicKey,
                    privateKey
                });

                return res.status(200).json({
                    message: 'User logged in successfully',
                    user,
                    tokens
                });

            }
            else if(user && ( comparePassword === false)) {
                return res.status(400).json({
                    error: 'Password is incorrect'
                });
            }
            res.status(200).json({
                message: 'User logged in successfully',
                user
            });
        } catch (err) {
            next(err);
        }
    };

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

    finn = async (req, res, next) => {
        try {
            return res.status(200).json({
                message: req.keyStore.user,
            });
        } catch (error) {
            next(error);
        }
    }

};

module.exports = new AccessController();
