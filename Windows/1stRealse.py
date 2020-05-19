import sys
import qrcode
import requests
import threading
import time

from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout, QSlider, QPushButton
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt
from PIL import ImageQt


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()
        # 파이썬 실행창을 항상 위로 유지해주는 코드
        self.setWindowFlags(Qt.WindowStaysOnTopHint)

    def initUI(self):
        #서버에서 json 값을 받아와 data 변수에 저장
        url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr"
        data = requests.get(url).json()

        # data 딕셔너리 중 randomNum 키의 value 값으로 qr코드 생성, 추후 다른 키 값과 조합하여 수정 예정
        self.setStyleSheet("background-color: #FFFFFF")
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=0,
        )
        qr.add_data(str(data['id'])+data['randomNum'])
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        qt_image = ImageQt.ImageQt(img)
        self.pixmap = QPixmap.fromImage(qt_image)

        self.lbl_img = QLabel()
        self.lbl_img.setPixmap(self.pixmap)

        self.vbox = QVBoxLayout()
        self.vbox.addWidget(self.lbl_img)
        self.setLayout(self.vbox)

        self.slider = QSlider(Qt.Horizontal, self)
        self.slider.setRange(10, 90)
        self.vbox.addWidget(self.slider)

        self.btn = QPushButton('초기화', self)
        self.vbox.addWidget(self.btn)

        self.slider.valueChanged.connect(self.setOpacity)
        self.btn.clicked.connect(self.button_clicked)

        self.setWindowTitle('투명도 조절')
        self.move(300, 300)
        self.show()

        t = threading.Thread(target=self.refreshImg)
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

    def button_clicked(self):
        self.slider.setValue(1)

    def setOpacity(self, value):
        value = 1.1 - (value / 100)
        self.setWindowOpacity(value)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApp()
    sys.exit(app.exec_())



