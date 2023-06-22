# Import necessary libraries
import base64
import os
from typing import List

import uvicorn
from fastapi import FastAPI, File, Form, Request, UploadFile
from fuzzywuzzy import fuzz, process
from pydantic import BaseModel

from ML_verification import *

reader = easyocr.Reader(['en','hi'])

app = FastAPI()

class Result(BaseModel):
    result: bool
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
    authenticated = True
    description = ''
    name = form["name"]
    name = name.upper().replace(" ","",-1)
    dob = form["dob"]
    gender = form["gender"]
    gender = gender.upper()
    aadhaar_number = form["aadhaar_number"]
    aadhaar_number = aadhaar_number.replace(" ","",-1)
    aadhaar_image = get_img_b64(form["aadhaar_card"])
    selfie = get_img_b64(form["selfie"])
    text = reader.readtext(aadhaar_image)
    concatenated_text = ''
    for detection in text:
        text = detection[1]
        concatenated_text += text + ' '
    concatenated_text = concatenated_text.replace(' ', '',-1).upper()
    if fuzz.partial_ratio(name,concatenated_text) < 85:
        authenticated = False
        description += 'Name not matched \n'
    if fuzz.partial_ratio(dob,concatenated_text) < 90:
        authenticated = False
        description += 'DOB not matched \n'
    if fuzz.partial_ratio(aadhaar_number,concatenated_text) < 90:
        authenticated = False
        description += 'Aadhaar number not matched \n'
    if gender not in concatenated_text:
        authenticated = False
        description += 'Gender not matched \n'
    face_match = same_person(aadhaar_image,selfie)
    if not face_match:
        authenticated = False
        description += 'Face not matched \n'
    if authenticated:
        description = 'Aadhaar verified successfully'
    result = Result(result=authenticated,description=description)
    return result


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
