const {Schema , model ,Types} = require("mongoose"); 
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
      reactionBody: {
        type: String,
        trim :true,
        require:'Please give your reaction',
        min: 1,
        max: 280
      },
      username:{
        type: String,
        required:"Username is Mandatory"
    },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      }
    });

const ThoughtSchema = new Schema({
    thoughtText: {
      type: String,
      trim :true,
      require:'Please give your thought',
      min: 1,
      max: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    username:{
        type: String,
        required:"Username is Mandatory"

    },
    reactions: [ReactionSchema]
  },
  {
      toJSON: {
        getters: true,
        virtuals:true
      },
      id: false
 });
  
// get total count of comments and replies on retrieval
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);
  
module.exports = Thought;
  