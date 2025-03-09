from flask import Flask, render_template, request, redirect, url_for,jsonify,session,send_file
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource,Api,reqparse,marshal_with,fields,marshal
from flask_security import Security,UserMixin,RoleMixin,SQLAlchemyUserDatastore,auth_required,roles_required,current_user
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import desc
import datetime,os
from celery import Celery
from celery.result import AsyncResult
import flask_excel as excel

app=Flask(__name__)
app.config['UPLOAD_FOLDER'] = "static/audio_files"
app.config['SQLALCHEMY_DATABASE_URI'] =  'sqlite:///database.db'
app.config['SECRET_KEY'] = "MAD2PROJECTMUSICSTREAMINGV2"
app.config['SECURITY_PASSWORD_SALT'] = "MAD2SECURITY"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['WTF_CSRF_ENABLED']=False
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER']='Authentication-Token'
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['result_backend'] = 'redis://localhost:6379/0'
app.config['broker_connection_retry_on_startup'] = True
db=SQLAlchemy(app)   
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'],backend=app.config['result_backend'])
celery.conf.update(app.config)

api=Api(app,prefix="/api") 
parser=reqparse.RequestParser()


playlist_data = db.Table('playlist_data',
    db.Column('playlist_id',db.Integer,db.ForeignKey('playlist.id'),primary_key=True),
    db.Column('song_id',db.Integer,db.ForeignKey('song.id',ondelete="CASCADE"),primary_key=True)
)

class Ratings(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id',ondelete="CASCADE"),primary_key=True)
    rating = db.Column(db.Integer)

rolesusers = db.Table('rolesusers',
    db.Column('id',db.Integer,primary_key=True),
    db.Column('user_id',db.Integer(),db.ForeignKey('user.id')),
    db.Column('role_id',db.Integer(),db.ForeignKey('role.id'))
)

class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)  
    email = db.Column(db.String(50), unique=True, nullable=False)  
    password = db.Column(db.String(40), unique=True, nullable=False)
    name = db.Column(db.String(30), nullable=False)
    roles = db.relationship('Role',backref=db.backref('users'),secondary='rolesusers')
    # last_login = db.Column(db.Datetime())
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(300),unique=True,nullable=False)
    ratings = db.relationship('Ratings',backref='user')
    songs=db.relationship('Song')
    albums=db.relationship('Album',backref='user')

class Role(db.Model,RoleMixin):
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(20),nullable=False)


class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    songs=db.relationship('Song',secondary=playlist_data)

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    genre = db.Column(db.String(30), nullable=False)
    lyric = db.Column(db.String(3000), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    filename = db.Column(db.String(50), nullable=False)
    times_played = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0)
    artist_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=True)    
    album = db.Column(db.Integer, db.ForeignKey('album.id'),nullable=True)
    playlists=db.relationship('Playlist',secondary=playlist_data,back_populates='songs')
    ratings = db.relationship('Ratings',backref='Song',cascade='all,delete')

class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    artist = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    songs = db.relationship('Song')


#celery tasks
@celery.task
def create_report():
    songs=Song.query.all()
    columns=['id','name','rating','times_played']
    report=excel.make_response_from_query_sets(songs,columns,file_type="csv")
    
    return report

#celery routes
# @app.route('/')
# def index():
#     result = add.delay(4, 4)
#     return jsonify({'task_id': result.id})

#report routes
@app.get('/download')
def savereport():
    task= create_report.delay()
    return jsonify({"task-id":task.id})

@app.get('/get-report/<id>')
def get_report(id):
    res=celery.AsyncResult(id)
    if res.ready():
        return jsonify({"message":"task completed"})
    else:
        return jsonify({"message":"Generating Report"}),404



parser.add_argument('name',type=str,help="username should not be empty",required=True)
parser.add_argument('genre',type=str,help="username should not be empty",required=True)
parser.add_argument('lyric',type=str,help="username should not be empty",required=True)

