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
                <div class="col-4 center" style="border-radius: 25px;box-shadow: 7px 5px 30px rgba(0,0,0,0.3)!important;display: flex;flex-direction: column;justify-content: center;align-items: center;height:10rem;width:10rem;"><h4>creators <h3>creators</h3> </h4></div>
                <div class="col-4 center" style="border-radius: 25px;box-shadow: 7px 5px 30px rgba(0,0,0,0.3)!important;display: flex;flex-direction: column;justify-content: center;align-items: center;height:10rem;width:10rem;"><h4>Users <h3>users</h3> </h4></div>
                <div class="col-4 center" style="border-radius: 25px;box-shadow: 7px 5px 30px rgba(0,0,0,0.3)!important;display: flex;flex-direction: column;justify-content: center;align-items: center;height:10rem;width:10rem;"><h4>songs <h3></h3> </h4></div>
            </div>
        
    </div>
    </div>
    `
}