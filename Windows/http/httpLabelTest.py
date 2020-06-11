import sys, time, threading, requests
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):

        self.label = QLabel('First Label', self)

        layout = QVBoxLayout()
        layout.addWidget(self.label)

        t = threading.Thread(target=self.changeText)
        t.start()

        self.show()
        self.setLayout(layout)

    def changeText(self):
        url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr"
        while True:
            data = requests.get(url).json()
            text = data['randomNum']
            self.label.setText(text)
            time.sleep(1)


if __name__ == '__main__':

    app = QApplication(sys.argv)
    ex = MyApp()
    sys.exit(app.exec_())