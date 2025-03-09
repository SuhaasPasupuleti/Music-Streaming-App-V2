export default{
    template:`<div>
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
            <div class="row justify-content-center">
                <div class="col-2 box p-5 pt-5 bg-light">
                    <h1 class='text-center'>Register</h1>
                    <label for="name" class="form-label">Name:
                    <input type="text" name='name' id='name' class="form-control" v-model="userdata.name" required/></label>
                    <label for="username" class=" form-label">Username:
                    <input type="text" name='username' id='username' class="form-control" v-model="userdata.username" required/></label>
                    <label for="email" class=" form-label">Email:
                    <input type="text" name='email' id='email' class="form-control" v-model="userdata.email" required/></label>
                    <label for="password" class=" form-label">Password:
                    <input type="password" name='password' id='password' class="form-control" v-model="userdata.password" required /></label>
                    <button class="btn  btn-primary d-flex justify-content-center" @click="register">Register</button>
                    <div class="text-danger">{{error}}</div>
                </div>
            </div></div>`,
    data(){
        return{
            userdata:{
                name:null,
                username: null,
                email:null,
                password: null
            },
            error:null,
        }
    },
    methods:{
        async register(){
            const res = await fetch('/userregister',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify(this.userdata)
            })
            const data = await res.json()
            if (res.ok){
                this.$router.push({path:'/login',query:{message:'successfully registered'}})
            }
            this.error=data.message
        },
    },
}