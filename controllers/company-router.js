'use strict';

const db = require('./db');
const models = require('./models');

const Session = db.Session;

const Company = models.Company;
const Employee = models.Employee;

const errors = require('./errors');
const notFoundError = errors.notFoundError;
const badRequestError = errors.badRequestError;

module.exports = require('express-promise-router')()
.get('/list', (_, res) => {
    return Session.exec(() => Company.findAll())
        .tap(all => res.json(all));
})
.get('/', (req, res) => {
    const query = req.query;
    query.Name
        || badRequestError('Search by name only');

    return Session.exec(() => Company.findBy(searchBy)
            .tap(result => result && result.length || notFoundError()))
        .tap(company => res.json(company));
})
.get('/:companyId', (req, res) => {
    const id = req.params.companyId;
    return Session.exec(() => Company.openId(id)
            .tap(company => company || notFoundError('company')))
        .tap(company => res.json(company));
})
.get('/:companyId/employees', (req, res) => {
    const id = req.params.companyId;
    return Session.exec(() => Company.existsId(id)
            .tap(exists => exists || notFoundError())
            .flatMap(() => Employee.findBy({'Company': id})))
        .tap(company => res.json(company));
})
.get('/:companyId/averageSalary', (req, res) => {
    const id = req.params.companyId;
    return Session.exec(() => Company.openId(id, [])
            .tap(company => company || notFoundError())
            .flatMap(company => company.averageEmployeeSalary()))
        .tap(company => res.json(company));
});