// server.js
const app = require('./src/index');

const PORT = process.env.EXPRESS_PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
