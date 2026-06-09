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

const getProducts = async () => {
    const result = await pool.query(
        `SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock_quantity,
        c.name AS category
    FROM products p
    JOIN categories c
      ON p.category_id = c.id
    ORDER BY p.id
    `
    );

    return {
         success: true,
         data: result.rows
    };
};

module.exports = {
    getCategories,
    getProducts,
};