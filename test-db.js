const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const pass = process.env.WS_ADMIN_PASS;
console.log('Raw WS_ADMIN_PASS:', JSON.stringify(pass));
console.log('Length:', pass ? pass.length : 0);
