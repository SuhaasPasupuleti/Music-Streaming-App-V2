export default{
    props:['id'],
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
            <h1>View Album</h1>
            
            <div class="d-flex mt-4"><h4>Album Name:  </h4><h3>{{this.album.name}}</h3> </div>
            <h2 class="mt-5">Songs:</h2>
            <div  style="display: flex;flex-direction:row;overflow: scroll;overflow: hidden;white-space: nowrap;height: 15rem;">
                <div v-for="song in albumsongs"  class="outer" style="margin: 2rem;padding-top: 18px;width: 10rem;">
                    <div class="col-2 box p-2 song" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.2)!important;border-radius: 20px;height: 7rem;width: 10rem;">
                        <div class="row text-center" style="height: 3rem; align-items:center;">
                            <h6>{{song.name}}</h6>
                        </div>
                        <div class="butn row d-flex pt-1 text-center">
                            <a @click="sendid(song.id)"  class='btn'>
                                Open
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    data(){
        return{
            albumsongs:[],
            album:{
                id:null,
                name:null
            },
        }
    },
    async mounted(){
        const url = '/albums'+`/${this.id}`
        const albumres = await fetch(url)
        albumres.json().then((data)=>{this.album=data[0],this.albumsongs=data[2]}).catch((error)=>{console.log(error)})
    },methods:{
        sendid (songid){
            this.$router.push('/player/'+`${songid}`)
        }
    }
}