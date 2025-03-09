export default{
    template:`
    <div>
        <nav class="navbar navbar-expand-lg navbar-light ">
            <a class="navbar-brand txt" >Music Streaming App</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav ms-auto">
                    <router-link class="nav-item nav-link btn active txt" to="/admindash">Dashboard</router-link>
                    <router-link class="nav-item nav-link btn active txt" to="/logout">Logout</router-link>
                </div>
            </div>
        </nav>
        <div class="container mt-3">
            <h1>ADMIN AUDIT</h1>
            <div  style="display: flex;flex-direction:row;overflow: scroll;overflow: hidden;white-space: nowrap;height: 15rem;">
                <div v-for="song in songs"  class="outer" style="margin: 2rem;padding-top: 18px;width: 10rem;">
                    <div class="col-2 box p-2 song" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.2)!important;border-radius: 20px;height: 7rem;width: 10rem;">
                        <div class="row text-center" style="height: 3rem; align-items:center;">
                            <h6>{{song.name}}</h6>
                        </div>
                        <div class="butn row d-flex pt-1 p-2 text-center">
                            <a @click="sendid(song.id)"  class='btn col-6'>
                                Open
                            </a>
                            <a @click="deletesong(song.id)"  class='btn btn-danger col-6'>
                                Delete
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,data(){
        return{
            songs:[]
        }
    },
    async mounted(){
        const res = await fetch('/songs',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(null)
        })
        const data = await res.json()
        if(res.ok){
            this.songs=data
        }
        this.error=data.message
    },
    methods:{
        sendid (songid){
            this.$router.push('/player/'+`${songid}`)
        },
        async deletesong(songid){
            const response = await fetch(`/api/song/${songid}`,{
                method:"DELETE",
            })
            if(response.ok){location.reload()}
        },
    }
}