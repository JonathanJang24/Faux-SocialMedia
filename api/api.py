
from flask import Flask, jsonify, request, json
from flask_sqlalchemy import SQLAlchemy
from decouple import config
from dbModels import User, Post, Friend, Comments, Interactions
from sharedModels import db
import bcrypt
from datetime import date

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

def username_serializer(user):
    return {
        'user_id':user.user_id,
        'username':user.username
    }

@app.route('/api/usernames',methods=['GET'])
def users():
    users = db.session.query(User).all()
    return jsonify(([*map(username_serializer,users)]))

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

    extend = db.session.query(Friend).filter_by(extender=currUser).all()
    recieve = db.session.query(Friend).filter_by(recipient=currUser).all()

    user_info = [*map(user_serializer,user)]
    user_info[0]['following'] = len(extend)
    user_info[0]['followers'] = len(recieve)

    return jsonify((user_info))

@app.route('/api/get_followers/<currUser>',methods=['GET'])
def get_followers(currUser):
    followers = db.session.query(Friend).filter_by(recipient=currUser).all()
    followers = [follower.extender for follower in followers]
    return jsonify(followers)

@app.route('/api/get_following/<currUser>',methods=['GET'])
def get_following(currUser):
    following = db.session.query(Friend).filter_by(extender=currUser).all()
    following = [follow.recipient for follow in following]
    return jsonify(following)


@app.route('/api/user_post/<currUser>',methods=['GET'])
def user_post(currUser):

    posts = db.session.query(Post).filter_by(user=currUser).order_by(Post.post_id.desc()).all()

    return jsonify(([*map(feed_serializer,posts)]))

# api route to add friend from user search query
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

    d = date.today().strftime("%m/%d/%Y")
    follow = Friend(extender=extender, recipient=recipient,start_date=d)
    db.session.add(follow)
    db.session.commit()

    return {'200':'Friend Added.'}

@app.route('/api/rem_friend',methods=['POST'])
def rem_friend():
    data = json.loads(request.data)
    extender = data['extender']
    recipient = data['recipient']
    if(db.session.query(Friend).filter_by(extender=extender,recipient=recipient).delete()):
        db.session.commit()
        return {'200':'Friend Removed'}
    return {'401':'Already removed'}

@app.route('/api/find_users/<currUser>/<query>',methods=['GET'])
def find_user(currUser,query):
    query = query[1:]
    if(query):
        matching = db.session.query(User).filter(User.username.contains(query)).all()
        queryList = list([*map(user_serializer,matching)])
        if(queryList):
            i:int = 0
            while i < len(queryList):
                if(queryList[i]['username']==currUser):
                    queryList.pop(i)
                else:
                    # mapping following/followers list into purely usernames
                    recipientList = list(map(lambda r: r.extender, db.session.query(Friend).filter_by(recipient=queryList[i]['username']).all()))
                    extenderList = list(map(lambda e: e.recipient, db.session.query(Friend).filter_by(extender=queryList[i]['username']).all()))
                    # number of followers/followings
                    queryList[i]['recipient']=len(recipientList)
                    queryList[i]['extender']=len(extenderList)
                    # checks if current user is following/follower
                    if(currUser in recipientList):
                        queryList[i]['isFollowing']=True
                    else:
                        queryList[i]['isFollowing']=False
                    if(currUser in extenderList):
                        queryList[i]['isFollowed']=True
                    else:
                        queryList[i]['isFollowed']=False
                    i+=1
        return  {'400':'no results'} if queryList==None else jsonify(queryList)
    return {'400':'empty query.'}

@app.route('/api/interact_post',methods=['POST'])
def interactpost():
    # both like and dislike call this function, but there will be a string designated to the action
    data = json.loads(request.data)
    username = data['user']
    post_id = data['post_id']

    post = db.session.query(Post).filter_by(post_id=post_id).first()

    exists = db.session.query(Interactions).filter_by(user=username, post_id=post_id).first()
    #checks if the user has already intereacted the post before
    if exists == None:
        if(data['action']=='like'):
            interaction = Interactions(post_id=post_id,user=username,interaction_type=1)
            post.likes = int(post.likes)+1
            db.session.add(interaction)
            db.session.add(post)
            db.session.commit()
            return {'200':'post liked'}
        elif(data['action']=='dislike'):
            interaction = Interactions(post_id=post_id,user=username,interaction_type=2)
            post.dislikes  = int(post.dislikes)+1
            db.session.add(interaction)
            db.session.add(post)
            db.session.commit()
            return {'200':'post disliked'}
        else:
            return {'400':'error, wrong action'}
    # if the user has already interacted with the post
    else:
        interaction = db.session.query(Interactions).filter_by(post_id=post_id,user=username).first()
        if(data['action']=='like'):
            if(exists.interaction_type==1):
                exists.interaction_type = 0
                post.likes = int(post.likes)-1
            else:
                if(exists.interaction_type==2):
                    post.dislikes = int(post.dislikes)-1
                    post.likes = int(post.likes)+1
                else:
                    post.likes = int(post.likes)+1
                exists.interaction_type = 1
            db.session.add(interaction)
            db.session.add(post)
            db.session.commit()
            return {'200':'post liked'}
        elif(data['action']=='dislike'):
            if(exists.interaction_type==2):
                exists.interaction_type = 0
                post.dislikes = int(post.dislikes)-1
            else:
                if(exists.interaction_type==1):
                    post.dislikes = int(post.dislikes)+1
                    post.likes = int(post.likes)-1
                else:
                    post.dislikes = int(post.dislikes)+1
                exists.interaction_type = 2
            db.session.add(interaction)
            db.session.add(post)
            db.session.commit()
            return {'200':'post disliked'}
        else:
            return {'400':'error, wrong action'}


@app.route('/api/comment_post',methods=['POST'])
def commentpost():
    data = json.loads(request.data)
    c = Comments(user=data['user'],content=data['content'],post_id=data['id'])
    db.session.add(c)
    db.session.commit()
    print(data)
    return {'200':'comment posted'}

def comment_serializer(comment):
    return {
        'comment_id':comment.comment_id,
        'user':comment.user,
        'content':comment.content,
        'post_id':comment.post_id
    }

@app.route('/api/get_comments/<post_id>',methods=['GET'])
def getComments(post_id):
    comments = db.session.query(Comments).filter_by(post_id=post_id).all()
    return jsonify(([*map(comment_serializer,comments)]))

@app.route('/api/rem_post',methods=['POST'])
def rempost():
    data = json.loads(request.data)
    post_id = data['post_id']
    try:
        db.session.query(Post).filter_by(post_id=post_id).delete()
        db.session.query(Comments).filter_by(post_id=post_id).delete()
        db.session.commit()
        return {'200':"Post deleted!"}
    except:
        return{'400':"uh-oh, something went wrong and the post couldn't be deleted."}

@app.route('/api/rem_comment',methods=['POST'])
def remcomment():
    data = json.loads(request.data)
    comment_id = data['comment_id']
    try:
        db.session.query(Comments).filter_by(comment_id=comment_id).delete()
        db.session.commit()
        return({'200':'Comment successfully deleted.'})
    except:
        return {'400':'uhoh, something went wrong and the comment could not be deleted'}

if(__name__=='__main__'):
    app.run(debug=True)
