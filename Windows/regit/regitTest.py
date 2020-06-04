from winreg import *

punch_path = r"Punch"


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
        SetValueEx(key, 'URL protocol',0,  REG_SZ, "")
    except EnvironmentError:
        print("Encountered problems writing into the Registry...")

    CloseKey(key)

    # 얻은 행동을 사용해 WRITE 권한으로 레지스트리 키를 엶
    command_path = punch_path + r"\shell\open\command"
    key = OpenKey(reg_handle, command_path, 0, KEY_WRITE)

    # 레지스트리 값을 등록
    try:
        #스트링 타입으로 ADRESS HERE에 열 파일 위치를 넣으면 됨
        SetValue(key, "", REG_SZ, "ADRESSS HERE")
    except EnvironmentError:
        print("Encountered problems writing into the Registry...")

    # 레지스트리를 닫음
    CloseKey(key)
    CloseKey(reg_handle)


make_registry()
register_registry()