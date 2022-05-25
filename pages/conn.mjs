// const { MongoClient } =  require("mongodb");
const dotenv = require('dotenv');
dotenv.config();

// console.log(process.env.MFLIX_DB_URI);

// class Connection{
// async connect(){
//     return await MongoClient.connect(process.env.MFLIX_DB_URI, {
//     useNewUrlParser: true,
//     })
//     }
// }

function Connection() {
    //     return MongoClient.connect(process.env.MFLIX_DB_URI, {
    //     useNewUrlParser: true,
    //     })
    return (
        <div>
            <h1>HOla</h1>
            {/* {process.env.MFLIX_DB_URI} */}
        </div>
    )
}
export default Connection;
// module.exports = Connection;
