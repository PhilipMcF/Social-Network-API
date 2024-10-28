import { User, Thought} from '../models/index.js';
import { Request, Response } from 'express';

export const getThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.status(200).json(thoughts);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const getSingleThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOne( { _id: req.params.thoughtId }).select('-__v');

        if (!thought){
            res.status(404).json({ message: 'No thought with that ID' });
            return;
        }

        res.status(200).json(thought);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

// thought will have the username and userId ; will have to be pushed to user thoughts array
export const createThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id } },
            { new: true }
        );

        if(!user){
            res.status(404).json({ message: 'Thought created, but no user found with that ID!' });
            return;
        }

        res.status(200).json(thought);
        return;
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const updateThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought){
            res.status(404).json({ message: 'No thought with that id' });
            return;
        }

        res.status(200).json(thought);
        return;
    }
    catch (err) {
        res.status(500).json(err);
    }
}

// delete thought by id AND remove from user thoughts array
export const deleteThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought){
            res.status(404).json({ message: 'No thought with that id' });
            return;
        }

        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        if (!user){
            res.status(404).json({ message: 'Thought deleted, but no user found with that thought ID!' });
            return;
        }

        res.status(200).json({ message: 'Thought deleted & removed from users thoughts!' });
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const addReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )

        if (!thought){ 
            res.status(404).json({ message: 'No thought with this id!' });
            return;
        }

        res.status(200).json(thought);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const removeReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionID: req.params.reactionId } } },
            { runValidators: true, new: true }
        )

        if (!thought){
            res.status(404).json({ message: 'No thought with this id!' });
            return;
        }

        res.status(200).json(thought);
    }
    catch (err) {
        res.status(500).json(err);
    }
}