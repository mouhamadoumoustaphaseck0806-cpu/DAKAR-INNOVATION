# 🌍 Dakar Innovation Days - Plateforme Citoyenne

Une plateforme web moderne permettant aux habitants de Dakar de signaler des problèmes urbains et de proposer des solutions innovantes à la Mairie de Dakar.

## ✨ Fonctionnalités

- 📍 **Signalement géolocalisé** : Signalez les problèmes urbains avec localisation GPS
- 🗳️ **Système de vote** : Soutenez les signalements les plus importants
- 💬 **Commentaires** : Engagez-vous avec la communauté et partagez vos idées
- 📊 **Dashboard admin** : Tableau de bord avec statistiques et gestion des signalements
- 👥 **Rôles utilisateurs** : Citoyens, Agents techniques, Administrateurs
- 🎨 **Design responsif** : Mobile-first et optimisé pour tous les appareils
- 🏘️ **Filtrage par quartier** : 8 quartiers de Dakar supportés
- 📈 **Catégorisation** : Voirie, Éclairage, Déchets, Eau, Espaces verts, Sécurité

## 🛠️ Stack Technique

- **Frontend** : Next.js 14, TypeScript, Tailwind CSS, React 19
- **Backend** : API Routes Next.js
- **Base de données** : Prisma ORM + SQLite
- **Authentification** : NextAuth.js v4
- **Graphiques** : Recharts
- **UI Components** : Lucide React

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Initialiser la base de données
npm run db:push
npm run db:seed

# 3. Démarrer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📝 Utilisateurs de test

| Rôle | Email | Mot de passe |
|------|-------|------------|
| Citoyen | citoyen@test.sn | test123 |
| Agent | agent@dakar.sn | agent123 |
| Admin | admin@dakar.sn | admin123 |

## 📁 Structure du projet

```
app/                    # Pages et API routes
├── api/               # API endpoints
├── signaler/          # Créer un signalement
├── projets/           # Afficher les projets
├── auth/login         # Connexion
└── dashboard          # Admin dashboard

components/           # Composants réutilisables
src/lib/             # Utilitaires (Prisma, Auth)
prisma/              # Base de données
```

## 🗄️ Base de données

Les tables créées automatiquement :
- **users** : Utilisateurs (CITOYEN, AGENT, ADMIN)
- **signalements** : Problèmes urbains
- **commentaires** : Commentaires sur les signalements
- **votes** : Votes des utilisateurs

## 🔐 Authentification

NextAuth.js v4 avec Credentials Provider

⚠️ **Note** : Les mots de passe ne sont pas hashés en développement. Utilisez `bcryptjs` en production.

## 📚 Scripts disponibles

```bash
npm run dev           # Démarrer en développement
npm run build        # Build de production
npm start            # Démarrer la production
npm run db:push      # Synchroniser le schéma
npm run db:seed      # Remplir avec les données de test
```

## 📋 Pages de l'application

- `/` - Accueil avec statistiques
- `/signaler` - Formulaire de signalement
- `/projets` - Liste des projets avec filtres
- `/projets/[id]` - Détail d'un projet
- `/auth/login` - Connexion
- `/dashboard` - Tableau de bord admin

## 🐛 Résoudre les problèmes

**Erreur de base de données ?**
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

**Port 3000 occupé ?**
```bash
npm run dev -- -p 3001
```

## 📄 Licence

Créé pour le hackathon Dakar Innovation Days 2026
