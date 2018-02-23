module.exports = {
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_URL,
    dialect: "mysql",
    apiUrl: process.env.APP_NAME
  },
  test: {
    username: "root",
    password: null,
    database: "sportsdata_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  development: {
    username: "root",
    password: "123456",
    database: "sportsdata_development",
    host: "127.0.0.1",
    dialect: "mysql",
    apiUrl: "http://localhost:3000"
  }
}
