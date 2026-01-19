// Banner Automático
let currentSlideIndex = 0
let autoSlideInterval

function showSlide(index) {
  const slides = document.querySelectorAll(".banner-slide")
  const dots = document.querySelectorAll(".dot")

  // Remove active class de todos
  slides.forEach((slide) => slide.classList.remove("active"))
  dots.forEach((dot) => dot.classList.remove("active"))

  // Ajusta o índice se estiver fora dos limites
  if (index >= slides.length) {
    currentSlideIndex = 0
  } else if (index < 0) {
    currentSlideIndex = slides.length - 1
  } else {
    currentSlideIndex = index
  }

  // Ativa o slide e dot atual
  slides[currentSlideIndex].classList.add("active")
  dots[currentSlideIndex].classList.add("active")
}

function nextSlide() {
  showSlide(currentSlideIndex + 1)
  resetAutoSlide()
}

function prevSlide() {
  showSlide(currentSlideIndex - 1)
  resetAutoSlide()
}

function currentSlide(index) {
  showSlide(index)
  resetAutoSlide()
}

function autoSlide() {
  autoSlideInterval = setInterval(() => {
    nextSlide()
  }, 5000) // Muda a cada 5 segundos
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval)
  autoSlide()
}

// Inicia o banner automático quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  showSlide(0)
  autoSlide()
})

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Animação de entrada dos cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Adiciona animação de entrada aos cards
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card, .loja-card, .produto-card")
  cards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })
})

// ===== Funcionalidades de Produtos =====

// Array para armazenar múltiplos produtos
let carrinho = []
let produtoAtual = {
  nome: "",
  preco: 0,
  quantidade: 1
}

// Carregar dados salvos ao iniciar
document.addEventListener("DOMContentLoaded", () => {
  carregarDadosSalvos()
  atualizarResumo()
  
  const sliderPreco = document.querySelector(".filtro-preco")
  const valorPreco = document.querySelector("#preco-valor")
  
  if (sliderPreco) {
    sliderPreco.addEventListener("input", (e) => {
      const valor = parseInt(e.target.value)
      valorPreco.textContent = valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).replace("R$", "").trim()
    })
  }
})

// Função para adicionar o produto atual ao carrinho
function adicionarProdutoAtual() {
  if (produtoAtual.nome === "") {
    alert("⚠️ Selecione um produto primeiro!")
    return
  }

  const quantidade = parseInt(document.getElementById("carrinho-quantidade").value)
  
  // Verificar se produto já existe
  const indice = carrinho.findIndex(p => p.nome === produtoAtual.nome)
  
  if (indice !== -1) {
    carrinho[indice].quantidade += quantidade
  } else {
    carrinho.push({
      nome: produtoAtual.nome,
      preco: produtoAtual.preco,
      quantidade: quantidade,
      id: Date.now()
    })
  }
  
  atualizarVisualizacaoCarrinho()
  alert(`✅ "${produtoAtual.nome}" adicionado ao carrinho!`)
  
  // Resetar quantidade
  document.getElementById("carrinho-quantidade").value = 1
}

// Função para adicionar ao carrinho (chamada pelos botões dos produtos)
function adicionarAoCarrinho(nome, preco) {
  produtoAtual.nome = nome
  produtoAtual.preco = preco
  produtoAtual.quantidade = 1
  
  // Atualizar exibição do produto atual
  document.getElementById("carrinho-nome").textContent = nome
  document.getElementById("carrinho-preco").textContent = "R$ " + preco.toLocaleString("pt-BR", {minimumFractionDigits: 2})
  document.getElementById("carrinho-quantidade").value = 1
  
  abrirCarrinho()
}

