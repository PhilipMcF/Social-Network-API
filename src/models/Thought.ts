import { Schema, Types, model, type Document } from 'mongoose';
import { format } from 'date-fns';

interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions: Schema.Types.ObjectId[];
}

interface IReactions extends Document {
    reactionID: Schema.Types.ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date;
}

const reactionSchema = new Schema<IReactions>(
    {
        reactionID: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date, 
            default: new Date(),
            // NEEDS GETTER METHOD TO FORMAT THE TIMESTAMP ON QUERY
        }
    },
    {
        toJSON: {
            getters: true,
        },
        toObject: {
            getters: true,
        }
    }
);

const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // NEEDS GETTER METHOD TO FORMAT THE TIMESTAMP ON QUERY
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema], 
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

thoughtSchema.virtual()

const Thought = model('Thought', thoughtSchema);

export default Thought;