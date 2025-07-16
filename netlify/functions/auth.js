const fs = require('fs');
const path = require('path');

// La password verrà gestita tramite variabili d'ambiente di Netlify
// const PASSWORD = process.env.PASSWORD;

exports.handler = async (event, context) => {
  const { headers, path: requestPath } = event;
  const basicAuth = headers.authorization;

  // Password hardcoded per il test iniziale. 
  // In produzione, usare process.env.PASSWORD
  const PASSWORD = 'password'; 

  if (basicAuth) {
    const encodedCreds = basicAuth.split(' ')[1];
    const decodedCreds = Buffer.from(encodedCreds, 'base64').toString();
    const [username, password] = decodedCreds.split(':');

    if (password === PASSWORD) {
      // Se la password è corretta, servi il file richiesto
      let filePath = requestPath === '/' ? '/index.html' : requestPath;
      const fullPath = path.join(__dirname, '..', '..', filePath);

      try {
        const fileContent = fs.readFileSync(fullPath);
        let contentType = 'text/plain';

        if (filePath.endsWith('.html')) {
          contentType = 'text/html';
        } else if (filePath.endsWith('.css')) {
          contentType = 'text/css';
        } else if (filePath.endsWith('.js')) {
          contentType = 'application/javascript';
        } else if (filePath.endsWith('.json')) {
          contentType = 'application/json';
        } else if (filePath.endsWith('.png')) {
          contentType = 'image/png';
        }

        return {
          statusCode: 200,
          headers: {
            'Content-Type': contentType,
          },
          body: fileContent.toString('base64'),
          isBase64Encoded: true,
        };
      } catch (error) {
        return {
          statusCode: 404,
          body: 'File non trovato',
        };
      }
    }
  }

  // Se la password è sbagliata o non fornita, richiede l'autenticazione
  return {
    statusCode: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Sito Protetto"',
    },
    body: 'Accesso negato',
  };
};