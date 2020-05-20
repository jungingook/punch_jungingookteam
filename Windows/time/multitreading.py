#프로젝트 서버의 데이터 값을 받아와 원하는 key의 value 값을 추출하고 추출한 값으로 qr코드 생성
import sys
import qrcode
import requests
import threading
import time

from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt
from PIL import ImageQt


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.setWindowFlags(Qt.WindowStaysOnTopHint)  # 파이썬 실행창을 항상 위로 유지해주는 코드
        self.initUI()

    def initUI(self):
        img = qrcode.make("Start")
        qt_image = ImageQt.ImageQt(img)
        self.pixmap = QPixmap.fromImage(qt_image)


        self.lbl_img = QLabel()
        self.lbl_img.setPixmap(self.pixmap)
        self.lbl_size = QLabel('Width: '+str(self.pixmap.width())+', Height: '+str(self.pixmap.height()))
        self.lbl_size.setAlignment(Qt.AlignCenter)

        vbox = QVBoxLayout()
        vbox.addWidget(self.lbl_img)
        vbox.addWidget(self.lbl_size)
        self.setLayout(vbox)

        self.setWindowTitle('qrcode')
        self.move(300, 300)
        self.show()

        threading.Thread(target=self.refreshImg, daemon=True).start()

    def refreshImg(self):
        url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr"
        while True:
            data = requests.get(url).json()
            img = qrcode.make(str(data['id']) + data['randomNum'])
            qt_image = ImageQt.ImageQt(img)
            self.pixmap = QPixmap.fromImage(qt_image)
            self.lbl_img.setPixmap(self.pixmap)
            time.sleep(1)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApp()
    sys.exit(app.exec_())



