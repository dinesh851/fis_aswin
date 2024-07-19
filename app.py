from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
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
            return render_template('default.html')
        else:
            flash('Invalid username or password!')
            return redirect(url_for('login'))
    return render_template('login.html')
@app.route('/admin')
def default():
    return render_template('default.html')

if __name__ == '__main__':
    app.run(debug=True)
