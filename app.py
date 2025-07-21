from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Initialize database
def init_db():
    with sqlite3.connect('database.db') as conn:
        conn.execute('''
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT,
            image_data TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')

# Initialize database on startup
init_db()

@app.route('/')
def altar():
    return send_file('altar.html')

@app.route('/display')
def display():
    return send_file('display.html')

@app.route('/api/entries', methods=['POST'])
def save_entry():
    try:
        data = request.json
        with sqlite3.connect('database.db') as conn:
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO entries (text, image_data, timestamp) VALUES (?, ?, ?)',
                (data.get('text'), data.get('imageBase64'), datetime.now().isoformat())
            )
            conn.commit()
        return jsonify({'success': True})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/entries', methods=['GET'])
def get_entries():
    try:
        with sqlite3.connect('database.db') as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM entries ORDER BY timestamp DESC')
            entries = cursor.fetchall()
            
            # Convert to list of dictionaries
            entries_list = [
                {
                    'id': entry[0],
                    'text': entry[1],
                    'imageBase64': entry[2],
                    'timestamp': entry[3]
                }
                for entry in entries
            ]
            
            return jsonify({'entries': entries_list})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000))) 