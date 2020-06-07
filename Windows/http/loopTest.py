#실시간으로 바뀌는 randomNum을 반영하기 위한 테스트 소스 코드
import requests

url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr"

while True:
    data = requests.get(url).json()
    print(data['randomNum'])

