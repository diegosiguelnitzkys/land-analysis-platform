const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'land_analysis',
    password: 'postgres',
    port: 5432,
});

const acresToHectares = (acres) => acres * 0.404686;
const usdToClp = (usd) => usd * 850;

const queries = {
    async createParcel(data) {
        try {
            const result = await pool.query(
                `INSERT INTO land_parcels (
                    address, size_acres, comuna, region, size_hectares, land_use_type
                ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [data.address, data.size_acres, data.comuna, data.region, acresToHectares(data.size_acres), data.land_use_type]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async getParcelById(parcel_id) {
        const result = await pool.query('SELECT * FROM land_parcels WHERE id = $1', [parcel_id]);
        return result.rows[0];
    },

    async addRiskAssessment(parcel_id, risk_type, risk_level) {
        const result = await pool.query(
            `INSERT INTO risk_assessments (parcel_id, risk_type, risk_level) 
             VALUES ($1, $2, $3) RETURNING *`,
            [parcel_id, risk_type, risk_level]
        );
        return result.rows[0];
    },

    async getRisksForParcel(parcel_id) {
        const result = await pool.query('SELECT * FROM risk_assessments WHERE parcel_id = $1', [parcel_id]);
        return result.rows;
    },

    async getParcelAnalysis(parcel_id) {
        const parcel = await pool.query('SELECT * FROM land_parcels WHERE id = $1', [parcel_id]);
        const comparables = await pool.query('SELECT * FROM comparables WHERE parcel_id = $1', [parcel_id]);
        const risks = await pool.query('SELECT * FROM risk_assessments WHERE parcel_id = $1', [parcel_id]);

        return {
            parcel: parcel.rows[0] || null,
            comparables: comparables.rows || [],
            risks: risks.rows || [],
        };
    }
};

module.exports = { pool, queries };
