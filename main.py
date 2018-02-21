from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import query, werkzeug.security, json

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

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5442,
        debug=True,
    )


