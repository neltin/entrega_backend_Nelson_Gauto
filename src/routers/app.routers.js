const {Router} = require('express');
const ProductRoute =  require('./products/products.route');
const CartRoute =  require('./carts/carts.route');

const router = Router();

//Rutas de producto
router.use("/products", ProductRoute);

//Rutas de carrito
router.use("/carts", CartRoute);


router.use((error, req, res, next) =>{
    res.status(404).json({
        status: "error",
        error: error
    })
})

module.exports = router;