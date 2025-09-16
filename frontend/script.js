const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.reset();
        this.colors = ['#004e92', '#ffffff', '#000000'];
        this.color = this.colors[Math.floor(Math.random() * 3)];
    }

    reset() {
        this.x = Math.random() > 0.5 ? -10 : canvas.width + 10;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (canvas.width / 2 - this.x) * 0.001 + (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.text = Math.random() > 0.5 ? '0' : '1';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
            this.reset();
        }
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            this.x += dx / dist * 2;
            this.y += dy / dist * 2;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.font = 'bold 12px Orbitron';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

const particles = [];
function addParticle() {
    particles.push(new Particle());
    if (particles.length > 200) {
        particles.shift();
    }
}

let mouse = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    addParticle();
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function closeAllForms() {
    const forms = ['genForm', 'encForm', 'decForm'];
    forms.forEach(formId => {
        document.getElementById(formId).classList.remove('open');
    });
    document.querySelector('.message-input-container').style.display = 'none';
}

// Função auxiliar para GCD com BigInt (Grandes Inteiros)
function gcd(a, b) {
    while (b !== 0n) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// Funções RSA com BigInt (equivalente ao C/GMP)
function isPrime(n) {
    n = n > 0n ? n : 0n;
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;
    for (let i = 5n; i * i <= n; i += 6n) {
        if (n % i === 0n || n % (i + 2n) === 0n) return false;
    }
    return true;
}

function modInverse(a, m) {
    let m0 = m;
    let y = 0n, x = 1n;
    if (m === 1n) return 0n;
    while (a > 1n) {
        let q = a / m;
        let t = m;
        m = a % m;
        a = t;
        t = y;
        y = BigInt(x) - q * y;
        x = t;
    }
    if (x < 0n) x += m0;
    return x;
}

function mpzToString(num) {
    let str = '';
    while (num > 0n) {
        const byte = Number(num % 256n);
        if (byte >= 32 && byte <= 126) { // Valida apenas caracteres ASCII imprimíveis
            str = String.fromCharCode(byte) + str;
        }
        num = num / 256n;
    }
    return str || ' '; // Retorna espaço se não houver caracteres válidos
}

document.getElementById('genKeyBtn').addEventListener('click', () => {
    closeAllForms();
    document.getElementById('genForm').classList.add('open');
});

document.getElementById('encMsgBtn').addEventListener('click', () => {
    closeAllForms();
    document.getElementById('encForm').classList.add('open');
    document.getElementById('messageInput').placeholder = 'Digite a mensagem a ser encriptada...';
    document.querySelector('.message-input-container').style.display = 'block';
});

document.getElementById('decMsgBtn').addEventListener('click', () => {
    closeAllForms();
    document.getElementById('decForm').classList.add('open');
    document.getElementById('messageInput').placeholder = 'Digite os blocos criptografados (separados por espaço)...';
    document.querySelector('.message-input-container').style.display = 'block';
});

function generateKey() {
    const pStr = document.getElementById('pInput').value.trim();
    const qStr = document.getElementById('qInput').value.trim();
    const eStr = document.getElementById('eInput').value.trim();

    if (!pStr || !qStr || !eStr) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    let p, q, e;
    try {
        p = BigInt(pStr);
        q = BigInt(qStr);
        e = BigInt(eStr);
    } catch (error) {
        alert('Erro: Valores de entrada inválidos. Use números inteiros.');
        return;
    }

    if (!isPrime(p) || !isPrime(q)) {
        alert('p e q devem ser números primos.');
        return;
    }

    const n = p * q;
    if (n <= 28n) {
        alert('n deve ser maior que 28.');
        return;
    }

    const phi = (p - 1n) * (q - 1n);
    if (gcd(e, phi) !== 1n) {
        alert('e deve ser coprimo com φ(n).');
        return;
    }

    const key = `e: ${e}\nn: ${n}`;

    // Gera o PDF contendo a chave pública
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFont('helvetica');
        doc.text('Chave Pública RSA', 20, 20);
        doc.text(key, 20, 40);
        doc.save('chave_publica.pdf');
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Chave gerada, mas erro ao salvar PDF. Verifique o console.');
    }

    showModal(key, 'CHAVE PÚBLICA GERADA:');
    closeAllForms();
}

function encryptMessage() {
    const message = document.getElementById('messageInput').value.trim();
    const eStr = document.getElementById('encEInput').value.trim();
    const nStr = document.getElementById('encNInput').value.trim();

    if (!message || !eStr || !nStr) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    let e, n;
    try {
        e = BigInt(eStr);
        n = BigInt(nStr);
    } catch (error) {
        alert('Erro: Valores de entrada inválidos. Use números inteiros.');
        return;
    }

    if (n <= 0n) {
        alert('n deve ser maior que 0.');
        return;
    }

    let result = '';
    for (let i = 0; i < message.length; i++) {
        const charCode = BigInt(message.charCodeAt(i));
        if (charCode < 32n || charCode > 126n) {
            alert(`Caractere inválido na posição ${i + 1}.`);
            return;
        }
        const c = powMod(charCode, e, n);
        result += c.toString() + ' ';
    }

    showModal(result.trim(), 'MENSAGEM ENCRIPTADA:');
    closeAllForms();
}

function decryptMessage() {
    const blocksStr = document.getElementById('messageInput').value.trim();
    const pStr = document.getElementById('decPInput').value.trim();
    const qStr = document.getElementById('decQInput').value.trim();
    const eStr = document.getElementById('decEInput').value.trim();

    if (!blocksStr || !pStr || !qStr || !eStr) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    let p, q, e;
    try {
        p = BigInt(pStr);
        q = BigInt(qStr);
        e = BigInt(eStr);
    } catch (error) {
        alert('Erro: Valores de entrada inválidos. Use números inteiros.');
        return;
    }

    if (!isPrime(p) || !isPrime(q)) {
        alert('p e q devem ser números primos.');
        return;
    }

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    if (gcd(e, phi) !== 1n) {
        alert('e deve ser coprimo com φ(n).');
        return;
    }

    let d;
    try {
        d = modInverse(e, phi);
    } catch (error) {
        alert('Erro ao calcular inverso modular.');
        return;
    }

    if (!d || d === 0n) {
        alert('e não tem inverso módulo φ(n).');
        return;
    }

    const blocks = blocksStr.split(' ').filter(b => b.trim() !== '');
    let result = '';
    for (let blockStr of blocks) {
        let c;
        try {
            c = BigInt(blockStr);
        } catch (error) {
            alert(`Bloco inválido: ${blockStr}`);
            return;
        }
        const m = powMod(c, d, n);
        const decodedChar = mpzToString(m);
        if (decodedChar.length > 0 && /[ -~]/.test(decodedChar)) {
            result += decodedChar;
        } else {
            console.warn(`Caractere inválido decodificado a partir de ${blockStr}: ${m}`);
            result += '�';
        }
    }

    showModal(result, 'MENSAGEM DESENCRIPTADA:');
    closeAllForms();
}

function powMod(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}

function showModal(content, title) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = '';
    const modalTitle = document.createElement('div');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = title;
    const resultText = document.createElement('pre');
    resultText.className = 'result-text';
    resultText.textContent = content;
    modalBody.appendChild(modalTitle);
    modalBody.appendChild(resultText);
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function copyToClipboard() {
    const text = document.getElementById('modalBody').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copiado para a área de transferência!');
    });
}

window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};
