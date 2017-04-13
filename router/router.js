/**
 * Created by 张燕龙 on 2017/4/11.
 */
var formidable=require("formidable");
var db=require("../models/db.js");
var md5=require("../models/md5.js");
//显示首页
exports.showIndex=function(req,res,next){
    //检索数据库，查找此人头像
    if(req.session.login=="1"){
        db.find("user",{username:req.session.username},function(err,result){
            var avatar=result[0].avatar|| "moren.jpg";
            res.render("index",{
                "login": req.session.login == "1" ? true : false,
                "username": req.session.login == "1" ? req.session.username:"",
                "active" : "index",
                "avatar": avatar
            });
        });
    }else{
        res.render("index",{
            "login": req.session.login == "1" ? true : false,
            "username": req.session.login == "1" ? req.session.username:"",
            "active" : "index",
            "avatar": "moren.jpg"
        });
    }
};
//显示注册页面
exports.showRegist=function(req,res,next){
       res.render("regist",{
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username:"",
           "active" : "regist"
    });
};
//注册页面的处理
exports.doRegist=function(req,res,next){
    //得到用户填写的东西
    //查询数据库中是不是有这个人，如果没有保存
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    //得到表单做的事情
        var username=fields.username;
        var password=fields.password;
        console.log(username,password);
        db.find("user",{"username":username},function(err,result){
            if(err){
                res.send("-3");
                return;
            }
            if(result.length!=0){
                res.send("-1");
                return;
            }
            //console.log(result.length);
            //设置md5加密
            password=md5(md5(password)+"考拉");
            //现在可以证明用户名没有被占用
            db.insertOne("user",{
                "username":username,
                "password":password,
                "avatar": "moren.jpg"
                },function(err,result){
                if(err){
                    res.send("-3");
                    return;
                }
                //这个时候可以写session了
                req.session.login="1";
                req.session.username=username;
                res.send("1");
            })
        });
    });
};
//显示登陆页面
exports.showLogin=function(req,res,next){
    res.render("login",{
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username:"",
        "active" : "login"
    });
};
//执行登陆页面
exports.doLogin=function(req,res,next){
    //查询数据库看是否存在这个人有的话看看密码是否匹配得到用户表单
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到表单做的事情
        var username=fields.username;
        var password=fields.password;
        password=md5(md5(password)+"考拉");
        db.find("user",{"username":username},function(err,result){
            //找这个人的过程中发生错误的话抛出错误-5
            if(err){
                res.send("-5");
                return;
            }
            //没有这个人
            if(result.length==0){
                res.send("-1");
                return;
            }
            if(password == result[0].password){
                req.session.login="1";
                req.session.username=username;
                res.send("1");//登陆成功
                return;
            }else{
                res.send("-2");//登录名正确，密码错误
                return;
              }
            })
        });

};