function atualizarVisualizacaoCarrinho() {
  const listaDiv = document.getElementById("lista-carrinho-produtos")
  const produtosLista = document.getElementById("produtos-lista")
  
  // Atualizar sidebar
  const sidebarLista = document.getElementById("sidebar-lista-produtos")
  const badgeCarrinho = document.getElementById("badge-carrinho")
  
  // Contar total de produtos
  const totalProdutos = carrinho.reduce((sum, item) => sum + item.quantidade, 0)
  badgeCarrinho.textContent = totalProdutos
  
  if (carrinho.length === 0) {
    listaDiv.style.display = "none"
    produtosLista.innerHTML = ""
    sidebarLista.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem 0;">Nenhum produto adicionado</p>'
  } else {
    listaDiv.style.display = "block"
    const itemsHTML = carrinho.map((item, idx) => `
      <div style="border-bottom: 1px solid #d1d5db; padding: 0.8rem 0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${item.nome}</strong><br>
          <span style="font-size: 0.85rem; color: #666;">Qtd: ${item.quantidade} x R$ ${item.preco.toLocaleString("pt-BR", {minimumFractionDigits: 2})}</span>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold; color: var(--amarelo-medio); margin-bottom: 0.5rem;">R$ ${(item.preco * item.quantidade).toLocaleString("pt-BR", {minimumFractionDigits: 2})}</div>
          <button onclick="removerDoCarrinho(${item.id})" style="background: #ef4444; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer;">Remover</button>
        </div>
      </div>
    `).join("")
    produtosLista.innerHTML = itemsHTML
    
    // Atualizar sidebar
    sidebarLista.innerHTML = carrinho.map((item) => `
      <div class="sidebar-item">
        <div class="sidebar-item-info">
          <div class="sidebar-item-nome">${item.nome}</div>
          <div class="sidebar-item-detalhes">Qtd: ${item.quantidade}</div>
        </div>
        <div class="sidebar-item-preco">R$ ${(item.preco * item.quantidade).toLocaleString("pt-BR", {minimumFractionDigits: 2})}</div>
      </div>
    `).join("")
  }
  
  atualizarResumo()
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(item => item.id !== id)
  atualizarVisualizacaoCarrinho()
}

function limparCarrinho() {
  if (confirm("⚠️ Deseja realmente limpar o carrinho?")) {
    carrinho = []
    atualizarVisualizacaoCarrinho()
    fecharSidebar()
  }
}

function abrirCarrinho() {
  document.getElementById("modal-carrinho").classList.add("ativo")
  document.body.style.overflow = "hidden"
  fecharSidebar()
}

function fecharCarrinho() {
  document.getElementById("modal-carrinho").classList.remove("ativo")
  document.body.style.overflow = "auto"
}

function abrirSidebar() {
  document.querySelector(".sidebar-carrinho").classList.add("ativo")
  document.querySelector(".sidebar-overlay").classList.add("ativo")
}

function fecharSidebar() {
  document.querySelector(".sidebar-carrinho").classList.remove("ativo")
  document.querySelector(".sidebar-overlay").classList.remove("ativo")
}

function continuarComprando() {
  fecharCarrinho()
}

function aumentarQuantidade() {
  const input = document.getElementById("carrinho-quantidade")
  input.value = parseInt(input.value) + 1
}

function diminuirQuantidade() {
  const input = document.getElementById("carrinho-quantidade")
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1
  }
}

function atualizarResumo() {
  let total = 0
  
  carrinho.forEach(item => {
    let precoUnitario = item.preco
    if (item.nome === "Lâmpada LED 50W" && item.quantidade >= 10) {
      precoUnitario = 2.99
    }
    total += precoUnitario * item.quantidade
  })
  
  document.getElementById("resumo-subtotal").textContent = 
    "R$ " + total.toLocaleString("pt-BR", {minimumFractionDigits: 2})
  document.getElementById("resumo-total").textContent = 
    "R$ " + total.toLocaleString("pt-BR", {minimumFractionDigits: 2})
}

