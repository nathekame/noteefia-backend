module.exports = {
  frontendUrl: process.env.FRONTEND_URL || 'https://noteefia.com/',
  hostEmail: process.env.HOST_EMAIL,
  dbName: 'noteefiadb',
  // dbName: 'notifiadb',
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  nodePort: process.env.NODE_PORT,
  jwtKey: process.env.JWT_KEY,
  serviceKey: process.env.SERVICE_KEY,
  hookKey: process.env.HOOK_API_KEY,

  cryptoKey: process.env.CRYPTO_KEY,

  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // end of the module export bracket
};
