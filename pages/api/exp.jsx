
import nextConnect from 'next-connect';
import multer from 'multer';
const path = require('path');
const fs = require('fs');

export default async function handler(req, res){

    const directoryPath = path.join('./public/uploads');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log("/public/uploads/"+file); 
    });
});

res.json("good")

}