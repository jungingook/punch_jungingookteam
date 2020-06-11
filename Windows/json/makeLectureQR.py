import sys
import qrcode
import json

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
        with open('lecture.json', encoding='utf-8') as json_file:
            json_data = json.load(json_file)

            # 문자열
            # key가 json_string인 문자열 가져오기
            json_string = json_data["lecture_name"]


            # 숫자
            # key가 json_number인 숫자 가져오기
            json_number = json_data["lecture_number"]

        # JSON 파일의 데이터를 이용하여 QR 코드 생성, 숫자이기 때문에 str()함수를 이용
        img = qrcode.make(json_string + str(json_number))


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



