export default{
    props:["songid"],
    template:`<div>
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
    <div class="row " style="display: flex;justify-content: center;align-items: center;height: 43rem;">
        <div class="box bg-light pt-4" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.6)!important;border-radius: 20px;height: 40rem;width: 30rem;">
            <h1 class='text-center' v-if="this.isedit">EDIT SONG</h1>
            <h1 class='text-center' v-else="">UPLOAD SONG</h1>
            <div class="text-danger">{{error}}</div>
            <label for="name" class="form-label">Song Name:
            <input type="text" name='name' id='name' class="form-control" v-model='songdata.name' required/></label>
            <label for="genre" class="form-label">Genre:
            <input type="text" name='genre' id='genre' class="form-control" v-model='songdata.genre' required/></label>
            <label for="lyrics" class="form-label">Lyrics:
            <textarea rows = "8" cols = "300" name = "lyrics" id='lyrics' v-model='songdata.lyric' class="form-control" required></textarea></label>
            <input type="file" name="song" id='song' accept=".mp3" class="form-control p-2" style="width: 15rem;" @change="sendaudio">
            <input type="submit" v-if="this.isedit" value="Edit" @click='editsong()' class="m-2 btn btn-primary d-flex">
            <input type="submit" v-else="" value="Upload" @click='upload' class="m-2 btn btn-primary d-flex">
            
        </div>
    </div></div>
    `,
    data(){
        return{
            songdata:{
                name: null,
                genre: null,
                lyric: null,
                audiofile:null
            },
            error:null,
            isedit:false
        }
    },
    methods:{
        
        sendaudio(event){

            this.songdata.audiofile=event.target.files[0]
        },
        async upload(){
            const dat= new FormData()
            dat.append('name',this.songdata.name)
            dat.append('genre',this.songdata.genre)
            dat.append('lyric',this.songdata.lyric)
            dat.append('audio',this.songdata.audiofile,this.songdata.audiofile.name)
            const res = await fetch('/api/song',{
                method:'POST',
                body: dat
            })
            const data = await res.json()
            if (res.ok){
                console.log("song successfuly uploaded")
                this.$router.push('/creatordash')
            }
            this.error=data.message
        },
        async editsong(){
            const url='/api/song/'+`${this.songid}`
            const res = await fetch(url,{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify(this.songdata)
            })
            const data = await res.json()
            if (res.ok){
                console.log("song successfuly EDITED")
                this.$router.push('/creatordash')
            }
            this.error=data.message
        },
        
    },
    async mounted(){
        
        if(this.songid>0){
            console.log("hello")
            this.isedit=true
            const url = '/player'+`/${this.songid}`
            const response= await fetch(url)
            response.json().then((data)=>{this.songdata.name=data[0].name,this.songdata.genre=data[0].genre,this.songdata.lyric=data[0].lyric}).catch((error)=>{console.log(error)})
        }

    }
}