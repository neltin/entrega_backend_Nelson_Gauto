const {Router} = require('express');
const HomeRoute =  require('./home/home.route');  
const RealTimeProductsRoute =  require('./products/RealTimeProductsRoute.route'); 

const router = Router();

//Rutas de home
router.use("/", HomeRoute);

//Ruta de RealTimeProductsRoute
router.use("/realtimeproducts", RealTimeProductsRoute);

router.use((error, req, res, next) =>{
    res.status(404).json({
        status: "error",
        error: error
    })
})

module.exports = router;