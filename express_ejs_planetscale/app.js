const express = require('express')
const ejs = require('ejs') // 웹사이트를 구축시 header, footer 들을 각각의 파일로 만들어 관리하기 쉽게 만들어주는 ejs
const app = express()
const port = 3000
var bodyParser = require('body-parser') // req를 받기위한 api 선언
var session = require('express-session')

require('dotenv').config() // planetscale 접속
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')

connection.query("SET time_zone='Asia/Seoul'"); // mysql 시간 세팅

app.set('view engine','ejs') 
app.set('views','./views') // ejs를 express에 적용
 
app.use(bodyParser.urlencoded({ extended: false })) // req를 받기위한 api 선언(세팅) 2
app.use(express.static(__dirname+'/public')) // 사진을 받기 위한 express 라우팅, 정적 선언.
 
app.use(session({ secret: 'unidago', cookie: { maxAge: 60000 }, resave:true, saveUninitialized:true, })) // 세션: 서버, 쿠키: local

app.use((req, res, next) => {    // express의 middleware로 local은 변수 공유를 하게 해준다. 이를 통해 로그인을 하면 어느 페이지에서든 로그인을 유지할 수 있다

   res.locals.user_id = "";
   res.locals.name = "";

   if(req.session.member){ 
      res.locals.user_id = req.session.member.user_id 
      res.locals.name = req.session.member.name 
   }
   next()
 })

// 라우팅
app.get('/', (req, res) => {
   console.log(req.session.member); 

   res.render('index')   // ./views/index.ejs 출력
})

app.get('/profile', (req, res) => {
   res.render('profile')  
})

app.get('/map', (req, res) => {
   res.render('map')  
})

app.get('/contact', (req, res) => {
   res.render('contact')  
})

app.post('/contactProc', (req, res) => { // => 랑 function 이랑 같은 말이다 
   const name = req.body.name; // contact.ejs에서 받은 값을 req로 받아온다 
   const phone = req.body.phone; // body 대신 query로 받아오면 undefined 이라고 뜬다
   const email = req.body.email; // 그런데 body 라고만 쓰면 실제로는 동작하지않는다.
   const memo = req.body.memo;  // body 로 처리하기 위해 express의 미들웨어를 사용해야 한다
                                // body-parser 를 설치해야 한다
   var sql = `insert into contact(name,phone,email,memo,regdate)
   values(?,?,?,?,now() )` // ? 를 통해 '' 와 같은 특수기호도 넣을 수 있다. DB에 특수기호가 보안상 이유로 잘들어가지지 않는다. 치환문 이용
   var values = [name,phone,email,memo]; // 위 ? 위치에 들어가는 배열 지정하기

   connection.query(sql, values, function (err, result){
       if(err) throw err; 
       console.log('자료 1개를 삽입하였습니다.');
       res.send("<script> alert('문의사항이 등록되었습니다.'); location.href='/';</script>"); 
   })

})

app.get('/contactDelete', (req, res) => { // 문의사항 지우기
   var idx = req.query.idx // 인덱스를 받아서 그 인덱스 삭제하기
   var sql = `delete from contact where idx='${idx}' ` // 이때 1번 idx를 삭제했을 경우 DB에서 enum 으로 올라오지않고 빈칸으로 남게된다
   connection.query(sql, function (err, result){
      if(err) throw err; 
      
      res.send("<script> alert('삭제되었습니다.'); location.href='/contactList';</script>"); // 알람을 띄우고 페이지 이동
  })
})

app.get('/contactList', (req, res) => { // 사진

   var sql = `select * from contact order by idx desc ` // order by idx desc를 통해 입력받은 값들을 최신차순부터 볼 수 있다
   connection.query(sql, function (err, results, fields){
      if(err) throw err; 
      res.render('contactList',{lists:results}) // ejs 파일에 값전달
   })
   
})

app.get('/login', (req, res) => {
   res.render('login')  
})

app.post('/loginProc', (req, res) => {
   const user_id = req.body.user_id; // 입력받은 id, pw
   const pw = req.body.pw; 
 
   var sql = `select * from member  where user_id=? and pw=? ` // 두값이 존재할때

   var values = [user_id, pw]; 

   connection.query(sql, values, function (err, result){ // 입력받은 id,pw 와 DB에 있는 id,pw 비교
       if(err) throw err;      
       
       if(result.length==0){ // DB안에 해당 값 있는가
         res.send("<script> alert('존재하지 않는 아이디입니다..'); location.href='/login';</script>");          
       }else{  
         console.log(result[0]); 

         req.session.member = result[0]  
         res.send("<script> alert('로그인 되었습니다.'); location.href='/';</script>");          
         //res.send(result); 
       }
   })
})

app.get('/logout', (req, res) => {
   req.session.member = null; 
   res.send("<script> alert('로그아웃 되었습니다.'); location.href='/';</script>");          
})

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`)
})