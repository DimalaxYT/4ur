# -*- coding: utf-8 -*-
"""Bibliotheque commune Business Plan 4UR — polices, palette, styles, helpers.
Route Report (ReportLab) — briefs/report.md.
Palette : monochrome 4UR (derivee de palette.cascade, teinte neutreWarm Gray
de palette.md, alignee sur la charte 4UR du client — saturations 0 <= plafonds).
"""
import os
import sys
import hashlib

PDF_SKILL_DIR = '/home/z/my-project/skills/pdf'
_scripts = os.path.join(PDF_SKILL_DIR, 'scripts')
if _scripts not in sys.path:
    sys.path.insert(0, _scripts)

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import (Paragraph, Spacer, Table, TableStyle, Image,
                                KeepTogether, CondPageBreak, PageBreak,
                                SimpleDocTemplate, HRFlowable)
from reportlab.platypus.tableofcontents import TableOfContents
from PIL import Image as PILImage

# ─────────────────────────────────────────────────────────────
# Polices (uniquement les polices autorisees par le brief Report)
# ─────────────────────────────────────────────────────────────
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('NotoSerifSC', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Noto Sans SC', f'{FONT_DIR}/truetype/chinese/SarasaMonoSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Noto Sans SC Bold', f'{FONT_DIR}/truetype/chinese/SarasaMonoSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('SarasaMonoSC', f'{FONT_DIR}/truetype/chinese/SarasaMonoSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif', f'{FONT_DIR}/truetype/freefont/FreeSerif.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Bold', f'{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Italic', f'{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-BoldItalic', f'{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', f'{FONT_DIR}/truetype/dejavu/DejaVuSansMono.ttf'))

registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold')
registerFontFamily('Noto Sans SC', normal='Noto Sans SC', bold='Noto Sans SC Bold')
registerFontFamily('FreeSerif', normal='FreeSerif', bold='FreeSerif-Bold',
                   italic='FreeSerif-Italic', boldItalic='FreeSerif-BoldItalic')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans')

from pdf import install_font_fallback  # noqa: E402
install_font_fallback()

# Correctif typographique : certains pourcentages sont ecrits '%%' par
# reflexe de formatage, y compris hors chaine formatee. Un '%%' ne doit
# jamais apparaitre tel quel dans le rendu -> on replie en '%'.
if not getattr(Paragraph, '_bp4ur_pct_patched', False):
    _orig_par_init = Paragraph.__init__

    def _bp4ur_par_init(self, text, *args, **kwargs):
        if isinstance(text, str) and '%%' in text:
            text = text.replace('%%', '%')
        _orig_par_init(self, text, *args, **kwargs)

    Paragraph.__init__ = _bp4ur_par_init
    Paragraph._bp4ur_pct_patched = True

# ─────────────────────────────────────────────────────────────
# Palette monochrome 4UR (structure cascade + charte client)
# Tiers respectes : XL/L/M/S/XS — toutes saturations = 0 (achromatique)
# ─────────────────────────────────────────────────────────────
PAGE_BG       = colors.HexColor('#ffffff')   # XL
SECTION_BG    = colors.HexColor('#f4f3f1')   # XL
CARD_BG       = colors.HexColor('#f2f1ef')   # L
TABLE_STRIPE  = colors.HexColor('#efeeec')   # L
HEADER_FILL   = colors.HexColor('#262523')   # M  (noir marque, S~0)
COVER_BLOCK   = colors.HexColor('#4a4844')   # M
BORDER        = colors.HexColor('#cfcecb')   # S
ICON          = colors.HexColor('#6e6b67')   # S
ACCENT        = colors.HexColor('#1a1a1a')   # XS (noir profond 4UR)
ACCENT_2      = colors.HexColor('#6e6b67')   # XS (gris marque)
TEXT_PRIMARY  = colors.HexColor('#262422')
TEXT_MUTED    = colors.HexColor('#7d7a76')

TABLE_HEADER_COLOR = HEADER_FILL
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = TABLE_STRIPE

