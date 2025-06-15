# 👓 Assistant d'Essayage de Lunettes Virtuelles

Projet web permettant d’essayer virtuellement des lunettes à partir de la forme du visage détectée en temps réel grâce à MediaPipe. L'application recommande automatiquement des montures adaptées à la morphologie faciale, et permet une superposition visuelle dynamique des modèles choisis.

## 🧠 Objectifs

- Détecter les points clés du visage en temps réel (landmarks) avec MediaPipe
- Déterminer automatiquement la forme du visage (rond, ovale, carré, cœur…)
- Recommander des styles de lunettes selon la forme du visage
- Superposer des lunettes en PNG avec transparence sur le visage via webcam
- Fournir une interface web simple, réactive et fluide

## 🛠️ Technologies utilisées

- **React** + **Vite** pour le frontend
- **MediaPipe FaceMesh** (détection des points du visage)
- **styled-components** (thématisation)
- **Canvas API** pour l’overlay des lunettes
- **GitHub** (versioning et collaboration)
- (optionnel) **TensorFlow.js** pour de futures fonctionnalités apprenantes

## 🧩 Structure du projet

assistant-lunettes-virtuel/
├── README.md
├── .gitignore
├── /src
│ ├── assets/ # logos, icônes
│ ├── lunettes/ # lunettes PNG
│ ├── components/ # composants UI réutilisables
│ ├── pages/ # pages principales (Home, Capture, Quiz, etc.)
│ ├── styles/ # GlobalStyle.js, theme.js
│ ├── utils/ # logique de détection, recommandations
│ ├── App.jsx
│ └── main.jsx
├── /public/
├── /docs/ # cahier des charges, documentation
└── package.json


## 🐟 Configuration de l'API

Le serveur backend **nécessite** une variable d'environnement `OPENAI_API_KEY`
pour contacter l'API d'OpenAI et générer les recommandations. Créez un fichier
`.env` dans le répertoire `backend/` et ajoutez votre clé :

```bash
OPENAI_API_KEY=<votre_clé_OpenAI>
```

Redémarrez ensuite le serveur backend pour prendre en compte la clé.

Si vous utilisez MongoDB, importez les données de lunettes avant de démarrer :

```bash
cd backend
npm run seed
```



## 👥 Membres du projet

- **Teddy** (Frontend & Logiciel IA)
- **Mamor** (Intégration webcam, UI)
- **Issa** (Tests, intégration, déploiement)

## 🔄 Planification (22 avril – 15 juin 2025)

| Semaine | Dates              | Tâches principales                                                            |
|--------:|--------------------|------------------------------------------------------------------------------|
| 1       | 22 – 28 avril       | Création du dépôt GitHub, maquettes, README, choix techno, structure projet |
| 2       | 29 avril – 5 mai    | Webcam + upload image, base interface React                                 |
| 3       | 6 – 12 mai          | Détection faciale MediaPipe                                                 |
| 4       | 13 – 19 mai         | Superposition lunettes PNG (Canvas / overlay)                               |
| 5       | 20 – 26 mai         | Galerie de lunettes cliquable, choix dynamique, amélioration UI             |
| 6       | 27 mai – 2 juin     | Tests fonctionnels, amélioration précision, gestion erreurs, responsiveness |
| 7       | 3 – 9 juin          | Déploiement (GitHub Pages / Vercel), finalisation des composants            |
| 8       | 10 – 15 juin        | Soutenance, slides, démonstration, documentation finale                     |

## 📄 Licence

Ce projet est sous licence MIT.
