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
const Search = ({users})=>{

    const [input,setInput]=useState('')
    const handleChange=(e)=>{
        setInput(e.target.value)

    }

    return (
        <div className={'profile-page-container'}>
            <AuthContainerBox>
                    <form>
                        <input style={{backgroundColor:'#505050',border:'none',outline:'none'}} autoFocus={true} placeholder={'Search'} onChange={handleChange}/>
                    </form>
            </AuthContainerBox>
            <SearchContainer>
                {users.filter(user=>user.handle.toLocaleLowerCase().includes(input.toLocaleLowerCase())||user.username.toLocaleLowerCase().includes(input.toLocaleLowerCase())).map((user,index)=><ProfileContainer key={index}>
                    <Link to={`/users/${user.handle}`}>
                        <div style={{display:'flex',justifyContent:'space-between'}}>
                            <div style={{display:'flex'}}>
                                <div style={{display:'flex',alignItems:'center'}}>
                                    <Img><img src={user.img} alt={'avatar image'}/></Img>
                                </div>
                                <div>
                                    <p>{user.handle}</p>
                                    <p style={{color:'rgb(104,104,104)'}}>{user.username}</p>
                                </div>
                            </div>
                            <SubInfoContainer>
                                <button style={{width:'100%'}} className={'primary'}>{user.isfollowed?'Unfollow':'Follow'}</button>
                            </SubInfoContainer>
                        </div>
                    </Link>
                </ProfileContainer>)}
            </SearchContainer>
        </div>
    )
}

export default Search