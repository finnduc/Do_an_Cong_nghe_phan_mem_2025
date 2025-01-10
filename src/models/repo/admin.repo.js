// src/repo/admin.repo.js
const pool = require('../database/init.mysql');

const getAllAdmins = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM admins';
        pool.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const addAdmin = (name, email, password) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)';
        pool.query(query, [name, email, password], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    getAllAdmins,
    addAdmin,
};
