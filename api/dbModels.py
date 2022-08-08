from sharedModels import db

# db model for users
# *************************HAS BEEN INITIALIZED***********************
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
    

# db model for posts
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

# =============================HAS NOT BEEN INIT==========================    
# # db model for comments
# class Comments(db.Model):
#     comment_id = db.Column(db.Integer, primary_key=True)
#     user = db.Column(db.Text, nullable=False)
#     content = db.Column(db.Text, nullable=False)
#     post_id = db.Column(db.Integer, nullable=False)
