# 🔐 Sistema de Criptografia RSA

Este repositório contém duas implementações do algoritmo de criptografia RSA: uma em **C** utilizando a biblioteca **GMP** para manipulação de grandes números, e um site interativo desenvolvido em **HTML, CSS e JavaScript** para visualização e uso prático do RSA no navegador.

(emoji de aviso aqui) A integração via WebAssembly (WASM) junto com o código C seria muito trabalhosa quando se tratando da biblioteca GMP (números extremamente grandes), podendo causar erros em cálculos ou de impressão na tela e por isso achei mais viável adaptar para um código JS

---

## 📋 Funcionalidades:
### Implementação em C
- ✅ Geração de chaves públicas  
- ✅ Criptografia de mensagens  
- ✅ Descriptografia de mensagens  
- ✅ Suporte a caracteres ASCII (32-126)
- ✅ Executável no Terminal (Bash)    
### Site Interativo
- ✅ Interface gráfica para geração de chaves públicas
- ✅ Exportação de chave pública em PDF
- ✅ Efeitos visuais (partículas de fundo animadas)
- ✅ Suporte a caracteres ASCII (32-126)
  
---

## 📦 Pré-requisitos Necessários:
### Implementação em C:
Para executar este código, é necessária a **Biblioteca GMP** (*GNU Multiple Precision Arithmetic Library*), que permite trabalhar com números extremamente grandes de forma eficiente — um requisito fundamental para a criptografia RSA.

### 🔧 Instalação da GMP:
- 🐧 **Linux (Ubuntu/Debian)**  
```bash
  sudo apt install libgmp3-dev
```
- 🍎 **macOS (com Homebrew)**
```bash
  brew install gmp
```
- 🪟 **Windows (com MSYS2)**
```bash
  pacman -S mingw-w64-x86_64-gmp
```

### 🛠️ Compilação do Programa:
Após instalar a GMP, compile o código com:
```bash
  gcc -o rsa rsa.c -lgmp
```

### 🚀 Execução do Programa (Terminal Bash):
```bash
./rsa
```
### Site Interativo:
- Navegador moderno (Chrome, Firefox, Edge, etc.)
- Nenhuma instalação adicional necessária; basta abrir o arquivo `index.html` em um navegador.

---

## 📜 Como Usar:
### Implementação em C:
1. **Gerar Chave Pública:**
   - Forneça dois números primos (p, q)
   - Escolha um expoente (e) coprimo com φ(n)
   - A chave pública (e, n) será salva em `chave_publica.txt`

2. **Encriptar Mensagem:**
   - Informe a chave pública (e, n)
   - Digite a mensagem a ser criptografada
   - O texto cifrado será salva em `texto_encriptado.txt`

3. **Desencriptar Mensagem:**
   - Forneça os primos originais (p, q) e o expoente (e)
   - Cole os blocos criptografados
   - A mensagem original será salva em `texto_desencriptado.txt`

### Site Interativo:
1. **Abrir o Site:**
   - Abra o arquivo index.html em um navegador (Live Server ou arrastando o arquivo para uma página WEB)

2. **Gerar Chave Pública:**
   - Preencha os campos com números primos (p, q) e o expoente (e)
   - Clique em "Confirmar" para gerar e baixar a chave pública em PDF

3. **Encriptar Mensagem:**
   - Insira a chave pública (e, n) e a mensagem
   - Clique em "Confirmar" para ver os blocos criptografados
  
4. **Desencriptar Mensagem:**
   - Forneça os primos (p, q), o expoente (e) e os blocos criptografados
   - Clique em "Confirmar" para obter a mensagem original 
---

## 📊 Arquivos Gerados:
### Implementação em C:
   - `chave_publica.txt` - Contém a chave pública no formato e,n
   - `texto_encriptado.txt` - Armazena o texto criptografado
   - `texto_desencriptado.txt` - Contém o texto descriptografado
### Site Interativo:
- `chave_publica.pdf` - Exportação da chave pública gerada
---

## ⚠️ Observações:
- Use números primos suficientemente grandes para garantir segurança (recomenda-se a partir de 6 dígitos) 
- A quantidade de letras/símbolos/números é limitada a 2048 caracteres. Para alterar a quantidade para mais ou para menos, modifique o valor da variável global `USER_INPUT_SIZE` no começo do código para a quantidade de caracteres desejada
- Programa com fins educacionais
