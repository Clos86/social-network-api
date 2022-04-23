const { User, Thought } = require("../models");

const userController = {
  // GET /api/users
  getAllUsers: (req, res) => {
    User.find({})
      .populate({ path: "thoughts" })
      .populate({ path: "friends" })
      .populate({
        path: "friends",
        populate: {
          path: "friends",
        },
      })
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // GET /api/users/:id
  getUserById: (req, res) => {
    User.findById(req.params.id)
      .populate({ path: "thoughts" })
      .populate({
        path: "friends",
        populate: {
          path: "thoughts",
        },
      })
      .populate({
        path: "friends",
        populate: {
          path: "friends",
        },
      })
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: "User not found" });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // POST /api/users
  createUser: (req, res) => {
    User.create(req.body)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // PUT /api/users/:id
  updateUser: (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate({ path: "thoughts" })
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: "User not found" });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // DELETE /api/users/:id
  deleteUser: (req, res) => {
    User.findOne({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: "User not found" });
          return;
        }
        // delete user's thoughts
        Thought.deleteMany({ _id: { $in: user.thoughts } }).then(() => {
          user.remove();
          res.json(user);
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // add friend to friends list
  addFriend: (req, res) => {
    User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          friends: req.params.friendId,
        },
      },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: "User not found" });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // remove friend from friends list
  removeFriend: (req, res) => {
    User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          friends: req.params.friendId,
        },
      },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: "User not found" });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
};

module.exports = userController;