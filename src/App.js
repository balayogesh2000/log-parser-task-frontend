import { useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [event, setEvent] = useState();
  const downloadFile = async (jsonFile) => {
    const fileName = "logs";
    const json = jsonFile;
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const uploadFile = (event) => {
    let file = event.target.files[0];
    console.log(file);

    if (file) {
      let data = new FormData();
      data.append("logs", file);
      axios
        .post("http://localhost:5000", data)
        .then((res) => {
          downloadFile(res.data.data);
        })
        .catch((err) => alert(err));
    }
  };
  return (
    <>
      <input type="file" name="logs" onChange={(e) => setEvent(e)} />
      <button onClick={() => uploadFile(event)}>Download</button>
    </>
  );
};

axios.interceptors.request.use(
  function (config) {
    // spinning start to show
    // UPDATE: Add this code to show global loading indicator
    document.body.classList.add("loading-indicator");

    const token = window.localStorage.token;
    if (token) {
      config.headers.Authorization = `token ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // spinning hide
    // UPDATE: Add this code to hide global loading indicator
    document.body.classList.remove("loading-indicator");

    return response;
  },
  function (error) {
    document.body.classList.remove("loading-indicator");
    return Promise.reject(error);
  }
);

export default App;
