import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QGridLayout, QWidget
from PyQt5.QtGui import QPixmap


class Example(QWidget):
    def __init__(self):
        super().__init__()

        self.im = QPixmap("logo.png")
        self.label = QLabel()
        self.label.setPixmap(self.im.scaled(300, 300))

        self.grid = QGridLayout()
        self.grid.addWidget(self.label, 0, 0)
        self.setLayout(self.grid)

        self.setGeometry(50, 50, 320, 200)
        self.setWindowTitle("PyQT show image")
        self.show()


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = Example()
    sys.exit(app.exec_())