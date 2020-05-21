# Rotater
Implements a function to rotate ImageData object obtained from HTML Canvas using BiLinear Interpolation.

## Installation

Clone the repository. Run command *npm install* in the root folder
To use the vue test interface browse to the folder rotate_vue and run *npm install* in that folder as well.

## Function prototype

The rotator function can be found in file rotate.js

The function follows the following prototype

**rotate(image: ImageData, angle: double) : ImageData**

The angle must be specified in radians

## Testing the function in NODE JS

To test this function a node application app.js is provided
This file will rotate an image specified in the file by an angle in degrees. The angle in degrees will be converted to 
radians as required by the function prototype
To define the test file parameters change the following variables at the top of the file

```javascript
const imageWidth = 825;
const imageHeight = 510;
const outputFilename = 'test.png';
const inputFile = 'testscreen.png';
const angle_degree = 45;
```
Run the command **node app**. This will generate a rotated png file in the same folder.

## Testing the function in a browser

Browse to the folder rotate_vue. Open a command window and run command npm run serve
The browser based test will then be available at http://localhost:8080/. Open and past this link in the 
browser to view the vue example. 

Click on Rotate button to rotate the image by 5 degrees. 

