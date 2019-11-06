# autolisp助手使用说明

## 格式化

* 右键菜单  

![右键菜单](images/2019-11-06_10-30-13.gif)

* 配置
  ![配置](images/2019-11-06_12-25-16.gif)

## 代码片段和函数签名

![代码片段和函数签名](images/2019-11-06_16-12-30.gif)

## 自定义代码片段

* 1、编写代码片段，示例如下：

```
{
    "filteror":
    {"prefix":["filteror"],"body":"'((-4 . "<or")(0 . "line")(0 . "text")(-4 . "or>"))",
        "params":[],
        "description":"选择直线或单行文字"},
    "makeline":{"prefix":["makeline"],"body":"(entmake (list '(0 . "LINE") (cons 10 pt1) (cons 11 pt2)))",
        "params":[],
        "description":"创建直线"}
}
```

* 2、将上述内容保存到json文件，比如：D:\autolisp助手\自定义代码片段.json
  ![代码片段文件](images/explorer_2019-11-06_18-24-56.png)

* 3、将代码片段文件的路径设置到autolisp助手的配置里
  ![配置](images/2019-11-06_18-28-15.gif)