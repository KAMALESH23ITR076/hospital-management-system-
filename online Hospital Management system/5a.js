// Node.js server to serve 5a.html
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const filePath = path.join(__dirname, '5a.html');

http.createServer((req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading 5a.html');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});