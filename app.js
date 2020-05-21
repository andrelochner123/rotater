
Rotator = require('./Rotator.js');
moment = require('moment');
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas');
// set the following based on the test image
const imageWidth = 825;
const imageHeight = 510;
const outputFilename = 'test.png';
const inputFile = 'testscreen.png';
const angle_degree = 45;

const canvas = createCanvas(imageWidth, imageHeight);
const ctx = canvas.getContext('2d');


const out = fs.createWriteStream(__dirname + '/' + outputFilename);

out.on('finish', () => console.log('The PNG file was created.'));
//loadImage('./pix9x9.png').then((image) => {
loadImage('./' + inputFile).then((image) => {

    //canvas.width = diagonalLength;
    //canvas.height = diagonalLength;
    ctx.drawImage(image, 0, 0);
    //var imDat = ctx.createImageData(imageWidth, imageWidth);
    var imDat = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.fillStyle = 'green';
    ctx.clearRect(0, 0, imageWidth, imageHeight)
    var startTime = moment();

    let angle_radians = (2 * angle_degree * Math.PI) / 360;  // angle in radian
    let newData = Rotator.rotate(imDat, angle_radians)
    var millDiff = moment().diff(startTime, 'mi')
    console.log("Time to run " + millDiff + "ms");
    ctx.putImageData(newData, 0, 0)

    const stream = canvas.createPNGStream();
    stream.pipe(out);
}).catch(err => {
    console.log('Could not load image', err)
})



