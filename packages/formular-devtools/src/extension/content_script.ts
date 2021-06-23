chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    
    if (msg.type === "SCRAPE_FORMS") {
        const forms = Array.from(document.forms)
        const payload = forms.map(f => Array.from(f).map(el => el.nodeName))
    
        sendResponse({forms: payload, type: 'SCRAPE_FORMS_SUCCEEDED'});
    } else {
      sendResponse("Type message is none.");
    }
  });
  