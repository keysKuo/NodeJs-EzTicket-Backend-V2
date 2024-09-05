const Area = require('./Model');

// [POST] -> api/area/create
module.exports.POST_CreateArea = async (req, res, next) => {
    return await Area.create({ ...req.body })
        .then((area) => {
            return res.status(200).json({
                success: true,
                area,
                msg: `Đã tạo thành công khu vực ${req.body.area_name}`,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Tạo loại khu vực thất bại: ' + err,
            });
        });
};

// [GET] -> api/area/event/:event_id
module.exports.GET_GetAreaByEventId = async (req, res, next) => {
    const { event_id } = req.params;
    return await Area.find({ event: event_id })
        .lean()
        .then((areas) => {
            if (!areas) {
                return res.status(404).json({
                    success: false,
                    msg: 'Không tìm thấy khu vực tương ứng',
                });
            }

            return res.status(200).json({
                success: true,
                areas,
                msg: 'Tìm kiếm khu vực thành công',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Tìm kiếm khu vực thất bại: ' + err,
            });
        });
};

// [PUT] -> api/area/update/:area_id
module.exports.PUT_UpdateArea = async (req, res, next) => {
    const { area_id } = req.params;
    return await Area.findByIdAndUpdate(area_id, { $set: { ...req.body } }, { returnOriginal: false })
        .then((area) => {
            return res.status(200).json({
                success: true,
                area,
                msg: 'Cập nhật khu vực thành công',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Cập nhật khu vực thất bại: ' + err,
            });
        });
};
// [DELETE] -> api/area/delete/:area_id
module.exports.DELETE_RemoveArea = async (req, res, next) => {
    const { area_id } = req.params;

    return await Area.findByIdAndDelete(area_id)
        .then((area) => {
            return res.status(200).json({
                success: true,
                area,
                msg: 'Xóa khu vực thành công',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                msg: 'Xóa khu vực thất bại: ' + err,
            });
        });
};
