/*!
 * Sharepoint CSV
 * 'Exporting List View to CSV file'
 * https://blog.freezeq.com/2017/05/04/sharepoint-exporting-list-view-to-csv-file
 *
 * Copyright 2017 by freezeQ
 * Date: 2017-05-04T21:24:10.694Z
 */
 
var SPCsv = SPCsv || (function () {
    var _csv_header = '',
        _csv_body = '',
        _excludeFields = ["__metadata", "__deferred"],
        _CONFIG,
        _objArr,
        _spCsv = function(objArr, configs) {
            _objArr = objArr;
            _CONFIG = configs;
        };

    function _setConfig(configs) {
        // Ex: configs = [{field: "fieldName", title: "displayName", callback: function(x){ return x; }}]
        _CONFIG = configs;
    }
    function _getConfig(name) {
        var c = _CONFIG.filter(function (x) { return x.field === name; });

        return (c && c.length > 0) ? c[0] : null;
    }
    function _validateProperties(prop) {
        return _excludeFields.indexOf(prop) === -1;
    }
    function _getAsString() {
        var objArr = _objArr;

        if (objArr instanceof Array) {

            for (var o in objArr) {
                if (_validateProperties(o)) {
                    // Get CSV header
                    _generateHeader(objArr[o]);

                    // Generate CSV string
                    _csv_body += _getCSVPerObj(objArr[o]);

                    // Separate each line with \n
                    _csv_body += "\n";
                }
            }

            return _csv_header + "\n" + _csv_body;

        } else {
            throw new Error("Array of List Items results expected.");
        }
    }
    function _getAsArray() {
        var _arrayCSV = [],
            objArr = _objArr;

        if (objArr instanceof Array) {

            for (var o in objArr) {
                if (_validateProperties(o)) {
                    // Get CSV header
                    _generateHeader(objArr[o], _arrayCSV);

                    // Generate CSV string
                    var csv = _getCSVPerObj(objArr[o]);

                    // Separate each line with \n
                    csv = csv.concat("\n");

                    // Push to csv array
                    _arrayCSV.push(csv);
                }
            }

            return _arrayCSV;

        } else {
            throw new Error("Array of List Items results expected.");
        }
    }
    function _getCSVPerObj(obj) {
        var result = [];
        for (var o in obj) {
            if (_validateProperties(o)) {
                var field = o;
                var value = obj[o];

                if (value && _getConfig(o).callback) {
                    var callbackFunc = _getConfig(o).callback;
                    var r = callbackFunc.call(this, value);

                    result.push(r);
                } else {
                    if (typeof obj[o] === 'string') {

                        result.push(value);
                    } else {
                        var valueToArray = [];
                        _readObject(value, valueToArray);

                        var v = _runStringRule(valueToArray.join(','));
                        result.push(v);
                    }
                }
            }
        }

        return result.join(',');
    }
    function _readObject(obj, arr) {
        for (var o in obj) {
            if (_validateProperties(o)) {
                if (typeof obj[o] === 'object') {
                    _readObject(obj[o], arr);
                } else {
                    arr.push(obj[o]);
                }
            }
        }
    }
    function _generateHeader(obj, arrayCSV) {
        if (_csv_header == '') {
            var header = [];

            for (var o in obj) {
                if (_validateProperties(o)) {
                    var title = _getConfig(o).title;

                    if (title) {
                        header.push(_runStringRule(title))
                    } else {
                        header.push(_runStringRule(o));
                    }
                }
            }

            _csv_header = header.join(',');

            if (typeof arrayCSV != 'undefined')
                arrayCSV.push(_csv_header.concat("\n"));
        }
    }
    function _runStringRule(value) {
        // Rules for CSV string
        // 1. Encapsulate quote with quote
        value = value.replace(/"/g, '""');

        // 2. String contains [,] OR ['] must be encapsulated within quote
        if (value.indexOf(",") > 0
            || value.indexOf("'") > 0)
            value = '"' + value + '"';

        return value;
    }
    
    _spCsv.prototype.GetAsString = _getAsString;
    _spCsv.prototype.GetAsArray = _getAsArray;
    
    return _spCsv;
}());
