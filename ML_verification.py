import cv2 as cv
import easyocr
import face_recognition
import matplotlib.pyplot as plt
import numpy as np

def get_ocr(img):
    reader = easyocr.Reader(['en'])
    result = reader.readtext(img)
    return result

def get_faces(img):
    face_locations = face_recognition.face_locations(img)
    return face_locations

def get_face_encodings(img,num_jitters=10, model='large'):
    face_encodings = face_recognition.face_encodings(img, num_jitters=num_jitters, model=model)
    try:
        return face_encodings[0]
    except:
        return []

def same_person(img1,img2,threshold=0.5):
    face_encodings1 = get_face_encodings(img1)
    face_encodings2 = get_face_encodings(img2)
    if len(face_encodings1) == 0 or len(face_encodings2) == 0:
        return False
    else:
        result = face_recognition.compare_faces([face_encodings1], face_encodings2, tolerance=threshold)
        return result[0]
