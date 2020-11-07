let mongoose = require("mongoose");
// 创建集合
const goodSchema = new mongoose.Schema({
    goodname:{
        type:String,
        trim:true,
    },
    goodcategory_id:{   //分类id
        type:String
    },
    goodpic:{
        type:String,
        trim:true,
    },
    goodmoney:{
        type:Number,
        trim:true,
    },
    goodpostage:{
        type:String,
        trim:true,
    },
    goodMS:{
        type:String,
        trim:true,
    }
})
// 使用集合规则 创建一个集合
const Good = mongoose.model("Good",goodSchema);

module.exports=Good;