const { User, Thought  } = require('../models');


const userController = {
    //Get all users data
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
            if(!dbUserData){
                res.json({ message: 'User got deleted successfully' });
                return;
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        
    },
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