# ─────────────────────────────────────────────────────────────
# Geometrie page
# ─────────────────────────────────────────────────────────────
MARGIN = 0.9 * inch                      # gauche = droite (symetrie)
TOP_MARGIN = 0.95 * inch
BOTTOM_MARGIN = 0.85 * inch
PAGE_W, PAGE_H = A4
AVAIL_W = PAGE_W - 2 * MARGIN
AVAIL_H = PAGE_H - TOP_MARGIN - BOTTOM_MARGIN
H1_ORPHAN_THRESHOLD = AVAIL_H * 0.25
MAX_KEEP_HEIGHT = PAGE_H * 0.4

DOC_TITLE = '4UR — Business Plan 2026-2028'
DOC_AUTHOR = '4UR — For Your Digital World.'

# ─────────────────────────────────────────────────────────────
# Styles (corps latin — FreeSerif, regle brief Report)
# ─────────────────────────────────────────────────────────────
S = {}
S['body'] = ParagraphStyle('body', fontName='FreeSerif', fontSize=10.5,
                           leading=17, alignment=TA_JUSTIFY,
                           textColor=TEXT_PRIMARY, spaceBefore=0, spaceAfter=9)
S['body_left'] = ParagraphStyle('body_left', parent=S['body'],
                                alignment=TA_LEFT)
S['lead'] = ParagraphStyle('lead', parent=S['body'], fontSize=11,
                           leading=18, textColor=TEXT_PRIMARY)
S['h1'] = ParagraphStyle('h1', fontName='FreeSerif', fontSize=22, leading=27,
                         textColor=ACCENT, spaceBefore=16, spaceAfter=4,
                         alignment=TA_LEFT)
S['h2'] = ParagraphStyle('h2', fontName='FreeSerif', fontSize=15, leading=20,
                         textColor=TEXT_PRIMARY, spaceBefore=14, spaceAfter=7,
                         alignment=TA_LEFT)
S['h3'] = ParagraphStyle('h3', fontName='FreeSerif', fontSize=11.5,
                         leading=16, textColor=TEXT_PRIMARY, spaceBefore=10,
                         spaceAfter=6, alignment=TA_LEFT)
S['kicker'] = ParagraphStyle('kicker', fontName='FreeSerif', fontSize=9,
                             leading=12, textColor=TEXT_MUTED, spaceAfter=2)
S['bullet'] = ParagraphStyle('bullet', parent=S['body_left'], leftIndent=16,
                             firstLineIndent=0, spaceAfter=5,
                             bulletIndent=4, bulletFontName='FreeSerif')
S['quote'] = ParagraphStyle('quote', parent=S['body_left'], fontName='FreeSerif-Italic',
                            leftIndent=24, textColor=TEXT_PRIMARY,
                            borderPadding=0, spaceBefore=6, spaceAfter=10)
S['caption'] = ParagraphStyle('caption', fontName='FreeSerif', fontSize=8.5,
                              leading=12, alignment=TA_CENTER,
                              textColor=TEXT_MUTED, spaceBefore=3,
                              spaceAfter=6)
S['toc_title'] = ParagraphStyle('toc_title', fontName='FreeSerif', fontSize=22,
                                leading=28, textColor=ACCENT, spaceAfter=18)
S['stat_num'] = ParagraphStyle('stat_num', fontName='FreeSerif', fontSize=19,
                               leading=23, textColor=ACCENT,
                               alignment=TA_CENTER)
S['stat_label'] = ParagraphStyle('stat_label', fontName='FreeSerif',
                                 fontSize=8.5, leading=11.5,
                                 textColor=TEXT_MUTED, alignment=TA_CENTER)
S['th'] = ParagraphStyle('th', fontName='FreeSerif', fontSize=9.5, leading=13,
                         textColor=colors.white, alignment=TA_LEFT)
S['td'] = ParagraphStyle('td', fontName='FreeSerif', fontSize=9, leading=13,
                         textColor=TEXT_PRIMARY, alignment=TA_LEFT)
