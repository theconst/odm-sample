const db = require('./db');

const models = require('./models');

const Session = db.Session;

const Employee = models.Employee;
const Company = models.Company;
const Person = models.Person;

const errors = require('./errors');

const notFoundError = errors.notFoundError;
const conflictError = errors.conflictError;
const badRequestError = errors.badRequestError;

module.exports = require('express-promise-router')()
.post('/', (req, res) => {
    const employeeFields = req.body;

    return Session.transact(() => employee
            .existId(employeeFields.ID)
            .tap(exists => exists || conflictError('employee'))
            .flatMap(() => 
                Object.assign(new Employee(), employeeFields)
                    .save()))
        .tap(saved => res.json(saved));
    })
.put('/', (req, res) => 
    Session.transact(() => employee.openId(req.body.ID)
            .tap(employeeToUpdate => employeeToUpdate 
                || notFoundError('employee'))
            .flatMap(employeeToUpdate =>
                Object.assign(employeeToUpdate, employee)
                    .save()))
        .tap(updated => res.json(updated)))
.delete('/:employeeId', (req, res) => {
    const id = req.params.employeeId;
    return Session.transact(() => employee.deleteId(id))
            .then(() => "acknowledged")
        .tap(ack => res.json(ack));
})
.get('/list', (_, res) => {
    return Session.exec(() => Employee.findAll())
        .tap(all => res.json(all));
})
.get('/', (req, res) => {
    const query = req.query;
    query.Name || query.Company 
        || badRequestError('Illegal search field. Search by name or company only');

    return Session.exec(() => employee.findBy(query)
            .tap(result => result || notFoundError('employee'))
            .tap(result => result.length || notFoundError('employee')))
        .tap(company => res.json(company));
})
.get('/:employeeId', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id)
            .tap(employee => employee || notFoundError('employee')))
        .tap(employee => res.json(employee));
})
.get('/:employeeId/spouse', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id, ['Spouse'])
            .tap(employee => employee || notFoundError('employee'))
            .flatMap(foundEmployee => Person.openId(foundEmployee.Spouse))
            .tap(spouse => spouse || notFoundError('spouse')))
        .tap(spouse => res.json(spouse));
})
.get('/:employeeId/company', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id, ['Company'])
            .tap(employee => employee || notFoundError('employee'))
            .flatMap(foundEmployee => Company.openId(foundEmployee.Company))
            .tap(company => company || notFoundError('company')))
        .tap(compay => res.json(company));
});