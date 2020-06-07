import requests

url = "http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/test/login"
my_json = {'id': '101', 'pw': '2020'}

response = requests.post(url, json=my_json)

if response.text == 'what?':
    print("error")

else:

    data = response.json()
    print(data)
