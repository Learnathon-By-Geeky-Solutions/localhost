import express from "express"
import cors from "cors"
import "dotenv/config"; // this works directly instead of iporting dotenv, then dotenv.config()
import cookieParser from "cookie-parser";



const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
}));   


app.get('/', (req,res)=>{
    res.send("root page api response");
})



const port = process.env.PORT || 8000;
const DOMAIN = process.env.SERVER_DOMAIN;
app.listen(port, ()=>{
    console.log(`server is running on port ${DOMAIN}:${port}`);
});

