import styled from "styled-components";

const UserInfoContainer = styled.div`
  font-family: 'arial','sans-serif';
  span{
    background-color: rgb(59,59,59);
    color: rgb(114,114,114);
    font-size:13px;
    padding: 3px 6px;
    border-radius: 20px;
    
  }
`
const InfoContainer = styled.div``
const ImageContainer = styled.div`
  width: 50px;
  height: 50px;
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
const Buttoncontainer = styled.div``



const Profile = ()=>{
    return(
        <header>
            <InfoContainer>
                <UserInfoContainer>
                    <h1>Username</h1>
                    <p>handle <span>threads.net</span></p>
                </UserInfoContainer>
                <ImageContainer>
                    <img src={'https://simp6.host.church/images3/photo_2024-03-02_09-26-106091398e5982f353.jpg'} alt={'avatar image'}/>
                </ImageContainer>
            </InfoContainer>
            <p>Bio</p>
            <SubInfoContainer>
                <p className={'sub-text'}>X followers ·<a href={''} target={'_blank'}>Link</a></p>
            </SubInfoContainer>
            <button>Share profile</button>
            <Buttoncontainer>
                <button>Threads</button>
                <button>Replies</button>
            </Buttoncontainer>
        </header>
    )
}

export default Profile