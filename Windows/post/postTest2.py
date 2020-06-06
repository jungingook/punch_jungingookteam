import requests

url_login = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/python/login"
my_json = {'inputId': 'id1', 'inputPw': 'pw1'}

response_login = requests.post(url_login, json=my_json)

data_login = response_login.json()
qr_token = data_login['token']
print(data_login)

url_data = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/python/qr?token=" + qr_token
data = requests.post(url_data).json()
print(data)
