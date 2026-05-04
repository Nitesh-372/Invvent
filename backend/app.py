from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
from flask import send_from_directory
import os

from model_classes import SimilarProductModel, FrequentBoughtModel

app = Flask(__name__)
CORS(app)

# ---------------------------
# LOAD PRODUCTS.JSON
# ---------------------------
with open("products.json", "r", encoding="utf-8") as f:
    products_data = json.load(f)

# index by product_id
PRODUCT_MAP = {str(p["product_id"]): p for p in products_data}


# ---------------------------
# IMAGE HANDLING (AUTO EXTENSION)
# ---------------------------
def find_image(product_id):
    """Checks for .jpg, .jpeg, .png for the given product_id"""
    image_dir = os.path.join(os.getcwd(), "images")

    for ext in ["jpg", "jpeg", "png"]:
        path = os.path.join(image_dir, f"{product_id}.{ext}")
        if os.path.exists(path):
            return f"/images/{product_id}.{ext}"

    # fallback
    return "/images/placeholder.png"


# ---------------------------
# LOAD ML MODELS
# ---------------------------
similar_model = joblib.load("models/similar_model.pkl")
frequent_model = joblib.load("models/frequent_model.pkl")

df = similar_model.df  # df from the similar model class


# ---------------------------
# API ROUTES
# ---------------------------

@app.get("/")
def home():
    return jsonify({"message": "Flask backend running"})


# ---------- ALL PRODUCTS ----------
@app.get("/products")
def all_products():
    category = request.args.get("category")
    q = request.args.get("q")

    result = list(PRODUCT_MAP.values())

    # Filter by category
    if category:
        result = [p for p in result if p["category"].lower() == category.lower()]

    # Search
    if q:
        ql = q.lower()
        result = [
            p for p in result
            if ql in p["product_name"].lower()
            or ql in str(p.get("description", "")).lower()
        ]

    # add image paths
    for p in result:
        p["image"] = find_image(p["product_id"])

    return jsonify(result)


# ---------- SINGLE PRODUCT DETAIL ----------
@app.get("/products/<product_id>")
def get_product(product_id):
    product = PRODUCT_MAP.get(str(product_id))
    if not product:
        return jsonify({"error": "Product not found"}), 404

    product["image"] = find_image(product["product_id"])
    return jsonify(product)


# ---------- CATEGORY LIST ----------
@app.get("/categories")
def get_categories():
    cats = sorted(list({p["category"] for p in PRODUCT_MAP.values()}))

    result = [
        {
            "id": c,
            "name": c,
            "image": f"https://dummyimage.com/200x200/000/fff&text={c.replace(' ', '+')}"
        }
        for c in cats
    ]

    return jsonify(result)


# ---------- SIMILAR PRODUCTS ----------
@app.post("/recommend/similar")
def recommend_similar():
    data = request.get_json()
    product_name = data.get("product_name")

    if not product_name:
        return jsonify({"error": "product_name missing"}), 400

    # ML model returns a DataFrame
    sim_df = similar_model.predict(product_name)
    if sim_df is None or len(sim_df) == 0:
        return jsonify([])

    response = []
    for _, row in sim_df.iterrows():
        pid = str(row["product_id"])
        if pid in PRODUCT_MAP:
            prod = PRODUCT_MAP[pid].copy()
            prod["similarity_score"] = row["similarity_score"]
            prod["image"] = find_image(pid)
            response.append(prod)

    return jsonify(response)


# ---------- FREQUENTLY BOUGHT ----------
@app.post("/recommend/frequent")
def recommend_frequent():
    data = request.get_json()
    product_name = data.get("product_name")

    if not product_name:
        return jsonify({"error": "product_name missing"}), 400

    freq_results = frequent_model.predict(product_name)

    response = []
    for item in freq_results:
        pid = str(item["product"])
        if pid in PRODUCT_MAP:
            prod = PRODUCT_MAP[pid].copy()
            prod["confidence"] = item["confidence"]
            prod["lift"] = item["lift"]
            prod["image"] = find_image(pid)
            response.append(prod)

    return jsonify(response)
# Serve image files from backend/images folder
@app.route("/images/<path:filename>")
def serve_image(filename):
    image_folder = os.path.join(os.getcwd(), "images")
    return send_from_directory(image_folder, filename)

# ---------- RUN ----------
if __name__ == "__main__":
    print("🚀 Flask server running at http://127.0.0.1:8000")
    app.run(debug=True, port=8000)

