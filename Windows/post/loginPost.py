import requests

url_login = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/python/login"
my_json = {"inputId": "p2id", "inputPw": "p2pw"}
response_login = requests.post(url_login, json=my_json)

print(response_login.status_code)

data_login = response_login.json()
qr_token = data_login['token']


url_qr = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/python/qr?token=" + qr_token

response_qr = requests.post(url_qr)
data_qr = response_qr.json()
print(data_qr['randomNum'])

