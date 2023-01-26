const mongoose =  require("mongoose");
const db = "mongodb+srv://admin:admin@coder.ks8ggsg.mongodb.net/ecommerce?retryWrites=true&w=majority";

//conectamos a la base de datos
mongoose.set('strictQuery', false);

mongoose.connect(db,(err)=>{
    if(err) return console.log(`Hubo un error al conectarse a la base de datos ${err}`);
    console.log("conexion a la base de datos exitosa :)")
});