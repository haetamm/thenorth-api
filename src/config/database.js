require("dotenv").config();

module.exports = {
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  development: {
    username: process.env.DB_USER || "postgres",          // default kalau env gak ada
    password: process.env.DB_PASS || "yourpassword",      // ganti ini di env
    database: process.env.DB_NAME || "app_dev",
    host: process.env.DB_HOST || "db",                    // "db" = nama service di docker-compose
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  },
  // production: {
  //   username: process.env.DB_USER_DEPLOYMENT,
  //   password: process.env.DB_PASS_DEPLOYMENT,
  //   database: process.env.DB_NAME_DEPLOYMENT,
  //   host: process.env.DB_HOST_DEPLOYMENT,
  //   dialect: "postgres",
  //   dialectOptions: {
  //     ssl: {
  //       require: true, // Ini mungkin diperlukan tergantung setup Supabase
  //       rejectUnauthorized: false, // Diperlukan jika menggunakan self-signed certificates
  //     },
  //   },
  // },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
};
