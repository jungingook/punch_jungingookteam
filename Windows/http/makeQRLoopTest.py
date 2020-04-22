#프로젝트 서버의 데이터 값을 받아와 원하는 key의 value 값을 추출하고 추출한 값으로 qr코드 생성
import sys
import qrcode
import requests


from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt
from PIL import ImageQt


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        #서버에서 json 값을 받아와 data 변수에 저장
        url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr"
        data = requests.get(url).json()

        # data 딕셔너리 중 randomNum 키의 value 값으로 qr코드 생성, 추후 다른 키 값과 조합하여 수정 예정
        img = qrcode.make(data['randomNum'])

        qt_image = ImageQt.ImageQt(img)
        pixmap = QPixmap.fromImage(qt_image)

        lbl_img = QLabel()
        lbl_img.setPixmap(pixmap)
        lbl_size = QLabel('Width: '+str(pixmap.width())+', Height: '+str(pixmap.height()))
        lbl_size.setAlignment(Qt.AlignCenter)

        vbox = QVBoxLayout()
        vbox.addWidget(lbl_img)
        vbox.addWidget(lbl_size)
        self.setLayout(vbox)

        self.setWindowTitle('QPixmap')
        self.move(300, 300)
        self.show()


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApp()
    sys.exit(app.exec_())



