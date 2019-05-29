# redux-dispatch-action


```javascript

npm install --save redux-dispatch-action


```

actions.js

```javascript




import dispatchAction from '../redux-dispatch-action';


class Actions {
    constructor() {
        this.$store = null;
    }

    setStore(store) {
        this.$store = store;
    }

    @dispatchAction
    selectSubreddit(subreddit) {
        return subreddit
    }

    @dispatchAction
    invalidateSubreddit(subreddit){
        return subreddit
    }

    @dispatchAction(REQUEST_POSTS)
    fetchPostsIfNeeded(subreddit){
        return new Promise((resolve,reject) =>{
            var xxx = this.invalidateSubreddit(subreddit);
            setTimeout(function () {
                resolve({name:23323})
            },100);
        })
    }

}


export default new Actions();

```



reducers.js

```javascript


import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

const selectedSubreddit = (state = 'reactjs', action) => {

  switch (action.type) {
    case SELECT_SUBREDDIT:
        var args = action.args || [];
      return args[0];
    default:
      return state
  }
};

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {

    var payload = action.payload;

  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_POSTS + '_PENDING':
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case REQUEST_POSTS + '_FULFILLED':
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: payload.posts,
        lastUpdated: payload.receivedAt
      }
    default:
      return state
  }
}

const postsBySubreddit = (state = { }, action) => {

  var payload = action.payload;
  var args = action.args || [];

  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case 'REQUEST_POSTS_PENDING':
    case 'REQUEST_POSTS_FULFILLED':
        var subreddit = args[0];

        return {
        ...state,
        [subreddit]: posts(state[subreddit], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit
})

export default rootReducer


```




index.js

```javascript


import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import App from './containers/App'

import Actions from './actions';

const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}
const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);
Actions.setStore(store);


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

```



# 一个例子

要依赖于ES7的装饰器对class的方法进行装饰，所以需要使用babel进行转码。

## redux-dispatch-action-demo


### babel7presetstage0 封装了babel7 的 preset-stage-0


package.json
```json


{
  "name": "redux-dispatch-action-demo",
  "version": "0.0.1",
  "private": true,
  "devDependencies": {
    "@babel/core": "^7.4.5",
    "@babel/preset-env": "^7.4.5",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^8.0.6",
    "babel7presetstage0": "^1.0.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "webpack": "^4.32.2",
    "webpack-cli": "^3.3.2",
    "webpack-dev-server": "^3.4.1"
  },
  "dependencies": {
    "prop-types": "^15.7.2",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-redux": "^7.0.2",
    "redux": "^4.0.1",
    "redux-logger": "^3.0.6",
    "redux-thunk": "^2.3.0"
  },
  "scripts": {
    "start": "webpack-dev-server --open --mode development",
    "build": "webpack"
  }
}



```



### webpack.config.js

```javascript

const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ]
};
```


.babelrc 

```json

{
  "presets": ["@babel/preset-env", "@babel/preset-react" , "module:babel7presetstage0"]
}

```


