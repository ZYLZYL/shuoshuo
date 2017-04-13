/**
 * Created by 张燕龙 on 2017/4/7.
 */
var crypto=require("crypto");
module.exports=function(mima){
    var md5=crypto.createHash("md5");
    var password=md5.update(mima).digest("base64");
    return password;

}