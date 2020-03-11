
## 将静态文件目录设置为：项目根目录+/public 的两种方法
```javascript
app.use(express.static(__dirname + '/public'));

app.use(express.static(path.join(__dirname, 'public')));
```

## app.use
可以理解为，`app.use是用来给path注册中间函数的`，这个path默认是’/’，也就是`处理用户的任何url请求`，同时会处理path下的子路径。

比如设置path为’/hello’，那么当请求路径为’/hello/’、’/hello/nihao’、’/hello/nihao/1’等等这样的请求也都会交给中间函数处理的。

## express.static()
express.static：Express内置的中间函数，提供对静态资源文件(图片、csss文件、javascript文件)的服务。

### 1.传参
传递一个包含静态资源的目录给 express.static 中间件，用于立刻开始提供文件。比如用以下代码来提供public目录下的img、css文件和js文件
```
app.use(express.static('public'));
```

### 2.访问
express 会在静态资源目录下查找文件，所以不需要把静态目录public作为url的一部分。现在，你可以加载 public目录下的文件了：
```javascript
// http://localhost:3000/hello.html
// http://localhost:3000/images/1.jpg
// http://localhost:3000/css/style.css
// http://localhost:3000/js/index.js

// TODO(提示作用) href中的路径也是查找public下的资源
link(rel='stylesheet', href='/css/double-eleven-storage-period.css')
```

### 3.可以设置多个静态目录
可以多次使用 express.static 中间件来添加多个静态资源目录，这时express 将会按照你设置静态资源目录的顺序来查找静态资源文件：
```javascript
app.use(express.static('public'));
app.use(express.static('files'));
```

### 4.指定一个虚拟的静态目录
为了给静态资源文件创建一个虚拟的文件前缀(实际上文件系统中并不存在) ，可以使用 express.static 函数指定一个虚拟的静态目录。
```javascript
app.use('/static', express.static('public')); // 访问public目录时，使用static代替
```

使用 /static 作为前缀来加载 public 文件夹下的文件：
```
http://localhost:3000/static/hello.html
http://localhost:3000/static/images/1.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/index.js
```

然而，你提供给 express.static 函数的路径是一个`相对node进程启动位置的相对路径`。
如果你在其他的文件夹中启动express app，更稳妥的方式是`使用静态资源文件夹的绝对路径`：
```javascript
app.use('/static', express.static(__dirname + '/public'));
```

## 将stylus文件转为css

(1) 使用命令行
这样写每次更改styl文件后都得运行命令再次生成css文件才会生效
```
stylus public/css // 打包到原目录(打包public/css下的css文件)
```

[node写一个小脚本,批量将stylus文件编译成css文件](http://www.fly63.com/article/detial/2367)
[gulp.task](https://www.cnblogs.com/hodgson/p/6132567.html)

```javascript
// todo

// www-server.js中，访问页面是自动编译
app.use(stylus.middleware({
  src:__dirname + '/public/css',
  dest: __dirname + '/public/css',
  compile:function (str, path) {
    return stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib())
      .import('nib');
  }
}));

// gulpfile.js 目前没成功
gulp.task('stylus-compress', function(){
    gulp.src('public/css/*.styl')
      .pipe(stylus())
      .pipe(rename(function (path) {
        path.basename += '.min';
      }))
      .pipe(gulp.dest('public/css/compress'));
  });
```








## gulp的各种用法
```javascript
/*
* 打包上线时候用到的功能
* */
const gulp = require('gulp');
const rename = require('gulp-rename'); //重新命名生成的css和js文件
const sass = require('gulp-sass'); //scss编译
const uglify = require('gulp-uglify'); //压缩js
const clean = require('gulp-clean'); //清空文件夹里所有的文件
const rev = require('gulp-rev'); //生成带有哈希值的文件名
const runSequence = require('run-sequence');
//const reCollector = require('gulp-rev-collector'); //gulp-rev的插件，用于在生成带哈希值的文件名后替换html中的引用

//每次打包时先清空原有的文件夹
gulp.task('clean',()=>{
    gulp.src(['dist','rev'],{read:false}) //这里设置的dist表示删除dist文件夹及其下所有文件
        .pipe(clean());
});
//scss编译
gulp.task('css',['clean'],()=>{
    gulp.src('src/scss/*.scss')
        .pipe(sass({
            outputStyle:'compressed'                //编译并输出压缩过的文件
         }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(rev())                                //给css添加哈希值
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())                       //给添加哈希值的文件添加到清单中
        .pipe(gulp.dest('rev/css'));
});
//压缩js
gulp.task('js',['clean'],()=>{
    gulp.src('src/js/*js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(rev())                                //给js添加哈希值
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())                       //给添加哈希值的文件添加到清单中
        .pipe(gulp.dest('rev/js'));
});
//移动html文件到dist文件夹
gulp.task('html',['clean'],()=>{
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});
//进行打包上线
gulp.task('build',()=>{
    runSequence('clean',['css','js'],'html');
});
//设置为gulp的默认任务
gulp.task('default',['build']);
```