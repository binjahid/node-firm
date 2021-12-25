const fs = require("fs");
const http = require("http");
const url = require("url");
/* const textIn = fs.readFileSync("./txt/input.txt", "utf8");
console.log(textIn);
const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${new Date().toLocaleDateString()}`;
fs.writeFileSync("./txt/output.txt", textOut);
 */

// fs.readFile("./txt/start.txt", "utf8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf8", (err, data2) => {
//     fs.readFile(`./txt/append.txt`, "utf8", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf8", (err) => {
//         console.log("Your file has been written");
//       });
//     });
//   });
// });
// Server
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const card = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const singleProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
http
  .createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === "/" || req.url === "/overview") {
      res.writeHead(200, { "Content-type": "text/html" });
      const cardsHtml = dataObj.map((el) => replaceTemplate(card, el));
      const output = overview.replace("{%PRODUCTCARD%}", cardsHtml);
      res.end(output);
    } else if (pathname === "/api") {
      res.end(data);
    } else if (pathname === "/product") {
      res.writeHead(200, { "Content-type": "text/html" });
      const product = dataObj[query.id];
      const output = replaceTemplate(singleProduct, product);
      res.end(output);
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 Page not found</h1>");
    }
  })
  .listen(8000);
