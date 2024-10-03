const Queue = require('bull');
const { execPy } = require('./executePy');

const jobQueue = new Queue('job-queue');
const NUM_WORKERS = 5;
const Job = require('./models/Job');

jobQueue.process(NUM_WORKERS, async ({data}) => {
    console.log(data);
    const {id: jobID} = data;
    const job = await Job.findById(jobID);
    if(job === undefined){
        throw Error("job not found!!");
    }
    console.log("Fetched Job", job);
    let output;
    try{
        
        job["startedAt"] = new Date();
        if (job.language === "py"){
            output = await execPy(job.filePath);
        }
        job["completedAt"] = new Date();
        job["status"] = "success";
        job["output"] = output;

        await job.save();

    } catch(err) {
        job["completedAt"] = new Date();
        job["status"] = "error";
        job["output"] =JSON.stringify(err);
        await job.save();
    }
});

jobQueue.on('failed', (error) => {
    console.log(error.data.id, "failed", error.failedReason);
});

const addJobToQueue = async (jobID) => {
    await jobQueue.add({ id: jobID }); 
};

module.exports = {
    addJobToQueue,
};