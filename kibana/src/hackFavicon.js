(function() {
	var script = document.createElement("SCRIPT");
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js';
  script.type = 'text/javascript';
  script.onload = function() {
    var $ = window.jQuery;
		$('head').find('link[rel*="icon"]').remove();
		$('title').text("EEA");
		$('head').append('<link rel="shortcut icon" type="icon" href="https://cdn.rawgit.com/eea/eea.docker.elk/ffe74ac5/kibana/src/eea_mini.ico">');
  };
  document.getElementsByTagName("head")[0].appendChild(script);
})();
