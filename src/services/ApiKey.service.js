const { executeQuery } = require('../database/executeQuery');

class KeyTokenService {

    createKeyToken = async ({ user_id, refreshToken, publicKey, privateKey }) => {
        const query = `
        INSERT INTO api_keys (user_id, public_key, refresh_token, refresh_token_user)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            public_key = VALUES(public_key),
            refresh_token = VALUES(refresh_token),
            refresh_token_user = '[]';
        `;
        return executeQuery(query, [user_id, publicKey, refreshToken, '[]']);
    };
    

    findByUserName = async (userName) => {
        const query = `SELECT * FROM key_tokens WHERE user = ? LIMIT 1;`;
        const rows = await executeQuery(query, [userName]);
        return rows.length ? rows[0] : null;
    };

    removeKeyByUserName = async (userName) => {
        const query = `DELETE FROM key_tokens WHERE user = ?;`;
        const result = await executeQuery(query, [userName]);
        return result.affectedRows;
    };
}

module.exports = new KeyTokenService();
