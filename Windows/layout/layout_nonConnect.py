import sys
import qrcode

from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout, QSlider, QPushButton, QGridLayout, QLineEdit, \
    QMessageBox
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt
from PIL import ImageQt


class Login(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setStyleSheet("background-color:white;")
        self.setWindowTitle('Punch')
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
        self.lineEdit_username.setStyleSheet("font-family: NanumSquare; font-size: 20px; font-weight:bold;"
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
        self.qr = QR()
        self.qr.show()
        self.close()


class QR(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowFlags(Qt.WindowStaysOnTopHint)  # 파이썬 실행창을 항상 위로 유지해주는 코드
        self.setStyleSheet("background-color: #FFFFFF")
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=0,
        )
        # Hello World! 로 QR 코드 생성
        data = "hello World"
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        qt_image = ImageQt.ImageQt(img)
        pixmap = QPixmap.fromImage(qt_image)

        # QR코드 표시
        lbl_img = QLabel()
        lbl_img.setPixmap(pixmap.scaled(pixmap.width(), pixmap.height(), Qt.KeepAspectRatio))
        lbl_img.hasHeightForWidth()
        # qr코드를 화면에 맞춰줘서 확대하면 qr코드가 같이 확대됨
        lbl_img.setScaledContents(True)

        vbox = QVBoxLayout()

        #로그아웃 버튼
        button_logout = QPushButton('로그아웃')
        button_logout.setStyleSheet("font-family: NanumSquare; font-size: 20px; font-weight:bold;")
        button_logout.clicked.connect(self.logout)
        vbox.addWidget(button_logout)

        vbox.addWidget(lbl_img)

        # 투명도 조절을 위한 슬라이더 바
        slider = QSlider(Qt.Horizontal, self)
        slider.setRange(10, 90)
        vbox.addWidget(slider)

        self.setLayout(vbox)
        slider.valueChanged.connect(self.setOpacity)

        self.setWindowTitle('투명도 조절')
        self.move(300, 300)
        self.show()

    def setOpacity(self, value):
        value = 1.1-(value/100)
        self.setWindowOpacity(value)

    def logout(self):
        msgBox = QMessageBox()
        msgBox.setWindowTitle("로그아웃")
        msgBox.setText("로그아웃하시겠습니까?")
        msgBox.setStandardButtons(QMessageBox.Ok | QMessageBox.Cancel)
        answer = msgBox.exec()

        if answer == QMessageBox.Ok:
            self.close()
            self.login = Login()
            self.login.show()

        elif answer == QMessageBox.Cancel:
            msgBox.close()


if __name__ == '__main__':
    app = QApplication(sys.argv)

    form = Login()
    form.show()

    sys.exit(app.exec_())

