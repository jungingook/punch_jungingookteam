import sys
import qrcode
import requests
import threading
import time

from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QLineEdit, \
    QGridLayout, QMessageBox, QVBoxLayout, QSlider
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt
from PIL import ImageQt

thread_code = False


class LoginForm(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        # 프로그램 전체 설정(배경색, 제목, 크기)
        self.setStyleSheet("background-color:white;")
        self.setWindowTitle('펀치 QR 생성')
        self.resize(300, 500)

        # GridLayout
        layout = QGridLayout()

        # Punch 로고
        self.lbl = QLabel()
        self.lbl.setMinimumSize(300, 400)
        self.img = QPixmap("logoW.png")
        self.lbl.setPixmap(self.img.scaledToWidth(170))
        self.lbl.setStyleSheet("background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 0, "
                               "stop: 0.4 #FF4B2B,"
                               "stop: 1.0 #FF416C,);"
                               "border-radius : 15px;")
        self.lbl.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.lbl, 0, 0)

        # ID 입력창
        self.lineEdit_username = QLineEdit()
        self.lineEdit_username.setStyleSheet("font-family: NanumSquare; font-size: 20px; font-weight:bold; "
                                             "padding-left: 10px;"
                                             "background-color: #f6f7f9; border-radius:10px; height:45px;")
        self.lineEdit_username.setPlaceholderText('아이디')
        self.lineEdit_username.resize(50, 10)
        layout.addWidget(self.lineEdit_username, 2, 0)

        # 비밀번호 입력창
        self.lineEdit_password = QLineEdit()
        self.lineEdit_password.setStyleSheet("font-family: NanumSquare; font-size: 20px; font-weight:bold; "
                                             "padding-left: 10px;"
                                             "background-color: #f6f7f9; border-radius:10px; height:45px;")
        self.lineEdit_password.setEchoMode(QLineEdit.Password)
        self.lineEdit_password.setPlaceholderText('비밀번호')
        layout.addWidget(self.lineEdit_password, 3, 0)

        # 로그인버튼
        button_login = QPushButton('로그인')
        button_login.clicked.connect(self.login)
        button_login.setShortcut("Return")
        button_login.setStyleSheet("font-size : 20px; background-color: #fff; font-family: NanumSquare;"
                                   "background-color: #fff;"
                                   "height: 45px; margin-top:10px; padding 5px;")
        layout.addWidget(button_login, 4, 0)

        # 전체 레이아웃 설정
        self.setLayout(layout)

    # login 함수 구현
    def login(self):
        if self.lineEdit_username.text() == "" or self.lineEdit_password.text() == "":
            msg = QMessageBox()
            msg.setText('아이디 혹은 비밀번호를 입력하세요.')
            msg.exec_()
        else:
            url_post = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/account/professor/login"
            login_json = {'inputId': self.lineEdit_username.text(), 'inputPw': self.lineEdit_password.text()}
            response = requests.post(url_post, json=login_json)
            if response.status_code == 200:
                data_login = response.json()
                if data_login['error']:
                    msg = QMessageBox()
                    msg.setText('아이디 혹은 비밀번호를 확인해주세요.')
                    msg.exec_()
                else:
                    global qr_token
                    qr_token = data_login['token']
                    self.close()
                    self.qr = QR()
                    self.qr.show()
            else:
                msg = QMessageBox()
                msg.setText('인터넷 연결을 확인해주세요.')
                msg.exec_()


# QR 코드를 띄우는 클래스
class QR(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        # 파이썬 실행창을 항상 위로 유지해주는 코드
        # 프로그램 전반에 관한 코드(창 제목, 배경색)
        self.setWindowFlags(Qt.WindowStaysOnTopHint)
        self.setWindowTitle('QR코드')
        self.setStyleSheet("background-color: #FFFFFF")
        self.move(300, 300)

        # vBoxLayout
        self.vbox = QVBoxLayout()

        # 로그아웃 버튼
        button_logout = QPushButton()
        button_logout.setStyleSheet(
            "image: url(logout.png); font-family: NanumSquare; font-size: 20px; font-weight:bold;")
        button_logout.clicked.connect(self.logout)
        self.vbox.addWidget(button_logout)

        # QR코드가 들어갈 Label 생성
        self.lbl_img = QLabel()

        # Label에 첫 이미지 "수업을 개설해주세요."
        self.pixmap = QPixmap('error.png')
        self.lbl_img.setPixmap(self.pixmap)
        self.lbl_img.setScaledContents(True)
        self.vbox.addWidget(self.lbl_img)

        # vbox Layout
        self.setLayout(self.vbox)

        # 투명도 조절용 slider
        self.slider = QSlider(Qt.Horizontal, self)
        self.slider.setRange(10, 90)
        self.vbox.addWidget(self.slider)
        self.slider.valueChanged.connect(self.setOpacity)

        self.show()

        # QR 코드를 실시간으로 변경하기 위한 스레드
        t = threading.Thread(target=self.refreshImg, daemon=True)
        t.start()

        # 스레드 구현부

    def refreshImg(self):
        url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/qr/python?token=" + qr_token

        # 스레드를 멈추기 위한 bool 타입 변수
        global thread_code
        thread_code = True

        while thread_code:
            data = requests.post(url).json()
            # 서버에서 받아온 값의 error 값이 True면 QR이 아닌 error.png를 띄움
            if data['error']:
                self.pixmap = QPixmap('error.png')
            else:
                qr = qrcode.QRCode(
                    version=1,
                    error_correction=qrcode.constants.ERROR_CORRECT_L,
                    box_size=10,
                    border=0,
                )
                qr.add_data(data['randomNum'])
                img = qr.make_image(fill_color="black", back_color="white")
                qt_image = ImageQt.ImageQt(img)
                self.pixmap = QPixmap.fromImage(qt_image)

            # error.png 혹은 QR코드를 lbl_img에 지정
            self.lbl_img.setPixmap(self.pixmap)
            time.sleep(1)

    # 투명도 조절 함수, slider와 연결
    def setOpacity(self, value):
        value = 1.1 - (value / 100)
        self.setWindowOpacity(value)

    # 로그아웃 기능, 로그아웃 버튼과 연결
    def logout(self):
        msgBox = QMessageBox()
        msgBox.setWindowTitle("로그아웃")
        msgBox.setText("로그아웃하시겠습니까?")
        msgBox.setStandardButtons(QMessageBox.Ok | QMessageBox.Cancel)
        answer = msgBox.exec()

        # 사용자에게 로그아웃 ok를 입력받으면 thread_code를 False로 변경 -> 로그아웃 후에는 스레드가 돌지 않게 변경
        if answer == QMessageBox.Ok:
            global thread_code
            thread_code = False

            # QR 창을 닫고 다시 Loign 창을 띄움
            self.close()
            self.login = LoginForm()
            self.login.show()

        elif answer == QMessageBox.Cancel:
            msgBox.close()


if __name__ == '__main__':
    app = QApplication(sys.argv)

    form = LoginForm()
    form.show()

    sys.exit(app.exec_())