const {Router} = require('express');
const {Uploader} = require('../../middleware/multer.middleware');

const router = Router();

const ProductManager = require('../../dao/fileManagers/ProductManager');
const productos = new ProductManager('./src/file/dataProducts.json');

router.get('/', async (req, res) =>{
    //Traer todos los productos
    const product =  await productos.getProducts();

    //Query limit
    const { limit } = req.query;

    if(limit > 0){
        let listProduct =  product.slice(0, limit);

        return res.status(220).json({
            status: "success",
            data: listProduct
        })

    }else{  
        return res.status(220).json({
            status: "success",
            data: product
        })           
    }
})

router.get('/:pid', async (req, res) =>{
    //Parametro id
    const { pid } = req.params;    
    const product =  await productos.getProductsById(Number(pid));

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

router.put('/:pid' , async (req, res) => {
    //Parametro id
    const { pid } = req.params; 
 
    const product =  await productos.updateProduct( Number(pid) , req.body);
    
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

    const product =  await productos.deleteProduct(Number(pid));
    
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