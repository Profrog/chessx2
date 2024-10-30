from PIL import Image
import os
import argparse

# 모든 PNG 파일이 있는 폴더 경로
parser = argparse.ArgumentParser(description="파일 경로를 인수로 받는 예제")
parser.add_argument('--input_dir', type=str, required=True, help="입력 파일 경로")
parser.add_argument('--output_dir', type=str, required=True, help="출력 파일 경로")
parser.add_argument('--delay', type=int, required=True, help="딜레이")

args = parser.parse_args()
folder_path = args.input_dir  # 변경 필요
png_files = sorted([f for f in os.listdir(folder_path) if f.endswith(".png")])

# PNG 파일들을 이미지 객체로 불러오기
images = [Image.open(os.path.join(folder_path, file)) for file in png_files]

# GIF로 저장
gif_path = os.path.join(args.output_dir)
images[0].save(
    gif_path,
    save_all=True,
    append_images=images[1:],
    duration=args.delay,  # 각 프레임의 지속 시간 (밀리초 단위)
    loop=0  # 0이면 무한 반복
)

print(f"GIF 파일이 생성되었습니다: {gif_path}")