from flask import Flask, render_template, request, redirect, url_for, session, flash, g
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "data.db")

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-me")

def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DB_PATH)
        db.row_factory = sqlite3.Row
    return db

def init_db():
    db = get_db()
    with app.open_resource("schema.sql", mode="r") as f:
        db.executescript(f.read())
    db.commit()
    
with app.app_context():
    if not os.path.exists(DB_PATH):
        init_db()


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()

def current_user():
    uid = session.get("user_id")
    if not uid:
        return None
    db = get_db()
    return db.execute("SELECT id, username FROM users WHERE id = ?", (uid,)).fetchone()

@app.route("/")
def index():
    if current_user():
        return redirect(url_for("dashboard"))
    return render_template("index.html")

@app.route("/register", methods=("GET","POST"))
def register():
    if request.method == "POST":
        username = request.form["username"].strip()
        password = request.form["password"]
        if not username or not password:
            flash("Preencha usuário e senha.")
            return redirect(url_for("register"))
        db = get_db()
        existing = db.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
        if existing:
            flash("Usuário já existe.")
            return redirect(url_for("register"))
        pw_hash = generate_password_hash(password)
        db.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, pw_hash))
        db.commit()
        flash("Conta criada. Faça login.")
        return redirect(url_for("login"))
    return render_template("register.html")

@app.route("/login", methods=("GET","POST"))
def login():
    if request.method == "POST":
        username = request.form["username"].strip()
        password = request.form["password"]
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        if user and check_password_hash(user["password"], password):
            session.clear()
            session["user_id"] = user["id"]
            flash("Login efetuado.")
            return redirect(url_for("dashboard"))
        flash("Usuário ou senha incorretos.")
        return redirect(url_for("login"))
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    flash("Desconectado.")
    return redirect(url_for("index"))

@app.route("/dashboard")
def dashboard():
    user = current_user()
    if not user:
        return redirect(url_for("login"))
    db = get_db()
    rows = db.execute("SELECT * FROM os WHERE user_id = ? ORDER BY id DESC", (user["id"],)).fetchall()
    return render_template("dashboard.html", os_list=rows, user=user)

@app.route("/add", methods=("GET","POST"))
def add():
    user = current_user()
    if not user:
        return redirect(url_for("login"))
    if request.method == "POST":
        cliente = request.form["cliente"].strip()
        tecnico = request.form["tecnico"].strip()
        descricao = request.form["descricao"].strip()
        valor = request.form["valor"].strip()
        status = request.form["status"]
        if not all([cliente, tecnico, descricao, valor]):
            flash("Preencha todos os campos.")
            return redirect(url_for("add"))
        db = get_db()
        db.execute("INSERT INTO os (user_id, cliente, tecnico, descricao, valor, status) VALUES (?, ?, ?, ?, ?, ?)",
                   (user["id"], cliente, tecnico, descricao, valor, status))
        db.commit()
        flash("OS adicionada.")
        return redirect(url_for("dashboard"))
    return render_template("add.html")

@app.route("/edit/<int:os_id>", methods=("GET","POST"))
def edit(os_id):
    user = current_user()
    if not user:
        return redirect(url_for("login"))
    db = get_db()
    os_item = db.execute("SELECT * FROM os WHERE id = ? AND user_id = ?", (os_id, user["id"])).fetchone()
    if not os_item:
        flash("OS não encontrada.")
        return redirect(url_for("dashboard"))
    if request.method == "POST":
        cliente = request.form["cliente"].strip()
        tecnico = request.form["tecnico"].strip()
        descricao = request.form["descricao"].strip()
        valor = request.form["valor"].strip()
        status = request.form["status"]
        db.execute("UPDATE os SET cliente=?, tecnico=?, descricao=?, valor=?, status=? WHERE id=?",
                   (cliente, tecnico, descricao, valor, status, os_id))
        db.commit()
        flash("OS atualizada.")
        return redirect(url_for("dashboard"))
    return render_template("edit.html", os_item=os_item)

@app.route("/delete/<int:os_id>", methods=("POST",))
def delete(os_id):
    user = current_user()
    if not user:
        return redirect(url_for("login"))
    db = get_db()
    db.execute("DELETE FROM os WHERE id = ? AND user_id = ?", (os_id, user["id"]))
    db.commit()
    flash("OS removida.")
    return redirect(url_for("dashboard"))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=True)
