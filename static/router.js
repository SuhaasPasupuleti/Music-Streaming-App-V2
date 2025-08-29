import Home from  './components/Home.js'
import login from './components/login.js'
import register from './components/register.js'
import userdash from './components/userdash.js'
import creatordash from './components/creatordash.js'
import admindash from './components/admindash.js'
import audit from './components/audit.js'
import songs from './components/songs.js'
import upload from './components/upload.js'
import createplaylist from './components/createplaylist.js'
import createalbum from './components/createalbum.js'
import creatorregister from './components/creatorregister.js'
import player from './components/player.js'
import viewalbum from './components/viewalbum.js'
import logout from './components/logout.js'

const routes = [
    {path : '/',component : Home,name:'home'},
    {path : '/register', component : register,name:'register'},
    {path : '/login',component:login, name:'login'},
    {path : '/userdash', component : userdash,name:'userdash'},
    {path : '/creatordash', component : creatordash,name:'creatordash'},
    {path : '/admindash', component : admindash,name:'admindash'},
    {path : '/audit', component : audit,name:'audit'},
    {path : '/songs/:sort', component : songs,name:'songs'},
    {path : '/upload/:songid', component : upload,name:'upload',props:true},
    {path : '/createplaylist/:playlistid',component: createplaylist,props:true,name:'createplaylist'},
    {path : '/createalbum/:albumid',component: createalbum,props:true,name:'createalbum'},
    {path : '/creatorregister',component: creatorregister,name:'creatorregister'},
    {path : '/player/:songid', component : player,props:true,name:'player'},
    {path : '/viewalbum/:id', component : viewalbum,props:true,name:'viewalbum'},
    {path : '/logout',component: logout,name:'logout'}
]

export default new VueRouter({routes})