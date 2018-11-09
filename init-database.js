const db = require('./db');

const Session = db.Session;
const Reader = db.Reader;

const logError = error => console.log(`Error: ${error}. Check that table does not alredy exist`);

Session.transact(() => 
    Reader(connection => 
        connection.executePromise(`
            CREATE TABLE Samples.Pet(
                id BIGINT not null,
                name VARCHAR(150) not null,
                quantity INT not null,
                categories VARCHAR(200) not null,
                CONSTRAINT PK_PET PRIMARY KEY (id)
            )`)
        .catch(logError)
    )
)
.finally(() => Session.destroy());
