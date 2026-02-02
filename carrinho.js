// Carregar carrinho do localStorage
let carrinho = JSON.parse(localStorage.getItem('hidroluzCarrinho')) || []

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    renderCarrinho()
    carregarDados()
})

function renderCarrinho() {
    const vazio = document.getElementById('carrinho-vazio')
    const comItens = document.getElementById('carrinho-com-itens')
    const listaItems = document.getElementById('lista-items')
    
    if (carrinho.length === 0) {
        vazio.style.display = 'flex'
        comItens.style.display = 'none'
    } else {
        vazio.style.display = 'none'
        comItens.style.display = 'grid'
        
        listaItems.innerHTML = carrinho.map(item => `
            <div class="carrinho-item">
                <div class="item-info">
                    <h3>${item.nome}</h3>
                    <p class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="item-controls">
                    <div class="qty-control">
                        <button onclick="diminuir(${item.id})">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="aumentar(${item.id})">+</button>
                    </div>
                    <div class="item-total">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</div>
                    <button class="btn-remove" onclick="remover(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('')
    }
    
    atualizarResumo()
}

function aumentar(id) {
    const item = carrinho.find(p => p.id === id)
    if (item) {
        item.quantidade++
        salvar()
        renderCarrinho()
    }
}

function diminuir(id) {
    const item = carrinho.find(p => p.id === id)
    if (item && item.quantidade > 1) {
        item.quantidade--
        salvar()
        renderCarrinho()
    }
}

function remover(id) {
    if (confirm('Remover este item?')) {
        carrinho = carrinho.filter(item => item.id !== id)
        salvar()
        renderCarrinho()
    }
}

function atualizarResumo() {
    let total = 0
    carrinho.forEach(item => {
        total += item.preco * item.quantidade
    })
    
    document.getElementById('subtotal').textContent = 'R$ ' + total.toFixed(2).replace('.', ',')
    document.getElementById('total').textContent = 'R$ ' + total.toFixed(2).replace('.', ',')
}

function salvar() {
    localStorage.setItem('hidroluzCarrinho', JSON.stringify(carrinho))
}

function toggleEntrega() {
    const tipo = document.querySelector('input[name="entrega"]:checked')?.value
    const camposRet = document.getElementById('campos-retirada')
    const camposEnt = document.getElementById('campos-entrega')
    
    if (tipo === 'entrega') {
        camposRet.style.display = 'none'
        camposEnt.style.display = 'block'
    } else {
        camposRet.style.display = 'block'
        camposEnt.style.display = 'none'
    }
}

function toggleTroco() {
    const dinheiroChecked = document.querySelector('input[name="pgto"][value="dinheiro"]').checked
    const trocoSection = document.getElementById('troco-section')
    
    if (dinheiroChecked) {
        trocoSection.style.display = 'block'
    } else {
        trocoSection.style.display = 'none'
        document.getElementById('precisa-troco').checked = false
        toggleValorTroco()
    }
}

function toggleValorTroco() {
    const precisaTroco = document.getElementById('precisa-troco').checked
    const valorTroco = document.getElementById('valor-troco')
    valorTroco.style.display = precisaTroco ? 'block' : 'none'
}

function carregarDados() {
    const dados = localStorage.getItem('hidroluzDados')
    if (dados) {
        const obj = JSON.parse(dados)
        if (obj.nomeRet) document.getElementById('nome-ret').value = obj.nomeRet
        if (obj.telRet) document.getElementById('tel-ret').value = obj.telRet
        if (obj.nomeEnt) document.getElementById('nome-ent').value = obj.nomeEnt
        if (obj.telEnt) document.getElementById('tel-ent').value = obj.telEnt
        if (obj.endereco) document.getElementById('endereco').value = obj.endereco
        if (obj.numero) document.getElementById('numero').value = obj.numero
        if (obj.cep) document.getElementById('cep').value = obj.cep
        if (obj.bairro) document.getElementById('bairro').value = obj.bairro
    }
}

function salvarDados() {
    const dados = {
        nomeRet: document.getElementById('nome-ret').value,
        telRet: document.getElementById('tel-ret').value,
        nomeEnt: document.getElementById('nome-ent').value,
        telEnt: document.getElementById('tel-ent').value,
        endereco: document.getElementById('endereco').value,
        numero: document.getElementById('numero').value,
        cep: document.getElementById('cep').value,
        bairro: document.getElementById('bairro').value
    }
    localStorage.setItem('hidroluzDados', JSON.stringify(dados))
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('⚠️ Carrinho vazio!')
        return
    }
    
    const tipo = document.querySelector('input[name="entrega"]:checked')?.value
    const pgtos = Array.from(document.querySelectorAll('input[name="pgto"]:checked')).map(el => el.value)
    
    if (pgtos.length === 0) {
        alert('⚠️ Selecione uma forma de pagamento!')
        return
    }
    
    // Validar campos
    if (tipo === 'retirada') {
        const nome = document.getElementById('nome-ret').value.trim()
        const tel = document.getElementById('tel-ret').value.trim()
        if (!nome || !tel) {
            alert('⚠️ Preencha nome e telefone!')
            return
        }
    } else {
        const nome = document.getElementById('nome-ent').value.trim()
        const tel = document.getElementById('tel-ent').value.trim()
        const endereco = document.getElementById('endereco').value.trim()
        const numero = document.getElementById('numero').value.trim()
        const cep = document.getElementById('cep').value.trim()
        const bairro = document.getElementById('bairro').value.trim()
        
        if (!nome || !tel || !endereco || !numero || !cep || !bairro) {
            alert('⚠️ Preencha todos os campos!')
            return
        }
    }
    
    // Validar troco
    let valorTroco = null
    if (document.getElementById('precisa-troco')?.checked) {
        valorTroco = parseFloat(document.getElementById('valor-troco').value)
        if (!valorTroco || valorTroco <= 0) {
            alert('⚠️ Digite o valor para o troco!')
            return
        }
        const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
        if (valorTroco < total) {
            alert('⚠️ Valor do troco menor que o total!')
            return
        }
    }
    
    salvarDados()
    
    // Montar mensagem WhatsApp
    let msg = '*📦 PEDIDO - HIDROLUZ*\\n\\n'
    msg += '*PRODUTOS:*\\n'
    msg += '━━━━━━━━━━━━━━\\n'
    
    let total = 0
    carrinho.forEach((item, i) => {
        const subtotal = item.preco * item.quantidade
        total += subtotal
        msg += `${i+1}. ${item.nome}\\n`
        msg += `   R$ ${item.preco.toFixed(2)} x ${item.quantidade}\\n`
        msg += `   Subtotal: R$ ${subtotal.toFixed(2)}\\n\\n`
    })
    
    msg += '━━━━━━━━━━━━━━\\n'
    msg += `*TOTAL: R$ ${total.toFixed(2)}*\\n\\n`
    
    if (tipo === 'retirada') {
        msg += '*👤 RETIRADA NA LOJA*\\n'
        msg += `Nome: ${document.getElementById('nome-ret').value}\\n`
        msg += `Tel: ${document.getElementById('tel-ret').value}\\n\\n`
    } else {
        msg += '*👤 ENTREGA*\\n'
        msg += `Nome: ${document.getElementById('nome-ent').value}\\n`
        msg += `Tel: ${document.getElementById('tel-ent').value}\\n`
        msg += `End: ${document.getElementById('endereco').value}, ${document.getElementById('numero').value}\\n`
        msg += `CEP: ${document.getElementById('cep').value}\\n`
        msg += `Bairro: ${document.getElementById('bairro').value}\\n\\n`
    }
    
    const pgtoLabels = {dinheiro: 'Dinheiro', pix: 'PIX', debito: 'Débito', credito: 'Crédito'}
    msg += `💳 *Pagamento:* ${pgtos.map(p => pgtoLabels[p]).join(', ')}\\n`
    
    if (valorTroco) {
        msg += `💰 *Troco para:* R$ ${valorTroco.toFixed(2)}\\n`
    }
    
    msg += '\\nAguardo confirmação! 😊'
    
    const url = `https://wa.me/5515996639799?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    
    alert('✅ Pedido enviado! Redirecionando...')
    carrinho = []
    salvar()
    
    setTimeout(() => {
        window.location.href = 'index.html'
    }, 1500)
}
