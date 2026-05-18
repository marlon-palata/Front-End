-- Script de criação do banco de dados e tabelas - Cantina Bella Vita

-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS sabordigital;
USE sabordigital;

-- 2. Tabela de Produto (Prato/Bebida)
CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(50) DEFAULT NULL,
    disponivel BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabela de Cardápio
CREATE TABLE IF NOT EXISTS cardapio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    disponivel BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Tabela Associativa Produto-Cardápio (N:M)
CREATE TABLE IF NOT EXISTS cardapio_produto (
    cardapio_id INT NOT NULL,
    produto_id INT NOT NULL,
    PRIMARY KEY (cardapio_id, produto_id),
    FOREIGN KEY (cardapio_id) REFERENCES cardapio(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE
);

-- 5. Tabela de Pedido
CREATE TABLE IF NOT EXISTS pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(100) DEFAULT NULL,
    status ENUM('pendente', 'preparo', 'pronto', 'entregue') DEFAULT 'pendente',
    total DECIMAL(10, 2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Tabela de Itens do Pedido (N:M com Produto)
CREATE TABLE IF NOT EXISTS item_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE RESTRICT
);

-- População inicial (Opcional)
INSERT INTO produto (nome, descricao, preco, categoria, disponivel) VALUES 
('Espaguete à Bolonhesa', 'Massa com molho de tomate e carne moída', 35.50, 'Massa', true),
('Lasanha de Frango', 'Lasanha com frango desfiado e queijo', 42.00, 'Massa', true),
('Pizza Margherita', 'Pizza de mussarela, tomate e manjericão', 50.00, 'Pizza', true),
('Suco de Laranja', 'Suco natural 500ml', 12.00, 'Bebida', true);
