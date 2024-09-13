// mainT.js
const app = require('../main');  // Assicurati che il percorso sia corretto

const server = app.listen(0, () => {
  console.log(`YouProjectDB listening at http://localhost:${server.address().port}`);
});

module.exports = { app, server };
