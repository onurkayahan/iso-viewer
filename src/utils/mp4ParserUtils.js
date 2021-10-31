
export function arrayBufferToString(buffer, encoding, callback) {
    var blob = new Blob([buffer], { type: 'text/plain' });
    var reader = new FileReader();
    reader.onload = function (evt) { callback(evt.target.result); };
    reader.readAsText(blob, encoding);
}

export function stringToArrayBuffer(string, encoding, callback) {
    var blob = new Blob([string], { type: 'text/plain;charset=' + encoding });
    var reader = new FileReader();
    reader.onload = function (evt) { callback(evt.target.result); };
    reader.readAsArrayBuffer(blob);
}

//parse hexadecimal to string
export function hexToAscii(hex) {
    var hexStr = hex.toString();//force conversion
    var str = '';
    for (var i = 0; i < hexStr.length; i += 2)
        str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
    return str;
}

//parse hexadecimal to decimal
export function hexaDecimalToDecimal(hexString) {
    return parseInt(hexString, 16);
}

export function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        ;
}

export function hexStringToByteArray(str) {
    return str.match(/.{1,2}/g);
}