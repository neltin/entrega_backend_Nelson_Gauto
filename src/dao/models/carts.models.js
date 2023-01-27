const mongoose = require("mongoose");
const { productsCollection } = require("./products.models");

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    products:{
        type: [{
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: productsCollection
            },
            quantity: {
                type: Number
            }
        }],
        default: []
    }
});

module.exports = { cartsModel: mongoose.model(cartsCollection,cartsSchema)};