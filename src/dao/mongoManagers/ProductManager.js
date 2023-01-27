const { ProductsModel } =  require("../models/products.models.js");

class ProductManager {
    async getProducts() {
        try{               
            const listProduct = await ProductsModel.find();

            if(listProduct.length > 0 ){
                return{        
                    status: "success",
                    data: listProduct
                }
            }else{
                return {
                    status: "error",
                    error:`No hay productos disponibles.`
                };
            }
        }

        catch(error) {
            throw new Error(`Hubo un error en getProducts => ${error.message}`);
        }        
    }
  
    async addProduct(producto){
        try{
            if(!producto.id){ 
                const listProduct = await this.getProducts();
                const c =  listProduct.data.find(p => p.code === producto.code);
                
                if(c){
                    return {
                        status: "error",
                        error:`Hubo un error => Se repitio el codigo ${producto.code}` 
                    };             
                }else{
   
                    const nuevoProducto = await ProductsModel.create(producto);  

                    return {        
                        status: "success",
                        data: nuevoProducto
                    }
                }
            }else{
                return {
                    status: "error",
                    error:`Hubo un error => El campo id no se debe completar.` 
                };
            }
        }
        catch(error) {
            return {
                status: "error",
                error:`Hubo un error en addProduct => ${error.message}` 
            };            
        } 
    }

    async getProductsById(id){
        try{ 
            const listProduct = await ProductsModel.findById(id);
            if(!listProduct){
                return {
                    status: "error",
                    error:`Hubo un error => El producto con el ID: ${id} no existe o no se encuentra disponible.` 
                };
            }

            return {        
                status: "success",
                data: listProduct
            }
        }
        catch(error){
            return {
                status: "error",
                error:`Hubo un error => El producto con el ID: ${id} no existe o no se encuentra disponible.` 
            };
        }           
    }

    async updateProduct(pid, producto) {
        try{
            if(!producto.id){
                const listProduct = await ProductsModel.findByIdAndUpdate(pid, producto);

                if(listProduct){
                    return {        
                        status: "success",
                        data: listProduct
                    }
                }else{
                    return {
                        status: "error",
                        error:`Hubo un error => el producto con el ID: ${pid} no existe.` 
                    };                    
                }            
            }else{
                return {
                    status: "error",
                    error:`Hubo un error => El campo id no se debe completar.` 
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

    async deleteProduct(id){
        try{ 
            const listProduct = await ProductsModel.findByIdAndDelete(id);

            if(!listProduct){
                return {
                    status: "error",
                    error:`Hubo un error => El carrito con el ID: ${id} no existe o no se encuentra disponible.` 
                };                

            }else{      
                return {
                    status: "success",
                    data:`El carrito con el ID: ${id} fue eliminado exitosasmente` 
                };
            }
        }
        catch(error){
            return {
                status: "error",
                error:`Hubo un error al eliminar el carrito: error => ${error.message}` 
            };
        }           
    }
}

module.exports = ProductManager;