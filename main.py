from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import query, werkzeug.security
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = "NQ$74dec029f7b51776fc3ede88e570bbc31b0ad0b8bdd8e8197b3"
app.secret_key = 'NQ$74dec029f7b51776fc3ede88e570bbc31b0ad0b8bdd8e8197b3'


@app.route('/')
def route_index():
    logged_in = False
    if 'username' in session:
        logged_in = True
    return render_template('index.html', logged_in=logged_in)


@app.route('/registration', methods=['POST'])
def registration():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        results = query.get_usernames()
        all_usernames = []
        for record in results:
            all_usernames.append(record['username'])
        if username not in all_usernames:
            hashedpw = werkzeug.security.generate_password_hash(password)
            query.register_user(username, hashedpw)
            return jsonify(success=True)
        else:
            return jsonify(success=False)


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['loginUsername']
        password = request.form['loginPassword']
        password_record = query.get_hashedpw_by_username(username)
        results = query.get_usernames()
        all_usernames = []
        for record in results:
            all_usernames.append(record['username'])
        if username not in all_usernames:
            return jsonify(success=False)
        if werkzeug.security.check_password_hash(password_record['password'], password):
            session['username'] = request.form['loginUsername']
            return jsonify(success=True)
        else:
            return jsonify(success=False)


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')


@app.route('/valLog')
def is_logged_in():
    if 'username' in session:
        return jsonify(loggedin=True)
    else:
        return jsonify(loggedin=False)


@app.route('/planet/<planetid>/vote', methods=['POST'])
def vote_planet(planetid):
    if request.method == 'POST':
        username = session['username']
        user_id = (query.get_user_id(username))['id']
        print(user_id)
        planet_name = request.json['planet_name']
        planet_id = request.json['planet_id']
        query.insert_into_votes(planet_id, planet_name, user_id)
        return jsonify(success=True, planetname=planet_name)


@app.route('/vote-statistics')
def vote_statistics():
    stats = query.get_planet_votes()
    return jsonify(stats)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5442,
        debug=True,
    )
