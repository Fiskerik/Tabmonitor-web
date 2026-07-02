from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "png"
OUT.mkdir(exist_ok=True)

W, H = 1280, 800

COLORS = {
    "bg": "#f8f9fc",
    "surface": "#ffffff",
    "surface2": "#f1f3f8",
    "border": "#d9e1ee",
    "border2": "#eef0f5",
    "text": "#1a1d23",
    "mid": "#4b5263",
    "dim": "#8c93a3",
    "indigo": "#6366f1",
    "purple": "#8b5cf6",
    "cyan": "#00d4ff",
    "green": "#22c55e",
    "amber": "#fbbf24",
    "red": "#ef4444",
}


def font(size, weight="regular"):
    candidates = {
        "regular": [
            "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/arial.ttf",
        ],
        "semibold": [
            "C:/Windows/Fonts/seguisb.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
        ],
        "bold": [
            "C:/Windows/Fonts/segoeuib.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
        ],
        "mono": [
            "C:/Windows/Fonts/consola.ttf",
            "C:/Windows/Fonts/cour.ttf",
        ],
    }
    for path in candidates.get(weight, candidates["regular"]):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


F = {
    "brand": font(15, "bold"),
    "h1": font(58, "bold"),
    "sub": font(22, "regular"),
    "badge": font(13, "bold"),
    "body": font(14, "regular"),
    "body_bold": font(16, "bold"),
    "small": font(11, "regular"),
    "small_bold": font(11, "bold"),
    "tiny": font(9, "bold"),
    "count": font(24, "bold"),
    "kpi": font(25, "bold"),
    "mono": font(12, "mono"),
}


