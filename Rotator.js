/**
 * Convert a Uint8ClampedArray array into a 2 dimentional array 
 * where each element contains an object with RGBA values 
 *
 * @param {Uint8ClampedArray}   Array1D     The Uint8ClampedArray containing image RGBA values to convert
 * @param {int}                 width       The Image width
 * @param {int}                 height      The Image height
 *
 * @return {Array[height][width] } Return new 2 dimentional array 
 */
function convertTo2DArray(Array1D, width, height) {

    let Array2D = []
    let xrow = [];

    for (let count = 0; count < (width * height) * 4; count += 4) {

        xrow.push({
            "R": Array1D[count],
            "G": Array1D[count + 1],
            "B": Array1D[count + 2],
            "A": Array1D[count + 3]
        })

        if (xrow.length % width == 0) {

            Array2D.push(xrow)
            xrow = [];
        }
    }
    return Array2D;
}

/**
 * The 2d array will be resized to ensure the full image will be rotated
 *
 * The array will be padded with object containg RGBA values with alpha set to transparent
 * 
 * @param {Array[][]}   Array2D      Description.
 * @param {int}         paddingX     Nunber of Y rows to add
 * @param {int}         paddingY     Number of x columns to add
 
 * @return {Array[][]} Return value description.
 */
function Resize2dArray(Array2D, paddingX, paddingY) {
    let oldSizeX = Array2D[0].length;
    let oldSizeY = Array2D.length;
    let newRGBAobject = {
        "R": 255,
        "G": 0,
        "B": 0,
        "A": 0
    }

    // first pad all the X values
    for (let i = 0; i < Array2D.length; i++) {

        // insert padding in front of the array
        for (let j = 0; j < paddingX; j++) {
            Array2D[i].unshift({
                "R": 255,
                "G": 0,
                "B": 0,
                "A": 255
            });
        }


        // insert padding at the back of the array
        for (let j = 0; j < paddingX; j++) {
            Array2D[i].push({
                "R": 255,
                "G": 0,
                "B": 0,
                "A": 255
            });
        }

    }

    // now padd all the top Y values
    let emptyXArray = [];
    for (let j = 0; j < (paddingX * 2 + oldSizeX); j++) {
        emptyXArray.push({
            "R": 255,
            "G": 0,
            "B": 0,
            "A": 255
        });
    }
    // now padd the front array
    for (let i = 0; i < paddingY; i++) {
        Array2D.unshift(emptyXArray);
    }
    // now padd pad the rear array
    for (let i = 0; i < paddingY; i++) {
        Array2D.push(emptyXArray);
    }
    return Array2D;
}

/**
 * Converts a 2 dimentional array containing the object with RGBA values back
 * into the format Uint8ClampedArray
 *
 * @param {array[][]}   Array2D  The 2d array contaiing object with RGBA values
 *
 * @return {Uint8ClampedArray} The Uint8ClampedArray array containing the RGBA values
 */
