const Persistent = require('./db').Persistent;

module.exports = {
    Pet: class Pet extends Persistent {

        constructor(other) {
            super();
            Object.assign(this, other);
        }
    }
}