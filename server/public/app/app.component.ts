import {Component} from 'angular2/core';
import {  RouterOutlet, RouterLink,  RouteConfig} from 'angular2/router';
import {HomeComponent} from './components/home/home.component';
import {SearchComponent} from './components/search/search.component';
//import signup and login components
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';


@Component({
    selector: 'my-app',
    templateUrl: 'app/app.html',
    directives: [RouterOutlet, RouterLink]
})
@RouteConfig([
    {
        path: '/home',
        name: 'Home',
        component: HomeComponent,
        useAsDefault: true
    },

    {
        path: '/search/',
        as: 'Search',
        component: SearchComponent
    },

    //add the login route
    {
        path: '/login',
        as: 'Login',
        component: LoginComponent
    },

    //add the signup route
    {
        path: '/signup',
        as: 'Signup',
        component: SignupComponent
    }
])
export class AppComponent {
}
