export default{
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
        <div class="container" >
            <h1>Create album</h1>
            <div class="" style="display:flex;">
            <input type="text" class="form-control" id="albumname" name="albumname"  v-model="album.name" placeholder="enter name of album" required>
            <button type="button" class="btn btn-primary text-nowrap" @click="editalbum">Edit album</button>
            </div>
        </div>
        <div class="container" v-if="albumsongs.length>0">
            <h1>Remove from album</h1>
            <div style="display:flex;"v-for="song in albumsongs">
            {{song.name}}
            <button type="button" class="btn btn-danger text-nowrap" @click="removefromalbum(song.id)">Remove</button>
            </div>
        </div>
        <div class="container" v-if="newsongs.length>0">
            <h1>Add to album</h1>
            <div style="display:flex;" v-for="song in newsongs">
                {{song.name}}
                <button type="button" class="btn btn-success text-nowrap" @click="addtoalbum(song.id)">Add</button>
            </div>
        </div>
    </div>`
}