if (window.self !== window.top){
  var styleEl = document.createElement('style');

  document.head.appendChild(styleEl);

  styleEl.sheet.insertRule('.content .app-wrapper{top:20px!important;}')
  styleEl.sheet.insertRule('html{background-color:white;}')
}
