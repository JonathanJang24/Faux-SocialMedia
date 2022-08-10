from re import X
from flask import Flask, jsonify, request, json
from flask_sqlalchemy import SQLAlchemy
from decouple import config
from dbModels import User, Post, Friend
from sharedModels import db
import bcrypt
from datetime import date, timedelta

salt = bcrypt.gensalt()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config('sql_path',default='')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#---------------------------------------------------------------
# have not created tables yet, might change table structure later
db = SQLAlchemy(app)
#---------------------------------------------------------------


@app.route('/')
def index():
    feed = db.session.query(User).all()
    return jsonify(([*map(user_serializer,feed)]))
    return {'200':'get successful.'}

# basic login method
@app.route('/api/login',methods=['POST'])
def login():
    data = json.loads(request.data)
    username = data['username']
    password = data['password'].encode('utf-8')
    user = db.session.query(User).filter_by(username=username).first()
    if(user):
        # HASHED will be the hashed user password from sql db
        if bcrypt.checkpw(password,user.password.encode('utf-8')):
            return {'200':'logged in'}
        else:
            return {'402':'incorrect password'}
    return {'401':'user not found'}

# signup POST method for users
@app.route('/api/signup',methods=['POST'])
def signup():
    data = json.loads(request.data)
    exist = db.session.query(User).filter_by(username=data['username']).first()
    if(exist):
        return {'400':'User already exists'}

    username = data['username']
    password = bcrypt.hashpw(data['password'].encode('utf8'),salt)
    email = data['email']
    first_name = data['first_name']
    last_name = data['last_name']
    birthdate = data['birthdate']

    user = User(username=username,password=password,firstname=first_name,lastname=last_name,birthdate=birthdate,email=email)
    db.session.add(user)
    db.session.commit()

    return {'200':'signup method successful'}

# allows for json serialization of post feed 
def feed_serializer(post):
    return {
        'post_id':post.post_id,
        'posted_date':post.posted_date,
        'user':post.user,
        'title':post.title,
        'content':post.content,
        'likes':post.likes,
        'dislikes':post.dislikes
    }

# general get method for a user's feed
@app.route('/api/feed/<currUser>',methods=['GET'])
def getfeed(currUser):

    friends = db.session.query(Friend).filter_by(extender=currUser).all()
    f = list(map(lambda f: f.recipient, friends))
    f.append(currUser)

    feed = db.session.query(Post).filter(Post.user.in_((f))).order_by(Post.post_id.desc()).all()
    return jsonify(([*map(feed_serializer,feed)]))


# api route for specific user creating a post
@app.route('/api/create_post',methods=['POST'])
def createpost():

    d = date.today().strftime("%m/%d/%Y")

    try:
        data = json.loads(request.data)
        user = data['user']
        title =  data['title']
        content = data['content']
        post = Post(posted_date=d,user=user,title=title,content=content,likes=0,dislikes=0)
        db.session.add(post)
        db.session.commit()

        return {'200':'post successful'}
    except Exception as e:
        return {'500':e}

def user_serializer(user):
    return {
        'user_id':user.user_id,
        'birthday':user.birthdate,
        'username':user.username,
        'pass':user.password,
        'first':user.firstname,
        'last':user.lastname,
        'email':user.email
    }

@app.route('/api/user_info/<currUser>',methods=['GET'])
def user_info(currUser):
    user = db.session.query(User).filter_by(username=currUser).all()
    return jsonify(([*map(user_serializer,user)]))


@app.route('/api/add_friend',methods=['POST'])
def add_friend():
    data = json.loads(request.data)
    extender = data['extender']
    recipient = data['recipient']

    realUser = db.session.query(User).filter_by(username=recipient).first()
    if(not realUser):
        return {'400':'user doesnt exist'}

    exists = db.session.query(Friend).filter_by(extender=extender,recipient=recipient).first()
    if(exists):
        return {'401':'already friends'}

    #=======================
    #ADD LOGIC FOR ADDING FRIEND USER FOR TESTING 
    #===============================

    return {'200':'Friend Added.','extender':extender,'recipient':recipient}

@app.route('/api/interact_post',methods=['POST'])
def interactpost():
    return {'200':'post liked/disliked'}

@app.route('/api/comment_post',methods=['POST'])
def commentpost():
    return {'200':'comment posted'}

if(__name__=='__main__'):
    app.run(debug=True)