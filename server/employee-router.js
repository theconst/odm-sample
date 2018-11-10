const db = require('./db');

const models = require('./models');

const r = db.Reader;
const Session = db.Session;

const Employee = models.Employee;
const Company = models.Company;
const Person = models.Person;

module.exports = require('express').Router()
.post('/', (req, res) => {
    const employeeFields = req.body;

    return Session.transact(() => employee
        .existId(employeeFields.ID)
        .tap(exists => exists 
            ? () => res.sendStatus(409)
            : Object.assign(new Employee(), employeeFields).save()
                .tap(() => res.sendStatus(200))))
    })
.put('/', (req, res) => {
    return Session.exec(() => employee.openId(req.body.ID)
        .tap(employeeToUpdate => employeeToUpdate 
                ? Object.assign(employeeToUpdate, employee)
                    .save()
                    .tap(p => res.json(p))
                : res.sendStatus(404)));
})
.delete('/:employeeId', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => employee.deleteId(id));
})
.get('/list', (_, res) => {
    return Session.exec(() => Employee.findAll())
        .tap(all => res.json(all));
})
.get('/', (req, res) => {
    const query = req.query;
    const searchBy = query.Name || query.Company;
    if (!searchBy) {
        return res.sendStatus(400);
    }
    return Session.exec(() => {
        return employee.findBy(query)
            .tap(result => {
                if (result && result.length) {
                    res.send(result);
                } else {
                    res.sendStatus(404);
                }
            });
    });
})
.get('/:employeeId', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id)
        .tap(employee => employee 
            ? res.json(employee) 
            : res.sendStatus(404)
                .send('Emploee not found')));
})
.get('/:employeeId/spouse', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id, ['Spouse'])
        .flatMap(foundEmployee => Person.openId(foundEmployee.Spouse))
        .tap(spouse => spouse 
            ? res.json(spouse) 
            : res.sendStatus(404)
                .send('Spouse not found')));
})
.get('/:employeeId/company', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id, ['Company'])
        .flatMap(foundEmployee => Company.openId(foundEmployee.Company))
        .tap(company => company
            ? res.json(company)
            : res.sendStatus(404)));
});