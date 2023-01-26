const {Router} = require('express');
const router = Router();

const ProductManager = require('../../dao/fileManagers/ProductManager');
const productos = new ProductManager('./src/file/dataProducts.json');

//HandleBars Router Home
router.get('/', async (req, res )=>{
    //Traer todos los productos
    const product =  await productos.getProducts();

    if(product.length > 0){
        const data =  {
            status: true,
            style:"/styles/home.style.css",
            title: "Home",
            product: product
        }

        res.status(220).render('home', data);
    }else{
        return res.status(404).render('home', {
            status: false,
            data: "No hay productos"
        })
    }


})

module.exports = router;