const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();
const HTTPS_PORT = 3000;
const HTTP_PORT = 5000;

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/jordan-dev.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/jordan-dev.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/jordan-dev.com/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca
};

app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
});
app.use(express.static(path.resolve(__dirname, 'build')));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(HTTP_PORT, () => console.log(`http server running on PORT: ${HTTP_PORT} -> 80`))
httpsServer.listen(HTTPS_PORT, () => console.log(`https server running on PORT: ${HTTPS_PORT} -> 443`))