def hex_to_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def mix(c1, c2, t):
    a = hex_to_rgb(c1) if isinstance(c1, str) else c1
    b = hex_to_rgb(c2) if isinstance(c2, str) else c2
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def rr(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def shadow(canvas, box, radius=18, alpha=28, offset=(0, 18), expand=12):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x1, y1, x2, y2 = box
    ox, oy = offset
    d.rounded_rectangle((x1 - expand + ox, y1 - expand + oy, x2 + expand + ox, y2 + expand + oy), radius=radius + expand, fill=(15, 23, 42, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(expand))
    canvas.alpha_composite(layer)


def gradient_rect(canvas, box, c1, c2, radius=0, horizontal=True):
    x1, y1, x2, y2 = map(int, box)
    w, h = x2 - x1, y2 - y1
    grad = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    pix = grad.load()
    for y in range(h):
        for x in range(w):
            t = x / max(1, w - 1) if horizontal else y / max(1, h - 1)
            pix[x, y] = (*mix(c1, c2, t), 255)
    if radius:
        mask = Image.new("L", (w, h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
        canvas.alpha_composite(grad, (x1, y1), mask)
    else:
        canvas.alpha_composite(grad, (x1, y1))


def text(draw, xy, value, fill="text", font_key="body", anchor=None):
    draw.text(xy, value, fill=COLORS.get(fill, fill), font=F[font_key], anchor=anchor)


def wrap(draw, value, max_width, font_key):
    words = value.split()
    lines, current = [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=F[font_key]) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paragraph(draw, xy, value, max_width, font_key="sub", fill="mid", line_height=1.25):
    x, y = xy
    for line in wrap(draw, value, max_width, font_key):
        text(draw, (x, y), line, fill, font_key)
        y += int(F[font_key].size * line_height)
    return y


def base():
    img = Image.new("RGBA", (W, H), COLORS["bg"])
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        col = mix("#f8f9fc", "#eef6ff", t)
        d.line((0, y, W, y), fill=col)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse((-220, -120, 560, 460), fill=(99, 102, 241, 22))
    od.ellipse((420, 360, 1420, 1040), fill=(0, 212, 255, 16))
    img.alpha_composite(overlay)
    return img


def logo(draw, x, y, size=34):
    gradient = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gradient)
    for i in range(size):
        gd.line((i, 0, i, size), fill=(*mix(COLORS["cyan"], COLORS["purple"], i / max(1, size - 1)), 255))
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size, size), radius=12, fill=255)
    draw.bitmap((x, y), mask, fill=None)
    return gradient, mask


def brand(img, d, x=52, y=44, label="Tab Monitor"):
    grad, mask = logo(d, x, y)
    img.paste(grad, (x, y), mask)
    text(d, (x + 47, y + 9), label.upper(), "indigo", "brand")


def badge(d, x, y, label):
    w = int(d.textlength(label, font=F["badge"])) + 46
    rr(d, (x, y, x + w, y + 34), 17, COLORS["surface"], COLORS["border"])
    d.ellipse((x + 13, y + 13, x + 21, y + 21), fill=COLORS["green"])
    text(d, (x + 30, y + 8), label, "mid", "badge")
    return y + 52


def bullet(d, x, y, icon, title, desc):
    rr(d, (x, y, x + 500, y + 70), 18, (255, 255, 255, 224), COLORS["border2"])
    rr(d, (x + 15, y + 14, x + 57, y + 56), 14, COLORS["surface2"])
    text(d, (x + 36, y + 25), icon, "indigo", "body_bold", anchor="ma")
    text(d, (x + 70, y + 13), title, "text", "body_bold")
    paragraph(d, (x + 70, y + 37), desc, 390, "small", "dim", 1.2)


def bar(d, box, pct, hot=False):
    rr(d, box, 6, COLORS["surface2"])
    x1, y1, x2, y2 = box
    fill_to = x1 + int((x2 - x1) * pct)
    if fill_to > x1:
        rr(d, (x1, y1, fill_to, y2), 6, COLORS["amber" if hot else "cyan"])
        if hot:
            rr(d, (x1 + 30, y1, fill_to, y2), 6, COLORS["red"])


def browser_frame(img, d):
    x, y, w, h = 584, 46, 658, 708
    shadow(img, (x, y, x + w, y + h), 22, alpha=32, offset=(0, 24), expand=16)
    rr(d, (x, y, x + w, y + h), 22, COLORS["surface"], COLORS["border"])
    rr(d, (x, y, x + w, y + 58), 22, COLORS["surface2"], COLORS["border"])
    d.rectangle((x, y + 30, x + w, y + 58), fill=COLORS["surface2"])
    for i in range(3):
        d.ellipse((x + 16 + i * 20, y + 23, x + 28 + i * 20, y + 35), fill=COLORS["border"])
    rr(d, (x + 86, y + 13, x + w - 16, y + 45), 16, COLORS["surface"], COLORS["border"])
    text(d, (x + 104, y + 22), "chrome://newtab", "dim", "small")
    return x, y + 58, w, h - 58


def web_preview(d, x, y, variant):
    rr(d, (x, y, x + 286, y + 650), 0, COLORS["surface"])
    d.line((x + 286, y, x + 286, y + 650), fill=COLORS["border"])
    if variant == 5:
        text(d, (x + 24, y + 26), "Grid View", "text", "body_bold")
        tiles = [
            ("F", "Design System", "figma.com"),
            ("Y", "Studio Analytics", "youtube.com"),
            ("G", "Gmail Inbox", "mail.google.com"),
            ("N", "Release Notes", "notion.so"),
            ("S", "Stripe Dashboard", "stripe.com"),
            ("D", "Chrome Docs", "developer.chrome.com"),
        ]
        tx, ty = x + 22, y + 66
        for idx, (icon, title, domain) in enumerate(tiles):
            col = idx % 2
            row = idx // 2
            bx = tx + col * 122
            by = ty + row * 126
            rr(d, (bx, by, bx + 112, by + 112), 18, COLORS["surface"], COLORS["border2"])
            rr(d, (bx + 12, by + 12, bx + 42, by + 42), 10, COLORS["surface2"])
            text(d, (bx + 27, by + 18), icon, "indigo", "body_bold", anchor="ma")
            paragraph(d, (bx + 12, by + 56), title, 88, "small_bold", "text", 1.1)
            text(d, (bx + 12, by + 92), domain, "dim", "tiny")
        return
    cards = {
        1: [("Research workspace", "24", "Tabs", "4", "Windows"), ("Meeting notes", "18", "Docs", "6", "Idle")],
        2: [("Before cleanup", "4.1 GB", "Total RAM", "9", "Watchlist"), ("After action", "1.8 GB", "Freed", "6", "Suspended")],
        3: [("Workspace template", "12", "Tabs", "3", "Groups"), ("Last backup", "25", "Tabs", "10:45", "Saved")],
        4: [("Weekly Memory Report", "6.4 GB", "Saved", "3", "Rules"), ("Worst domains", "2", "Leaks", "5", "Warnings")],
        5: [("Grid View", "25", "Tabs", "12", "Domains"), ("Duplicate scan", "3", "Dupes", "4", "Windows")],
    }[variant]
    yy = y + 24
    for title, a, al, b, bl in cards:
        rr(d, (x + 22, yy, x + 264, yy + 154), 18, COLORS["surface"], COLORS["border2"])
        text(d, (x + 40, yy + 19), title, "text", "body_bold")
        d.rounded_rectangle((x + 40, yy + 58, x + 218, yy + 67), radius=5, fill=COLORS["border2"])
        d.rounded_rectangle((x + 40, yy + 80, x + 178, yy + 89), radius=5, fill=COLORS["border2"])
        rr(d, (x + 40, yy + 108, x + 140, yy + 142), 12, COLORS["bg"], COLORS["border2"])
        rr(d, (x + 150, yy + 108, x + 250, yy + 142), 12, COLORS["bg"], COLORS["border2"])
        text(d, (x + 50, yy + 112), a, "indigo", "body_bold")
        text(d, (x + 50, yy + 132), al.upper(), "dim", "tiny")
        text(d, (x + 160, yy + 112), b, "indigo", "body_bold")
        text(d, (x + 160, yy + 132), bl.upper(), "dim", "tiny")
        yy += 174


def sidebar(d, x, y, variant):
    d.rectangle((x, y, x + 372, y + 650), fill=COLORS["bg"])
    rr(d, (x, y, x + 372, y + 50), 0, COLORS["surface"])
    d.line((x, y + 50, x + 372, y + 50), fill=COLORS["border2"])
    rr(d, (x + 14, y + 14, x + 36, y + 36), 9, COLORS["cyan"])
    text(d, (x + 46, y + 16), "Tab Monitor", "text", "body_bold")
    rr(d, (x + 279, y + 11, x + 318, y + 39), 11, COLORS["surface"], COLORS["border2"])
    text(d, (x + 291, y + 19), "Grid", "dim", "small_bold")
    rr(d, (x + 324, y + 11, x + 358, y + 39), 11, COLORS["indigo"])
    text(d, (x + 333, y + 19), "Pro", "#ffffff", "small_bold")
    labels = {
        1: [("Critical", "2", "red"), ("Warning", "5", "amber"), ("Normal", "18", "green")],
        2: [("Critical", "2", "red"), ("Warning", "5", "amber"), ("Normal", "18", "green")],
        3: [("Saved", "4", "green"), ("Backups", "18", "text"), ("Parked", "7", "amber")],
        4: [("Rules", "3", "green"), ("Leaks", "2", "red"), ("Saved", "6.4", "text")],
        5: [("Windows", "4", "text"), ("Domains", "12", "green"), ("Dupes", "3", "amber")],
    }[variant]
    sx = x + 10
    for label, value, color in labels:
        rr(d, (sx, y + 58, sx + 112, y + 116), 14, COLORS["bg"], COLORS["border2"])
        text(d, (sx + 10, y + 67), label.upper(), "dim", "tiny")
        text(d, (sx + 10, y + 84), value, color, "count")
        sx += 118
    nav = ["Processes", "History", "Stats", "Settings"]
    active = [0, 0, 1, 3, 0][variant - 1]
    nx = x + 6
    for i, item in enumerate(nav):
        color = "indigo" if i == active else "dim"
        text(d, (nx + 42, y + 133), item, color, "small_bold", anchor="ma")
        if i == active:
            d.line((nx + 12, y + 149, nx + 72, y + 149), fill=COLORS["indigo"], width=3)
        nx += 90
    d.line((x, y + 154, x + 372, y + 154), fill=COLORS["border2"])
    toolbar_y = y + 155
    d.rectangle((x, toolbar_y, x + 372, toolbar_y + 41), fill=COLORS["surface"])
    rr(d, (x + 10, toolbar_y + 8, x + 56, toolbar_y + 31), 12, COLORS["indigo"])
    text(d, (x + 25, toolbar_y + 13), "RAM", "#ffffff", "small_bold")
    rr(d, (x + 62, toolbar_y + 8, x + 104, toolbar_y + 31), 12, COLORS["surface"], COLORS["border2"])
    text(d, (x + 73, toolbar_y + 13), "CPU", "dim", "small_bold")
    text(d, (x + 318, toolbar_y + 13), "25 tabs", "dim", "small")
    start = y + 204
    if variant == 2:
        rr(d, (x + 10, start, x + 362, start + 92), 16, "#eef2ff", "#cfd5ff")
        text(d, (x + 22, start + 11), "Smart Cleanup Plan", "text", "body_bold")
        text(d, (x + 288, start + 8), "1.8 GB", "indigo", "kpi")
        paragraph(d, (x + 22, start + 39), "Suspend 6 idle high-RAM tabs. Found 3 duplicates and 2 leak candidates.", 290, "small", "mid", 1.25)
        rr(d, (x + 22, start + 67, x + 132, start + 86), 9, COLORS["indigo"])
        text(d, (x + 39, start + 70), "Suspend now", "#ffffff", "tiny")
        start += 100
    rows = {
        1: [("Figma Design System", "figma.com - idle 42m", "1.2 GB", .92, True), ("YouTube Studio", "youtube.com - audio", "847 MB", .72, True), ("Gmail Inbox", "mail.google.com", "214 MB", .25, False), ("Chrome Extensions Docs", "developer.chrome.com", "189 MB", .21, False)],
        2: [("Figma Design System", "idle 42m - rule recommended", "1.2 GB", .92, True), ("Analytics Dashboard", "duplicate tab detected", "512 MB", .58, True), ("Notion Planning", "safe to suspend", "286 MB", .36, False)],
        3: [("Monday research workspace", "14 tabs - 2 windows", "Restore", .78, False), ("Client admin dashboard", "9 tabs - saved today", "Open", .52, False), ("Auto-backup 10:45", "25 tabs - before cleanup", "Pro", .64, True)],
        4: [("youtube.com", "Auto-suspend after 20m idle", "On", .74, False), ("figma.com", "Warn above 900 MB", "On", .66, False), ("Rule recommendation", "Auto-suspend docs after 30m idle", "Add", .54, True)],
        5: [("Figma Design System", "group: Design", "1.2 GB", .92, True), ("Stripe Dashboard", "group: Admin", "248 MB", .28, False), ("Duplicate: Docs", "developer.chrome.com", "186 MB", .34, True)],
    }[variant]
    yy = start
    for title, dom, mem, pct, hot in rows:
        rr(d, (x + 8, yy, x + 364, yy + 82), 16, COLORS["surface"], COLORS["border2"])
        d.line((x + 10, yy + 12, x + 10, yy + 70), fill=COLORS["red" if hot else "border"], width=4)
        text(d, (x + 24, yy + 14), title, "text", "small_bold")
        text(d, (x + 24, yy + 34), dom, "dim", "small")
        text(d, (x + 298, yy + 18), mem, "mid", "mono")
        bar(d, (x + 24, yy + 62, x + 330, yy + 68), pct, hot)
        yy += 90


def chrome_with_sidebar(img, d, variant):
    bx, by, bw, bh = browser_frame(img, d)
    web_preview(d, bx, by, variant)
    sidebar(d, bx + 286, by, variant)


def grid_drawer(d):
    x, y = 862, 590
    rr(d, (x, y, x + 360, y + 164), 20, COLORS["surface"], COLORS["border"])
    text(d, (x + 18, y + 18), "Grid View preview", "text", "kpi")
    paragraph(d, (x + 18, y + 52), "Show the locked Pro value before checkout: windows, domains, duplicates, and visual tab context.", 310, "small", "mid", 1.25)
    rr(d, (x + 18, y + 112, x + 160, y + 146), 12, COLORS["bg"], COLORS["border2"])
    rr(d, (x + 174, y + 112, x + 342, y + 146), 12, COLORS["bg"], COLORS["border2"])
    text(d, (x + 30, y + 117), "25 tabs mapped", "indigo", "small_bold")
    text(d, (x + 188, y + 117), "3 duplicates found", "indigo", "small_bold")


SLIDES = [
    ("Tab Monitor", "Chrome side panel for tab overload", "Find the tabs slowing Chrome down.", "Live RAM and CPU monitoring in the Chrome sidebar shows the heavy, duplicated, idle, and risky tabs instantly.", [("1", "Spot memory hogs", "Sort tabs by RAM, CPU, status, or window."), ("2", "Clean up in one click", "Suspend, close, pin, bookmark, or move selected tabs."), ("3", "Keep context", "Use history, parking, sessions, and backups when you need them back.")]),
    ("Smart Cleanup Plan", "New in 1.1.0", "Free memory now. Automate it with Pro.", "Tab Monitor turns a long list of tabs into a clear action queue, then shows the exact Pro automation that would prevent the same mess next time.", [("GB", "1.8 GB reclaimable", "Idle high-RAM tabs are grouped into one cleanup action."), ("OK", "Post-action proof", "Show users how much memory they just freed."), ("P", "Upgrade at the right moment", "Offer auto-suspend rules after the user sees value.")]),
    ("Sessions & Recovery", "Save workspaces, restore later", "Recover from tab chaos.", "Auto-backups, saved sessions, parking, and restore tools help power users close tabs without feeling like they are losing work.", [("S", "Saved sessions", "Store recurring layouts for research, admin, or client work."), ("B", "Auto-backups", "Recover recent browser state after a crash or cleanup mistake."), ("R", "Restore confidence", "Make cleanup feel reversible instead of scary.")]),
    ("Pro Automation", "Rules that keep Chrome fast", "Stop fixing the same tabs manually.", "Pro turns repeated memory pain into one-click rules: auto-suspend idle sites, warn on leaks, and keep heavy domains under control.", [("20", "YouTube rule", "Auto-suspend after 20 minutes idle."), ("!", "Leak alerts", "Warn before a tab starts dragging the browser."), ("Pro", "Unlimited focus", "Keep only the tabs that matter active.")]),
    ("Grid View", "Visual overview for power tab users", "See every tab before you decide.", "Grid View gives Pro users a fast visual map of windows, domains, and workflows so cleanup feels deliberate.", [("G", "Scan by site", "Quickly spot duplicate dashboards and stale research."), ("W", "Across windows", "Bring scattered work back into a clean structure."), ("P", "Pro preview", "Let free users see exactly what they unlock.")]),
]


def make_slide(index, data):
    img = base()
    d = ImageDraw.Draw(img)
    brand(img, d, label=data[0])
    y = badge(d, 52, 116, data[1])
    paragraph(d, (52, y), data[2], 520, "h1", "text", 1.02)
    y += 178
    y = paragraph(d, (52, y), data[3], 500, "sub", "mid", 1.28) + 22
    for icon, title, desc in data[4]:
        bullet(d, 52, y, icon, title, desc)
        y += 82
    chrome_with_sidebar(img, d, index)
    if index == 5:
        grid_drawer(d)
    target = OUT / f"tab-monitor-store-0{index}.png"
    img.convert("RGB").save(target, quality=95)
    return target


for idx, slide in enumerate(SLIDES, start=1):
    print(make_slide(idx, slide))
