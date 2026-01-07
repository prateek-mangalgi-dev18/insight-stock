from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from datetime import datetime
from io import BytesIO

def clean_html(text):
    """
    Cleans text for ReportLab's HTML-like markup.
    """
    if not text:
        return ""
    
    # Escape basic XML characters
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    
    # Replace currency symbols
    text = text.replace("₹", "Rs. ").replace("$", "USD ")
    
    import re
    # --- ORDER MATTERS HERE ---
    
    # 1. Convert Markdown bold (**text**) to ReportLab bold (<b>text</b>)
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)

    # 2. Remove Markdown Headers (### Title -> <b>Title</b>)
    # We remove hashes and wrap in bold. We also add line breaks around it.
    text = re.sub(r'(?m)^#{1,6}\s*(.+)$', r'<br/><b>\1</b><br/>', text)
    
    # 3. Convert Markdown Bullets (- Item or * Item) to (• Item)
    # Match start of line dashes/asterisks
    text = re.sub(r'(?m)^[\-\*]\s+(.+)$', r'&nbsp;&nbsp;• \1<br/>', text)
    
    # 4. Handle Paragraphs: Double newlines -> <br/><br/> placeholder
    # Any remaining double newlines (that weren't part of headers/lists structure)
    text = re.sub(r'\n\s*\n', '[[PARA]]', text)
    
    # 5. Replace remaining single newlines with SPACE to allow Justification
    # This fixes the "ragged" look by letting ReportLab wrap line text naturally
    # BUT we should preserve breaks that we just added for lists/headers
    text = text.replace('\n', ' ')
    
    # 6. Restore Paragraphs (placeholder -> <br/><br/>)
    text = text.replace('[[PARA]]', '<br/><br/>')
    
    return text

def create_pdf_report(data):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=72)
    
    Story = []
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        alignment=TA_CENTER,
        fontSize=24,
        spaceAfter=20
    )
    
    header_style = ParagraphStyle(
        'CustomHeader',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.darkblue,
        spaceBefore=15,
        spaceAfter=10,
        borderPadding=5,
        borderColor=colors.lightgrey,
        borderWidth=0,
        backColor=None
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )
    
    meta_style = ParagraphStyle(
        'Meta',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER
    )

    # --- 1. Header Info ---
    market = data.get("market_data", {})
    name = market.get('name', 'Unknown')
    symbol = market.get('symbol', 'UNKNOWN')
    
    Story.append(Paragraph(f"{name}", title_style))
    Story.append(Paragraph(f"({symbol})", title_style))
    
    price = market.get('price', 0)
    currency = "INR" if ".NS" in symbol or ".BO" in symbol else "USD"
    date_str = datetime.now().strftime('%Y-%m-%d %H:%M')
    
    price_info = f"Price: {price:,.2f} {currency}"
    Story.append(Paragraph(price_info, meta_style))
    Story.append(Paragraph(f"Generated on: {date_str}", meta_style))
    Story.append(Spacer(1, 30))
    
    def add_section(title, content):
        if not content: return
        Story.append(Paragraph(title, header_style))
        if isinstance(content, str):
            clean_content = clean_html(content)
            # Split by <br/> to handle paragraphs better if needed, 
            # but usually just one block is okay for reportlab if styled right.
            Story.append(Paragraph(clean_content, normal_style))
        Story.append(Spacer(1, 10))

    # --- 2. Executive Summary ---
    summary = data.get("summary", "No summary available.")
    add_section("AI Executive Summary", summary)
    
    # --- 3. Risk Assessment (Highlighted) ---
    risk = data.get("risk", {})
    risk_level = risk.get("risk_assessment", "N/A")
    volatility = risk.get("volatility", 0) * 100
    
    Story.append(Paragraph("Risk Profile", header_style))
    
    # Create a nice layout for risk
    risk_color = "red" if "high" in risk_level.lower() else "green" if "low" in risk_level.lower() else "orange"
    risk_text = f'''
    <b>Risk Level:</b> <font color="{risk_color}">{risk_level}</font><br/>
    <b>Volatility:</b> {volatility:.2f}%
    '''
    Story.append(Paragraph(risk_text, normal_style))
    Story.append(Spacer(1, 10))

    # --- 4. Fundamentals ---
    fundamentals = data.get("fundamentals", {}).get("analysis", "No analysis available.")
    add_section("Fundamental Analysis", fundamentals)
    
    Story.append(PageBreak()) # Start news on new page if it gets long, or critique

    # --- 5. Critic's Take ---
    critique = data.get("critique", "No critique available.")
    add_section("Critic's Take", critique)
    
    # --- 6. Recent News ---
    news_items = data.get("news", {}).get("news", [])
    Story.append(Paragraph("Recent Market Intelligence", header_style))
    
    if not news_items:
        Story.append(Paragraph("No recent news found.", normal_style))
    else:
        for item in news_items:
            title = clean_html(item.get("title", "No Title"))
            link = item.get("link", "")
            
            # Bullet point style
            if link and link != "#":
                escaped_link = link.replace("&", "&amp;")
                news_text = f'''• {title} <a href="{escaped_link}" color="blue"><u>[Read]</u></a>'''
            else:
                news_text = f"• {title}"
            
            Story.append(Paragraph(news_text, normal_style))
            Story.append(Spacer(1, 4))

    # Build PDF
    doc.build(Story)
    
    pdf_data = buffer.getvalue()
    buffer.close()
    return pdf_data
