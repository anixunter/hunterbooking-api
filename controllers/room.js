import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

import mongoose from "mongoose";

export const createRoom = async (req, res, next) => {
  const { newRoom } = req.body;
  const { hotels, ...roomDetails } = newRoom;
  try {
    const newRoom = new Room(roomDetails);
    const savedRoom = await newRoom.save();
    await Promise.all(
      hotels.map((hotel) =>
        Hotel.findByIdAndUpdate(hotel, {
          $push: { rooms: savedRoom._id },
        })
      )
    );
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.roomNumberId },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  const { hotelIds } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Room.findByIdAndDelete(req.params.roomId).session(session);
    await Promise.all(
      hotelIds.map((hotelId) =>
        Hotel.findByIdAndUpdate(hotelId, {
          $pull: { rooms: req.params.roomId },
        }).session(session)
      )
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
