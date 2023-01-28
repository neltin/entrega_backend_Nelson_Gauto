
// const ProductManager = require('./dao/fileManagers/ProductManager');
// const p = new ProductManager('./src/file/dataProducts.json');

const  ProductManager  = require("./dao/mongoManagers/ProductManager");
const p = new ProductManager();

const io = (socketServer) =>{
    
    socketServer.on("connection", async (socket) =>{
        console.log("Cliente conectado")

        //Funcion para actualizar vista
        const getP = async() =>{
            const product = await p.getProducts();
            
            if(product){
                const data = [...product.data]
                socketServer.emit("getProducts", data);

            }else{
                socket.emit("msj", "No hay productos agregados");
            }
        }
        
        //Inicialización
        getP();

        socket.on("addProducts", async (data) =>{
            if(data.title && data.description && data.price && data.code && data.category && data.stock){
                const status= !data.status ? true : data.status;
                
                const product = await p.addProduct( {...data, status: status} );

                if(product.status == "success"){

                    getP();
                    socket.emit("msj", "Se guardo exitosamente");
                }else{
                    socket.emit("msj", product.error);
                }
            } 
        });

        socket.on("deleteProducts", async (data) =>{
            if(data){ 
                const product = await p.deleteProduct(data);

                if(product.status == "success"){
                    getP();
                    socket.emit("msj", "Se elimino exitosamente");
                }else{
                    socket.emit("msj", product.error);
                }
            }
        });
    })
}

module.exports ={ io };