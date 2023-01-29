
// const ProductManager = require('./dao/fileManagers/ProductManager');
// const p = new ProductManager('./src/file/dataProducts.json');

const  ProductManager  = require("./dao/mongoManagers/ProductManager");
const p = new ProductManager();

const  MenssagesManager  = require("./dao/mongoManagers/MenssagesManager");
const menssages = new MenssagesManager();

const io = (socketServer) =>{
    //const messages = [];   
    socketServer.on("connection", async (socket) =>{
        console.log("Cliente conectado")

        //Funcion para actualizar vista
        const getP = async() =>{
            const product = await p.getProducts();
            
            if(product.data){
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

        /*Socket Chat */
        socket.on("message", (data)=>{
            console.log("evento message:", data);

        });


        const getChats = async() =>{
            const msj =  await menssages.getMessages();

            if(msj.data){
                const data = msj.data
                socket.emit('msj-chat', data);
            }
        }

        //chat
        socket.on('login', (user) => {
            //Cuando se conecta un nuevo usuario entregamos todos los mensajes

            getChats();            
            //Si se conecta le da la bienvenida
            socket.emit('welcome', user);

            //Nuevo usuario conectado
            socket.broadcast.emit('new-user', user);
        });

        socket.on('msj', async (data) => {
            const msj =  await menssages.addMessages(data);

            console.log(msj)

            if(msj.data){
                const data = [msj.data]
                socket.emit('msj-chat', data);
            }           

            getChats();
        })
    })
}

module.exports ={ io };