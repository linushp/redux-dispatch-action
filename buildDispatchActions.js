var MyUtils = require('./MyUtils');


function isPayloadPromise(obj) {
    return obj && obj.payload && MyUtils.isPromise(obj.payload);
}

function buildDispatchAction(actionFunc, newActions) {

    return function () {
        var that = newActions;
        var args = MyUtils.arrayFrom(arguments);
        var action = actionFunc.apply(that, args); // {type,payload}
        var $store = that.$store;

        if (isPayloadPromise(action)) {

            var promiseObj = action.payload;
            var type = promiseObj.type;
            var meta = promiseObj.meta;

            $store.dispatch({type: MyUtils.toTypeString(type, 'PENDING'), payload: null, meta: meta});

            promiseObj = promiseObj.then(function (payload) {
                $store.dispatch({type: MyUtils.toTypeString(type, 'FULFILLED'), payload: payload, meta: meta});
                return payload;
            }, function (payload) {
                $store.dispatch({type: MyUtils.toTypeString(type, 'REJECTED'), payload: payload, meta: meta});
                return Promise.reject(payload);
            });

            action.payload = promiseObj;
        }

        else {
            $store.dispatch(action);
        }

        return action;
    }
}


function buildDispatchActions(actions) {
    var newActions = {};

    for (var actionName in actions) {
        if (actions.hasOwnProperty(actionName)) {
            var actionObj = actions[actionName];
            if (typeof actionObj === 'function') {
                newActions[actionName] = buildDispatchAction(actionObj, newActions);
            } else {
                newActions[actionName] = actionObj;
            }
        }
    }

    return newActions;
}


module.exports = buildDispatchActions;