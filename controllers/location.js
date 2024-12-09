import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import { locationSchema } from "../validations/location.js";

export const create = async (req, res) => {
  const userId = req.params.userId;
  const {
    addressName,
    firstName,
    lastName,
    phone,
    country,
    city,
    district,
    ward,
    street,
    default: isDefault,
  } = req.body;

  const { error } = locationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((e) => e.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ message });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Người dùng không tồn tại !" });
    }

    if (isDefault) {
      user.locations.forEach((location) => {
        location.default = false;
      });
    }

    user.locations.push({
      addressName,
      firstName,
      lastName,
      phone,
      country,
      city,
      district,
      ward,
      street,
      default: isDefault || false,
    });

    await user.save();

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Đã thêm địa chỉ thành công !", location: req.body });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Người dùng không tồn tại !" });
    }

    return res.status(StatusCodes.OK).json({ locations: user.locations });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getOne = async (req, res) => {
  const userId = req.params.userId;
  const { locationId } = req.query;
  try {
    const user = await User.findOne({
      _id: userId,
      locations: { $elemMatch: { _id: locationId } },
    });

    if (!user) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Người dùng không tồn tại !" });
    }

    const location = user.locations.id(locationId);

    return res.status(StatusCodes.OK).json({ location });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const update = async (req, res) => {
  const userId = req.params.userId;
  const { locationId } = req.query;

  try {
    const user = await User.findOne({
      _id: userId,
      locations: { $elemMatch: { _id: locationId } },
    });

    if (!user) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Người dùng không tồn tại !" });
    }

    const location = user.locations.id(locationId);

    for (let key in req.body) {
      location[key] = req.body[key];
    }

    if (req.body.default) {
      user.locations.forEach((location) => {
        if (location._id.toString() === locationId) {
          location.default = true;
        } else {
          location.default = false;
        }
      });
    }

    await user.save();

    return res.status(StatusCodes.OK).json({ location });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  const userId = req.params.userId;
  const { locationId } = req.query;

  try {
    const user = await User.findOne({
      _id: userId,
      locations: { $elemMatch: { _id: locationId } },
    });

    if (!user) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Người dùng không tồn tại !" });
    }

    user.locations = user.locations.filter(
      (location) => location._id.toString() !== locationId
    );

    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Đã xóa địa chỉ thành công !" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const changeDefaultLocation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { locationId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Người dùng không tồn tại !" });
    }

    user.locations.forEach((location) => {
      if (location._id.toString() === locationId) {
        location.default = true;
      } else {
        location.default = false;
      }
    });

    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Đã cập nhật địa chỉ mặc định thành công !" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
