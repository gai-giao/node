const express = require("express");
const User = require("../model/user.js");
const rooter = express.Router();
let path = require("path");
// formidable解析表单提交的文件数据
const formidable = require("formidable");
// 登录界面路由
rooter.get("/login",(req,res)=>{
    res.render("admin/login.ejs");
})
// 登录验证
rooter.post("/dologin",async (req,res)=>{
    console.log(req.body);
    let isuser = await User.findOne({"username":req.body.username})
    let ispsd = await User.findOne({"password":req.body.password})
    console.log(isuser);
    if(!isuser){
        res.send("<script>alert('您好用户名不正确');location.href='/admin/login'; </script>")
    }else if(!ispsd){
        res.send("<script>alert('您好密码不正确');location.href='/admin/login'; </script>")
    }else{
        let islogin = await User.findOne(isuser)
        if(islogin){
            req.app.locals.username = req.body.username
            req.session.username = req.body.username
            res.redirect("/admin/userlist")
        }
    }
})
// 清除缓存
rooter.get("/removeHC",(req,res)=>{
    // 清除缓存操作destroy()方法
    req.session.destroy();
    res.redirect("/admin/login")
})
// 进入用户列表页路由
rooter.get("/userlist",async (req,res)=>{
    let page = Number(req.query.page) || 1   //page代表的是请求第几页
    let size = Number(req.query.size) || 2  //size代表的每页是请求多少条

    let total = await User.countDocuments({})   //countDocuments({})查询文档的数量
                                 // 跳过两条 查询n条
    let result = await User.find({}).skip((page-1)*size).limit(size) 
    //(page-1)*10 从第一页开始第一页不用跳过十条所以从0 
    // 计算总的页数
    let pagesum = Math.ceil(total / size)
    res.render("admin/userlist.ejs",{
        lists:result,
        total:total,
        page:page,
        size:size,
        pagesum:pagesum
    })
})
// 进入添加页面
rooter.get("/adduser",(req,res)=>{
    res.render("admin/add.ejs")
})
// 添加操作
rooter.post("/add",async (req,res)=>{
    let obj = req.body
    console.log(obj.username);
    let dbobj = await User.findOne({username:obj.username})
        if(!dbobj){
            User.create(obj).then((result)=>{
                res.redirect("userlist")
            })
        }else{
            return;
        }
})
// 删除操作
rooter.get("/deluser",(req,res)=>{
    console.log(req.query);
    User.findOneAndDelete({"_id":req.query.id}).then((result)=>{
       res.redirect("userlist")
    })
})
// 修改界面路由
rooter.get("/updateuser",async (req,res)=>{
    User.findOne({"_id":req.query.id}).then((result)=>{
        res.render("admin/updateuser.ejs",{
            lists:result
        })
    })
})
// 修改操作
rooter.post("/upuser",(req,res)=>{
    let obj = req.body
    User.updateOne({"_id":obj._id},req.body).then((result)=>{
       res.redirect("userlist")
    })
})

// 搜索路由
rooter.get("/searchuser",async (req,res)=>{
    let page = Number(req.query.page) || 1   //page代表的是请求第几页
    let size = Number(req.query.size) || 2  //size代表的每页是请求多少条
    let total = await User.countDocuments({"username":new RegExp(req.query.username,"gi")})   //countDocuments({})查询文档的数量
    let pagesum = Math.ceil(total / size)

    let result =await  User.find({"username":new RegExp(req.query.username,"gi")}).skip((page-1)*size).limit(size) 
    res.render("admin/searchuser.ejs",{
        lists:result,
        total:total,
        page:page,
        size:size,
        pagesum:pagesum,
        username:req.query.username
    })
})
// 商品列表界面路由
rooter.get("/goodlist",async (req,res)=>{
    let page = Number(req.query.page) || 1   //page代表的是请求第几页
    let size = Number(req.query.size) || 2  //size代表的每页是请求多少条

    let total = await Good.countDocuments({})   //countDocuments({})查询文档的数量
    // console.log(total);
                                 // 跳过两条 查询n条
    let result = await Good.find({}).skip((page-1)*size).limit(size) 
    // console.log(result);
    //(page-1)*10 从第一页开始第一页不用跳过十条所以从0 
    // 计算总的页数
    let pagesum = Math.ceil(total / size)
    res.render("admin/goodlist.ejs",{
        lists:result,
        total:total,
        page:page,
        size:size,
        pagesum:pagesum
    })
})
// 添加商品路由
rooter.get("/goodadd",(req,res)=>{
    res.render("admin/goodadd.ejs");
})
const Good = require("../model/good.js")
// 添加商品操作
rooter.post("/dogoodadd",(req,res)=>{
    // 1.创建一个表单解析对象
    let form = new formidable.IncomingForm();
    // 2.配置上传文件存到目录位置 放在public uploads
    form.uploadDir = path.join(__dirname,"../","public","uploads");
    // 3.保存后缀名
    form.keepExtensions = true;
    form.parse(req, async (err,fields,files)=>{
        console.log(fields);    //文本数据
        console.log(files.goodpic.path.split("public")[1]);     //文件信息
        let result = await Good.create({
            goodname:fields.goodname,
            goodcategory_id:fields.goodcategory_id,
            goodpic:files.goodpic.path.split("public")[1],
            goodmoney:fields.goodmoney,
            goodpostage:fields.goodpostage,
            goodMS:fields.goodMS
        })
        if(result){
            res.redirect("/admin/goodlist")
        }
    })
})
// 删除商品操作
rooter.get("/delgood",(req,res)=>{
    Good.findOneAndDelete({"_id":req.query.id}).then((result)=>{
        res.redirect("goodlist")
    })
})
// 修改界面路由
rooter.get("/updategood",(req,res)=>{
    Good.findOne({"_id":req.query.id}).then((result)=>{
        res.render("admin/updategood.ejs",{
            lists:result
        })
    })
})

