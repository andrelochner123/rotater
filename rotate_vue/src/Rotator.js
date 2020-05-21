/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @param {type}   var           Description.
 * @param {type}   [var]         Description of optional variable.
 * @param {type}   [var=default] Description of optional variable with default variable.
 * @param {Object} objectVar     Description.
 * @param {type}   objectVar.key Description of a key in the objectVar parameter.
 *
 * @return {type} Return value description.
 */
// take 1 dimentional array and convert it to 2 dimentional array
// Array structure keeps RGBA values for each point
function convertTo2DArray(Array1D, width, height) {
    //console.log("1D Array Size :" + Array1D.length);
    //console.log("Calculated nr Entries : " + (width * height) * 4)
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
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @param {type}   var           Description.
 * @param {type}   [var]         Description of optional variable.
 * @param {type}   [var=default] Description of optional variable with default variable.
 * @param {Object} objectVar     Description.
 * @param {type}   objectVar.key Description of a key in the objectVar parameter.
 *
 * @return {type} Return value description.
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
    //console.log(Array2D[0][0]);

    //console.log("Padding : " + paddingX)
    // first pad all the X values
    for (let i = 0; i < Array2D.length; i++) {

        // insert padding in front
        for (let j = 0; j < paddingX; j++) {
            Array2D[i].unshift({
                "R": 255,
                "G": 0,
                "B": 0,
                "A": 255
            });
        }


        // insert padding at the back
        for (let j = 0; j < paddingX; j++) {
            Array2D[i].push({
                "R": 255,
                "G": 0,
                "B": 0,
                "A": 255
            });
        }
        //console.log(Array2D[i].length)
        // console.log(Array2D[i][Array2D[i].length - 1])
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
    // now padd all the top Y values
    for (let i = 0; i < paddingY; i++) {
        Array2D.unshift(emptyXArray);
    }
    // now padd all the bottom Y values
    for (let i = 0; i < paddingY; i++) {
        Array2D.push(emptyXArray);
    }
    return Array2D;
}
/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @param {type}   var           Description.
 * @param {type}   [var]         Description of optional variable.
 * @param {type}   [var=default] Description of optional variable with default variable.
 * @param {Object} objectVar     Description.
 * @param {type}   objectVar.key Description of a key in the objectVar parameter.
 *
 * @return {type} Return value description.
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
                console.log(x + "- " + y);
                console.log(err);

            }
        }
    }
    return Array1D;

}
/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @param {type}   var           Description.
 * @param {type}   [var]         Description of optional variable.
 * @param {type}   [var=default] Description of optional variable with default variable.
 * @param {Object} objectVar     Description.
 * @param {type}   objectVar.key Description of a key in the objectVar parameter.
 *
 * @return {bool} Return value description.
 */
// check if two 1D arrays have the same values
function checkArrayMatches(array1, array2) {
    if (array1.length != array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) return false;
    }
    return true;
}
/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @param {type}   var           Description.
 * @param {type}   [var]         Description of optional variable.
 * @param {type}   [var=default] Description of optional variable with default variable.
 * @param {Object} objectVar     Description.
 * @param {type}   objectVar.key Description of a key in the objectVar parameter.
 *
 * @return {type} Return value description.
 */
