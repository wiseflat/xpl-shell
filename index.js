var xplshell = require("./lib/xpl-shell");

var wt = new xplshell(null, {
	//xplSource: 'bnz-shell.wiseflat'
});

wt.init(function(error, xpl) { 

	if (error) {
		console.error(error);
		return;
	}
        
        // Load config file into hash
        wt.readConfig();
        wt.readBasic();
        
        // Send every minutes an xPL status message 
        setInterval(function(){
                wt.sendConfig();
                wt.sendBasic();
        }, 60 * 1000);

        xpl.on("xpl:shell.request", function(evt) {
                if(evt.headerName == 'xpl-cmnd') wt.sendConfig();
        });
        
        /*xpl.on("xpl:shell.config", function(evt) {
                if(evt.headerName == 'xpl-cmnd' && wt.validConfigSchema(evt.body)) wt.writeConfig(evt.body);
        });*/

        xpl.on("xpl:shell.basic", function(evt) {
                if(evt.headerName == 'xpl-cmnd' && wt.validBasicSchema(evt.body)) wt.sendCommand(evt.body);
        });
});

