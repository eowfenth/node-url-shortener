const http = require("http");
const nanoid = require("nanoid");//Parametro a ser passado
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': 2592000,
};//Pedido
const request = {
  url: "www.google.com"
};//Resposta
const response = {
  error: null,
  data: {
    "base-url": "www.google.com",
    "short-url": "nfa1341",
  }
};//Exemplo de url inteira
const urls = {
  "https://www.google.com": "google",
};//Exemplo de url reduzida
const shortUrls = {
  "google": "https://www.google.com",
};const app = (req, res) => {
    //Se o método OPTIONS for pedido
    if (req.method === "OPTIONS") {
        res.writeHead(204, { ...headers });
        res.end();
        return;
    }
    //Se o método POST for pedido
    if (req.method === "POST") {
        let body = "";        req.on('data', (info) => {
        body += info;
        });        req.on('end', () => {
            const response = {
                error: null,
                data: {
                "base-url": null,
                "short-url": null,
                },
            };            const reqUrl = (JSON.parse(body)).url;
            const shortUrl = urls[reqUrl];            if (shortUrl) {
                response.data["base-url"] = reqUrl;
                response.data["short-url"] = shortUrl;
            } else {
                const shortId = nanoid(11);
                response.data["base-url"] = reqUrl;
                response.data["short-url"] = shortId;                urls[reqUrl] = shortId;
                shortUrls[shortId] = reqUrl;
            }            res.writeHead(200, { 
                ...headers,
                'Content-Type': 'application/json'
            });            res.write(JSON.stringify(response));
            res.end();
            return;
        });
    }    //Se o método GET for pedido
    if (req.method === "GET") {
        //Caso esteja na raiz
        if (req.url === "/") {
            //Passa um Ok
            res.writeHead(200, { 
            ...headers,
            'Content-Type': 'text/plain'
            });
            //Manda um Hello, World!
            res.write("Hello, World!");
            res.end();
            return;
        }        //Armazenando a url
        const url = req.url.replace("/", "");        const hasShortUrl = shortUrls[url];        //Caso não haja uma shortUrl
        if (!hasShortUrl) {
            //Informar o erro
            res.writeHead(404, {
                ...headers,
                'Content-Type' : 'application/json'
            });
            //Mensagem de erro
            res.write(JSON.stringify({
                error: '404',
                data: {
                message: "Not Found",
                },
            }));
            res.end();
            return;
        } else {
            res.writeHead(301, {
                ...headers,
                'Content-Type' : 'application/json',
                'Location': hasShortUrl,
            });
            res.end();
            return;
        }
    }};const server = http.createServer(app);server.listen(8081, () => console.log("Running"));