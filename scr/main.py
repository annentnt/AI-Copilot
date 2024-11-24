import os
import csv
import openai
from flask import Flask, render_template, request, flash, redirect, url_for
from dotenv import load_dotenv
from flask_bootstrap import Bootstrap
from form.InputPromptForm import InputPromptForm

# Load biến môi trường từ file .env
load_dotenv()

# Khởi tạo Flask
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")  # Khóa bí mật cho Flash

# Đường dẫn file lưu thông tin người dùng
file_path = "user.csv"

# Cấu hình OpenAI API
openai.api_key = os.getenv("API_KEY")
model_engine = os.getenv("MODEL_ENGINE")
max_tokens = int(os.getenv("MAX_TOKENS"))
temperature = float(os.getenv("TEMPERATURE"))
top_p = float(os.getenv("TOP_P"))
frequency_penalty = float(os.getenv("FREQUENCY_PENALTY"))
presence_penalty = float(os.getenv("PRESENCE_PENALTY"))

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
        confirm_password = request.form['confirm_password']  # Xác nhận mật khẩu
        if password != confirm_password:
            flash("Mật khẩu xác nhận không khớp. Vui lòng thử lại.", "danger")
            return render_template('register.html')

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
        try:
            # Gọi OpenAI API
            response = openai.Completion.create(
                engine=model_engine,
                prompt=user_input,
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=top_p,
                frequency_penalty=frequency_penalty,
                presence_penalty=presence_penalty,
            )
            bot_response = response.choices[0].text.strip()
            return render_template('chat.html', user_input=user_input, bot_response=bot_response)
        except Exception as e:
            flash(f"Đã xảy ra lỗi: {e}", "danger")
    return render_template('chat.html')

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))  # Mặc định dùng cổng 5000 nếu không có PORT trong .env
    app.run(debug=True, port=port)
