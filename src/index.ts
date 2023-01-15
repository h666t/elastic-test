import * as http from "http";
import { RequestOptions } from "http";
// import { IndexType } from "./types";

const server = http.createServer()

// server.on("request", (request,response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'});
//     // if(request.url)
//     // console.log(request.url);
//     response.end()
// })

// 集群健康
const health = (): Promise<string> => {
    return new Promise((resolve)=>{
        http.get("http://localhost:9200/_cat/health?v&pretty", (res: http.IncomingMessage)=>{
            let chunk = "";
            res.on("data", (c)=>{
                chunk += c
            });
            res.on("end", ()=>{
                console.log("集群健康");
                console.log(chunk);     
                resolve(chunk)   
            });
        })
    })
}


// 列出所有索引
const listAllIndex = (): Promise<string> => {
    return new Promise((resolve)=>{
        http.get("http://localhost:9200/_cat/indices?v&pretty", (res: http.IncomingMessage)=>{
            let chunk = "";
            res.on("data", (c)=>{
                chunk += c
            });
            res.on("end", ()=>{
                console.log("列出所有索引");
                console.log(chunk);
                resolve(chunk);        
            });
        })
    })
}


// 添加索引
const createIndex = (indexName: string): Promise<http.IncomingMessage>  => {
    return new Promise((resolve)=>{
        let options: RequestOptions = {
            hostname: 'localhost',
            port: 9200,
            path: `/${indexName}?pretty&pretty`,
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            }
        }
        http.request(options, (res) => {
            console.log(`添加索引: ${indexName}`);
            resolve(res)
            return;
        }).end()
    })
}
// type IndexType = "external"
const addToIndex = (id: string, indexName: string, indexType: IndexType, postData: object): Promise<string> => {
    return new Promise((resolve)=>{
        let options: RequestOptions = {
            hostname: 'localhost',
            port: 9200,
            path: `/${indexName}/${indexType}/${id}?pretty&pretty'`,
            method: 'PUT',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        let req = http.request(options, (res) => {
            console.log(`添加索引: id=${id} indexName=${indexName} indexType=${indexType}`);
            let chunk = "";
            res.on("data", (c)=>{
                chunk += c
            });
            res.on("end", ()=>{
                console.log("add index success");
                console.log(chunk);
                resolve(chunk);        
            });
        })
        req.write(JSON.stringify(postData))
        req.end()
    })
}



(async () => {
    // await createIndex()
    
    await addToIndex('1','customer',"external", {
        "name": "John Doe"
      })
    // await listAllIndex();
})()

server.listen(8000)