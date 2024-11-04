const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src/aws-exports.js');
const destPath = path.join(__dirname, 'idg-portal-ui/src/aws-exports.js');

fs.copyFile(srcPath, destPath, (err) => {
    if (err) throw err;
    console.log('aws-exports.js was copied to idg-portal-ui folder.');
});

const srcPath1 = path.join(__dirname, 'src/amplifyconfiguration.json');
const destPath1 = path.join(__dirname, 'idg-portal-ui/src/amplifyconfiguration.json');

fs.copyFile(srcPath1, destPath1, (err) => {
    if (err) throw err;
    console.log('amplifyconfiguration.json was copied to idg-portal-ui folder.');
});