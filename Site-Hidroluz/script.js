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

// Validação e envio do formulário
document.querySelector(".contact-form").addEventListener("submit", (e) => {
  e.preventDefault()
  alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
  e.target.reset()
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

// Variáveis globais do carrinho
let carrinhoAtual = {
  nome: "",
  preco: 0,
  quantidade: 1,
  tipo: "venda",  // "aluguel" ou "venda"
  precosPeriodo: {
    diaria: 0,
    semanal: 0,
    mensal: 0
  }
}

// Atualizar preço máximo ao mover o slider
document.addEventListener("DOMContentLoaded", () => {
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

// Função para adicionar ao carrinho
function adicionarAoCarrinho(nome, preco) {
  carrinhoAtual.nome = nome
  carrinhoAtual.preco = preco
  carrinhoAtual.quantidade = 1
  
  // Atualizar modal
  document.getElementById("carrinho-nome").textContent = nome
  document.getElementById("carrinho-preco").textContent = "R$ " + preco.toLocaleString("pt-BR")
  document.getElementById("carrinho-quantidade").value = 1
  
  // Resetar radio de pagamento
  document.querySelector('input[name="pagamento-carrinho"][value="dinheiro"]').checked = true
  document.getElementById("checkbox-troco").checked = false
  
  // Mostrar opção de troco
  mostrarOpcaoTroco()
  
  // Resetar radio de entrega
  document.querySelector('input[name="entrega-carrinho"][value="retirada"]').checked = true
  
  atualizarResumo()
  abrirCarrinho()
}

function abrirCarrinho() {
  document.getElementById("modal-carrinho").classList.add("ativo")
  document.body.style.overflow = "hidden"
}

function fecharCarrinho() {
  document.getElementById("modal-carrinho").classList.remove("ativo")
  document.body.style.overflow = "auto"
}

function aumentarQuantidade() {
  const input = document.getElementById("carrinho-quantidade")
  input.value = parseInt(input.value) + 1
  atualizarResumo()
}

function diminuirQuantidade() {
  const input = document.getElementById("carrinho-quantidade")
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1
    atualizarResumo()
  }
}

function atualizarResumo() {
  const quantidade = parseInt(document.getElementById("carrinho-quantidade").value)
  let precoUnitario = carrinhoAtual.preco
  let subtotal = precoUnitario * quantidade
  
  // Aplicar preço promocional para lâmpada a partir de 10 unidades
  if (carrinhoAtual.nome === "Lâmpada LED 50W" && quantidade >= 10) {
    precoUnitario = 2.99
    subtotal = precoUnitario * quantidade
    const economiaUnitaria = carrinhoAtual.preco - precoUnitario
    const economiaTotal = economiaUnitaria * quantidade
    
    document.getElementById("resumo-subtotal").innerHTML = 
      `R$ ${subtotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})} <span style="color: #ff6b00; font-size: 0.85rem;">(-R$ ${economiaTotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})})</span>`
    document.getElementById("resumo-total").textContent = 
      "R$ " + subtotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})
  } else {
    document.getElementById("resumo-subtotal").textContent = 
      "R$ " + subtotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})
    document.getElementById("resumo-total").textContent = 
      "R$ " + subtotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const quantidadeInput = document.getElementById("carrinho-quantidade")
  if (quantidadeInput) {
    quantidadeInput.addEventListener("change", atualizarResumo)
  }
})

