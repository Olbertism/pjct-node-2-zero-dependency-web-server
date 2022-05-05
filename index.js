import http from 'node:http';
import fs from 'node:fs';

//const filesys = fs.promises;

const server = http.createServer(function (request, response) {
  // 1. check request method
  if (request.method === 'GET') {
    console.log('Received GET request');
    fs.readFile('public/index.html', 'binary', (err, contents) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write(err + '\n');
        response.end();
        return;
      }
      response.writeHead(200);
      response.write(contents, 'binary');
      response.end();
    });
  }
  if (request.method === 'POST') {
    // 2. response in head
    response.writeHead(200, { 'content-type': 'text/plain' });
    // something something

    // 4. handle invalid request methods
  } else {
    response.writeHead(405, { 'content-type': 'text/plain' });
  }
});

server.listen(3000);
