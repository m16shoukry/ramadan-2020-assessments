function getSingleVidReq(vidInfo) {
    const vidReqContainerElm = document.createElement('div')
    vidReqContainerElm.innerHTML = `
    <div class="card mb-3">
    <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
            <h3>${vidInfo.topic_title}</h3>
              <p class="text-muted mb-2">${vidInfo.topic_details}</p>
              <p class="mb-0 text-muted">
              ${
                 vidInfo.expected_result && 
                 `<strong>Expected results:</strong> ${vidInfo.expected_result}`
                }
              </p>
            </div>
            <div class="d-flex flex-column text-center">
              <a class="btn btn-link" id="votes_ups_${vidInfo._id}">🔺</a>
              <h3 id="score_vote_${vidInfo._id}">${ vidInfo.votes.up - vidInfo.votes.downs }</h3>
              <a class="btn btn-link" id="votes_downs_${vidInfo._id}">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${vidInfo.status.toUpperCase()}</span>
              &bullet; added by <strong>${vidInfo.author_name}</strong> on
              <strong>${new Date(vidInfo.submit_date).toLocaleDateString()}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
                ${vidInfo.target_level}
              </div>
            </div>
          </div>
        </div>`
        return vidReqContainerElm;
}


document.addEventListener('DOMContentLoaded', function() {

    const formVidReqElm = document.getElementById('formVideoRequest')
    const listOfVidsElm = document.getElementById('listOfRequests')

    


    //task1 for submission 
    formVidReqElm.addEventListener('submit', (e) => {
        e.preventDefault()
        
        fetch('http://localhost:7777/video-request', {
            method: 'POST',
            body: JSON.stringify({  
                //to send in jsonformat OR u can use FormData() *browser API for manipulate and map var with data* & use multer()
                author_name: formVidReqElm.author_name.value,
                author_email: formVidReqElm.author_email.value,
                topic_title: formVidReqElm.topic_title.value,
                topic_details: formVidReqElm.topic_details.value,
                expected_result: formVidReqElm.expected_result.value,
                target_level: formVidReqElm.target_level.value
            }),
        })//fetch return a promise
        .then((bold) => bold.json())
        .then((data) => { console.log(data) })
    })

    //task 2 render list when create a new video
    fetch('http://localhost:7777/video-request')
    .then((bold) => bold.json())
    .then((data) => {
        data.forEach((vidInfo)=> {
            listOfVidsElm.appendChild(getSingleVidReq(vidInfo))
            
            //task3 votes ups&downs&score
            const voteUpsElm = document.getElementById(`votes_ups_${vidInfo._id}`)
            const voteDownsElm = document.getElementById(`votes_downs_${vidInfo._id}`)
            const scoreVoteElm = document.getElementById(`score_vote_${vidInfo._id}`)

            voteUpsElm.addEventListener('click', (e) => {
              fetch('http://localhost:7777/video-request/vote', {
                method: 'PUT',
                headers: { 'content-Type': 'application/json'},
                body: JSON.stringify({ id: vidInfo._id, vote_type: 'ups'}), 
              })
              .then((bold) => bold.json())
              .then((data) => {
                scoreVoteElm.innerText = data.ups - data.downs
              })
            })

            voteDownsElm.addEventListener('click', (e) => {
              fetch('http://localhost:7777/video-request/vote', {
                method: 'PUT',
                headers: { 'content-Type': 'application/json'},
                body: JSON.stringify({ id: vidInfo._id, vote_type: 'downs'}), 
              })
              .then((bold) => bold.json())
              .then((data) => {
                scoreVoteElm.innerText = data.ups - data.downs
              })
            })
        })
    })
})