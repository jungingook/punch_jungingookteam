## Ex 5-8. QSlider
import sys
from PyQt5.QtWidgets import QApplication, QWidget, QSlider, QPushButton
from PyQt5.QtCore import Qt


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.slider = QSlider(Qt.Horizontal, self)
        self.slider.setRange(10, 90)
        self.slider.move(30, 30)

        btn = QPushButton('초기화', self)
        btn.move(35, 160)

        self.slider.valueChanged.connect(self.setOpacity)
        btn.clicked.connect(self.button_clicked)

        self.setWindowTitle('QSlider')
        self.setGeometry(300, 300, 400, 200)
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