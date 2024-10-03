const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");
// const { error } = require('console');
// const { stdout, stderr } = require('process');


// const outputPath = path.join(__dirname, "outputs")

// if(!fs.existsSync(outputPath)){
//     fs.mkdirSync(outputPath,{recursive:true});
// }

const execPy = (filePath) => {
    // const jobID = path.basename(filePath).split(".")[0];
    // const outPath = path.join(outputPath, `${jobID}.txt`);
    return new Promise((resolve, reject) => {
        exec(`python ${filePath}`,
            (error, stdout, stderr) => {
                error && reject({error, stderr});
                stderr && reject(stderr);
                resolve(stdout);
                // if(error){
                //     reject({error,stderr});
                // }
                // if(stderr){
                //     reject(stderr);
                // }
                // resolve(stdout);
            });
    });
};

module.exports = {
    execPy,
};