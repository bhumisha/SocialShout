const {Schema , model ,Types} = require('mongoose');


const UserSchema = new Schema({
    username:{
        type:String,
        trim:true,
        unique: true,
        required: 'Username is Mandatory'
      },
      email: {
        type: String,
        unique: true,
        required:'email is Mandatory',
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
      },
      thoughts:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
      ],
      friends:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
      ]
},
{
    // Set the `id` as false
    toJSON:{
    virtuals:true,
    getter:true
    },
    id: false
});

// get total count of friends 
UserSchema.virtual('friendsCount').get(function() {
        return this.friends.length;     
});

// create the user model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;
    
