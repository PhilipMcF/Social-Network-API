import User from '../models/User.js';
import { Request, Response } from 'express';

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const getSingleUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: req.params.userId }).select('-__v'); //may need to be changed

        if(!user){
            res.status(404).json({ message: 'No user with that ID' });
        }
        else { 
            res.json(user);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const userData = await User.create(req.body);
        res.status(201).json(userData);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!user){
            res.status(404).json({ message: 'No user with this ID' })
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (err) {
        res.status(500).json(err);

    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });

        if(!user){
            res.status(404).json({ message: 'No user with that ID' });
        }
        else {
            res.status(200).json({ message: 'User deleted' });
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const addFriend = async (req: Request, res: Response) => {
    try {
        const user1 = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body.friendId } },  //may need to be changed
            { runValidators: true, new: true }
        );

        const user2 = await User.findOneAndUpdate(
            { _id: req.body.friendId },
            { $addToSet: { friends: req.params.userId } },  //may need to be changed
            { runValidators: true, new: true }
        )

        if (!user1 || !user2){
            res.status(404).json({ message: 'Invalid ids received.' });
        }
        else {
            res.status(200).json({ message: 'Friend added' });
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const removeFriend = async (req: Request, res: Response) => {
    try {
        const user1 = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },   //may need to be changed
            { runValidators: true, new: true }
        );

        const user2 = await User.findOneAndUpdate(
            { _id: req.params.friendId },
            { $pull: { friends: req.params.userId } },   //may need to be changed
            { runValidators: true, new: true }
        )

        if (!user1 || !user2){
            res.status(404).json({ message: 'No user with this ID' });
        }
        else {
            res.status(200).json({ message: 'Friend removed' });
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}