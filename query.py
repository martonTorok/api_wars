import db_connection


@db_connection.connection_handler
def register_user(cursor, username, hashedpw):
    cursor.execute('''
                    INSERT INTO users (username, password)
                    VALUES (%(username)s, %(hashedpw)s);
                    ''',
                   {'username':username,
                    'hashedpw':hashedpw})


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
                   {'username':username})
    data = cursor.fetchone()
    return data