#!/usr/bin/env python3
import urllib.request
import xml.etree.ElementTree as ET
import json

GOODREADS_ID = "187718956"
OUTPUT = "goodreads.json"


def fetch_shelf(shelf):
    url = f"https://www.goodreads.com/review/list_rss/{GOODREADS_ID}?shelf={shelf}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read()


def parse_shelf(xml_bytes, limit=None):
    root = ET.fromstring(xml_bytes)
    all_items = root.findall(".//item")
    if limit:
        all_items = all_items[:limit]
    items = []
    for item in all_items:
        def get(tag):
            el = item.find(tag)
            return el.text.strip() if el is not None and el.text else None

        title = get("title")
        author = get("author_name")

        # Goodreads sometimes formats title as "Book Title by Author"
        if author and title and title.endswith(f" by {author}"):
            title = title[:-(len(author) + 4)]

        cover = (
            get("book_large_image_url")
            or get("book_medium_image_url")
            or get("book_image_url")
        )

        rating = get("user_rating")
        items.append({
            "title": title,
            "author": author,
            "link": get("link"),
            "cover": cover,
            "rating": int(rating) if rating and rating != "0" else None,
            "date_added": get("user_date_added"),
        })
    return items


currently_reading = parse_shelf(fetch_shelf("currently-reading"))
recently_read = parse_shelf(fetch_shelf("read"), limit=6)

data = {
    "currently_reading": currently_reading,
    "recently_read": recently_read,
}

with open(OUTPUT, "w") as f:
    json.dump(data, f, indent=2)
print(f"Currently reading: {len(currently_reading)}, Recently read: {len(recently_read)}")
