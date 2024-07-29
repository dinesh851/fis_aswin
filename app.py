from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory,make_response
import json
import requests
import time
from flask_cors import CORS
import os
import shutil
app = Flask(__name__)
CORS(app)
app.secret_key = 'your_secret_key'


USERNAME = 'admin'
PASSWORD = 'password'
logged_in = False   


UPLOAD_FOLDER = 'static/icons'
ALLOWED_EXTENSIONS = {'png'}
MAX_CONTENT_LENGTH = 50 * 1024   

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_public_ip():
    try:
        response = requests.get('https://api.ipify.org?format=json')
        ip_data = response.json()
        return ip_data['ip']
        # return "127.0.0.1"
    except Exception as e:
        return "Error fetching IP"

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

@app.route('/')
def home():
    public_ip = get_public_ip()
    return render_template('index.html', public_ip=public_ip)


@app.route('/icons/<filename>')
def serve_icon(filename):
    return send_from_directory('static/icons', filename)
@app.route('/backup', methods=['POST'])
def backup_file():
    backup_folder = 'backup'
    filename = 'list.json'

    backup_file_path = os.path.join(backup_folder, filename)
    main_file_path = os.path.join(os.getcwd(), filename)

    if not os.path.exists(backup_file_path):
        return jsonify({"error": "Backup file does not exist"}), 404

    try:
        shutil.copy(backup_file_path, main_file_path)
        return jsonify({"message": "Backup successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/get_icons', methods=['GET'])
def get_icons():
    icons_dir = 'static/icons'
    try:
        icons = []
        for filename in os.listdir(icons_dir):
            if filename.endswith(('.png', '.jpg', '.jpeg', '.gif')):
                icons.append({
                    'name': filename.split('.')[0],   
                    'filename': filename
                })
                print(icons)
        return jsonify(icons), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400
    


@app.route('/login', methods=['GET', 'POST'])
def login():
    global logged_in   
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        print(username,password)
        print(logged_in)

        if username == USERNAME and password == PASSWORD:
            logged_in = True
            print(logged_in)
            print("logged_in : ",logged_in)
            print(f"Logged in: {logged_in}")
            public_ip = get_public_ip()

            return render_template('admin.html', public_ip=public_ip)
        else:
            flash('Invalid username or password!')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    global logged_in   
    logged_in = False
    print("logged_in : ",logged_in)
    flash('You have been logged out.')
    public_ip = get_public_ip()

    return render_template('index.html', public_ip=public_ip)

@app.route('/admin')
def admin():
    global logged_in   

    time.sleep(1)
    print("admin",logged_in)
    if not logged_in:
        flash('You need to log in first.')
        return redirect(url_for('login'))
    public_ip = get_public_ip()
    return render_template('admin.html', public_ip=public_ip)
@app.route('/icon')
def icon():
    if not logged_in:
        flash('You need to log in first.')
        return redirect(url_for('login'))
    public_ip = get_public_ip()
    return render_template('icon.html', public_ip=public_ip)



 

@app.route('/api/update', methods=['POST'])
def update_data():
    try:
        print("logged_in:", logged_in)

        if not logged_in:
            print(f"Unauthorized access attempt. Logged in: {logged_in}")
            return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
        
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
    
@app.route('/api/save_data', methods=['POST'])
def save_data():
    try:
        data = request.json
        with open('list.json', 'w') as file:
            json.dump(data, file, indent=2)
        return jsonify({'status': 'success', 'message': 'Data saved successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400\
        


@app.route('/api/upload_icon', methods=['POST'])
def upload_icon():
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = file.filename
        
        existing_files = [f for f in os.listdir(app.config['UPLOAD_FOLDER']) if f.endswith('.png')]
        if existing_files:
            numbers = [int(f.split('_')[-1].split('.')[0]) for f in existing_files if f.split('_')[-1].split('.')[0].isdigit()]
            highest_number = max(numbers, default=0)
            new_filename = f'{highest_number + 1}.png'
        else:
            new_filename = 'icon_1.png'
        
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_filename))
        return jsonify({'status': 'success', 'message': 'File uploaded successfully', 'filename': new_filename}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Invalid file format or file too large'}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5000)
