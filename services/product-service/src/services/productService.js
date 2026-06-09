const pool = require("../config/db");

const getCategories = async () => {
    const result = await pool.query(

        `SELECT *
        FROM categories
        ORDER BY id
        `
    );

    return {
        success: true,
        data: result.rows
    };
};

module.exports = {
    getCategories
};