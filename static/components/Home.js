export default {
    template : `<div>
    <nav class="navbar navbar-expand-lg navbar-light ">
        <a class="navbar-brand txt" >Music Streaming App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
            <router-link class="nav-item nav-link btn active txt" to="/login">Login</router-link>    
            <router-link class="nav-item nav-link btn active txt" to="/register">Register</router-link> 
        </div>
        </div>
    </nav>
    <div class="container">
    <div class="home text-center p-2 bg-light">
        <h1 class="pt-5">Welcome to Music Streaming App</h1>
        <h4>This app is developed as a course project for IITM Online B.Sc Degree</h4>
        <div class='wdth '>
            <a  @click="login" class="btn btn-lg">Login</a>
            <a  @click='register' class="btn-lg btn">Register</a>
        </div>
    </div>
</div></div>`,
    methods : {
        login(){
            this.$router.push('/login')
        },
        register(){
            this.$router.push('/register')
        }
    }
}