S['td_c'] = ParagraphStyle('td_c', parent=S['td'], alignment=TA_CENTER)
S['td_r'] = ParagraphStyle('td_r', parent=S['td'], alignment=TA_RIGHT)
S['td_b'] = ParagraphStyle('td_b', parent=S['td'],
                           fontName='FreeSerif-Bold')
S['biblio'] = ParagraphStyle('biblio', parent=S['body_left'], fontSize=9,
                             leading=13.5, leftIndent=24,
                             firstLineIndent=-24, spaceAfter=4,
                             textColor=TEXT_PRIMARY)

TOC_L0 = ParagraphStyle('TOCH1', fontName='FreeSerif', fontSize=11.5,
                        leading=20, leftIndent=6, textColor=TEXT_PRIMARY)


# ─────────────────────────────────────────────────────────────
# Gabarit avec TOC automatique
# ─────────────────────────────────────────────────────────────
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            # Numerotation affichee : la page 1 du corps = sommaire (romain),
            # le chapitre 1 commence a la page suivante et affiche "1".
            displayed = max(1, self.page - 1)
            self.notify('TOCEntry', (level, text, displayed, key))


def heading(text, level=0, toc=True):
    """Titre avec ancre TOC. level 0 = chapitre (H1), 1 = section (H2).
    Seuls les chapitres alimentent le sommaire (une page garantie)."""
    style = S['h1'] if level == 0 else (S['h2'] if level == 1 else S['h3'])
    key = 'h_%s' % hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/><b>%s</b>' % (key, text), style)
    if toc and level == 0:
        p.bookmark_name = key
        p.bookmark_level = level
        p.bookmark_text = text
        p.bookmark_key = key
    return p


def h1_block(num, title, first_flowables):
    """Chapitre : saut conditionnel + filet + titre + 1er element lies."""
    label = '%d.  %s' % (num, title)
    rule = HRFlowable(width='100%', thickness=1.6, color=ACCENT,
                      spaceBefore=2, spaceAfter=10)
    head = heading(label, level=0)
    return [CondPageBreak(H1_ORPHAN_THRESHOLD)] + safe_keep_together(
        [head, rule] + first_flowables)


def safe_keep_together(elements):
    """KeepTogether plafonne a 40% de la hauteur de page (anti page vide)."""
    total_h = 0
    for el in elements:
        try:
            _w, h = el.wrap(AVAIL_W, PAGE_H)
        except Exception:
            h = 0
        total_h += h
    if total_h <= MAX_KEEP_HEIGHT:
        return [KeepTogether(elements)]
    elif len(elements) >= 2:
        return [KeepTogether(elements[:2])] + list(elements[2:])
    return list(elements)


def P(text, style='body'):
    return Paragraph(text, S[style])


def bullet(text):
    return Paragraph(text, S['bullet'], bulletText='•')


def embed_image(path, max_width=None, max_height=None):
    """Image a echelle proportionnelle contrainte (overflow.md)."""
    if max_width is None:
        max_width = AVAIL_W
    if max_height is None:
        max_height = PAGE_H * 0.35
    pil = PILImage.open(path)
    ow, oh = pil.size
    ratio = min(max_width / ow if ow > max_width else 1.0,
                max_height / oh if oh > max_height else 1.0)
    return Image(path, width=ow * ratio, height=oh * ratio)


def chart_block(png_path, caption_text, max_width=None, max_height=None):
    """Graphique + legende : 24pt avant, 8pt vers legende, 18pt apres."""
    img = embed_image(png_path, max_width=max_width, max_height=max_height)
    img.hAlign = 'CENTER'
    cap = Paragraph(caption_text, S['caption'])
    out = [Spacer(1, 14)]
    out += safe_keep_together([img, Spacer(1, 6), cap])
    out.append(Spacer(1, 12))
    return out