// 修改操作
rooter.post("/doupdategood",(req,res)=>{
    // console.log(req.body._id);
    // let obj = req.body.goodname
    // Good.updateOne({"_id":obj._id},obj).then((result)=>{
    //    res.redirect("goodlist")
    // })
    // 1.创建一个表单解析对象
    let form = new formidable.IncomingForm();
    // 2.配置上传文件存到目录位置 放在public uploads
    form.uploadDir = path.join(__dirname,"../","public","uploads");
    // 3.保存后缀名
    form.keepExtensions = true;
    form.parse(req, async (err,fields,files)=>{
        console.log(fields);    //文本数据
        console.log(files.goodpic.path.split("public")[1]);    //拿到图片路径 
        if(!files.goodpic.name){
            var result = await Good.updateOne({"_id":fields.id},{
                goodname:fields.goodname,
                goodcategory_id:fields.goodcategory_id,
                goodpic:fields.goodpicpath,
                goodmoney:fields.goodmoney,
                goodpostage:fields.goodpostage,
                goodMS:fields.goodMS
            })
        }else if(files.goodpic.name){
            var result = await Good.updateOne({"_id":fields.id},{
                goodname:fields.goodname,
                goodcategory_id:fields.goodcategory_id,
                goodpic:files.goodpic.path.split("public")[1],
                goodmoney:fields.goodmoney,
                goodpostage:fields.goodpostage,
                goodMS:fields.goodMS
            })
        }
        if(result){
            res.redirect("/admin/goodlist")
        }
    })
})
// 搜索商品路由
rooter.get("/searchgood",async (req,res)=>{
    console.log(req.query);
    let page = Number(req.query.page) || 1   //page代表的是请求第几页
    let size = Number(req.query.size) || 2  //size代表的每页是请求多少条
    let min = Number(req.query.pricemin) || 0
    let max = Number(req.query.pricemax) || 100000000
    let total = await Good.countDocuments({
        goodname: new RegExp(req.query.goodname,"gi"),
        goodmoney:{$gt:min,$lt:max}
    }).skip((page-1)*size).limit(size) 
                                 //跳过两条 查询n条
    let result = await Good.find({
        goodname: new RegExp(req.query.goodname,"gi"),
        goodmoney:{$gt:min,$lt:max}
    }).skip((page-1)*size).limit(size) 
    console.log(result);
    //(page-1)*10     从第一页开始第一页不用跳过十条所以从0 
    //计算总的页数
    let pagesum = Math.ceil(total / size)
    res.render("admin/dogoodlist.ejs",{
        lists:result,
        total:total,
        page:page,
        size:size,
        pagesum:pagesum
    })
})
// 商品分类路由
rooter.get("/goodclass",async (req,res)=>{
    let mangood =await Good.countDocuments({
        goodcategory_id:"1"
    })
    let womangood =await Good.countDocuments({
        goodcategory_id:"2"
    })
    let boygood =await Good.countDocuments({
        goodcategory_id:"3"
    })
    console.log(mangood);
    console.log(womangood);
    console.log(boygood);
    res.render("admin/goodclass.ejs",{
        mangood,
        womangood,
        boygood
    })
})
// 男装
rooter.get("/mangood",async (req,res)=>{
    let result = await Good.find({
        goodcategory_id:"1"
    })
    res.render("admin/goodclasslist.ejs",{
        lists:result
    })
})
// 女装
rooter.get("/womangood",async (req,res)=>{
    let result = await Good.find({
        goodcategory_id:"2"
    })
    res.render("admin/goodclasslist.ejs",{
        lists:result
    })
})

// 童装
rooter.get("/boygood",async (req,res)=>{
    let result = await Good.find({
        goodcategory_id:"3"
    })
    res.render("admin/goodclasslist.ejs",{
        lists:result
    })
})
// 暴露
module.exports = rooter;
