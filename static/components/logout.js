export default{
    
    methods: {
        logout() {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('role')
          fetch('/logout').then(response => {
            if (response.ok) {this.$router.push('/');}
          })
        },
      },
    
      beforeMount() {
        this.logout();
      },
}