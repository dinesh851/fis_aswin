from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
app.secret_key = 'your_secret_key'  

USERNAME = 'admin'
PASSWORD = 'password'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == USERNAME and password == PASSWORD:
            return render_template('admin.html')
        else:
            flash('Invalid username or password!')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/admin')
def default():
    return render_template('admin.html')

@app.route('/api/update', methods=['POST'])
def update_data():
    try:
        data = request.get_json()
        with open('list.json', 'w') as file:
            json.dump(data, file, indent=4)
        return jsonify({'status': 'success', 'received': data}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/get_data', methods=['GET'])
def get_data():
    try:
        with open('list.json', 'r') as file:
            data = json.load(file)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5000)
