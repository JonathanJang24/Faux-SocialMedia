from flask import Flask, jsonify, request, json
from flask_sqlalchemy import SQLAlchemy
from decouple import config
from dbModels import User, Post, Comments
from sharedModels import db
import bcrypt

salt = bcrypt.gensalt()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config('sql_path',default='')

#---------------------------------------------------------------
# have not created tables yet, might change table structure later
db.init_app(app)
#---------------------------------------------------------------

@app.route('/')
def index():
    return {'200':'get successful.'}

@app.route('/api/login',methods=['POST'])
def login():
    data = json.loads(request.data)
    username = data['username']
    password = data['password']

    # HASHED will be the hashed user password from sql db
    if bcrypt.checkpw(password, hashed):
        return {'200':'logged in'}
    else:
        return {'400':'incorrect password'}


@app.route('/api/signup',methods=['POST'])
def signup():
    data = json.loads(request.data)
    username = data['username']
    password = bcrypt.hashpw(data['password'].encode('utf8'),salt)
    email = data['email']
    first_name = data['first_name']
    last_name = data['last_name']
    birthdate = data['birthdate']
    print(password)
    
    return {'200':'signup method successful'}

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