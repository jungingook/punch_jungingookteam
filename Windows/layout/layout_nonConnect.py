import sys
import qrcode

from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout, QSlider
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt
from PIL import ImageQt


class MyApp(QWidget):

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


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApp()
    sys.exit(app.exec_())

