import sys
import qrcode
import json

from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        #한글 데이터를 받아오기 위해 encoding='utf-8' 추가
        with open('lecture.json', encoding='utf-8') as json_file:
            json_data = json.load(json_file)

            # key가 json_string인 문자열 가져오기
            json_string = json_data["lecture_name"]
            print(json_string)
            # key가 json_number인 숫자 가져오기
            json_number = json_data["lecture_number"]
            print(str(json_number))  # 숫자이기 때문에 str()함수를 이용
        # Hello World! 로 QR 코드 생성
        img = qrcode.make(json_string + str(json_number))

        # 생성된 이미지를 helloworld_qrcode.png로 저장
        img.save('qrcode.png')
        pixmap = QPixmap('qrcode.png')

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