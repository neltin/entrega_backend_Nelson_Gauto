const ProductManager = require('./ProductManager');

const fs = require('fs/promises');
const { existsSync } = require('fs');


class CartManager extends ProductManager {  
    static contId = 0;

    constructor(path , pathCart) {
        super(path);
        this.pathCart = pathCart;
    }

    //Nuevo carrito
    async newCart(){
        try{
            let nuevoCart;        
            if (existsSync(this.pathCart)) {        
                const listCart = await fs.readFile(this.pathCart, 'utf-8');

                if(listCart.length > 0){
                    const data = JSON.parse(listCart);
                    //Sumar al contador si hay algun dato en el JSON
                    if(data.length > 0){
                        CartManager.contId = Number(data[data.length - 1].id) + 1;
                    }
                    
                    nuevoCart = [...data, { id: CartManager.contId , "products": [] } ]
             
                    await fs.writeFile( this.pathCart, JSON.stringify( nuevoCart , null , '\t') );

                }else{
                    CartManager.contId =+ 1;   
                    nuevoCart = { id: CartManager.contId , "products": [] }  

                    await fs.writeFile( this.pathCart, JSON.stringify( [nuevoCart] , null , '\t') );
                }

            }else{
                CartManager.contId =+ 1;
                nuevoCart = { id: CartManager.contId , "products": [] } 

                await fs.writeFile( this.pathCart, JSON.stringify( [nuevoCart] , null , '\t') );
            }

            return {        
                status: "success",
                data: nuevoCart
            }
        }

        catch(error) {
            return {
                status: "error",
                error:`Hubo un error en newCart => ${error.message}` 
            };             
        }


    }
    
    //Traer todos los carritos
    async getCarts() {
        try {
            if (existsSync(this.pathCart)) {        
                const listCart = await fs.readFile(this.pathCart, 'utf-8');

                if(listCart.length > 0){
                    const data = JSON.parse(listCart);

                    return {        
                        status: "success",
                        data: data
                    }
                }else{
                    return {
                        status: "error",
                        error:`Hubo un error => No hay carritos disponibles.` 
                    };
                } 
            }else{
                return {
                    status: "error",
                    error:`Hubo un error => No hay carritos disponibles.` 
                };
            } 
        }
        catch(error){
            return {
                status: "error",
                error:`Hubo un error en updateProduct => ${error.message}` 
            };
        }
    }

    async getCartsById(id) {
        try {        
            const listCart = await this.getCarts();         
            const cId = listCart.data.findIndex(c => c.id === id);
            
            if(cId < 0 ){
                return {
                    status: "error",
                    error:`Hubo un error => El carrito con el ID: ${id} no existe o no se encuentra disponible.` 
                };
            }

            return {        
                status: "success",
                data: listCart.data[cId]
            }  
        }
        catch(error){
            return {
                status: "error",
                error:`Hubo un error en getCartsId => ${error.message}` 
            };
        }
    }


    async addProductCart(cid, pid){
        try{
            const product = await this.getProductsById(Number(pid));
            const cart = await this.getCartsById(Number(cid));
            const carts = await this.getCarts();


            if(product.status == "success" && cart.status == "success"){
                const listProduct = cart.data.products;


                const existsP = listProduct.find(p => p.id == pid);
                
                let quantity = 1;
                let updateProduct;

                if(existsP){
                    quantity = existsP.quantity + 1; 

                    updateProduct = listProduct.map( (p) => p.id == pid ?  { ...existsP, quantity: quantity } : p );


                }else{ 
                    updateProduct = [ ...listProduct , { id: Number(pid) , quantity: quantity }];   
                }
                        
                console.log("updateProduct: ", updateProduct )
                console.log("carts: ", carts.data )
                
                const updateCarts = carts.data.map( (c) => c.id == cid ?  { id: c.id, products: [...updateProduct] } : c );
                
                console.log("updateCarts: ", updateCarts)

                await fs.writeFile( this.pathCart, JSON.stringify(updateCarts, null, '\t') )

                return {        
                    status: "success",
                    data: updateCarts
                }

            }
        }
    
        catch(error){
            return {
                status: "error",
                error:`Hubo un error en addProductCart => ${error.message}` 
            };
        }
    }
}

module.exports = CartManager;