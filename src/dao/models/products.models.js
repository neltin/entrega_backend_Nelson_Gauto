//import mongoose from "mongoose";
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    thumbnails:{
        type: [String]
    },
    code:{
        type: String,
        required:true,
        unique:true
    },
    category:{
        type: String,
        required:true
    },
    status:{
        type: Boolean,
        default:true
    },
    stock:{
        type: Number,
        required:true
    }
});

//Plugin de mongoose Paginate
productsSchema.plugin(mongoosePaginate);

module.exports = { 
    ProductsModel: mongoose.model(productsCollection,productsSchema),
    productsCollection: productsCollection
};