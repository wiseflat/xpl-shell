var Xpl = require('xpl-api');
var fs = require('fs');
var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;

function wt(device, options) {
	options = options || {};
	this._options = options;
        
        this.basicFile = "./shell.basic";
        this.basicHash = [];    
        
        this.configFile = "./shell.config";
        this.configHash = [];    
                
	options.xplSource = options.xplSource || "bnz-shell."+os.hostname();

	this.xpl = new Xpl(options);
};

module.exports = wt;

var proto = {
    
        init: function(callback) {
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

        _sendXplStat: function(body, schema) {
                var self = this;                
                self.xpl.sendXplStat(
                        body,
                        schema
                );
        },   
        
        /*
         *  Config xPL message
         */
        
        readConfig: function(callback) {
                var self = this;
                fs.readFile(self.configFile, { encoding: "utf-8"}, function (err, body) {
                        if (err) console.log("file "+self.configFile+" is empty ...");
                        else {
                            self.configHash = JSON.parse(body);
                        }
                });
        },

        sendConfig: function(callback) {
                var self = this;
                self._sendXplStat(self.configHash, 'shell.config');
        },
        
        writeConfig: function(body) {
                var self = this;
                self.configHash.enable = body.enable;
                fs.writeFile(self.configFile, JSON.stringify(self.configHash), function(err) {
                        if (err) console.log("file "+self.configFile+" was not saved to disk ...");
                });
        },

        /*
         *  Basic xPL message
         */
        
        readBasic: function(callback) {
                var self = this;
                fs.readFile(self.basicFile, { encoding: "utf-8"}, function (err, body) {
                        if (err) console.log("file "+self.basicFile+" is empty ...");
                        else self.basicHash = JSON.parse(body);
                });
        },

        sendBasic: function(callback) {
                var self = this;
                self.basicHash.forEach(function(item, index) {
                    self._sendXplStat(item, 'shell.basic');
                });
        },
        
        /*writeBasic: function(file, hash, callback) {
                var self = this;
                fs.writeFile(file, JSON.stringify(hash), function(err) {
                        if(err) {
                            console.log("file error "+file);
                        }
                });
        },*/
    
        /*
         *  Plugin specifics functions
         */

        sendCommand: function(body, callback){
                var self = this;
                exec(body.script + ' ' +  body.parameters, function (error, stdout, stderr) {
                        if (error !== null) console.log('exec error: ' + error);
                        
                        /*var data = {
                                label:          body.label,
                                script:         body.script,
                                parameters:     body.parameters,
                                stdout:         stdout,
                                stderr:         stderr,
                                error:          error
                        };
                        self.sendBasic(data);*/
                });
        },    
        
        _puts: function puts(error, stdout, stderr) { 
                    sys.puts(stdout) ;
        },
          
        /*_contains: function(label, callback) {
                var self = this;
                var ok = false;
                if (typeof(self.config) !== 'undefined' && self.config.length > 0) {
                        self.config.forEach(function(item, index) {
                                if(item.label == label) ok=true;
                        });
                }
                return callback(ok);
        },*/
                
        validBasicSchema: function(body, callback) {
                if (typeof(body.label) !== "string") {
                        return false;
                }
                if (typeof(body.script) !== "string") {
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
                if (typeof(body.script) !== "string") {
                        return false;
                }
                if (typeof(body.parameters) !== "string") {
                        return false;
                }
                return true;
        }
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
