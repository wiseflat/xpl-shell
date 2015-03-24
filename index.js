var xplshell = require("./lib/xpl-shell");
var schema_shellbasic = require('/etc/wiseflat/schemas/shell.basic.json');
var schema_shellconfig = require('/etc/wiseflat/schemas/shell.config.json');

var wt = new xplshell(null, {
        xplLog: false,
        forceBodySchemaValidation: false
});

wt.init(function(error, xpl) { 

	if (error) {
		console.error(error);
		return;
	}
        
	xpl.addBodySchema(schema_shellbasic.id, schema_shellbasic.definitions.body);
	xpl.addBodySchema(schema_shellconfig.id, schema_shellconfig.definitions.body);
	
        // Load config file into hash
        wt.readConfig();
        wt.readBasic();
        
        // Send every minutes an xPL status message 
        setInterval(function(){
                wt.sendConfig();
                wt.sendBasic();
        }, 60 * 1000);

        xpl.on("xpl:shell.basic", function(evt) {
                if(evt.headerName == 'xpl-cmnd') wt.sendCommand(evt.body);
        });
        
        xpl.on("xpl:shell.config", function(evt) {
                if(evt.headerName == 'xpl-cmnd') wt.writeConfig(evt.body);
        });
});

