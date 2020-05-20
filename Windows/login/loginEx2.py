import sys
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QLineEdit, QGridLayout, QMessageBox
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt


class LoginForm(QWidget):
    def __init__(self):
        super().__init__()
        self.setStyleSheet("background-color:white;")

        self.setWindowTitle('펀치 QR 생성')
        self.resize(300, 500)

        layout = QGridLayout()

        self.lbl = QLabel()
        self.img = QPixmap("logo.png")
        self.lbl.setPixmap(self.img.scaledToWidth(300))
        self.lbl.setStyleSheet("background-color:white;")
        self.lbl.setAlignment(Qt.AlignCenter)

        layout.addWidget(self.lbl, 0, 0)

        self.lineEdit_username = QLineEdit()
        self.lineEdit_username.setStyleSheet("font-size: 30px;")
        self.lineEdit_username.setPlaceholderText('아이디')
        self.lineEdit_username.resize(50, 10)

        layout.addWidget(self.lineEdit_username, 1, 0)

        self.lineEdit_password = QLineEdit()
        self.lineEdit_password.setStyleSheet("font-size: 30px;")
        self.lineEdit_password.setEchoMode(QLineEdit.Password)
        self.lineEdit_password.setPlaceholderText('비밀번호')
        layout.addWidget(self.lineEdit_password, 2, 0)

        button_login = QPushButton('Login')
        button_login.clicked.connect(self.check_password)
        button_login.setShortcut('Return')
        layout.addWidget(button_login, 3, 0)

        self.setLayout(layout)

    def check_password(self):
        msg = QMessageBox()

        if self.lineEdit_username.text() == 'ingook' and self.lineEdit_password.text() == 'babo':
            msg.setText('Success')
            msg.exec_()
            app.quit()
        else:
            msg.setText('Incorrect Password')
            msg.exec_()


if __name__ == '__main__':
    app = QApplication(sys.argv)

    form = LoginForm()
    form.show()

    sys.exit(app.exec_())