// rotate(image: ImageData, angle: double) : ImageData
// image.data : 4 items RGBA
// image.height : height in pixels
// image.width  : width in pixels
//  4 x height x width
function rotate(image, angle) {
    //console.log(image)


    let diagonalLength = Math.sqrt(
        Math.pow(image.width, 2) + Math.pow(image.height, 2)
    );
    let paddingX = parseInt((diagonalLength - image.width) / 2);
    let paddingY = parseInt((diagonalLength - image.height) / 2);

    //console.log(convertTo2DArray(image.data, image.width, image.height));
    let imagewidth = image.width;
    let imageheight = image.height;

    let array2D = convertTo2DArray(image.data, image.width, image.height);
    //array2D = Resize2dArray(array2D, paddingX, paddingY)

    //let flatAgain = convertTo1DArray(array2D)

    //let centerX = parseInt(image.width / 2)
    //let centerY = parseInt(image.height / 2)

    let centerX = parseInt(0)
    let centerY = parseInt(0)

    let newRotation = copyPixels(array2D, angle, centerX, centerY)
    //let newRotation = copyPixelsBilinear(array2D, angle, centerX, centerY)

    let newSizeX = array2D[0].length;
    let newSizeY = array2D.length;

    let newRotationData = convertTo1DArray(newRotation);
    // image.data = convertTo1DArray(newRotation);
    //image.data = flatAgain
    //image.data = convertTo1DArray(newRotation);
    //console.log(image.data);

    //console.log(image.data)
    /*if (checkArrayMatches(flatAgain, image.data))
        console.log("Arrays match");
    else
        console.log("Array Mismatch");
*/
    var i = 0;

    //console.log(typeof (image.data[0]) + " -vs- " + typeof (newRotationData[0]));

    image.width = newSizeX;
    image.height = newSizeY;

    for (var y = 0; y < newSizeY * newSizeX * 4; y++) {
        image.data[i] = newRotationData[i];//x;        // the Red component of (x,y), which is set to x
        i++;
    };
    //console.log(image.data);
    let test = Uint8ClampedArray.from(image.data)
    console.log(image.width + " " + image.height);
    console.log(typeof (test));
    return {
        data: test,
        width: image.width,
        height: image.height
    }
    //return image;
    // console.log(newRotation);
}
/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @param {type}   image2DArray     Description.
 * @param {type}   angle_deg        Description of optional variable.
 * @param {type}   centerx          Description of optional variable with default variable.
 * @param {Object} centery          Description.
 *
 * @return {Object} NewArray Returns a 2d Array containing the object with properties R,G,B,A
 */
function copyPixels(image2DArray, angle_deg, centerx, centery) {
    let angle = (2 * angle_deg * Math.PI) / 360;  // angle in radian
    let center_x = centerx;
    let center_y = centery;
    const oldArray = JSON.parse(JSON.stringify(image2DArray)); // Make a deep copy to break refrence
    let NewArray = Array.from(oldArray);
    let sizeX = NewArray[0].length;
    let sizeY = NewArray.length;

    for (let y = 0; y < sizeY; y++) {
        let y_trans = parseInt(sizeY / 2 - y); // convert to cartesion coordinates
        for (let x = 0; x < sizeX; x++) {
            let x_trans = parseInt(x - sizeX / 2); // convert to cartesion coordinates
            let xp = parseInt((x_trans - center_x) * Math.cos(angle) - (y_trans - center_y) * Math.sin(angle) + center_x);
            let yp = parseInt((x_trans - center_x) * Math.sin(angle) + (y_trans - center_y) * Math.cos(angle) + center_y);
            //console.log(xp + " " + yp);
            let xfixed = parseInt(xp + sizeX / 2)
            let yfixed = parseInt(sizeY / 2 - yp)

            xp = xfixed;
            yp = yfixed;

            try {
                if (((xp >= 0) && (xp < sizeX)) && ((yp >= 0) && (yp < sizeY))) {

                    let newY = parseInt((y - (sizeY - 1)) * -1)
                    NewArray[y][x] = image2DArray[yp][xp];
                } else {
                    let newY = parseInt((y - (sizeY - 1)) * -1)
                    NewArray[y][x] = { "R": 0, "G": 0, "B": 0, "A": 0 }
                }
            }
            catch (err) {

            }
        }
    } // end for
    return NewArray;
}
/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @param {type}   image2DArray     Description.
 * @param {type}   angle_deg        Description of optional variable.
 * @param {type}   centerx          Description of optional variable with default variable.
 * @param {Object} centery          Description.
 *
 * @return {Object} NewArray Returns a 2d Array containing the object with properties R,G,B,A
 */
