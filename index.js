import replaceTemplate from "./modules/replaceTemplate.js";
import fs from "fs";
import http from "http";
import slugify from "slugify";

const data = fs.readFileSync(`./dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(`./templates/overview.html`, "utf-8");
const tempProduct = fs.readFileSync(`./templates/product.html`, "utf-8");
const tempCard = fs.readFileSync(`./templates/template-card.html`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

//this is ran with every request
const server = http.createServer((req, res) => {
	//https://nodejs.org/api/url.html#url_class_urlsearchparams
	const baseURL = `http://${req.headers.host}`;
	const requestURL = new URL(req.url, baseURL);
	const pathName = requestURL.pathname;
	const query = requestURL.searchParams.get("id");

	//overview page
	if (pathName === "/overview" || pathName === "/") {
		res.writeHead(200, {
			"content-type": "text/html",
		});
		const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
		res.end(output);

		//product page
	} else if (pathName === "/product") {
		res.writeHead(200, {
			"content-type": "text/html",
		});
		const product = dataObj[query];
		const output = replaceTemplate(tempProduct, product);
		res.end(output);

		//API
	} else if (pathName === "/api") {
		res.writeHead(200, {
			"content-type": "application/json",
		});
		res.end(data);

		//404 - PAGE NOT FOUND
	} else {
		res.writeHead(404, {
			"Content-type": "text/html",
			"my-own-header": "hello world",
		});
		res.end("<h1>Page not found!</h1>");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});

//! using url for simple routing ////////
