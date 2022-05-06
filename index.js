import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

function handleReadFile(pathname, response, filetypes, ext) {
  console.log(`i got ${pathname} and type ${ext}`)
  fs.readFile(pathname, (err, contents) => {
    if (err) {
      console.log(err)
      if (err.code === 'EISDIR') {
        pathname += '/index.html';
        ext = ".html"
        console.log(pathname)
        console.log("call again")
        console.log("type " + ext)
        return handleReadFile(pathname, response, filetypes, ext)
      }
      console.log("set err type")
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.write(err + '\n');
      response.end();
      return;
    }
    response.writeHead(200, {
      'Content-type': filetypes[ext] || 'text/plain',
    });
    //response.write(contents, 'binary');
    response.end(contents);
  });

}

const server = http.createServer(function (request, response) {
  console.log(request.url, request.method);
  // parse URL
  const parsedUrl = url.parse(request.url);
  // extract URL path
  let pathname = `.${parsedUrl.pathname}`;
  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
  const ext = path.parse(pathname).ext;
  // maps file extension to MIME typere

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

  // 1. check request method
  if (request.method === 'GET') {
    //if (fs.stat(pathname).isDirectory()) {
    //  pathname += '/index' + ext;
    //}

    handleReadFile(pathname, response, filetypes, ext);
    /* fs.readFile(pathname, (err, contents) => {
      if (err) {
        console.log(err)
        if (err.code === 'EISDIR') {
          pathname += '/index.html';
          // return func call?
        }
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.write(err + '\n');
        response.end();
        return;
      }
      response.writeHead(200, {
        'Content-type': filetypes[ext] || 'text/plain',
      });
      //response.write(contents, 'binary');
      response.end(contents);
    }); */

    // handle invalid request methods
  } else {
    response.writeHead(405, { 'content-type': 'text/plain' });
  }
});

server.listen(3000);
