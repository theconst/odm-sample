'use strict';

const db = require('./db');
const errors = require('./errors');
const models = require('./models');

const r = db.Reader;

const Session = db.Session;

const Employee = models.Employee;
const Company = models.Company;
const Person = models.Person;

const notFoundError = errors.notFoundError;
const conflictError = errors.conflictError;
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
    return Session.exec(() => employee.findBy(query))
            .tap(result => result || notFoundError('employee'))
            .tap(result => result.length || notFoundError('employee'))
            .tap(company => res.json(company));
})
.get('/:employeeId', (req, res) => {
    const id = req.params.employeeId;
    return Session.exec(() => Employee.openId(id))
        .tap(employee => employee || notFoundError('employee'))
        .tap(employee => res.json(employee));
})

// TODO(kko): unfortunately this does not work
.put('/:employeeId/picture', (req, res) => {
    const id = req.params.employeeId;
    const image = req.body.Picture;
    return Session.transact(() => Employee.existsId(id)
        .tap(exists => exists || notFoundError('employee'))
        .flatMap(() => {
            return r(connection => {
                // TODO(kko): Upadating an image not working

                const binary = Buffer.from(image, 'base64').toString('ascii');

                console.log(binary);

                console.log(binary.length);

                // TODO(kko): I really need some support for binary type on cacheodbc level
                return connection
                    // DML prepared statements bug - they cannot be used more than once
                    // Fix - reimplement execute in nanodbc library
                    .forcePrepareStatementPromise(
                        'UPDATE Sample.Employee AS e'
                        + ' SET e.Picture = CAST(? AS VARBINARY(2048))'
                        + ' WHERE e.ID = ?')
                    .then(statement => statement.executePromise([binary, id]));
            });
        }))
        .then(() => res.json("acknowledged"));
})
.get('/:employeeId/picture', (req, res) => {
    const id = req.params.employeeId;

    return Session.exec(() => Employee.openId(id, ['Picture']))
        .tap(employee => employee || notFoundError('employee'))
        .then(employee => employee['Picture'])
        .tap(picture => {
            res.status(200)
                .header('Content-Type', 'image/png')
                .send(new Buffer(picture, 'binary'));
        });
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