# -*- coding: utf-8 -*-
"""Business Plan 4UR — Chapitres 6 a 9."""
from bp4ur_common import (P, bullet, heading, h1_block, stat_row, make_table,
                          callout, chart_block, safe_keep_together, S,
                          Spacer, Paragraph, Table, TableStyle, AVAIL_W,
                          CARD_BG, SECTION_BG, TEXT_MUTED, TEXT_PRIMARY)

ASSETS = '/home/z/my-project/bp4ur_assets'
NB = '\u00A0'


def _swot_cell(title, items):
    flows = [Paragraph('<b>%s</b>' % title, S['td_b'])]
    for it in items:
        flows.append(Paragraph('•%s%s' % (NB, it), S['td']))
    return flows


def build(story):
    # ═══════════════════════════════════════════════════════════
    # 6. ANALYSE CONCURRENTIELLE ET SWOT
    # ═══════════════════════════════════════════════════════════
    p1 = P("Le paysage concurrentiel de 4UR est fragmenté : aucune "
           "organisation de taille intermédiaire ne combine aujourd’hui "
           "création web, chatbots et cybersécurité pour les PME. La "
           "concurrence se répartit entre freelances généralistes, agences "
           "web créatives, ESN inaccessibles, cabinets cyber spécialisés et "
           "plateformes self-service. Chacun de ces acteurs laisse un "
           "espace vide que 4UR occupe : celui du partenaire unique, "
           "local et documenté, qui fabrique des outils numériques sûrs "
           "au prix du marché.")
    story += h1_block(6, "Analyse concurrentielle et SWOT", [p1])

    story.append(heading("6.1  Cartographie de la concurrence", 1))
    story += make_table(
        ['Type de concurrent', 'Prix site vitrine', 'Forces', 'Limites'],
        [
            ['Freelances',
             '800 à 5%s000%s€' % (NB, NB),
             'Souplesse, coût faible, réactivité',
             'Capacité limitée, pas de sécurité documentée, continuité de '
             'service aléatoire'],
            ['Agences web',
             '3%s000 à 15%s000%s€' % (NB, NB, NB),
             'Design fort, équipe établie, références',
             'Sécurité vendue à part ou absente, délais longs, prix élevés'],
            ['ESN / grands groupes',
             '10%s000%s€ et plus' % (NB, NB),
             'Richesse technique, certifications',
             'Inadaptées aux petits budgets, cycles de vente lourds'],
            ['Cabinets cyber',
             'Audit 2%s000 à 10%s000%s€' % (NB, NB, NB),
             'Expertise pointue, certifications (ISO 27001)',
             'Ne créent ni site ni chatbot, positionnement premium'],
            ['Plateformes SaaS (Wix, Shopify…)',
             '150 à 500%s€/an' % NB,
             'Prix plancher, autonomie immédiate',
             'Sur-mesure impossible, aucune protection ni accompagnement, '
             'dépendance à la plateforme'],
        ],
        [0.20, 0.16, 0.30, 0.34],
        caption_text='Tableau 4 — Concurrence par type d’acteur '
                     '(tarifs marché 2025-2026).')
    story.append(P(
        "Face à cette mosaïque, l’avantage concurrentiel de 4UR repose sur "
        "trois appuis. Premièrement, la sécurité by design transforme un "
        "devoir en argument commercial démontrable à chaque livraison. "
        "Deuxièmement, l’architecture en trois piliers crée des effets de "
        "levier commerciaux : chaque mission ouvre naturellement deux "
        "propositions additionnelles. Troisièmement, la structure légère "
        "permet de tenir des prix d’agence inférieurs de 20 à 40 %% tout en "
        "préservant une marge saine, grâce à un outillage d’automatisation "
        "et à un réseau de freelances mobilisé à la demande."))

    story.append(heading("6.2  SWOT", 1))
    swot = Table([
        [_swot_cell('Forces (interne)', [
            'Sécurité intégrée dès la conception, preuve remise au client à '
            'chaque livraison',
            'Guichet unique web + IA + cyber créant des ventes croisées '
            'naturelles',
            'Marque minimaliste premium déjà finalisée (charte complète)',
            'Structure légère : frais généraux faibles, marge préservée',
         ]),
         _swot_cell('Faiblesses (interne)', [
            'Marque nouvelle, sans références client au démarrage',
            'Dépendance au fondateur sur la technique et la vente',
            'Capacité limitée en cas de pics simultanés de projets',
            'Réseau freelance à fiabiliser dans la durée',
         ])],
        [_swot_cell('Opportunités (externe)', [
            '48 %% des victimes de ransomware sont des PME/ETI : demande de '
            'protection en forte hausse',
            'Obligations NIS2/DORA et exigences des assureurs cyber',
            'IA conversationnelle en croissance de 22 %% par an en France',
            'Partenariats accessibles : comptables, CCI, incubateurs, '
            'Cybermalveillance',
         ]),
         _swot_cell('Menaces (externe)', [
            'Plateformes self-service qui banalisent le prix du site simple',
            'Agences établies qui ajoutent une offre cyber en réaction',
            'Volatilité des technologies d’IA générative et de leurs coûts',
            'Sensibilité de la demande TPE aux cycles économiques',
         ])],
    ], colWidths=[AVAIL_W / 2, AVAIL_W / 2], hAlign='CENTER')
    swot.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), CARD_BG),
        ('BACKGROUND', (1, 0), (1, 0), CARD_BG),
        ('BACKGROUND', (0, 1), (0, 1), SECTION_BG),
        ('BACKGROUND', (1, 1), (1, 1), SECTION_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
    ]))
    story.append(Spacer(1, 12))
    story += safe_keep_together([
        swot,
        Spacer(1, 4),
        Paragraph('Tableau 5 — Matrice SWOT de 4UR au lancement.',
                  S['caption'])])
    story.append(Spacer(1, 10))

    # ═══════════════════════════════════════════════════════════
    # 7. STRATEGIE COMMERCIALE ET MARKETING
    # ═══════════════════════════════════════════════════════════
    p1 = P("La stratégie commerciale de 4UR suit une logique d’entonnoir à "
           "offre d’appel forte : créer un premier contact à faible risque "
           "pour le client (diagnostic), prouver la compétence (audit, "
           "rapport), puis convertir en projet packagé et enfin en relation "
           "récurrente (maintenance, supervision). Cette mécanique "
           "transforme le différenciateur sécurité en moteur d’acquisition "
           "et non en simple argument de fidélisation.")
    story += h1_block(7, "Stratégie commerciale et marketing", [p1])

    story.append(heading("7.1  Offre d’appel", 1))
    story.append(P(
        "Le «%sDiagnostic Cyber Express»%sest offert : trente minutes "
        "d’analyse publique d’une entreprise (site, e-mailing, exposition "
        "des données) suivies de trois constats et trois recommandations, "
        "remis sous forme d’une note d’une page. Sans engagement, ce "
        "diagnostic démontre l’expertise, fait toucher du doigt le risque "
        "et débouche naturellement sur l’audit éclair à 890%s€ — dont le "
        "montant est déduit du premier projet supérieur à 2%s000%s€. Cette "
        "progression par étapes supprime l’objection prix au premier "
        "contact et installe la confiance par la preuve."
        % (NB, NB, NB, NB, NB)))

    story.append(heading("7.2  Canaux d’acquisition", 1))
    story.append(bullet(
        "<b>Présence locale digitalisée.</b> Site 4ur.pro optimisé SEO "
        "local, fiche Google Business, pages «%scréation site web», "
        "«%schatbot IA» et «%saudit cybersécurité» géolocalisées."
        % (NB, NB, NB)))
    story.append(bullet(
        "<b>Contenu d’autorité LinkedIn.</b> Une publication hebdomadaire "
        "alternant études de cas anonymisées, alertes vulnérabilités et "
        "démonstrations chatbots ; prospection douce auprès de 10 "
        "entreprises ciblées par semaine."))
    story.append(bullet(
        "<b>Partenariats prescripteurs.</b> Comptables et experts-"
        "comptables (une PME sur deux les consulte avant d’investir), CCI, "
        "incubateurs, networks business ; inscription à la plateforme "
        "Cybermalveillance comme prestataire référencé."))
    story.append(bullet(
        "<b>Recommandation outillée.</b> Programme de parrainage à 10 %% du "
        "premier projet, déclenché systématiquement à la livraison — moment "
        "de satisfaction maximale."))
    story.append(bullet(
        "<b>Preuves sociales.</b> Études de cas standardisées (avant / "
        "après / indicateur de sécurité), avis clients, score NPS affiché "
        "sur le site."))

    story.append(heading("7.3  Tunnel de conversion et objectifs an 1", 1))
    story.append(P(
        "Le tunnel visé pour la première année est réaliste : environ "
        "huit diagnostics ou mises en relation qualifiées par mois à "
        "compter du deuxième trimestre, un devis détaillé remis sous 48 "
        "heures, et un taux de conversion de 25 %% — cohérent avec les "
        "standards du conseil digital B2B. Chaque projet livré déclenche "
        "la proposition de maintenance (objectif d’adhésion 60 %%), puis le "
        "parrainage. Le tableau suivant détaille la montée en charge "
        "trimestrielle."))
    story += make_table(
        ['Trimestre', 'Projets signés', 'Événements marquants'],
        [
            ['T1 2026', '3',
             'Lancement du site et des offres ; 12 diagnostics réalisés ; '
             'premiers 3 clients vitrine'],
            ['T2 2026', '5',
             'Signature de 2 partenariats comptables ; 1er audit complet ; '
             'début des abonnements maintenance'],
            ['T3 2026', '6',
             '1er chatbot IA livré ; atelier cybersécurité en CCI ; 8 '
             'devis par mois'],
            ['T4 2026', '7',
             'Campagne «%sBilan cyber de fin d’année»%s; recrutement de '
             'l’alternant ; MRR de 1%s200%s€' % (NB, NB, NB, NB)],
            ['<b>Total</b>', '<b>21</b>',
             '<b>65 k€ de CA ; 12 sites, 6 missions cyber, 3 chatbots</b>'],
        ],
        [0.13, 0.15, 0.72],
        align_map={1: 'td_c'},
        bold_last_row=True,
        caption_text='Tableau 6 — Objectifs commerciaux 2026.')

    # ═══════════════════════════════════════════════════════════
    # 8. PLAN OPERATIONNEL
    # ═══════════════════════════════════════════════════════════
    p1 = P("Le plan opérationnel traduit la promesse commerciale en "
           "méthode : une chaîne de production standardisée, outillée et "
           "pédagogique, qui garantit des délais tenus et une qualité "
           "sécuritaire constante quel que soit le volume. L’objectif est "
           "qu’un projet identique produit toujours la même qualité, "
           "indépendamment de la charge ou de l’effectif.")
    story += h1_block(8, "Plan opérationnel", [p1])

    story.append(heading("8.1  Méthode de projet en cinq étapes", 1))
    story += make_table(
        ['Étape', 'Durée', 'Contenu et livrable'],
        [
            ['1. Cadrage & audit',
             '1 sem.',
             'Atelier objectifs, audit de l’existant (technique et '
             'sécuritaire), arborescence, devis détaillé signé'],
            ['2. Design',
             '1-2 sem.',
             'Maquettes UX/UI dans la charte, validation client, contenu '
             'et SEO on-page'],
            ['3. Développement',
             '2-3 sem.',
             'Intégration, chatbot le cas échéant, environnement de '
             'recette, formation des équipes'],
            ['4. Audit sécurité',
             '1 sem.',
             'Check-list OWASP, tests d’intrusion de base, conformité '
             'RGPD, rapport de sécurité remis'],
            ['5. Lancement & suivi',
             'Continu',
             'Mise en production, monitoring, sauvegardes, assistance, '
             'revue mensuelle de performance'],
        ],
        [0.22, 0.11, 0.67],
        align_map={1: 'td_c'},
        caption_text='Tableau 7 — Processus de production 4UR (4 à 6 '
                     'semaines par projet).')

    story.append(heading("8.2  Stack technique", 1))
    story.append(P(
        "La pile technique privilégie la maturité, la performance et la "
        "conformité européenne : Next.js et React pour les interfaces, "
        "Node.js côté serveur, hébergement souverain européen avec "
        "chiffrement intégral, CDN et pare-feu applicatif (WAF) en première "
        "ligne, sauvegardes chiffrées quotidiennes testées mensuellement, "
        "supervision et alerting 24/7. Les chatbots s’appuient sur des "
        "modèles d’IA générative exposés via API, encadrés par une "
        "architecture «%sRAG sous garde-fous»%s: base de connaissances "
        "contrôlée, journalisation des échanges, seuils de confiance et "
        "relais humain systématique. Cette stack est documentée sous forme "
        "de gabarits réutilisables, ce qui réduit le temps de production "
        "d’un site standard à moins de trois semaines effectives."
        % (NB, NB)))

    story.append(heading("8.3  Processus sécurité by design", 1))
    story.append(P(
        "Le processus de sécurité appliqué à chaque projet comporte six "
        "contrôles obligatoires : revue des dépendances et correction des "
        "vulnérabilités connues ; vérification OWASP top 10 (injections, "
        "authentification, contrôles d’accès…) ; durcissement des en-têtes "
        "et du HTTPS ; test de restauration des sauvegardes ; contrôle de "
        "conformité RGPD (mentions, consentements, registre) ; passe de "
        "tests avant mise en production avec remise du rapport. Ce socle, "
        "documenté dans un PSSI léger d’une dizaine de pages remis au "
        "client, constitue la preuve opposable du différenciateur 4UR et "
        "alimente les exigences des assureurs cyber."))

    story.append(heading("8.4  Organisation et feuille de route", 1))
    story += make_table(
        ['Période', 'Jalons opérationnels'],
        [
            ['T1 2026',
             'Immatriculation SASU ; mise en ligne du site 4ur.pro ; '
             'industrialisation des gabarits ; premiers clients pilotes'],
            ['T2 2026',
             'Activation des partenariats prescripteurs ; formalisation du '
             'PSSI et des rapports de sécurité ; offre chatbot v1'],
            ['T3 2026',
             'Ateliers cyber en CCI ; enrichissement de l’offre Entreprise ; '
             'automatisation du monitoring client'],
            ['T4 2026',
             'Recrutement d’un alternant développeur ; formation ISO 27001 '
             'du fondateur ; bilan et ajustement des prix'],
            ['2027',
             'Industrialisation : gabarits chatbots, portail client, '
             'recrutement d’un développeur confirmé ; objectif 150 k€'],
            ['2028',
             'Équipe de 3 à 4 personnes ; certification ISO 27001 ; '
             'ouverture du programme sécurité annuel aux ETI ; objectif '
             '240 k€'],
        ],
        [0.14, 0.86],
        caption_text='Tableau 8 — Feuille de route 2026-2028.')

    # ═══════════════════════════════════════════════════════════
    # 9. PREVISIONNEL FINANCIER 3 ANS
    # ═══════════════════════════════════════════════════════════
    p1 = P("Le prévisionnel couvre les exercices 2026 à 2028 en montants "
           "hors taxes, avec des hypothèses volontairement prudentes : "
           "volume de projets réaliste, saisonnalité ignorée en défaveur "
           "du plan, et montée en charge progressive des revenus "
           "récurrents. Trois scénarios encadrent le cas central afin "
           "d’outiller la décision de financement.")
    story += h1_block(9, "Prévisionnel financier 3 ans", [p1])

    story.append(heading("9.1  Hypothèses", 1))
    story += make_table(
        ['Paramètre', 'Valeur retenue'],
        [
            ['Prix moyen d’un site web (mix des formules)', '≈ 4%s100%s€ HT'
             % (NB, NB)],
            ['Volume an 1', '12 sites, 6 missions cyber, 3 chatbots'],
            ['Taux d’adhésion à la maintenance', '60 %% des projets livrés'],
            ['MRR fin d’année 1', '1%s200%s€ (≈ 10 abonnements)' % (NB, NB)],
            ['Marge brute sur projets', '60 à 65 %%'],
            ['Rémunération du dirigeant', '2%s000%s€ brut/mois en 2026, '
             '3%s000%s€ en 2027, 4%s000%s€ en 2028'
             % (NB, NB, NB, NB, NB, NB)],
            ['Sous-traitance freelance', '12%s000%s€ en 2026, 20%s000%s€ en '
             '2027, 26%s000%s€ en 2028' % (NB, NB, NB, NB, NB, NB)],
            ['Alternant (T4 2026) puis salarié (2028)', '18%s000%s€ + '
             'charges en 2028' % (NB, NB)],
        ],
        [0.52, 0.48],
        caption_text='Tableau 9 — Hypothèses de construction du '
                     'prévisionnel.')

    story.append(heading("9.2  Compte de résultat prévisionnel", 1))
    story += make_table(
        ['Ligne (k€ HT)', '2026', '2027', '2028'],
        [
            ['CA 4UR WEB', '45,4', '80,0', '120,0'],
            ['CA 4UR SECURITY', '13,5', '40,0', '70,0'],
            ['CA 4UR SOFTWARE', '6,1', '30,0', '50,0'],
            ['<b>Chiffre d’affaires total</b>', '<b>65,0</b>',
             '<b>150,0</b>', '<b>240,0</b>'],
            ['Charges externes (freelances, outils, marketing…)',
             '26,8', '43,8', '62,5'],
            ['Rémunération dirigeant (charges sociales incluses)',
             '40,8', '61,2', '81,6'],
            ['Salarié / alternant (charges incluses)', '0,0', '0,0',
             '25,4'],
            ['<b>Résultat net</b>', '<b>-2,6</b>', '<b>45,0</b>',
             '<b>70,5</b>'],
            ['Marge nette', '-4 %%', '30 %%', '29 %%'],
        ],
        [0.46, 0.18, 0.18, 0.18],
        align_map={1: 'td_c', 2: 'td_c', 3: 'td_c'},
        bold_last_row=False,
        caption_text='Tableau 10 — Compte de résultat prévisionnel '
                     '2026-2028 (k€ HT).')
    story += chart_block(
        ASSETS + '/chart3_ca.png',
        'Figure 3 — Chiffre d’affaires prévisionnel par pilier (k€ HT).',
        max_height=235)
    story.append(P(
        "La structure du chiffre d’affaires évolue dans le bon sens : le "
        "poids de la sécurité et du software passe de 30 %% en 2026 à 50 %% "
        "en 2028, tandis que les revenus récurrents (maintenance, "
        "supervision, abonnements chatbots) atteignent environ 85 k€ en "
        "2028, soit plus d’un tiers de l’activité. Cette base récurrente "
        "est le meilleur gage de stabilité pour la banque comme pour les "
        "futurs associés."))

    # Titre + encadre point mort (remplissent la page), puis graphique
    story.append(heading("9.3  Seuil de rentabilité et trésorerie", 1))
    story += callout(
        "<b>Point mort.</b> Le seuil de rentabilité 2026 s’établit à "
        "67%s600%s€ de chiffre d’affaires annuel, soit ≈ 5%s600%s€ par "
        "mois — environ un site Pro et un abonnement par mois. L’équilibre "
        "mensuel est atteint dès le deuxième trimestre 2026 ; l’exercice "
        "complet reste voisin de l’équilibre (-2,6 k€), absorbé par la "
        "montée en charge du premier semestre." % (NB, NB, NB, NB))
    story += chart_block(
        ASSETS + '/chart4_ca_charges.png',
        'Figure 4 — Chiffre d’affaires et charges totales (k€) ; la '
        'ligne pointillée matérialise le niveau du seuil de '
        'rentabilité de 2026 (67,6 k€).',
        max_height=230)
    story.append(P(
        "La trésorerie de départ requise est de 20%s000%s€, financée par "
        "un apport personnel de 15%s000%s€ complété d’un prêt d’honneur de "
        "5%s000%s€ (réseau Initiative ou équivalent). Ce montant couvre "
        "trois à quatre mois de charges fixes au pire de la courbe — c’est-"
        "à-dire la période de constitution du premier portefeuille — sans "
        "recourir à un emprunt bancaire classique. L’ACRE et le statut de "
        "l’assimilé salarié lissent par ailleurs le coût social des deux "
        "premiers trimestres."
        % (NB, NB, NB, NB, NB, NB)))

    story.append(heading("9.4  Scénarios", 1))
    story += make_table(
        ['Scénario', 'CA 2026', 'CA 2027', 'CA 2028', 'Résultat 2028'],
        [
            ['Prudent (-25 %%)',
             '52,0', '112,0', '180,0', '42,0'],
            ['Réalisable (cas central)',
             '<b>65,0</b>', '<b>150,0</b>', '<b>240,0</b>', '<b>70,5</b>'],
            ['Ambitieux (+25 %%)',
             '82,0', '190,0', '305,0', '103,0'],
        ],
        [0.24, 0.19, 0.19, 0.19, 0.19],
        align_map={1: 'td_c', 2: 'td_c', 3: 'td_c', 4: 'td_c'},
        caption_text='Tableau 11 — Scénarios prévisionnels (k€ HT).')
    story.append(P(
        "Le scénario prudent suppose un démarrage commercial décalé d’un "
        "trimestre et un panier moyen inférieur ; même dans ce cas, la "
        "rentabilité est acquise dès 2027 grâce au poids des charges fixes "
        "contenues. Le scénario ambitieux intègre un deuxième alternant et "
        "un partenariat national de prescripteurs ; il sert surtout à "
        "borner la capacité de production, qui reste le principal "
        "facteur limitant."))

    story.append(heading("9.5  Indicateurs de pilotage", 1))
    story += make_table(
        ['Indicateur', 'Cible fin 2026', 'Cible fin 2028', 'Suivi'],
        [
            ['Devis remis', '8 / mois', '20 / mois', 'Hebdo'],
            ['Taux de conversion devis → projet', '25 %%', '28 %%',
             'Mensuel'],
            ['Panier moyen projets', '4%s100%s€' % (NB, NB),
             '4%s600%s€' % (NB, NB), 'Mensuel'],
            ['MRR (abonnements récurrents)', '1%s200%s€' % (NB, NB),
             '7%s000%s€' % (NB, NB), 'Mensuel'],
            ['Marge brute sur projets', '62 %%', '64 %%', 'Par projet'],
            ['Satisfaction client (NPS)', '50', '60', 'À la livraison'],
            ['Délai moyen de livraison', '6 sem.', '5 sem.', 'Par projet'],
        ],
        [0.40, 0.20, 0.20, 0.20],
        align_map={1: 'td_c', 2: 'td_c', 3: 'td_c'},
        caption_text='Tableau 12 — Tableau de bord de pilotage.')

    story.append(heading("9.6  Sources et méthode", 1))
    story.append(P(
        "Les données de marché citées dans ce plan proviennent de sources "
        "publiques récentes, identifiées ci-dessous ; les montants du "
        "prévisionnel sont exprimés hors taxes sur des exercices calendaire"
        "s et ne constituent pas un engagement contractuel. Les hypothèses "
        "commerciales (volumes, taux de conversion, adhésion maintenance) "
        "sont fixées à des niveaux inférieurs ou égaux aux standards "
        "observés dans le conseil digital B2B pour préserver la prudence "
        "du plan.", 'body_left'))
    for ref in [
        "ANSSI (2025). <i>Panorama de la cybermenace 2025</i>. Agence "
        "nationale de la sécurité des systèmes d’information.",
        "Cybermalveillance.gouv.fr (2025). <i>2e baromètre national de la "
        "maturité cyber des TPE/PME</i>. GIP ACYMA.",
        "Le Journal des Entreprises (2024). «%sLe marché de la "
        "cybersécurité devrait croître de 10 %% par an en France»." % NB,
        "Mordor Intelligence (2026). <i>Cybersecurity Market Size & Share "
        "Analysis</i> ; <i>Global Chatbot Market Report</i>.",
        "Spherical Insights (2025). <i>France Conversational AI Market, "
        "2025-2035</i>.",
        "Digitify (2025). «%sChiffres clés du marché du développement web "
        "en France»." % NB,
        "France Num / Afnic (2025). <i>Combien payer pour un site web ou "
        "un site e-commerce ?</i> Ministère de l’Économie.",
        "SeedWeb (2026). <i>Prix site internet : guide des tarifs "
        "2026</i> ; Codeur.com (2025), tarifs freelances.",
        "Gartner, cité par Distributique (2025). «%sCybersécurité : la "
        "croissance du marché va se renforcer»." % NB,
    ]:
        story.append(Paragraph(ref, S['biblio']))
