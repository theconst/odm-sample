

module.exports = {

    notFoundError: entityInfo => {
        throw {
            message: `${entityInfo} is not found`,
            status: 404,
        }
    },

    conflictError: entityInfo => {
        throw {
            message: `${entityInfo} already exists`,
            status: 409,
        }
    },

    badRequestError: msg => {
        throw {
            message: msg,
            status: 400,
        }
    }
}