# ember-d3-demo

> ember-cli v3.16.0  
> node 10.16.0

## 0. 前言
1. 它是声明式的，不是命令式的d3的第一个核心是：数据驱动的dom元素创建，把这个思想上的弯绕过来，掌握1/3了
2. 它是数据处理包，不是图形绘制包d3的第二个核心是：它的大量的api，提供的是对数据的转换与处理，无论是scale、layout还是svg.line等，都仅仅是对数据的处理，和绘制图形与DOM操作没有半毛关系。把这个思想上的弯绕过来，又掌握1/3了
3. 它的api通常返回的是一个函数，这个函数的具体功能，通过函数对象的方法约定。d3的javascript写法不是那么符合常人的逻辑，比如：调用d3.svg.line()，这个我们获得的是一个line函数，作用是把原始数据转化成svg的path元素的d属性需要的字符串，如果连起来写的话是这样：var nd=d3.svg.line()(data); 这样获得的nd才是可以塞给path的d属性的东西。把这个思想上的弯绕过来，又掌握1/3

以上三点转过来以后，基本算理解d3背后的思路了，大约看文档也可以独立写点东西出来了。d3的使用模式如下：

	- step1：准备数据
	- step2：创建dom
	- step3：设置属性

作者：ciga2011 ， [来源](https://www.zhihu.com/question/22171866/answer/22512521)
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
![data-bind](https://raw.githubusercontent.com/FrankWang1991/images/master/2020-02-28-截屏2020-02-2819.50.20-PYPSAC.png). 

## 3. 做一个简单的图表

先从最简单的 柱状图 开始：

涉及到 HTML 5 中的 [svg](https://developer.mozilla.org/zh-CN/docs/Web/SVG)

### 3.1 添加画布

在上一章节中，只是简单的使用 D3 添加文本元素，而添加 svg 的代码是：

``` handlebars
{{!-- d3/basic-histogram.hbs --}}
<h3>3.1 append svg to element</h3>
<div class="basic-svg-container" {{did-insert this.appendSvg}}></div>
```

``` typescript
// d3/basic-histogram.ts
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection';

interface D3BasicHistogramArgs {}

export default class D3BasicHistogram extends Component<D3BasicHistogramArgs> {
    @action
    appendSvg() {
        let container = select(".basic-svg-container");
        container.append('svg')
        .attr("width",200)
        .attr("height",123.6)
        .style("background-color","orange")
    }
}
```

简单的向 div 元素中添加一个背景颜色为 orange 的 svg：

![2020-03-02-截屏2020-03-0210.40.40-T9mNTf](https://raw.githubusercontent.com/FrankWang1991/images/master/2020-03-02-截屏2020-03-0210.40.40-T9mNTf.png) 

有了画布，就可以在画布上进行作图了：

### 3.2 绘制简单柱状图

柱状图就是由一个个的 rect 元素组成：

``` handlebars
{{!-- d3/basic-histogram.hbs --}}
<h3>3.1 append svg to element</h3>
<div class="basic-svg-container" {{did-insert this.appendSvg}}></div>
<h3>3.2 basic-histogram</h3>
<svg class="bar-container" {{did-insert this.initHistogram}}>
</svg>
```

``` typescript
// d3/basic-histogram.ts
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection';

interface D3BasicHistogramArgs { }

const DATASET = [250, 210, 170, 130, 90];  //数据（表示矩形的宽度）;
const RECTHEIGHT = 25;   //每个矩形所占的像素高度(包括空白)
export default class D3BasicHistogram extends Component<D3BasicHistogramArgs> {
    @action
    appendSvg() {
        let container = select(".basic-svg-container");
        container.append('svg')
            .attr("width", 300)
            .attr("height", 185.4)
            .style("background-color", "orange")
    }

    @action
    initHistogram() {
        const barContainer = select(".bar-container");

        barContainer
            .attr("width",300)
            .attr("heigt",185.4)
            .selectAll("rect")
            .data(DATASET)
            .enter()
            .append("rect")
            .attr("x", 20)
            .attr("y", function (d, i) {
                return i * RECTHEIGHT
            })
            .attr("width", function (d) {
                return d;
            })
            .attr("height", RECTHEIGHT - 2)
            .attr("fill", "#579AFF")

    }
}

```

在路由中使用此插件即可以看到：

![2020-03-02-截屏2020-03-0211.44.51-MXtz1i](https://raw.githubusercontent.com/FrankWang1991/images/master/2020-03-02-截屏2020-03-0211.44.51-MXtz1i.png)  

这里需要注意的代码是：

``` javascript
barContainer
    .attr("width",300)
    .attr("heigt",185.4)
    .selectAll("rect")
    .data(DATASET)
    .enter()
  .append("rect")
```

其中 `data()` 方法将指定数组的数据 *data* 与已经选中的元素进行绑定并返回一个新的选择集，返回的新的选择集使用 *update* 表示: 此时数据已经成功的与元素绑定。



### 3.3 比例尺

在实际的绘制图表的过程中，不可能像上述那样，根据数值去直接展示长度，需要进行一步比例尺的转换。  

D3 提供了相关的比例尺转化的 [API](https://github.com/xswei/d3js_doc/blob/master/API_Reference/API.md#scales-d3-scale) 包括不限于： [d3.scaleLinear](https://github.com/xswei/d3-scale/blob/master/README.md#scaleLinear) 、[d3.scaleOrdinal](https://github.com/xswei/d3-scale/blob/master/README.md#scaleOrdinal) 等等。像一般简单的展示线性的比例尺的写法是：

``` handlebars
{{! d3/basic-histogram.hbs --}}
{{! ... --}}
<h3>3.3 scale</h3>
<svg class="scale" {{did-insert this.initScale}}>
     <rect></rect>
</svg>
```

``` typescript
// d3/basic-histogram.ts
// ...
@action
initScale() {
    const dataset = [2.5, 2.1, 1.7, 1.3, 0.9];

    let linear = scaleLinear()
    .domain([0, max(dataset,null)])
    .range([0, 250]);

    const barContainer = select(".scale");

    barContainer
        .attr("width", 300)
        .attr("heigt", 185.4)
        .selectAll("rect")
        .data(dataset,  (d)=> d)
    		/**
             * 当svg 内已有元素时，会导致以后的元素不能正确
             * 显示，添加data() 方法的第二个参数可解决。
             * 不过有待进一步深入理解
            */
        .enter()
        .append("rect")
        .attr("x", 20)
        .attr("y", function (d, i) {
        return i * RECTHEIGHT
    })
        .attr("width", function (d) {
        return linear(d);
    })
        .attr("height", RECTHEIGHT - 2)
        .attr("fill", "#C2DAFF");
}
// ...
```

展示的效果和 3.2 中的图片相同。