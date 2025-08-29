export default {
    template:`
    <div>
    <nav class="navbar navbar-expand-lg navbar-light ">
        <a class="navbar-brand txt" >Music Streaming App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
            <router-link class="nav-item nav-link btn active txt" to="/audit">Audit</router-link>
            <router-link class="nav-item nav-link btn active txt" to="/logout">Logout</router-link>
        </div>
        </div>
    </nav>
    <div class="container  p-2">
        <h1 class='text-center'>ADMIN DASHBOARD</h1>
    </div>
    <div class="container p-5" >
        
            <div class="row" style="display: flex;flex-direction: row;justify-content: space-around;">
                <div class="col-4 center" style="border-radius: 25px;box-shadow: 7px 5px 30px rgba(0,0,0,0.3)!important;display: flex;flex-direction: column;justify-content: center;align-items: center;height:10rem;width:10rem;"><h4>creators <h3>{{this.creators.length}}</h3> </h4></div>
                <div class="col-4 center" style="border-radius: 25px;box-shadow: 7px 5px 30px rgba(0,0,0,0.3)!important;display: flex;flex-direction: column;justify-content: center;align-items: center;height:10rem;width:10rem;"><h4>Users <h3>{{this.users.length}}</h3> </h4></div>
                <div class="col-4 center" style="border-radius: 25px;box-shadow: 7px 5px 30px rgba(0,0,0,0.3)!important;display: flex;flex-direction: column;justify-content: center;align-items: center;height:10rem;width:10rem;"><h4>songs <h3>{{this.songs.length}}</h3> </h4></div>
            </div>
        
    </div>
    <div class="container" v-if="topsongs.length>0">
        <h1>Top 3 Songs</h1>
        <div  style="display: flex;flex-direction:row;overflow: scroll;overflow: hidden;white-space: nowrap;height: 15rem;">
            <div v-for="song in topsongs"  class="outer" style="margin: 2rem;padding-top: 18px;width: 20rem;">
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
    <div class="container p-5">
        <table class="table table-striped ">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Genre</th>
                <th scope="col">Date Created</th>
                <th scope="col">Times Played</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="song in songs">
                    <th scope="row">{{song.id}}</th>
                    <td>{{song.name}}</td>
                    <td>{{song.genre}}</td>
                    <td>{{song.date_created}}</td>
                    <td>{{song.times_played}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
    `,
    data(){
        return{
            creators:[],
            users:[],
            songs:[],
            topsongs:[]
        }
    },
    async mounted(){
        const res =await fetch('/admindash')
        res.json().then((data)=>{this.creators=data[0],this.users=data[1],this.songs=data[2],this.topsongs=data[3]}).catch((error)=>{console.log(error)})
        
    },
    methods:{
        sendid (songid){
            // this.$router.push('/player/'+`${songid}`)
            console.log(this.songs)
        },
        async deletesong(songid){
            const response = await fetch(`/api/song/${songid}`,{
                method:"DELETE",
            })
            if(response.ok){location.reload()}
        },
    }
}