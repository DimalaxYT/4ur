# -*- coding: utf-8 -*-
"""Graphiques du Business Plan 4UR — style monochrome 4UR (noir/gris/blanc).
Règles charts.md : spines top/right supprimés, grille pointillée 20%, donut 0.65,
légende sans cadre hors zone de données, labels anti-collision.
Palette : achromatique (S=0) conforme aux plafonds de tiers de palette.md,
alignée sur la charte 4UR (#000000/#1A1A1A/#666666/#FFFFFF)."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.font_manager as fm
fm.fontManager.addfont('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
fm.fontManager.addfont('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')

import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif'] = ['DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

OUT = '/home/z/my-project/bp4ur_assets'

# Palette monochrome 4UR (une seule famille, différenciation par luminosité)
C_DARK  = '#262422'   # série principale
C_MID   = '#6e6b67'   # série secondaire
C_LIGHT = '#a8a49f'   # série tertiaire
C_PALE  = '#cfcecb'   # accent très léger
C_TEXT  = '#262422'
C_MUTED = '#7d7a76'
C_AXIS  = '#b5b2ae'


def style_axes(ax, keep_left=True, keep_bottom=True):
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(keep_left)
    ax.spines['bottom'].set_visible(keep_bottom)
    for side in ('left', 'bottom'):
        ax.spines[side].set_color(C_AXIS)
        ax.spines[side].set_linewidth(0.8)
    ax.tick_params(colors=C_MUTED, labelsize=11, length=0)


# ─────────────────────────────────────────────────────────────
# Graphique 1 — Croissance annuelle attendue des marchés (%)
# ─────────────────────────────────────────────────────────────
def chart_marches():
    cats = ['Cybersécurité\n(France)',
            'Cybersécurité\n(monde)',
            'IA conversationnelle\n(France)',
            'Chatbots\n(monde)']
    vals = [10.0, 12.3, 21.9, 23.1]
    colors_ = [C_MID, C_MID, C_DARK, C_DARK]

    fig, ax = plt.subplots(figsize=(8.0, 3.9), dpi=200, constrained_layout=True)
    bars = ax.barh(cats, vals, height=0.58, color=colors_, edgecolor='none')
    for b, v in zip(bars, vals):
        ax.text(v + 0.45, b.get_y() + b.get_height() / 2,
                ('%.1f %%' % v).replace('.', ','),
                va='center', ha='left', fontsize=12, color=C_TEXT,
                fontweight='bold')
    ax.set_xlim(0, 27.5)
    ax.set_xticks([])
    style_axes(ax, keep_left=False, keep_bottom=False)
    ax.tick_params(axis='y', labelsize=11.5, colors=C_TEXT)
    fig.savefig(OUT + '/chart1_marches.png', facecolor='white')
    plt.close(fig)


# ─────────────────────────────────────────────────────────────
# Graphique 2 — Donut victimes ransomware France 2025 (ANSSI)
# ─────────────────────────────────────────────────────────────
def chart_ransomware():
    labels = ['PME et ETI', 'Collectivités territoriales', 'Autres organisations']
    vals = [48, 11, 41]
    colors_ = [C_DARK, C_MID, C_PALE]

    fig, ax = plt.subplots(figsize=(8.6, 3.9), dpi=200, constrained_layout=True)
    wedges, _ = ax.pie(vals, colors=colors_, startangle=90,
                       counterclock=False,
                       wedgeprops=dict(width=0.35, edgecolor='white',
                                       linewidth=2))
    ax.text(0, 0.08, '48 %', ha='center', va='center', fontsize=25,
            fontweight='bold', color=C_TEXT)
    ax.text(0, -0.24, 'des victimes sont\ndes PME et ETI', ha='center',
            va='center', fontsize=10.5, color=C_MUTED)
    # Légende riche (Stratégie C : zéro texte sur le graphe)
    legend_labels = ['%s — %d %%' % (l, v) for l, v in zip(labels, vals)]
    fig.legend(wedges, legend_labels, loc='outside center right',
               frameon=False, fontsize=11.5,
               handlelength=1.0, handleheight=1.0, labelspacing=1.1)
    ax.set_aspect('equal')
    fig.savefig(OUT + '/chart2_ransomware.png', facecolor='white')
    plt.close(fig)


# ─────────────────────────────────────────────────────────────
# Graphique 3 — CA prévisionnel empilé par pilier (k€)
# ─────────────────────────────────────────────────────────────
def chart_ca():
    years = ['2026', '2027', '2028']
    web = [45.4, 80.0, 120.0]
    sec = [13.5, 40.0, 70.0]
    sw = [6.1, 30.0, 50.0]
    totals = [65, 150, 240]

    fig, ax = plt.subplots(figsize=(7.8, 4.3), dpi=200, constrained_layout=True)
    x = range(len(years))
    b1 = ax.bar(x, web, 0.5, color=C_DARK, label='4UR WEB')
    b2 = ax.bar(x, sec, 0.5, bottom=web, color=C_MID, label='4UR SECURITY')
    bot2 = [w + s for w, s in zip(web, sec)]
    b3 = ax.bar(x, sw, 0.5, bottom=bot2, color=C_LIGHT, label='4UR SOFTWARE')
    for i, t in enumerate(totals):
        ax.text(i, t + 6, '%d k€' % t, ha='center', va='bottom',
                fontsize=12.5, fontweight='bold', color=C_TEXT)
    ax.set_xticks(list(x))
    ax.set_xticklabels(years, fontsize=12, color=C_TEXT)
    ax.set_ylim(0, 275)
    ax.set_yticks([])
    style_axes(ax, keep_left=False, keep_bottom=True)
    ax.legend(loc='upper left', bbox_to_anchor=(0, 1.06), ncol=3,
              frameon=False, fontsize=11.5, handlelength=1.1)
    fig.savefig(OUT + '/chart3_ca.png', facecolor='white')
    plt.close(fig)


# ─────────────────────────────────────────────────────────────
# Graphique 4 — CA vs charges totales (k€)
# ─────────────────────────────────────────────────────────────
def chart_ca_charges():
    years = ['2026', '2027', '2028']
    ca = [65.0, 150.0, 240.0]
    charges = [67.6, 105.0, 169.5]

    import numpy as np
    x = np.arange(len(years))
    w = 0.32
    fig, ax = plt.subplots(figsize=(7.8, 4.1), dpi=200, constrained_layout=True)
    b1 = ax.bar(x - w / 2, ca, w, color=C_DARK, label='Chiffre d’affaires')
    b2 = ax.bar(x + w / 2, charges, w, color=C_PALE, label='Charges totales')
    for bars, col in ((b1, C_TEXT), (b2, C_MUTED)):
        for b in bars:
            v = b.get_height()
            ax.text(b.get_x() + b.get_width() / 2, v + 5,
                    ('%.1f' % v).replace('.', ','), ha='center', va='bottom',
                    fontsize=11, color=col, fontweight='bold')
    # Ligne de repère seuil de rentabilité (expliquée dans la légende du document)
    ax.axhline(y=67.6, color=C_MID, linewidth=0.9, linestyle=(0, (4, 4)),
               alpha=0.65)
    ax.set_xticks(list(x))
    ax.set_xticklabels(years, fontsize=12, color=C_TEXT)
    ax.set_ylim(0, 275)
    ax.set_yticks([])
    style_axes(ax, keep_left=False, keep_bottom=True)
    ax.legend(loc='upper left', bbox_to_anchor=(0, 1.06), ncol=2,
              frameon=False, fontsize=11.5, handlelength=1.1)
    fig.savefig(OUT + '/chart4_ca_charges.png', facecolor='white')
    plt.close(fig)


if __name__ == '__main__':
    chart_marches()
    chart_ransomware()
    chart_ca()
    chart_ca_charges()
    print('4 graphiques générés dans', OUT)
