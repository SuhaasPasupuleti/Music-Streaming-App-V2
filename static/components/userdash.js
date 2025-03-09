import songs from './songs.js'

export default{
    template: `<div >
        <nav class="navbar navbar-expand-lg navbar-light ">
            <a class="navbar-brand txt" >Music Streaming App</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="col-6 container">
                <form class="d-flex" @submit.prevent="searchAndHighlight">
                    <input class="form-control me-2" type="search" v-model="searchTerm" placeholder="Search" aria-label="Search">
                    <button class="btn btn-success" type="submit">Search</button>
                </form>
            </div>
            <div class="navbar-nav ms-auto">
                <router-link class="nav-item nav-link btn active txt" to="/userdash">Dashboard</router-link>  
                <router-link class="nav-item nav-link btn active txt" to="/creatordash">Creator Dash</router-link>    
                <router-link class="nav-item nav-link btn active txt" to="/logout">Logout</router-link>
            </div>
            </div>
        </nav>
        

        <div class='container mt-4'>
            <div class="row">
                <h1 class="col-10">Songs</h1>
                <div class="col-2" >
                <button v-if="filter==true" v-on:click="filter=!filter">Sort by Rating</button>
                <button v-else="" v-on:click="filter=!filter">Sort by Date</button>
                    
                </div>
            </div>
            <div v-if="filter==true">
                <songs  :sort='newsongs'/>
            </div>
            <songs v-else="" :sort="top"></songs>
        </div>
        <div class="container" v-if="albums.length>0">
            <h1>Albums</h1>
            <div  style="display: flex;flex-direction:row;overflow: scroll;overflow: hidden;white-space: nowrap;height: 15rem;">
                <div v-for="album in albums"  class="outer" style="margin: 2rem;padding-top: 18px;width: 10rem;">
                    <div class="col-2 box p-2 song" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.2)!important;border-radius: 20px;height: 7rem;width: 10rem;">
                        <div class="row text-center" style="height: 3rem; align-items:center;">
                            <h6>{{album.name}}</h6>
                        </div>
                        <div class="butn row d-flex pt-1 text-center">
                            <a @click="openalbum(album.id)"  class=' btn'>
                                Open
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" v-else=""><h1>Albums</h1><h2 class="text-danger">No Albums currently available</h2></div>
        <div class="container p-3">
            <div class="row">
                <div class="col-5">
                    <h2>My Playlists</h2>
                </div>
                <div class="col-7" style="display:flex;">
                    <input type="text" class="form-control" name='playlistname' id="playlistname" placeholder="enter playlist name" v-model="playlist.name" required>
                    <button type="button" class="btn btn-primary text-nowrap" @click="createplaylist">Create Playlist</button>
                </div>
            </div>
            <div  style="display: flex;flex-direction:row;overflow: scroll;overflow: hidden;white-space: nowrap;height: 15rem;">
                <div v-for="playlist in playlists"  class="outer" style="margin: 2rem;padding-top: 18px;width: 10rem;">
                    <div class="col-2 box p-2 song" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.2)!important;border-radius: 20px;height: 7rem;width: 10rem;">
                        <div class="row text-center" style="height: 3rem; align-items:center;">
                            <h6>{{playlist.name}}</h6>
                        </div>
                        <div class="butn row d-flex pt-1 text-center">
                            <a @click="openplaylist(playlist.id)"  class='col-6 btn'>
                                Open
                            </a>
                            <a @click="deleteplaylist(playlist.id)"  class='btn col-6'>
                                Delete
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>`,
    components:{
        songs
    },
    data(){
        return{
            playlist:{
                name:null
            },
            playlists:[],
            result:[],
            error:null,
            user:{
                id:null,
                role:null,
                name:null
            },
            albums:[],
            search:'',
            filter:true,
            newsongs:'newsongs',
            top:'top'
        }
    },
    
    methods:{
        changefilter(){
            this.filter=!this.filter
        },
        searchAndHighlight() {
              this.removeHighlights();
              this.highlightText('.song-name h6');
              
            
          },
          removeHighlights() {
            const highlightedElements = document.querySelectorAll('.highlight');
            
            highlightedElements.forEach((element) => {
              const parent = element.parentElement;
              parent.replaceChild(document.createTextNode(element.textContent), element);
            });
          },
          highlightText(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
              const text = element.textContent;
              const regex = new RegExp(this.searchTerm, 'gi');
              const highlightedText = text.replace(regex, (match) => {
                return `<span  style="color: red;" >${match}</span>`;
              });
             
              element.innerHTML = highlightedText;
            });
          },


        openplaylist(id){
            this.$router.push(`/createplaylist/${id}`)
        }
        ,async deleteplaylist(id){
            const response = await fetch(`/api/playlist/${id}`,{
                method:"DELETE",
            })
            if(response.ok){location.reload()}
        },
        async createplaylist(){
            const response = await fetch('/api/playlist',
            {method:'POST',headers:{
                'authentication-token':'token',
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(this.playlist)}
            )
            const data = await response.json()
            console.log(data)
            if (response.ok){
                const url='/createplaylist/'+`${data.id}`
                this.$router.push(url)
            }
            this.error=data.message
            
        },
        openalbum(id){
            this.$router.push(`/viewalbum/${id}`)
        }
    },
    async mounted(){
        const playres = await fetch('/api/playlist')
        const playdata = await playres.json()
        if(playres.ok){
            this.playlists=playdata
        }
        const albumres = await fetch('/api/album')
        const data = await albumres.json()
        if(albumres.ok){
            this.albums=data
        }
        this.error=data.message
    }
    
}