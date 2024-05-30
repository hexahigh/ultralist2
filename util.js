const fs = require('fs');

console.log("Sorting urls.json")
// Sort urls.json
fs.readFile('urls.json', 'utf8', function(err, data) {
    if (err) throw err;

    let array = JSON.parse(data);
    let arrayDedup = [...new Set(array)];

    arrayDedup.sort();

    // Write the sorted array back to the JSON file
    fs.writeFile('urls.json', JSON.stringify(arrayDedup, null, 2), 'utf8', function(err) {
        if (err) throw err;
        console.log('The file has been saved with the sorted array!');
    });
});
