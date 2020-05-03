import sys, time, threading
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):

        self.label = QLabel('First Label', self)

        layout = QVBoxLayout()
        layout.addWidget(self.label)

        self.show()
        self.setLayout(layout)

        t = threading.Thread(target=self.changeText)
        t.start()

    def changeText(self):
        count = 0

        while True:
            text = "Test" + str(count)
            self.label.setText(text)
            time.sleep(1)
            count += 1
            print(text)


if __name__ == '__main__':

    app = QApplication(sys.argv)
    ex = MyApp()
    sys.exit(app.exec_())