from datetime import datetime
import os

from settings import BASE_DIR

IMAGE_DIR = f"{BASE_DIR}/static"
print("========================")
print("========================")
print(BASE_DIR)
print("========================")
print("========================")


async def single_file_uploader(file):
    try:
        current_date = datetime.utcnow()
        save_date = current_date.strftime("%Y_%m_%d")
        file_name = f"{current_date.strftime('%f')}_{file.filename}"
        # save_url = os.path.join(IMAGE_DIR, save_date, file_name)
        save_folder = os.path.join(IMAGE_DIR, save_date)
        save_url = os.path.join(save_folder, file_name)

        os.makedirs(save_folder, exist_ok=True)
        content = await file.read()
        with open(save_url, "wb") as fp:
            fp.write(content)

        return {
            "is_success": True,
            "url": "/static" + save_url.split("/static")[1],
        }
    except Exception as e:
        return {"is_success": False}


async def delete_file(url):
    try:
        os.remove(BASE_DIR + url)
        return True
    except:
        return None
