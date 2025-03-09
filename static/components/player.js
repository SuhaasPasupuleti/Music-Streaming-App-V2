export default{
    props:["songid"],
    template:`
    <div>
    <nav class="navbar navbar-expand-lg navbar-light ">
        <a class="navbar-brand txt" >Music Streaming App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav ms-auto" v-if="this.role">
                <router-link class="nav-item nav-link btn active txt" to="/admindash">Dashboard</router-link>  
                <router-link class="nav-item nav-link btn active txt" to="/audit">Audit</router-link>    
                <router-link class="nav-item nav-link btn active txt" to="/logout">Logout</router-link>
            </div>
            <div class="navbar-nav ms-auto" v-else="">
                <router-link class="nav-item nav-link btn active txt" to="/userdash">Dashboard</router-link>  
                <router-link class="nav-item nav-link btn active txt" to="/creatordash">Creator Dash</router-link>    
                <router-link class="nav-item nav-link btn active txt" to="/logout">Logout</router-link>
            </div>
        </div>
    </nav>
    <div class="container justify-content-center d-flex" style="height:40rem;">
    <div class="player p-4 " style="box-shadow: 7px 5px 50px rgba(0,0,0,0.6)!important;height: 35rem;width: 80%;margin-top:2rem;padding: 1rem;" >
        <div class="row mt-2" style="alig-items:center;">
            <div class="col-3" >
                <h2>{{this.song.name}}</h2>
                <h6>{{this.song.genre}}</h6>
            </div>
            <div class="col-6 ">
                <audio class="" @play="played(song.id)" :src="filen" controls></audio>
            </div>
            <div class="col-2 justify-content-center d-flex">
                <h3 value><i class="fa-solid fa-star" style="color: #ece927;"></i>{{this.song.rating}}</h3>
            </div>
        </div>
        <div class="row p-3 justify-content-center" >
            <div class="col-9" style="overflow-y: scroll;height: 20rem;width: 33rem;border-radius: 20px;box-shadow: 0px 0px 20px rgba(0,0,0,0.2)!important;" >
                <h5>Lyrics:</h5>
                <h4>{{this.song.lyric}}</h4>
            </div>
            <div class="col-3 p-3">
                <div class="row p-3">
                    <div v-if="this.usrrating" class="d-flex align-items-center">
                        <h5 class="p-2">
                            Your Rating: <i class="fa-solid fa-star" style="color: #ece927;"></i>{{this.usrrating}}
                        </h5>
                        <a @click="resetrating" class='btn btn-danger'>
                            Reset
                        </a>
                    </div>    

                    <div class="" v-else="">
                        <div class="">
                            <h6>Your Rating:</h6>
                            
                        </div>
                        <div class="d-flex">
                            <select v-model="rating" class="" name="rating" id="rating" >
                                <option selected disabled>select rating</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </select>
                            <button class="btn  btn-success" @click="ratesong">Rate</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    </div>
    `,
    data(){
        return {
        song:{
            id:null,
            name:null,
            genre:null,
            rating:null,
            lyric:null,
            filename:null
        },
        usrrating:null,
        rating:null,
        role:false,
        filen:null
    }
    },
    async mounted(){
        if(localStorage.getItem('role')=='admin'){this.role=true}
        const url = '/player'+`/${this.songid}`
        const response= await fetch(url)
        response.json().then((data)=>{this.song=data[0],this.usrrating=data[1].rating,this.filen=data[0].filename}).catch((error)=>{console.log(error)})
        
    },
    methods:{played(songid){
        if(localStorage.getItem('role')!='admin' && localStorage.getItem('role')!='creator'){
        const res= fetch('/played/'+`${songid}`)}
    },
        async ratesong(){
            console.log(this.role)
            const url="/api/rating/"+`${this.song.id}/${this.rating}`
            const response = await fetch(url,{
                method:'POST'}).catch((error)=>{console.log(error)})
            if(response.ok){location.reload()}
        },
        async resetrating(){
            const url="/api/rating/"+`${this.song.id}/${this.usrrating}`
            const response=await fetch(url,{
                method:'DELETE'}).catch((error)=>{console.log(error)})
            if(response.ok){location.reload()}
        },
        async editsong(){
            const url='/upload/'+`${this.song.id}`
            this.$router.push(url)
        },
    }
}