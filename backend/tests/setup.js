// setup.js
const { app, server } = require('../tests/mainT');

beforeAll((done) => {
  server.on('listening', () => {
    console.log('Server avviato correttamente');
    done();
  });
});

afterAll((done) => {
  server.close((err) => {
    if (err) {
      console.error('Errore durante la chiusura del server:', err);
      done.fail(err);  // Fai fallire il test se ci sono errori nella chiusura del server
    } else {
      console.log('Server chiuso correttamente');
      done();
    }
  });
});
