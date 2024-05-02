require('dotenv').config();


module.exports = {
  "development": {
    // "username": process.env.DB_USER,
    // "password": process.env.DB_PASS,
    // "database": process.env.DB_NAME,
    // "host": process.env.DB_HOST,
    // "dialect": "mysql",
    // "dialect": "sqlite",
    // "storage": "../db/database.sqlite"
    "username": process.env.DB_USER_DEPLOYMENT,
    "password": process.env.DB_PASS_DEPLOYMENT,
    "database": process.env.DB_NAME_DEPLOYMENT,
    "host": process.env.DB_HOST_DEPLOYMENT,
    "dialect": "postgres",
    dialectOptions: {
      ssl: {
        require: true, // Ini mungkin diperlukan tergantung setup Supabase
        rejectUnauthorized: false // Diperlukan jika menggunakan self-signed certificates
      }
    }
  },
  "test": {
    // "username": process.env.DB_USER,
    // "password": process.env.DB_PASS,
    // "database": process.env.DB_NAME,
    // "host": process.env.DB_HOST,
    // "dialect": "mysql",
    "dialect": "sqlite",
    "storage": "../db/database.sqlite"
  },
  "production": {
    "username": process.env.DB_USER_DEPLOYMENT,
    "password": process.env.DB_PASS_DEPLOYMENT,
    "database": process.env.DB_NAME_DEPLOYMENT,
    "host": process.env.DB_HOST_DEPLOYMENT,
    "dialect": "postgres",
    dialectOptions: {
      ssl: {
        require: true, // Ini mungkin diperlukan tergantung setup Supabase
        rejectUnauthorized: false // Diperlukan jika menggunakan self-signed certificates
      }
    }
  }
}
