from PyQt5.QtWidgets import *


class MyDialog(QDialog):
    def __init__(self):
        QDialog.__init__(self)

        # 레이블
        lblPhoto = QLabel("qrcode.png")

        # 레이아웃
        layout = QVBoxLayout()
        layout.addWidget(lblPhoto)

        # 다이얼로그에 레이아웃 지정
        self.setLayout(layout)


# App
app = QApplication([])
dialog = MyDialog()
dialog.show()
app.exec_()