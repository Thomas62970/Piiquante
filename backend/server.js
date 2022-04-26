//importation du package http
const http = require('http');
//importation du fichier app.js
const app = require('./app');
//création d'une fonction pour renvoyer un port valide
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
//indique à express sur quel port elle doit tourner
const port = normalizePort(process.env.PORT ||'3000');
app.set('port', port);
//creation d'une fonction qui va rechercher les erreurs et les gérer de maniéres appropripriées
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//creation du serveur qui reçoit la fonction app
const server = http.createServer(app);
// appel de la fonction errorHandler
server.on('error', errorHandler);
//ecoute du port du serveur
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
//écoute du serveur
server.listen(port);
