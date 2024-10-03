import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import React, {useEffect, useState} from 'react';
import stubs from './defaultStubs';
import moment from 'moment';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('py');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [jobID, setJobID] = useState('');
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
  };

  const renderTimeDetails = () => {
    if(!jobDetails){
      return " ";
    }
    let result = '';
    let {submittedAt, completedAt, startedAt} = jobDetails;
    result += `Submitted At: ${submittedAt}`;  
    if(!completedAt || !startedAt){
      return result;
    }
    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = end.diff(start, 'seconds', true);
    result += ` Execution Time: ${executionTime}`;
    return result;
  };

  const handleSubmit = async () => {
    console.log(code);
    const payload = {
      language,
      code,
    };
    

    try {
      setJobID('');
      setStatus('');
      setOutput('');
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:8008/run", payload);
      console.log(data);
      setJobID(data.jobID);
      let intervalID;

      intervalID = setInterval(async () => {
        const {data: dataRes} = await axios.get("http://localhost:8008/status",
          { 
            params: { id: data.jobID }
          });

        const { success, job, error } = dataRes;
        console.log(dataRes);
        if(success){
          const { status: jobStatus, output: jobOutput } = job;
          setStatus(jobStatus);
          setJobDetails(job);
          if(jobStatus === "pending") return;
          setOutput(jobOutput);
          clearInterval(intervalID);
        } else {
          setStatus("Error: Please retry!!");
          console.error(error);
          clearInterval(intervalID);
          setOutput(error);
        }
        console.log(dataRes);
      }, 1000);
    } catch({response}) {
      if({response}){
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Error connecting to server😥!!");
      }
      
    }
  }
  return (
    <div className="App">
      <h1>Compylzer</h1>
      <div>
        <label>Language: </label>
        <select
          value = {language}
          onChange={
            (e) => {
              let response = window.confirm(
                "WARNING: Switching the language, will remove your current code, Do you wish to proceed?"
              );
              if(response){
                setLanguage(e.target.value);
                console.log(e.target.value);
              }
            }
          }
          >
          <option value="py">py</option>
          <option value ="cpp">C++</option>
        </select>
      </div>
      <br />
      <div>
        <button onClick={setDefaultLanguage}>Set Default</button>
      </div>
      <br />
      <textarea 
        rows="20" 
        cols="75" 
        value={code} 
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <p>{ status }</p>
      <p>{ jobID && `JobID: ${jobID}` }</p>
      <p>{ renderTimeDetails() }</p>
      <p>{ output }</p>
    </div>
  );
}

export default App;
