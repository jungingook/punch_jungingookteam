import json

# with를 이용해 파일을 연다.
# json 파일은 같은 폴더에 있다고 가정!

with open('lecture.json', encoding='utf-8') as json_file:
    json_data = json.load(json_file)

    # 문자열
    # key가 json_string인 문자열 가져오기
    json_string = json_data["lecture_name"]
    print(json_string)

    # 숫자
    # key가 json_number인 숫자 가져오기
    json_number = json_data["lecture_number"]
    print(str(json_number)) # 숫자이기 때문에 str()함수를 이용

