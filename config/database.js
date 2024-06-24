const mongoose = require("mongoose");


module.exports.connect = async () => {
    try {
        await mongoose.connect("mongodb+srv://long17188:long842000@shop-online-sa.7nejdlq.mongodb.net/shop-online-SA");
        console.log("Connect Success!");
    } catch (error) {
        console.log("Connect Error!");
    }
}
