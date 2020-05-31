import requests

url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/test/login"
my_json = {'id': '1', 'pw': '1'}

response = requests.post(url, json=my_json)

print(response.status_code)
print(response.text)
