var Xpl = require('xpl-api');
var fs = require('fs');
var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;

function wt(device, options) {
	options = options || {};
	this._options = options;
        this.configFile = "./shell.config";
        this.config = {};
        
	options.xplSource = options.xplSource || "bnz-shell."+os.hostname();

	this.xpl = new Xpl(options);
};

module.exports = wt;

var proto = {
    
        _init: function(callback) {
                var self = this;

                self.xpl.bind(function(error) {
                        if (error) {
                                return callback(error);
                        }

                        console.log("XPL is ready");
                        callback(null,  self.xpl);
                });
                
        },

	_log: function() {
		if (!this._configuration.xplLog) {
			return;
		}
                
		console.log.apply(console, arguments);
	},

        contains: function(label, callback) {
            var self = this;
            var ok = false;
            self.config.forEach(function(item, index) {
                if(item.type == label) ok=true;
            });
            return callback(ok);
        },
        
        writeConfig: function(body) {
                var self = this;
                
                self.contains(body.label, function(found) {
                        if (found) {
                               //console.log("new config Found. Need to update");
                               self.config.forEach(function(item, index) {
                                    if(item.label == body.label){
                                        self.config[index].script = body.script;
                                        self.config[index].enable = body.enable;
                                    }
                                });
                        } else {
                                //console.log("New config not found. Need to add");
                                self.config.push({
                                        label:      body.label,
                                        script:     body.script,
                                        enable:     body.enable
                                });


                        }
                });
                
                fs.writeFile(self.configFile, JSON.stringify(self.config), function(err) {
                        if(err) {
                            self.sendNoConfig();
                        } else {
                            self.readConfig();
                        }
                });
        },
                
        readConfig: function(callback) {
                var self = this;
                fs.readFile(self.configFile, { encoding: "utf-8"}, function (err, body) {
                        if (err) {
                                self.sendNoConfig();
                        }
                        else {
                                self.config = JSON.parse(body);
                                self.config.forEach(function(item, index) {
                                        self.sendConfig(item.type, item.url, item.enable);
                                });
                        }
                });
        },
             
        _puts: function puts(error, stdout, stderr) { 
                    sys.puts(stdout) ;
        },
             
        sendCommand: function(body, callback){
                var self = this;
                // todo
        },    
          

        sendBasic: function(data) {
                var self = this;                
                self.xpl.sendXplStat(
                        data
                        , 'shell.basic');
        },
        
        sendConfig: function(type, url, enable) {
                var self = this;                
                self.xpl.sendXplStat({
                        label:          type,
                        parameters:     url,
                        enable:         enable
                }, 'shell.config');
        },
        
        sendNoConfig: function() {
                var self = this;
                self.xpl.sendXplStat({
                        config:      'noconfig'
                }, 'shell.config');
        },
                
        validBasicSchema: function(body, callback) {
                if (typeof(body.label) !== "string") {
                        return false;
                }
                if (typeof(body.parameters) !== "string") {
                        return false;
                }
                return true;
        },
        
        validConfigSchema: function(body, callback) {
                var self = this;
                if (typeof(body.label) !== "string") {
                        return false;
                }
                if (typeof(body.parameters) !== "string") {
                        return false;
                }
                if (typeof(body.enable) !== "string") {
                        return false;
                }
                return true;
        }
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