song_fields={
    'id': fields.Integer,
    'name': fields.String,
    'genre': fields.String,
    'lyric': fields.String,
    'rating':fields.Float
}
class Songapi(Resource):
    @marshal_with(song_fields)
    def get(self,songid):
        user=User.query.get(session["user"])
        song=Song.query.filter_by(id=songid)
        return song
    
    def post(self):
        user=User.query.get(session['user'])
        name=request.form['name']
        genre=request.form['genre']
        lyric=request.form['lyric']
        print("inside")
        audio_file=request.files['audio']
        print("inside")
        print(name,genre,lyric)
        if not audio_file:
            return jsonify({'message':'audio file is required'}),400
        audio_file.save(os.path.join(app.config['UPLOAD_FOLDER'], audio_file.filename))
        song=Song(name=name,genre=genre,lyric=lyric,date_created=datetime.datetime.now(),artist_id=user.id,filename=os.path.join("static/audio_files/", audio_file.filename))
        db.session.add(song)
        db.session.commit()
        return "song uploaded successfully",200
    
    def put(self,songid):
        args=parser.parse_args()
        song=Song.query.get(songid)
        song.name=args.get("name")
        song.genre=args.get("genre")
        song.lyric=args.get("lyric")
        db.session.commit()
        return {"message": "song added","id":song.id}
    def delete(self,songid):
        song=Song.query.get(songid)
        db.session.delete(song)
        db.session.commit()
        return 200

album_fields={
    'id': fields.Integer,
    'name': fields.String,
}
class Albumapi(Resource):
    @marshal_with(album_fields)
    def get(self):
        albums=Album.query.all()
        return albums
    @marshal_with(album_fields)
    def post(self):
        creator=User.query.get(session["user"])
        parser = reqparse.RequestParser()
        parser.add_argument('name',type=str,help="name should not be empty",required=True)
        args=parser.parse_args()
        album=Album(name=args.get("name"),artist=creator.id,date_created=datetime.datetime.now())
        db.session.add(album)
        db.session.commit()
        return album,200
    def put(self):
        parser=reqparse.RequestParser()
        parser.add_argument('id',type=str,help="id cannot be empty",required=True)
        parser.add_argument('name',type=str,help="name should not be empty",required=True)
        args=parser.parse_args()
        album=Album.query.get(args.id)
        album.name=args.name
        db.session.commit()
        return 200
    
    def delete(self,albumid):
        album=Album.query.get(albumid)
        db.session.delete(album)
        db.session.commit()
        return 200

playlist_fields={
    "id": fields.Integer,
    'name': fields.String,
}
class Playlistapi(Resource):
    @marshal_with(playlist_fields)
    def get(self):
        playlists=Playlist.query.all()
        return playlists
    
    @marshal_with(playlist_fields)
    def post(self):
        user=User.query.get(session["user"])
        parser = reqparse.RequestParser()
        parser.add_argument('name',type=str,help="name should not be empty",required=True)
        args=parser.parse_args()
        playlist=Playlist(name=args.name,user_id=user.id,date_created=datetime.datetime.now())
        db.session.add(playlist)
        db.session.commit()
        return playlist,200
        
    def put(self):
        parser=reqparse.RequestParser()
        parser.add_argument('id',type=str,help="id cannot be empty",required=True)
        parser.add_argument('name',type=str,help="name should not be empty",required=True)
        args=parser.parse_args()
        playlist=Playlist.query.get(args.id)
        playlist.name=args.name
        db.session.commit()
        return 200

    def delete(self,playlistid):
        playlist=Playlist.query.get(playlistid)
        db.session.delete(playlist)
        db.session.commit()
        return 200

