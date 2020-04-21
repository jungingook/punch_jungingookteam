# importing Image class from PIL package
from PIL import Image
import threading


def setInterval(func, time):
    e = threading.Event()
    while not e.wait(time):
        func()


def foo():
    im = Image.open("qrcode.png")
    im.show()


# using
setInterval(foo, 0.5)



