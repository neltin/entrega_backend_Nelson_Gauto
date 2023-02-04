const {Router} = require('express');
const router = Router();

const  CartManager  = require("../../dao/mongoManagers/CartManager");
const carrito = new CartManager();

router.get('/', async (req, res) =>{
    //Traer todos los productos
    const cart =  await carrito.getCarts();
    if(cart.status == 'error'){
        return res.status(404).json({
            ...cart
        })
    }     

    return res.status(220).json({
        ...cart
    })
})

router.get('/:cid', async (req, res) =>{
    //Parametro id
    const { cid } = req.params;  

    const cart =  await carrito.getCartsById(cid);

    if(cart.status == 'error'){
        return res.status(404).json({
            ...cart
        })
    }

    return res.status(220).json({
        ...cart
    })     
})


router.post('/' , async (req, res) => {
    
    const cart =  await carrito.newCart();
    if(cart.status == 'error'){
        return res.status(404).json({
            ...cart
        })
    }

    return res.status(220).json({
        ...cart
    }) 

})

router.put('/:cid/product/:pid' , async (req, res) => {
    const {cid, pid} = req.params;

    const cart =  await carrito.addProductCart(cid, pid);


    if(cart.status == 'error'){
        return res.status(404).json({
            ...cart
        })
    }

    return res.status(220).json({
        ...cart
    })
 })

 router.delete('/:cid' , async (req, res) => {
    //Parametro id
    const { cid } = req.params; 

    const cart =  await carrito.deleteCart(cid);
    
    if(cart.status == 'error'){
        return res.status(404).json({
            ...cart
        })
    }

    return res.status(220).json({
        ...cart
    }) 

})

router.delete('/:cid/product/:pid' , async (req, res) => {
    //Parametro id
    const { cid } = req.params; 
    const { pid } = req.params; 

    const cart =  await carrito.deleteCartProducts(cid, pid);
    
    if(cart.status == 'error'){
        return res.status(404).json({
            ...cart
        })
    }

    return res.status(220).json({
        ...cart
    }) 
})



module.exports = router;