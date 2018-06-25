let gOAuth = {
    castlist:[],
    user: {},
    network: [],
    projects: [], 
    logIn: function() {   
      // $("#my-signin2").hide();
      // $("#loginBtn").html("Log Out");
      // $(".nonLogin").removeClass("disabled");
      this.getUserProfile();
    },
    // logOut: () => {
    //   var auth2 = gapi.auth2.getAuthInstance();
    //     auth2.signOut().then(function () {
    //       /* $("#my-signin2").show();
    //       $("#loginBtn").html("Log In");
    //       $(".nonLogin").addClass("disabled");*/ 
    //       gOAuth.user = {};
    //     });
    // },  
    setGoogleDetails: (googleUser) => {      
      let profile = googleUser.getBasicProfile();
          this.user = {
              googleID: profile.getId(),
              fullName: profile.getName(),
              givenName: profile.getGivenName(),
              familyName: profile.getFamilyName(),
              imgURL: profile.getImageUrl(),
              email: profile.getEmail()
            };        
          // The ID token you need to pass to your backend:
          var id_token = googleUser.getAuthResponse().id_token;
          console.log("ID Token: " + id_token);

          this.logIn();
    },
    renderButton: () => {
      window.gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': gOAuth.setGoogleDetails,
        'onfailure': onFailure
      });
    }
  }

  function onFailure(error) {
    console.log(error);
  };

export default gOAuth;