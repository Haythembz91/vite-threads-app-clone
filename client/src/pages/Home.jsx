import Feed from './../components/Feed.jsx'




const Home = ({users,threads})=>{





    return (
        <div className={'profile-page-container'}>
            <Feed users={users} threads={threads}></Feed>
        </div>

    )
}

export default Home