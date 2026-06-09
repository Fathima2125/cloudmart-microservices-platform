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

module.exports = {
    getCategories
};