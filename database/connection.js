const sql = require("mssql");
const dbSetting = {
  user: "vehiculos",
  password: "vehiculos",
  server: "localhost",
  database: "Vehiculos",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

 async function getConection() {
  try {
    const pool = await sql.connect(dbSetting);
    return pool;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {getConection,sql};
