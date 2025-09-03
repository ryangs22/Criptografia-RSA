# 🔐 Sistema de Criptografia RSA

Implementação em **C** do algoritmo RSA para criptografia assimétrica utilizando a biblioteca **GMP** para manipulação de grandes números.

---

## 📋 Funcionalidades
- ✅ Geração de chaves públicas  
- ✅ Criptografia de mensagens  
- ✅ Descriptografia de mensagens  
- ✅ Suporte a caracteres ASCII (32-126)  

---

## 📦 Pré-requisitos Necessários:
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

---

## 📜 Menu de Opções:
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

## 📊 Arquivos Gerados:
   - `chave_publica.txt` - Contém a chave pública no formato e,n
   - `texto_encriptado.txt` - Armazena o texto criptografado
   - `texto_desencriptado.txt` - Contém o texto descriptografado

## ⚠️ Observações:
- Use números primos suficientes grandes para segurança
- Programa com fins educacionais
