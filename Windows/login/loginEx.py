import sys
from PyQt5.QtWidgets import (QApplication, QWidget, QPushButton, QLabel, QLineEdit, QGridLayout, QMessageBox)
from PyQt5.QtGui import QPixmap


class LoginForm(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Login Form')
        self.resize(150, 500)

        layout = QGridLayout()

        self.pix_logo = QPixmap('logo.png')
        self.logo_img = QLabel()
        self.logo_img.setPixmap(self.pix_logo)
        layout.addWidget(self.logo_img, 0, 0)

        self.lineEdit_username = QLineEdit()
        self.lineEdit_username.setPlaceholderText('아이디')
        layout.addWidget(self.lineEdit_username, 1, 0)

        self.lineEdit_password = QLineEdit()
        self.lineEdit_password.setPlaceholderText('비밀번호')
        layout.addWidget(self.lineEdit_password, 2, 0)

        button_login = QPushButton('Login')
        button_login.clicked.connect(self.check_password)
        layout.addWidget(button_login, 3, 0)
        layout.setRowMinimumHeight(2, 75)

        self.setLayout(layout)

    def check_password(self):
        msg = QMessageBox()

        if self.lineEdit_username.text() == 'Username' and self.lineEdit_password.text() == '000':
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