# ember-d3-demo

> ember-cli v3.16.0
> node 10.16.0


## 修改项目为 Pods 目录
``` javascript
// config/environment.js
let ENV = {
    modulePrefix: 'ember-d3-demo',
    podModulePrefix: 'ember-d3-demo/modules',
    // ...
  };
``` 
``` javascript
// .ember-cli
{
  "disableAnalytics": false,
  "usePods": true
}
```

## 依赖安装
首先是可选安装 typescript 
```azurepowershell
ember install ember-cli-typescript@latest && yarn add typescript@3.7.5
```
安装 d3， 由于上面是使用了 typescript，所以安装命令变为：
```azurepowershell
ember install ember-d3 && npm i --save @types/d3
```  
如果没有安装 typescript 那就按照官方教程正常安装即可：
```azurepowershell
ember install ember-d3 && yarn add --save-dev d3@5.15.0
```
至此，关于 d3 的依赖安装完毕，如果是非 ember octane 版本，这时候可以跳过下面的说明，继续使用了。
由于octane 版本中修改了 component / controller / route 等改为类的继承与扩展。对于 component 来说就是组件的声明周期不再是 `didInsertElement` ，而是变成了使用 [modifier](https://blog.emberjs.com/2019/03/06/coming-soon-in-ember-octane-part-4.html) .就需要多一步的安装：
```shell
ember install @ember/render-modifiers
```
**注意：以后的 ember 版本可能会默认添加此 modifier**  
