import Feed from './../components/Feed.jsx'
import Loader from './../components/Loader.jsx'
import {Link} from "react-router-dom";
import {Img} from "../components/Thread.jsx";



const Home = ({user,users,threads,getThreads,showLoader,setShowModal})=>{

    return (
        <div className={'profile-page-container'}>
            {user&&<div className={'PostContainer'} style={{display: 'flex', justifyContent: 'space-between',cursor:'pointer',borderBottom:'0.5px solid rgb(104,104,104)'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div>
                        <Link to={`/users/${user.handle}`}>
                            <Img><img src={user.img} alt={'avatar image'}/></Img>
                        </Link>
                    </div>
                    <div onClick={()=>setShowModal(true)} style={{width:'100%'}}>
                        <p style={{color: 'rgb(104,104,104)',width:'100%'}}>Start a thread...</p>
                    </div>
                </div>
                <div onClick={()=>setShowModal(true)} style={{display: 'flex', justifyContent: 'right'}}>
                    <button className={'primary'}>Post</button>
                </div>
            </div>}
            {showLoader&&<Loader></Loader>}
            <Feed getThreads={getThreads} users={users} threads={threads.filter(thread=>thread.reply_to===null)}></Feed>
        </div>

    )
}

export default Home