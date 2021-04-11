const { User , Thought } = require('../models');

const thoughtController = {
    getAllThoughts(req,res){
        Thought.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtsData => {
            return res.json(dbThoughtsData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },
    getThoughtById({params},res){
        Thought.findById(params.id)
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtsData => {
            if(!dbThoughtsData){
                res.status(404).json({ message: 'No thoughts found with this id!' });
                return;
            }
            return res.json(dbThoughtsData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },
    createThought({body},res){

        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                {$push : {thoughts : _id}},
                {new:true}
                );
          })
        .then(dbUserdata => res.json(dbUserdata))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },
    updateThought({params,body},res){
        Thought.findByIdAndUpdate(params.id,body,{new:true})
        .then(dbThoughtsData => {
            if(!dbThoughtsData){
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        
    },
    deleteThought({params},res){
        Thought.findByIdAndDelete(params.id)
        .then(dbThoughtsData => {
            if(!dbThoughtsData){
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            return User.findOneAndUpdate(
                { _id: dbThoughtsData.userId },
                { $pull: { thoughts: params.id } },
                { new: true }
              );
            // return  res.json({ message: 'Selected Thought deleted successfully ' });
        })
        .then(dbUserdata => res.json(dbUserdata))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        
    },
    addReaction({params,body},res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            {$push:{reactions:body}},
            {new :true}
        )
        .then(dbThoughtsData => {
            if(!dbThoughtsData){
                res.status(404).json({ message: 'No reaction found with this id!' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },
    deleteReaction({params},res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            { $pull: { reactions: {reactionId : params.reactionId } } }, 
            { new: true })
        .then(dbThoughtsData => {
            if(!dbThoughtsData){
                res.status(404).json({ message: 'No reaction found with this id!' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },
}

module.exports = thoughtController;