class Ratingapi(Resource):
    def get(self):
        #get rating of user
        #get computed in the mounted part, if 404 users get to rate
        #othewise ratingwill be displayed
        pass
    def post(self,songid,rating):
        user=User.query.get(session["user"])
        rating=Ratings(user_id=user.id,song_id=songid,rating=rating)
        db.session.add(rating)
        db.session.commit()

        total=0
        ratings=Ratings.query.filter_by(song_id=songid).all()
        
        for rating in ratings:
            total+=rating.rating
        avg=total/len(ratings)
        song=Song.query.get(songid)
        song.rating=round(avg,1)
        db.session.commit()
        return 200
    
    def delete(self,songid,rating):
        user=User.query.get(session['user'])
        rating=Ratings.query.filter_by(user_id=user.id,song_id=songid).first()
        db.session.delete(rating)
        db.session.commit()

        total=0
        song=Song.query.get(songid)
        ratings=Ratings.query.filter_by(song_id=songid).all()
        if ratings:
            for rating in ratings:
                total+=rating
                avg=total/len(ratings)
                song.rating=round(avg,1)
        else:
            song.rating=0
        db.session.commit()
        return 200

api.add_resource(Songapi,'/song','/song/<int:songid>')
api.add_resource(Albumapi,'/album','/album/<int:albumid>')
api.add_resource(Playlistapi,'/playlist','/playlist/<int:playlistid>')
api.add_resource(Ratingapi,'/rating','/rating/<int:songid>/<int:rating>')


datastore=SQLAlchemyUserDatastore(db,User,Role)
app.security=Security(app, datastore)
with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name='admin')
    datastore.find_or_create_role(name='creator')
    datastore.find_or_create_role(name='user')
    db.session.commit()
    
    if not datastore.find_user(username="admin"):
        datastore.create_user(username='admin',email='admin@gmail.com',password=generate_password_hash('edoti'),name='Administrator',roles=["admin"])
        db.session.commit()
    

@app.route('/',methods=["POST","GET"])
def home():
    return render_template("index.html")

@app.route('/edoti')
@auth_required("token")
@roles_required("admin")
def edoti():
    print("inside restricted admin function")
    return "edoti"

@app.post('/userlogin')
def login():
    data=request.get_json()
    username=data.get('username')
    if not username:
        return jsonify({'message':'username cannot be empty'}),400
    user=datastore.find_user(username=username)
    
    if not user:
        return jsonify({'message':'user does not exist'}),400
    if check_password_hash(user.password,data.get('password')):
        session['user'] = user.id
        return jsonify({"token":user.get_auth_token(),"username":username,'role':user.roles[0].name,"name":user.name})
    else:
        return jsonify({"message":"wrong password"}),400
    
@app.post('/userregister')
def register():
    data=request.get_json()
    name=data.get('name')
    if not name:
        return jsonify({'message':'name cannot be empty'}),400
    username=data.get('username')
    if not username:
        return jsonify({'message':'username cannot be empty'}),400
    if datastore.find_user(username=username):
        return jsonify({'message':'username already exists, use another'}),400
    email=data.get('email')
    if not email:
        return jsonify({'message':'email cannot be empty'}),400
    if datastore.find_user(email=email):
        return jsonify({'message':'account exists with the email, please login'}),400
    password=data.get('password')
    if not password:
        return jsonify({'message':'username cannot be empty'}),400
    datastore.create_user(username=username,email=email,password=generate_password_hash(password),name=name,roles=["user"])
    db.session.commit()
    return jsonify({'message':'user registered successfully'})

@app.route('/creatorregister')
def creatorregister():
    user=User.query.get(session['user'])
    creator=Role.query.get(2)
    urole=Role.query.get(3)
    user.roles.remove(urole)
    user.roles.append(creator)
    db.session.commit()
    return jsonify({'message':'registered as a creator'})
    
#add song
@app.post('/upload_song')
def upload():
    data=request.get_json()
    audio_file=request.files['song']
    if not audio_file:
        return jsonify({'message':'audio file is required'}),400
    audio_file.save(os.path.join(app.config['UPLOAD_FOLDER'], audio_file.filename))
    name=data.get('name')
    if not name:
        return jsonify({'message':'name cannot be empty'}),400
    lyric=data.get('lyric')
    if not lyric:
        return jsonify({'message':'lyric cannot be empty'}),400
    genre=data.get('genre')
    if not genre:
        return jsonify({'message':'genre cannot be empty'}),400
    song=Song(name=name,lyric=lyric,genre=genre,date_created=datetime.datetime.now(),filename=audio_file.filename)
    db.session.add(song)
    db.session.commit()
    return jsonify({'message':'song uploaded successfully'})


