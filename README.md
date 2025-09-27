# 🔐 Sistema de Criptografia RSA

Este repositório contém duas implementações do algoritmo de criptografia RSA: uma em **C** utilizando a biblioteca **GMP** para manipulação de grandes números, e um site interativo desenvolvido em **HTML, CSS e JavaScript** para visualização e uso prático do RSA no navegador.

⚠️ A integração via WebAssembly (WASM) do código C seria muito trabalhosa quando se tratando da biblioteca GMP (números extremamente grandes), podendo causar erros em cálculos ou de impressão na tela e por isso achei mais viável adaptar para um site interativo com HTML, CSS e JS executando as mesmas funções do código em C.

---

## 📋 Funcionalidades:
### Implementação em C
- ✅ Geração de chaves públicas  
- ✅ Criptografia de mensagens  
- ✅ Descriptografia de mensagens  
- ✅ Suporte a caracteres ASCII (32-126)
- ✅ Executável no Terminal (Bash)    
### Site Interativo
- ✅ Site Responsivo 
- ✅ Interface gráfica com efeitos visuais dinâmicos
- ✅ Exportação de chave pública em PDF
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

### Site Interativo:
- Navegador moderno (Chrome, Firefox, Edge, etc.)
- Nenhuma instalação adicional necessária; basta abrir o arquivo `index.html` em um navegador ou clicar no link: https://criptografia-rsa-xi.vercel.app/

---

## 📜 Como Usar:
1. **Gerar Chave Pública:**
   - Forneça dois números primos (p, q)
   - Escolha um expoente (e) coprimo com φ(n)
   - A chave pública (e, n) será salva em `chave_publica.txt` ou será gerado um arquivo PDF (caso seja pelo site interativo)

2. **Encriptar Mensagem:**
   - Informe a chave pública (e, n)
   - Digite a mensagem a ser criptografada
   - O texto cifrado será salva em `texto_encriptado.txt` ou clique em "confirmar" para exibir os blocos criptografados (site)

3. **Desencriptar Mensagem:**
   - Forneça os primos originais (p, q) e o expoente (e)
   - Cole os blocos criptografados
   - A mensagem original será salva em `texto_desencriptado.txt` ou clique em "confirmar" para mostrar a mensagem decifrada (site)
---

## ⚠️ Observações:
- Use números primos suficientemente grandes para garantir segurança (recomenda-se a partir de 6 dígitos) 
- A quantidade de letras/símbolos/números é limitada a 2048 caracteres. Para alterar a quantidade para mais ou para menos, modifique o valor da constante global `USER_INPUT_SIZE` no começo do código para a quantidade de caracteres desejada
- Programa com fins educacionais
