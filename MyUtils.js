function isPromise(obj) {
    return !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        ((obj.constructor && obj.constructor.name === 'Promise') || typeof obj.then === 'function')
}


function toTypeString(type, status) {
    return [type, status].join('_');
}


function arrayFrom(arrayLike) {
    var newArray = [];
    if (arrayLike && arrayLike.length && arrayLike.length > 0) {
        for (var i = 0; i < arrayLike.length; i++) {
            var obj = arrayLike[i];
            newArray.push(obj);
        }
    }
    return newArray;
}


module.exports = {
    isPromise: isPromise,
    toTypeString: toTypeString,
    arrayFrom: arrayFrom
};