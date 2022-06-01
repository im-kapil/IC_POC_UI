'use strict';
import nextConnect from 'next-connect';
import multer from 'multer';
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const process = require('process');
const minimist = require('minimist');
const { FindCursor, MongoClient } = require("mongodb");
require('dotenv').config();


async function uploadFile() {

    const directoryPath = path.join('./uploads');
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log("/uploads/" + file);
        });

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

        async function uploadFiles(filePath) {

            const token = client.token;

            if (!token) {
                return console.error('A token is needed. You can create one on https://web3.storage')
            }

            const storage = new Web3Storage({ token })
            console.log("Returning Filepath");
            const filepath = await getFilesFromPath("uploads/" + filePath);
            console.log("YOur File Path Isnde the Upload Function", filepath);

            console.log(`Uploading your files`)

            const cid = await storage.put(await getFilesFromPath("uploads/" + filePath), { wrapWithDirectory: false })

            class Connection {
                async connect() {
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

            if (cid) {
                fsExtra.emptyDirSync("./uploads/")
            }
        }

        uploadFiles(files)
    });

    setTimeout(() => {
        fsExtra.emptyDirSync("./uploads/")
    }, 300000);

}

const upload = multer({
    storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

// console.log(upload);

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
    
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
    // uploadFile()
    // res.status(200).json({ data: 'success' });
});
console.log("Hello Wolrd")

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};