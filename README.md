# Groupomania

_Créez un réseau social d’entreprise_

## Déploiement du projet

### Prérequis

- Disposé de **NodeJS** version 16 ou supérieure
- Disposé de **NPM** version 8 ou supérieure

### Mise en place de la base de données MongoDB

- Télécharger et installer [MongoDB Compass version 1.33.1](https://www.mongodb.com/try/download/compass)
- Lancer MongoDB Compass et se connecter à l'adresse : _mongodb://localhost:27017_
- Créer une nouvelle base de données dans MongoDB Compass nommée **groupomania** avec une collection nommée **users** et une deuxième nommée **posts**
- Importer les données du ficher **users.json** dans la collection **users** et les données du fichier **posts.json** dans la collection **posts**

_(le mot de passe par default des utilisateurs est 123456)_

### Déploiement de l'API

#### À la racine du projet, effectuer les commandes ↓

```bash
  cd api
  npm install
  npm start
```

### Déploiement de l'APP

#### À la racine du projet, effectuer les commandes ↓

```bash
  cd app
  npm install
  npm start
```

### Accédez au projet

Accédez à l'adresse: http://localhost:3000
