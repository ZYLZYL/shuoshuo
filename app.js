var express=require("express");
var app=express();
var router=require("./router/router.js");
var session=require("express-session");
//ʹ��session
app.use(session({
 secret: 'keyboard cat',
 resave: false,
 saveUninitialized: true
}))
//����ģ������
app.set("view engine","ejs");
//���þ�̬ҳ��
app.use(express.static("./public"));
app.use("/avatar",express.static("./avatar"));
//·�ɱ�
app.get("/",router.showIndex);
app.get("/regist",router.showRegist);
app.post("/doregist",router.doRegist);
app.get("/login",router.showLogin);
app.post("/dologin",router.doLogin);
app.listen(80);