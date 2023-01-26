//import mongoose from "mongoose";
const mongoose = require("mongoose");
const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    products:{
        type: [{
            id: Number,
            quantity: Number
        }],
        required:true
    }
});

module.exports = { cartsModel: mongoose.model(cartsCollection,cartsSchema)};