'use strict';

const db = require('./db');
const errors = require('./errors');
const models = require('./models');

const Session = db.Session;

const Employee = models.Employee;
const Company = models.Company;
const Person = models.Person;

const notFoundError = errors.notFoundError;
const badRequestError = errors.badRequestError;

module.exports = require('express-promise-router')()
.post('/', (req, res) => {
    const employeeFields = req.body;
    if (employeeFields.ID) {
        badRequestError('Use put method for existing employees');
    }
    return Session.transact(() => 
            Object.assign(new Employee(), employeeFields).save())
        .tap(saved => res.json(saved));
})
.put('/', (req, res) =>  {
    const employee = req.body;

    return Session.transact(() => Employee.openId(employee.ID, [])
        .flatMap((employeeToUpdate) => {
            return Object.assign(employeeToUpdate, employee).update();
        }))
        .tap(() => res.sendStatus(200));
})
.delete('/:employeeId', (req, res) => {
    const id = req.params.employeeId;
    return Session.transact(() => employee.deleteId(id))
        .tap(() => res.json("acknowledged"));
})
.get('/list', (_, res) => {
    return Session.exec(() => Employee.findAll())
        .tap(all => res.json(all));
})
.get('/', (req, res) => {
    const query = req.query;
    const searchField = query.Name || query.Company;
    if (!searchField) {
        badRequestError('Illegal search field. Search by name or company only');
    }
    return Session.exec(() => Employee.findBy(query))
            .tap(result => result || notFoundError('employee'))
            .tap(result => result.length || notFoundError('employee'))
            .tap(employee => res.json(employee));
})
.get('/:employeeId', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id))
        .tap(employee => employee || notFoundError('employee'))
        .tap(employee => res.json(employee));
})
.get('/:employeeId/spouse', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id, ['ID'])
            .tap(employee => employee || notFoundError('employee'))
            .flatMap(foundEmployee => Person.openId(foundEmployee.Spouse)))
        .tap(spouse => spouse || notFoundError('spouse'))
        .tap(spouse => res.json(spouse));
})
.get('/:employeeId/company', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id, ['Company'])
            .tap(employee => employee || notFoundError('employee'))
            .flatMap(foundEmployee => Company.openId(foundEmployee.Company)))
        .tap(company => company || notFoundError('company'))
        .tap(company => res.json(company));
});