const User = require('./Model');
const OTP = require('../OTP/Model');
const { sendMail, mailForm } = require('../../utils/mail');
const jwt = require('jsonwebtoken');

// [POST] -> /api/user/register
module.exports.POST_CreateUser = async (req, res, next) => {
    // Tạo tài khoản bằng req.data
    return await User.create({ ...req.body })
        .then((user) => {
            return res.status(200).json({
                success: true,
                data: user,
                msg: 'User inserted',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: err,
            });
        });
};

// [POST] -> /api/user/login
module.exports.POST_Login = async (req, res, next) => {
    const { email } = req.body;

    // Kiểm tra tài khoản tồn tại bằng email
    let user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            msg: 'Không tìm thấy User',
        });
    }

    // Generate OTP code
    let code = Math.floor(Math.random() * (9999 - 1000) + 1000);
    return await OTP.create({ email, code })
        .then((otp) => {
            const options = {
                to: email,
                subject: `${code} Mã xác nhận đăng nhập tài khoản`,
                html: mailForm({
                    caption: 'Mã xác nhận đăng nhập EzTicket',
                    content: ` 
                    <p><strong>Email: </strong>${email}</p>
                    <h1>${code}</h1>
                    `,
                }),
            };

            // // Gửi mail OTP
            sendMail(options, (err, info) => {
                if (err) {
                    return res.status(300).json({ success: false, msg: err });
                }
            });

            return res.status(200).json({ success: true, code, msg: 'Mã đăng nhập đã được gửi đi' });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: err,
            });
        });
};

// [POST] -> /api/user/confirm_otp
module.exports.POST_ConfirmOTP = async (req, res, next) => {
    const { email, code } = req.body;

    // Check otp
    await OTP.findOne({ email, code })
        .then(async (otp) => {
            if (otp) {
                
                // Truy vấn thông tin user
                let user = await User.findOne({ email }).lean();

                // Kí jwt rồi gửi về client
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
                return res.status(200).json({ success: true, accessToken, msg: 'Xác nhân OTP thành công' });
            }

            return res.status(404).json({ success: false, msg: 'Không tìm thấy OTP' });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ success: false, msg: err });
        });
};


// [ANY] -> api/user/test_authentication
module.exports.ANY_AuthenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            success: false,
            msg: 'Token not found'
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(404).json({
                success: false,
                msg: 'Token invalid'
            })
        }
        req.user = user;
        next();
    });
};
