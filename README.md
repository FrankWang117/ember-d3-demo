# ember-d3-demo

> ember-cli v3.16.0  
> node 10.16.0


## 1. 前期工作
### 1.1 修改项目为 Pods 目录（可选）
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

### 1.2 依赖安装
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

## 2. 选择元素和绑定数据
使用 d3 创建 hello world 文本。  
### 2.1 创建 d3/hello-world 组件
修改 handlerbars ：
``` handlerbars
<p class="d3-hello" {{did-insert this.hello}}></p>
```
修改 component 逻辑文件
``` typescript
import Component from '@glimmer/component';
import { action } from '@ember/object';
import {select} from 'd3-selection';

interface D3HelloWorldArgs {}

export default class D3HelloWorld extends Component<D3HelloWorldArgs> {
    @action
    hello() {
        select(".d3-hello").text("HELLOWORLD BY D3")
    }
}

```
在路由中使用此组件：
``` handlerbars
{{!-- d3 route file --}}
<h2>d3-1 helloworld</h2>
<D3::HelloWorld />
```
此时运行文件即可以看到：  
![helloworld](https://raw.githubusercontent.com/FrankWang1991/images/master/2020-02-28-截屏2020-02-2819.00.38-YsOPVT.png)

同样的：
``` handlerbars
import Component from '@glimmer/component';
import { action } from '@ember/object';
import {select} from 'd3-selection';

interface D3HelloWorldArgs {}

export default class D3HelloWorld extends Component<D3HelloWorldArgs> {
    @action
    hello() {
        let p = select(".d3-hello").text("HELLOWORLD BY D3");
        
        // 修改此元素的样式
        p.attr("title","helloWorld").style("color","lightblue")
    }
}
```
这样就可以改变字体的 style 样式了，并为此 P 标签添加了 title 属性，虽然没有什么作用。  
更多的关于 [d3-selection](https://github.com/xswei/d3-selection/blob/master/README.md#modifying-elements) 的 API 请查看链接。  

### 2.2 使用 .datum() / .data() 绑定数据
同样的创建 d3/bind-data 组件。  
``` handlerbars
{{!-- d3/bind-data.hbs --}}
<p class="d3-bind" {{did-insert this.dataBind}}></p>
<p class="d3-bind" {{did-insert this.dataBind}}></p>
<p class="d3-bind" {{did-insert this.dataBind}}></p>
<p class="d3-bind" {{did-insert this.dataBind}}></p>

<p class="d3-bind2" {{did-insert this.dataBind2}}></p>
<p class="d3-bind2" {{did-insert this.dataBind2}}></p>
```  
``` typescript
// d3/bind-data.ts
import Component from '@glimmer/component';
import { selectAll } from 'd3-selection';
import { action } from '@ember/object';

interface D3BindDataArgs { }

const STR = "DATABIND";
const ARR = ["落霞与孤鹜齐飞","秋水共长天一色"];
export default class D3BindData extends Component<D3BindDataArgs> {
    @action
    dataBind() {
        let p = selectAll('.d3-bind');
        p.datum(STR)
        p.text(function (d, i) {
            return `✨第 ${i} 个元素绑定的值是 ${d}✨`
        })
    }
    @action
    dataBind2() {
        let ps = selectAll(".d3-bind2");
        ps.data(ARR).text(function(d) {
            return d
        })
    }
}

```
同样的，在路由中使用此组件：
``` handlerbars
{{!-- d3 route file --}}
<h2>d3-1 helloworld</h2>
<D3::HelloWorld />
<div class="dropdown-divider"></div>
<h2>d3-2 bind-data</h2>
<D3::BindData />
```  
运行程序可以看到：
![data-bind](https://raw.githubusercontent.com/FrankWang1991/images/master/2020-02-28-截屏2020-02-2819.50.20-PYPSAC.png)

