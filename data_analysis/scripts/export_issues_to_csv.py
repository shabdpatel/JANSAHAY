import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os

# Step 1: Initialize Firebase app
cred = credentials.Certificate("serviceAccount.json")  # Update path if needed
firebase_admin.initialize_app(cred)
db = firestore.client()

# Step 2: Fetch documents from Firestore
docs = db.collection("issues").stream()

# Step 3: Process and flatten documents
data = []

for doc in docs:
    item = doc.to_dict()

    # ✅ Access lat/lng from coordinates map
    coordinates = item.get("coordinates", {})
    lat = coordinates.get("lat", None)
    lng = coordinates.get("lng", None)

    # ✅ Access reporter fields safely
    reporter = item.get("reporter", {})
    reporter_name = reporter.get("name", "")
    reporter_email = reporter.get("email", "")
    reporter_mobile = reporter.get("mobile", "")

    # ✅ Combine image links into one string
    image_urls = ", ".join(item.get("images", [])) if "images" in item else ""

    # ✅ Format timestamp (if needed)
    created_at = str(item.get("createdAt"))  # Can be converted to datetime if needed

    # ✅ Add all relevant data to the list
    data.append({
        "createdAt": created_at,
        "lat": lat,
        "lng": lng,
        "department": item.get("department"),
        "issueType": item.get("issueType"),
        "description": item.get("description"),
        "location": item.get("location"),
        "reporter_name": reporter_name,
        "reporter_email": reporter_email,
        "reporter_mobile": reporter_mobile,
        "images": image_urls
    })

# Step 4: Save to CSV
df = pd.DataFrame(data)
output_path = os.path.join(os.path.dirname(__file__), "firestore_issues_export.csv")
df.to_csv(output_path, index=False)

print(f"✅ Exported Firestore issues to {output_path}")

