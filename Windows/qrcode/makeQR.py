import qrcode

# Hello World! 로 QR 코드 생성
img = qrcode.make('한글로 qr코드 만들어지는 테스트')

# 생성된 이미지를 helloworld_qrcode.png로 저장
img.save('qrcode.png')