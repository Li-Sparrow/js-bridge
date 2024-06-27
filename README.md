
## 使用示例
```js

import jsBridge from 'js-bridge';

// 检测客户端环境是否支持
const isSupportEnv  = jsBridge.isSupport();

// 调用某个接口
const api = 'xxx.yyy'; 
// 先检测接口是否支持
const isSupportApi = await jsBridge.api.check(api);

// 调用接口
if (isSupportApi) {
    const callRes = await jsBrdige.exec.execPromise(api);
} else {
    // TODO OTHER
}

```

## 功能结构
### api
### exec
### event
