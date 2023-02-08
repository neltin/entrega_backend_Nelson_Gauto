const {Router} = require('express');
const {Uploader} = require('../../middleware/multer.middleware');

const router = Router();

const  ProductManager  = require("../../dao/mongoManagers/ProductManager");
const productos = new ProductManager();

router.get('/', async (req, res) =>{
    //Traer todos los productos
    let { limit } = req.query;
    let{ page } = req.query;
    let{ sort } = req.query;

    limit ? limit : limit = 3;
    page ? page : page = 1;
    sort ? sort : sort = 1;

    //const product =  await productos.getProducts(limit);
    const product =  await productos.getPaginateProducts(limit, page, sort);
    //Query limit

    if(product.status == "success"){ 

    let sortP = "";
    if(sort == 1){
        sortP = `&sort=-1`;
    }else if(sort == -1){
        sortP = `&sort=1`;
    }

    const pString = JSON.stringify(product.data.docs, null, '\t');

    const prevLink = product.data.hasPrevPage?`http://localhost:8080/products?page=${product.data.prevPage}`:'';

    const nextLink = product.data.hasNextPage?`http://localhost:8080/products?page=${product.data.nextPage}`:'';


    const sortPrice = `http://localhost:8080/products?page=${product.data.page}${sortP}`;


    const data =  {
        status: true,
        style:"/styles/home.style.css",
        title: "Products",
        product:  JSON.parse(pString),
        hasPrevPage:  product.data.hasPrevPage,
        prevLink: prevLink,
        hasNextPage:  product.data.hasNextPage,
        nextLink: nextLink,
        sortPrice: sortPrice
    }

    res.status(220).render('products', data);         
        
    }else{
        return res.status(404).render('home', {
            status: false,
            data: "No hay productos"
        })
    }
})

router.get('/:pid', async (req, res) =>{
    //Parametro id
    const { pid } = req.params;    
    const product =  await productos.getProductsById(pid);

    if(product.status == 'error'){
        return res.status(404).json({
            ...product
        })
    }

    return res.status(220).json({
        ...product
    })     
})

router.post('/', Uploader.array('thumbnails') ,  async (req, res) => {
    const p = req.body;
    let thumbnails = req.files ? (req.files.map(file => `/img/${file.originalname}`)) : []; 

    if(p.title && p.description && p.price && p.code && p.category && p.stock){
    const status= !p.status ? true : p.status;

    const product =  await productos.addProduct( {...req.body, status: status, thumbnails: thumbnails} );

        if(product.status == 'error'){
            return res.status(404).json({
                ...product
            })
        }

        return res.status(220).json({
            ...product
        }) 
    }else{
        if(product.status == 'error'){
            return res.status(404).json({
                status: "error",
                error:`falta campos por completar`
            })
        }
    }
})

router.put('/:pid' , Uploader.array('thumbnails') , async (req, res) => {
    //Parametro id
    const { pid } = req.params;
    let thumbnails = req.files ? (req.files.map(file => `/img/${file.originalname}`)) : [];      
    console.log(req.body);

    const product =  await productos.updateProduct( pid , {...req.body, thumbnails: thumbnails});
    
    if(product.status == 'error'){
        return res.status(404).json({
            ...product
        })
    }

    return res.status(220).json({
        ...product
    }) 

})


router.delete('/:pid' , async (req, res) => {
    //Parametro id
    const { pid } = req.params; 

    const product =  await productos.deleteProduct(pid);
    
    if(product.status == 'error'){
        return res.status(404).json({
            ...product
        })
    }

    return res.status(220).json({
        ...product
    }) 

})



module.exports = router;