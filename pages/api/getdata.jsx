import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { allowedStatusCodes } from 'next/dist/lib/load-custom-routes';
const { Web3Storage } = require('web3.storage');
import useSWR from "swr";
import axios from "axios";


// function getAccessToken() {
//     // If you're just testing, you can paste in a token
//     // and uncomment the following line:
//     // return 'paste-your-token-here'

//     // In a real app, it's better to read an access token from an
//     // environement variable or other configuration that's kept outside of
//     // your code base. For this to work, you need to set the
//     // WEB3STORAGE_TOKEN environment variable before you run your code.
//     return process.env.WEB3STORAGE_TOKEN
// }

// function makeStorageClient() {
//     return new Web3Storage({ token: getAccessToken() })
// }

//   async function retrieve (cid) {
//     const client = makeStorageClient()
//     const res = await client.get(cid)
//     if (!res.ok) {
//       throw new Error(`failed to get ${cid}`)
//     }
//     const files = await res.files()
//     let file;
//     for (file of files) {
//       //  console.log(`${file.cid} -- ${file.name} -- ${file.size}`)
//      }

//     //  console.log("https://"+cid+".ipfs.dweb.link/"+file.name)
// }

async function connect() {
    class Connection {
        async connect() {
            return MongoClient.connect(process.env.ORDERIFIC_DB_URI, {
                useNewUrlParser: true,
            })
        }
    }
    const connectionObj = new Connection();
    const connection = await connectionObj.connect();
    const orderificDB = connection.db(process.env.ORDERIFIC_DB);
    const myCollection = orderificDB.collection('orderific_cid_collection');
    // console.log("Fetching all the CIDs for you....");
    const contentIdentifiers = await myCollection.find();
    const allContentIdentifiers = await contentIdentifiers.toArray()
    let length = allContentIdentifiers.length;
    let allCids = [];
    for (let i = 0; i < length; i++) {
        // retrieve(allContentIdentifiers[i].cid)
        allCids.push("https://" + allContentIdentifiers[i].cid + ".ipfs.dweb.link/")
    }
    console.log(allCids)

    let allDataInJson = [];
    for (let k = 0; k < allCids.length; k++) {
        const res = await fetch(allCids[k]);
        const body = await res.json()
        // console.log("Body", body);
        allDataInJson.push(body);
    }
    // console.log("All Data in Json", allDataInJson);

    return allDataInJson

    // const res = await fetch("https://bafkreie57erqcr5t4qti2vo4lw5m5f6kidiw24njekedk2ybms4nw4eoqy.ipfs.dweb.link/");
    // const body = await res.json();
    // console.log("My body is ", body);




    // console.log("Length of All CID", allCids.length)
    // const client = makeStorageClient()
    // const allCidsLength = allCids.length;
    // const allUrls = [];

    // for (let k = 0; k < allCidsLength; k++) {
    //     const res = await client.get(allCids[k])
    //     if (!res.ok) {
    //         throw new Error(`failed to get ${cid}`)
    //     }
    //     const files = await res.files()
    //     let file;
    //     for (file of files) {
    //         //  console.log(`${file.cid} -- ${file.name} -- ${file.size}`)
    //     }
    //     // console.log("https://"+allCids[k]+".ipfs.dweb.link/"+file.name)
    //     allUrls.push("https://" + allCids[k] + ".ipfs.dweb.link/" + file.name)
    // }
    // return allUrls
    // //    res.json(dataInJson)
}


export default async function Fetch(req, res) {

    // const dataInJson = [];
    let allUrls = await connect();

    // let allUrlsLength = allUrls.length;
    // console.log(allUrls)

    // for (let i = 0; i < allUrlsLength; i++) {
    //     const response = await fetch(allUrls[i]);
    //     const body = await response.json();
    //     console.log(body);
    //     dataInJson.push(body);
    // }


    res.json(allUrls)
}

