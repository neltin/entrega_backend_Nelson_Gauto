const {Router} = require('express');
const router = Router();

// const ProductManager = require('../../dao/fileManagers/ProductManager');
// const productos = new ProductManager('./src/file/dataProducts.json');

const  ProductManager  = require("../../dao/mongoManagers/ProductManager");
const productos = new ProductManager();


//HandleBars Router Home
router.get('/', async (req, res )=>{
    //Traer todos los productos
    const product =  await productos.getProducts();

    const pString = JSON.stringify(product.data, null, '\t');

    if(product.status == "success"){
        const data =  {
            status: true,
            style:"/styles/home.style.css",
            title: "Home",
            product:  JSON.parse(pString) 
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