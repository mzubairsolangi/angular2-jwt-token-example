import {Component}     from 'angular2/core';
import {Router} from 'angular2/router';

//tell the component where the template will be
@Component({
    templateUrl: 'app/components/login/login.html'
})


export class LoginComponent {

 // We inject the router
 constructor(router: Router) {
   this.router = router;
 }

  login(event, email, password) {
    // This will be called when the user clicks on the Login button
    event.preventDefault();
    // We call our API to log the user in. The email and password are entered by the user
    fetch('/users/login', {
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
      //if the statuscode is 200, that means that everything worked as expected and the user is logged in.
      if(response.status == 200) {
        return response.json();

        //if the status code is 401 (Unauthorized), that means that the email or the password could not be authenticated
      }else if(response.status == 401) {
        alert("User or password is incorrect.");
      }
    })
    .then (result => {
      if(result){
        // Once we get the JWT in the response, we save it into localStorage
        localStorage.setItem('jwt', result.token);
        // and then we redirect the user to the home
        this.router.parent.navigate(['/Home']);
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

 }
