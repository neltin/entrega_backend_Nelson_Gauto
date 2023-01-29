const { messagesModel } =  require("../models/messages.models");

class MessagesManager {
    async getMessages() {
        try{               
            const listMessage = await messagesModel.find();

            if(listMessage.length > 0 ){
                return{        
                    status: "success",
                    data: listMessage
                }
            }else{
                return {
                    status: "error",
                    error:`No hay Mensajes disponibles.`
                };
            }
        }

        catch(error) {
            throw new Error(`Hubo un error en getMessages => ${error.message}`);
        }        
    }
  
    async addMessages(msj){
        try{
            const nuevoMsj = await messagesModel.create(msj);  

            return {        
                status: "success",
                data: nuevoMsj
            }
        }
        catch(error) {
            return {
                status: "error",
                error:`Hubo un error en addMessages => ${error.message}` 
            };            
        } 
    }
}

module.exports = MessagesManager;