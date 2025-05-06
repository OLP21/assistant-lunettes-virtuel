
# 👓 Assistant d'Essayage de Lunettes Virtuelles

Projet web permettant d’essayer virtuellement des lunettes à partir de la forme du visage détectée en temps réel grâce à MediaPipe. Recommande automatiquement des montures adaptées à la morphologie faciale.

## 🧠 Objectifs

- Détecter les points clés du visage en temps réel (landmarks)
- Déterminer la forme du visage (rond, ovale, carré, cœur…)
- Recommander des styles de lunettes adaptés
- Superposer des lunettes virtuelles sur la webcam (overlay en temps réel)
- Interface simple et intuitive, responsive

## 🛠️ Technologies utilisées

- **HTML/CSS/JavaScript**
- **MediaPipe FaceMesh**
- **Canvas API ou WebGL** (pour le rendu des lunettes)
- **GitHub** (gestion de version, collaboration)
- **(optionnel) TensorFlow.js** pour un futur modèle d’auto-apprentissage

## 🧩 Structure du projet

assistant-lunettes-virtuel/
├── README.md
├── /src
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── /glasses         # images des lunettes à superposer
│   └── /utils           # détection forme visage, logique de recommandation
├── /docs                # comptes rendus, cahier des charges, etc.
├── .gitignore


## 👥 Membres du projet

- **Teddy**
- **Mamor**
- **Issa**

## 🔄 Planification (8 semaines)

| Semaine | Tâches principales |
|--------|---------------------|
| 1 | Création dépôt, cahier des charges, README |
| 2 | Détection faciale avec MediaPipe |
| 3 | Détermination de la forme du visage |
| 4 | Logique de recommandation |
| 5 | Interface UI + webcam |
| 6 | Superposition lunettes |
| 7 | Tests et finalisation |
| 8 | Documentation et soutenance |

## 📄 Licence

Ce projet est sous licence MIT.

