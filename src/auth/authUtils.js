const jwt = require('jsonwebtoken');
const  asyncHandler  = require('../helpers/asyncHandle');
const keyTokenService = require('../services/keyToken.service');


const HEADERS = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
};

const creatTokenPair = async ( payload , publicKey , privateKey) => {
    try {
        const accessToken = await jwt.sign(
            payload,
            privateKey,
            {
                algorithm: 'RS256',
                expiresIn: '2 days'
            }
        );

        console.log( 'AccessToken : ' , accessToken);

        const refreshToken = await jwt.sign(
            payload,
            privateKey,
            {
                algorithm: 'RS256',
                expiresIn: '7 days'
            }
        );
        console.log('RefeshToken : ' , refreshToken);

        // verify token
        jwt.verify( accessToken, publicKey, (err, decode) => {
            if(err) {
                console.log(`Error verify::`, err);
            } else {
                console.log(`Decode verify::`, decode);
            };
        });

        return { accessToken, refreshToken };

    } catch (error) {
        return {
            status: 'ERR',
            message: error
        }
    }
};

const authentication = asyncHandler ( async (req, res, next) => {
    /*
    1 - check userName misssing ???
    2 - get accessToken ???
    3 - verifyToken ???
    4 - check user in dbs ???
    5 - check keyStore with this userName ???
    6 - OK all => return next()
     */
    try {
        const userName = req.headers[HEADERS.CLIENT_ID];
        console.log("userName : " , userName )
        if(!userName) {
            return res.status(401).json({
                message: 'The userName is required'
            });
        }
        console.log("userName 2 : " , userName )
        const keyStore = await keyTokenService.findByUserName(userName);
        console.log("KeyStore : " , keyStore.publicKey );
        if(!keyStore) {
            return res.status(401).json({
                message: 'The userName does not exist'
            });
        }

        const accessToken = req.headers[HEADERS.AUTHORIZATION];
        console.log("accessToken : " , accessToken )
        if(!accessToken) {
            return res.status(401).json({
                message: 'The accessToken is required'
            });
        }

        const decodeUser = jwt.verify( accessToken, keyStore.publicKey, (err, decode) => {
            if(err) {
                console.log(`Error verify::`, err);
            } else {
                console.log(`Decode verify::`, decode);
                return decode;
            };
        });

        console.log(`Decode verify UserName : ` , decodeUser.user );
        req.user = decodeUser.user;
        if(decodeUser.user !== userName ) {
            return res.status(401).json({
                message: 'The userName is not valid'
            });
        }

        
        req.keyStore = keyStore;
        console.log("req.keyStore : " , req.keyStore );

        return next();

    } catch (error) {
        return res.status(400).json({
            message: "Error. Please try again"
        });
    }
});

module.exports = {
    creatTokenPair,
    authentication
}