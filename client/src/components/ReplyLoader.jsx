

const ReplyLoader = ({showPosting,showPosted,showDeleting,showDeleted,showSaved,showSaving,showUnsaved,showUnsaving})=>{

    return (
        <div className={'replyLoader'}>
            {(showPosting||showSaving||showDeleting||showUnsaving)&&<div id={'posting'}>
                <div className={'repldr'}></div>
                {showPosting?'Posting...':showSaving?'Saving...':showUnsaving?'Unsaving...':'Deleting...'}
            </div>}
            {(showPosted||showSaved||showDeleted||showUnsaved)&&<div id={'posted'}>
                <svg style={{fill: 'rgb(114,114,114)'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24">
                    <path d="M0 11.522l1.578-1.626 7.734 4.619 13.335-12.526 1.353 1.354-14 18.646z"/>
                </svg>
                {showPosted?'Posted!':showSaved?'Saved!':showUnsaved?'Unsaved!':'Deleted!'}
            </div>}
        </div>
    )
}

export default ReplyLoader