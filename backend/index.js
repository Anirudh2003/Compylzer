const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/Compylzer";
const { generateFile } = require('./generateFile');
const Job = require('./models/Job');
const { addJobToQueue } = require('./jobQueue');
const { UserRouter }  = require('./routes/user');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');


const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB Successfully🕹!!');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

// mongoose.connect(mongoURI,{
//     useNewUrlParser: true,
//     useUnifiedTopology:true,
// }, (err) => {
//     if(err){
//         console.error(err);
//     process.exit(1);
//     }
//     console.log("Connected successfully to MongoDB Database🕹!!")
// });

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())
app.use('/auth', UserRouter);

app.get("/", (req,res) => {
    return res.json({"Port":"Listening on 8008"});
});


app.post("/run",async (req,res) => {
    const { language = "py", code } = req.body;
    console.log("language: ",language);
    console.log("code: ",code);
    if(code === undefined){
        return res.status(400).json({success:false, error:"No code Provided!!"});
    }

    let job;
    try{
        const filePath = await generateFile(language, code);
        
        job = await new Job({language, filePath}).save();
        const jobID = job["_id"];
        addJobToQueue(jobID);
        
        // response that the code is running will be sent back to the user but the further processing continues....
        res.status(201).json({success: true, jobID});
    } catch(err){
        res.status(500).json({success: false, err: JSON.stringify(err)});
    }
        
        
    
});

app.get("/status", async (req, res) => {
    const jobID = req.query.id;
    console.log("status requested", jobID);
    if(jobID == undefined){
        res.status(400).json({success: false, error: "Missing ID query param!!"});
    }

    try{
        const job = await Job.findById(jobID);

        if(job === undefined){
            return res.status(404).json({success: false, error: "Invalid JobID!!"});
        }

        return res.status(200).json({success: true, job});
    } catch(err){
        return res.status(400).json({success: false, error: JSON.stringify(err)});
    }
});

app.listen(8008, () => {
    connectToMongo();
    console.log("Listening on port 8008🚀!!")
});