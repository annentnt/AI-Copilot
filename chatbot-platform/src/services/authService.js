const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};
