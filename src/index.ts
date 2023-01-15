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
            path: `/${indexName}/${indexType}/${id}`,
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        }
        let req = http.request(options, (res) => {
            console.log(`添加索引: id=${id} indexName=${indexName} indexType=${indexType}`);
            let chunk = "";
            res.on("data", (c)=>{
                chunk += c
            });
            res.on("end", ()=>{
                console.log("add index finish");
                console.log(chunk);
                resolve(chunk);        
            });
        })
        req.write(JSON.stringify(postData))
        req.end()
    })
}

const getData = (id: string, indexName: string, indexType: IndexType): Promise<string> => {
    return new Promise((resolve)=>{
        let options: RequestOptions = {
            hostname: 'localhost',
            port: 9200,
            path: `/${indexName}/${indexType}/${id}`,
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        }
        let req = http.request(options, (res) => {
            console.log(`get data: id=${id} indexName=${indexName} indexType=${indexType}`);
            let chunk = "";
            res.on("data", (c)=>{
                chunk += c
            });
            res.on("end", ()=>{
                console.log("add index finish");
                console.log(chunk);
                resolve(chunk);        
            });
        })
        req.end()
    })
}

const addBulkData = (indexName: string, list:object[]): Promise<string> => {
    return new Promise((resolve)=>{
        let options: RequestOptions = {
            hostname: 'localhost',
            port: 9200,
            path: `/${indexName}/_bulk`,
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            }
        }
        let req = http.request(options, (res) => {
            console.log(`add bulk data`);
            let chunk = "";
            res.on("data", (c)=>{
                chunk += c
            });
            res.on("end", ()=>{
                console.log("add index finish");
                console.log(chunk);
                resolve(chunk);        
            });
        })
        console.log(list.map(item=>JSON.stringify(item)).join(`\n`)+'\n');
        
        req.write(list.map(item=>JSON.stringify(item)).join(`\n`)+'\n')
        req.end()
    })
}

const searchDataFromIndex = (indexName: string): Promise<string> => {
    return new Promise((resolve)=>{
        let options: RequestOptions = {
            hostname: 'localhost',
            port: 9200,
            path: `/${indexName}/_search`,
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }
        let req = http.request(options, (res) => {
            console.log(`add bulk data`);
            let chunk = "";
            res.on("data", (c)=>{
                chunk += c
            });
            res.on("end", ()=>{
                console.log("add index finish");
                console.log(chunk);
                resolve(chunk);        
            });
        })
        req.end()
    })
}



(async () => {
    // await createIndex()
    
    // await addToIndex('1','customer',"_doc", {
    //     "name": "John Doe"
    //   })
    // await listAllIndex();
    // await getData('1', 'customer', '_doc')
    // await addBulkData("customer",[
    //     {create:{
    //         "_id": 66
    //     }},
    //     {b:2}
    // ])
    await searchDataFromIndex("customer")
})()

server.listen(8001)