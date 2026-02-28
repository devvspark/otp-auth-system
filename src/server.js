import dotenv from "dotenv";

dotenv.config();

import "./config/redis.js";// import redis from "./config/redis.js"; we are not importing like this becuase  we are not using its value  
// so once the app start it will execute once at top 

import app from "./app.js";


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


