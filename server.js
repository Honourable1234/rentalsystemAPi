const dotenv = require("dotenv")
dotenv.config()
const App = require("./App")
const port = process.env.PORT || 3001;
const connectToDB = require('./config/db')

connectToDB()
App.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });