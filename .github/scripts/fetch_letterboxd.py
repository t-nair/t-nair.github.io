#!/usr/bin/env python3
import urllib.request
import xml.etree.ElementTree as ET
import json
import re

RSS_URL = "https://letterboxd.com/tanyanair/rss/"
OUTPUT = "letterboxd.json"
MAX_ITEMS = 5


def fetch():
    req = urllib.request.Request(RSS_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read()


def to_stars(rating):
    if rating is None:
        return None
    full = int(rating)
    half = (rating - full) >= 0.5
    return "★" * full + ("\xbd" if half else "")


def parse(xml_bytes):
    root = ET.fromstring(xml_bytes)
    LB = "https://letterboxd.com"
    items = []
    for item in root.findall(".//item")[:MAX_ITEMS]:
        def get(tag):
            el = item.find(tag)
            return el.text.strip() if el is not None and el.text else None

        def lb(tag):
            el = item.find(f"{{{LB}}}{tag}")
            return el.text.strip() if el is not None and el.text else None

        desc = get("description") or ""
        m = re.search(r'<img src="([^"]+)"', desc)
        poster = m.group(1) if m else None

        raw_rating = lb("memberRating")
        rating_val = float(raw_rating) if raw_rating else None

        liked = lb("memberLike")
        items.append({
            "title": lb("filmTitle") or get("title"),
            "year": lb("filmYear"),
            "link": get("link"),
            "date": lb("watchedDate") or get("pubDate"),
            "rating": rating_val,
            "stars": to_stars(rating_val),
            "poster": poster,
            "liked": liked == "Yes",
        })
    return items


data = parse(fetch())
with open(OUTPUT, "w") as f:
    json.dump(data, f, indent=2)
print(f"Wrote {len(data)} entries to {OUTPUT}")
