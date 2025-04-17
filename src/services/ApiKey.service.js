const { executeQuery } = require('../database/executeQuery');

class KeyTokenService {

    createKeyToken = async ({ user_id, refreshToken, publicKey, privateKey }) => {
        const query = `
            INSERT INTO api_keys (user_id, public_key, private_key, refresh_token, refresh_token_user)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                public_key = COALESCE(?, public_key),
                private_key = COALESCE(?, private_key),
                refresh_token = COALESCE(?, refresh_token),
                refresh_token_user = '[]';
        `;
        return executeQuery(query, [
            user_id, 
            publicKey, 
            privateKey, 
            refreshToken, 
            '[]', 
            publicKey, 
            privateKey, 
            refreshToken
        ]);
    };
    

    findByUserId = async (user_id) => {
        const query = `SELECT * FROM api_keys WHERE user_id = ?;`;
        return await executeQuery(query, [user_id]);
    };

    removeKeyByUserId = async (user_id) => {
        const query = `DELETE FROM api_keys WHERE user_id = ?;`;
        const result = await executeQuery(query, [user_id]);
        return result.affectedRows;
    };
}

module.exports = new KeyTokenService();