// Armazenar dados
function salvarDados() {
  const entrega = document.querySelector('input[name="entrega-carrinho"]:checked')?.value || "retirada"
  const dados = {
    nomeRetirada: document.getElementById("campo-nome-retirada").value,
    telefoneRetirada: document.getElementById("campo-telefone-retirada").value,
    nomeEntrega: document.getElementById("campo-nome-entrega").value,
    telefoneEntrega: document.getElementById("campo-telefone-entrega").value,
    endereco: document.getElementById("campo-endereco").value,
    numero: document.getElementById("campo-numero").value,
    cep: document.getElementById("campo-cep").value,
    vila: document.getElementById("campo-vila").value,
    entrega: entrega
  }
  localStorage.setItem("hidroluzDados", JSON.stringify(dados))
}

// Carregar dados salvos
function carregarDadosSalvos() {
  const dados = localStorage.getItem("hidroluzDados")
  if (dados) {
    const obj = JSON.parse(dados)
    document.getElementById("campo-nome-retirada").value = obj.nomeRetirada || ""
    document.getElementById("campo-telefone-retirada").value = obj.telefoneRetirada || ""
    document.getElementById("campo-nome-entrega").value = obj.nomeEntrega || ""
    document.getElementById("campo-telefone-entrega").value = obj.telefoneEntrega || ""
    document.getElementById("campo-endereco").value = obj.endereco || ""
    document.getElementById("campo-numero").value = obj.numero || ""
    document.getElementById("campo-cep").value = obj.cep || "18206600"
    document.getElementById("campo-vila").value = obj.vila || ""
    
    if (obj.entrega) {
      document.querySelector(`input[name="entrega-carrinho"][value="${obj.entrega}"]`).checked = true
      mostrarCamposEndereco()
    }
  }
}

