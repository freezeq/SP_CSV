# SPCsv
Simple library to export SharePoint List Items into CSV format. Which comply rules:
- string contains quote, should be preceded with quote
- string contains comma, single quote should be encapsulted within quotes

## How to use
### Constructor

```
var spcsv = new SPCsv( data [, configs])
```
<dl>
<dt>data</dt>
<dd>Type: Array

Array returned from calling SP rest API where one array represents SPList Item value.</dd>

<dt>configs</dt>
<dd>Type: Array

Array of configuration object. Defining configuration for each field.
There are 3 objects:

```field``` (Required) = String. Name of field.

```title``` (Optional) = String. Title for this field.

```callback``` (Optional) = Function. Callback for this field.
</dd>
</dl>



### Methods

```spcsv.GetAsArray()``` Return result as Array. One line per index.

```spcsv.GetAsString()``` Return result as String. End of each line will get "\n"



## Example

```javascript
$.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists(guid'" + listId + "')/Items" + query,
    headers: {
        'accept': 'application/json; odata=verbose',
        'X-RequestDigest': $('#__REQUESTDIGEST').val()
    }
})
.done(function (itemdata) {    
    var configs = [
      { field: "Title",
        title: "Employee Name",
        callback: function(x) { return x.toUpperCase(); }
      },
      { field: "Author",
        title: "Created By"
      }
    ];
    var arr = new SPCsv(itemdata.d.results, configs); 
    arr.GetAsArray();
    arr.GetAsString();
})
```
