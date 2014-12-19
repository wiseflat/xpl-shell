var xplshell = require("./lib/xpl-shell");

var wt = new xplshell(null, {
	//xplSource: 'bnz-shell.wiseflat'
});

wt._init(function(error, xpl) { 

	if (error) {
		console.error(error);
		return;
	}
        
        wt.readConfig();
                
        xpl.on("xpl:shell.config", function(evt) {
                if(evt.headerName == 'xpl-cmnd' && wt.validConfigSchema(evt.body)) wt.writeConfig(evt.body);
        }); 

        xpl.on("xpl:shell.request", function(evt) {
                if(evt.headerName == 'xpl-cmnd') wt.readConfig();
        });

        xpl.on("xpl:shell.basic", function(evt) {
                if(evt.headerName == 'xpl-cmnd' && wt.validBasicSchema(evt.body)) wt.sendCommand(evt.body);
        });
});

