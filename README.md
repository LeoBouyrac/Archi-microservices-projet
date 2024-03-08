# Archi-microservices-projet

README.md pour le projet de microservice du jeu Motus
Introduction
Ce projet est une application web développée en utilisant une architecture de microservices pour mettre en œuvre un jeu Motus. Il comprend un système de score, un système d'authentification, et est conçu pour la collaboration d'équipe. L'objectif est de fournir un exemple complet de microservices en action, mettant en valeur les pratiques de développement et architecturales.

Structure du projet
L'application est structurée autour de trois composants principaux :

Service de jeu (app.js) : Gère la logique du jeu, les sessions utilisateur et l'authentification.
Service de notation (scoreApp.js) : Gère de manière indépendante les scores des utilisateurs, y compris le stockage et la récupération.
Interface utilisateur : Composée de pages HTML (index.html, login.html, register.html, score.html) pour interagir avec l'utilisateur.

Configuration et Installation
Assurez-vous que Node.js est installé sur votre système.
Clonez le projet depuis GitHub.
Accédez au répertoire du projet et installez les dépendances en utilisant npm install.
Démarrez les services en exécutant node app.js et node scoreApp.js dans des fenêtres de terminal séparées.
Tapez http://localhost:3000/register dans l’url pour pouvoir créer un compte, puis se login au compte
Vous pouvez ensuite jouer au jeu.

Utilisation
Pour jouer au jeu, visitez la page principale (index.html) et saisissez votre proposition pour le mot du jour.
Les scores de la session sont directement affichés en dessous du jeu.
Ensuite vous pouvez  accédez à la page des scores (score.html) après vous être connecté et voir les scores cumulés sur le compte joueur.
Pour gérer votre compte, utilisez les pages de connexion (login.html) et d'inscription (register.html).

Diagramme d'architecture
Ci-dessous se trouve un diagramme d'architecture simplifié illustrant les interactions entre les composants :

    User[Utilisateur] -->|Connexion/Inscription| ServiceJeu[Service de Jeu];
    User -->|Jouer & Soumettre un Mot| ServiceJeu;
    ServiceJeu -->|Vérifier l'Utilisateur & Gérer la Logique du Jeu| Auth[Système d'Authentification];
    ServiceJeu -->|Demande/Mise à Jour du Score| ServiceNotation[Service de Notation];
    ServiceNotation -->|Stockage & Gestion des Scores| BD[Base de Données/Fichier];
    ServiceJeu -->|Servir les Pages| UI[Interface Utilisateur];
    UI -->|Afficher le Jeu, les Scores, l'Authentification| Utilisateur;




Améliorations Futures :

Mise en place de fonctionnalités de jeu supplémentaires (par exemple, classements, défis quotidiens).
Amélioration des mesures de sécurité pour l'authentification des utilisateurs.
Migration du stockage des scores vers une solution de base de données évolutive.
