console.log('module.hot', module.hot, __webpack_hash__)

if (module.hot) {
  var lastHash

  var upToDate = function upToDate() {
      return lastHash.indexOf(__webpack_hash__) >= 0
  }

  var clientEmitter = require('webpack/hot/emitter')

  clientEmitter.on('webpackHotUpdate', function(currentHash) {
      lastHash = currentHash
      if(upToDate()) return

      console.log('%c Reloading Extension', 'color: #FF00FF')
      //chrome.runtime.reload()
  })
}

const formChanged = (e) => {
  console.log('changed', e)
}


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    
    if (msg.type === "SCRAPE_FORMS") {
        const forms = Array.from(document.forms)
        const payload = forms.map(f => {
          
          f.removeEventListener('change', formChanged)
          f.addEventListener('change', formChanged)
          
          return Array.from(f).map(el => el.nodeName)
        })
    
        sendResponse({forms: payload, type: 'SCRAPE_FORMS_SUCCEEDED'});
    } else {
      sendResponse("Type message is none.");
    }
  });
  