function finalizarCompra() {
  // Validar se há produtos
  if (carrinho.length === 0) {
    alert("⚠️ Seu carrinho está vazio! Adicione produtos antes de finalizar.")
    return
  }

  const entrega = document.querySelector('input[name="entrega-carrinho"]:checked')?.value || "retirada"
  const pagamentoSelecionado = document.querySelector('input[name="pagamento-carrinho"]:checked')?.value
  const trocoSelecionado = document.getElementById("checkbox-troco").checked
  
  // Pagamentos selecionados
  const pagamentos = []
  if (pagamentoSelecionado) {
    pagamentos.push(pagamentoSelecionado)
  }
  if (trocoSelecionado) {
    pagamentos.push("troco")
  }
  
  if (pagamentos.length === 0) {
    alert("⚠️ Por favor, selecione pelo menos uma forma de pagamento!")
    return
  }
  
  // Calcular total
  let totalCompra = 0
  carrinho.forEach(item => {
    let precoUnitario = item.preco
    if (item.nome === "Lâmpada LED 50W" && item.quantidade >= 10) {
      precoUnitario = 2.99
    }
    totalCompra += precoUnitario * item.quantidade
  })
  
  // Validar troco
  let valorTroco = null
  if (pagamentos.includes("troco")) {
    valorTroco = document.getElementById("valor-troco").value.trim()
    if (!valorTroco) {
      alert("⚠️ Por favor, digite o valor do troco!")
      return
    }
    valorTroco = parseFloat(valorTroco)
    if (isNaN(valorTroco) || valorTroco <= 0) {
      alert("⚠️ Digite um valor válido para o troco!")
      return
    }
    
    if (valorTroco < totalCompra) {
      alert(`⚠️ ERRO! O valor do dinheiro (R$ ${valorTroco.toLocaleString("pt-BR", {minimumFractionDigits: 2})}) é menor que o total da compra (R$ ${totalCompra.toLocaleString("pt-BR", {minimumFractionDigits: 2})})!`)
      return
    }
  }
  
  // Validar campos de retirada
  if (entrega === "retirada") {
    const nomeRetirada = document.getElementById("campo-nome-retirada").value.trim()
    const telefoneRetirada = document.getElementById("campo-telefone-retirada").value.trim()
    
    if (!nomeRetirada || !telefoneRetirada) {
      alert("⚠️ Por favor, preencha Nome e Telefone para retirada!")
      return
    }
  }
  
  // Validar campos de entrega
  if (entrega === "entrega") {
    const nomeEntrega = document.getElementById("campo-nome-entrega").value.trim()
    const telefoneEntrega = document.getElementById("campo-telefone-entrega").value.trim()
    const endereco = document.getElementById("campo-endereco").value.trim()
    const numero = document.getElementById("campo-numero").value.trim()
    const cep = document.getElementById("campo-cep").value.trim()
    const vila = document.getElementById("campo-vila").value.trim()
    
    if (!nomeEntrega || !telefoneEntrega || !endereco || !numero || !cep || !vila) {
      alert("⚠️ Por favor, preencha todos os campos obrigatórios!")
      return
    }
    
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
      alert("⚠️ CEP inválido! Use o formato: 00000-000")
      return
    }
  }
  
  // Salvar dados para próxima compra
  salvarDados()
  
  const entregaTexto = {
    retirada: "Retirada na loja",
    entrega: "Entrega em casa"
  }[entrega]
  
  const pagamentosTexto = pagamentos.map(p => {
    const labels = {
      dinheiro: "Dinheiro",
      troco: "Com Troco",
      debito: "Débito",
      credito: "Crédito",
      pix: "Pix"
    }
    return labels[p]
  }).join(", ")
  
  fecharCarrinho()
  
  // Montar mensagem WhatsApp
  let textoWhatsApp = `*📦 PEDIDO FINALIZADO - HIDROLUZ* 🛒\n\n`
  textoWhatsApp += `*PRODUTOS SOLICITADOS:*\n`
  textoWhatsApp += `━━━━━━━━━━━━━━━━━━━━\n`
  
  carrinho.forEach((item, index) => {
    let precoUnitario = item.preco
    if (item.nome === "Lâmpada LED 50W" && item.quantidade >= 10) {
      precoUnitario = 2.99
    }
    const subtotalItem = precoUnitario * item.quantidade
    
    textoWhatsApp += `${index + 1}. ${item.nome}\n`
    textoWhatsApp += `   💰 R$ ${item.preco.toLocaleString("pt-BR", {minimumFractionDigits: 2})} x ${item.quantidade}\n`
    textoWhatsApp += `   Subtotal: R$ ${subtotalItem.toLocaleString("pt-BR", {minimumFractionDigits: 2})}\n\n`
  })
  
  textoWhatsApp += `━━━━━━━━━━━━━━━━━━━━\n`
  textoWhatsApp += `*TOTAL: R$ ${totalCompra.toLocaleString("pt-BR", {minimumFractionDigits: 2})}*\n\n`
  
  // Dados de entrega/retirada
  if (entrega === "retirada") {
    const nomeRetirada = document.getElementById("campo-nome-retirada").value
    const telefoneRetirada = document.getElementById("campo-telefone-retirada").value
    
    textoWhatsApp += `*👤 RETIRADA NA LOJA*\n`
    textoWhatsApp += `Nome: ${nomeRetirada}\n`
    textoWhatsApp += `Telefone: ${telefoneRetirada}\n\n`
  } else {
    const nomeEntrega = document.getElementById("campo-nome-entrega").value
    const telefoneEntrega = document.getElementById("campo-telefone-entrega").value
    const endereco = document.getElementById("campo-endereco").value
    const numero = document.getElementById("campo-numero").value
    const cep = document.getElementById("campo-cep").value
    const vila = document.getElementById("campo-vila").value
    
    textoWhatsApp += `*👤 ENTREGA EM CASA*\n`
    textoWhatsApp += `Nome: ${nomeEntrega}\n`
    textoWhatsApp += `Telefone: ${telefoneEntrega}\n`
    textoWhatsApp += `Endereço: ${endereco}, ${numero}\n`
    textoWhatsApp += `CEP: ${cep}\n`
    if (vila) {
      textoWhatsApp += `Vila: ${vila}\n`
    }
    textoWhatsApp += `\n`
  }
  
  // Troco
  if (valorTroco !== null) {
    textoWhatsApp += `💰 *Troco para: R$ ${valorTroco.toLocaleString("pt-BR", {minimumFractionDigits: 2})}*\n\n`
  }
  
  textoWhatsApp += `💳 *Pagamento:* ${pagamentosTexto}\n\n`
  textoWhatsApp += `Aguardamos sua confirmação! 😊`
  
  alert(`✅ PEDIDO FINALIZADO!\n\nTotal: R$ ${totalCompra.toLocaleString("pt-BR", {minimumFractionDigits: 2})}\n\nSendo redirecionado para o WhatsApp...`)
  
  // Enviar para WhatsApp
  const telefone = "5515996639799"
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(textoWhatsApp)}`
  window.open(url, "_blank")
  
  // Limpar carrinho
  carrinho = []
  atualizarVisualizacaoCarrinho()
}

// Mostrar/ocultar campos de endereço
function mostrarCamposEndereco() {
  const entrega = document.querySelector('input[name="entrega-carrinho"]:checked')?.value
  const camposEndereco = document.getElementById("endereco-campos")
  const camposRetirada = document.getElementById("retirada-campos")
  
  if (entrega === "entrega") {
    camposEndereco.style.display = "block"
    camposRetirada.style.display = "none"
  } else {
    camposEndereco.style.display = "none"
    camposRetirada.style.display = "block"
  }
}

// Mostrar/ocultar opção de troco quando dinheiro é selecionado
function mostrarOpcaoTroco() {
  const dinheiroChecked = document.querySelector('input[name="pagamento-carrinho"][value="dinheiro"]').checked
  const opcaoTroco = document.getElementById("opcao-troco")
  
  if (dinheiroChecked) {
    opcaoTroco.style.display = "block"
    mostrarCampoTroco()
  } else {
    opcaoTroco.style.display = "none"
    // Desmarcar troco se dinheiro foi desmarcado
    document.getElementById("checkbox-troco").checked = false
    mostrarCampoTroco()
  }
}

// Mostrar/ocultar campo de valor de troco
function mostrarCampoTroco() {
  const trocoChecked = document.getElementById("checkbox-troco")?.checked
  const campoValorTroco = document.getElementById("campo-valor-troco")
  
  if (trocoChecked) {
    campoValorTroco.style.display = "block"
  } else {
    campoValorTroco.style.display = "none"
  }
}

// Função para ver detalhes
function verDetalhes() {
  alert("ℹ️ Funcionalidade de detalhes em desenvolvimento.\n\nEscreva no WhatsApp para mais informações!")
}

// Filtrar produtos
document.addEventListener("DOMContentLoaded", () => {
  const btnFiltrar = document.querySelector(".btn-filtrar")
  const btnVerTudo = document.querySelector(".btn-ver-tudo")
  
  if (btnFiltrar) {
    btnFiltrar.addEventListener("click", () => {
      filtrarProdutos()
    })
  }
  
  if (btnVerTudo) {
    btnVerTudo.addEventListener("click", () => {
      verTodosProdutos()
    })
  }
})

function filtrarProdutos() {
  // Pega os filtros selecionados
  const categoriasSelecionadas = Array.from(document.querySelectorAll(".filtro-categoria:checked"))
    .map(el => el.value)
  
  // Se nenhuma categoria selecionada, retorna
  if (categoriasSelecionadas.length === 0) {
    return
  }
  
  // Filtra os produtos
  const produtos = document.querySelectorAll(".produto-card")
  
  produtos.forEach(produto => {
    const categoria = produto.dataset.categoria
    const atendeFiltro = categoriasSelecionadas.includes(categoria)
    
    produto.style.display = atendeFiltro ? "flex" : "none"
  })
}

function verTodosProdutos() {
  // Mostra todos os produtos
  const produtos = document.querySelectorAll(".produto-card")
  produtos.forEach(p => p.style.display = "flex")
  
  // Desmarca todos os checkboxes
  document.querySelectorAll(".filtro-categoria").forEach(el => {
    el.checked = false
  })
}

// Mostrar todos os produtos ao carregar
document.addEventListener("DOMContentLoaded", () => {
  const produtos = document.querySelectorAll(".produto-card")
  produtos.forEach(p => p.style.display = "flex")
})

