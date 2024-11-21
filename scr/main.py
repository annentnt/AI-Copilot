from flask import Flask, request, render_template, redirect, url_for, flash, jsonify
import openai
import csv
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Khóa bí mật cho thông báo Flash

# Đường dẫn file lưu thông tin người dùng
file_path = "user.csv"

# Đặt API Key của OpenAI
openai.api_key = "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"

# ---- XỬ LÝ LOGIN/SIGNUP ----

# Hàm đọc thông tin tài khoản
def read_user_credentials():
    try:
        credentials = []
        if not os.path.exists(file_path):
            return credentials
        with open(file_path, mode='r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                username = row.get("username")
                password = row.get("password")
                if username and password:
                    credentials.append({"username": username, "password": password})
        return credentials
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

# Hàm đăng ký tài khoản mới
def register_new_user(username, password):
    try:
        existing_users = read_user_credentials()
        if any(user['username'] == username for user in existing_users):
            return False  # Tài khoản đã tồn tại

        # Ghi tài khoản mới vào file
        file_exists = os.path.exists(file_path)
        with open(file_path, mode='a', encoding='utf-8', newline='') as file:
            fieldnames = ["username", "password"]
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()
            writer.writerow({"username": username, "password": password})
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

# Trang chủ
@app.route('/')
def home():
    return render_template('index.html')

# Trang đăng nhập
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        users = read_user_credentials()
        user = next((u for u in users if u['username'] == username and u['password'] == password), None)
        if user:
            flash(f"Đăng nhập thành công! Chào mừng, {username}.", "success")
            return redirect(url_for('chat'))  # Đưa người dùng đến trang chat
        else:
            flash("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.", "danger")
    return render_template('login.html')

# Trang đăng ký
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if register_new_user(username, password):
            flash("Đăng ký thành công! Bạn có thể đăng nhập.", "success")
            return redirect(url_for('login'))
        else:
            flash("Tài khoản đã tồn tại. Vui lòng chọn tên khác.", "danger")
    return render_template('register.html')

# ---- TÍCH HỢP OPENAI CHAT ----

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    if request.method == 'POST':
        user_input = request.form['user_input']
        model = request.form.get('model', 'gpt-3.5')  # Mặc định là GPT-3.5
        try:
            # Gọi OpenAI API
            response = openai.Completion.create(
                engine=model,
                prompt=user_input,
                max_tokens=100
            )
            bot_response = response.choices[0].text.strip()
            return render_template('chat.html', user_input=user_input, bot_response=bot_response)
        except Exception as e:
            flash(f"Đã xảy ra lỗi: {e}", "danger")
    return render_template('chat.html')

if __name__ == '__main__':
    app.run(debug=True)
