"""
MaLuDa IT School — Generate 3 Strategic PDF Documents
Run: python generate_pdfs.py
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.units import mm, cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ═══════════════════════════════════════════════════════════════
# STYLE SETUP
# ═══════════════════════════════════════════════════════════════

NAVY = HexColor("#1a237e")
DARK = HexColor("#212121")
ACCENT = HexColor("#0d47a1")
LIGHT_BG = HexColor("#e8eaf6")
GREEN = HexColor("#2e7d32")
RED = HexColor("#c62828")
ORANGE = HexColor("#e65100")
GREY = HexColor("#757575")
WHITE = white

def get_styles():
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        'DocTitle', parent=styles['Title'],
        fontSize=22, textColor=NAVY, spaceAfter=6, spaceBefore=0,
        alignment=TA_CENTER, leading=26
    ))
    styles.add(ParagraphStyle(
        'DocSubtitle', parent=styles['Normal'],
        fontSize=11, textColor=GREY, alignment=TA_CENTER,
        spaceAfter=20, spaceBefore=2
    ))
    styles.add(ParagraphStyle(
        'H1', parent=styles['Heading1'],
        fontSize=16, textColor=NAVY, spaceBefore=18, spaceAfter=8,
        leading=20
    ))
    styles.add(ParagraphStyle(
        'H2', parent=styles['Heading2'],
        fontSize=13, textColor=ACCENT, spaceBefore=12, spaceAfter=6,
        leading=16
    ))
    styles.add(ParagraphStyle(
        'H3', parent=styles['Heading3'],
        fontSize=11, textColor=DARK, spaceBefore=8, spaceAfter=4,
        leading=14
    ))
    styles.add(ParagraphStyle(
        'Body', parent=styles['Normal'],
        fontSize=10, textColor=DARK, alignment=TA_JUSTIFY,
        spaceAfter=6, leading=14
    ))
    styles.add(ParagraphStyle(
        'BodyRu', parent=styles['Normal'],
        fontSize=9.5, textColor=GREY, alignment=TA_JUSTIFY,
        spaceAfter=6, leading=13, fontName='Helvetica-Oblique'
    ))
    styles.add(ParagraphStyle(
        'MBullet', parent=styles['Normal'],
        fontSize=10, textColor=DARK, leftIndent=18,
        spaceAfter=3, leading=13, bulletIndent=6
    ))
    styles.add(ParagraphStyle(
        'MBulletRu', parent=styles['Normal'],
        fontSize=9.5, textColor=GREY, leftIndent=18,
        spaceAfter=3, leading=12, bulletIndent=6, fontName='Helvetica-Oblique'
    ))
    styles.add(ParagraphStyle(
        'Warning', parent=styles['Normal'],
        fontSize=10, textColor=RED, spaceBefore=4, spaceAfter=4,
        leading=13, fontName='Helvetica-Bold'
    ))
    styles.add(ParagraphStyle(
        'Highlight', parent=styles['Normal'],
        fontSize=10, textColor=GREEN, spaceBefore=4, spaceAfter=4,
        leading=13, fontName='Helvetica-Bold'
    ))
    styles.add(ParagraphStyle(
        'TableCell', parent=styles['Normal'],
        fontSize=9, textColor=DARK, leading=12
    ))
    styles.add(ParagraphStyle(
        'Footer', parent=styles['Normal'],
        fontSize=8, textColor=GREY, alignment=TA_CENTER
    ))
    return styles

def hr():
    return HRFlowable(width="100%", thickness=0.5, color=LIGHT_BG, spaceAfter=8, spaceBefore=8)

def section_box(text, styles):
    """A highlighted box section"""
    tdata = [[Paragraph(text, styles['Body'])]]
    t = Table(tdata, colWidths=[460])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 0.5, ACCENT),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    return t

def make_table(headers, rows, col_widths=None):
    """Create a styled table"""
    s = getSampleStyleSheet()
    hstyle = ParagraphStyle('th', parent=s['Normal'], fontSize=9, textColor=white, fontName='Helvetica-Bold', leading=12)
    cstyle = ParagraphStyle('td', parent=s['Normal'], fontSize=9, textColor=DARK, leading=12)

    data = [[Paragraph(h, hstyle) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), cstyle) for c in row])

    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('TOPPADDING', (0,0), (-1,0), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, LIGHT_BG]),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor("#bdbdbd")),
        ('TOPPADDING', (0,1), (-1,-1), 4),
        ('BOTTOMPADDING', (0,1), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]
    t.setStyle(TableStyle(style_cmds))
    return t

def build_pdf(filename, title, subtitle, build_func):
    """Build a PDF document"""
    styles = get_styles()
    filepath = os.path.join(os.path.dirname(__file__), filename)

    doc = SimpleDocTemplate(
        filepath, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm,
        title=title, author="MaLuDa IT School"
    )

    story = []
    story.append(Spacer(1, 30))
    story.append(Paragraph("MALUDA IT SCHOOL", styles['DocTitle']))
    story.append(Paragraph(title, styles['H1']))
    story[-1].style = ParagraphStyle('TitleSub', parent=styles['H1'], alignment=TA_CENTER, spaceBefore=2)
    story.append(Paragraph(subtitle, styles['DocSubtitle']))
    story.append(hr())
    story.append(Paragraph("INTERNAL DOCUMENT | April 2026 | Confidential", styles['Footer']))
    story.append(Spacer(1, 10))
    story.append(hr())

    build_func(story, styles)

    doc.build(story)
    print(f"  [OK] {filepath}")
    return filepath


# ═══════════════════════════════════════════════════════════════
# DOCUMENT 1: STRATEGY & VISION
# ═══════════════════════════════════════════════════════════════

def build_strategy(story, s):

    # --- TABLE OF CONTENTS ---
    story.append(Paragraph("Table of Contents", s['H1']))
    toc_items = [
        "1. Executive Summary",
        "2. Where We Are Today (Honest Assessment)",
        "3. 6-Month Strategic Vision (Apr-Oct 2026)",
        "4. Marketing Strategy",
        "5. Revenue & Growth Targets",
        "6. Future Development Roadmap",
        "7. Risk Matrix & Mitigation",
        "8. Critical Success Factors",
        "9. Russian Summary / Klyuchevye Vyvody"
    ]
    for item in toc_items:
        story.append(Paragraph(item, s['MBullet']))
    story.append(PageBreak())

    # --- 1. EXECUTIVE SUMMARY ---
    story.append(Paragraph("1. Executive Summary", s['H1']))
    story.append(Paragraph(
        "MaLuDa is positioned to become the <b>first and only in-person IT school in Batumi</b>. "
        "This is a genuine first-mover advantage in a city with 200,000+ residents, a growing tech/nomad community, "
        "and zero local competitors offering structured, in-person IT education. "
        "Our strategy is built on one principle: <b>prove the model locally before scaling</b>.", s['Body']))
    story.append(Spacer(1, 4))
    story.append(section_box(
        "<b>The Core Bet:</b> Batumi's tight social fabric means one successful cohort of 8-15 students "
        "generates enough word-of-mouth to fill the next 2-3 cohorts. Our entire strategy depends on "
        "making the first cohort extraordinary. Everything else is secondary.", s))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<i>RU: MaLuDa -- pervaya i edinstvennaya ochno-tekhnicheskaya shkola v Batumi. "
        "Nasha strategiya: dokazat' model' lokal'no, zatem masshtabirovat'. "
        "Pervyy nabor dolzhen byt' isklyuchitel'nym -- ot etogo zavisit vse dal'neyshee.</i>", s['BodyRu']))

    # --- 2. HONEST ASSESSMENT ---
    story.append(Paragraph("2. Where We Are Today -- Honest Assessment", s['H1']))
    story.append(Paragraph("2.1 Strengths (Leverage These)", s['H2']))
    strengths = [
        "<b>Zero competition locally</b> -- no in-person IT school in Batumi exists",
        "<b>Martin's expertise</b> -- real industry experience in DA, DevOps, Cloud, AI/ML",
        "<b>Low fixed costs</b> -- Sakhli at 60 GEL/hr means we break even at 3 students per course",
        "<b>Complete curriculum ready</b> -- 4 courses fully designed with Batumi-specific exercises",
        "<b>Gamification system designed</b> -- XP, badges, leaderboards -- a real differentiator",
        "<b>Social fabric of Batumi</b> -- word-of-mouth travels fast in a 200K city"
    ]
    for item in strengths:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(Paragraph("2.2 Weaknesses (Address These)", s['H2']))
    weaknesses = [
        "<b>Martin is a single point of failure</b> -- teaches 3 of 4 courses. If he's unavailable, 75% of revenue stops.",
        "<b>No brand recognition yet</b> -- the April 11 event is literally Day Zero",
        "<b>No website or online presence</b> -- relying entirely on Telegram/Instagram and personal outreach",
        "<b>No track record</b> -- zero graduates, zero testimonials, zero social proof",
        "<b>Team is 3 people</b> -- limited bandwidth for simultaneous execution",
        "<b>Cash buffer is thin</b> -- $500-1,000 personal money from founders is the only safety net"
    ]
    for item in weaknesses:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(Paragraph("2.3 Critical Honest Truth", s['H2']))
    story.append(Paragraph(
        '<font color="#c62828"><b>WARNING:</b></font> The biggest psychological trap for a startup like MaLuDa is '
        '<b>planning for scale before proving demand</b>. The CIS expansion, online courses, and ISA models '
        'are exciting -- but they are Month 5+ problems. Right now, the only question that matters is: '
        '"Can we get 8+ paying students in April and keep them through May?"', s['Body']))

    story.append(Paragraph(
        "<i>RU: Samaya bol'shaya psikhologicheskaya lovushka -- planirovat' masshtabirovanie do togo, kak dokazan spros. "
        "Seychas vazhno tol'ko odno: mozhno li nabrat' 8+ platyashchikh studentov v aprele i uderzhat' ikh do maya?</i>", s['BodyRu']))

    story.append(PageBreak())

    # --- 3. 6-MONTH VISION ---
    story.append(Paragraph("3. 6-Month Strategic Vision (April -- October 2026)", s['H1']))

    phases = [
        ("Phase 1: PROVE (April -- May)", "Survive & Validate", [
            "Launch free event April 11. Target: 30+ attendees, 8+ sign-ups",
            "Start Python+SQL course April 14 with first cohort",
            "Launch Data Analysis course in May if first cohort reaches 5+ students",
            "Activate referral program ('Bring Your Crew')",
            "Collect video testimonials from every student by Week 4",
            "Revenue target: $600-1,600/mo (April), $1,800-2,800/mo (May)",
            "SUCCESS METRIC: 70%+ student retention after 4 weeks"
        ]),
        ("Phase 2: BUILD (June -- July)", "Brand & Profitability", [
            "Launch PM course (Andy teaches) -- reduces Martin dependency",
            "Launch DevOps/Cloud course ($200/mo -- highest margin)",
            "Build simple website (landing page + course info + testimonials)",
            "Pursue Technopark partnership for credibility + potential venue",
            "First student showcase/demo event",
            "Revenue target: $2,800-4,500/mo (June), $4,200-7,000/mo (July)",
            "SUCCESS METRIC: Profitable for 2 consecutive months"
        ]),
        ("Phase 3: SCALE (August -- October)", "Online & CIS Expansion", [
            "Record video content from live courses (low-cost content creation)",
            "Select and implement LMS (Stepik or Thinkific)",
            "Recruit first assistant instructor (from top graduates)",
            "Launch online Python+SQL course -- Russian language first",
            "Begin CIS market outreach (Georgia, Armenia, Kazakhstan)",
            "Revenue target: $4,500-10,000/mo",
            "SUCCESS METRIC: 5+ online students from outside Batumi"
        ])
    ]

    for title, subtitle, items in phases:
        story.append(Paragraph(f"{title}", s['H2']))
        story.append(Paragraph(f"<i>Goal: {subtitle}</i>", s['Body']))
        for item in items:
            story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))
        story.append(Spacer(1, 4))

    story.append(section_box(
        "<b>Non-Negotiable Rule:</b> Do NOT advance to the next phase until the current phase's success metric is met. "
        "Scaling a broken model just makes it break faster.", s))

    story.append(Paragraph(
        "<i>RU: NEPRELOZHNOE PRAVILO: ne perekhodite k sleduyushchey faze, poka ne dostignut klyuchevoy pokazatel' tekushchey. "
        "Masshtabirovanie slomannoy modeli tol'ko uskorit proval.</i>", s['BodyRu']))

    story.append(PageBreak())

    # --- 4. MARKETING STRATEGY ---
    story.append(Paragraph("4. Marketing Strategy", s['H1']))

    story.append(Paragraph("4.1 Core Positioning", s['H2']))
    story.append(section_box(
        "<b>Positioning Statement:</b> For career switchers and professionals in Batumi who want practical IT skills, "
        "MaLuDa is the only in-person IT school combining real-world projects, small classes (8-15 students), "
        "and a local professional community. Unlike online courses (90% dropout) or Tbilisi bootcamps (far and expensive), "
        "MaLuDa delivers results in your city, with people you know.", s))
    story.append(Spacer(1, 6))

    story.append(Paragraph("4.2 Marketing Channels (Priority Order)", s['H2']))
    channels = [
        ["1. Personal outreach", "Highest ROI", "Each team member contacts 30+ people personally. Target: 67% conversion to event attendance. This is your #1 channel in Batumi."],
        ["2. Telegram groups", "Free, high reach", "Batumi Expats, Digital Nomads, IT Batumi, Jobs Batumi groups. Post value-first content, not ads."],
        ["3. Instagram", "Brand building", "3-4 posts/week: educational content, behind-the-scenes, student stories. Martin's personal brand is the asset."],
        ["4. Word-of-mouth", "Compounding", "Referral program: 20% off for referrer, 10% for friend. Launch bonus: doubled rewards Apr-May."],
        ["5. Local partnerships", "Credibility", "Technopark (May), coworking spaces, cafes with flyer placement, local businesses needing IT training."],
        ["6. Events", "Lead generation", "Monthly free/low-cost events. Events are high-margin (break even at 2 attendees) AND generate leads."],
    ]
    story.append(make_table(
        ["Channel", "Why", "How"],
        channels,
        col_widths=[90, 80, 290]
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("4.3 Content Strategy", s['H2']))
    story.append(Paragraph(
        "Content must follow the <b>80/20 rule</b>: 80% educational value, 20% promotional. "
        "Every post should make someone think 'These people actually know what they're talking about.'", s['Body']))
    content_types = [
        "Weekly 'IT fact' posts (Batumi-relevant data, industry stats)",
        "Martin's 'from the trenches' stories (real-world DA/DevOps experience)",
        "Student progress updates (with permission) -- the most powerful content you'll create",
        "Behind-the-scenes of course creation (builds anticipation and trust)",
        "Free mini-lessons (5-min SQL trick, Python tip) -- proves quality before purchase"
    ]
    for item in content_types:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(Paragraph("4.4 Enrollment Funnel & Conversion Targets", s['H2']))
    funnel = [
        ["Awareness", "1,000+", "Social media, events, personal outreach"],
        ["Interest", "200+", "Telegram group joins, DM conversations"],
        ["Registration", "50+", "Event sign-ups, course inquiries"],
        ["Decision", "25+", "Attended event or trial class"],
        ["Payment", "12-18", "Enrolled in a paid course"],
        ["Retention", "10-15", "Completed Month 1 and continued"],
    ]
    story.append(make_table(
        ["Stage", "Target (Month 1-2)", "Primary Driver"],
        funnel,
        col_widths=[80, 100, 280]
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Key insight:</b> In Batumi, the funnel is shorter than in a big city. People know each other. "
        "A personal recommendation from a trusted friend can move someone from Awareness to Payment in one conversation. "
        "This is why personal outreach is Channel #1.", s['Body']))

    story.append(Paragraph("4.5 Anti-Patterns to Avoid", s['H2']))
    anti = [
        "<font color='#c62828'><b>DO NOT</b></font> spend money on paid ads until you've exhausted free channels (Month 3+)",
        "<font color='#c62828'><b>DO NOT</b></font> post generic 'learn to code' content -- always Batumi-specific",
        "<font color='#c62828'><b>DO NOT</b></font> spam Telegram groups -- you'll get banned and damage the brand",
        "<font color='#c62828'><b>DO NOT</b></font> promise job placement before you have employer partnerships",
        "<font color='#c62828'><b>DO NOT</b></font> discount below cost to fill seats -- it trains people to wait for sales"
    ]
    for item in anti:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(Paragraph(
        "<i>RU: Marketing strategiya: 80% tsennosti, 20% reklamy. Lichnyy kontakt -- kanal #1 v Batumi. "
        "Ne tratit' den'gi na reklamu do ispolzovaniya vsekh besplatnykh kanalov.</i>", s['BodyRu']))

    story.append(PageBreak())

    # --- 5. REVENUE & GROWTH ---
    story.append(Paragraph("5. Revenue & Growth Targets", s['H1']))

    story.append(Paragraph("5.1 Monthly Revenue Projections (3 Scenarios)", s['H2']))
    rev = [
        ["April", "$600", "$1,100", "$1,600"],
        ["May", "$1,800", "$2,300", "$2,800"],
        ["June", "$2,800", "$3,600", "$4,500"],
        ["July", "$4,200", "$5,600", "$7,000"],
        ["August", "$4,500", "$6,000", "$7,500"],
        ["September", "$5,500", "$7,500", "$10,000"],
        ["October", "$6,500", "$9,000", "$12,000"],
        ["<b>6-Mo Total</b>", "<b>$25,900</b>", "<b>$35,100</b>", "<b>$45,400</b>"],
    ]
    story.append(make_table(
        ["Month", "Conservative", "Moderate", "Optimistic"],
        rev,
        col_widths=[80, 130, 130, 130]
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("5.2 Unit Economics", s['H2']))
    unit = [
        ["Python + SQL", "$120/mo", "3 students", "$240", "8 weeks"],
        ["Data Analysis", "$150/mo", "3 students", "$300", "8 weeks"],
        ["Project Mgmt", "$120/mo", "3 students", "$180", "6 weeks"],
        ["DevOps/Cloud", "$200/mo", "2 students", "$400", "8 weeks"],
    ]
    story.append(make_table(
        ["Course", "Monthly Fee", "Break-Even", "Total per Student", "Duration"],
        unit,
        col_widths=[90, 80, 80, 100, 80]
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Critical:</b> Break-even is calculated on venue cost only (60 GEL/hr = ~$22/hr). "
        "Martin and Sasha's time is not costed. This is fine for Phase 1 (proving the model) "
        "but must change by Phase 2 when instructor pay needs to be factored in.", s['Body']))

    story.append(Paragraph("5.3 Cash Flow Warning", s['H2']))
    story.append(Paragraph(
        '<font color="#c62828"><b>April is the danger zone.</b></font> '
        "Expected net: -$100 to +$258. Founders must have $500-1,000 personal buffer ready. "
        "The free event costs ~312 GEL ($115). Course revenue won't arrive until mid-to-late April. "
        "Manage this gap with pre-registration deposits (even $20 secures a seat and provides cash flow).", s['Body']))

    story.append(PageBreak())

    # --- 6. FUTURE DEVELOPMENT ---
    story.append(Paragraph("6. Future Development Roadmap", s['H1']))

    story.append(Paragraph("6.1 Product Evolution", s['H2']))
    evolution = [
        ["Month 1-2", "4 in-person courses", "Batumi locals", "Prove product-market fit"],
        ["Month 3-4", "+ Bundle pricing + Corporate workshops", "+ Local businesses", "Diversify revenue"],
        ["Month 5-6", "+ Online courses (Russian)", "+ CIS market", "Scale beyond Batumi"],
        ["Month 7-9", "+ ISA model + Mentorship tier", "+ Career switchers with skin-in-the-game", "Premium positioning"],
        ["Month 10-12", "+ English content + Partnerships", "+ International remote workers", "Full market coverage"],
    ]
    story.append(make_table(
        ["Timeline", "Product", "New Audience", "Strategic Goal"],
        evolution,
        col_widths=[70, 140, 130, 120]
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("6.2 Technology Roadmap", s['H2']))
    tech = [
        "Month 1-2: Google Sheets for everything (gamification, CRM, finances). Low-tech is fine.",
        "Month 3: Simple website (Tilda or Carrd -- $0-$19/mo). Just landing + course pages + testimonials.",
        "Month 5: LMS selection (Stepik for Russian market, Thinkific for English). Don't build custom.",
        "Month 7+: Telegram bot for gamification tracking (only if manual tracking becomes bottleneck).",
        "Month 9+: Consider custom platform ONLY if online revenue exceeds $5,000/mo."
    ]
    for item in tech:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(Paragraph("6.3 Team Scaling Triggers", s['H2']))
    story.append(Paragraph(
        "Do NOT hire proactively. Hire reactively based on specific triggers:", s['Body']))
    triggers = [
        ["Trigger", "Action", "Timeline"],
        ["15+ students in one course", "Hire teaching assistant (from top graduates, 30-40% revenue share)", "When it happens"],
        ["Martin teaching 4+ courses", "Recruit second instructor (local dev or remote)", "Before burnout"],
        ["3+ months profitable", "Move Andy to fixed salary", "Month 3-4"],
        ["Online students > 10", "Hire content editor / community manager", "Month 6+"],
        ["Wait list for courses", "Consider second venue or shift times", "When it happens"],
    ]
    story.append(make_table(
        triggers[0], triggers[1:],
        col_widths=[150, 220, 90]
    ))

    story.append(PageBreak())

    # --- 7. RISK MATRIX ---
    story.append(Paragraph("7. Risk Matrix & Mitigation", s['H1']))
    risks = [
        ["Martin unavailable (illness, travel)", "HIGH", "CRITICAL", "Cross-train Andy on Python basics; record all lectures; identify backup instructor by Month 3"],
        ["Low event turnout (<15 people)", "MEDIUM", "HIGH", "Personal outreach to 100+ contacts; have backup plan for intimate format; postpone rather than deliver weak event"],
        ["Students drop after Month 1", "MEDIUM", "HIGH", "See Document 3 (Retention Strategy); weekly check-ins; flexible scheduling; strong community"],
        ["Cash flow gap in April", "HIGH", "MEDIUM", "Pre-registration deposits; founders' $500-1K buffer; delay non-essential spending"],
        ["Competitor enters Batumi", "LOW", "MEDIUM", "First-mover + community loyalty is the moat; focus on student outcomes, not price competition"],
        ["Reputational damage (bad review)", "LOW", "HIGH", "NPS surveys after every cohort; address issues within 24hrs; offer course credit for legitimate complaints"],
    ]
    story.append(make_table(
        ["Risk", "Probability", "Impact", "Mitigation"],
        risks,
        col_widths=[120, 60, 60, 220]
    ))

    story.append(Spacer(1, 8))

    # --- 8. CRITICAL SUCCESS FACTORS ---
    story.append(Paragraph("8. Critical Success Factors", s['H1']))
    story.append(Paragraph(
        "If you do nothing else, do these 5 things:", s['Body']))
    csf = [
        "<b>1. Make the April 11 event unforgettable.</b> First impressions in Batumi define you. Rehearse. Over-prepare. Deliver value that makes people text their friends during the event.",
        "<b>2. Obsess over the first cohort.</b> These 8-15 students are your entire marketing department. Their success stories = your future revenue.",
        "<b>3. Collect testimonials ruthlessly.</b> Video > text. Before/after stories > generic praise. One genuine student transformation story is worth 100 Instagram posts.",
        "<b>4. Protect Martin's bandwidth.</b> He is the product. If he burns out, MaLuDa dies. Andy must absorb everything non-teaching.",
        "<b>5. Track numbers weekly.</b> Revenue, students, retention, leads. If you can't measure it, you can't manage it. Andy owns this."
    ]
    for item in csf:
        story.append(Paragraph(item, s['Body']))
        story.append(Spacer(1, 2))

    story.append(PageBreak())

    # --- 9. RUSSIAN SUMMARY ---
    story.append(Paragraph("9. Klyuchevye Vyvody (Russian Summary)", s['H1']))
    story.append(Paragraph(
        "<i>Etot razdel -- kratkoe izlozhenie dlya bystroy spravki.</i>", s['BodyRu']))
    story.append(Spacer(1, 4))

    ru_points = [
        "<b>Pozitsionirovanie:</b> MaLuDa -- edinstvennaya ochnaya IT-shkola v Batumi. Nikakikh konkurentov. Pervoe preimushchestvo na rynke.",
        "<b>Strategiya:</b> 3 fazy -- DOKAZAT' (apr-may), POSTROIT' (iyun'-iyul'), MASSHTABIROVAT' (avg-okt). Ne perekhodit' k sleduyushchey faze bez dostizheniia KPI tekushchey.",
        "<b>Marketing:</b> Lichnyy kontakt -- kanal #1. 80% tsennosti, 20% reklamy. Ne tratit' den'gi na reklamu do 3 mesyatsa.",
        "<b>Finansy:</b> Tochka bezubytochnosti -- 3 studenta na kurs. Aprel' opasen po denezhnomy potoku -- nuzhen bufer $500-1K.",
        "<b>Riski:</b> Martin -- edinstvennaya tochka otkaza. Nuzhna strategiya rezervnogo kopirovaniya k 3 mesyatsu.",
        "<b>Klyuchevaya mysl':</b> Pervaya kogorta -- eto vash ves' marketing. Ikh uspekh = vashe budushchee.",
    ]
    for item in ru_points:
        story.append(Paragraph(item, s['Body']))
        story.append(Spacer(1, 3))


# ═══════════════════════════════════════════════════════════════
# DOCUMENT 2: COURSES, TOOLS & TEACHER RULES
# ═══════════════════════════════════════════════════════════════

def build_courses(story, s):

    story.append(Paragraph("Table of Contents", s['H1']))
    toc = [
        "1. Course Portfolio Overview",
        "2. Detailed Course Breakdown",
        "3. Tools & Technology Stack",
        "4. Universal Teacher Rules (Non-Negotiable)",
        "5. Curriculum Design Standards",
        "6. Gamification Integration Rules",
        "7. Quality Control & Assessment Standards",
        "8. Instructor Onboarding Checklist",
        "9. Russian Summary / Kratkie Pravila"
    ]
    for item in toc:
        story.append(Paragraph(item, s['MBullet']))
    story.append(PageBreak())

    # --- 1. COURSE PORTFOLIO ---
    story.append(Paragraph("1. Course Portfolio Overview", s['H1']))
    story.append(Paragraph(
        "MaLuDa offers 4 courses aligned with the '3 Pillars of IT' framework: "
        "Management, Development, and Computer Science/Data. Each course is designed "
        "to be self-contained but complementary. Students can take individual courses or bundles.", s['Body']))
    story.append(Spacer(1, 4))

    courses = [
        ["Python + SQL Fundamentals", "Martin", "8 wk / 32 hrs", "$120/mo ($240 total)", "Complete beginners", "Development + Data"],
        ["Data Analysis", "Martin", "8 wk / 32 hrs", "$150/mo ($300 total)", "Basic tech skills", "Computer Science"],
        ["Project Management", "Andy", "6 wk / 24 hrs", "$120/mo ($180 total)", "Career switchers", "Management"],
        ["DevOps & Cloud (AWS)", "Martin", "8 wk / 32 hrs", "$200/mo ($400 total)", "Junior devs", "Development"],
    ]
    story.append(make_table(
        ["Course", "Instructor", "Duration", "Price", "Target Audience", "IT Pillar"],
        courses,
        col_widths=[90, 50, 65, 85, 80, 80]
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("1.1 Bundle Pricing", s['H2']))
    bundles = [
        ["Data Track (Python+SQL -> DA)", "$460", "$80 (15%)", "Career switchers into data roles"],
        ["Full Stack Analyst (Python+SQL -> DA -> DevOps)", "$750", "$190 (20%)", "Aspiring full-stack data professionals"],
        ["Manager+Tech (PM + Python+SQL)", "$360", "$60 (14%)", "Team leads wanting tech literacy"],
        ["All Four Courses", "$850", "$270 (24%)", "Maximum commitment, maximum discount"],
    ]
    story.append(make_table(
        ["Bundle", "Price", "Savings", "Best For"],
        bundles,
        col_widths=[140, 60, 80, 180]
    ))

    story.append(Paragraph("1.2 Course Sequencing Recommendations", s['H2']))
    story.append(Paragraph(
        "Guide students to the right path based on their background:", s['Body']))
    paths = [
        "<b>Complete beginner:</b> Python+SQL -> Data Analysis -> (optional) DevOps",
        "<b>Career switcher (non-tech):</b> Project Management -> Python+SQL",
        "<b>Junior developer:</b> DevOps/Cloud (can start here directly)",
        "<b>Business professional:</b> Data Analysis (with Python+SQL primer pre-work)",
        "<b>Wants everything:</b> Python+SQL -> DA -> PM -> DevOps (9-month journey)"
    ]
    for p in paths:
        story.append(Paragraph(p, s['MBullet'], bulletText='\u2022'))

    story.append(PageBreak())

    # --- 2. DETAILED COURSE BREAKDOWN ---
    story.append(Paragraph("2. Detailed Course Breakdown", s['H1']))

    # Python+SQL
    story.append(Paragraph("2.1 Python + SQL Fundamentals (8 Weeks)", s['H2']))
    story.append(Paragraph(
        "<b>Philosophy:</b> Learn by building with real Batumi data. Every exercise uses local context -- "
        "tourism stats, restaurant reviews, real estate prices, weather data. Students never work with "
        "abstract 'foo/bar' examples.", s['Body']))
    pysql_weeks = [
        ["Week 1-2", "Python basics: variables, types, loops, functions, error handling"],
        ["Week 3-4", "SQL fundamentals: SELECT, WHERE, JOINs, GROUP BY, subqueries"],
        ["Week 5-6", "APIs, pandas, data manipulation, basic visualization"],
        ["Week 7-8", "Capstone: 'Batumi Business Insights Dashboard' using real datasets"],
    ]
    story.append(make_table(["Week", "Topics"], pysql_weeks, col_widths=[60, 400]))
    story.append(Paragraph("<b>8 datasets provided:</b> Batumi tourism, restaurants, real estate, weather, taxi rides, port traffic, Airbnb, job postings.", s['Body']))
    story.append(Spacer(1, 4))

    # Data Analysis
    story.append(Paragraph("2.2 Data Analysis (8 Weeks)", s['H2']))
    story.append(Paragraph(
        "<b>Philosophy:</b> Analysis is about asking the right questions, not just using tools. "
        "Emphasizes the 'so what?' -- every analysis must end with a recommendation.", s['Body']))
    da_weeks = [
        ["Week 1-2", "Analytical mindset, spreadsheets mastery, analytical SQL (window functions, CTEs)"],
        ["Week 3-4", "EDA, segmentation, cohort analysis, chart design principles"],
        ["Week 5-6", "Dashboards (Metabase + Looker Studio), statistics, hypothesis testing"],
        ["Week 7-8", "A/B testing, report automation, storytelling, capstone presentation"],
    ]
    story.append(make_table(["Week", "Topics"], da_weeks, col_widths=[60, 400]))
    story.append(Spacer(1, 4))

    # PM
    story.append(Paragraph("2.3 Project Management for IT (6 Weeks)", s['H2']))
    story.append(Paragraph(
        "<b>Philosophy:</b> PM is learned by doing, not by reading frameworks. The entire course "
        "runs a simulation -- 'BuildBatumi' mobile app project -- where students practice every concept "
        "in context. Every session explicitly practices one soft skill.", s['Body']))
    pm_weeks = [
        ["Week 1-2", "Why projects fail, Scrum deep dive, sprint execution, retrospectives"],
        ["Week 3-4", "Kanban, stakeholder management, communication, planning, estimation, risk"],
        ["Week 5-6", "PM tools (Jira/Confluence/Miro), metrics, scope management, leadership, negotiation"],
    ]
    story.append(make_table(["Week", "Topics"], pm_weeks, col_widths=[60, 400]))
    story.append(Spacer(1, 4))

    # DevOps
    story.append(Paragraph("2.4 DevOps & Cloud (8 Weeks)", s['H2']))
    story.append(Paragraph(
        "<b>Philosophy:</b> Follow one application ('BatumiGuide' Flask tourism app) from local dev "
        "to production on AWS. Students deploy a real, working application. All within AWS free tier.", s['Body']))
    devops_weeks = [
        ["Week 1-2", "Linux fundamentals, shell scripting, networking, Docker, Docker Compose"],
        ["Week 3-4", "GitHub Actions CI/CD, AWS (EC2, RDS, S3, VPC), infrastructure basics"],
        ["Week 5-6", "Terraform IaC, monitoring (Prometheus + Grafana), logging (ELK stack)"],
        ["Week 7-8", "Security hardening, capstone: full production deployment with monitoring"],
    ]
    story.append(make_table(["Week", "Topics"], devops_weeks, col_widths=[60, 400]))

    story.append(PageBreak())

    # --- 3. TOOLS & TECHNOLOGY ---
    story.append(Paragraph("3. Tools & Technology Stack", s['H1']))

    story.append(Paragraph("3.1 Teaching Tools", s['H2']))
    teach_tools = [
        ["Google Slides", "Presentations", "Free, collaborative, all team knows it"],
        ["Google Sheets", "Gamification tracking, CRM, finances", "Low-tech, reliable, shared"],
        ["Telegram", "Student communication, announcements", "What everyone in Batumi already uses"],
        ["GitHub", "Code sharing, homework submission", "Industry standard, free for education"],
        ["Google Colab", "Python/SQL exercises (no local setup)", "Zero installation friction for students"],
        ["Miro / FigJam", "Whiteboarding, PM exercises", "Free tier sufficient"],
    ]
    story.append(make_table(
        ["Tool", "Use Case", "Why This Tool"],
        teach_tools,
        col_widths=[90, 170, 200]
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("3.2 Course-Specific Tools", s['H2']))
    course_tools = [
        ["Python+SQL", "Python 3.12+, PostgreSQL, VS Code or PyCharm, pandas, matplotlib"],
        ["Data Analysis", "Google Sheets, SQL (PostgreSQL), Metabase, Google Looker Studio, scipy"],
        ["Project Management", "Jira (free), Confluence, Miro, Slack (for simulation), Google Docs"],
        ["DevOps/Cloud", "Linux (WSL/VM), Docker, GitHub Actions, AWS (free tier), Terraform, Prometheus, Grafana"],
    ]
    story.append(make_table(
        ["Course", "Key Tools"],
        course_tools,
        col_widths=[100, 360]
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("3.3 Operations Tools", s['H2']))
    ops_tools = [
        ["Google Forms", "Event registration, feedback collection"],
        ["Google Sheets (master)", "Student tracking, revenue, KPIs"],
        ["Google Calendar", "Class scheduling, team meetings"],
        ["Canva", "Social media graphics, certificates"],
        ["Instagram + Facebook", "Marketing and brand building"],
        ["WhatsApp", "1-on-1 student communication backup"],
    ]
    story.append(make_table(
        ["Tool", "Purpose"],
        ops_tools,
        col_widths=[120, 340]
    ))

    story.append(PageBreak())

    # --- 4. TEACHER RULES ---
    story.append(Paragraph("4. Universal Teacher Rules (Non-Negotiable)", s['H1']))
    story.append(Paragraph(
        "These rules apply to <b>every instructor</b> at MaLuDa, current and future. "
        "They are the foundation of our teaching quality and brand promise. "
        "Violation of these rules is grounds for removal from the teaching roster.", s['Body']))
    story.append(Spacer(1, 6))

    story.append(Paragraph("RULE 1: Practical First, Theory Second", s['H2']))
    story.append(Paragraph(
        "Every class starts with a problem or challenge, not a lecture. Students should write code, "
        "make decisions, or solve problems within the first 15 minutes. Theory is introduced to explain "
        "what they just experienced -- never the other way around.", s['Body']))
    story.append(section_box(
        "<b>Bad:</b> 'Today we'll learn about SQL JOINs. A JOIN combines rows from two tables...' (30 min lecture)<br/>"
        "<b>Good:</b> 'Here's a dataset of Batumi restaurants and their reviews in two tables. "
        "Find me the top 10 restaurants by average rating. You have 10 minutes. Hint: you'll need to combine the tables.'", s))
    story.append(Spacer(1, 6))

    story.append(Paragraph("RULE 2: Batumi-Specific Content Only", s['H2']))
    story.append(Paragraph(
        "All exercises, examples, and datasets must use <b>Batumi or Georgia-relevant context</b>. "
        "No generic 'Employee' or 'Products' tables. No US-centric examples. "
        "Students should feel that what they're learning applies directly to their city and economy.", s['Body']))
    story.append(Spacer(1, 4))

    story.append(Paragraph("RULE 3: Gamification Is Mandatory", s['H2']))
    story.append(Paragraph(
        "Every session must integrate the gamification system: award XP for attendance, exercises, "
        "and homework. Update the leaderboard. Announce badges earned. This is not optional -- "
        "it is a core differentiator and retention mechanism.", s['Body']))
    story.append(Spacer(1, 4))

    story.append(Paragraph("RULE 4: Materials Ready 3 Days Before Class", s['H2']))
    story.append(Paragraph(
        "All slides, exercises, datasets, and homework must be finalized and reviewed by the lead "
        "instructor (Martin) at least 3 business days before the class. No last-minute improvisation. "
        "Students can tell when you're unprepared -- and they talk.", s['Body']))
    story.append(Spacer(1, 4))

    story.append(Paragraph("RULE 5: Start On Time, End On Time", s['H2']))
    story.append(Paragraph(
        "Class starts at the scheduled time. Not 5 minutes late, not 10. Students who pay $120-200/month "
        "deserve professional time management. If 3 students are late, that's their problem. "
        "The session ends on time too -- overtime means poor planning.", s['Body']))
    story.append(Spacer(1, 4))

    story.append(Paragraph("RULE 6: No Student Left Behind (Within Reason)", s['H2']))
    story.append(Paragraph(
        "Monitor struggling students actively. If someone is stuck for more than 5 minutes, intervene. "
        "Use pair programming and peer help (it builds community AND earns XP). "
        "However: do not slow the entire class for one person. Offer office hours or additional help "
        "sessions for students who need extra time.", s['Body']))
    story.append(Spacer(1, 4))

    story.append(Paragraph("RULE 7: Collect Feedback Every Session", s['H2']))
    story.append(Paragraph(
        "At the end of every class, run a 2-minute feedback check. This can be a simple 'fist of five' "
        "(1-5 fingers for understanding), a quick Google Form, or a Telegram poll. "
        "Report any score below 3/5 to Martin within 24 hours. Problems caught in Week 1 are fixable. "
        "Problems discovered in Week 6 have already cost you 3 students.", s['Body']))
    story.append(Spacer(1, 4))

    story.append(Paragraph("RULE 8: Build Community, Not Just Skills", s['H2']))
    story.append(Paragraph(
        "Your job is not just to teach Python or PM. It's to create a professional network that "
        "students value even after the course ends. Learn names by Day 1. Facilitate connections "
        "between students. Create Telegram sub-groups for peer support. Celebrate wins publicly.", s['Body']))
    story.append(Spacer(1, 4))

    story.append(Paragraph("RULE 9: No Jargon Without Explanation", s['H2']))
    story.append(Paragraph(
        "The first time you use any technical term, define it in plain language. "
        "Assume your students are intelligent adults who happen to not know this specific vocabulary. "
        "Never make a student feel stupid for asking 'what does that mean?'", s['Body']))
    story.append(Spacer(1, 4))

    story.append(Paragraph("RULE 10: You Represent MaLuDa", s['H2']))
    story.append(Paragraph(
        "Every interaction with a student -- in class, on Telegram, at a cafe -- represents the school. "
        "Be responsive (24hr max for questions). Be encouraging. Be honest about what you don't know. "
        "Students forgive imperfect knowledge. They don't forgive arrogance or indifference.", s['Body']))

    story.append(PageBreak())

    # --- 5. CURRICULUM DESIGN STANDARDS ---
    story.append(Paragraph("5. Curriculum Design Standards", s['H1']))
    story.append(Paragraph(
        "When creating or modifying any course, follow this structure:", s['Body']))

    standards = [
        ["Session structure", "15 min warm-up/review -> 30 min guided practice -> 30 min independent work -> 15 min wrap-up + preview"],
        ["Homework", "Assigned every session. Takes 1-2 hours max. Must have clear rubric. Graded within 48 hours."],
        ["Capstone", "Final 2 weeks. Real-world project using all skills learned. Presented to peers. Portfolio-worthy."],
        ["Assessment split", "35-40% homework, 35-40% capstone, 15% participation, 10% peer review (varies by course)"],
        ["Difficulty curve", "Weeks 1-2: confidence-building (easy wins). Weeks 3-5: challenge zone. Weeks 6-8: mastery + capstone."],
        ["Datasets", "Minimum 5 unique datasets per course. All Batumi/Georgia themed. Synthetic but realistic."],
        ["Slides", "Max 20 slides per session. More visuals, less text. Code examples > bullet points."],
        ["Soft skills", "Every session must practice at least one: communication, teamwork, presentation, problem-solving."],
    ]
    story.append(make_table(
        ["Element", "Standard"],
        standards,
        col_widths=[100, 360]
    ))

    story.append(PageBreak())

    # --- 6. GAMIFICATION INTEGRATION ---
    story.append(Paragraph("6. Gamification Integration Rules", s['H1']))

    story.append(Paragraph("6.1 XP System (Per Session)", s['H2']))
    xp = [
        ["Attendance", "10 XP", "Automatic for showing up"],
        ["Exercise completion", "15 XP", "Per in-class exercise completed"],
        ["Homework submitted", "20 XP", "On-time submission"],
        ["Homework quality bonus", "+10 XP", "Exceptional work"],
        ["Helping a classmate", "10 XP", "Instructor must observe and award"],
        ["Asking a great question", "5 XP", "Encourages curiosity"],
        ["Weekly streak (all classes)", "25 XP", "Attendance incentive"],
    ]
    story.append(make_table(
        ["Action", "XP", "Notes"],
        xp,
        col_widths=[140, 60, 260]
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("6.2 Level Thresholds", s['H2']))
    levels = [
        ["Level 1: Newcomer", "0 XP", "Welcome to MaLuDa"],
        ["Level 2: Explorer", "100 XP", "Access to alumni Telegram channel"],
        ["Level 3: Builder", "250 XP", "Featured on MaLuDa social media"],
        ["Level 4: Specialist", "500 XP", "10% discount on next course"],
        ["Level 5: Expert", "800 XP", "Priority mentoring session with Martin"],
        ["Level 6: Master", "1200 XP", "LinkedIn recommendation + website showcase"],
        ["Level 7: Legend", "1800 XP", "Free next course + Ambassador title"],
    ]
    story.append(make_table(
        ["Level", "XP Required", "Reward"],
        levels,
        col_widths=[120, 80, 260]
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("6.3 Anti-Toxicity Measures", s['H2']))
    anti_toxic = [
        "Show only Top 5 + student's own position on leaderboard (prevents demoralization)",
        "Include 'Most Improved' category weekly (effort > talent)",
        "Team challenges alongside individual XP (cooperation, not just competition)",
        "Opt-out option: students can hide from leaderboard if they prefer",
        "Never publicly shame low scores. Celebrate effort privately, results publicly."
    ]
    for item in anti_toxic:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(PageBreak())

    # --- 7. QUALITY CONTROL ---
    story.append(Paragraph("7. Quality Control & Assessment Standards", s['H1']))

    story.append(Paragraph("7.1 Session Quality Checklist (Instructor Self-Check)", s['H2']))
    qc = [
        "Did I start with a practical exercise (not a lecture)?",
        "Did every student write code / make a decision / solve a problem today?",
        "Did I use Batumi-specific data and examples?",
        "Did I update XP and gamification tracking?",
        "Did I collect end-of-session feedback?",
        "Did I identify struggling students and offer help?",
        "Can I name 3 specific things students learned today?",
        "Did I assign homework with a clear deadline and rubric?"
    ]
    for item in qc:
        story.append(Paragraph(f"[ ] {item}", s['MBullet']))
    story.append(Spacer(1, 4))

    story.append(Paragraph("7.2 Course Success Metrics", s['H2']))
    metrics = [
        ["Homework submission rate", "> 80%", "Below 60% = course design problem"],
        ["Attendance rate", "> 85%", "Below 70% = scheduling or quality problem"],
        ["Completion rate", "> 75%", "Below 60% = investigate root cause immediately"],
        ["Student satisfaction (NPS)", "> 4.0 / 5.0", "Below 3.5 = pause enrollment, fix issues"],
        ["Capstone completion", "> 90%", "Below 80% = capstone too ambitious"],
    ]
    story.append(make_table(
        ["Metric", "Target", "Red Flag"],
        metrics,
        col_widths=[140, 80, 240]
    ))

    story.append(PageBreak())

    # --- 8. INSTRUCTOR ONBOARDING ---
    story.append(Paragraph("8. Instructor Onboarding Checklist", s['H1']))
    story.append(Paragraph("For every new instructor joining MaLuDa:", s['Body']))

    onboard = [
        "<b>Day 1:</b> Read this entire document. Read CLAUDE.md. Read gamification_system.md.",
        "<b>Day 1:</b> Get access to: Telegram group, Google Drive, GitHub repo, Google Sheets (gamification + CRM).",
        "<b>Day 2:</b> Meet with Martin: teaching philosophy discussion, course curriculum walkthrough.",
        "<b>Day 2:</b> Meet with Andy: operations overview, scheduling, student communication protocols.",
        "<b>Day 3:</b> Review existing course materials for the course you'll teach.",
        "<b>Day 3:</b> Shadow one session of an existing course (if running).",
        "<b>Week 1:</b> Prepare first 2 sessions of your course. Submit to Martin for review.",
        "<b>Week 1:</b> Conduct a dry run of Session 1 with team as audience.",
        "<b>Before first class:</b> All 4 weeks of materials ready and reviewed (minimum). Full 8 weeks preferred."
    ]
    for item in onboard:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(Spacer(1, 8))

    # --- 9. RUSSIAN SUMMARY ---
    story.append(Paragraph("9. Kratkie Pravila dlya Prepodavateley (Russian Summary)", s['H1']))
    ru_rules = [
        "<b>1. Praktika vazhnee teorii.</b> Kazhdyy urok nachinaetsya s zadachi, a ne s lektsii.",
        "<b>2. Tol'ko batumskiye primery.</b> Nikakikh genericheskikh dannykh. Vse -- pro Batumi i Gruziyu.",
        "<b>3. Geymifikatsiya obyazatel'na.</b> XP, beydzi, liderboard -- v kazhdom uroke.",
        "<b>4. Materialy gotovy za 3 dnya.</b> Nikakoy improvizatsii. Vse proveryaetsya Martin'om.",
        "<b>5. Vovremya nachal, vovremya zakonchil.</b> Uvazhenie k studentam = uvazhenie k vremeni.",
        "<b>6. Obrataya svyaz' kazhdyy urok.</b> 2 minuty v kontse. Problemy soobshchat' Martin'u za 24 chasa.",
        "<b>7. Soobshchestvo, ne tol'ko navyki.</b> Znayte imena. Svyazyvajte studentov drug s drugom.",
        "<b>8. Nikakogo zhargona bez ob''yasneniya.</b> Studenty umnyye. Oni prosto ne znayut terminov.",
        "<b>9. Vy predstavlyayete MaLuDa.</b> Kazhdyy kontakt so studentom -- eto reputatsiya shkoly.",
        "<b>10. Kachestvo prevyshe vsego.</b> Luchshe malen'kiy klass s otlichnym opytom, chem bol'shoy s posredstvennym.",
    ]
    for item in ru_rules:
        story.append(Paragraph(item, s['Body']))
        story.append(Spacer(1, 2))


# ═══════════════════════════════════════════════════════════════
# DOCUMENT 3: STUDENT PSYCHOLOGY & RETENTION
# ═══════════════════════════════════════════════════════════════

def build_retention(story, s):

    story.append(Paragraph("Table of Contents", s['H1']))
    toc = [
        "1. Why This Document Matters More Than You Think",
        "2. The Psychology of Adult Learning",
        "3. Why Students Actually Drop Out (The Real Reasons)",
        "4. The First 2 Weeks: Make or Break",
        "5. Retention Architecture: Week-by-Week System",
        "6. Community Building as a Retention Tool",
        "7. Handling Difficult Situations",
        "8. The Psychology of Pricing & Perceived Value",
        "9. Measuring & Predicting Churn",
        "10. Russian Summary / Psikhologiya Uderzhaniya"
    ]
    for item in toc:
        story.append(Paragraph(item, s['MBullet']))
    story.append(PageBreak())

    # --- 1. WHY THIS MATTERS ---
    story.append(Paragraph("1. Why This Document Matters More Than You Think", s['H1']))
    story.append(section_box(
        "<b>The math is brutal:</b> Online courses have a 90%+ dropout rate. In-person bootcamps: 20-35%. "
        "If MaLuDa loses 4 out of 10 students, you're not just losing $480-800 in revenue -- you're losing "
        "4 people who will tell their friends 'I tried MaLuDa and didn't finish.' "
        "In Batumi's small social network, negative word-of-mouth can kill you before you start.", s))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Retention is not an HR problem. It is <b>the</b> business problem. A 10% improvement in retention "
        "has a bigger impact on revenue than a 10% increase in enrollment, because retained students: "
        "(a) pay for more months, (b) refer friends, (c) become testimonials, (d) may take additional courses.", s['Body']))
    story.append(Paragraph(
        "<i>RU: Uderzhanie -- eto ne HR-problema. Eto BIZNES-problema. 10% uluchsheniya uderzhaniya "
        "daet bol'she dohoda, chem 10% rosta nabora.</i>", s['BodyRu']))

    story.append(PageBreak())

    # --- 2. PSYCHOLOGY OF ADULT LEARNING ---
    story.append(Paragraph("2. The Psychology of Adult Learning", s['H1']))

    story.append(Paragraph("2.1 Adults Are Not Children in Bigger Chairs", s['H2']))
    story.append(Paragraph(
        "Adult learners have fundamentally different psychology than school-age students. Understanding this "
        "is the difference between a course that retains and one that hemorrhages students.", s['Body']))

    adult_traits = [
        ["<b>Self-directed</b>", "Adults need to feel in control of their learning. They resist being 'told what to do.' Give them choices: which exercise to tackle, which project topic to pick, how to present their capstone."],
        ["<b>Experience-anchored</b>", "Adults learn by connecting new knowledge to what they already know. Always start with 'What do you already know about...' Bridge from their existing expertise."],
        ["<b>Problem-centered</b>", "Adults don't learn 'subjects' -- they learn solutions to their problems. Frame every lesson as: 'After today, you'll be able to [solve specific problem].'"],
        ["<b>Time-pressured</b>", "Adults have jobs, families, responsibilities. If they feel a class wastes their time, they leave. Every minute must feel valuable."],
        ["<b>Ego-vulnerable</b>", "The #1 fear of adult learners is looking stupid in front of peers. This fear kills more learning journeys than difficulty. Create psychological safety FIRST."],
        ["<b>Results-motivated</b>", "Adults want to see career impact. Regular 'skill unlocked' moments and portfolio-building keep them motivated."],
    ]
    story.append(make_table(
        ["Trait", "Implication for MaLuDa"],
        adult_traits,
        col_widths=[100, 360]
    ))

    story.append(Paragraph("2.2 The Emotional Arc of a Course", s['H2']))
    story.append(Paragraph(
        "Every student goes through a predictable emotional journey. If you don't manage this arc, "
        "you'll lose students at the exact same points every time:", s['Body']))
    arc = [
        ["Week 1", "Excitement", "HIGH", "'This is amazing! I'm finally doing it!'", "Channel this energy. Give quick wins. Don't overwhelm."],
        ["Week 2-3", "Confidence dip", "MEDIUM", "'Wait, this is harder than I thought'", "CRITICAL WINDOW. Normalize struggle. Show other students had same feelings."],
        ["Week 4", "The Valley", "LOW", "'Maybe I'm not smart enough for this'", "Personal check-in. Remind them of progress. Lower homework difficulty slightly."],
        ["Week 5-6", "Recovery", "RISING", "'OK, things are clicking now'", "Increase challenge. Peer collaboration. Show how far they've come."],
        ["Week 7-8", "Mastery", "HIGH", "'I actually built something real!'", "Capstone pride. Public presentation. Portfolio piece. Next course upsell."],
    ]
    story.append(make_table(
        ["Week", "Emotion", "Energy", "Student Thinks", "Instructor Action"],
        arc,
        col_widths=[42, 65, 45, 140, 168]
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<font color="#c62828"><b>WARNING:</b></font> Weeks 2-4 are where you lose 80% of dropouts. '
        "If you don't have a specific intervention plan for this period, you're relying on luck.", s['Body']))

    story.append(PageBreak())

    # --- 3. WHY STUDENTS ACTUALLY DROP OUT ---
    story.append(Paragraph("3. Why Students Actually Drop Out (The Real Reasons)", s['H1']))
    story.append(Paragraph(
        "Students rarely tell you the real reason they quit. Here's what they say vs. what they mean:", s['Body']))
    story.append(Spacer(1, 4))

    dropout_reasons = [
        ["'I don't have time'", "<b>Real:</b> The course isn't valuable enough to prioritize. They have the same 24 hours as when they signed up.", "Make every session feel irreplaceable. Create FOMO via community and gamification."],
        ["'It's too hard'", "<b>Real:</b> They felt stupid and their ego can't handle it. It's usually not about difficulty -- it's about shame.", "Normalize struggle publicly. 'Everyone finds this hard at first.' Pair struggling students with slightly-ahead peers."],
        ["'It's too easy/slow'", "<b>Real:</b> They're bored. Advanced students disengage when pace is set for beginners.", "Offer 'bonus challenges' for fast learners. Consider advanced/beginner tracks within the class."],
        ["'Personal reasons'", "<b>Real:</b> Could be genuine, but often means they lost motivation and this is the polite exit.", "Always do an exit interview. Offer to pause and resume with next cohort (retention > pride)."],
        ["'Financial issues'", "<b>Real:</b> Sometimes genuine. But also used when perceived value dropped below price.", "Offer payment plan. If they say no to a flexible plan, it's not about money."],
        ["Ghost (stops showing up)", "<b>Real:</b> They disengaged gradually. This is YOUR failure to notice warning signs.", "Monitor attendance patterns. Missing 2 sessions in a row = immediate personal outreach."],
    ]
    story.append(make_table(
        ["What They Say", "What's Really Happening", "Prevention"],
        dropout_reasons,
        col_widths=[95, 190, 175]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("3.1 The 5 Root Causes (In Order of Impact)", s['H2']))
    root_causes = [
        "<b>1. No psychological safety</b> -- student felt judged, stupid, or excluded. This kills everything else.",
        "<b>2. No early wins</b> -- student didn't feel competent quickly enough. First 2 sessions must produce 'I did it!' moment.",
        "<b>3. No social bonds</b> -- student has no friends in the class. Isolation = easy to leave. Community = hard to leave.",
        "<b>4. No visible progress</b> -- student can't articulate what they've learned. Need weekly 'skill unlocked' markers.",
        "<b>5. Life interference</b> -- genuine scheduling conflicts. The only reason you can't fully prevent -- but you can offer flexibility."
    ]
    for item in root_causes:
        story.append(Paragraph(item, s['Body']))
        story.append(Spacer(1, 2))

    story.append(Paragraph(
        "<i>RU: 5 prichin ukhoda studentov (po stepeni vliyaniya): "
        "1) Net psikhologicheskoy bezopasnosti, "
        "2) Net rannikh pobed, "
        "3) Net sotsial'nykh svyazey, "
        "4) Net vidimogo progressa, "
        "5) Zhiznennye obstoyatel'stva.</i>", s['BodyRu']))

    story.append(PageBreak())

    # --- 4. FIRST 2 WEEKS ---
    story.append(Paragraph("4. The First 2 Weeks: Make or Break", s['H1']))
    story.append(section_box(
        "<b>Research shows:</b> 60% of adult course dropouts make their decision in the first 2 weeks, "
        "even if they don't actually leave until Week 4-6. The first impression window is small and final. "
        "Over-invest in the first 4 sessions.", s))
    story.append(Spacer(1, 6))

    story.append(Paragraph("4.1 Session 1 Script (First 30 Minutes)", s['H2']))
    session1 = [
        "<b>Before class:</b> Arrive 15 min early. Set up name cards. Play relaxed background music. Have snacks/water available.",
        "<b>0-5 min:</b> Martin greets every student by name at the door. Handshake. 'Welcome, glad you're here.'",
        "<b>5-10 min:</b> Icebreaker: 'Tell us your name, what you do, and one thing you hope this course helps you achieve.' (NOT 'tell us about yourself' -- too vague and stressful).",
        "<b>10-15 min:</b> Set expectations: 'Here's what you'll be able to do by Week 8.' Show a capstone example. Make it tangible.",
        "<b>15-25 min:</b> FIRST QUICK WIN. Students write their first line of code / make their first decision / analyze their first dataset. Something they can screenshot and show someone.",
        "<b>25-30 min:</b> 'You just did [X]. You're already ahead of where you were 30 minutes ago.' Anchor the feeling of progress."
    ]
    for item in session1:
        story.append(Paragraph(item, s['Body']))
        story.append(Spacer(1, 2))

    story.append(Paragraph("4.2 First Week Retention Tactics", s['H2']))
    tactics = [
        "Send a personal Telegram message to every student within 2 hours after Session 1: 'Great having you today. Any questions?'",
        "Create a class Telegram group before Session 2. Post a question or poll to spark conversation.",
        "Assign homework that is EASY. Session 1 homework should take max 30 minutes and be almost impossible to fail.",
        "Share one resource (article, video) related to what they learned -- shows you care beyond class time.",
        "By end of Week 1, every student should know at least 2 other students' names and what they do."
    ]
    for item in tactics:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(Paragraph("4.3 Second Week: Solidify or Lose Them", s['H2']))
    w2 = [
        "Session 3: Increase difficulty slightly. Students should feel challenged but not overwhelmed.",
        "Session 4: First collaborative exercise. Pair students deliberately (mix experience levels).",
        "End of Week 2: Personal check-in with EVERY student (quick Telegram message): 'How's it going? Anything confusing?'",
        "Award first round of badges/XP. Make it visible. Celebrate publicly in Telegram group.",
        "Anyone who missed a session: Personal call (not text). 'Hey, we missed you. Everything OK? Want me to send you what we covered?'"
    ]
    for item in w2:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(PageBreak())

    # --- 5. RETENTION ARCHITECTURE ---
    story.append(Paragraph("5. Retention Architecture: Week-by-Week System", s['H1']))
    story.append(Paragraph(
        "This is not a list of nice-to-haves. This is a system. Follow it every cohort, every course.", s['Body']))

    retention_system = [
        ["Every session", "XP update, attendance check, end-of-session feedback (2 min), one 'skill unlocked' moment"],
        ["Weekly", "Telegram group engagement (1 question or resource), leaderboard update, 'Expert of the Week' shoutout"],
        ["Bi-weekly", "Personal 1-on-1 check-in with every student (even a brief Telegram voice message counts)"],
        ["After missed class", "Same-day personal message. After 2 missed: phone call. After 3: face-to-face or offer pause."],
        ["Week 4 (The Valley)", "Special session: 'Progress check.' Show students how far they've come. Revisit Session 1 exercise."],
        ["Week 6", "Capstone project kickoff. Students choose topics. This creates ownership and commitment to finish."],
        ["Week 8", "Graduation celebration. Certificates. Photos. Testimonial collection. Next course pitch. Alumni channel invite."],
        ["Post-course", "Monthly alumni check-in. Job lead sharing. Success story collection. Referral activation."],
    ]
    story.append(make_table(
        ["When", "Action"],
        retention_system,
        col_widths=[90, 370]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("5.1 The 'Pause, Don't Quit' Policy", s['H2']))
    story.append(Paragraph(
        "When a student wants to drop out, <b>never accept it on the spot</b>. Always offer a pause:", s['Body']))
    pause = [
        "'I completely understand. Life happens. Here's what I suggest: take a 2-week break, and join the next cohort from where you left off. Your XP and progress carry over.'",
        "This converts ~30% of would-be dropouts into retained students.",
        "Even if they don't return, they leave with a positive impression ('they were flexible and understanding') instead of guilt or resentment.",
        "Track all pause requests. If you see patterns (same week, same reason), it's a curriculum problem."
    ]
    for item in pause:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(PageBreak())

    # --- 6. COMMUNITY BUILDING ---
    story.append(Paragraph("6. Community Building as a Retention Tool", s['H1']))
    story.append(section_box(
        "<b>Key insight:</b> Students don't drop out of communities. They drop out of courses. "
        "If you build a strong enough community, students will stay even through difficult weeks, "
        "because leaving the course means leaving their new friends.", s))
    story.append(Spacer(1, 6))

    story.append(Paragraph("6.1 Community Building Tactics", s['H2']))
    community = [
        "<b>Name learning:</b> Instructor must know every student's name by Session 2. Use name cards until then.",
        "<b>Pair rotation:</b> Change pairs every session. By Week 4, every student has worked with every other student.",
        "<b>Shared struggle:</b> Design one deliberately hard challenge per week that requires teamwork. Shared adversity bonds people.",
        "<b>Social rituals:</b> Start each class with a 2-min informal chat. 'How was your week?' Post-class optional coffee/tea at nearby cafe.",
        "<b>Celebration:</b> Public recognition of achievements in Telegram group. Birthdays. Milestones. First job offer.",
        "<b>Alumni network:</b> Graduates join alumni channel. They become mentors, guest speakers, and referral sources.",
        "<b>Cross-course connections:</b> Monthly mixer events where students from different courses meet. Builds school identity, not just course identity."
    ]
    for item in community:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(Paragraph("6.2 The Telegram Group Rules", s['H2']))
    tg_rules = [
        "Instructor posts at least 1 thing per day (question, resource, meme, encouragement)",
        "Student questions answered within 2 hours during business hours",
        "Celebrate homework completions publicly",
        "Weekly poll or discussion question (keeps non-active students engaged)",
        "Strict no-negativity policy. Critique in DMs, praise in public.",
        "Pin important messages: schedule, homework deadlines, useful resources"
    ]
    for item in tg_rules:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(PageBreak())

    # --- 7. HANDLING DIFFICULT SITUATIONS ---
    story.append(Paragraph("7. Handling Difficult Situations", s['H1']))

    situations = [
        ["<b>Student is consistently behind</b>",
         "1. Private conversation: 'I noticed you're struggling with X. That's completely normal.'<br/>"
         "2. Offer 30-min office hours (even via Telegram call).<br/>"
         "3. Pair them with a strong student (benefits both).<br/>"
         "4. If still behind after 2 weeks: honest conversation about whether this is the right course/time."],

        ["<b>Student dominates class</b>",
         "1. 'Great question -- hold that thought for after class, I'd love to dive deeper with you.'<br/>"
         "2. Channel their energy: make them a 'class assistant' (helps others, earns XP).<br/>"
         "3. Private chat: 'Your knowledge is amazing. Help me help the others by giving them space to figure it out.'"],

        ["<b>Student is negative/complaining</b>",
         "1. Listen first. There may be legitimate issues.<br/>"
         "2. Address in private, never in front of class.<br/>"
         "3. 'I hear you. What would make this better for you specifically?'<br/>"
         "4. If chronic: 'I want you to get value from this. If it's not working, let's find a solution together.'"],

        ["<b>Two students don't get along</b>",
         "1. Don't pair them. Simple.<br/>"
         "2. If it spills into class dynamics: separate private conversations.<br/>"
         "3. 'You're both here to learn. Let's focus on that shared goal.'<br/>"
         "4. If unresolvable: Martin mediates. Last resort: one-on-one with the aggressor."],

        ["<b>Student wants a refund</b>",
         "1. First: understand WHY (exit interview).<br/>"
         "2. Offer alternatives: pause, course switch, extra support.<br/>"
         "3. If Week 1-2: full refund, no questions. This is your reputation insurance.<br/>"
         "4. If Week 3+: pro-rated refund minus materials. Be fair -- Batumi is small."],
    ]
    story.append(make_table(
        ["Situation", "Response Protocol"],
        situations,
        col_widths=[130, 330]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<b>The Golden Rule:</b> In Batumi, every student interaction is a marketing event. "
        "A student who feels heard and respected -- even if they leave -- becomes an advocate. "
        "A student who feels dismissed becomes your worst nightmare on social media.", s['Body']))

    story.append(PageBreak())

    # --- 8. PSYCHOLOGY OF PRICING ---
    story.append(Paragraph("8. The Psychology of Pricing & Perceived Value", s['H1']))

    story.append(Paragraph("8.1 Why Your Price Must Feel Like a Bargain (Not Cheap)", s['H2']))
    story.append(Paragraph(
        "There's a critical difference between 'affordable' and 'cheap.' Affordable means 'great value for the price.' "
        "Cheap means 'you get what you pay for.' MaLuDa must always feel affordable, never cheap.", s['Body']))

    pricing_psych = [
        ["<b>Anchor high, then reveal</b>", "'Similar bootcamps in Tbilisi cost $2,000+. Online courses charge $300-500 for pre-recorded videos. MaLuDa: $120-200/month for live, in-person, with a community.'"],
        ["<b>Frame as investment</b>", "'$240 total for Python+SQL skills that pay $500-1,500/month. Your ROI is 2-6x in the first month of a new job.'"],
        ["<b>Break it down</b>", "'$120/month = $30/week = $15/session = less than dinner at a good restaurant in Batumi. For career-changing skills.'"],
        ["<b>Social proof pricing</b>", "'Our first cohort filled up at this price.' (Once true, use this relentlessly.)"],
        ["<b>Scarcity (real, not fake)</b>", "'8-15 students per class. Once it's full, the next cohort starts in 2 months.' This is genuinely true -- use it."],
    ]
    story.append(make_table(
        ["Technique", "Application"],
        pricing_psych,
        col_widths=[130, 330]
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("8.2 Discount Psychology", s['H2']))
    story.append(Paragraph(
        '<font color="#c62828"><b>DANGER:</b></font> Discounts are addictive -- for you AND students. '
        "Once you start discounting, people wait for the next sale instead of buying at full price. Use sparingly:", s['Body']))
    discounts = [
        "<b>DO:</b> Early-bird pricing for first cohort only (creates urgency + rewards pioneers)",
        "<b>DO:</b> Bundle discounts (rewards commitment, increases total revenue per student)",
        "<b>DO:</b> Referral discounts (customer acquisition cost is built into the discount)",
        "<b>DON'T:</b> Discount because a class is under-enrolled (signals low demand)",
        "<b>DON'T:</b> Offer discounts in DMs to people who didn't ask (signals desperation)",
        "<b>DON'T:</b> Run more than 2 promotions in a 6-month period (trains people to wait)"
    ]
    for item in discounts:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(PageBreak())

    # --- 9. MEASURING & PREDICTING CHURN ---
    story.append(Paragraph("9. Measuring & Predicting Churn", s['H1']))

    story.append(Paragraph("9.1 Early Warning Signs (Red Flags)", s['H2']))
    red_flags = [
        ["Missed 2 classes in a row", "HIGH RISK", "Immediate personal call. Offer make-up session or materials."],
        ["Homework not submitted 2x", "HIGH RISK", "Private message: 'Noticed you missed homework. Everything OK? Need help?'"],
        ["Stopped engaging in Telegram", "MEDIUM RISK", "Tag them in a question they can answer. Reactivate engagement."],
        ["Negative feedback score", "MEDIUM RISK", "1-on-1 conversation. 'What can I do differently?'"],
        ["Missed payment", "HIGH RISK", "Could be financial or disengagement. Offer payment plan first."],
        ["'I'll catch up next week'", "WARNING", "This is the pre-dropout phrase. They rarely catch up. Intervene now."],
    ]
    story.append(make_table(
        ["Signal", "Risk Level", "Immediate Action"],
        red_flags,
        col_widths=[130, 80, 250]
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("9.2 Retention Tracking Dashboard", s['H2']))
    story.append(Paragraph(
        "Andy maintains a weekly retention dashboard in Google Sheets:", s['Body']))
    dashboard = [
        "Per-student: attendance %, homework %, Telegram activity, XP level, last personal contact date",
        "Per-course: average attendance, homework submission rate, NPS score, churn rate",
        "Alerts: any student hitting 2+ red flags simultaneously = immediate Martin + Andy discussion",
        "Monthly: cohort analysis (retention curve by week) to identify systematic patterns"
    ]
    for item in dashboard:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))

    story.append(Paragraph("9.3 Exit Interview Template", s['H2']))
    story.append(Paragraph(
        "When a student leaves (or pauses), always conduct a brief exit interview:", s['Body']))
    exit_q = [
        "'What originally motivated you to join?'",
        "'At what point did you start considering leaving?' (This identifies the failure point)",
        "'What could we have done differently?' (Listen. Don't defend.)",
        "'Would you recommend MaLuDa to a friend despite your experience?' (Net promoter intent)",
        "'Would you consider returning for a future course?' (Keep the door open)"
    ]
    for item in exit_q:
        story.append(Paragraph(item, s['MBullet'], bulletText='\u2022'))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Every exit interview is gold.</b> It tells you what your surviving students are thinking but not saying.", s['Body']))

    story.append(PageBreak())

    # --- 10. RUSSIAN SUMMARY ---
    story.append(Paragraph("10. Psikhologiya Uderzhaniya Studentov (Russian Summary)", s['H1']))

    ru_summary = [
        "<b>Pochemu eto vazhno:</b> Poterya 4 iz 10 studentov -- eto ne tol'ko poterya $480-800. Eto 4 cheloveka, kotoryye rasskazhut druz'yam, chto 'ne dokonchili MaLuDa.' V malen'kom Batumi eto smertnyy prigovor.",
        "<b>Psikhologiya vzroslykh:</b> Vzroslyye uchatsya inache. Im nuzhna prakticheskaya tsennost', kontrol' nad protsessom i bezopasnost' ot osuzhdeniia. Nikogda ne zastavlyayte studenta chuvstvovat' sebya glupym.",
        "<b>Pervyye 2 nedeli reshaet vse:</b> 60% reshayut uyti v pervyye 2 nedeli, dazhe yesli ukhodyat na 4-6 nedele. Pereinvestiruyte v pervyye 4 zanyatiya.",
        "<b>5 prichin ukhoda:</b> (1) Net psikhologicheskoy bezopasnosti, (2) Net rannikh pobed, (3) Net sotsial'nykh svyazey, (4) Net vidimogo progressa, (5) Zhiznennye obstoyatel'stva.",
        "<b>Politika 'Pauza, a ne ukhod':</b> Vsegda predlagayte pauzu vmesto ukhoda. Konvertiruyet ~30% potentsial'nykh ukhodyashchikh.",
        "<b>Soobshchestvo -- eto klyuch:</b> Studenty ne ukhodyat iz soobshchestv. Oni ukhodyat iz kursov. Stroytte svyazi mezhdu studentami.",
        "<b>Zolotoye pravilo Batumi:</b> Kazhdy kontakt so studentom -- eto marketingovoye meropriyatie. Student, kotoryy chuvstvuyet sebya uslyshannym -- dazhe yesli on ukhodit -- stanovitsya vashem advokate.",
    ]
    for item in ru_summary:
        story.append(Paragraph(item, s['Body']))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 8))
    story.append(hr())
    story.append(Paragraph(
        "<b>Remember:</b> You are not just building a school. You are building the IT community of Batumi. "
        "Every student who finishes is a brick in that foundation. Every student who drops out is a crack. "
        "Treat retention as your most important product feature.", s['Body']))


# ═══════════════════════════════════════════════════════════════
# MAIN: Generate all 3 PDFs
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("\n=== Generating MaLuDa Strategic Documents ===\n")

    f1 = build_pdf(
        "MaLuDa_01_Strategy_and_Vision.pdf",
        "Strategy & Vision",
        "Marketing Strategy | Future Development | 6-Month Roadmap",
        build_strategy
    )

    f2 = build_pdf(
        "MaLuDa_02_Courses_Tools_Teacher_Rules.pdf",
        "Courses, Tools & Teacher Rules",
        "Course Portfolio | Technology Stack | Universal Teaching Standards",
        build_courses
    )

    f3 = build_pdf(
        "MaLuDa_03_Student_Psychology_Retention.pdf",
        "Student Psychology & Retention",
        "Why Students Drop Out | Retention Architecture | Community Building",
        build_retention
    )

    print(f"\n=== All documents generated successfully ===")
    print(f"  1. {f1}")
    print(f"  2. {f2}")
    print(f"  3. {f3}")
    print()
