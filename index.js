"use strict";
exports.__esModule = true;
var http = require("http");
var server = http.createServer();
// server.on("request", (request,response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'});
//     // if(request.url)
//     // console.log(request.url);
//     response.end()
// })
// 集群健康
var health = function () {
    return new Promise(function (resolve) {
        http.get("http://localhost:9200/_cat/health?v&pretty", function (res) {
            var chunk = "";
            res.on("data", function (c) {
                chunk += c;
            });
            res.on("end", function () {
                console.log("集群健康");
                console.log(chunk);
                resolve(chunk);
            });
        });
    });
};
// 列出所有索引
var listAllIndex = function () {
    return new Promise(function (resolve) {
        http.get("http://localhost:9200/_cat/indices?v&pretty", function (res) {
            var chunk = "";
            res.on("data", function (c) {
                chunk += c;
            });
            res.on("end", function () {
                console.log("列出所有索引");
                resolve(chunk);
            });
        });
    });
};
// 添加索引
var addIndex = function () {
    return new Promise(function (resolve) {
        var options = {
            hostname: 'localhost',
            port: 9200,
            path: '',
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            }
        };
        http.request({});
    });
};
var a = 1;
a += 'a';
server.listen(8000);
