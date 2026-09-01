const GerenciadorEstoque = require("../src/Gerenciadorestoque");

const criarProduto = (overrides = {}) => ({
  id: "1",
  nome: "Caneta",
  categoria: "papelaria",
  preco: 10,
  quantidade: 20,
  ...overrides,
});

describe("gerenciador de estoque", () => {
  test("deve adicionar produto valido e rejeitar produto invalido ou duplicado", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    const produto = criarProduto();

    // Act
    const adicionadoComSucesso = gerenciador.adicionarProduto(produto);
    const adicionadoDuplicado = gerenciador.adicionarProduto(produto);
    const adicionadoInvalido = gerenciador.adicionarProduto({ id: "2" });

    // Assert
    expect(adicionadoComSucesso).toBe(true);
    expect(adicionadoDuplicado).toBe(false);
    expect(adicionadoInvalido).toBe(false);
    expect(gerenciador.listarProdutos()).toHaveLength(1);
  });

  test("deve remover produto existente e retornar falso para inexistente", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const removidoInexistente = gerenciador.removerProduto("999");
    const removidoComSucesso = gerenciador.removerProduto("1");

    // Assert
    expect(removidoInexistente).toBe(false);
    expect(removidoComSucesso).toBe(true);
    expect(gerenciador.listarProdutos()).toHaveLength(0);
  });

  test("deve obter produto por id ou retornar null se nao existir", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const encontrado = gerenciador.obterProduto("1");
    const naoEncontrado = gerenciador.obterProduto("999");

    // Assert
    expect(encontrado).toMatchObject({ id: "1", nome: "Caneta" });
    expect(naoEncontrado).toBeNull();
  });

  test("deve listar produtos retornando uma copia da lista interna", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const lista = gerenciador.listarProdutos();
    lista.push(criarProduto({ id: "2" }));

    // Assert
    expect(lista).toHaveLength(2);
    expect(gerenciador.listarProdutos()).toHaveLength(1);
  });

  test("deve verificar existencia de produto por id", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const existe = gerenciador.produtoExiste("1");
    const naoExiste = gerenciador.produtoExiste("999");

    // Assert
    expect(existe).toBe(true);
    expect(naoExiste).toBe(false);
  });

  test("deve atualizar quantidade valida e rejeitar quantidade negativa ou produto inexistente", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const quantidadeNegativa = gerenciador.atualizarQuantidade("1", -5);
    const produtoInexistente = gerenciador.atualizarQuantidade("999", 5);
    const atualizadoComSucesso = gerenciador.atualizarQuantidade("1", 50);

    // Assert
    expect(quantidadeNegativa).toBe(false);
    expect(produtoInexistente).toBe(false);
    expect(atualizadoComSucesso).toBe(true);
    expect(gerenciador.obterProduto("1").quantidade).toBe(50);
  });

  test("deve aumentar estoque com valor positivo e rejeitar valor invalido ou produto inexistente", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const valorInvalido = gerenciador.aumentarEstoque("1", 0);
    const produtoInexistente = gerenciador.aumentarEstoque("999", 5);
    const aumentadoComSucesso = gerenciador.aumentarEstoque("1", 10);

    // Assert
    expect(valorInvalido).toBe(false);
    expect(produtoInexistente).toBe(false);
    expect(aumentadoComSucesso).toBe(true);
    expect(gerenciador.obterProduto("1").quantidade).toBe(30);
  });

  test("deve diminuir estoque quando ha quantidade suficiente e rejeitar cenarios invalidos", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const valorInvalido = gerenciador.diminuirEstoque("1", 0);
    const produtoInexistente = gerenciador.diminuirEstoque("999", 5);
    const estoqueInsuficiente = gerenciador.diminuirEstoque("1", 1000);
    const diminuidoComSucesso = gerenciador.diminuirEstoque("1", 5);

    // Assert
    expect(valorInvalido).toBe(false);
    expect(produtoInexistente).toBe(false);
    expect(estoqueInsuficiente).toBe(false);
    expect(diminuidoComSucesso).toBe(true);
    expect(gerenciador.obterProduto("1").quantidade).toBe(15);
  });

  test("deve verificar se ha estoque suficiente para produto existente e inexistente", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const suficiente = gerenciador.temEstoqueSuficiente("1", 10);
    const insuficiente = gerenciador.temEstoqueSuficiente("1", 100);
    const produtoInexistente = gerenciador.temEstoqueSuficiente("999", 1);

    // Assert
    expect(suficiente).toBe(true);
    expect(insuficiente).toBe(false);
    expect(produtoInexistente).toBe(false);
  });

  test("deve atualizar preco valido e rejeitar preco negativo ou produto inexistente", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const precoNegativo = gerenciador.atualizarPreco("1", -1);
    const produtoInexistente = gerenciador.atualizarPreco("999", 15);
    const atualizadoComSucesso = gerenciador.atualizarPreco("1", 15);

    // Assert
    expect(precoNegativo).toBe(false);
    expect(produtoInexistente).toBe(false);
    expect(atualizadoComSucesso).toBe(true);
    expect(gerenciador.obterProduto("1").preco).toBe(15);
  });

  test("deve calcular valor de produto existente e retornar zero para inexistente", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto());

    // Act
    const valorExistente = gerenciador.calcularValorProduto("1");
    const valorInexistente = gerenciador.calcularValorProduto("999");

    // Assert
    expect(valorExistente).toBe(200);
    expect(valorInexistente).toBe(0);
  });

  test("deve obter o valor total do estoque somando todos os produtos", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto({ id: "1", preco: 10, quantidade: 20 }));
    gerenciador.adicionarProduto(criarProduto({ id: "2", preco: 5, quantidade: 10 }));

    // Act
    const valorTotal = gerenciador.obterValorTotalEstoque();

    // Assert
    expect(valorTotal).toBe(250);
  });

  test("deve obter a quantidade total de unidades no estoque", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto({ id: "1", quantidade: 20 }));
    gerenciador.adicionarProduto(criarProduto({ id: "2", quantidade: 10 }));

    // Act
    const quantidadeTotal = gerenciador.obterQuantidadeTotal();

    // Assert
    expect(quantidadeTotal).toBe(30);
  });

  test("deve listar produtos com quantidade em falta abaixo do limite minimo", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto({ id: "1", quantidade: 2 }));
    gerenciador.adicionarProduto(criarProduto({ id: "2", quantidade: 20 }));

    // Act
    const emFalta = gerenciador.listarProdutosEmFalta(5);

    // Assert
    expect(emFalta).toHaveLength(1);
    expect(emFalta[0].id).toBe("1");
  });

  test("deve listar produtos filtrando por categoria", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto({ id: "1", categoria: "papelaria" }));
    gerenciador.adicionarProduto(criarProduto({ id: "2", categoria: "eletronicos" }));

    // Act
    const filtrados = gerenciador.listarProdutosPorCategoria("eletronicos");

    // Assert
    expect(filtrados).toHaveLength(1);
    expect(filtrados[0].id).toBe("2");
  });

  test("deve obter o produto mais caro e retornar null quando nao ha produtos", () => {
    // Arrange
    const gerenciadorVazio = new GerenciadorEstoque();
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto({ id: "1", preco: 10 }));
    gerenciador.adicionarProduto(criarProduto({ id: "2", preco: 50 }));

    // Act
    const semProdutos = gerenciadorVazio.obterProdutoMaisCaro();
    const maisCaro = gerenciador.obterProdutoMaisCaro();

    // Assert
    expect(semProdutos).toBeNull();
    expect(maisCaro.id).toBe("2");
  });

  test("deve obter o produto mais barato e retornar null quando nao ha produtos", () => {
    // Arrange
    const gerenciadorVazio = new GerenciadorEstoque();
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto({ id: "1", preco: 10 }));
    gerenciador.adicionarProduto(criarProduto({ id: "2", preco: 50 }));

    // Act
    const semProdutos = gerenciadorVazio.obterProdutoMaisBarato();
    const maisBarato = gerenciador.obterProdutoMaisBarato();

    // Assert
    expect(semProdutos).toBeNull();
    expect(maisBarato.id).toBe("1");
  });

  test("deve aplicar desconto valido e rejeitar percentual invalido ou produto inexistente", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto({ preco: 100 }));

    // Act
    const percentualZero = gerenciador.aplicarDesconto("1", 0);
    const percentualAcimaDoLimite = gerenciador.aplicarDesconto("1", 101);
    const produtoInexistente = gerenciador.aplicarDesconto("999", 10);
    const descontoAplicado = gerenciador.aplicarDesconto("1", 10);

    // Assert
    expect(percentualZero).toBe(false);
    expect(percentualAcimaDoLimite).toBe(false);
    expect(produtoInexistente).toBe(false);
    expect(descontoAplicado).toBe(true);
    expect(gerenciador.obterProduto("1").preco).toBe(90);
  });

  test("deve validar produto para cenarios validos e invalidos", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();

    // Act
    const nulo = gerenciador.validarProduto(null);
    const semId = gerenciador.validarProduto(criarProduto({ id: "" }));
    const semNome = gerenciador.validarProduto(criarProduto({ nome: "" }));
    const precoInvalido = gerenciador.validarProduto(criarProduto({ preco: "10" }));
    const precoNegativo = gerenciador.validarProduto(criarProduto({ preco: -1 }));
    const quantidadeInvalida = gerenciador.validarProduto(criarProduto({ quantidade: "10" }));
    const quantidadeNegativa = gerenciador.validarProduto(criarProduto({ quantidade: -1 }));
    const valido = gerenciador.validarProduto(criarProduto());

    // Assert
    expect(nulo).toBe(false);
    expect(semId).toBe(false);
    expect(semNome).toBe(false);
    expect(precoInvalido).toBe(false);
    expect(precoNegativo).toBe(false);
    expect(quantidadeInvalida).toBe(false);
    expect(quantidadeNegativa).toBe(false);
    expect(valido).toBe(true);
  });

  test("deve gerar relatorio consolidado do estoque", () => {
    // Arrange
    const gerenciador = new GerenciadorEstoque();
    gerenciador.adicionarProduto(criarProduto({ id: "1", preco: 10, quantidade: 20 }));
    gerenciador.adicionarProduto(criarProduto({ id: "2", preco: 50, quantidade: 5 }));

    // Act
    const relatorio = gerenciador.gerarRelatorio();

    // Assert
    expect(relatorio).toEqual({
      totalProdutos: 2,
      quantidadeTotal: 25,
      valorTotalEstoque: 450,
      produtoMaisCaro: expect.objectContaining({ id: "2" }),
      produtoMaisBarato: expect.objectContaining({ id: "1" }),
    });
  });
});
