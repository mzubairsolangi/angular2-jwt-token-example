import {Component}     from 'angular2/core';
//import the router
import {Router} from 'angular2/router';

@Component({
    templateUrl: 'app/components/home/home.html'
})


export class HomeComponent {
  //inject the router
  constructor(router: Router){

    //check if the jwt token was set
    if(!localStorage.getItem("jwt")) {
      //if it does not have a jwt token, redirect user to login page
      router.parent.navigate(['/Login']);
      return;
    }

    //make a request to our secured route 
    this.getSecuredContent();
  }


  getSecuredContent() {

    event.preventDefault();

    // We call our API to retriev some secured data
    fetch('/users/securedRoute', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //pass the authorization header in order for the server to authenticate your request!!!
        'Authorization' : localStorage.getItem("jwt");
      }
    })
    .then((response) => {
      //return json format of our response
      return response.json();

    })
    .then((result) => {
      //check if there is any result
      if(result && result.securedContent){
        alert(result.securedContent);
      }
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.message);
    });
  }



 }
