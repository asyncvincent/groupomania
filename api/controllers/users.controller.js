require("dotenv").config();
const bcrypt = require("bcryptjs");
const UserSchema = require("../models/users.model");
const PostsSchema = require("../models/posts.model");

module.exports = {
    // Get one user by username
    getUserByUsername: (req, res) => {
        UserSchema.findOne({
                username: req.params.username,
            })
            .select("-password")
            .then((user) => {
                if (!user) {
                    return res.status(404).json({
                        code: 404,
                        status: "error",
                        typeof: "user_not_found",
                        message: "Aucun utilisateur trouvé",
                    });
                }
                res.status(200).json({
                    code: 200,
                    status: "success",
                    typeof: "user_found",
                    results: user,
                });
            })
            .catch((err) =>
                res.status(404).json({
                    code: 404,
                    status: "error",
                    typeof: "user_not_found",
                    message: "Aucun utilisateur trouvé",
                })
            );
    },

    // Update user
    updateUser: (req, res) => {
        const { username, firstname, lastname, bio, email, password } = req.body;

        if (!req.file) {
            avatar = `uploads/default-avatar.png`;
        } else {
            avatar = `uploads/${req.file.filename}`;
        }

        UserSchema.findOne({
            email: email,
        }).then((user) => {
            if (user) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    typeof: "email_already_exists",
                    message: `Cette adresse email est déjà utilisée`,
                });
            } else {
                const newUser = new UserSchema({
                    username: username.toLowerCase().replace(/\s/g, ""),
                    firstname: firstname.toLowerCase().replace(/\s/g, ""),
                    lastname: lastname.toLowerCase().replace(/\s/g, ""),
                    bio: bio,
                    email: email.toLowerCase().replace(/\s/g, ""),
                    password: password,
                    avatar: "/" + avatar,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => res.json(user))
                            .catch((err) => {
                                res.status(500).json({
                                    code: 500,
                                    status: "error",
                                    typeof: "internal_server_error",
                                    message: `Une erreur est survenue lors de l'enregistrement de l'utilisateur`,
                                });
                            });
                    });
                });
            }
        });
    },

    // Delete user and all his posts
    deleteUser: (req, res) => {
        UserSchema.findOneAndDelete({
                _id: req.params.id,
            })
            .then(() => {
                PostsSchema.deleteMany({
                        author: req.params.id,
                    })
                    .then(() => {
                        res.status(200).json({
                            code: 200,
                            status: "success",
                            typeof: "user_deleted",
                            message: `L'utilisateur a bien été supprimé`,
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            code: 500,
                            status: "error",
                            typeof: "internal_server_error",
                            message: `Une erreur est survenue lors de la suppression des posts`,
                        });
                    });

                PostsSchema.find({
                    likes: { $elemMatch: { user: req.params.id } },
                }).then((posts) => {
                    posts.forEach((post) => {
                        const removeIndex = post.likes
                            .map((item) => item.user.toString())
                            .indexOf(req.params.id);
                        post.likes.splice(removeIndex, 1);
                        post.save();
                    });
                });
            })
            .catch((err) =>
                res.status(404).json({
                    code: 404,
                    status: "error",
                    typeof: "user_not_found",
                    message: `L'utilisateur n'a pas pu être supprimé`,
                })
            );
    },
};