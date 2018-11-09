const db = require('./db');

const Reader = db.Reader;
const Session = db.Session;

const Pet = require('./models').Pet;

module.exports = require('express').Router()
.post('/', (req, res) => {
    const pet = new Pet(req.body);
    const id = pet.id;

    return Session.exec(() => Pet.existsId(id)
        .flatMap(exists => exists 
            ? Reader.unit().tap(() => res.sendStatus(409))
            : pet.save().tap(() => res.sendStatus(200))))
    })
.put('/', (req, res) => {
    const pet = new Pet(req.body);

    return Session.exec(() => pet.attach()
        .flatMap(petToUpdate => petToUpdate 
                ? Object.assign(petToUpdate, pet).save()
                    .tap(p => res.json(p))
                : Reader.unit()
                    .tap(() => res.sendStatus(404))));
})
.get('/list', (_, res) => {
    return Session.exec(() => Reader(connection => {
        //demonstrate direct usage
        return connection.queryPromise(`SELECT * FROM Samples.Pet`)
            .then(result => res.json({'content': result}));
    }));
})
.get('/', (req, res) => {
    const query = req.query;
    const searchBy = query.categories || query.name;
    if (!searchBy) {
        return res.sendStatus(400);
    }
    console.log(searchBy);
    return Session.exec(() => {
        return Pet.findBy(query)
            .tap(result => {
                if (result && result.length) {
                    res.send(result);
                } else {
                    res.sendStatus(404);
                }
            });
    }).catch(err => {
        console.log(`error: ${err.message}`);
        res.sendStatus(500);
    });
})
.get('/:petId', (req, res) => {
    const id = req.params.petId;
    return Session.exec(() => Pet.openId(id)
        .tap(pet => pet 
            ? res.json(pet) 
            : res.sendStatus(404)));
})
.delete('/:petId', (req, res) => {
    const id = req.params.petid;
    return Session.exec(() => Pet.deleteId(id));
});