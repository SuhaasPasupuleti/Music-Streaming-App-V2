export default{
    template:`<div>
        <div class="songs " v-if="songs.length>0" style="display: flex;flex-direction:row;overflow: hidden;overflow-x: scroll;white-space: nowrap;height: 17rem;">
            <div v-for="song in songs"  class="outer" style="margin: 2rem;padding-top: 18px;width: 20rem;">
                <div class="col-2 box p-2 song" style="box-shadow: 7px 5px 50px rgba(0,0,0,0.2)!important;border-radius: 20px;height: 11rem;width: 20rem;">
                    <div class="row" style="display: flex;justify-content: center;align-items: center;height: 3rem;">
                        <div class="col-9 song-name">
                            <h6>{{song.name}}</h6>
                        </div>  
                        <div class="col-1">
                            <i class="fa-solid fa-star" style="color: #ece927;"></i>{{song.rating}}
                        </div>
                        <div class="col-2"></div>
                    </div>
                    <div class="row music" >
                        <audio class="" @play="played(song.id)" :src="song.filename" controls ></audio>
                    </div>
                    <div class="butn pt-1 text-center">
                        <a @click="sendid(song.id)"  class='btn'>
                            Open
                        </a>
                    </div>
                </div>
            </div>        
        </div><div v-else=""><h2 class="text-danger">No songs currently available</h2></div>
        </div>
        `,
    props:['sort'],
    data(){
        return{
            songs:[],
            error:null,
            filtr:this.sort,
            
        } 
    },
    methods:{
        played(songid){
            const res= fetch('/played/'+`${songid}`)
        },
        sendid (songid){
            this.$router.push('/player/'+`${songid}`)
        }
    },
    async mounted(){
        console.log("adjghairuhgpkajripguakruib")
        console.log(this.filtr)
        const res = await fetch('/songs',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(this.filtr)
        })
        const data = await res.json()
        if(res.ok){
            this.songs=data
        }
        this.error=data.message
    },
    styles:`
    .songs::-webkit-scrollbar { display: none; }
    .music audio::-webkit-media-controls-enclosure{
        background: none;
     }
    `
    }