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

const getProductById = async (id) => {

  const result = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      c.name AS category
    FROM products p
    JOIN categories c
      ON p.category_id = c.id
    WHERE p.id = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Product not found");
  }

  return {
    success: true,
    data: result.rows[0]
  };
};

const createProduct = async ({
  name,
  description,
  price,
  stock_quantity,
  category_id
}) => {

  if (
    !name ||
    !description ||
    !price ||
    !stock_quantity ||
    !category_id
  ) {
    throw new Error("All fields are required");
  }

  const result = await pool.query(
    `
    INSERT INTO products
    (
      name,
      description,
      price,
      stock_quantity,
      category_id
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      name,
      description,
      price,
      stock_quantity,
      category_id
    ]
  );

  return {
    success: true,
    message: "Product created successfully",
    data: result.rows[0]
  };
};


module.exports = {
    getCategories,
    getProducts,
    getProductById,
    createProduct
};