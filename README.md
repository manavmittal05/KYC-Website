# KYC-Website

KYC-Website is a web application designed to authenticate customers by utilizing their valid government-issued ID. It leverages machine learning techniques to match the user's real-time face with the information provided on the ID card, including details such as date of birth and gender. This project holds immense industrial significance as it fulfills the KYC (Know Your Customer) verification requirements for banking and financial institutions.

**Note:** Due to financial constraints, we were unable to acquire a domain name and SSL certification for our web app. As a result, the website runs on HTTP instead of HTTPS. This leads to a minor inconvenience since modern browsers restrict the use of the camera and microphone on HTTP-only websites, hindering the KYC process. To overcome this issue, it is necessary to add the website to the list of exceptions at "chrome://flags/#unsafely-treat-insecure-origin-as-secure". This will prompt the browser to treat our website as HTTPS, resolving the limitation.

## Features

1. **User Authentication:** Any user can register on the website to authenticate themselves. Logging in grants authorization to perform various tasks within the system.
2. **Server-side Sessions:** User sessions are securely maintained on the server system, ensuring greater security for logged-in users.
3. **KYC Verification:** Authorized users can undergo the KYC process on the website to get themselves verified.
4. **Automated KYC:** The KYC process is fully automated, eliminating the need for human intervention and enabling swift verification.
5. **Machine Learning-Based Verification:** KYC is performed using machine learning models hosted on our API backend. These models apply text recognition techniques to extract information from the ID card and employ face matching algorithms to verify the authenticity of the user.
6. **Privacy Protection:** IDs are not stored on our server, addressing privacy concerns that may arise from storing sensitive information.

## Technology Used

1. **Node.js:** The application is built on Node.js, a JavaScript runtime environment.
2. **Express.js:** Server-side scripting is done using Express.js, a fast and minimalist web application framework for Node.js.
3. **MongoDB Atlas:** The cloud database manager used for KYC-Website. It is connected to the application through Mongoose, an Object Data Modeling (ODM) library for MongoDB and Node.js.
4. **Bootstrap:** The web application is styled and made responsive using Bootstrap, a popular front-end framework.
5. **EJS:** Dynamic HTML views are created using EJS (Embedded JavaScript), a simple templating language that allows embedding JavaScript code within HTML markup.
6. **Joi:** Joi is used for form validation, ensuring that user-submitted data meets the specified requirements.
7. **Sanitize-html:** Sanitize-html is utilized to enhance the security of the web application, protecting against vulnerabilities such as cross-site scripting.
8. **Passport.js:** Passport.js is employed for user authentication, providing a secure and flexible authentication middleware for Node.js.
9. **AWS EC2 Instance:** The Express server is hosted on an AWS EC2 instance, offering a scalable and reliable hosting environment.
10. **Oracle E2 Instance:** The ML API server is hosted on an Oracle E2 instance, providing a robust platform for handling API requests.
11. **OCR:** The ML API utilizes the easy-ocr library to extract details from the provided IDs. The extracted information is then matched against the details sent from the Express server.
12. **Face-Recognition:** The face-recognition Python library is employed to perform face recognition on the given ID and the live image captured from the user.
13. **FastAPI:** FastAPI is used to handle all requests to and from the Oracle server, enabling efficient communication between the web application and the ML API.

Please feel free to explore KYC-Website and experience the seamless and secure KYC verification process it offers. If you encounter any issues or have suggestions for improvements, please don't hesitate to reach out.

Contact Us: \
    Manav Mittal: manavmittal05@gmail.com \
    Sidhant Yadav: ydvsidhant@gmail.com \
    Shubham Hazra: shubhamhazra1234@gmail.com