def stat_row(stats):
    """Rangee de CalloutBox (Data-to-Ink) : [(nombre, libelle), ...]."""
    n = len(stats)
    gap = 10
    cell_w = (AVAIL_W - gap * (n - 1)) / n
    cells, widths = [], []
    for i, (num, label) in enumerate(stats):
        inner = Table(
            [[Paragraph('<b>%s</b>' % num, S['stat_num'])],
             [Paragraph(label, S['stat_label'])]],
            colWidths=[cell_w])
        inner.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
            ('BOX', (0, 0), (-1, -1), 0.8, BORDER),
            ('LINEABOVE', (0, 0), (0, 0), 2, ACCENT),
            ('TOPPADDING', (0, 0), (0, 0), 9),
            ('BOTTOMPADDING', (0, 0), (0, 0), 2),
            ('TOPPADDING', (0, 1), (0, 1), 1),
            ('BOTTOMPADDING', (0, 1), (0, 1), 9),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        cells.append(inner)
        widths.append(cell_w)
        if i < n - 1:
            cells.append('')
            widths.append(gap)
    outer = Table([cells], colWidths=widths, hAlign='CENTER')
    outer.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    return [Spacer(1, 8), outer, Spacer(1, 12)]


def make_table(header, rows, ratios, align_map=None, caption_text=None,
               bold_last_row=False):
    """Tableau standard : cells Paragraph, largeur <= AVAIL_W, centre."""
    align_map = align_map or {}
    col_widths = [r * AVAIL_W for r in ratios]
    assert sum(col_widths) <= AVAIL_W + 0.5, 'table trop large'
    data = [[Paragraph('<b>%s</b>' % h, S['th']) for h in header]]
    for row in rows:
        line = []
        for j, cell in enumerate(row):
            st = S[align_map.get(j, 'td')]
            line.append(Paragraph(str(cell), st))
        data.append(line)
    t = Table(data, colWidths=col_widths, hAlign='CENTER', repeatRows=1)
    style = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 5.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5.5),
    ]
    for i in range(1, len(data)):
        style.append(('BACKGROUND', (0, i), (-1, i),
                      TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD))
    if bold_last_row:
        style.append(('BACKGROUND', (0, len(data) - 1), (-1, len(data) - 1),
                      CARD_BG))
    t.setStyle(TableStyle(style))
    out = [Spacer(1, 12), t]
    if caption_text:
        out += [Spacer(1, 4), Paragraph(caption_text, S['caption'])]
    out.append(Spacer(1, 10))
    return out


def callout(text):
    """Encart accent : filet gauche 4px + fond teinte."""
    inner = Table([[Paragraph(text, S['body_left'])]], colWidths=[AVAIL_W - 8])
    inner.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), SECTION_BG),
        ('LINEBEFORE', (0, 0), (0, -1), 3.2, ACCENT),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    return [Spacer(1, 6), inner, Spacer(1, 10)]


# ─────────────────────────────────────────────────────────────
# En-tete / pied de page
# ─────────────────────────────────────────────────────────────
ROMAN = {1: 'i', 2: 'ii', 3: 'iii', 4: 'iv', 5: 'v'}


def on_page(canvas, doc):
    canvas.saveState()
    # En-tete : titre + filet accent pleine largeur
    canvas.setFont('FreeSerif', 7.5)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(MARGIN, PAGE_H - 0.62 * inch, DOC_TITLE)
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(1.2)
    canvas.line(MARGIN, PAGE_H - 0.70 * inch,
                PAGE_W - MARGIN, PAGE_H - 0.70 * inch)
    # Pied : auteur a gauche, numero a droite, filet leger
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 0.62 * inch, PAGE_W - MARGIN, 0.62 * inch)
    canvas.setFont('FreeSerif', 7.5)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(MARGIN, 0.44 * inch, DOC_AUTHOR)
    if doc.page <= 1:
        num = ROMAN.get(doc.page, 'i')          # avant-propos : romain
    else:
        num = str(doc.page - 1)                 # corps : arabe reset a 1
    canvas.drawRightString(PAGE_W - MARGIN, 0.44 * inch, num)
    canvas.restoreState()
