const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");

// 实例化服务器对象
const app = express();

// 连接数据库模块
require("./model/db.js");
let User = require("./model/user.js")
// 配置ejs模板引擎
app.set("view engine","ejs");
// 配置模板路径 如果文件夹名为views此步骤可以省掉
app.set("views",__dirname+"/views");
// 配置静态资源目录
app.use(express.static("public"))

// 配置post请求文字接受模块
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(bodyParser.json())

//配置session
app.use(session({
    secret: 'fdsadsjkfjalwopeworaoe',  //任意传一个字符串，生成session的签名
    resave: false, //强制保存session,默认是true不保存，设置成false强制保存
    saveUninitialized: true,  //强制将未初始化的session保存
    cookie: {
        // secure: true  指的是https协议
        maxAge: 30 * 60 * 1000   //设置过期时间
    },
    rolling: true  //强制将cookie的过期时间重置
}))

app.use((req,res,next)=>{
    if(req.url != "/admin/login" && req.url != "/admin/dologin" && !req.session.username){
        res.redirect("/admin/login")
    }else{
        next()
    }
})
// 引入自定义模块
const admin = require("./route/admin.js")
app.use("/admin",admin)


// 监听端口号
app.listen(3000,()=>{
    console.log("服务器已启动");
})