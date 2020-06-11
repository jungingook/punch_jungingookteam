#프로젝트 서버와 통신하여 json 값 중 원하는 key의 value값을 출력하는 테스트 소스코드
import requests

url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr"
data = requests.get(url).json()
print(data['randomNum'])

