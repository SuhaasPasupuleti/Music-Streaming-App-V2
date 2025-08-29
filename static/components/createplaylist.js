export default{
    props:["playlistid"],
    template:`
    <div>
        <nav class="navbar navbar-expand-lg navbar-light ">
            <a class="navbar-brand txt" >Music Streaming App</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav ms-auto">
                <router-link class="nav-item nav-link btn active txt" to="/userdash">Dashboard</router-link>  
                <router-link class="nav-item nav-link btn active txt" to="/creatordash">Creator Dash</router-link>    
                <router-link class="nav-item nav-link btn active txt" to="/logout">Logout</router-link>
            </div>
            </div>
        </nav>
        <div class="container" >
            <h1>Create Playlist</h1>
            <div class="" style="display:flex;">
            <input type="text" class="form-control" id="playlistname" name="playlistname"  v-model="playlist.name" placeholder="enter name of album" required>
            <button type="button" class="btn btn-primary text-nowrap" @click="editplaylist">Edit Playlist</button>
            </div>
        </div>
        <div class="container" v-if="playlistsongs.length>0">
            <h1>Remove from Playlist</h1>
            <div  style="display: flex;flex-direction:row;overflow: scroll;overflow: hidden;white-space: nowrap;height: 15rem;">
                <div v-for="song in playlistsongs"  class="outer" style="margin: 2rem;padding-top: 18px;width: 10rem;">
                    <div class="col-2 box p-2 song" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.2)!important;border-radius: 20px;height: 7rem;width: 10rem;">
                        <div class="row text-center" style="height: 3rem; align-items:center;">
                            <h6>{{song.name}}</h6>
                        </div>
                        <div class="butn row d-flex pt-1 p-2 text-center">
                            <a @click="sendid(song.id)"  class='btn col-6'>
                                Open
                            </a>
                            <a @click="removefromplaylist(song.id)"  class='btn col-6 btn-danger'>
                                Remove
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="container" v-if="newsongs.length>0">
            <h1>Add to Playlist</h1>
            <div  style="display: flex;flex-direction:row;overflow: scroll;overflow: hidden;white-space: nowrap;height: 15rem;">
                <div v-for="song in newsongs"  class="outer" style="margin: 2rem;padding-top: 18px;width: 10rem;">
                    <div class="col-2 box p-2 song" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.2)!important;border-radius: 20px;height: 7rem;width: 10rem;">
                        <div class="row text-center" style="height: 3rem; align-items:center;">
                            <h6>{{song.name}}</h6>
                        </div>
                        <div class="butn row d-flex pt-1 p-2 text-center">
                            <a @click="sendid(song.id)"  class='btn col-6'>
                                Open
                            </a>
                            <a @click="addtoplaylist(song.id)"  class='btn col-6 btn-success'>
                                ADD
                            </a>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
    </div>
    `,
    data(){
        return{
            playlistsongs:[],
            newsongs:[],
            playlist:{
                id:null,
                name:null
            },
            songid:null
        }
    },async mounted(){
        const url = '/playlists'+`/${this.playlistid}`
        const playlistres = await fetch(url)
        playlistres.json().then((data)=>{this.playlist=data[0],this.newsongs=data[1],this.playlistsongs=data[2]}).catch((error)=>{console.log(error)})
    },
    methods:{
        async editplaylist(){
            const response = await fetch('/api/playlist',
            {method:'PUT',headers:{
                'authentication-token':'token',
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(this.playlist)}
            )
            const data = await response.json()
            if (response.ok){
                this.$router.push('/createplaylist/${data.id}')
            }
            this.error=data.message
        },
        async addtoplaylist(songid){
            this.songid=songid
            const url = '/playlists'+`/${this.playlistid}/${this.songid}`
            const response = await fetch(url,{
                method:'POST'
            })
            if(response.ok){console.log("added to playlist");location.reload()}
        },
        async removefromplaylist(songid){
            this.songid=songid
            const url = '/playlists'+`/${this.playlistid}/${this.songid}`
            const response = await fetch(url,{
                method:'DELETE'
            })
            if(response.ok){console.log("removed from playlist");location.reload()  }
        }

    }
}