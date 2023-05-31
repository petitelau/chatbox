const formEl = document.getElementById('submit-question');
const index = document.getElementById('input-db-index')
const namespace = document.getElementById('input-db-namespace')
const inputEL=document.querySelector('.question-box__input')
const msg = document.querySelector('.chatbox--loading-msg')
const chatbox = document.querySelector('.chatbox')
const model = "text-embedding-ada-002"

const ChatView = ()  => {

    const wsProgress = new WebSocket('ws://localhost:3501');
    let wsId = -1;

    wsProgress.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        console.log('WebSocket.onmessage : ' + JSON.stringify(data));
        if (data.type === 'id') {
            wsId = data.id;
            console.log(wsId);
        } else if (data.type === 'message') {

            msg.innerText = data.value;
            msg.style.display = "block";
            msg.style.opacity = "1";
            chatbox.scrollTo(0, chatbox.scrollHeight+ msg.style.height)
            console.log(msg.style.height)
        }
    });

    const fetchFn = ( callback) => {
        
        const val = {
            "question": inputEL.value,
            "idx": index.value,
            "model": model,
            "namespace": namespace.value,
            "wsId": wsId,
            "range": "50"
        }
        fetch('http://localhost:3500/testQuestion',
       // fetch('https://webcontent-demo.herokuapp.com/testQuestion',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Origin" : "http://127.0.0.1:5500"
                   // "Origin":"https://testchatbot-laura.web.app"
                },
                body: JSON.stringify(val)
            }
        ).then(response => response.json().then(data => callback(data)));
    }

    const addItem = (text)=>{
        const responseItem = document.createElement("LI")
        const responseItemTxt = document.createElement("SPAN")

        responseItem.appendChild(responseItemTxt);
        chatbox.appendChild(responseItem);

        Array.from(text).forEach( (l, idx) => {
           setTimeout(()=> responseItemTxt.textContent += l, 20*idx)
       })

    }

    const updateHtml = (data)=> {
        console.log(data)
        if (data.error) {
            return;
        }
        addItem(data.answer.answer)
        msg.style.display ="none"
        chatbox.scrollTo(0, chatbox.scrollHeight)
    }

    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        addItem(inputEL.value)
        fetchFn( (data) => updateHtml(data));
    });

}

ChatView()

