let mongoose = require("mongoose");
// 创建集合
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required: [true, "用户名不能为空"],  //开启验证
    },
    password:{
        type:String,
        trim:true,
        required: [true, "密码不能为空"],  //开启验证
    },
    age:{
        type:Number,
        trim:true,
        required: [true, "年龄不能为空"],  //开启验证
    },
    sex:{
        type:String,
        trim:true,
        required: [true, "性别不能为空"],  //开启验证
    },
    address:{
        type:String,
        trim:true,
        required: [true, "地址不能为空"],  //开启验证
    }
})

// 使用集合规则 创建一个集合
const User = mongoose.model("User",userSchema);

module.exports=User;