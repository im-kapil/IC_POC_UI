// pages/route-name.js
'use strict';
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const process = require('process');
const minimist = require('minimist');
const { FindCursor, MongoClient } = require("mongodb");
require('dotenv').config();
const fs = require('fs')


export default async function handler(req, res) {

    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
      return
    }

    function getAccessToken() {
      // If you're just testing, you can paste in a token
      // and uncomment the following line:
      // return 'paste-your-token-here'

      // In a real app, it's better to read an access token from an
      // environement variable or other configuration that's kept outside of
      // your code base. For this to work, you need to set the
      // WEB3STORAGE_TOKEN environment variable before you run your code.
      return process.env.WEB3STORAGE_TOKEN
    }

    function makeStorageClient() {
      return new Web3Storage({ token: getAccessToken() })
    }

  const client = makeStorageClient();


async function uploadFiles(json_data) {
  // const args = minimist(process.argv.slice(2))


  const token = client.token;

  if (!token) {
    return console.error('A token is needed. You can create one on https://web3.storage')
  }

  const storage = new Web3Storage({ token })

  fs.writeFileSync('data.json', JSON.stringify(json_data));

  console.log("Inserted Data", JSON.stringify(json_data));

  // console.log("File path ", await getFilesFromPath("data.json"));

  console.log(`Uploading your files`)

  const cid = await storage.put(await getFilesFromPath("data.json"), { wrapWithDirectory: false })

  class Connection{
    async connect(){
        return await MongoClient.connect(process.env.ORDERIFIC_DB_URI, {
        useNewUrlParser: true,
      })
    }
  }

  const connectionObj = new Connection();
  const connection = await connectionObj.connect();
  const orderificDB = connection.db(process.env.ORDERIFIC_DB);
  try {
    const myCollection = orderificDB.collection('orderific_cid_collection');
    const data = {
      cid: cid,
    }
    const result = await myCollection.insertOne(data);
  }
  finally {
    await connection.close();
  }
  console.log('Content added with CID:', cid)
}

const data = req.body;


uploadFiles(data) 
 
res.json(data)


  //   const body = JSON.parse(JSON.stringify(req.body))
  //   // const data = req.body;

  //   console.log("............Req.body suru..............")    
  //   console.log("data is", req.body)
  //   console.log("............Req.body khtm..............")    


  //   class Connection {
  //     async connect() {
  //         return MongoClient.connect(process.env.ORDERIFIC_DB_URI, {
  //             useNewUrlParser: true,
  //         })
  //     }
  // }
  // const connectionObj = new Connection();
  // const connection = await connectionObj.connect();
  // const orderificDB = connection.db(process.env.ORDERIFIC_DB);
  // try {
  //   const myCollection = orderificDB.collection('orderific_cid_collection');
  //   const data = {
  //     cid: "Post  Request Was Called",
  //   }
  //   const result = await myCollection.insertOne(body);
  //   console.log("Result", result)
  // }
  // finally {
  //   await connection.close();
 

  //   res.json(body);
  // }
}