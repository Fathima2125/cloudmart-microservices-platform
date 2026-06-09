const productService = require("../services/productService");

const getCategories = async (req,res) => {
    try {
        const result = 
        await productService.getCategories();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

const getProducts = async (req, res) =>{
    try {
        const result =
        await productService.getProducts();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json ({
            success:false,
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {

  try {

    const result =
      await productService.getProductById(
        req.params.id
      );

    res.status(200).json(result);

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

const createProduct = async (req, res) => {

  try {

    const result =
      await productService.createProduct(
        req.body
      );

    res.status(201).json(result);

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};



module.exports = {
    getCategories,
    getProducts,
    getProductById,
    createProduct
};