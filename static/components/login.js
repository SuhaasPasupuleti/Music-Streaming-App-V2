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
    <div class="row justify-content-center" style="display: flex;justify-content: center;align-items: center;height: 35rem;">
                <div class="col-2 box p-5 pt-5 " style="box-shadow: 0px 0px 100px rgba(0,0,0,0.3)!important;border-radius: 20px;background: rgba(210,210,210,0.3);height: 20rem;width: 20rem;">
                    <div class='text-success'>{{$route.query.message}}</div>
                    <h1 class='text-center'>Login</h1>
                        <label for="username" class=" form-label">Username:
                        <input type="text" name='username' id='username' class="form-control" v-model="logdata.username" required/></label>
                        <label for="password" class=" form-label">Password:
                        <input type="password" name='password' id='password' class="form-control" v-model="logdata.password" required /></label>
                        <button class="btn  btn-primary d-flex justify-content-center" @click="login">Login</button>
                        <div class="text-danger">{{error}}</div>
                </div>
            </div></div>`,
    data(){
        return{
            logdata:{
                username: null,
                password: null
            },
            error:null,
        }
    },
    methods:{
        async login(){
            const res = await fetch('/userlogin',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify(this.logdata)
            })
            const data = await res.json()
            if (res.ok){
                localStorage.setItem('auth-token',data.token)
                localStorage.setItem('role',data.role)
                if(data.role=="creator"){
                    console.log("usser is a creator");
                    this.$router.push('/creatordash')
                }
                if(data.role=='admin'){
                    console.log("user is an admin")
                    this.$router.push('/admindash')
                }
                if(data.role=="user"){
                    console.log("user is a user")
                    this.$router.push('/userdash')
                }
                
                
            }
            this.error=data.message
        },
    },
}