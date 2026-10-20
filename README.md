# 4ur — site vitrine (web & cybersécurité)

Site vitrine de **4ur** : deux pôles (création de sites web, cybersécurité), six pages,
un formulaire de contact persisté et un panneau d'administration caché pour éditer
les prix et les offres sans redéployer.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, `output: standalone`) |
| Langage | TypeScript (strict) |
| Styles | Tailwind CSS 4 + design tokens dans `src/app/globals.css` |
| UI | shadcn/ui (uniquement les composants réellement utilisés) |
| Données | Prisma + SQLite |
| Validation | Zod |
| Runtime | Node.js (Bun en production) |

## Démarrage rapide

```bash
bun install                 # ou npm install
cp .env.example .env.local  # puis compléter les valeurs
bun run db:push             # crée la base SQLite et les tables
bun run db:generate         # génère le client Prisma (obligatoire)
bun run dev                 # http://localhost:3000
```

En production :

```bash
bun run build               # next build + copie des fichiers standalone
NODE_ENV=production bun .next/standalone/server.js
```

## Variables d'environnement

Toutes sont documentées dans `.env.example`. Les importantes :

- `DATABASE_URL` — base SQLite (`file:./db/custom.db`).
- `DEV_PANEL_PIN` / `DEV_PANEL_SECRET` — **obligatoires** pour le panneau dev.
  Sans elles, le panneau refuse de s'ouvrir (au lieu d'accepter un code par défaut).
- `TRUST_PROXY=1` — à activer **uniquement** derrière un reverse-proxy de confiance
  (Caddy) : l'IP client est alors lue dans `X-Forwarded-For`. Sinon l'IP est traitée
  comme inconnue et les quotas sont partagés (volontairement plus stricts).
- `RESEND_API_KEY` + `CONTACT_NOTIFY_EMAIL` (ou `CONTACT_WEBHOOK_URL`) — notification
  à chaque nouvelle demande de contact. Sans configuration, la demande est stockée
  mais personne n'est prévenu (un avertissement est journalisé).
- `NEXT_PUBLIC_*` — URL du site et informations légales.

## Structure

```
src/
  app/
    page.tsx              Accueil
    web/ security/        Pôles détaillés
    tarifs/               Grille tarifaire + comparatif
    methode/              Méthode en 4 étapes
    contact/              Formulaire
    mentions-legales/     Mentions légales
    confidentialite/      Politique de confidentialité (RGPD)
    sitemap.ts            Sitemap généré
    api/
      contact/            POST — demande de contact (Zod, anti-spam, notification)
      dev/auth/           POST/GET/DELETE — session du panneau dev
      dev/content/        GET/PUT — contenu éditable
      dev/requests/       GET/DELETE — demandes de contact reçues
  components/site/        Composants métier (navbar, hero 3D, panneau dev…)
  components/ui/          shadcn/ui (8 composants conservés)
  lib/
    content-defaults.ts   Types + valeurs par défaut (importable côté client)
    content-schema.ts     Schémas Zod du contenu
    content.ts            Lecture/écriture du contenu (serveur uniquement)
    db.ts                 Client Prisma paresseux (serveur uniquement)
    dev-auth.ts           PIN, session signée HMAC
    rate-limit.ts         Limitation de débit (IP + plafond global)
    notify.ts             Notification e-mail / webhook des demandes
    legal.ts              Informations légales à compléter
```

## Panneau dev caché

- Ouverture : **5 clics rapides** sur le `©` du pied de page, ou taper **`4ur`** au
  clavier hors champ de saisie.
- Accès : code `DEV_PANEL_PIN`, puis session signée 12 h (cookie `httpOnly`,
  `SameSite=Strict`).
- Onglets : Formules Web, Offres Sécurité, Options Web, Services récurrents, **Demandes**
  (les messages reçus, avec suppression).
- « Enregistrer » publie immédiatement (les pages publiques sont en `force-dynamic`) ;
  « Défauts » restaure la grille d'origine ; l'icône ⏻ ferme la session.

## Sécurité

En place :

- validation Zod de toutes les entrées (formulaire **et** contenu du panneau dev),
  y compris à la lecture depuis la base (une ligne corrompue ne casse pas les pages) ;
- PIN comparé en temps constant, cookie de session signé HMAC-SHA256, 12 h, `httpOnly` ;
- limitation de débit à deux niveaux (par IP si proxy de confiance, **et** plafond
  global) sur le formulaire, le PIN et l'écriture de contenu, avec délai progressif
  sur le PIN — le contournement par rotation de `X-Forwarded-For` ne fonctionne plus ;
- anti-spam du formulaire : pot de miel + quota + validation stricte ;
- en-têtes de sécurité (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy`) dans `next.config.ts` et le `Caddyfile` ;
- le client Prisma n'est plus embarqué dans le bundle navigateur (`server-only` +
  valeurs par défaut isolées dans `content-defaults.ts`) ;
- `reactStrictMode` activé et erreurs TypeScript bloquantes au build.

À faire (par ordre d'utilité) :

1. CSP stricte avec **nonce** généré en middleware (aujourd'hui `unsafe-inline` est
   nécessaire pour les scripts/styles injectés par Next).
2. Passer de `prisma db push` à de vraies migrations (`prisma migrate dev`) dès qu'il
   y a des données de production.
3. Sauvegarde régulière de `db/custom.db` (les demandes de contact y sont stockées).
4. Journaliser les accès au panneau dev (qui, quand, quoi).

## Dette connue

- Les captures et assets de travail (`agent-ctx/`, `upload/`, `bp4ur_assets/`,
  `tool-results/`) ne sont plus suivis par Git : ils restent sur le disque.
- Le tableau comparatif de `/tarifs` (13 lignes) reste codé en dur : il ne suit pas
  automatiquement un renommage de formule dans le panneau dev.
- Les polices viennent de Google Fonts au build (`next/font/google`) : pour un build
  hors ligne, basculer sur `next/font/local`.
- `db/custom.db` a été retiré du suivi Git ; l'historique contient encore l'ancienne
  version (avec des données de test) — un `git filter-repo` est possible si besoin.

## Licence

Usage privé — © 4ur. Tous droits réservés.
