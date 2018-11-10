const db = require('./db');
const models = require('./models');

const r = db.Reader;
const u = r.unit();
const Session = db.Session;

const Company = models.Company;
const Employee = models.Employee

module.exports = require('express').Router()
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
.get('/:companyId', (req, res) => {
    const id = req.params.companyId;
    return Session.exec(() => Company.openId(id)
        .tap(c => c ? res.json(c) 
                    : res.sendStatus(404)
                        .send(`Company ${id} not found`)));
})
.get('/:companyId/employees', (req, res) => {
    const id = req.params.companyId;
    return Session.exec(() => Company.existsId(id)
        .flatMap(exists => exists 
            ? Employee.findBy({ 'Company': id })
                .tap(employees => res.json(employees))
            : u.tap(() => res.sendStatus(404)
                .send(`Company ${id} not found`))));
})
.get('/:companyId/averageSalary', (req, res) => {
    const id = req.params.companyId;
    return Session.exec(() => Company.openId(id, [])
        .flatMap(company => {
            if (company) {
                return company.averageEmployeeSalary()
                    .tap(value => res.json(value && value[0]));
            } else {
                return u.tap(() => res.sendStatus(404)
                    .send(`Company ${id} not found`));
            }
        }));
});