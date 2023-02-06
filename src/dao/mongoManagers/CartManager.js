const { cartsModel } =  require("../models/carts.models.js");
const ProductManager = require('./ProductManager');


class CartManager extends ProductManager {
    //Nuevo carrito
    async newCart(){
        try{
            const nuevoCart = await cartsModel.create({"products": [] });

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
        try{               
            const listCart = await cartsModel.find();

            if(listCart.length > 0){
                return{        
                    status: "success",
                    data: listCart
                }
            }else{
                return {
                    status: "error",
                    error:`No hay carritos disponibles.` 
                };
            }
        }

        catch(error) {
            throw new Error(`Hubo un error en getCarts => ${error.message}`);
        }        
    }

    //Trae un carrito
    async getCartsById(id){
        try{ 
            const cart = await cartsModel.findById(id);

            console.log(cart);

            if(!cart){
                return {
                    status: "error",
                    error:`Hubo un error => El carrito con el ID: ${id} no existe o no se encuentra disponible.`
                };
            }

            return {        
                status: "success",
                data: cart
            }
        }
        catch(error){
            return {
                status: "error",
                error:`Hubo un error en getCartsId => ${error.message}`  
            };
        }           
    }

    //Trae un carrito
    async getCartPopulateById(id){
        try{ 
            const cart = await cartsModel.findById(id).populate("products._id");

            console.log(cart);

            if(!cart){
                return {
                    status: "error",
                    error:`Hubo un error => El carrito con el ID: ${id} no existe o no se encuentra disponible.`
                };
            }

            return {        
                status: "success",
                data: cart
            }
        }
        catch(error){
            return {
                status: "error",
                error:`Hubo un error en getCartsId => ${error.message}`  
            };
        }           
    }


    //Agrega un producto al carrito
    async addProductCart(cid, pid, quantity){
        try{
            const product = await this.getProductsById(pid);
            const cart = await this.getCartsById(cid);

            
            if(product.status == "success" && cart.status == "success"){
                const listProduct = cart.data.products;

                console.log("listProduct", listProduct)
                const existsP = listProduct.find(p => p._id == pid);
                console.log("pid: ", pid)                
console.log("existe: ", existsP)
                let cUpdate;

                 let updateProduct;

                 if(existsP){
                    updateProduct = listProduct.map( (p) => p._id == pid ?  { _id: pid, quantity: quantity } : p );

                     cUpdate = await cartsModel.findByIdAndUpdate({ _id: cid } , { products: updateProduct })

                }else{ 
                    updateProduct = [{ _id: pid , quantity: quantity }];   

                    cUpdate = await cartsModel.findByIdAndUpdate({ _id: cid } , { $push: {products: updateProduct }})
                }

                return {        
                    status: "success",
                    data: cUpdate
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


    //Agrega lista de productos al carrito
    async addListProductCart(cid, data){
        try{
            const listProduct = await this.getProducts();
            const cart = await this.getCartsById(cid);

            console.log(cart);

            if(listProduct.status == "success" && cart.status == "success"){
                /*[
                    {"_id": "63d2d1190598007545dbcba0", "quantity": 2},
                    {"_id": "63d2d1190598007545dbcba2", "quantity": 4}
                ]*/

                const cUpdate = await cartsModel.findByIdAndUpdate({ _id: cid } , { products: data });

                return {        
                    status: "success",
                    data: cUpdate
                }
            }else{
                return {        
                    status: "error",
                    error: `El carrito con el id: ${cid} no existe o no hay lista de productos cargados.`
                }
            }
        }
    
        catch(error){
            return {
                status: "error",
                error:`Hubo un error en addListProductCart => ${error.message}` 
            };
        }
    }



    //Eliminar producto del carrito
    async deleteCartProducts(cid, pid){
        try{
            const product = await this.getProductsById(pid);
            const cart = await this.getCartsById(cid);

            
            if(product.status == "success" && cart.status == "success"){
                const listProduct = cart.data.products;
                const existsP = listProduct.find(p => p._id == pid);

                let cUpdate;

                 let updateProduct;

                 if(existsP){
                    updateProduct = listProduct.filter( (p) => p._id != pid );
                    cUpdate = await cartsModel.findByIdAndUpdate({ _id: cid } , { products: updateProduct })

                }else{ 
                    return {
                        status: "error",
                        error:`El producto no existe` 
                    };
                }

                return {        
                    status: "success",
                    data: cUpdate
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

    //Elimina un carrito
    async deleteCart(id){
        try{ 
            const listCart = await cartsModel.findByIdAndDelete(id);

            if(!listCart){
                return {
                    status: "error",
                    error:`Hubo un error => El producto con el ID: ${id} no existe o no se encuentra disponible.` 
                };                

            }else{      
                return {
                    status: "success",
                    data:`El producto con el ID: ${id} fue eliminado exitosasmente` 
                };
            }
        }
        catch(error){
            return {
                status: "error",
                error:`Hubo un error al eliminar el producto: error => ${error.message}` 
            };
        }           
    }
}

module.exports = CartManager;