function finalizarCompra() {
  const quantidade = parseInt(document.getElementById("carrinho-quantidade").value)
  const entrega = document.querySelector('input[name="entrega-carrinho"]:checked')?.value || "retirada"
  const pagamentoSelecionado = document.querySelector('input[name="pagamento-carrinho"]:checked')?.value
  const trocoSelecionado = document.getElementById("checkbox-troco").checked
  
  // Criar array com pagamentos selecionados
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
  
  // Validar campo de troco se selecionado
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
    
    // Calcular o total da compra para validar o troco
    let precoUnitarioTemp = carrinhoAtual.preco
    let totalTemp = precoUnitarioTemp * quantidade
    
    // Aplicar preço promocional para lâmpada a partir de 10 unidades
    if (carrinhoAtual.nome === "Lâmpada LED 50W" && quantidade >= 10) {
      precoUnitarioTemp = 2.99
      totalTemp = precoUnitarioTemp * quantidade
    }
    
    // Validar se o valor do troco é menor que o total
    if (valorTroco < totalTemp) {
      alert(`⚠️ ERRO! O valor do dinheiro (R$ ${valorTroco.toLocaleString("pt-BR", {minimumFractionDigits: 2})}) é menor que o total da compra (R$ ${totalTemp.toLocaleString("pt-BR", {minimumFractionDigits: 2})})!\n\nPor favor, insira um valor maior ou igual ao total.`)
      return
    }
  }
  
  // Validar campos de retirada
  if (entrega === "retirada") {
    const nomeRetirada = document.getElementById("campo-nome-retirada").value.trim()
    const telefoneRetirada = document.getElementById("campo-telefone-retirada").value.trim()
    
    if (!nomeRetirada || !telefoneRetirada) {
      alert("⚠️ Por favor, preencha todos os campos obrigatórios para retirada na loja (Nome e Telefone)!")
      return
    }
  }
  
  // Validar campos de endereço se for entrega
  if (entrega === "entrega") {
    const nomeEntrega = document.getElementById("campo-nome-entrega").value.trim()
    const telefoneEntrega = document.getElementById("campo-telefone-entrega").value.trim()
    const endereco = document.getElementById("campo-endereco").value.trim()
    const numero = document.getElementById("campo-numero").value.trim()
    const cep = document.getElementById("campo-cep").value.trim()
    
    if (!nomeEntrega || !telefoneEntrega || !endereco || !numero || !cep) {
      alert("⚠️ Por favor, preencha todos os campos obrigatórios para entrega (Nome, Telefone, Endereço, Número e CEP)!")
      return
    }
    
    // Validar formato do CEP (8 dígitos, com ou sem hífen)
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
      alert("⚠️ CEP inválido! Use o formato: 00000000 ou 00000-000")
      return
    }
  }
  
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
      pix: "Pix",
      boleto: "Boleto"
    }
    return labels[p]
  }).join(", ")
  
  let precoUnitario = carrinhoAtual.preco
  let total = precoUnitario * quantidade
  let economia = 0
  
  // Aplicar preço promocional para lâmpada a partir de 10 unidades
  if (carrinhoAtual.nome === "Lâmpada LED 50W" && quantidade >= 10) {
    precoUnitario = 2.99
    total = precoUnitario * quantidade
    economia = (carrinhoAtual.preco - precoUnitario) * quantidade
  }
  
  // Fechar modal
  fecharCarrinho()
  
  // Mensagem de confirmação
  let mensagem = `
✅ PEDIDO FINALIZADO!

📦 Produto: ${carrinhoAtual.nome}
💰 Preço unitário: R$ ${precoUnitario.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
📊 Quantidade: ${quantidade}
`
  
  if (economia > 0) {
    mensagem += `💛 Preço normal: R$ ${(carrinhoAtual.preco * quantidade).toLocaleString("pt-BR")}
💛 Economia: -R$ ${economia.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
`
  }
  
  mensagem += `💵 TOTAL: R$ ${total.toLocaleString("pt-BR", {minimumFractionDigits: 2})}

 Entrega: ${entregaTexto}
💳 Formas de Pagamento: ${pagamentosTexto}
  `
  
  let textoWhatsApp = `*PEDIDO FINALIZADO* 🛒\n\n`
  textoWhatsApp += `📦 Produto: ${carrinhoAtual.nome}\n`
  textoWhatsApp += `💰 Preço unitário: R$ ${precoUnitario.toLocaleString("pt-BR", {minimumFractionDigits: 2})}\n`
  textoWhatsApp += `📊 Quantidade: ${quantidade}\n`
  
  if (economia > 0) {
    textoWhatsApp += `💛 Preço normal: R$ ${(carrinhoAtual.preco * quantidade).toLocaleString("pt-BR")}\n`
    textoWhatsApp += `💛 Economia: -R$ ${economia.toLocaleString("pt-BR", {minimumFractionDigits: 2})}\n`
  }
  
  textoWhatsApp += `*TOTAL: R$ ${total.toLocaleString("pt-BR", {minimumFractionDigits: 2})}*\n\n`
  textoWhatsApp += ` Tipo de Entrega: ${entregaTexto}\n`
  
  // Adicionar informação de troco se aplicável
  if (valorTroco !== null) {
    textoWhatsApp += `💰 Troco para: R$ ${valorTroco.toLocaleString("pt-BR", {minimumFractionDigits: 2})}\n`
  }
  
  // Adicionar dados de retirada ou entrega
  if (entrega === "retirada") {
    const nomeRetirada = document.getElementById("campo-nome-retirada").value
    const telefoneRetirada = document.getElementById("campo-telefone-retirada").value
    
    textoWhatsApp += `\n👤 *RETIRADA NA LOJA:*\n`
    textoWhatsApp += `Nome: ${nomeRetirada}\n`
    textoWhatsApp += `Telefone: ${telefoneRetirada}\n`
  } else if (entrega === "entrega") {
    const nomeEntrega = document.getElementById("campo-nome-entrega").value
    const telefoneEntrega = document.getElementById("campo-telefone-entrega").value
    const endereco = document.getElementById("campo-endereco").value
    const numero = document.getElementById("campo-numero").value
    const cep = document.getElementById("campo-cep").value
    const complemento = document.getElementById("campo-complemento").value
    
    textoWhatsApp += `\n👤 *DADOS DE ENTREGA:*\n`
    textoWhatsApp += `Nome: ${nomeEntrega}\n`
    textoWhatsApp += `Telefone: ${telefoneEntrega}\n`
    textoWhatsApp += `\n📍 *ENDEREÇO:*\n`
    textoWhatsApp += `Rua/Av: ${endereco}\n`
    textoWhatsApp += `Número: ${numero}\n`
    textoWhatsApp += `CEP: ${cep}\n`
    if (complemento) {
      textoWhatsApp += `Complemento: ${complemento}\n`
    }
  }
  
  textoWhatsApp += `\n💳 Formas de Pagamento: ${pagamentosTexto}`
  
  alert(mensagem + "\nSendo redirecionado para o WhatsApp...")
  
  // Enviar para WhatsApp
  const telefone = "5515996639799"
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(textoWhatsApp)}`
  window.open(url, "_blank")
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

