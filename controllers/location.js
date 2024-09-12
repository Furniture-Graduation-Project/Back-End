import { StatusCodes } from 'http-status-codes';
import Location from '../models/location.js';
import { locationSchema } from '../validations/location.js';

const LocationController = {
  create: async (req, res) => {
    const {
      street,
      city,
      state,
      postalCode,
      country,
      recipientName,
      phoneNumber,
      userId,
    } = req.body;

    const { value, error } = locationSchema.validate(
      {
        street,
        city,
        state,
        postalCode,
        country,
        recipientName,
        phoneNumber,
        userId,
      },
      { abortEarly: false, stripUnknown: true },
    );

    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }

    try {
      let location = await Location.findOne(value.userId);

      if (!location) {
        location = new Location({
          userId: value.userId,
          locations: [],
        });
      }

      location.locations.push({
        street: value.street,
        city: value.city,
        state: value.state,
        postalCode: value.postalCode,
        country: value.country,
        recipientName: value.recipientName,
        phoneNumber: value.phoneNumber,
      });

      await location.save();

      return res.status(StatusCodes.CREATED).json({ location });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  get: async (req, res) => {
    const { userId } = req.params;
    try {
      const locations = await Location.find({
        userId,
      }).populate({
        path: 'userId',
        select: 'email name',
      });

      if (locations.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Người dùng không có địa chỉ nào !' });
      }

      return res.status(StatusCodes.OK).json({ locations });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  update: async (req, res) => {
    const {
      userId,
      locationId,
      street,
      city,
      state,
      postalCode,
      country,
      recipientName,
      phoneNumber,
    } = req.body;

    try {
      const { value, error } = locationSchema.validate(
        {
          userId,
          locationId,
          street,
          city,
          state,
          postalCode,
          country,
          recipientName,
          phoneNumber,
        },
        { abortEarly: false, stripUnknown: true },
      );
      if (error) {
        const message = error.details.map((e) => e.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ message });
      }

      let location = await Location.findOne({
        userId: value.userId,
        'locations._id': value.locationId,
      });

      if (!location) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Địa chỉ không tồn tại !' });
      }

      const address = location.locations.id(value.locationId);

      if (address) {
        address.street = value.street;
        address.city = value.city;
        address.state = value.state;
        address.postalCode = value.postalCode;
        address.country = value.country;
        address.recipientName = value.recipientName;
        address.phoneNumber = value.phoneNumber;

        await location.save();

        return res.status(StatusCodes.OK).json({ location });
      } else {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Địa chỉ không tồn tại !' });
      }
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    const { userId, locationId } = req.body;

    if (!userId || !locationId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy địa địa chỉ' });
    }

    try {
      let location = await Location.findOne({
        userId,
        'locations._id': locationId,
      });

      if (!location) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Địa chỉ không tồn tại !' });
      }

      location.locations = location.locations.filter(
        (loc) => loc._id.toString() !== locationId,
      );

      await location.save();

      return res
        .status(StatusCodes.OK)
        .json({ location, message: 'Đã xóa địa chỉ thành công !' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  removeLocation: async (req, res) => {
    try {
      const location = await Location.findByIdAndDelete(req.params.id);
      if (!location) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Địa chỉ không tồn tại !' });
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Đã xóa địa chỉ thành công !' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
};

export default LocationController;
