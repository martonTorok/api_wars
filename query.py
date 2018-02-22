import db_connection


@db_connection.connection_handler
def register_user(cursor, username, hashedpw):
    cursor.execute('''
                    INSERT INTO users (username, password)
                    VALUES (%(username)s, %(hashedpw)s);
                    ''',
                   {'username': username,
                    'hashedpw': hashedpw})


@db_connection.connection_handler
def get_usernames(cursor):
    cursor.execute('''
                    SELECT username FROM users
                    ''')
    data = cursor.fetchall()
    return data


@db_connection.connection_handler
def get_hashedpw_by_username(cursor, username):
    cursor.execute('''
                    SELECT password FROM users
                    WHERE username = %(username)s;
                    ''',
                   {'username': username})
    data = cursor.fetchone()
    return data


@db_connection.connection_handler
def get_user_id(cursor, username):
    cursor.execute('''
                    SELECT id FROM users
                    WHERE username = %(username)s;
                    ''',
                   {'username': username})
    data = cursor.fetchone()
    return data


@db_connection.connection_handler
def insert_into_votes(cursor, planet_id, planet_name, user_id):
    cursor.execute('''
                    INSERT INTO planet_votes(planet_id, planet_name, user_id)
                    VALUES (%(planet_id)s, %(planet_name)s, %(user_id)s);
                    ''',
                   {'planet_id': planet_id,
                    'planet_name': planet_name,
                    'user_id': user_id})


@db_connection.connection_handler
def get_planet_votes(cursor):
    cursor.execute('''
                    SELECT planet_name,COUNT(planet_name) as votescount FROM planet_votes
                    GROUP BY planet_name
                    ORDER BY votescount DESC;''')
    data = cursor.fetchall()
    return data
