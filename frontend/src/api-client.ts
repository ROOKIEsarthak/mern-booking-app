import { RegisterFormData } from "./pages/Register";
import { SignInFormFata } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// register user function 

export const register = async(formdata:RegisterFormData)=>{

    const response = await fetch(`${API_BASE_URL}/api/users/sign-up`,{
        method: 'POST',
        credentials:"include",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formdata)
    });

    const responseBody = await response.json()

    if(!response.ok){
        throw new Error(responseBody.message)
    }
};


// sign in user function

export const signIn = async(formdata: SignInFormFata)=>{
    const response = await fetch (`${API_BASE_URL}/api/users/sign-in`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(formdata)
    })
    const body = await response.json()
    if(!response.ok){
        throw new Error(body.message)
    }
}

// validate token function

export const validateToken = async()=>{

    const response = await fetch(`${API_BASE_URL}/api/users/validate-token`,{
        credentials:"include"
    });

if (!response.ok){

    throw new Error("Token invalid");
}
return response.json();

}


// logout user function

export const signOut = async()=>{
    const response = await fetch(`${API_BASE_URL}/api/users/logout`,{
        credentials:"include",
        method:"POST",

    });

    if(!response.ok){
        throw new Error("Error during sign out")
    }

}