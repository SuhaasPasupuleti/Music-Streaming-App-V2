import router from './router.js'

router.beforeEach((to,from,next)=>{
   
    
    if(localStorage.getItem('auth-token')){
        if(to.name=='login'||to.name=='register'||to.name=='home'){
            next({name:"userdash"})
        }else next()
    }

    if(localStorage.getItem('role')=='admin'){
        if(to.name=='admindash'||to.name=='logout'||to.name=='audit'||to.name=='player'){
            next()
        }else next({name:'admindash'})
    }

    
    
    if(localStorage.getItem('role')!='creator'){
        if(to.name=='creatordash'||to.name=='upload'||to.name=='createalbum'){
            if(localStorage.getItem('role')=='user'){next({name:'creatorregister'})}
            else next({name:'admindash'})
        }else next()
        
    }

    if(!localStorage.getItem('auth-token')){
        if(to.name!='login'&& to.name!='register' && to.name!='home'){
            next({name:'home'})
        }else next()
    }

    
})

var app = new Vue({
    el:"#app",
    template:`<div><router-view/></div>`,
    router,
})