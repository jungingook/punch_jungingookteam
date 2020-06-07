#프로젝트 서버와 통신하여 통신 상태와 데이터를 제대로 받아오는지 확인하는 테스트 파일
import requests

url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr"
response = requests.get(url)
print("status code :", response.status_code)
print(response.text)