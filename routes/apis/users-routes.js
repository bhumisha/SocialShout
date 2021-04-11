const { getAllUsers,getUserById, createUser,updateUser,deleteUser,createFriend,deleteFriend} = require('../../controllers/users-controller');
const router = require('express').Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createUser)


router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)

router
.route('/:userId/friends/:friendId')
.post(createFriend)
.delete(deleteFriend)


module.exports = router;