function isPromise(obj) {
    return !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        ((obj.constructor && obj.constructor.name === 'Promise') || typeof obj.then === 'function')
}


function toTypeString(type, status) {
    return [type, status].join('_');
}


function handleAutoDispatch(target, key, descriptor, type, meta = {}) {

    type = type || key;

    var originFunction = descriptor.value;

    descriptor.value = function () {
        var that = this;
        var args = Array.from(arguments);

        var $store = that.$store;
        var result = originFunction.apply(this, args);

        if (isPromise(result)) {

            $store.dispatch({type: toTypeString(type, 'PENDING'), payload: null, meta: meta});

            result = result.then(function (payload) {
                $store.dispatch({type: toTypeString(type, 'FULFILLED'), payload: payload, meta: meta});
                return payload;
            }, function (payload) {
                $store.dispatch({type: toTypeString(type, 'REJECTED'), payload: payload, meta: meta});
                return Promise.reject(payload);
            });
        }

        else {
            $store.dispatch({type: type, payload: result, meta: meta});
        }

        return result;
    };
    return descriptor;
}


function dispatch_action(target, key, descriptor) {
    if (typeof target === 'string') {
        var typeName = target;
        var metaData = key || {};
        return function (target1, key1, descriptor1) {
            return handleAutoDispatch(target1, key1, descriptor1, typeName, metaData);
        }
    }
    return handleAutoDispatch(target, key, descriptor);
}


module.exports = dispatch_action;