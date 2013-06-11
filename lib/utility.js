//Utiliy functions
exports.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

exports.rgbToHex = function (r, g, b) {
    return "#" + exports.componentToHex(r) + exports.componentToHex(g) + exports.componentToHex(b);
}

exports.hexToRgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
