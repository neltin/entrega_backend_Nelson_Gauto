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
    async addProductCart(cid, pid){
        try{
            const product = await this.getProductsById(pid);
            const cart = await this.getCartsById(cid);

            
            if(product.status == "success" && cart.status == "success"){
                const listProduct = cart.data.products;
                const existsP = listProduct.find(p => p._id == pid);

                let cUpdate;

                 let quantity = 1;
                 let updateProduct;

                 if(existsP){
                    quantity = existsP.quantity + 1; 

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
                    console.log("pid: ", pid)

                    updateProduct = listProduct.filter( (p) => p._id != pid );
console.log("updateProduct: ", updateProduct)
                    cUpdate = await cartsModel.findByIdAndUpdate({ _id: cid } , { products: updateProduct })

                }else{ 
                    // updateProduct = [{ _id: pid , quantity: quantity }];   

                    // cUpdate = await cartsModel.findByIdAndUpdate({ _id: cid } , { $push: {products: updateProduct }})
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