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


class LoginForm(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setStyleSheet("background-color:white;")

        self.setWindowTitle('펀치 QR 생성')
        self.resize(300, 500)

        layout = QGridLayout()

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

        self.lineEdit_username = QLineEdit()
        self.lineEdit_username.setStyleSheet("font-family: NanumSquare; font-size: 20px; font-weight:bold; "
                                             "padding-left: 10px;"
                                             "background-color: #f6f7f9; border-radius:10px; height:45px;")
        self.lineEdit_username.setPlaceholderText('아이디')
        self.lineEdit_username.resize(50, 10)

        layout.addWidget(self.lineEdit_username, 2, 0)

        self.lineEdit_password = QLineEdit()
        self.lineEdit_password.setStyleSheet("font-family: NanumSquare; font-size: 20px; font-weight:bold; "
                                             "padding-left: 10px;"
                                             "background-color: #f6f7f9; border-radius:10px; height:45px;")
        self.lineEdit_password.setEchoMode(QLineEdit.Password)
        self.lineEdit_password.setPlaceholderText('비밀번호')
        layout.addWidget(self.lineEdit_password, 3, 0)

        button_login = QPushButton('로그인')
        button_login.clicked.connect(self.check_password)
        button_login.setShortcut("Return")
        button_login.setStyleSheet("font-size : 20px; background-color: #fff; font-family: NanumSquare;"
                                   "background-color: #fff;"
                                   "height: 45px; margin-top:10px; padding 5px;")

        layout.addWidget(button_login, 4, 0)

        self.setLayout(layout)

    def check_password(self):
        if self.lineEdit_username.text() == "" or self.lineEdit_password.text() == "":
            msg = QMessageBox()
            msg.setText('아이디 혹은 비밀번호를 입력하세요.')
            msg.exec_()
        else:
            url_post = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/test/login"
            login_json = {'id': self.lineEdit_username.text(), 'pw': self.lineEdit_password.text()}
            response = requests.post(url_post, json=login_json)
            print(response.status_code)
            if response.status_code == 200:
                if response.text == 'what?':
                    msg = QMessageBox()
                    msg.setText('아이디 혹은 비밀번호를 확인해주세요.')
                    msg.exec_()
                else:
                    # login_code = response.json() <-추후 json으로 받아올 경우를 대비한 코드
                    self.qr = QR()
                    self.qr.show()
                    self.close()
            else:
                msg = QMessageBox()
                msg.setText('인터넷 연결을 확인해주세요.')
                msg.exec_()


class QR(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        # 파이썬 실행창을 항상 위로 유지해주는 코드
        self.setWindowFlags(Qt.WindowStaysOnTopHint)

        # 서버에서 json 값을 받아와 data_qr 변수에 저장
        url_qr = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr"
        data_qr = requests.get(url_qr).json()

        # data_qr 딕셔너리 중 randomNum 키의 value 값으로 qr코드 생성, 추후 다른 키 값과 조합하여 수정 예정
        self.setStyleSheet("background-color: #FFFFFF")
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=0,
        )
        qr.add_data(str(data_qr['id']) + data_qr['randomNum'])
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        qt_image = ImageQt.ImageQt(img)
        self.pixmap = QPixmap.fromImage(qt_image)

        self.lbl_img = QLabel()
        self.lbl_img.setPixmap(self.pixmap)
        self.lbl_img.setScaledContents(True)

        self.vbox = QVBoxLayout()
        self.vbox.addWidget(self.lbl_img)
        self.setLayout(self.vbox)

        self.slider = QSlider(Qt.Horizontal, self)
        self.slider.setRange(10, 90)
        self.vbox.addWidget(self.slider)

        self.btn = QPushButton('초기화', self)
        self.vbox.addWidget(self.btn)

        self.slider.valueChanged.connect(self.setOpacity)
        self.btn.clicked.connect(self.resetOpacity)

        self.setWindowTitle('투명도 조절')
        self.move(300, 300)
        self.show()

        t = threading.Thread(target=self.refreshImg, daemon=True)
        t.start()

    def refreshImg(self):
        url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr"
        while True:
            data = requests.get(url).json()
            img = qrcode.make(str(data['id']) + data['randomNum'])
            qt_image = ImageQt.ImageQt(img)
            self.pixmap = QPixmap.fromImage(qt_image)
            self.lbl_img.setPixmap(self.pixmap)
            time.sleep(1)

    def resetOpacity(self):
        self.slider.setValue(1)

    def setOpacity(self, value):
        value = 1.1 - (value / 100)
        self.setWindowOpacity(value)


if __name__ == '__main__':
    app = QApplication(sys.argv)

    form = LoginForm()
    form.show()

    sys.exit(app.exec_())
