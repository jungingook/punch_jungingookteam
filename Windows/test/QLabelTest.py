import sys
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout


class MyApp(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):

        label = QLabel('First Label', self)
        label.setText("Test")

        layout = QVBoxLayout()
        layout.addWidget(label)

        self.show()
        self.setLayout(layout)


if __name__ == '__main__':

    app = QApplication(sys.argv)
    ex = MyApp()
    sys.exit(app.exec_())