import sys
import qrcode

from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout, QSlider, QPushButton
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt
from PIL import ImageQt


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.setWindowFlags(Qt.WindowStaysOnTopHint)  # 파이썬 실행창을 항상 위로 유지해주는 코드
        self.initUI()

    def initUI(self):
        # Hello World! 로 QR 코드 생성
        img = qrcode.make('Hello World!')

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

    def button_clicked(self):
        self.slider.setValue(1)

    def setOpacity(self, value):
        value = 1.1-(value/100)
        self.setWindowOpacity(value)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApp()
    sys.exit(app.exec_())

