const mongoose = require('mongoose');

let DBURL = process.env.mongo_URL;
const DBPASSWORD = process.env.mongo_password;
 DBURL = DBURL.replace("<db_password>", DBPASSWORD);

 const connectToDB = async () =>{
    try {
        const connection = await mongoose.connect(DBURL);
        if(connection){
            console.log('connected to DB successfully');
            
        }
    } catch (error) {
        console.log('error while connecting to DB', error);
     }
 }
 module.exports = connectToDB;