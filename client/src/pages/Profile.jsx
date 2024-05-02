import styled from "styled-components";
import {useEffect, useState} from "react";
import Feed from './../components/Feed.jsx'
import {useParams} from "react-router-dom";


const UserInfoContainer = styled.div`
  font-family: 'Segoe UI Symbol', Arial, sans-serif;
    h1{
        font-weight: bold;
        font-size: 24px;
    }
  span{
    background-color: rgb(59,59,59);
    color: rgb(114,114,114);
    font-size:13px;
    padding: 3px 6px;
    border-radius: 20px;
    
  }
`
const InfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
`
export const ImageContainer = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  img{
    width: 100%;
  }
`
const SubInfoContainer = styled.div`
  color: rgb(114,114,114);
  a{
    text-decoration: none;
    color: rgb(114,114,114);
  }
`
const ButtonContainer = styled.div`
    button{
        border: none;
        background-color: transparent;
        padding: 7px;
        color:rgb(114,114,114);
        border-bottom: 1px solid rgb(114,114,114);
        font-weight: bold;
        width: 50%;
        cursor: pointer;
        &:hover{
           color: rgb(90,90,90);
        }
    }
`



const Profile = ()=>{

    const [mode,setMode] = useState('threads')
    const [user,setUser]=useState('')
    const [threads,setThreads]=useState({})
    const [followers,setFollowers]=useState(0)
    const {slug} = useParams()
    console.log(slug)
    const getUserData = async()=>{
        const response  = await fetch(`http://localhost:8000/users/${slug}`)
        const data = await response.json()
        setUser(data.users[0])
        setFollowers(data.followers[0].count)
    }

    const getThreads = async()=>{
        const response = await fetch(`http://localhost:8000/${slug}/threads`)
        const data = await response.json()
        setThreads(data.sort((a,b)=>new Date(b.time_stamp)-new Date(a.time_stamp)))
    }

    useEffect( ()=>{
        getUserData()
        getThreads()
    },[])



    return(
        <div className={'profile-page-container'}>
            <header>
                <InfoContainer>
                    <UserInfoContainer>
                        <h1>{user.username}</h1>
                        <p>{user.handle} <span>threads.net</span></p>
                    </UserInfoContainer>
                    <ImageContainer>
                        <img src={user.img} alt={'avatar image'}/>
                    </ImageContainer>
                </InfoContainer>
                <p>{user.bio}</p>
                <SubInfoContainer>
                    <p style={{color: 'rgb(114, 114, 114)'}}>{followers} followers · <a href={user.link} target={'_blank'}>{user.link}</a></p>
                </SubInfoContainer>
                <button className={'primary'}>Share profile</button>
                <ButtonContainer>
                    <button style={mode === 'threads' ? {
                        color: 'rgb(250,250,250)',
                        borderBottom: '1.5px solid rgb(250,250,250)'
                    } : {color: 'rgb(114, 114, 114)'}} onClick={() => setMode('threads')}>Threads
                    </button>
                    <button style={mode === 'replies' ? {
                        color: 'rgb(250,250,250)',
                        borderBottom: '1.5px solid rgb(250,250,250)'
                    } : {color: 'rgb(114, 114, 114)'}} onClick={() => setMode('replies')}>Replies
                    </button>
                </ButtonContainer>
            </header>

        </div>
    )
}

export default Profile