song_fields={
    'id': fields.Integer,
    'name': fields.String,
    'genre': fields.String,
    'lyric': fields.String,
    'rating': fields.Integer,
    'filename':fields.String
}
@app.post('/songs')
@marshal_with(song_fields)
def songs():
    data=request.get_json()
    if data=="top":
        songs=Song.query.order_by(desc(Song.rating)).all()
    elif data=="newsongs":
        songs=Song.query.order_by(desc(Song.date_created)).all()
    else:
        songs=Song.query.all()
    if len(songs)==0:
        return jsonify({'message':'No songs available'}),404
    return songs

song_fields={
    'id': fields.Integer,
    'name': fields.String,
    'genre': fields.String,
    'lyric': fields.String,
    'rating': fields.Integer,
}
@app.route('/creatorsongs')
def creatorsongs():
    user=User.query.get(session['user'])
    songs=Song.query.filter_by(artist_id=user.id).all()
    if len(songs)==0:
        return jsonify({'message':'No songs available,start uploading'})
    return marshal(songs,song_fields)

playlist_fields={
    "id": fields.Integer,
    'name': fields.String,
}
song_fields={
    'id': fields.Integer,
    'name': fields.String,
    'genre': fields.String,
    'lyric': fields.String
}
@app.get('/playlists/<int:id>')
def playlists(id):
    playlist=Playlist.query.get(id)
    songs=Song.query.all()
    playlistsongs=playlist.songs
    songs = [song for song in songs if song not in playlist.songs]
    return [marshal(playlist,playlist_fields),marshal(songs,song_fields),marshal(playlistsongs,song_fields)]
@app.route('/playlists/<int:playlistid>/<int:songid>',methods=['POST','DELETE'])
def playlistedit(playlistid,songid):
    playlist=Playlist.query.get(playlistid)
    song=Song.query.get(songid)
    if request.method == "POST":
        playlist.songs.append(song)
        db.session.commit()
        return jsonify({"message": "Success"}), 200
    if request.method == "DELETE":
        playlist.songs.remove(song)
        db.session.commit()
        return jsonify({"message": "Success"}), 200

#albums
album_fields={
    "id": fields.Integer,
    'name': fields.String,
}
song_fields={
    'id': fields.Integer,
    'name': fields.String,
    'genre': fields.String,
    'lyric': fields.String
}
@app.get('/albums/<int:id>')
def albums(id):
    album=Album.query.get(id)
    songs=Song.query.filter_by(album=None).all()
    albumsongs=Song.query.filter_by(album=id).all()
    return [marshal(album,album_fields),marshal(songs,song_fields),marshal(albumsongs,song_fields)]
@app.route('/albums/<int:albumid>/<int:songid>',methods=['POST','DELETE'])
def albumedit(albumid,songid):
    song=Song.query.get(songid)
    if request.method == "POST":
        song.album=albumid
        db.session.commit()
        return jsonify({"message": "Success"}), 200
    if request.method == "DELETE":
        song.album=None
        db.session.commit()
        return jsonify({"message": "Success"}), 200
rating_fields={
    'rating':fields.Integer
}
song_fields={
    'id': fields.Integer,
    'name': fields.String,
    'genre': fields.String,
    'lyric': fields.String,
    'rating':fields.Integer,
    'filename':fields.String
}
@app.get('/player/<int:songid>')
def player(songid):
    user=User.query.get(session['user'])
    song=Song.query.get(songid)
    rating=Ratings.query.filter_by(song_id=songid,user_id=user.id).first()
    return [marshal(song,song_fields),marshal(rating,rating_fields)]

@app.get('/played/<int:songid>')
def played(songid):
    song=Song.query.get(songid)
    song.times_played+=1
    db.session.commit()
    return 200


@app.route("/logout")
def logout():
    session.pop('user')
    session.pop('role')
    return redirect(url_for('home'))


if __name__=='__main__':
    excel.init_excel(app)
    app.run(debug=True)
