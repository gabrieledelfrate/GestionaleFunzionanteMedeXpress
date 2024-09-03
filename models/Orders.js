const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    utente: { type: String, required: true },
    carrello: [{
        nome: { type: String, required: true },
        prezzo: { type: Number, required: true },
        quantita: { type: Number, required: true },
    }],
    totale: { type: Number, required: true },
    stato: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    cardInfo: { type: Object },
    dataCompletamento: { type: Date },
});

const orders = mongoose.model('orders', OrderSchema);

module.exports = orders;
