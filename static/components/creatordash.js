export default {
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
            <a class="nav-item nav-link btn active txt" @click="upload()" >Upload</a>
            <router-link class="nav-item nav-link btn active txt" to="/logout">Logout</router-link>
        </div>
        </div>
    </nav> 
    <div class='container'>
    <h1>My Songs</h1>
    <div class="songs" v-if="songs.length>0" style="display: flex;flex-direction:row;overflow: scroll;overflow: hidden;white-space: nowrap;height: 17rem;">
    
    <div v-for="song in songs"  class="outer" style="margin: 2rem;padding-top: 18px;width: 20rem;">
        <div class="col-2 box p-2 song" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.2)!important;border-radius: 20px;height: 11rem;width: 20rem;">
            <div class="row" style="display: flex;justify-content: center;align-items: center;height: 3rem;">
                <div class="col-9">
                    {{song.name}}{{sort}}
                    </div>  
                    <div class="col-1">
                        <i class="fa-solid fa-star" style="color: #ece927;"></i>{{song.rating}}
                    </div>
                    <div class="col-2"></div>
                </div>
                <div class="row music">
                    <audio class="" :src="song.filename"  controls>
                    </audio>
                </div>
                <div class="butn row d-flex pt-1 text-center">
                    <a @click="sendid(song.id)"  class='col-4 btn'>
                        Open
                    </a>
                    <a @click="editsong(song.id)"  class='col-4 btn'>
                        Edit
                    </a>
                    <a @click="deletesong(song.id)"  class='btn col-4'>
                        Delete
                    </a>
                </div>
            </div>
        </div>        
    </div>
    <div v-else="">
        <h4 class="text-danger">No songs currently available,Start your creator journey</h4>
    </div>
    
    <div v-if="albums.length>0">
        <div class="row">
            <div class="col-5">
                <h1>My Albums</h1>
            </div>
            <div class="col-7" style="display:flex;">
                <input type="text" class="form-control" name='albumname' id="albumname" placeholder="enter album name" v-model="album.name" required>
                <button type="button" class="btn btn-primary text-nowrap" @click="createalbum">Create album</button>
            </div>
        </div>
        <div  style="display: flex;flex-direction:row;overflow: scroll;overflow: hidden;white-space: nowrap;height: 15rem;">
            <div v-for="album in albums"  class="outer" style="margin: 2rem;padding-top: 18px;width: 10rem;">
                <div class="col-2 box p-2 song" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.2)!important;border-radius: 20px;height: 7rem;width: 10rem;">
                    <div class="row text-center" style="height: 3rem; align-items:center;">
                        <h6>{{album.name}}</h6>
                    </div>
                    <div class="butn row d-flex pt-1 text-center">
                        <a @click="openalbum(album.id)"  class='col-6 btn'>
                            Open
                        </a>
                        <a @click="deletealbum(album.id)"  class='btn col-6'>
                            Delete
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else="">
        <div class="row" v-if="songs.length>0">
            <div class="col-5">
                <h1>My Albums</h1>
            </div>
            <div class="col-7" style="display:flex;">
                <input type="text" class="form-control" name='albumname' id="albumname" placeholder="enter album name" v-model="album.name" required>
                <button type="button" class="btn btn-primary text-nowrap" @click="createalbum">Create album</button>
            </div>
            <h4  class="text-danger">No albums currently available,start creating albums</h4>
        
    </div>
    <div v-else="">
    <h1>My Albums</h1>
        <h4  class="text-danger">Start your creator journey by uploading songs to create albums</h4>
        </div>
        </div>

    </div>

    </div>`,
    data(){
        return{
            songs:[],
            albums:[],
            error:null,
            album:{
                name:null
            }
        } 
    },
    async mounted(){
        const songsres = await fetch('/creatorsongs')
        songsres.json().then((data)=>{this.songs=data}).catch((error)=>{this.error=error})

        const albumres = await fetch('/api/album')
        const data = await albumres.json()
        if(albumres.ok){
            this.albums=data
        }
        this.error=data.message
    },
    methods:{
        async createalbum(){
            const response = await fetch('/api/album',
            {method:'POST',headers:{
                'authentication-token':'token',
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(this.album)}
            )
            const data = await response.json()
            if (response.ok){
                this.$router.push('/createalbum/'+`${data.id}`)
            }
            this.error=data.message
        },
        openalbum(id){
            this.$router.push(`/createalbum/${id}`)
        }
        ,async deletealbum(id){
            const response = await fetch(`/api/album/${id}`,{
                method:"DELETE",
            })
            if(response.ok){location.reload()}
        },
        upload(){
            this.$router.push('/upload/0')
        },
        sendid (songid){
            this.$router.push('/player/'+`${songid}`)
        },
        editsong(songid){
            const url='/upload/'+`${songid}`
            this.$router.push(url)
        },
        async deletesong(songid){
            const response = await fetch(`/api/song/${songid}`,{
                method:"DELETE",
            })
            if(response.ok){location.reload()}
        },
    }
}