import { Request, Response } from "express";
import { User, Thought } from "../models/index.js";

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbUserData = await User.find().select("-__v");

    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dbUserData = await User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("friends")
      .populate("thoughts");

    if (!dbUserData) {
      res.status(404).json({ message: "No user with this id!" });
    }

    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dbUserData = await User.create(req.body);
    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dbUserData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!dbUserData) {
      res.status(404).json({ message: "No user with this id!" });
    }

    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dbUserData = await User.findOneAndDelete({ _id: req.params.userId });

    if (!dbUserData) {
      res.status(404).json({ message: "No user with this id!" });
    }

    await Thought.deleteMany({ _id: { $in: dbUserData?.thoughts } });
    res.json({ message: "User and associated thoughts deleted!" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const addFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbUserData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );

    if (!dbUserData) {
      res.status(404).json({ message: "No user with this id!" });
    }

    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const removeFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dbUserData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );

    if (!dbUserData) {
      res.status(404).json({ message: "No user with this id!" });
    }

    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
