import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

TOKEN = os.getenv("MAPBOX_TOKEN", "")

CENTER_LAT = 40.74790
CENTER_LNG = 30.35220

OFFSET_X = 0.0085   # <-- only change this value to tune tile spacing
OFFSET_Y = 0.0060   # <-- only change this value to tune tile spacing

labels = ["NW", "N ", "NE", "W ", "CT", "E ", "SW", "S ", "SE"]
coords = [
    (CENTER_LAT + OFFSET_Y, CENTER_LNG - OFFSET_X),
    (CENTER_LAT + OFFSET_Y, CENTER_LNG),
    (CENTER_LAT + OFFSET_Y, CENTER_LNG + OFFSET_X),
    (CENTER_LAT,          CENTER_LNG - OFFSET_X),
    (CENTER_LAT,          CENTER_LNG),
    (CENTER_LAT,          CENTER_LNG + OFFSET_X),
    (CENTER_LAT - OFFSET_Y, CENTER_LNG - OFFSET_X),
    (CENTER_LAT - OFFSET_Y, CENTER_LNG),
    (CENTER_LAT - OFFSET_Y, CENTER_LNG + OFFSET_X),
]

print(f"\nOFFSET = {OFFSET_X, OFFSET_Y}  |  center = ({CENTER_LAT}, {CENTER_LNG})\n")
for label, (lat, lng) in zip(labels, coords):
    url = (
        f"https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/"
        f"{lng},{lat},15,0/350x350"
        f"?access_token={TOKEN}&logo=false&attribution=false"
    )
    print(f"[{label}]  {url}\n")
