import base64 from "base-64";
import axios from "axios";

class AuthenticationService
{
    constructor() {
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.delete = this.delete.bind(this);
    }

    setItem(key, value) {
        // Saves item to localStorage
        localStorage.setItem(key, value);
    }

    getItem(key) {
        // Gets the item from localStorage
        return localStorage.getItem(key);
    }

    getToken() {
        // Gets the token from localStorage
        return localStorage.getItem("access_token");
    }

    loggedIn() {
        // Checks if there is a saved token
        const token = this.getToken();
        return !!token;
    }

    logout() {
        // Clear token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
    }

    register(data) {
        return axios.post('/User/Create', 
            data,
            {
                headers: {
                    "Authorization": "Basic " + base64.encode('my-trusted-client:secret') // Can be get from env
                }
            }
        );
    }

    login(data) {
        return axios.post(`/oauth/token?grant_type=password&username=${data.username}&password=${data.password}`, 
            null,
            {
                headers: {
                    "Authorization": "Basic " + base64.encode('my-trusted-client:secret') // Can be get from env
                }
            }
        );
    }

    refreshToken() {
        var refreshToken = this.getItem('refresh_token');
        axios.post(`/oauth/token?grant_type=refresh_token&client_id=my-trusted-client&refresh_token=${refreshToken}`, 
            null,
            {
                headers: {
                    "Authorization": "Basic " + base64.encode('my-trusted-client:secret') // Can be get from env
                }
            }
        )
        .then(response => {
            this.setItem("access_token", response.data.access_token);
            this.setItem("refresh_token", response.data.refresh_token);
        })
        .catch(error => {
            console.log(error);
            throw new Error(error);
        });
    }

    prepareHeaders() {
        var config = { headers: {} };
        // performs api calls sending the required authentication headers
        config.headers["Content-Type"] = "application/json";
        config.headers["Authorization"] = "Basic " + base64.encode('my-trusted-client:secret'); // Can be get from env

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            config.headers["Authorization"] = "Bearer " + this.getToken();
        }
        return config;
    }

    post(url, data){
        var config = this.prepareHeaders();
        var result = axios.post(url, data, config);
        return result;
    }

    get(url){
        var config = this.prepareHeaders();
        var result = axios.get(url, config);
        // Refresh the token after every get request
        this.refreshToken();
        return result;
    }

    getWithoutRefresh(url){
        var config = this.prepareHeaders();
        var result = axios.get(url, config);
        return result;
    }

    put(url, data){
        var config = this.prepareHeaders();
        var result = axios.put(url, data, config);
        return result;
    }

    delete(url){
        var config = this.prepareHeaders();
        var result = axios.delete(url, config);
        return result;
    }
}

export default AuthenticationService;