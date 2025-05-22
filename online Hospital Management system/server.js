const http = require('http');
const querystring = require('querystring');

const PORT = 3000;

const renderForm = () => `
  <html>
    <body>
      <h2>User Information Form</h2>
      <form action="/submit" method="GET">
        Name: <input type="text" name="name" required><br><br>
        Age: <input type="number" name="age" required><br><br>
        DOB: <input type="date" name="dob" required><br><br>
        Address: <input type="text" name="address" required><br><br>
        Pincode: <input type="text" name="pincode" required><br><br>
        Mobile No: <input type="text" name="mobile" required><br><br>
        <input type="submit" value="Submit">
      </form>
    </body>
  </html>
`;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderForm());

    } else if (req.method === 'POST' && req.url === '/submit') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = querystring.parse(body);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <h2>Submitted Details:</h2>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Age:</strong> ${data.age}</p>
              <p><strong>DOB:</strong> ${data.dob}</p>
              <p><strong>Address:</strong> ${data.address}</p>
              <p><strong>Pincode:</strong> ${data.pincode}</p>
              <p><strong>Mobile No:</strong> ${data.mobile}</p>
              <br><a href="/">Go Back</a>
            `);
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});