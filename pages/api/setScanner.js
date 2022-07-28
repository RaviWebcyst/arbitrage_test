 import fs from 'fs';
export default async function handler(req,res){
    console.log(req.body);
    let body = JSON.parse(req.body);
    body = JSON.stringify(body);
    fs.writeFile("test.json", body, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
     
        console.log("JSON file has been saved.");
    });
    res.json("working");
}