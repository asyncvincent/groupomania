require("dotenv").config();
const PostsSchema = require("../models/posts.model");

module.exports = {

    // Get all posts
    getAllPosts: (req, res) => {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const data = {};
        PostsSchema.countDocuments()
            .then((count) => {
                data.totalPages = Math.ceil(count / limit);
                data.totalPosts = count;
                data.nextTotalcount = data.totalPages - page;
            });
        PostsSchema.find()
            .sort({ createAt: -1 })
            .limit(limit)
            .skip(limit * page - limit)
            .then((posts) => {
                if (!posts) {
                    return res.status(404).json({
                        code: 404,
                        status: "error",
                        typeof: "post_not_found",
                        message: "Aucun post trouvé",
                    });
                }
                data.limit = limit;
                data.page = page;
                data.firstPage = page === 1;
                data.lastPage = data.nextTotalcount === 0;
                data.posts = posts;
                PostsSchema.populate(
                    posts, { path: "author", select: "-password" },
                    (err, posts) => {
                        if (err) {
                            return res.status(404).json({
                                code: 404,
                                status: "error",
                                typeof: "post_not_found_by_id",
                                message: "Aucun post trouvé avec cet id",
                            });
                        }
                        return res.status(200).json(data);
                    }
                );
            })
            .catch((err) => {
                return res.status(500).json({
                    code: 500,
                    status: "error",
                    typeof: "server_error",
                    message: "Erreur serveur",
                });
            });
    },

    // Get one post by id
    getPostById: (req, res) => {
        console.log(req.params.id);
        PostsSchema.findOne({
                _id: req.params.id,
            })
            .then((posts) => res.status(200).json(posts))
            .catch((err) =>
                res.status(404).json({
                    code: 404,
                    status: "error",
                    typeof: "post_not_found_by_id",
                    message: "Aucun post trouvé avec cet ID",
                })
            );
    },

    // Create post
    createPost: (req, res) => {
        let content = req.body.content;
        let author = req.decoded.id;
        let image = req.file ? req.file.filename : null;

        if (content.length > 300) {
            return res.status(400).json({
                status: 400,
                status: "error",
                typeof: "post_content_too_long",
                message: "Le contenu du post ne doit pas dépasser 300 caractères",
            });
        }

        if (!req.file) {
            image = "";
        } else {
            image = `uploads/images/${req.file.filename}`;
        }

        if (!req.body.content && !image) {
            return res.status(400).json({
                code: 400,
                status: "error",
                typeof: "post_content_empty",
                message: "Le contenu du post est vide",
            });
        }

        const newPost = new PostsSchema({
            content: content,
            author: author,
            image: image,
        });

        newPost
            .save()
            .then((post) =>
                res.status(201).json({
                    code: 201,
                    status: "success",
                    typeof: "post_created",
                    results: post,
                })
            )
            .catch((err) => {
                res.status(400).json({
                    code: 400,
                    status: "error",
                    typeof: "internal_error",
                    message: "Une erreur est survenue",
                });
            });
    },

    // Update post
    updatePost: (req, res) => {
        PostsSchema.findOne({
            _id: req.params.id,
        }).then((post) => {
            if (!post) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    typeof: "post_not_found_by_id",
                    message: "Aucun post trouvé avec cet ID",
                });
            }
            if (
                post.author.toString() !== req.decoded.id &&
                req.decoded.isAdmin === false
            ) {
                return res.status(401).json({
                    code: 401,
                    status: "error",
                    typeof: "unauthorized",
                    message: "Vous n'êtes pas autorisé à modifier ce post",
                });
            } else {
                if (req.body.content.length > 300) {
                    return res.status(400).json({
                        code: 400,
                        status: "error",
                        typeof: "post_content_too_long",
                        message: "Le contenu du post ne doit pas dépasser 300 caractères",
                    });
                }
                post.content = req.body.content;
                if (!req.file) {
                    post.image = post.image;
                } else {
                    post.image = `uploads/images/${req.file.filename}`;
                }
                post
                    .save()
                    .then((post) =>
                        res.status(200).json({
                            code: 200,
                            status: "success",
                            typeof: "post_updated",
                            results: post,
                        })
                    )
                    .catch((err) => {
                        res.status(400).json({
                            code: 400,
                            status: "error",
                            typeof: "internal_error",
                            message: "Une erreur est survenue",
                        });
                    });
            }
        });
    },

    // Delete post
    deletePost: (req, res) => {
        PostsSchema.findOne({
            _id: req.params.id,
        }).then((post) => {
            if (!post) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    typeof: "post_not_found_by_id",
                    message: "Aucun post trouvé avec cet ID",
                });
            }
            if (
                post.author.toString() !== req.decoded.id &&
                req.decoded.isAdmin === false
            ) {
                return res.status(401).json({
                    code: 401,
                    status: "error",
                    typeof: "unauthorized",
                    message: "Vous n'êtes pas autorisé à supprimer ce post",
                });
            } else {
                post.remove().then(() =>
                    res.json({
                        success: true,
                    })
                );
            }
        });
    },

    // Like post
    likePost: (req, res) => {
        PostsSchema.findOne({
            _id: req.params.id,
        }).then((post) => {
            if (
                post.likes.filter((like) => like.user.toString() === req.decoded.id)
                .length > 0
            ) {
                const removeIndex = post.likes
                    .map((like) => like.user.toString())
                    .indexOf(req.decoded.id);
                post.likes.splice(removeIndex, 1);
                post
                    .save()
                    .then((post) =>
                        res.status(200).json({
                            code: 200,
                            status: "success",
                            typeof: "like_deleted",
                        })
                    )
                    .catch((err) => {
                        res.status(400).json({
                            code: 400,
                            status: "error",
                            typeof: "internal_error",
                            message: "Une erreur est survenue",
                        });
                    });
            } else {
                post.likes.unshift({
                    user: req.decoded.id,
                });
                post
                    .save()
                    .then((post) => res.json(post))
                    .catch((err) => {
                        res.status(400).json({
                            code: 400,
                            status: "error",
                            typeof: "internal_error",
                            message: "Une erreur est survenue",
                        });
                    });
            }
        });
    },
};