function copyPixelsBilinear(image2DArray, angle_deg, centerx, centery) {
    let angle = (2 * angle_deg * Math.PI) / 360;  // angle in radian
    let center_x = centerx;
    let center_y = centery;
    const oldArray = JSON.parse(JSON.stringify(image2DArray)); // Make a deep copy to break refrence
    let NewArray = Array.from(oldArray);
    let sizeX = NewArray[0].length;
    let sizeY = NewArray.length;

    for (let y = 0; y < sizeY; y++) {
        let y_trans = parseInt(sizeY / 2 - y); // convert to cartesion coordinates
        for (let x = 0; x < sizeX; x++) {
            let x_trans = parseInt(x - sizeX / 2); // convert to cartesion coordinates
            let xp = parseInt((x_trans - center_x) * Math.cos(angle) - (y_trans - center_y) * Math.sin(angle) + center_x);
            let yp = parseInt((x_trans - center_x) * Math.sin(angle) + (y_trans - center_y) * Math.cos(angle) + center_y);

            let trueX = (xp + sizeX / 2) // convert back to raster coordinates
            let trueY = (sizeY / 2 - yp) // convert back to raster coordinates

            let floorX = (Math.floor(trueX));
            let floorY = (Math.floor(trueY));
            let ceilingX = (Math.ceil(trueX));
            let ceilingY = (Math.ceil(trueY));

            //console.log(floorX + " " + ceilingX + " " + floorY + " " + ceilingY);

            try {
                if ((floorX >= 0) && (ceilingX >= 0) && (floorX < sizeX) && (ceilingX < sizeX) &&
                    (floorY >= 0) && (ceilingY >= 0) && (floorY < sizeY) && (ceilingY < sizeY))
                //if (((xp >= 0) && (xp < sizeX)) && ((yp >= 0) && (yp < sizeY))) {
                {

                    let DeltaX = trueX - floorX;
                    let DeltaY = trueY - floorY;
                    //console.log(DeltaX + " " + DeltaY);
                    let clrTopLeft = image2DArray[floorY][floorX];
                    let clrTopRight = image2DArray[floorY][ceilingX];
                    let clrBottomLeft = image2DArray[ceilingY][floorX];
                    let clrBottomRight = image2DArray[ceilingY][ceilingX];

                    // linearly interpolate horizontally between top neighbours
                    let fTopRed = (1 - DeltaX) * clrTopLeft.R + DeltaX * clrTopRight.R;
                    let fTopGreen = (1 - DeltaX) * clrTopLeft.G + DeltaX * clrTopRight.G;
                    let fTopBlue = (1 - DeltaX) * clrTopLeft.B + DeltaX * clrTopRight.B;
                    let fTopAlpha = (1 - DeltaX) * clrTopLeft.A + DeltaX * clrTopRight.A;
                    //console.log(fTopRed + " " + fTopGreen + " " + fTopBlue + " " + fTopAlpha);
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

                    // make sure colour values are valid
                    if (iRed < 0) iRed = 0;
                    if (iRed > 255) iRed = 255;
                    if (iGreen < 0) iGreen = 0;
                    if (iGreen > 255) iGreen = 255;
                    if (iBlue < 0) iBlue = 0;
                    if (iBlue > 255) iBlue = 255;
                    if (iAlpha < 0) iAlpha = 0;
                    if (iAlpha > 255) iAlpha = 255;
                    //console.log(iRed + " " + iGreen + " " + iBlue + " " + iAlpha);
                    NewArray[y][x] = { "R": iRed, "G": iGreen, "B": iBlue, "A": iAlpha }
                } else {

                    NewArray[y][x] = { "R": 0, "G": 0, "B": 0, "A": 0 }
                }
            }
            catch (err) {

            }
        }
    } // end for
    return NewArray;
}


module.exports = { rotate }