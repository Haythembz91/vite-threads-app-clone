import {AuthContainerBox} from "../components/Auth.jsx";
import styled from "styled-components";
import {Img} from "../components/Thread.jsx";
import {Link} from "react-router-dom";
import {useState} from "react";
import {SubInfoContainer} from "./Profile.jsx";

const SearchContainer = styled.div`
`
const ProfileContainer=styled.div`
  padding: 10px;
  border-bottom: 0.5px solid rgb(104,104,104);
`
const Search = ({users,handle,getUsers})=>{

    const [input,setInput]=useState('')

    const handleFollow = async (e,user)=>{
        e.preventDefault()
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/${user.isfollowed?'unfollow':'follow'}`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({leader:user.handle,follower:handle,filter:'follow'})
            })
            if(response.status===200){
                getUsers()
            }
        }catch(error){
            console.error(error)
        }
    }

    return (
        <div className={'profile-page-container'}>
            <AuthContainerBox>
                    <form>
                        <input style={{backgroundColor:'#505050',border:'none',outline:'none'}} autoFocus={true} placeholder={'Search'} onChange={(e)=>setInput(e.target.value)}/>
                    </form>
            </AuthContainerBox>
            <SearchContainer>
                {users.filter(user=>user.handle.toLocaleLowerCase().includes(input.toLocaleLowerCase())||user.username.toLocaleLowerCase().includes(input.toLocaleLowerCase())).map((user,index)=><ProfileContainer key={index}>

                        <div style={{display:'flex',justifyContent:'space-between'}}>
                            <Link to={`/users/${user.handle}`}>
                            <div style={{display:'flex'}}>
                                <div style={{margin:'5px'}}>
                                    <Img><img src={user.img} alt={'avatar image'}/></Img>
                                </div>
                                <div>
                                    <p>{user.handle}</p>
                                    <p style={{color:'rgb(104,104,104)'}}>{user.username}</p>
                                    <p>{user.follower_count} followers ·</p>
                                </div>
                            </div>
                            </Link>
                            <SubInfoContainer>
                                {user.handle!==handle&&<button style={{width: '100%'}} className={'primary'}
                                         onClick={(e) => handleFollow(e, user)}>{user.isfollowed ? 'Unfollow' : 'Follow'}</button>
                                }</SubInfoContainer>
                        </div>
                </ProfileContainer>)}
            </SearchContainer>
        </div>
    )
}

export default Search