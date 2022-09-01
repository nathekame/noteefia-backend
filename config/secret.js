module.exports = {
  // baseUrl: process.env.BASE_URL || 'https://142.93.63.5',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  hostEmail: process.env.HOST_EMAIL,
  // hostEmail: 'CVR PORTAL n.athekame@gmail.com',
  dbUser: process.env.DB_USER || 'pmauser',
  dbPassword: process.env.DB_PASSWORD || 'password',
  // nodePort: process.env.NODE_PORT || '7000',
  nodePort: '7000',
  jwtKey: process.env.JWT_KEY || 'inhikhinlni',
  serviceKey: process.env.SERVICE_KEY || 'TEST',
  sendgridKey: process.env.SENDGRID_API_KEY,
  hookKey: process.env.HOOK_API_KEY || 'digitalTEST',

  cryptoKey: process.env.CRYPTO_KEY || 'pWJP6kqmtQWjRRIqLc7pcxs01lwHzsr6',

  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:
    process.env.AWS_SECRET_ACCESS_KEY,
  // end of the module export bracket
};

// n.athekame@gmail.com
