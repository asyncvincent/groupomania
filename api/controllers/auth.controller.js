require('dotenv').config();
const bcrypt = require('bcryptjs');
const UserSchema = require('../models/users.model');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const tokenList = {}

module.exports = {
    login: (req, res) => {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'missing_fields',
                message: `Veuillez remplir tous les champs`
            });
        }

        UserSchema.findOne({ email })
            .then(user => {

                if (!user) {
                    return res.status(400).json({
                        code: 400,
                        status: 'error',
                        typeof: 'email_not_found',
                        message: `Identifiants incorrects`
                    });
                }

                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                avatar: user.avatar,
                                isAdmin: user.isAdmin
                            };
                            const access = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
                            const refresh = jwt.sign(payload, randtoken.uid(256), { expiresIn: 86400 });
                            const response = {
                                access: access,
                                refresh: refresh
                            };
                            tokenList[refresh] = response;
                            res.status(200).json(response);
                        } else {
                            return res.status(400).json({
                                code: 400,
                                status: 'error',
                                typeof: 'incorrect_password',
                                message: `Identifiants incorrects`
                            });
                        }
                    });
            });
    },

    // Register user
    register: (req, res) => {
        let { username, firstname, lastname, email, password } = req.body;
        let avatar = req.file ? req.file.filename : null;

        if (!username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'username_invalid',
                message: `Le nom d'utilisateur doit contenir entre 3 et 20 caractères et ne doit pas contenir de caractères spéciaux`
            });
        } else if (!username) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'missing_fields_username',
                message: 'Veuillez choisir un nom d\'utilisateur'
            });
        } else if (!firstname) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'missing_fields_firstname',
                message: 'Veuillez indiquer votre prénom'
            });
        } else if (!lastname) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'missing_fields_lastname',
                message: 'Veuillez indiquer votre nom'
            });
        } else if (!password) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'missing_fields_password',
                message: 'Veuillez choisir un mot de passe'
            });
        } else if (!email) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'missing_fields_email',
                message: 'Veuillez indiquer votre email'
            });
        } else if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'email_invalid',
                message: 'Veuillez indiquer un email valide'
            });
        } else if (password.length < 6) {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'password_invalid',
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            });
        }

        if (!req.file) {
            avatar = '';
        } else {
            avatar = `/uploads/avatar/${req.file.filename}`;
        }

        UserSchema.findOne({
            $or: [{
                username: username
            }, {
                email: email
            }]
        })
            .then(user => {
                if (user) {
                    if (user.username === username) {
                        return res.status(400).json({
                            code: 400,
                            status: 'error',
                            typeof: 'username_already_exists',
                            message: 'Ce nom d\'utilisateur est déjà utilisé'
                        });
                    } else if (user.email === email) {
                        return res.status(400).json({
                            code: 400,
                            status: 'error',
                            typeof: 'email_already_exists',
                            message: 'Cet email est déjà utilisé'
                        });
                    }
                } else {
                    const newUser = new UserSchema({
                        username: username.toLowerCase().replace(/\s/g, ''),
                        firstname: firstname.toLowerCase().replace(/\s/g, ''),
                        lastname: lastname.toLowerCase().replace(/\s/g, ''),
                        email: email.toLowerCase().replace(/\s/g, ''),
                        password: password,
                        avatar: avatar
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    const payload = {
                                        id: user.id,
                                        username: user.username,
                                        email: user.email,
                                        avatar: user.avatar,
                                        isAdmin: user.isAdmin
                                    };
                                    const access = jwt.sign(payload, process.env.JWT_SECRET, {
                                        expiresIn: 3600 // 1 hour
                                    });
                                    const refresh = jwt.sign(payload, randtoken.uid(256), {
                                        expiresIn: 86400 // 24 hours
                                    });
                                    const response = {
                                        access: access,
                                        refresh: refresh
                                    };
                                    tokenList[refresh] = response;
                                    res.status(201).json(response);
                                })
                                .catch(err => {
                                    res.status(400).json({
                                        code: 400,
                                        status: 'error',
                                        typeof: 'error',
                                        message: 'Une erreur est survenue'
                                    });
                                });
                        });
                    });
                }
            });
    },

    // Refresh token
    refreshToken: (req, res) => {
        let refresh = req.headers.authorization.split(' ')[1];
        if (refresh && (refresh in tokenList)) {
            const payload = jwt.decode(refresh);
            UserSchema.findById(payload.id)
                .then(user => {
                    if (user) {
                        const payload = {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            avatar: user.avatar,
                            isAdmin: user.isAdmin
                        };
                        const access = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
                        const refresh = jwt.sign(payload, randtoken.uid(256), { expiresIn: 86400 });
                        const response = {
                            access: access,
                            refresh: refresh
                        };
                        tokenList[refresh] = response;
                        res.status(200).json(response);
                    } else {
                        res.status(400).json({
                            code: 400,
                            status: 'error',
                            typeof: 'user_not_found',
                            message: `Utilisateur introuvable`
                        });
                    }
                });
        } else {
            return res.status(400).json({
                code: 400,
                status: 'error',
                typeof: 'invalid_token',
                message: 'Token invalide'
            });
        }
    },
};