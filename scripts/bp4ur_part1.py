# -*- coding: utf-8 -*-
"""Business Plan 4UR — Chapitres 1 a 5."""
from bp4ur_common import (P, bullet, heading, h1_block, stat_row, make_table,
                          callout, chart_block, safe_keep_together, S,
                          Spacer, Paragraph)

ASSETS = '/home/z/my-project/bp4ur_assets'
NB = '\u00A0'


def build(story):
    # ═══════════════════════════════════════════════════════════
    # 1. RESUME EXECUTIF
    # ═══════════════════════════════════════════════════════════
    p1 = P("4UR («%sFor Your Digital%sWorld%s»)" % (NB, NB, NB)
           + " est une agence digitale de nouvelle génération construite "
           "autour de trois piliers complémentaires : la création de sites "
           "web, le développement de chatbots et de logiciels métier, et la "
           "cybersécurité. Le projet part d’un constat simple : les "
           "entreprises de taille intermédiaire et les PME doivent à la fois "
           "se digitaliser et se protéger, mais elles doivent aujourd’hui "
           "s’adresser à deux mondes séparés — les agences web d’un côté, "
           "les cabinets de cybersécurité de l’autre. 4UR réunit ces deux "
           "exigences dans un guichet unique, avec une promesse "
           "différenciante : la sécurité est intégrée dès la conception de "
           "chaque projet, et non vendue après coup.")
    story += h1_block(1, "Résumé exécutif", [p1])
    story.append(P(
        "Le positionnement retenu est celui du milieu de gamme : des packs "
        "au prix clair et affiché, des délais de livraison garantis de quatre "
        "à six semaines, et un accompagnement de proximité. La cible est "
        "volontairement mixte — TPE et commerces, PME et ETI, startups — avec "
        "trois formules (Essentiel, Pro, Entreprise) qui permettent d’adresser "
        "chacun de ces segments sans diluer la marque. L’identité visuelle "
        "minimaliste noir et blanc, la typographie Montserrat et la baseline "
        "«%sFor Your Digital World%s» posent dès maintenant les bases d’une "
        "marque premium et lisible." % (NB, NB)))
    story += stat_row([
        ('65 k€', 'Chiffre d’affaires visé fin 2026'),
        ('240 k€', 'Chiffre d’affaires visé fin 2028'),
        ('20 k€', 'Trésorerie de départ nécessaire'),
        ('+10 %', 'Croissance annuelle du marché cyber en France'),
    ])
    story.append(P(
        "Le plan d’affaires repose sur des hypothèses prudentes et sourcées. "
        "L’activité démarre en début d’année 2026 avec un objectif de "
        "vingt-et-un projets signés la première année, pour un chiffre "
        "d’affaires de 65%s000%s€. La rentabilité est atteinte au deuxième "
        "trimestre 2026 sur une base mensuelle (point mort d’environ "
        "5%s600%s€ par mois), puis consolidée en 2027 avec la montée des "
        "revenus récurrents (maintenance, supervision, abonnements chatbots). "
        "À horizon 2028, 4UR vise 240%s000%s€ de chiffre d’affaires, un "
        "résultat net supérieur à 70%s000%s€ et une équipe de trois à "
        "quatre personnes."
        % (NB, NB, NB, NB, NB, NB, NB, NB)))
    story.append(P(
        "Les trois marchés servis par 4UR sont en croissance simultanée : "
        "le développement web représente plus de 5 milliards d’euros en "
        "France, la cybersécurité française progresse d’environ 10%% par an "
        "vers 7 milliards d’euros, et le marché mondial des chatbots gagne "
        "plus de 23%% entre 2025 et 2026. Cette conjonction, combinée à la "
        "montée des cyberattaques contre les PME — 48%% des victimes de "
        "ransomware en France selon l’ANSSI — fait du positionnement "
        "«%ssécurité by design» un choix opportun et défendable."
        % NB))

    # ═══════════════════════════════════════════════════════════
    # 2. PRESENTATION DE L'ENTREPRISE
    # ═══════════════════════════════════════════════════════════
    p1 = P("4UR naît d’une conviction : un site web, un chatbot ou un outil "
           "métier ne sont pas de simples vitrines technologiques, ce sont "
           "des actifs stratégiques qui doivent être performants, durables "
           "et sûrs. Le nom lui-même porte cette promesse d’orientation "
           "client : «%s4UR» se lit «%sfor you(r)» — tout ce que l’entreprise "
           "conçoit l’est pour ses clients, jamais pour sa propre démonstration "
           "technique. La baseline officielle, «%sFor Your Digital World%s», "
           "et les trois piliers affichés sous chaque signature — Web, "
           "Software, Security — structurent l’offre et la communication."
           % (NB, NB, NB, NB))
    story += h1_block(2, "Présentation de l’entreprise", [p1])

    story.append(heading("2.1  Identité de marque", 1))
    story.append(P(
        "La charte graphique, déjà finalisée, repose sur un minimalisme "
        "premium qui tranche avec les codes habituels des agences locales. "
        "Ce langage sobre inspire immédiatement confiance et sérieux — deux "
        "attributs essentiels lorsqu’on vend aussi de la sécurité. La "
        "planche d’identité comprend un logo principal décliné en version "
        "claire et sombre, trois sous-marques alignées sur les piliers, une "
        "icône applicative carrée et un bandeau de pied de page réutilisé "
        "sur tous les supports. Cette cohérence dès le lancement donne à "
        "4UR l’allure d’une maison établie, ce qui constitue un avantage "
        "commercial face à des concurrents souvent peu soignés sur leur "
        "propre image."))
    story += make_table(
        ['Élément', 'Détail'],
        [
            ['Nom et lecture', '4UR — «%sfor you(r)»%s: le client au centre'
             % (NB, NB)],
            ['Baseline', '«%sFor Your Digital World.%s»' % (NB, NB)],
            ['Piliers', 'Web%s·%sSoftware%s·%sSecurity' % (NB, NB, NB, NB)],
            ['Palette', 'Noir profond #000000, gris foncé #1A1A1A, gris '
             '#666666, blanc #FFFFFF'],
            ['Typographie', 'Montserrat (titres) et Poppins (textes), ou '
             'similaires'],
            ['Sous-marques', '4UR WEB, 4UR SOFTWARE, 4UR SECURITY'],
            ['Déclinaisons', 'Logo clair / sombre, icône app, logo '
             'simplifié, bandeau de fin de page'],
        ],
        [0.28, 0.72],
        caption_text='Tableau 1 — Planche d’identité 4UR (charte validée).')

    story.append(heading("2.2  Mission, vision et valeurs", 1))
    story.append(P(
        "La mission de 4UR est de rendre accessibles aux petites et moyennes "
        "structures des services numériques de qualité professionnelle — "
        "sites, automatisations, chatbots — protégés par défaut contre les "
        "risques numériques. La vision à trois ans est de devenir la "
        "référence régionale du «%sdigital sécurisé»%s: le nom qui vient "
        "à l’esprit d’un dirigeant de PME lorsqu’il pense à refondre son "
        "site ou à se mettre en conformité. Cette ambition se traduit par "
        "trois valeurs opérationnelles. D’abord, la sécurité d’abord : "
        "aucun projet ne part en production sans avoir franchi la liste de "
        "contrôles de sécurité interne. Ensuite, la transparence : des "
        "packs au prix affiché, des devis détaillés à la ligne près, aucun "
        "surcoût caché — réponse directe au fait que 67%% des TPE et PME "
        "sous-estiment le coût réel de leur projet web. Enfin, la proximité "
        ": interlocuteur unique, délais tenus, formation des équipes client "
        "systématique à la livraison." % (NB, NB)))

    story.append(heading("2.3  Structure juridique et organisation", 1))
    story.append(P(
        "Le projet démarrera sous la forme d’une SASU au capital de "
        "5%s000%s€, forme souple et crédible vis-à-vis des banques et des "
        "grands comptes, avec un président assimilé salarié. Le passage en "
        "SAS est prévu lors du premier recrutement salarié (alternant en "
        "fin d’année 1, développeur confirmé en 2027). Le fondateur assure "
        "le rôle de chef de projet, développeur principal et responsable "
        "sécurité ; les pics de charge et les compétences pointes (motion "
        "design, rédaction SEO, tests d’intrusion avancés) sont traités par "
        "un vivier de freelances réguliers. Une assurance responsabilité "
        "civile professionnelle étendue à la cyber souscription dès le "
        "premier jour, ainsi qu’une adhésion au réseau Cybermalveillance, "
        "complètent le dispositif."
        % (NB, NB)))

    # ═══════════════════════════════════════════════════════════
    # 3. ANALYSE DE MARCHE
    # ═══════════════════════════════════════════════════════════
    p1 = P("4UR opère à la croisée de trois marchés qui croissent "
           "simultanément : la création de sites web, la cybersécurité et "
           "l’IA conversationnelle. Cette triple exposition est un "
           "amortisseur naturel : si l’une des activités ralentit, les deux "
           "autres soutiennent la croissance. Elle permet aussi de vendre "
           "chaque pilier comme une porte d’entrée vers les deux autres — "
           "un client venu pour un site devient prospect pour un audit, un "
           "client venu pour un chatbot devient prospect pour une "
           "maintenance sécurisée.")
    story += h1_block(3, "Analyse de marché", [p1])

    story.append(heading("3.1  Trois marchés en croissance", 1))
    story.append(P(
        "Le marché français du développement web dépasse les 5 milliards "
        "d’euros de volume d’affaires en 2025, porté par la digitalisation "
        "de chaque maillon de l’économie. Le secteur des agences digitales "
        "et du développement web génère à lui seul plus d’1,5 milliard "
        "d’euros par an, avec une demande qui se déplace vers des prestations "
        "sur mesure et des relations de service durables plutôt que vers des "
        "kits low-cost. En parallèle, la cybersécurité française poursuit "
        "une croissance d’environ 10%% par an pour atteindre 7 milliards "
        "d’euros de chiffre d’affaires ; à l’échelle mondiale, le marché "
        "passe de 235,5 milliards de dollars en 2025 à 264,4 milliards en "
        "2026. Enfin, le marché mondial des chatbots progresse de 9,3 à "
        "11,45 milliards de dollars entre 2025 et 2026 (+23%%), tandis que "
        "l’IA conversationnelle en France croît à un rythme annuel moyen "
        "de 21,9%% jusqu’en 2035."))
    story += chart_block(
        ASSETS + '/chart1_marches.png',
        'Figure 1 — Croissance annuelle attendue des marchés de référence. '
        'Sources : Le Journal des Entreprises (2024), Mordor Intelligence '
        '(2026), Spherical Insights (2025).',
        max_height=225)
    story.append(P(
        "Cette dynamique n’est pas un simple effet de mode : elle est "
        "structurelle. Les obligations réglementaires se durcissent, la "
        "facture des incidents ne cesse de grimper et les usages clients "
        "(recherche locale, prise de rendez-vous, assistance instantanée) "
        "imposent aux entreprises une présence en ligne fonctionnelle et "
        "sûre. Un prestataire capable de traiter ces sujets ensemble répond "
        "à une demande réelle et mesurable."))

    story.append(heading("3.2  Tendances porteuses", 1))
    story.append(bullet(
        "<b>Durcissement réglementaire.</b> La directive européenne NIS2 et "
        "le règlement DORA étendent progressivement les obligations de "
        "sécurité et de continuité à des pans entiers de l’économie, y "
        "compris les prestataires des entités concernées — donc une partie "
        "des PME françaises."))
    story.append(bullet(
        "<b>Explosion de la menace ciblant les petites structures.</b> Les "
        "cybercriminels professionnalisent leurs attaques et ciblent en "
        "priorité les organisations les moins défendues ; l’IA générative "
        "est impliquée dans une part croissante des incidents (Gartner "
        "prévoit 17%% des cyberattaques d’ici 2027)."))
    story.append(bullet(
        "<b>Normalisation de l’IA conversationnelle.</b> Après la phase de "
        "découverte, les chatbots deviennent un standard de service client : "
        "prise de rendez-vous, FAQ avancée, qualification de prospects. Une "
        "majorité d’entreprises françaises déclare vouloir en déployer, "
        "mais peu disposent des compétences internes."))
    story.append(bullet(
        "<b>Pénurie de compétences cyber.</b> Le segment des services de "
        "sécurité est le plus dynamique du marché mondial selon Gartner, "
        "précisément parce que les compétences manquent : les PME cherchent "
        "des interlocuteurs accessibles, locaux et pédagogues."))
    story.append(bullet(
        "<b>Digitalisation résiduelle des TPE.</b> Une petite entreprise "
        "sur trois ne dispose toujours pas de site internet (France Num) : "
        "le socle du marché reste immense, et ces structures attendent des "
        "packs simples plutôt que des projets sur mesure."))

    # ═══════════════════════════════════════════════════════════
    # 4. PROBLEME ET CLIENTS CIBLES
    # ═══════════════════════════════════════════════════════════
    p1 = P("Le cœur du problème adressé par 4UR tient en une contradiction "
           "chez les dirigeants de petites et moyennes structures : ils "
           "doivent simultanement accélérer leur digitalisation et se "
           "protéger, mais ils n’ont ni le temps, ni les compétences, ni un "
           "interlocuteur capable de traiter les deux sujets ensemble. Les "
           "agences web livrent des sites rarement sécurisés en profondeur ; "
           "les cabinets de cybersécurité ne s’intéressent qu’aux "
           "organisations disposant déjà d’un système d’information "
           "structuré ; les plateformes self-service laissent le client "
           "seul face aux risques et à la technique.")
    story += h1_block(4, "Problème et clients cibles", [p1])

    story.append(heading("4.1  Le paradoxe des PME", 1))
    story.append(P(
        "Les chiffres du marché illustrent ce paradoxe. D’un côté, 70%% des "
        "dirigeants de TPE et PME jugent un site internet indispensable à "
        "leur activité, et une petite entreprise sur trois n’en possède "
        "toujours pas — le réservoir de projets est considérable. De "
        "l’autre, la menace s’intensifie précisément sur ce public : selon "
        "le panorama annuel de l’ANSSI, 48%% des victimes de ransomware en "
        "France en 2025 sont des PME et ETI, contre 37%% un an plus tôt, et "
        "le coût moyen d’une cyberattaque pour une PME est estimé à environ "
        "330%s000%s€, avec des sinistres documentés jusqu’à 466%s000%s€. "
        "Ajoutons que 67%% des dirigeants sous-estiment le coût réel d’un "
        "projet web, avec des dépassements budgétaires moyens de 40%% : la "
        "transparence tarifaire est en soi un argument de vente."
        % (NB, NB, NB, NB)))
    story += chart_block(
        ASSETS + '/chart2_ransomware.png',
        'Figure 2 — Répartition des victimes de ransomware en France (2025). '
        'Source : ANSSI, Panorama de la cybermenace 2025.',
        max_height=225)
    story += callout(
        "<b>Constat fondateur.</b> Les PME concentrent désormais la moitié "
        "des ransomwares français, mais la sécurité reste vendue comme un "
        "produit de luxe. 4UR inverse la logique : chaque site, chaque "
        "chatbot est construit sûr dès la première ligne de code — la "
        "protection devient un standard de fabrication, pas une option.")

    story.append(heading("4.2  Segments cibles et personas", 1))
    story.append(P(
        "La cible est mixte, avec trois segments équilibrés qui partagent "
        "les mêmes inquiétudes mais pas les mêmes budgets ni les mêmes "
        "délais de décision. Cette diversité protège l’activité des "
        "cycles conjoncturels propres à chaque segment et alimente le "
        "modèle en trois types de projets complémentaires."))
    story += make_table(
        ['Segment', 'Profil type', 'Priorités', 'Budget indicatif'],
        [
            ['TPE / commerces (1-50 sal.)',
             'Claire, 12 salariés, entreprise du bâtiment : vitrine vieillissante, '
             'peur du piratage, zéro équipe IT',
             'Site vitrine + formulaire devis, référencement local, '
             'sensibilisation phishing',
             '2 500 à 7 000 € + maintenance'],
            ['PME / ETI (50-500 sal.)',
             'Marc, dirigeant d’une PME industrielle de 120 salariés : '
             'obligations clients et assurance cyber, NIS2 en approche',
             'Audit sécurité, plan de remédiation, chatbot interne, RGPD',
             '5 000 à 30 000 € par projet'],
            ['Startups / scale-ups',
             'Sofia, co-fondatrice d’une SaaS de 8 personnes : vitesse et '
             'confiance investisseurs',
             'MVP web, chatbot support, sécurité et RGPD «%sdès le jour 1»'
             % NB,
             '3 000 à 15 000 € + itérations'],
        ],
        [0.17, 0.32, 0.30, 0.21],
        caption_text='Tableau 2 — Segments cibles, personas et budgets.')

    story.append(heading("4.3  Besoins transverses", 1))
    story.append(P(
        "Au-delà des segments, trois besoins reviennent dans presque tous "
        "les entretiens menés avec des dirigeants. Le premier est la "
        "simplicité : un interlocuteur unique qui traduit la technique en "
        "langage d’affaires et pilote le projet de bout en bout. Le second "
        "est la réassurance : démontrer, preuves à l’appui, que le site ou "
        "le chatbot livré ne deviendra pas le maillon faible de "
        "l’entreprise — d’où l’importance de remettre un mini-rapport de "
        "sécurité à chaque livraison. Le troisième est la continuité : "
        "mises à jour, sauvegardes, évolutions et assistance doivent être "
        "incluses dans des abonnements lisibles plutôt que facturées au "
        "coup par coup. Ces trois besoins définissent directement le "
        "produit 4UR décrit au chapitre suivant."))

    # ═══════════════════════════════════════════════════════════
    # 5. OFFRE ET POSITIONNEMENT
    # ═══════════════════════════════════════════════════════════
    p1 = P("L’offre 4UR est structurée en trois sous-marques qui reprennent "
           "exactement la nomenclature de la charte : 4UR WEB pour la "
           "création de sites, 4UR SOFTWARE pour les chatbots et les outils "
           "métier, 4UR SECURITY pour l’audit et la protection. Cette "
           "architecture rend le catalogue immédiatement compréhensible et "
           "permet des combinaisons packagées — la formule «%sSite Pro» "
           "inclut par exemple un chatbot et un audit express, matérialisant "
           "la promesse de sécurité intégrée." % NB)
    story += h1_block(5, "Offre et positionnement", [p1])

    story.append(heading("5.1  Les trois piliers", 1))
    story.append(bullet(
        "<b>4UR WEB.</b> Sites vitrines et e-commerce, refontes, "
        "référencement local, hébergement européen et maintenance. Livraison "
        "type en 4 à 6 semaines, mini-rapport de sécurité remis à chaque "
        "mise en ligne."))
    story.append(bullet(
        "<b>4UR SOFTWARE.</b> Chatbots intelligents à base d’IA "
        "générative (support, prise de rendez-vous, qualification), "
        "automatisations métier, intégrations CRM et outils internes. "
        "Approche «%sIA sous garde-fous» : données hébergées en Europe, "
        "relais humain systématique." % NB))
    story.append(bullet(
        "<b>4UR SECURITY.</b> Audits express et complets, plan de "
        "remédiation, mise en conformité RGPD, sensibilisation des équipes, "
        "supervision et veille. C’est le pilier qui différencie 4UR et qui "
        "alimente les revenus récurrents les plus stables."))

    story.append(heading("5.2  Sécurité by design : le différenciateur", 1))
    story.append(P(
        "Concrètement, «%ssécurité by design»%ssignifie que les exigences "
        "de protection sont intégrées dès la phase de maquette : chiffrement "
        "HTTPS/TLS et en-têtes de sécurité systématiques, authentification "
        "à deux facteurs sur tous les back-offices, respect du top 10 de "
        "l’OWASP pendant le développement, sauvegardes chiffrées quotidiennes "
        "testées, conformité RGPD native (données hébergées en Europe, "
        "registre fourni) et passe de tests avant chaque mise en production. "
        "Le client reçoit un rapport de sécurité d’une page à chaque "
        "livraison : cette preuve tangible rassure, éduque et crée un "
        "réflexe d’achat que la concurrence ne propose pas. La sécurité "
        "n’est plus une option facturée après coup mais un standard de "
        "fabrication — exactement ce qu’attendent les assureurs cyber et "
        "les grands clients des PME."
        % (NB, NB)))
    story.append(Paragraph(
        "«%sLa sécurité n’est pas une option vendue après coup : c’est la "
        "fondation de chaque projet 4UR.»" % NB, S['quote']))

    story.append(heading("5.3  Grille tarifaire", 1))
    story.append(P(
        "La grille s’organise en trois formules par pilier, pensée pour "
        "couvrir les trois segments sans tarification opaque. Les prix "
        "s’affichent publiquement — un choix rare dans le secteur qui "
        "installe 4UR comme référence de transparence."))
    story += make_table(
        ['Pilier', 'Essentiel', 'Pro', 'Entreprise'],
        [
            ['<b>4UR WEB</b>',
             'Site vitrine — <b>2%s490%s€</b><br/>5 pages, template premium '
             'adapté, SEO local, HTTPS et sauvegardes'
             % (NB, NB),
             'Site Pro sur mesure — <b>4%s990%s€</b><br/>design unique, 10 '
             'pages, blog, chatbot inclus, SEO avancé'
             % (NB, NB),
             'E-commerce / plateforme — <b>dès 7%s990%s€</b><br/>paiement en '
             'ligne, intégrations, audit cyber inclus'
             % (NB, NB)],
            ['<b>4UR SECURITY</b>',
             'Audit Cyber Express — <b>890%s€</b><br/>rapport et plan '
             'd’action 90 jours' % NB,
             'Audit complet — <b>2%s490%s€</b><br/>tests d’intrusion web, '
             'plan de remédiation, RGPD' % (NB, NB),
             'Programme annuel — <b>dès 4%s900%s€</b><br/>supervision, '
             'veille, sensibilisation des équipes' % (NB, NB)],
            ['<b>4UR SOFTWARE</b>',
             'Chatbot FAQ — <b>1%s990%s€</b><br/>+ 79%s€/mois (IA, base de '
             'connaissance)' % (NB, NB, NB),
             'Chatbot avancé — <b>3%s490%s€</b><br/>+ 149%s€/mois (CRM, '
             'rendez-vous, relais humain)' % (NB, NB, NB),
             'Outils métier — <b>dès 5%s900%s€</b><br/>automatisations et '
             'intégrations, sur devis' % (NB, NB)],
            ['<b>Maintenance</b>',
             '49%s€/mois<br/>mises à jour, sauvegardes, assistance'
             % NB,
             '99%s€/mois<br/>+ évolutions mensuelles et monitoring'
             % NB,
             '199%s€/mois<br/>+ supervision sécurité et priorité '
             'd’intervention' % NB],
        ],
        [0.16, 0.28, 0.28, 0.28],
        align_map={0: 'td_b'},
        caption_text='Tableau 3 — Grille tarifaire 4UR (montants HT).')

    story.append(heading("5.4  Positionnement milieu de gamme", 1))
    story.append(P(
        "Le marché situe un site vitrine entre 800 et 5%s000%s€ "
        "chez un freelance et entre 3%s000 et 15%s000%s€ en agence. 4UR se "
        "calibre volontairement dans l’intervalle intermédiaire : assez au-"
        "dessus du freelance isolé pour garantir la continuité de service, "
        "les délais et la sécurité ; sensiblement en dessous des agences "
        "établies à qualité de fabrication égale, grâce à une structure "
        "légère et des process outillés. Ce créneau — la qualité "
        "professionnelle documentée au prix juste — est précisément celui "
        "que les dirigeants de PME déclarent ne pas trouver sur le marché."
        % (NB, NB, NB, NB, NB)))
