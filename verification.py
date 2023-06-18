# Import necessary libraries
import os
from typing import List

import uvicorn
from fastapi import FastAPI, File, Form, Request, UploadFile
from pydantic import BaseModel

from ML_verification import *

app = FastAPI()

class Result(BaseModel):
    result: bool
    description: str

def get_img(fast_api_image):
    contents = fast_api_image.file.read()
    jpg_as_np = np.frombuffer(contents, dtype=np.uint8)
    img = cv.imdecode(jpg_as_np, cv.IMREAD_COLOR)
    return img

@app.post("/verify_details")
async def verify_details(request: Request):
    async with request.form() as form:
        name = form["name"]
        dob = form["dob"]
        gender = form["gender"]
        aadhaar_number = form["aadhaar_number"]
        aadhaar_image = get_img(form["aadhaar_card"])
        reference_image = get_img(form["reference"])
        face_match = same_person(aadhaar_image,reference_image)
        if face_match:
            result = Result(result=True, description="Face matched")
        else:
            result = Result(result=False, description="Face not matched")
        return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)