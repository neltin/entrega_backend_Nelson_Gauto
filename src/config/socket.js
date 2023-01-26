
const ProductManager = require('../dao/fileManagers/ProductManager');
const p = new ProductManager('./src/file/dataProducts.json');

const io = (socketServer) =>{
    
    socketServer.on("connection", async (socket) =>{
        console.log("Cliente conectado")

        const product = await p.getProducts();

        if(product.length > 0){
            const data = [...product]
            socketServer.emit("getProducts", data);

        }else{
            socket.emit("msj", "No hay productos agregados");
        }

        socket.on("addProducts", async (data) =>{
            console.log(data);

            if(data.title && data.description && data.price && data.code && data.category && data.stock){
                const status= !data.status ? true : data.status;
                
                const product = await p.addProduct( {...data, status: status} );
                console.log("product: ", product)

                if(product.status == "success"){
                    socket.emit("msj", "Se guardo exitosamente");
                }else{
                    socket.emit("msj", product.error);
                }
            } 
        });

        socket.on("deleteProducts", async (data) =>{
            console.log(data);

            if(data){ 
                const product = await p.deleteProduct(Number(data));
                console.log("product: ", product)

                if(product.status == "success"){
                    socket.emit("msj", "Se elimino exitosamente");
                }else{
                    socket.emit("msj", product.error);
                }
            }

        });
    })
}

module.exports ={ io };