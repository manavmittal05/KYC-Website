const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({

    fullname: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    idType: {
        type: String,
        required: false,
        default: "",
        enum: ["Aadhaar", "PAN", ""]
    },

    idNum: {
        type: String,
        required: false,
        default: "",
    },

    kycStatus: {
        type: Boolean,
        required: false,
        default: false
    }
})

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Contact Number already registered!'));
    } else {
        next(error);
    }
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);