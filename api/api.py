from flask import Flask, jsonify, request, json
from flask_sqlalchemy import SQLAlchemy
from decouple import config

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config('sql_path',default='')
db = SQLAlchemy(app)

# db model for users
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username= db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)
    firstname = db.Column(db.Text, nullable=False)
    lastname = db.Column(db.Text, nullable=False)

# db model for posts
class Post(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Text, nullable=False)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text,nullable=False)
    likes = db.Column(db.Text, nullable=False)
    dislikes = db.Column(db.Text, nullable=False)
    
# db model for comments
class Comments(db.Model):
    comment_id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.Integer, nullable=False)


@app.route('/')
def index():
    return {'200':'get successful.'}

@app.route('/api/login',methods=['POST'])
def login():
    data = json.loads(request.data)
    return {'200':'signup method successful'}

@app.route('/api/signup',methods=['POST'])
def signup():
    data = json.loads(request.data)
    return {'200':'signed up'}

@app.route('/api/create_post',methods=['POST'])
def createpost():
    data = json.loads(request.data)
    return {'200':'post successful'}

@app.route('/api/interact_post',methods=['POST'])
def interactpost():
    return {'200':'post liked/disliked'}

@app.route('/api/comment_post',methods=['POST'])
def commentpost():
    return {'200':'comment posted'}

if(__name__=='__main__'):
    app.run(debug=True)