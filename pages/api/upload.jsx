import nextConnect from 'next-connect';
import multer from 'multer';
const { FindCursor, MongoClient, ReturnDocument } = require("mongodb");
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const fsExtra = require('fs-extra');
require('dotenv').config();

// class Connection {
//     async connect() {
//         return await MongoClient.connect(process.env.ORDERIFIC_DB_URI, {
//             useNewUrlParser: true,
//         })
//     }
// }

async function uploadFileToDecentralizedStorage(fileName) {
    console.log("File Name", fileName);

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

    const token = client.token;

    if (!token) {
        return console.error('A token is needed. You can create one on https://web3.storage')
    }

    const storage = new Web3Storage({ token })
    const filepath = await getFilesFromPath("uploads/" + fileName);
    console.log("Your File", filepath);

    console.log(`Uploading your file`)

    const cid = await storage.put(await getFilesFromPath("uploads/" + fileName), { wrapWithDirectory: false })
    console.log("File Uploaded Successfull", cid);

    // const connectionObj = new Connection();
    // const connection = await connectionObj.connect();
    // const orderificDB = connection.db(process.env.ORDERIFIC_DB);
    // try {
    //     const myCollection = orderificDB.collection('orderific_cid_collection');
    //     const data = {
    //         cid: cid,
    //     }
    //     const result = await myCollection.insertOne(data);
    // }
    // catch(e){
    //     return e;
    // }
    // finally {
    //     await connection.close();
    // }

  return cid
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

apiRoute.post(async (req, res) => {
    let cid = await uploadFileToDecentralizedStorage(req.file.originalname);
    if(cid){
        fsExtra.emptyDirSync("./uploads/")
    }
    res.status(200).json({"File Uploaded Successfully at ": "https://"+cid+".ipfs.dweb.link/"});
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};