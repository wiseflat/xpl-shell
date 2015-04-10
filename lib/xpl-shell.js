var Xpl = require('xpl-api');
var fs = require('fs');
var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;
var pjson = require('../package.json');

function wt(device, options) {
	options = options || {};
	this._options = options;
        
        this.basicFile = "/etc/wiseflat/shell.basic.json";
        this.basicHash = [];    
        
        this.configFile = "/etc/wiseflat/shell.config.json";
        this.configHash = [];    
                
	this.version = pjson.version;
	
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

                        self._log("XPL is ready");
                        callback(null,  self.xpl);
                });
                
        },

	_log: function(log) {
		/*if (!this._configuration.xplLog) {
			return;
		}*/
                
		console.log('xpl-shell -', log);
	},

        _sendXplStat: function(body, schema, target) {
                var self = this;                
                self.xpl.sendXplStat(
                        body,
                        schema,
			target
                );
        },   
        
        /*
         *  Config xPL message
         */
        
        readConfig: function(callback) {
                var self = this;
                fs.readFile(self.configFile, { encoding: "utf-8"}, function (err, body) {
                        if (err) self._log("file "+self.configFile+" is empty ...");
                        else {
                            self.configHash = JSON.parse(body);
                        }
                });
        },

        sendConfig: function(callback) {
                var self = this;
                self._sendXplStat(self.configHash, 'shell.config', '*');
        },
        
        writeConfig: function(evt) {
                var self = this;
		self.configHash.version = self.version;
                self.configHash.enable = evt.body.enable;
                fs.writeFile(self.configFile, JSON.stringify(self.configHash), function(err) {
                        if (err) self._log("file "+self.configFile+" was not saved to disk ...");
			else self._sendXplStat(self.configHash, 'shell.config', evt.header.source);
                });
        },

        /*
         *  Basic xPL message
         */
        
        readBasic: function(callback) {
                var self = this;
                fs.readFile(self.basicFile, { encoding: "utf-8"}, function (err, body) {
                        if (err) self._log("file "+self.basicFile+" is empty ...");
                        else self.basicHash = JSON.parse(body);
                });
        },

        sendBasic: function(callback) {
                var self = this;
                self.basicHash.forEach(function(item, index) {
                    self._sendXplStat(item, 'shell.basic', evt.header.source);
                });
        },
            
        /*
         *  Plugin specifics functions
         */

        sendCommand: function(evt, callback){
                var self = this;
                exec(evt.body.script + ' ' +  evt.body.parameters, function (error, stdout, stderr) {
                        if (error !== null) self._log('exec error: ' + error);
                });
        },    
        
        _puts: function puts(error, stdout, stderr) { 
                    sys.puts(stdout) ;
        }
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
