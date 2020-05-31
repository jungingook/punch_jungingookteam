import requests

url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/python/login"
my_json = {"inputId": "p2id", "inputPw": "p2pw"}
response = requests.post(url, json=my_json)

print(response.status_code)

data = response.json()
print(data)
