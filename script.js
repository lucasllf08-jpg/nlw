//AIzaSyADisOuDhopFa5p-ES66QtCIOixAxJTVK0
//AIzaSyCxa2a2Lkpm3ept-iE43PTw8SltNkM2Rwc
const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = text => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async (question, game, apiKey) => {
    const model = "gemini-3-flash-preview"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
    ## Especialidade  
    Você é um assistente de mate para o jogo ${game}

    ## Tarefa  
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas.

    ## Regras  
    - Se você não souber a resposta, responda com "Não sei" e não tente inventar respostas.  
    - Se a pergunta não estiver relacionada ao jogo, responda com "Essa pergunta não está relacionada ao jogo selecionado".  
    - Considere a data atual: ${new Date().toLocaleDateString()}  
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.  
    - Nunca responda itens que você não tem certeza que funcionam na atualidade.

    # Resposta  
    - Economize na resposta, seja direto.  
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda aquilo que o usuário deseja.
    Aqui está a pergunta do usuário: ${question}
    
    
    `
    const contents = [{
        parts: [{
            text: pergunta
        }]
    }]

    //chamada api
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
    event.preventDefault()


    console.log(event)
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    console.log({ apiKey, game, question })

    if (apiKey == '' || game == '' || question == '') {
        alert('Por favor preencha todos os campos')
        return
    }
    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try {
        const text = await perguntarAI(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')
    } catch (error) {
        console.log('Erro:', error)
    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}
form.addEventListener('submit', enviarFormulario)