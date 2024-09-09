import { useState } from 'react'
import styled from 'styled-components'
import {useCookies} from "react-cookie";

const AuthContainer = styled.div`
    width: 50%;
    margin: auto;
  @media (max-width: 720px){
    width: 100%;
  }
`
export const AuthContainerBox = styled.div`
  display: flex;
  flex-direction: column;
  label{
    font-size: 13px;
  }
  input{
    margin: 10px 0;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1.5px solid rgb(230,232,236);
  }
  input[type='submit']{
    margin: auto;
  }
    box-shadow:rgba(0,0,0,0.08) 0 6px 24px ,rgba(0,0,0,0.08) 0 0 0 1px;
    border-radius: 10px;
    overflow: hidden;
  
    form{
        display:flex;
        flex-direction:column;
        padding:20px;
      input[type='submit']{
        margin: auto;
      }
    }
  @media (max-width: 720px){
    padding: 10px;
  }
`
const AuthOptions=styled.div`
  display: flex;
  button{
    width: 50%;
    border: none;
    padding: 10px;
    color:rgb(35,38,47)
  }
`


const Auth = ()=>{

    const [isLogIn,setIsLogIn]=useState(true)
    const [handle,setHandle]=useState(null)
    const [username,setUsername]=useState(null)
    const [password,setPassword]=useState(null)
    const [confirmPassword,setConfirmPassword]=useState(null)
    const [error,setError]=useState(null)
    const [cookies,setCookie,removeCookie] = useCookies(null)



    const viewLogin = (status)=>{
        setError(null)
        setIsLogIn(status)
    }

    const handleSubmit = async (e,endpoint)=> {
        e.preventDefault()
        if (!isLogIn && password !== confirmPassword) {
            setError("Passwords don't match")
            return
        }
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/${endpoint}`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({handle, username, password})
        })
        const data = await response.json()
        if(data.detail){
            setError(data.detail)
        }else{
            setCookie('Handle',data.handle)
            setCookie('AuthToken',data.token)
            window.location.reload()
        }


    }

    return(
        <AuthContainer>
            <AuthContainerBox>
                <form action="">
                    <h2>{isLogIn?'Login':'Sign Up'}</h2>
                    {!isLogIn && <input required={true} type="text" placeholder='username'
                            onChange={(e) => setUsername(e.target.value)}/>}
                    <input autoFocus required={true} type="text" placeholder='@handle' onChange={e=>setHandle(e.target.value)} />
                    <input required={true} type="password" placeholder='password' onChange={e=>setPassword(e.target.value)} />
                    {!isLogIn && <input type="password" placeholder='confirm password' onChange={e=>setConfirmPassword(e.target.value)} />}

                    <input type="submit" value={isLogIn?'Login':'Sign Up'} onClick={(e)=>handleSubmit(e,isLogIn?'login':'signup')} />
                    {error && <p>{error}</p>}
                </form>
                <AuthOptions>
                    <button style={isLogIn?{backgroundColor:'grey'}:{}} onClick={()=>viewLogin(true)}>Login</button>
                    <button style={!isLogIn?{backgroundColor:'grey'}:{}} onClick={()=>viewLogin(false)}>Sign Up</button>
                </AuthOptions>
            </AuthContainerBox>
        </AuthContainer>
    )
}

export default Auth