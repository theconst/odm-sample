const db = require('./db');
const models = require('./models');

const Session = db.Session;

const Company = models.Company;
const Employee = models.Employee

module.exports = require('express-promise-router')()
.get('/list', (_, res) => {
    return Session
        .exec(() => Company.findAll())
        .tap(all => res.json(all));
})
.get('/', (req, res) => {
    const query = req.query;
    const searchBy = query.Name;
    if (!searchBy) {
        return res.sendStatus(400);
    }
    return Session.exec(() => {
        return Company.findBy(searchBy)
            .tap(result => {
                if (result && result.length) {
                    res.json(result);
                } else {
                    res.sendStatus(404);
                }
            });
    }).catch(err => {
        console.log(`error: ${err.message}`);
        res.sendStatus(500);
    });
})
.get('/:companyId', (req, res) => {
    const id = req.params.companyId;
    return Session.exec(() => Company.openId(id)
        .tap(c => c 
            ? res.json(c) 
            : res.status(404)
                .json({ message: `Company ${id} not found` })));
})
.get('/:companyId/employees', (req, res) => {
    const id = req.params.companyId;
    return Session.exec(() => Company.existsId(id)
        .tap(exists => exists 
            ? Employee.findBy({ 'Company': id })
                .tap(employees => res.json(employees))
            : res.sendStatus(404)
                .send({message: `Company ${id} not found` })));
})
.get('/:companyId/averageSalary', (req, res) => {
    const id = req.params.companyId;
    return Session.exec(() => Company.openId(id, [])
        .tap(company => company 
            ? company.averageEmployeeSalary()
                .tap(value => res.json(value && value[0]))
            : u.tap(() => res.sendStatus(404)
                .send({ message: `Company ${id} not found` }))));
});