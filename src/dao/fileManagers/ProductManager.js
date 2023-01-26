const fs = require('fs/promises');
const { existsSync } = require('fs');

class ProductManager {  
    static contId = 0;

    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try{        
            if (existsSync(this.path)) {        
                const listProduct = await fs.readFile(this.path, 'utf-8');
            
                if(listProduct.length > 0){
                    const data = JSON.parse(listProduct);

                    //Sumar al contador si hay algun dato en el JSON
                    if(data.length > 0){
                        ProductManager.contId = data[data.length -1].id + 1;
                    }

                    return data;

                }else{
                    return  await fs.writeFile( this.path, JSON.stringify( [] , null , '\t') );
                }

            }else{
                return await fs.writeFile( this.path, JSON.stringify( [] , null , '\t') );
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
                const c =  listProduct.find(p => p.code === producto.code);
                
                if(c){
                    return {
                        status: "error",
                        error:`Hubo un error => Se repitio el codigo ${producto.code}` 
                    };             
                }else{
                    const nuevoProducto = {
                        id: ProductManager.contId,
                        ...producto
                    }
                    
                    listProduct.push(nuevoProducto);
                    await fs.writeFile( this.path, JSON.stringify( listProduct , null , '\t') );
                    
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
            const listProduct = await this.getProducts();    
            const pId = listProduct.findIndex(p => p.id === id);

            if(pId < 0 ){
                return {
                    status: "error",
                    error:`Hubo un error => El producto con el ID: ${id} no existe o no se encuentra disponible.` 
                };
            }

            return {        
                status: "success",
                data: listProduct[pId]
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
                const listProduct = await this.getProducts();
                const productUpdate = listProduct.filter( p => p.id === pid );
                console.log(productUpdate);

                if(productUpdate.length === 1){
                    const newListProduct = listProduct.map( (p) => {
                            if(pid === p.id){
                                return { ...productUpdate[0], ...producto };
                            }else{
                                return p;
                            }
                        }
                    );
                    
                    await fs.writeFile( this.path, JSON.stringify(newListProduct, null, '\t') )
                    return {        
                        status: "success",
                        data: newListProduct.filter( p => p.id === pid )
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
            const listProduct = await this.getProducts();    
            const pId = listProduct.findIndex(p => p.id == id);

            if(pId < 0 ){
                return {
                    status: "error",
                    error:`Hubo un error => El producto con el ID: ${id} no existe o no se encuentra disponible.` 
                };                

            }else{
                const productDelete = listProduct.filter( p => p.id !== id );
                await fs.writeFile(this.path, JSON.stringify(productDelete, null, '\t'));
                
                return {
                    status: "success",
                    error:`El producto con el ID: ${id} fue eliminado exitosasmente` 
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

module.exports = ProductManager;