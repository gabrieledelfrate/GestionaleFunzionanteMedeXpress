const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const orders = require('./models/Orders');

const app = express();

// Motore di template EJS
app.set('view engine', 'ejs');
app.use(express.static('public')); // CSS e JS

app.use(bodyParser.json());

// Connessione a MongoDB
mongoose.connect('mongodb+srv://ezmatteo:1408@medxpress.4y0mg.mongodb.net/medxpress?retryWrites=true&w=majority&appName=MedXpress')
    .then(() => {
        console.log('Connesso a MongoDB');
    })
    .catch(err => {
        console.error('Errore di connessione a MongoDB', err);
    });

// Rotta per visualizzare la pagina principale con la lista degli ordini
app.get('/', async (req, res) => {
    try {
        const ordini = await orders.find();
        console.log('Ordini trovati:', ordini); // Aggiunto per debugging
        res.render('index', { ordini });
    } catch (err) {
        console.error('Errore nel recupero degli ordini:', err); // Aggiunto per debugging
        res.status(500).json({ message: err.message });
    }
});

// Rotta per cercare ordini per utente
app.get('/ordini/search', async (req, res) => {
    const { utente } = req.query;
    try {
        const ordini = await orders.find({ utente: { $regex: utente, $options: 'i' } });
        res.json(ordini);
    } catch (err) {
        console.error('Errore nella ricerca degli ordini:', err); // Aggiunto per debugging
        res.status(500).json({ message: err.message });
    }
});

// Rotta per ottenere tutti gli ordini (API)
app.get('/ordini', async (req, res) => {
    try {
        const ordini = await orders.find();
        console.log('Ordini trovati:', ordini); // Aggiunto per debugging
        res.json(ordini);
    } catch (err) {
        console.error('Errore nel recupero degli ordini:', err); // Aggiunto per debugging
        res.status(500).json({ message: err.message });
    }
});

// Rotta per creare un nuovo ordine (API)
app.post('/ordini', async (req, res) => {
    const ordine = new orders({
        utente: req.body.utente,
        carrello: req.body.carrello,
        totale: req.body.totale,
        stato: req.body.stato,
        createdAt: req.body.createdAt,
        cardInfo: req.body.cardInfo,
        dataCompletamento: req.body.dataCompletamento,
    });

    try {
        const nuovoOrdine = await ordine.save();
        res.status(201).json(nuovoOrdine);
    } catch (err) {
        console.error('Errore nella creazione dell\'ordine:', err); // Aggiunto per debugging
        res.status(400).json({ message: err.message });
    }
});

// Rotta per ottenere un ordine specifico (API)
app.get('/ordini/:id', async (req, res) => {
    try {
        const ordine = await orders.findById(req.params.id);
        if (ordine == null) {
            return res.status(404).json({ message: 'Ordine non trovato' });
        }
        res.json(ordine);
    } catch (err) {
        console.error('Errore nel recupero dell\'ordine:', err); // Aggiunto per debugging
        res.status(500).json({ message: err.message });
    }
});

// Rotta per aggiornare un ordine (API)
app.patch('/ordini/:id', async (req, res) => {
    try {
        const ordine = await orders.findById(req.params.id);
        if (ordine == null) {
            return res.status(404).json({ message: 'Ordine non trovato' });
        }

        if (req.body.utente != null) {
            ordine.utente = req.body.utente;
        }
        if (req.body.carrello != null) {
            ordine.carrello = req.body.carrello;
        }
        if (req.body.totale != null) {
            ordine.totale = req.body.totale;
        }
        if (req.body.stato != null) {
            ordine.stato = req.body.stato;
        }
        if (req.body.cardInfo != null) {
            ordine.cardInfo = req.body.cardInfo;
        }
        if (req.body.dataCompletamento != null) {
            ordine.dataCompletamento = req.body.dataCompletamento;
        }

        const ordineAggiornato = await ordine.save();
        res.json(ordineAggiornato);
    } catch (err) {
        console.error('Errore nell\'aggiornamento dell\'ordine:', err); // Aggiunto per debugging
        res.status(400).json({ message: err.message });
    }
});

// Rotta per eliminare un ordine (API)
app.delete('/ordini/:id', async (req, res) => {
    try {
        const ordine = await orders.findById(req.params.id);
        if (ordine == null) {
            return res.status(404).json({ message: 'Ordine non trovato' });
        }

        await ordine.remove();
        res.json({ message: 'Ordine eliminato' });
    } catch (err) {
        console.error('Errore nell\'eliminazione dell\'ordine:', err); // Aggiunto per debugging
        res.status(500).json({ message: err.message });
    }
});

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
