import base64
import os
from typing import List

import uvicorn
from fastapi import FastAPI, File, Form, Request, UploadFile
from fuzzywuzzy import fuzz, process
from pydantic import BaseModel
from ML_verification import *

reader = easyocr.Reader(['en'])

app = FastAPI()


class Result(BaseModel):
    result: int
    description: str


def get_img(fast_api_image):
    contents = fast_api_image.file.read()
    jpg_as_np = np.frombuffer(contents, dtype=np.uint8)
    img = cv.imdecode(jpg_as_np, cv.IMREAD_COLOR)
    return img


def get_img_b64(base64_image):
    im_bytes = base64.b64decode(base64_image)
    im_arr = np.frombuffer(im_bytes, dtype=np.uint8)
    img = cv.imdecode(im_arr, flags=cv.IMREAD_COLOR)
    return img


@app.post("/verify_details")
async def verify_details(request: Request):
    form = await request.json()
    authenticated = 0
    description = ''
    name = form["name"]
    name = name.upper().replace(" ", "", -1)
    dob = form["dob"]
    idType = form["idType"]
    if idType.lower() == 'aadhaar':
        gender = form["gender"]
        gender = gender.upper()
    idNum = form["idNum"]
    idNum = idNum.replace(" ", "", -1)
    idImage = get_img_b64(form["idFront"])
    selfie = get_img_b64(form["selfie"])
    text = reader.readtext(idImage)
    concatenated_text = ''
    for detection in text:
        text = detection[1]
        concatenated_text += text + ' '
    concatenated_text = concatenated_text.replace(' ', '', -1).upper()

    if name not in concatenated_text:
        authenticated = 1
        description += 'Name not matched \n'
    if dob not in concatenated_text:
        authenticated = 1
        description += 'DOB not matched \n'
    if idNum not in concatenated_text:
        authenticated = 1
        description += f'{idType} number not matched \n'
    if idType.lower() == 'aadhaar' and gender not in concatenated_text:
        authenticated = 1
        description += 'Gender not matched \n'
    if authenticated == 0:
        face_match = same_person(idImage, selfie)
        if not face_match:
            authenticated = 2
            description += 'Face not matched \n'
    if authenticated == 0:
        description = f'{idType} verified successfully'
    result = Result(result=authenticated, description=description)
    return result


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
