from flask import Flask, render_template, request
import pandas as pd

app = Flask(__name__)

# Load Excel file
df = pd.read_excel("library.xlsx")

@app.route("/", methods=["GET", "POST"])
def index():
    query = request.form.get("query", "").lower()
    if query:
        filtered = df[df.apply(lambda row: row.astype(str).str.lower().str.contains(query), axis=1)]
    else:
        filtered = df
    return render_template("index.html", headers=filtered.columns, rows=filtered.values.tolist())

if __name__ == "__main__":
    app.run(debug=True)
