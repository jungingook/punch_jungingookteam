import time
import threading

name = "은성"
state = "바보"


def thread0():
    while True:
        print(name)  # 전역변수로 값을 전달받음
        time.sleep(1)


def thread1(t, text):
    while True:
        print(text)
        time.sleep(t)
    '''
    매개변수도 받아서 사용할수 있음 
    '''


t0 = threading.Thread(target=thread0)
t0.start()

t1 = threading.Thread(target=thread1, args=(1.5, state))  # 시간, 텍스트를 매개변수로 전달
t1.start()