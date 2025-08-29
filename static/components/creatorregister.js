export default{
    template: `<div>
    <nav class="navbar navbar-expand-lg navbar-light ">
        <a class="navbar-brand txt" >Music Streaming App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
            <router-link class="nav-item nav-link btn active txt" to="/userdash">Dashboard</router-link>    
            <router-link class="nav-item nav-link btn active txt" to="/logout">Logout</router-link>
        </div>
        </div>
    </nav>
    <div class="card" style="display: flex;justify-content: center;align-items: center;height: 40rem;border: none;">
        <div class="box d-flex justify-content-center text-center" style="flex-direction:column;box-shadow: 7px 5px 50px rgba(0,0,0,0.6)!important;height: 30rem;width: 80%;border-radius: 10px;display:flex;align-items: center;">
            <h1>Become a Creator</h1>
            <h6>Register as Creator</h6>
            <a @click="creatorregister">
                <i class="fa-solid fa-circle-plus fa-5x" style="color: #ffff00;"></i>
            </a>
        </div>
    </div>
    `,methods:{
        creatorregister(){
            localStorage.removeItem('role')
            localStorage.setItem('role','creator')
            fetch('/creatorregister').then(response => {
                if (response.ok) {this.$router.push('/creatordash');}
              })
        }
    }
}