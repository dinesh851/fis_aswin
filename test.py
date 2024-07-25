import os

folder_path = 'static/icons'

os.chdir(folder_path)

png_files = [f for f in os.listdir() if f.endswith('.png')]
  
for count, filename in enumerate(png_files, start=100):
    new_name = f"{count}.png"
    os.rename(filename, new_name)
for count, filename in enumerate(png_files, start=1):
    new_name = f"{count}.png"
    os.rename(filename, new_name)

print(f"Renamed {len(png_files)} files.")
