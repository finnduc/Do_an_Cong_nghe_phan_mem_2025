const keyTokenModel = require("../models/keyToken.model");
const { ObjectId } = require("mongodb");
const { Types } = require("mongoose")

class keyTokenService {
    static createKeyToken = async ({ user , refreshToken , publicKey , privateKey }) => {
        try {
            //level 0
            // const publicKeyString = publicKey.toString();
            // const tokens = await keyTokenModel.create({
            //     user: user,
            //     publicKey: publicKeyString
            // });
            // return tokens ? tokens.publicKey : null;
            //level xxx
            const filter = { user: user }, update = { publicKey, privateKey , refreshTokensUsed: [] , refreshToken }, options = { upsert: true, new: true};
            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }

    static findByUserName = async (userName) => {
        return await keyTokenModel.findOne({ user: userName }).lean();
    }

    static removeKeyByUserName = async (userName) => {
        return await keyTokenModel.deleteMany( { user: userName });
    }
};

module.exports = keyTokenService;