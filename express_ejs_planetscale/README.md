# 기능정리
1. 홈
      +express 정적파일 제공
2. 프로필
3. 찾아오시는 길
4. 문의하기
      +문의사항 글 DB 저장
        +이름, 연락처, 이메일, 내용
          +특수기호 포함 기능
      +문의사항 글 DB 삭제
5. 로그인 및 유지
6. 로그아웃

## Service Flow
웹 <-> planetscaler <-> local DB (mysql workbench)   *planetscaler? DB server (PHP,nodejs 로 id, password 확인) 

## you need install package
```
npm install nodejs
npm install ejs
npm install body-parser
npm install mysql2
npm install dotenv
npm install express-session
npm install
```

> package.json 파일에서 dependencies 를 보면 부품으로서 사용하고있는 라이브러리를 확인할 수 있다.
> 우리의 파일에서는 sanitize라는 라이브러리를 의존하고있다.
> “npm install” 이라는 코드를 입력하면 package.json에서 dependencies를 찾아 설치를 자동화 해준다.
