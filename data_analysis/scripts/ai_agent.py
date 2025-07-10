import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
import json
from datetime import datetime

# --------- Step 1: Load & Preprocess CSV ---------
try:
    df = pd.read_csv("firestore_issues_export.csv")
    print(f"[INFO] Loaded {len(df)} rows from CSV.")
except Exception as e:
    print(f"[ERROR] Failed to load CSV: {e}")
    exit()

# Convert 'createdAt' to datetime and remove timezone
df["createdAt"] = pd.to_datetime(df["createdAt"], errors='coerce')
df["createdAt"] = df["createdAt"].dt.tz_localize(None)
df.dropna(subset=["createdAt", "lat", "lng"], inplace=True)

# Normalize fields
df["month"] = df["createdAt"].dt.strftime("%Y-%m")
df["issueType"] = df["issueType"].astype(str).str.lower().str.strip()
df["department"] = df["department"].astype(str).str.strip()
df["location"] = df["location"].astype(str).str.strip()
df["issue_age_days"] = (pd.Timestamp.today() - df["createdAt"]).dt.days

# --------- Step 2: Cluster Hotspots ---------
coords = df[["lat", "lng"]].to_numpy()
clustering = DBSCAN(eps=20, min_samples=2).fit(coords)
df["cluster"] = clustering.labels_

# --------- Step 3: Department Stats (Optional Summary) ---------
dept_stats = df.groupby("department").agg({
    "description": "count",
    "issueType": pd.Series.nunique
}).rename(columns={"description": "issue_count", "issueType": "unique_issue_types"}).reset_index()

# --------- Step 4: Multi-Issue Cluster Suggestions ---------
def generate_cluster_recommendations(clustered_df):
    cluster_recommendations = []

    for cluster_id, cluster_data in clustered_df.groupby("cluster"):
        if cluster_id == -1:
            continue  # Skip noise

        center_lat = cluster_data["lat"].mean()
        center_lng = cluster_data["lng"].mean()
        issue_counts = cluster_data["issueType"].value_counts()
        top_issue = issue_counts.idxmax()

        suggestions = []
        for issue in issue_counts.index:
            issue_lower = issue.lower()
            if "garbage" in issue_lower:
                suggestions.append("Deploy more garbage bins and improve waste pickup.")
            elif "pothole" in issue_lower:
                suggestions.append("Schedule urgent road repair for potholes.")
            elif "bench" in issue_lower:
                suggestions.append("Fix or replace broken benches in public areas.")
            elif "tree" in issue_lower:
                suggestions.append("Clear fallen trees and prune unstable ones.")
            elif "leak" in issue_lower or "water" in issue_lower:
                suggestions.append("Inspect and repair leaking pipelines.")
            elif "streetlight" in issue_lower:
                suggestions.append("Inspect and fix broken streetlights.")
            elif "parking" in issue_lower:
                suggestions.append("Enforce no-parking zones with fines or towing.")
            elif "drain" in issue_lower:
                suggestions.append("Clear blocked drains to prevent overflow and odor.")
            elif "animal" in issue_lower:
                suggestions.append("Send animal control team to handle stray or dangerous animals.")
            elif "manhole" in issue_lower:
                suggestions.append("Cover open manholes to prevent accidents.")
            elif "construction" in issue_lower or "unauthorized" in issue_lower or "other" in issue_lower:
                suggestions.append("Investigate reported issues and take appropriate municipal action.")
            else:
                suggestions.append(f"Review and resolve reported issue: {issue}.")

        unique_suggestions = list(set(suggestions))
        final_suggestion = " | ".join(unique_suggestions)

        cluster_data_serialized = cluster_data.copy()
        cluster_data_serialized["createdAt"] = cluster_data_serialized["createdAt"].astype(str)

        cluster_recommendations.append({
            "cluster_id": int(cluster_id),
            "center_lat": center_lat,
            "center_lng": center_lng,
            "top_issue": top_issue,
            "suggestion": final_suggestion,
            "issue_count": len(cluster_data),
            "issues": cluster_data_serialized.to_dict(orient="records")
        })

    return cluster_recommendations

# Generate suggestions
recommendations = generate_cluster_recommendations(df)

# --------- Step 5: Save Output to JSON ---------
output_path = "ai_suggestions.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(recommendations, f, indent=2, ensure_ascii=False)



# --------- Step 6: Generate Department-wise Suggestions ---------
def generate_department_suggestions(df):
    department_suggestions = []

    for dept, dept_data in df.groupby("department"):
        if dept.strip() == "":
            continue

        issue_counts = dept_data["issueType"].value_counts()
        suggestions = []

        for issue in issue_counts.index:
            issue_lower = issue.lower()
            if "garbage" in issue_lower:
                suggestions.append("Increase garbage bin coverage and improve waste collection schedules.")
            elif "pothole" in issue_lower:
                suggestions.append("Prioritize road maintenance in high-traffic areas.")
            elif "bench" in issue_lower:
                suggestions.append("Replace or repair broken benches in parks and bus stops.")
            elif "tree" in issue_lower:
                suggestions.append("Conduct tree maintenance drives to remove hazards.")
            elif "leak" in issue_lower or "water" in issue_lower:
                suggestions.append("Fix leaking pipelines and monitor water supply.")
            elif "streetlight" in issue_lower:
                suggestions.append("Audit non-functional streetlights and replace faulty ones.")
            elif "parking" in issue_lower:
                suggestions.append("Enforce strict no-parking zones and regulate unauthorized parking.")
            elif "drain" in issue_lower:
                suggestions.append("Regularly clean clogged drains and improve drainage mapping.")
            elif "animal" in issue_lower:
                suggestions.append("Run animal control and vaccination drives.")
            elif "manhole" in issue_lower:
                suggestions.append("Ensure all open manholes are covered securely.")
            elif "construction" in issue_lower or "unauthorized" in issue_lower or "other" in issue_lower:
                suggestions.append("Investigate and act on unauthorized construction complaints.")
            else:
                suggestions.append(f"Review issue reports related to: {issue}.")

        unique_suggestions = list(set(suggestions))

        # Prepare issue location data
        dept_data_serialized = dept_data[[
            "createdAt", "issueType", "description", "lat", "lng", "location", "issue_age_days"
        ]].copy()
        dept_data_serialized["createdAt"] = dept_data_serialized["createdAt"].astype(str)

        issue_records = dept_data_serialized.to_dict(orient="records")

        department_suggestions.append({
            "department": dept,
            "issue_count": len(dept_data),
            "top_issues": issue_counts.head(3).to_dict(),
            "center_lat": dept_data["lat"].mean(),
            "center_lng": dept_data["lng"].mean(),
            "suggestions": unique_suggestions,
            "issues": issue_records
        })

    return department_suggestions

# Generate department-wise suggestions
dept_suggestions = generate_department_suggestions(df)

# Save department suggestions
dept_output_path = "department_suggestions.json"
with open(dept_output_path, "w", encoding="utf-8") as f:
    json.dump(dept_suggestions, f, indent=2, ensure_ascii=False)

print(f"[✅ DONE] Exported {len(dept_suggestions)} department suggestions to '{dept_output_path}'")