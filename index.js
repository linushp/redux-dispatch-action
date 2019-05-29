
var MyUtils = require('./MyUtils');


function handleAutoDispatch(target, key, descriptor, type, meta = {}) {

    type = type || key;

    var originFunction = descriptor.value;

    descriptor.value = function () {

        var that = this;

        var args = MyUtils.arrayFrom(arguments);

        var $store = that.$store;
        var result = originFunction.apply(this, args);

        if (MyUtils.isPromise(result)) {

            $store.dispatch({
                type: MyUtils.toTypeString(type, 'PENDING'),
                payload: null,
                args: args,
                meta: meta
            });


            result = result.then(function (payload) {
                $store.dispatch({
                    type: MyUtils.toTypeString(type, 'FULFILLED'),
                    payload: payload,
                    args: args,
                    meta: meta
                });
                return payload;
            }, function (payload) {
                $store.dispatch({
                    type: MyUtils.toTypeString(type, 'REJECTED'),
                    payload: payload,
                    args: args,
                    meta: meta
                });
                return Promise.reject(payload);
            });
        }


        else {
            $store.dispatch({
                type: type,
                payload: result,
                args: args,
                meta: meta
            });
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