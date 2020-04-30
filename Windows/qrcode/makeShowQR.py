import sys
import qrcode

from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt
from PIL import ImageQt


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.setWindowFlags(Qt.WindowStaysOnTopHint) #파이썬 실행창을 항상 위로 유지해주는 코드
        self.initUI()

    def initUI(self):
        # Hello World! 로 QR 코드 생성
        self.setStyleSheet("background-color: #FFFFFF")
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=0,
        )
        qr.add_data('Hello World')
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        qt_image = ImageQt.ImageQt(img)
        pixmap = QPixmap.fromImage(qt_image)


        lbl_img = QLabel()
        lbl_img.setPixmap(pixmap)



        vbox = QVBoxLayout()
        vbox.addWidget(lbl_img)
        self.setLayout(vbox)

        self.setWindowTitle('QPixmap')
        self.move(300, 300)
        self.show()


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyApp()
    sys.exit(app.exec_())

