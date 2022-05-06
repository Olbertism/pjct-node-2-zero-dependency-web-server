import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

function handleReadFile(pathname, response, filetypes, ext) {
  console.log(`Request to ${pathname} with type ${ext}`);
  fs.readFile(pathname, (err, contents) => {
    if (err) {
      // console.log(err);
      if (err.code === 'EISDIR') {
        pathname += '/index.html';
        ext = '.html';
        console.log(
          `Caught invalid file request to dir. Requesting again with ${pathname} and type ${ext}`,
        );
        return handleReadFile(pathname, response, filetypes, ext);
      } else if (err.code === 'ENOENT') {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.write('404 - Requested resource was not found');
        response.end();
        return;
      }
      console.log(`Respond with error for request to ${pathname}`);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.write(err + '\n');
      response.end();
      return;
    }
    response.writeHead(200, {
      'Content-type': filetypes[ext] || 'text/plain',
    });
    response.end(contents);
  });
}

const server = http.createServer(function (request, response) {
  console.log(request.url, request.method);

  const parsedUrl = url.parse(request.url);
  let pathname = `.${parsedUrl.pathname}`;
  let ext = path.parse(pathname).ext;

  if (pathname === './' && ext === '') {
    pathname = 'public/index.html';
    ext = '.html';
  } else if (pathname === './index.html') {
    pathname = 'public/index.html';
  } else if (!pathname.startsWith('./public')) {
    response.writeHead(403, { 'content-type': 'text/plain' });
    response.write('403 - Forbidden');
    response.end();
    return;
  }

  const filetypes = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
  };

  if (request.method === 'GET') {
    handleReadFile(pathname, response, filetypes, ext);
  } else {
    response.writeHead(405, { 'content-type': 'text/plain' });
  }
});

server.listen(3000);
