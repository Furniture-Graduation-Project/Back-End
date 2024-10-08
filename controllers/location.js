import { StatusCodes } from "http-status-codes";
import Location from "../models/location.js";
import User from "../models/user.js";
import { locationSchema } from "../validations/location.js";

export const create = async (req, res) => {
  const userId = req.params.userId;
  const {
    street,
    city,
    state,
    postalCode,
    country,
    recipientName,
    phoneNumber,
  } = req.body;

  const { error } = locationSchema.validate(req.body);

  if (error) {
    const message = error.details.map((e) => e.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ message });
  }
  try {
    let location = await Location.findOne({ userId });

    if (!location) {
      location = new Location({
        userId,
        locations: [],
      });
    }

    location.locations.push({
      street,
      city,
      state,
      postalCode,
      country,
      recipientName,
      phoneNumber,
    });

    await location.save();

    return res.status(StatusCodes.CREATED).json({ location });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const get = async (req, res) => {
  try {
    const locations = await Location.find({}).populate({
      path: "userId",
      select: "email name",
    });
    if (locations.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Người dùng không có địa chỉ nào !" });
    }

    return res.status(StatusCodes.OK).json({ locations });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getByUserId = async (req, res) => {
  try {
    const locations = await Location.findOne({
      userId: req.params.userId,
    }).populate({
      path: "userId",
      select: "email name",
    });
    if (locations.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Người dùng không có địa chỉ nào !" });
    }

    return res.status(StatusCodes.OK).json(locations);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const update = async (req, res) => {
  const {
    userId,
    street,
    city,
    state,
    postalCode,
    country,
    recipientName,
    phoneNumber,
  } = req.body;

  const locationId = req.params.id;

  try {
    const { error } = locationSchema.validate(req.body);
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }

    let location = await Location.findOne({
      userId,
      "locations._id": locationId,
    });

    console.log(userId, locationId);

    if (!location) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Địa chỉ không tồn tại !" });
    }

    const address = location.locations.id(locationId);

    if (address) {
      address.street = street;
      address.country = country;
      address.city = city;
      address.state = state;
      address.postalCode = postalCode;
      address.recipientName = recipientName;
      address.phoneNumber = phoneNumber;

      await location.save();

      return res.status(StatusCodes.OK).json({ location });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Địa chỉ không tồn tại !" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  const { userId } = req.body;
  const locationId = req.params.id;

  try {
    let location = await Location.findOne({
      userId,
      "locations._id": locationId,
    });

    if (!location) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Địa chỉ không tồn tại !" });
    }

    location.locations = location.locations.filter(
      (loc) => loc._id.toString() !== locationId
    );

    await location.save();

    return res
      .status(StatusCodes.OK)
      .json({ location, message: "Đã xóa địa chỉ thành công !" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const removeLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.locationsId);
    if (!location) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Địa chỉ không tồn tại !" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Đã xóa địa chỉ thành công !" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
