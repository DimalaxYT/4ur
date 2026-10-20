# -*- coding: utf-8 -*-
"""Business Plan 4UR — assemblage TOC + chapitres + build + fusion couverture."""
import os
from bp4ur_common import (TocDocTemplate, TableOfContents, Paragraph, Spacer,
                          PageBreak, S, TOC_L0, on_page, MARGIN, TOP_MARGIN,
                          BOTTOM_MARGIN, A4)
import bp4ur_part1
import bp4ur_part2

ASSETS = '/home/z/my-project/bp4ur_assets'
BODY_PDF = os.path.join(ASSETS, 'body_4ur.pdf')
COVER_PDF = os.path.join(ASSETS, 'cover_4ur.pdf')
FINAL_PDF = '/home/z/my-project/download/Business_Plan_4UR.pdf'

# ── Story ────────────────────────────────────────────────────
story = []

# Sommaire (page i, chiffres romains)
story.append(Paragraph('<b>Sommaire</b>', S['toc_title']))
toc = TableOfContents()
toc.levelStyles = [TOC_L0]
story.append(toc)
story.append(PageBreak())

# Corps : chapitres 1-9
bp4ur_part1.build(story)
bp4ur_part2.build(story)

# ── Build corps (multiBuild obligatoire pour le TOC) ─────────
doc = TocDocTemplate(
    BODY_PDF, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=TOP_MARGIN, bottomMargin=BOTTOM_MARGIN,
    title='4UR — Business Plan 2026-2028',
    author='Z.ai', creator='Z.ai',
    subject='Business plan de création : sites web, chatbots et '
            'cybersécurité pour TPE/PME/startups')
doc.multiBuild(story, onFirstPage=on_page, onLaterPages=on_page)
print('Corps genere :', BODY_PDF)

# ── Fusion couverture + corps → PDF unique ───────────────────
from pypdf import PdfReader, PdfWriter

A4_W, A4_H = 595.28, 841.89


def normalize_page_to_a4(page):
    box = page.mediabox
    w, h = float(box.width), float(box.height)
    if abs(w - A4_W) > 0.2 or abs(h - A4_H) > 0.2:
        page.scale_to(A4_W, A4_H)
    return page


writer = PdfWriter()
cover_page = PdfReader(COVER_PDF).pages[0]
writer.add_page(normalize_page_to_a4(cover_page))
for page in PdfReader(BODY_PDF).pages:
    writer.add_page(normalize_page_to_a4(page))
writer.add_metadata({
    '/Title': '4UR — Business Plan 2026-2028',
    '/Author': 'Z.ai',
    '/Creator': 'Z.ai',
    '/Subject': 'Business plan de création : sites web, chatbots et '
                'cybersécurité pour TPE/PME/startups',
})
os.makedirs(os.path.dirname(FINAL_PDF), exist_ok=True)
with open(FINAL_PDF, 'wb') as f:
    writer.write(f)
print('PDF final :', FINAL_PDF)
