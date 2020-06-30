# 프로젝트 소개   
* punch 소개   
* 기술소개   
   
# Punch 소개   
펀치는 기존의 출석체크 프로그램의 단점을 보완한 출석체크 플렛폼입니다.    
기존의 출석체크 비밀번호나 QR코드를 이용해 출석체크를 하는 방식은 비밀번호나 QR코드가 유출되서 부정출석이 될 여지가 있었습니다.    
저희 Punch 출석체크는 QR코드를 OTP 형식으로 구현하여 SNS나 영상통화를 통해서 QR코드가 유출되는것을 방지하였습니다.   
또 깔끔하고 편리한 UI를 구축하였습니다.   
   
# Punch 플렛폼   
펀지는 출석체크를 위한 교수용 웹사이트와 학생을 위한 모바일 앱 그리고 수업중 QR코드를 출력하는 GUI 윈도우 프로그램으로 나뉩니다.    
   
# 교수용 웹사이트   
## 로그인 페이지   
<img src="/FrontEnd/자료들/login.gif">   
교수 아이디를 통해서 로그인할 수 있습니다.  

## 수업 페이지   
<img src="/FrontEnd/자료들/ready.png">   
왼쪽부터, 사이드바, 수업목록, 선택된수업 으로 공간이 구분되어 있습니다.    
- 사이드바 : 새로운 수업생성, 설정, 로그아웃 버튼이 있습니다.    
- 수업목록 : 내가 생성한수업의 목록이 표시됩니다. 클릭하면 선택한수업에 해당수업이 표시됩니다.   
- 선택된수업 : 수업목록에서 선택한 수업을 표시합니다. 선택된 수업이 없으면 수업을 선택하라는 알림이 표시됩니다.    
   
## 출석체크 준비   
<img src="/FrontEnd/자료들/qrReady.png">   
- #1 할일선택 에서 선택된 수업에서 출석체크를 누르면 출석체크를 할 수 있다    
- #2 출석체크 주차 선택에서 에서 지난 출석체크를 이어서 할것인지 새로운 출석체크를 할것인지 선택할 수 있다.   
- #3 출석기준 시간에서 지금시간을 기준으로 출석체크를 할것인지 수업시간을 기준으로 출석체크를 할것인지 선택할 수 있다.   
마지막으로 QR생성 버튼을 누르면 출석체크 화면으로 넘어간다    
   
## 출석체크   
<img src="/FrontEnd/자료들/qrmaker.gif">   
출석체크 화면입니다   
