from flask import Flask, jsonify, request, json
from flask_sqlalchemy import SQLAlchemy
from decouple import config
from dbModels import User
from sharedModels import db
import bcrypt

salt = bcrypt.gensalt()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config('sql_path',default='')

#---------------------------------------------------------------
# have not created tables yet, might change table structure later
db = SQLAlchemy(app)
#---------------------------------------------------------------
   
@app.route('/')
def index():
    return {'200':'get successful.'}

@app.route('/api/login',methods=['POST'])
def login():
    data = json.loads(request.data)
    username = data['username']
    password = data['password'].encode('utf-8')
    user = User.query.filter_by(username=username).first()
    if(user):
        # HASHED will be the hashed user password from sql db
        if bcrypt.checkpw(password,user.password.encode('utf-8')):
            return {'200':'logged in'}
        else:
            return {'402':'incorrect password'}
    return {'401':'user not found'}


@app.route('/api/signup',methods=['POST'])
def signup():
    data = json.loads(request.data)
    username = data['username']
    password = bcrypt.hashpw(data['password'].encode('utf8'),salt)
    email = data['email']
    first_name = data['first_name']
    last_name = data['last_name']
    birthdate = data['birthdate']

    if(User.query.filter_by(username=username).first()):
        return {'400':'User already exists'}
    
    user = User(username=username,password=password,firstname=first_name,lastname=last_name,birthdate=birthdate,email=email,)
    db.session.add(user)
    db.session.commit()
    return {'200':'signup method successful'}

def feed_serializer(post):
    return {
        'post_id':post.post_id,
        'user':post.user,
        'title':post.title,
        'content':post.content,
        'likes':post.likes,
        'dislikes':post.dislikes
    }

@app.route('/api/feed/<user>',methods=['GET'])
def getfeed(user):
    feed = Post.query.filter_by(user=user).all()
    return jsonify(([*map(feed_serializer,feed)]))

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