import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";


const scrapeForms = (setForms) => {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab.id) {
      chrome.tabs.sendMessage(
        tab.id,
        {
          type: "SCRAPE_FORMS",
        },
        (msg) => {
          console.log("result message:", msg);
          if(msg.type === 'SCRAPE_FORMS_SUCCEEDED'){
            setForms(msg.forms)
          }
        }
      );
    }
  });
}

const Panel = () => {

  const [currentTabID, setCurrentTabID] = useState<number>()
  const [forms, setForms] = useState([])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentTabID(tabs[0].id);
    });
  }, []);

  useEffect(() => {

    if(currentTabID) {
      scrapeForms(setForms)
    }    

  }, [currentTabID])

  return <div>
      {forms.map((form, i) => {

          return <ul key={i}>
              {form.map((el, ii) => <li key={ii}>{el}</li>)}
          </ul>
      })}
  </div>

}


ReactDOM.render(
  <React.StrictMode>
    <Panel />
  </React.StrictMode>,
  document.getElementById("root")
);
