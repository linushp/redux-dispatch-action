# redux-dispatch-action


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