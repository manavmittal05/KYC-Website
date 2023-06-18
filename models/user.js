const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    // contactNo: {
    //     type: Number,
    //     required: true,
    //     unique: [true, 'Contact Number already registered.']
    // },
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
    // aadharNo: {
    //     type: String,
    //     required: false,
    //     unique: [true, 'Adhaar Number already registered.'],
    //     default: "",
    //     partialIndexExpression: { aadharNo: { $gt: ""} }
    // },
    // panNo: {
    //     type: String,
    //     required: false,
    //     default: "",
    //     unique: [true, 'PAN Number already registered.'],
    //     partialIndexExpression: { aadharNo: { $gt: ""} }
    // },
    kycStatus: {
        type: Boolean,
        required: false,
        default: false
    }
})

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email ID already registered.'));
    } else {
        next(error);
    }
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);