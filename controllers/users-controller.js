const { User, Thought  } = require('../models');


const userController = {
    //Get all users data along with Users thoughts and friends.
    getAllUsers(req,res){
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
          })
          .populate({
            path: 'friends',
            select: '-__v'
          })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => {
            return res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    //Get single users by Id data along with Users thoughts and friends.
    getUserById({params},res){
        User.findById(params.id)
        .populate({
            path: 'thoughts',
            select: '-__v'
          })
          .populate({
            path: 'friends',
            select: '-__v'
          })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        
    },

    //Create new User for user and friend
    createUser({body},res){
        User.create(body)
        .then(dbUserData => {
            return res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    //Update user 
    updateUser({params,body},res){
        User.findByIdAndUpdate(params.id,body,{new:true})
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        
    },

    //Delete user with its all thoughts.
    deleteUser({params},res){
        User.findByIdAndDelete(params.id)
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            return Thought.deleteMany({ username: dbUserData.username})
            // res.json(dbUserData);
        })
        .then(dbThought => {
            if(!dbThought){
                res.json({ message: 'User got deleted successfully' });
                return;
            }
            res.json("User and all thoughts deleted successfully")

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        
    },

    //Create Friend ( users are ready we are mapping user with another user as friends)
    createFriend({params},res){
        const { userId, friendId} = params
        User.findOneAndUpdate({_id:userId},{ $push: { friends: friendId } }, { new: true })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    //Delete Friend - means remove user's assositation with another user 
    deleteFriend({params},res){
        const { userId, friendId} = params
        User.findOneAndUpdate({_id:userId},{ $pull: { friends: friendId } }, { new: true })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No user friend found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

}

module.exports = userController;