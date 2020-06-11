import os
from winreg import *

punch_path = r"Punch"
dir_path = "C:\\Program Files\\Punch"


def mk_dir():
    os.makedirs(dir_path, exist_ok=True)
    print(dir_path+"에 Punch 폴더가 생성되었습니다.")


def make_registry():
    # 'Punch' 키 생성
    CreateKey(HKEY_CLASSES_ROOT, punch_path)

    # 'Punch' 하위의 'shell' 키 생성
    shell_path = punch_path + r"\shell"
    CreateKey(HKEY_CLASSES_ROOT, shell_path)

    # 'shell' 하위의 'open' 키 생성
    open_path = shell_path + r"\open"
    CreateKey(HKEY_CLASSES_ROOT, open_path)

    # 'open' 하위의 'command' 키 생성
    command_path = open_path + r"\command"
    CreateKey(HKEY_CLASSES_ROOT, command_path)


def register_registry():
    # HKEY_CLASSES_ROOT와 연결 생성 후 핸들 얻음
    reg_handle = ConnectRegistry(None, HKEY_CLASSES_ROOT)

    # 얻은 행동을 사용해 WRITE 권한으로 레지스트리 키를 엶
    key = OpenKey(reg_handle, punch_path, 0, KEY_WRITE)

    # 레지스트리 값을 등록
    try:
        SetValueEx(key, 'URL protocol', 0,  REG_SZ, "")
    except EnvironmentError:
        print("Encountered problems writing into the Registry...")

    CloseKey(key)

    # 얻은 행동을 사용해 WRITE 권한으로 레지스트리 키를 엶
    command_path = punch_path + r"\shell\open\command"
    key = OpenKey(reg_handle, command_path, 0, KEY_WRITE)

    # command 키의 값에 ""가 포함 되어야함
    dir_path2 = '\"' + dir_path+"\\dist\\Punch\\Punch.exe" + '\"'

    # 레지스트리 값을 등록
    try:
        #스트링 타입으로 ADRESS HERE에 열 파일 위치를 넣으면 됨
        SetValue(key, "", REG_SZ, dir_path2)
        print("레지스트리가 정상적으로 등록되었습니다.")
    except EnvironmentError:
        print("Encountered problems writing into the Registry...")

    # 레지스트리를 닫음
    CloseKey(key)
    CloseKey(reg_handle)


mk_dir()
make_registry()
register_registry()

input("콘솔을 종료하려면 enter키를 눌러주세요.")
