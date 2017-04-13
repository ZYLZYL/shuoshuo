/**
 * Created by ������ on 2017/4/11.
 */
var formidable=require("formidable");
var db=require("../models/db.js");
var md5=require("../models/md5.js");
//��ʾ��ҳ
exports.showIndex=function(req,res,next){
    //�������ݿ⣬���Ҵ���ͷ��
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
//��ʾע��ҳ��
exports.showRegist=function(req,res,next){
       res.render("regist",{
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username:"",
           "active" : "regist"
    });
};
//ע��ҳ��Ĵ���
exports.doRegist=function(req,res,next){
    //�õ��û���д�Ķ���
    //��ѯ���ݿ����ǲ���������ˣ����û�б���
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    //�õ�����������
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
            //����md5����
            password=md5(md5(password)+"����");
            //���ڿ���֤���û���û�б�ռ��
            db.insertOne("user",{
                "username":username,
                "password":password,
                "avatar": "moren.jpg"
                },function(err,result){
                if(err){
                    res.send("-3");
                    return;
                }
                //���ʱ�����дsession��
                req.session.login="1";
                req.session.username=username;
                res.send("1");
            })
        });
    });
};
//��ʾ��½ҳ��
exports.showLogin=function(req,res,next){
    res.render("login",{
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username:"",
        "active" : "login"
    });
};
//ִ�е�½ҳ��
exports.doLogin=function(req,res,next){
    //��ѯ���ݿ⿴�Ƿ����������еĻ����������Ƿ�ƥ��õ��û���
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //�õ�����������
        var username=fields.username;
        var password=fields.password;
        password=md5(md5(password)+"����");
        db.find("user",{"username":username},function(err,result){
            //������˵Ĺ����з�������Ļ��׳�����-5
            if(err){
                res.send("-5");
                return;
            }
            //û�������
            if(result.length==0){
                res.send("-1");
                return;
            }
            if(password == result[0].password){
                req.session.login="1";
                req.session.username=username;
                res.send("1");//��½�ɹ�
                return;
            }else{
                res.send("-2");//��¼����ȷ���������
                return;
              }
            })
        });

};