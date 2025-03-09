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
            <div style="display:flex;"v-for="song in playlistsongs">
            {{song.name}}
            <button type="button" class="btn btn-danger text-nowrap" @click="removefromplaylist(song.id)">Remove</button>
            </div>
        </div>
        <div class="container" v-if="newsongs.length>0">
            <h1>Add to Playlist</h1>
            <div style="display:flex;" v-for="song in newsongs">
                {{song.name}}
                <button type="button" class="btn btn-success text-nowrap" @click="addtoplaylist(song.id)">Add</button>
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