function convertTo1DArray(Array2D) {
    let Array1D = [];
    for (let y = 0; y < Array2D.length; y++) {
        for (let x = 0; x < Array2D[y].length; x++) {

            try {
                Array1D.push(Array2D[y][x].R)
                Array1D.push(Array2D[y][x].G)
                Array1D.push(Array2D[y][x].B)
                Array1D.push(Array2D[y][x].A)
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    return Array1D;
}

/**
 * Compare two Uint8ClampedArray arrays to see if their values matches
 *
 * @param {Uint8ClampedArray}   array1       First Uint8ClampedArray
 * @param {Uint8ClampedArray}   array1       Uint8ClampedArray to compare to
 *
 * @return {bool} Returns true if the two Uint8ClampedArray matches
 */

function checkArrayMatches(array1, array2) {
    if (array1.length != array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) return false;
    }
    return true;
}

/**
 * Main entry function that manipulates to the data into a 2D X,Y array
 * containing the object with the RGBA properties
 *
 * @param {ImageData}   image        The Image to rotate 
 * @param {double}      angle        The angle in radians to rotate
 *
 * @return {ImageData} Return the rotated image
 */
function rotate(image, angle) {
    // check if valid anle is input
    if (typeof (angle) != 'number') {
        console.log("Error, not a valid angle. Must specify angle in radians");
        return image;
    }


    let array2D = convertTo2DArray(image.data, image.width, image.height);
    // rotate the image using a bi-linear interpolation algorithm
    let newRotation = rotateBilinear(array2D, angle, 0, 0)
    let newSizeX = array2D[0].length;
    let newSizeY = array2D.length;
    let newRotationData = convertTo1DArray(newRotation);

    let i = 0;
    // repopulate the ImageData, ImageData object does not allow direct assigment
    for (let y = 0; y < newSizeY * newSizeX * 4; y++) {
        image.data[i] = newRotationData[i];//x;        // 
        i++;
    };

    return image;

}

/**
 * This is the function where the bilinear interpolation is implemented
 * A rotated image is generated by generating each pixel of the rotated image
 * using trigonometry to sample a pixel from the original image.
 * Bilinear interpolation is used to get a average pixel RGBA value by sampling the
 * four pixels closest to the sampling point
 * 
 * Part of the code was based on implementation from
 * http://polymathprogrammer.com/2008/10/06/image-rotation-with-bilinear-interpolation/
 * 
 * @param {Array[][]}   image2DArray     The 2d Array containing the objects with RGBA properties
 * @param {double}      angle            Teh angle to rotate theimage in radians, positive rotates clockwise   
 * @param {int}         centerx          Description of optional variable with default variable.
 * @param {int}         centery          Description.
 *
 * @return {Array[][]} NewArray Returns a 2d Array containing the object with properties R,G,B,A
 */
function rotateBilinear(image2DArray, angle, centerx, centery) {

    let center_x = centerx;
    let center_y = centery;
    const oldArray = JSON.parse(JSON.stringify(image2DArray)); // Make a deep copy to break reference
    let NewArray = Array.from(oldArray);
    let sizeX = NewArray[0].length;
    let sizeY = NewArray.length;
    // loop through the new image X and y coordinates to generate a object with RGBA properties
    for (let y = 0; y < sizeY; y++) {
        let y_trans = parseInt(sizeY / 2 - y); // convert to cartesion coordinates
        for (let x = 0; x < sizeX; x++) {
            let x_trans = parseInt(x - sizeX / 2); // convert to cartesion coordinates

            // sample from the original an RGBA value for the rotated image
            let xp = ((x_trans - center_x) * Math.cos(angle) - (y_trans - center_y) * Math.sin(angle) + center_x);
            let yp = ((x_trans - center_x) * Math.sin(angle) + (y_trans - center_y) * Math.cos(angle) + center_y);

            let trueX = (xp + sizeX / 2) // convert back to raster coordinates
            let trueY = (sizeY / 2 - yp) // convert back to raster coordinates

            // find the 4 pixels closest to the sampled value
            let floorX = (Math.floor(trueX));
            let floorY = (Math.floor(trueY));
            let ceilingX = (Math.ceil(trueX));
            let ceilingY = (Math.ceil(trueY));



            try {
                // set th epixel so transparent if the points are outside of the image size
                if ((floorX >= 0) && (ceilingX >= 0) && (floorX < sizeX) && (ceilingX < sizeX) &&
                    (floorY >= 0) && (ceilingY >= 0) && (floorY < sizeY) && (ceilingY < sizeY)) {
                    // calculate error between nearest X pixels
                    let DeltaX = trueX - floorX;
                    // calculate error between nearest Y pixels
                    let DeltaY = trueY - floorY;

                    let clrTopLeft = image2DArray[floorY][floorX];
                    let clrTopRight = image2DArray[floorY][ceilingX];
                    let clrBottomLeft = image2DArray[ceilingY][floorX];
                    let clrBottomRight = image2DArray[ceilingY][ceilingX];

                    // linearly interpolate horizontally between top neighbours
                    let fTopRed = (1 - DeltaX) * clrTopLeft.R + DeltaX * clrTopRight.R;
                    let fTopGreen = (1 - DeltaX) * clrTopLeft.G + DeltaX * clrTopRight.G;
                    let fTopBlue = (1 - DeltaX) * clrTopLeft.B + DeltaX * clrTopRight.B;
                    let fTopAlpha = (1 - DeltaX) * clrTopLeft.A + DeltaX * clrTopRight.A;

                    // linearly interpolate horizontally between bottom neighbours
                    let fBottomRed = (1 - DeltaX) * clrBottomLeft.R + DeltaX * clrBottomRight.R;
                    let fBottomGreen = (1 - DeltaX) * clrBottomLeft.G + DeltaX * clrBottomRight.G;
                    let fBottomBlue = (1 - DeltaX) * clrBottomLeft.B + DeltaX * clrBottomRight.B;
                    let fBottomAlpha = (1 - DeltaX) * clrBottomLeft.A + DeltaX * clrBottomRight.A;

                    // linearly interpolate vertically between top and bottom interpolated results
                    let iRed = parseInt(Math.round((1 - DeltaY) * fTopRed + DeltaY * fBottomRed));
                    let iGreen = parseInt(Math.round((1 - DeltaY) * fTopGreen + DeltaY * fBottomGreen));
                    let iBlue = parseInt(Math.round((1 - DeltaY) * fTopBlue + DeltaY * fBottomBlue));
                    let iAlpha = parseInt(Math.round((1 - DeltaY) * fTopAlpha + DeltaY * fBottomAlpha));

                    // make sure colour and alpha values are valid
                    if (iRed < 0) iRed = 0;
                    if (iRed > 255) iRed = 255;
                    if (iGreen < 0) iGreen = 0;
                    if (iGreen > 255) iGreen = 255;
                    if (iBlue < 0) iBlue = 0;
                    if (iBlue > 255) iBlue = 255;
                    if (iAlpha < 0) iAlpha = 0;
                    if (iAlpha > 255) iAlpha = 255;
                    // create the new pixel values
                    NewArray[y][x] = { "R": iRed, "G": iGreen, "B": iBlue, "A": iAlpha }
                } else {
                    // Set pixel to transparent
                    NewArray[y][x] = { "R": 0, "G": 0, "B": 0, "A": 0 }
                }
            }
            catch (err) {

            }
        }
    }
    return NewArray;
}

// export the function rotate that will rotate a image of type ImageData by angle in radians
module.exports = { rotate }