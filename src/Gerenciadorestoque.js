class GerenciadorEstoque {
  constructor() {
    this.produtos = [];
  }

  adicionarProduto(produto) {
    if (!this.validarProduto(produto)) return false;
    if (this.produtoExiste(produto.id)) return false;

    this.produtos.push({ ...produto });
    return true;
  }

  removerProduto(id) {
    const tamanhoAnterior = this.produtos.length;
    this.produtos = this.produtos.filter((produto) => produto.id !== id);
    return this.produtos.length < tamanhoAnterior;
  }

  obterProduto(id) {
    return this.produtos.find((produto) => produto.id === id) || null;
  }

  listarProdutos() {
    return [...this.produtos];
  }

  produtoExiste(id) {
    return this.produtos.some((produto) => produto.id === id);
  }

  atualizarQuantidade(id, quantidade) {
    if (quantidade < 0) return false;

    const produto = this.obterProduto(id);
    if (!produto) return false;

    produto.quantidade = quantidade;
    return true;
  }

  aumentarEstoque(id, quantidade) {
    if (quantidade <= 0) return false;

    const produto = this.obterProduto(id);
    if (!produto) return false;

    produto.quantidade += quantidade;
    return true;
  }

  diminuirEstoque(id, quantidade) {
    if (quantidade <= 0) return false;

    const produto = this.obterProduto(id);
    if (!produto) return false;
    if (!this.temEstoqueSuficiente(id, quantidade)) return false;

    produto.quantidade -= quantidade;
    return true;
  }

  temEstoqueSuficiente(id, quantidade) {
    const produto = this.obterProduto(id);
    if (!produto) return false;

    return produto.quantidade >= quantidade;
  }

  atualizarPreco(id, novoPreco) {
    if (novoPreco < 0) return false;

    const produto = this.obterProduto(id);
    if (!produto) return false;

    produto.preco = novoPreco;
    return true;
  }

  calcularValorProduto(id) {
    const produto = this.obterProduto(id);
    if (!produto) return 0;

    return produto.preco * produto.quantidade;
  }

  obterValorTotalEstoque() {
    return this.produtos.reduce(
      (total, produto) => total + produto.preco * produto.quantidade,
      0
    );
  }

  obterQuantidadeTotal() {
    return this.produtos.reduce((total, produto) => total + produto.quantidade, 0);
  }

  listarProdutosEmFalta(limiteMinimo) {
    return this.produtos.filter((produto) => produto.quantidade <= limiteMinimo);
  }

  listarProdutosPorCategoria(categoria) {
    return this.produtos.filter((produto) => produto.categoria === categoria);
  }

  obterProdutoMaisCaro() {
    if (this.produtos.length === 0) return null;

    return this.produtos.reduce((maisCaro, produto) =>
      produto.preco > maisCaro.preco ? produto : maisCaro
    );
  }

  obterProdutoMaisBarato() {
    if (this.produtos.length === 0) return null;

    return this.produtos.reduce((maisBarato, produto) =>
      produto.preco < maisBarato.preco ? produto : maisBarato
    );
  }

  aplicarDesconto(id, percentual) {
    if (percentual <= 0 || percentual > 100) return false;

    const produto = this.obterProduto(id);
    if (!produto) return false;

    produto.preco = produto.preco - produto.preco * (percentual / 100);
    return true;
  }

  validarProduto(produto) {
    if (!produto) return false;
    if (!produto.id) return false;
    if (!produto.nome) return false;
    if (typeof produto.preco !== "number" || produto.preco < 0) return false;
    if (typeof produto.quantidade !== "number" || produto.quantidade < 0) return false;

    return true;
  }

  gerarRelatorio() {
    return {
      totalProdutos: this.produtos.length,
      quantidadeTotal: this.obterQuantidadeTotal(),
      valorTotalEstoque: this.obterValorTotalEstoque(),
      produtoMaisCaro: this.obterProdutoMaisCaro(),
      produtoMaisBarato: this.obterProdutoMaisBarato(),
    };
  }
}

module.exports = GerenciadorEstoque;