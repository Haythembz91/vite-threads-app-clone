import styled from "styled-components";
import {useState} from "react";
import Feed from './../components/Feed.jsx'


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
const ImageContainer = styled.div`
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
const Buttoncontainer = styled.div`
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

    return(
        <div className={'profile-page-container'}>
            <header>
                <InfoContainer>
                    <UserInfoContainer>
                        <h1>Ania Kubow</h1>
                        <p>handle <span>threads.net</span></p>
                    </UserInfoContainer>
                    <ImageContainer>
                        <img src={'https://scrimba.com/avatars/uid/uN32gmcm/64'} alt={'avatar image'}/>
                    </ImageContainer>
                </InfoContainer>
                <p>Bio</p>
                <SubInfoContainer>
                    <p style={{color: 'rgb(114, 114, 114)'}}>X followers ·<a href={''} target={'_blank'}>Link</a></p>
                </SubInfoContainer>
                <button className={'share-prf'}>Share profile</button>
                <Buttoncontainer>
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
                </Buttoncontainer>
            </header>
            <Feed></Feed>
        </div>
    )
}

export default Profile