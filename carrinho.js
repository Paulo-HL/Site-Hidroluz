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
        
        listaItems.innerHTML = carrinho.map(item => {
            const pgto = document.querySelector('input[name="pgto"]:checked')?.value
            let precoUnitario = item.preco
            let temDesconto = false
            
            // Aplicar desconto para lâmpadas com 10+ unidades APENAS com PIX ou Dinheiro
            if (item.nome === "Lâmpada LED 50W" && item.quantidade >= 10 && (pgto === 'pix' || pgto === 'dinheiro')) {
                precoUnitario = 2.99
                temDesconto = true
            }
            
            const subtotal = precoUnitario * item.quantidade
            const descontoHTML = temDesconto ? '<span style="color: #10b981; font-size: 0.85rem; font-weight: 600;">🎉 Desconto PIX/Dinheiro!</span>' : ''
            
            return `
            <div class="carrinho-item">
                <div class="item-info">
                    <h3>${item.nome}</h3>
                    <p class="item-preco">R$ ${precoUnitario.toFixed(2).replace('.', ',')} ${descontoHTML}</p>
                </div>
                <div class="item-controls">
                    <div class="qty-control">
                        <button onclick="diminuir(${item.id})">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="aumentar(${item.id})">+</button>
                    </div>
                    <div class="item-total">R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
                    <button class="btn-remove" onclick="remover(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            `
        }).join('')
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
    const pgto = document.querySelector('input[name="pgto"]:checked')?.value
    let subtotalOriginal = 0
    let total = 0
    
    carrinho.forEach(item => {
        subtotalOriginal += item.preco * item.quantidade
        
        let precoUnitario = item.preco
        
        // Aplicar desconto para lâmpadas com 10+ unidades APENAS com PIX ou Dinheiro
        if (item.nome === "Lâmpada LED 50W" && item.quantidade >= 10 && (pgto === 'pix' || pgto === 'dinheiro')) {
            precoUnitario = 2.99
        }
        
        total += precoUnitario * item.quantidade
    })
    
    const desconto = subtotalOriginal - total
    const linhaDesconto = document.getElementById('linha-desconto')
    const valorDesconto = document.getElementById('valor-desconto')
    
    document.getElementById('subtotal').textContent = 'R$ ' + subtotalOriginal.toFixed(2).replace('.', ',')
    
    if (desconto > 0) {
        linhaDesconto.style.display = 'flex'
        valorDesconto.textContent = '- R$ ' + desconto.toFixed(2).replace('.', ',')
    } else {
        linhaDesconto.style.display = 'none'
    }
    
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
    const pgtoSelecionado = document.querySelector('input[name="pgto"]:checked')?.value
    const trocoSection = document.getElementById('troco-section')
    
    if (pgtoSelecionado === 'dinheiro') {
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
    const pgto = document.querySelector('input[name="pgto"]:checked')?.value
    
    if (!pgto) {
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
        const total = carrinho.reduce((sum, item) => {
            let precoUnitario = item.preco
            if (item.nome === "Lâmpada LED 50W" && item.quantidade >= 10 && pgto === 'dinheiro') {
                precoUnitario = 2.99
            }
            return sum + (precoUnitario * item.quantidade)
        }, 0)
        if (valorTroco < total) {
            alert('⚠️ Valor do troco menor que o total!')
            return
        }
    }
    
    salvarDados()
    
    // Gerar número do pedido
    const numeroPedido = '#' + Date.now().toString().slice(-6)
    const dataHora = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
    
    // Montar mensagem WhatsApp profissional
    let msg = ''
    msg += '*PEDIDO FINALIZADO - HIDROLUZ* \n\n'
    msg += `_Pedido ${numeroPedido}_\n`
    msg += `_${dataHora}_\n`
    msg += `_Itapetininga-SP_\n\n`
    
    msg += ' *PRODUTOS SOLICITADOS:*\n'
    msg += '━━━━━━━━━━━━━━━━━\n'
    
    let subtotalOriginal = 0
    let total = 0
    carrinho.forEach((item, i) => {
        let precoUnitario = item.preco
        subtotalOriginal += item.preco * item.quantidade
        
        // Aplicar desconto para lâmpadas com 10+ unidades APENAS com PIX ou Dinheiro
        if (item.nome === "Lâmpada LED 50W" && item.quantidade >= 10 && (pgto === 'pix' || pgto === 'dinheiro')) {
            precoUnitario = 2.99
        }
        
        const subtotal = precoUnitario * item.quantidade
        total += subtotal
        msg += `${i+1}. ${item.nome}\n`
        msg += `    R$ ${precoUnitario.toFixed(2).replace('.', ',')} x ${item.quantidade}\n`
        msg += `   Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`
    })
    
    const desconto = subtotalOriginal - total
    if (desconto > 0) {
        msg += `Subtotal original: R$ ${subtotalOriginal.toFixed(2).replace('.', ',')}\n`
        msg += `🎉 Desconto aplicado: -R$ ${desconto.toFixed(2).replace('.', ',')}\n\n`
    }
    
    msg += '━━━━━━━━━━━━━━━━━\n'
    msg += `* TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`
    msg += '━━━━━━━━━━━━━━━━━\n\n'
    
    if (tipo === 'retirada') {
        msg += ' *RETIRADA NA LOJA*\n\n'
        msg += ` Nome: ${document.getElementById('nome-ret').value}\n`
        msg += ` Telefone: ${document.getElementById('tel-ret').value}\n\n`
        msg += ' *Endereço da Loja:*\n'
        msg += ' Hidroluz - Itapetininga-SP\n'
        msg += ' Horário: Segunda a Sexta, 8h às 17:59\n\n'
    } else {
        msg += ' *ENTREGA NO ENDEREÇO...*\n\n'
        msg += ` Endereço: ${document.getElementById('endereco').value}, ${document.getElementById('numero').value}\n`
        msg += ` CEP: ${document.getElementById('cep').value}\n`
        msg += ` Vila: ${document.getElementById('bairro').value}\n`
        msg += ` Cidade: Itapetininga-SP\n\n`
        msg += ` Nome: ${document.getElementById('nome-ent').value}\n`
        msg += ` Telefone: ${document.getElementById('tel-ent').value}\n`
        
    }
    
    const pgtoLabels = {
        dinheiro: ' Dinheiro', 
        pix: ' PIX', 
        debito: ' Débito', 
        credito: ' Crédito'
    }
    msg += ` *Pagamento:* ${pgtoLabels[pgto]}\n`
    
    if (valorTroco) {
        const troco = valorTroco - total
        msg += ` Troco para: R$ ${valorTroco.toFixed(2).replace('.', ',')}\n`
        msg += ` Troco: R$ ${troco.toFixed(2).replace('.', ',')}\n`
    }
    
    const obs = document.getElementById('observacoes')?.value.trim()
    if (obs) {
        msg += `\n *Observações:*\n${obs}\n`
    }
    
    msg += '\n━━━━━━━━━━━━━━━━━\n'
    msg += 'Aguardamos sua confirmação! \n\n'
    msg += ' Em caso de dúvidas, estamos à disposição.\n'
    msg += 'Hidroluz - Qualidade e confiança!'
    
    const url = `https://wa.me/5515996639799?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    
    alert(' Pedido enviado! Redirecionando...')
    carrinho = []
    salvar()
    
    setTimeout(() => {
        window.location.href = 'index.html'
    }, 1500)
}
