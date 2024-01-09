const express = require('express');
const router = express.Router();
const { createSlug } = require('../../utils/crypto');
const fs = require('fs-extra');
const Event = require('./Model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// [POST] -> /api/event/create
module.exports.POST_CreateEvent = async (req, res, next) => {
    const file = req.file;
    const { name, categories } = req.body;
    let image = await cloudinary.uploader.upload(file.path);
    if (!image) {
        return res.status(500).json({
            success: false,
            msg: 'Cloudinary error',
        });
    }

    fs.unlinkSync(file.path);

    return Event.create({
        ...req.body,
        categories: categories.split(','),
        banner: image.url,
        status: 'ready',
        slug: createSlug(name),
    })
        .then((event) => {
            return res.status(200).json({
                success: true,
                event,
                msg: 'Tạo sự kiện thành công',
            });
        })
        .catch(async (err) => {
            await cloudinary.uploader.destroy(image.public_id);
            return res.status(500).json({
                success: false,
                msg: 'Tạo sự kiện thất bại: ' + err,
            });
        });
};

// [PUT] -> /api/event/update/:event_id
module.exports.PUT_UpdateEvent = async (req, res, next) => {
    const { event_id } = req.params;
    const { categories } = req.body;
    const file = req.file;

    // Kiểm tra sự kiện tồn tại hay không
    let event = await Event.findOne({ _id: event_id }).select({ introduce: 0 }).lean();

    if (!event) {
        return res.status(404).json({
            success: false,
            msg: 'Không tìm thấy sự kiện',
        });
    }

    // Tạm gắn banner cũ
    let banner = event.banner;
    let url_parts = banner.split('/');

    // Lưu public id (cloudinary)
    let new_public_id = '';
    let old_public_id = url_parts[url_parts.length - 1].replace('.jpg', '');
    
    if (file) {
        // Upload banner mới len cloudinary
        let image = await cloudinary.uploader.upload(file.path);
        if (!image) {
            return res.status(500).json({
                success: false,
                msg: 'Cloudinary error',
            });
        }

        // Gắn banner mới khi có file mới
        banner = image.url;
        new_public_id = image.public_id;

        // Xóa file multer upload lên
        fs.unlinkSync(file.path);
    }

    return await Event.findByIdAndUpdate(
        event_id,
        { $set: { ...req.body, banner, categories: categories.split(',') } },
        { returnOriginal: false },
    )
        .then( (event) => {
            // Destroy link banner cũ trên cloudinary
            cloudinary.uploader.destroy(old_public_id);

            return res.status(200).json({
                success: true,
                event,
                msg: 'Cập nhật sự kiện thành công',
            });
        })
        .catch( (err) => {
            // Destroy banner mới trên cloudinary vì update lỗi
            cloudinary.uploader.destroy(new_public_id);

            return res.status(500).json({
                success: false,
                msg: 'Cập nhật sự kiện thất bại: ' + err,
            });
        });
};

// [DELETE] -> /api/event/delete/:event_id
module.exports.DELETE_RemoveEvent = async (req, res, next) => {
    const { event_id } = req.params;

    return await Event.findByIdAndDelete(event_id)
        .then(event => {
            let url_parts = event.banner.split('/');
            let public_id = url_parts[url_parts.length - 1].replace('.jpg', '');

            cloudinary.uploader.destroy(public_id);
            return res.status(200).json({
                success: true,
                event,
                msg: 'Xóa sự kiện thành công',
            });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                msg: 'Xóa sự kiện thất bại: ' + err,
            });
        })
};

// [GET] -> api/event/detail/:event_id
module.exports.GET_EventDetail = async (req, res, next) => {
    const { event_id } = req.params;

    return await Event.findById(event_id).lean()
        .then(event => {
            return res.status(200).json({
                success: true,
                event,
                msg: 'Tìm kiếm sự kiện thành công'
            })
        })
        .catch(err => {
            return res.status(404).json({
                success: false,
                msg: 'Tìm kiếm sự kiện thất bại: ' + err
            })
        })
}

// [GET] -> api/event/search?...
module.exports.GET_SearchEvents = async (req, res, next) => {
    return await Event.find({...req.query}).select({ introduce: 0 }).lean()
        .then(events => {
            return res.status(200).json({
                success: true,
                events,
                msg: `Đã tìm thấy ${events.length} sự kiện tương ứng`
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                msg: 'Lỗi hệ thống trong quá trình tìm kiếm: ' + err
            })
        })
}


module.exports.POST_UploadCK = async (req, res, next) => {
    const file = req.file;
    if(!file) {
        return res.status(500).json({
            success: false,
            msg: 'Không tìm thấy file'
        })
    }

    let image = await cloudinary.uploader.upload(file.path);
    if (!image) {
        return res.status(500).json({
            success: false,
            msg: 'Cloudinary error',
        });
    }

    fs.unlinkSync(file.path);

    return res.status(200).json({
        success: true,
        url: image.url
    })
}