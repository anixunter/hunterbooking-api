import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
} from "../controllers/room.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/createRoom", verifyAdmin, createRoom);
//UPDATE
router.put("/availability/:roomNumberId", updateRoomAvailability);
router.put("/:id", verifyAdmin, updateRoom);
//DELETE
router.put("/delete/:roomId", verifyAdmin, deleteRoom);
//GET
router.get("/:id", getRoom);
//GET ALL
router.get("/", getRooms);

export default router;
