const pgtools = require('pgtools');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const config = {
    connectionString: "postgres://default:mW5toTOn1Lib@ep-patient-wind-a49qc981-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
};

// Create a connection pool
export { };

const pool = new Pool(config);

export default pool;