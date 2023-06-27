let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");

// PNG file
// let file = null;
// let blob = document.querySelector("#canvas").toBlob(function(blob) {
// 				file = new File([blob], 'test.png', { type: 'image/png' });
// 			}, 'image/png');

camera_button.addEventListener('click', async function () {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
});

click_button.addEventListener('click', function () {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');
    document.querySelector('#selfie').value = image_data_url;
});


// SECURITY ISSUE (MALWARE INJECTION): A user can change the value of the hidden input field by using the browser's developer tools. If they
// change the input type to "text" they can see the value of the input field. This is a security issue because the user
// can then change the JPEG URI to whatever they want and hence we wont get the selfie image.

const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', function () {
    document.querySelector('#selfie').value = image_data_url;
});

// JPEG file
let file = null;
let blob = document.querySelector("#canvas").toBlob(function (blob) {
    file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
}, 'image/jpeg');