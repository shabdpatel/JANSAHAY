import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os

# Step 1: Initialize Firebase app
cred = credentials.Certificate("../fire.json")  # Update path if needed
firebase_admin.initialize_app(cred)
db = firestore.client()

# ✅ Step 2: List of all issue category collections
issue_collections = [
    "animalmenaceissues",
    "blockeddrainissues",
    "brokenbenchissues",
    "illegalparkingissues",
    "manholeopenissues",
    "otherissues",
    "potholeissues",
    "treefallenissues",
    "waterleakissues",
    "roaddamageissues",
    "streetlightissues",
    "poweroutageissues",
    "garbageissues",
    "noisecomplaintissues",
]

# ✅ Step 3: Loop through each collection
data = []

for collection_name in issue_collections:
    docs = db.collection(collection_name).stream()

    for doc in docs:
        item = doc.to_dict()

        # Coordinates
        coordinates = item.get("coordinates", {})
        lat = coordinates.get("lat", None)
        lng = coordinates.get("lng", None)

        # Reporter (optional)
        reporter = item.get("reporter", {})
        reporter_name = reporter.get("name", "")
        reporter_email = reporter.get("email", "")
        reporter_mobile = reporter.get("mobile", "")

        # Images
        image_urls = ", ".join(item.get("images", [])) if "images" in item else ""

        # Timestamp
        created_at = str(item.get("createdAt"))

        data.append({
            "collection": collection_name,  # Helpful to know which category
            "createdAt": created_at,
            "lat": lat,
            "lng": lng,
            "department": item.get("department", ""),
            "issueType": item.get("issueType", ""),
            "description": item.get("description", ""),
            "location": item.get("location", ""),
            "reporter_name": reporter_name,
            "reporter_email": reporter_email,
            "reporter_mobile": reporter_mobile,
            "images": image_urls
        })

# ✅ Step 4: Save to CSV
df = pd.DataFrame(data)
output_path = os.path.join(os.path.dirname(__file__), "firestore_issues_export.csv")
df.to_csv(output_path, index=False)

print(f"✅ Exported {len(data)} issues to {output_path}")
