import {Component}     from 'angular2/core';

@Component({
    templateUrl: 'app/components/signup/signup.html'
})


export class SignupComponent {

  //this is the function that will be called when the user click the "Sign up" button
  signup(event, email, password) {

    event.preventDefault();

    // We call our API to log the user in. The email and password are entered by the user
    fetch('/users/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email, password
      })
    })
    .then((response) => {
      //return json format of our response
      return response.json();

    })
    .then((result) => {
      //check if there is any result
      if(result){
        //check if result was successful
        if(!result.success){
          alert(result.reason);
        }else{
          alert("user was created");
        }
      }
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.message);
    });
  }
 }
