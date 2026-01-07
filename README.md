# ESGI : TP NestJS Watchlist

1. **Installation** : `npm install`
2. **Configuration`.env`** : Serveur SMTP à configurer (Via gmail par exemple)
3. **Migration** : `npx prisma migrate dev`
4. **Lancement** : `npm run start:dev`

### Swagger
`http://localhost:3000/api`

1. **Inscription** : `/auth/register`, envoie un lien cliquable par mail pour vérifier le compte
2. **Connexion** : `/auth/login`, envoie un jeton 2FA par mail
3. **Authentification** : `/auth/verify-2fa`, renvoie un jeton d'authentification à renseigner en cliquant sur Authorize via Swagger

### Pour accéder aux routes admin :

`npx prisma studio` pour accéder à la table User et passer un compte en admin
