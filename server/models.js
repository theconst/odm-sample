const db = require('./db');
const Persistent = require('./db').Persistent;

const r = db.Reader;

const employeeFindAllProjection = [ 'ID', 'SSN', 'Name'];

module.exports = {
    Employee: class Employee extends Persistent {

        static findBy(keyValue) {
            return super.findBy(keyValue, employeeFindAllProjection);
        }

        static findAll() {
            return super.findAll(employeeFindAllProjection);
        }

        set FavoriteColorsList(value) {
            if (Array.isArray(value)) {
                this.FavoriteColors = value.join(',');
            } else if (typeof value === 'string') {
                this.FavoriteColors = value;
            } else {
                throw new TypeError('Illegal value type for FavouriteColorsList');
            }
        }

        get FavoriteColorsList() {
            return this.FavoriteColors && this.FavoriteColors.split(',');
        }

        // override specific fields for client
        toJSON() {
            return Object.assign({}, this, {
                'FavoriteColors': undefined,
                'FavoriteColorsList': this.FavoriteColorsList,
            });
        }
    },

    Company: class Company extends Persistent {

        averageEmployeeSalary() {
            // you can use raw sql if you wish
            return r(connection => 
                connection.prepareStatementPromise(`
                    SELECT AVG(e.Salary) as value
                    FROM Sample.Company AS c JOIN Sample.Employee AS e 
                    ON c.ID = e.Company
                    WHERE c.ID = ?
                `).then(statement => statement.queryPromise([this.ID])));
        }
    },

    Person: class Person extends Persistent {

    },
}