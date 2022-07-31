from sharedModels import db

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
