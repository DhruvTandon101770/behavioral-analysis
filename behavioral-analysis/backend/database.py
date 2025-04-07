import mysql.connector

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="behavior_analysis",
            pool_name="mypool",
            pool_size=10  # Prevents too many open connections
        )
        return conn
    except mysql.connector.Error as e:
        print(f"🔥 ERROR: Could not connect to database - {e}")
        return None


def save_behavior_data(username, key_data, mouse_data, session_time, scroll_speed, is_anomaly):
    conn = mysql.connector.connect(host="localhost", user="root", password="", database="adbms_prog")
    cursor = conn.cursor()

    query = """
        INSERT INTO BehaviorLogs (username, key_data, mouse_data, session_time, scroll_speed, is_anomaly)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (username, str(key_data), str(mouse_data), session_time, scroll_speed, is_anomaly))
    conn.commit()
    cursor.close()
    conn.close()

'''
import mysql.connector

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="behavior_analysis"
        )
        # Create table to store full behavioral data
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS behavioral_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user VARCHAR(255),
                H1 FLOAT,
                H2 FLOAT,
                RP FLOAT,
                PP FLOAT,
                RR FLOAT,
                PR FLOAT,
                mouse_speed FLOAT,
                mouse_angle FLOAT,
                mouse_distance FLOAT,
                session_time FLOAT,
                scroll_speed FLOAT,
                is_anomaly BOOLEAN,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        cursor.close()
        conn.close()
        return conn
    except Exception as e:
        print(f"🔥 ERROR: Could not connect to database - {e}")
        return None
'''