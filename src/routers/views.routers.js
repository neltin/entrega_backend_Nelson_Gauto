const {Router} = require('express');
const HomeRoute =  require('./home/ViewHome.route');
const RealTimeProductsRoute =  require('./products/RealTimeProductsRoute.route');
const Chat =  require('./chat/Chat.route');
const ProductRoute =  require('./products/ViewProducts.route');
const CartRoute =  require('./carts/ViewCarts.route');

const router = Router();

//Rutas de home
router.use("/", HomeRoute);

//Ruta de RealTimeProductsRoute
router.use("/realtimeproducts", RealTimeProductsRoute);

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

router.use("/chat", Chat);

module.exports = router;