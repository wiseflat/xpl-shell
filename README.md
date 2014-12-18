# xpl-shell

## Objective

Node JS layer to execute shell script through xPL API

## Installation

    $ git clone https://github.com/wiseflat/xpl-shell.git
    $ npm update

## Usage

You need to install the xPL_Hub first : https://github.com/Tieske/xPL4Linux

Send xpl-cmnd to get the configuration of the module

    $ xpl-send -m cmnd -c shell.request

Send xpl-cmnd to add/update a configuration

    $ xpl-send -m cmnd -c shell.config label=script1 script="/usr/local/bin/my-script1.sh" parameters="param1 param2"
    $ xpl-send -m cmnd -c shell.config label=script2 script="/usr/local/bin/my-script2.sh" parameters="param1 param2"

Send xpl-cmnd to execute your script

    $ xpl-send -m cmnd -c shell.basic label=script1 script="/usr/local/bin/my-script1.sh" parameters="param1 param2"
    $ xpl-send -m cmnd -c shell.basic label=script2 script="/usr/local/bin/my-script2.sh
