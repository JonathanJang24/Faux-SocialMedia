from re import X
from flask import Flask, jsonify, request, json
from flask_sqlalchemy import SQLAlchemy
from decouple import config
from dbModels import User, Post
from sharedModels import db
import bcrypt
from datetime import date, timedelta

salt = bcrypt.gensalt()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config('sql_path',default='')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

#---------------------------------------------------------------
# have not created tables yet, might change table structure later
db = SQLAlchemy(app)
#---------------------------------------------------------------

class Post(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    posted_date = db.Column(db.Text, nullable=False)
    user = db.Column(db.Text, nullable=False)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text,nullable=False)
    likes = db.Column(db.Text, nullable=False)
    dislikes = db.Column(db.Text, nullable=False)

    def __str__(self):
        return f'{self.post_id} {self.user} {self.title} {self.content} {self.likes} {self.dislikes}'
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username= db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)
    firstname = db.Column(db.Text, nullable=False)
    lastname = db.Column(db.Text, nullable=False)
    birthdate = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, nullable=False)

    def __str__(self):
        return f'{self.user_id} {self.username} {self.password} {self.firstname} {self.lastname} {self.birthdate} {self.email}'
    
def user_serializer(user):
    return {
        'user_id':user.user_id,
        'username':user.username,
        'pass':user.password,
        'first':user.firstname,
        'last':user.lastname
    }

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
    feed = db.session.query(Post).filter_by(user=currUser).order_by(Post.post_id.desc()).all()
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


@app.route('/api/interact_post',methods=['POST'])
def interactpost():
    return {'200':'post liked/disliked'}

@app.route('/api/comment_post',methods=['POST'])
def commentpost():
    return {'200':'comment posted'}

if(__name__=='__main__'):
    app.run(debug=True)