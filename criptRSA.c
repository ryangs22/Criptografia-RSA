#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <gmp.h>

#define USER_INPUT_SIZE 2048

int verificar_primo(const mpz_t n) {
    return mpz_probab_prime_p(n, 128) > 0;
}

void inverso_modular(mpz_t resultado, const mpz_t e, const mpz_t phi) {
    mpz_invert(resultado, e, phi);
}

void mpz_to_string(mpz_t num, char *output) {
    mpz_t tmp;
    mpz_init(tmp);
    char buffer[1024];
    int i = 0;

    while (mpz_cmp_ui(num, 0) > 0) {
        mpz_mod_ui(tmp, num, 256);
        buffer[i++] = (char)mpz_get_ui(tmp);
        mpz_fdiv_q_ui(num, num, 256);
    }

    for (int j = i - 1, k = 0; j >= 0; j--, k++) {
        output[k] = buffer[j];
    }
    output[i] = '\0';
    mpz_clear(tmp);
}

void gerar_chave_publica() {
    mpz_t p, q, n, phi, e;
    mpz_inits(p, q, n, phi, e, NULL);

    printf("Digite um número primo p: ");
    gmp_scanf("%Zd", p);
    printf("Digite um número primo q: ");
    gmp_scanf("%Zd", q);

    if (!verificar_primo(p) || !verificar_primo(q)) {
        printf("Erro: p e q devem ser números primos.\n");
        mpz_clears(p, q, n, phi, e, NULL);
        exit(1);
    }

    mpz_mul(n, p, q);

    mpz_t p_menos_1, q_menos_1;
    mpz_inits(p_menos_1, q_menos_1, NULL);
    mpz_sub_ui(p_menos_1, p, 1);
    mpz_sub_ui(q_menos_1, q, 1);
    mpz_mul(phi, p_menos_1, q_menos_1);

    printf("Digite o expoente e (coprimo com ");
    gmp_printf("%Zd", phi);
    printf("): ");
    gmp_scanf("%Zd", e);

    mpz_t mdc;
    mpz_init(mdc);
    mpz_gcd(mdc, e, phi);

    if (mpz_cmp_ui(mdc, 1) != 0) {
        printf("Erro: e deve ser coprimo com (p-1)(q-1).\n");
        mpz_clears(p, q, n, phi, e, p_menos_1, q_menos_1, mdc, NULL);
        exit(1);
    }

    if (mpz_cmp_ui(n, 28) <= 0) {
        gmp_printf("Erro: n = %Zd é muito pequeno. Deve ser maior que 28.\n", n);
        mpz_clears(p, q, n, phi, e, p_menos_1, q_menos_1, mdc, NULL);
        exit(1);
    }

    FILE *arquivo_saida = fopen("chave_publica.txt", "w");
    if (arquivo_saida == NULL) {
        printf("Erro ao criar arquivo de saída.\n");
        mpz_clears(p, q, n, phi, e, p_menos_1, q_menos_1, mdc, NULL);
        exit(1);
    }

    gmp_fprintf(arquivo_saida, "%Zd,%Zd", e, n);
    fclose(arquivo_saida);
    printf("✓ Chave pública (e,n) salva em 'chave_publica.txt'\n");

    mpz_clears(p, q, n, phi, e, p_menos_1, q_menos_1, mdc, NULL);
}

void encriptar_mensagem() {
    mpz_t e, n;
    mpz_inits(e, n, NULL);

    printf("Digite o expoente e: ");
    gmp_scanf("%Zd", e);
    printf("Digite o módulo n: ");
    gmp_scanf("%Zd", n);

    char mensagem[USER_INPUT_SIZE];
    printf("Digite a mensagem a ser encriptada (caracteres ASCII 32-126):\n");
    scanf(" %[^\n]", mensagem);

    for (int i = 0; mensagem[i] != '\0'; i++) {
        if (mensagem[i] < 32 || mensagem[i] > 126) {
            printf("Erro: Caractere inválido na posição %d.\n", i + 1);
            mpz_clears(e, n, NULL);
            exit(1);
        }
    }

    mpz_t m, c;
    mpz_inits(m, c, NULL);

    FILE *arquivo_saida = fopen("texto_encriptado.txt", "w");
    if (arquivo_saida == NULL) {
        printf("Erro ao criar arquivo de saída.\n");
        mpz_clears(e, n, m, c, NULL);
        exit(1);
    }

    printf("\n--- Mensagem Encriptada ---\n");
    for (int i = 0; mensagem[i] != '\0'; i++) {
        mpz_set_ui(m, (unsigned int)mensagem[i]);
        mpz_powm(c, m, e, n);
        gmp_printf("%Zd ", c);
        gmp_fprintf(arquivo_saida, "%Zd ", c);
    }
    printf("\n---------------------------\n");
    fclose(arquivo_saida);
    printf("✓ Texto encriptado salvo em 'texto_encriptado.txt'\n");

    mpz_clears(e, n, m, c, NULL);
}

void desencriptar_mensagem() {
    mpz_t p, q, e, n, phi, d, c, m;
    mpz_inits(p, q, e, n, phi, d, c, m, NULL);

    printf("Digite o valor de p: ");
    gmp_scanf("%Zd", p);
    printf("Digite o valor de q: ");
    gmp_scanf("%Zd", q);
    printf("Digite o valor de e: ");
    gmp_scanf("%Zd", e);

    mpz_mul(n, p, q);

    mpz_t p_menos_1, q_menos_1;
    mpz_inits(p_menos_1, q_menos_1, NULL);
    mpz_sub_ui(p_menos_1, p, 1);
    mpz_sub_ui(q_menos_1, q, 1);
    mpz_mul(phi, p_menos_1, q_menos_1);

    if (mpz_invert(d, e, phi) == 0) {
        printf("Erro: e não tem inverso módulo φ(n).\n");
        mpz_clears(p, q, e, n, phi, d, c, m, p_menos_1, q_menos_1, NULL);
        exit(1);
    }

    printf("Digite os blocos criptografados (separados por espaço):\n");
    char blocos_str[USER_INPUT_SIZE];
    scanf(" %[^\n]", blocos_str);

    FILE *arquivo_saida = fopen("texto_desencriptado.txt", "w");
    if (arquivo_saida == NULL) {
        printf("Erro ao criar arquivo de saída.\n");
        mpz_clears(p, q, e, n, phi, d, c, m, p_menos_1, q_menos_1, NULL);
        exit(1);
    }

    printf("\n--- Mensagem Descriptografada ---\n");
    fprintf(arquivo_saida, "--- Mensagem Descriptografada ---\n");

    char *token = strtok(blocos_str, " ");
    while (token != NULL) {
        mpz_set_str(c, token, 10);
        mpz_powm(m, c, d, n);

        char texto[1024];
        mpz_to_string(m, texto);
        printf("%s", texto);
        fprintf(arquivo_saida, "%s", texto);
        token = strtok(NULL, " ");
    }

    printf("\n---------------------------------\n");
    fprintf(arquivo_saida, "\n---------------------------------\n");
    fclose(arquivo_saida);
    printf("✓ Texto desencriptado salvo em 'texto_desencriptado.txt'\n");

    mpz_clears(p, q, e, n, phi, d, c, m, p_menos_1, q_menos_1, NULL);
}

int main() {
    int opcao;
    printf("\n=== RSA Simplificado (GMP) ===\n");
    printf("1. Gerar chave pública\n");
    printf("2. Encriptar mensagem\n");
    printf("3. Desencriptar mensagem\n");
    printf("0. Sair\n");
    printf("Escolha uma opção: ");
    scanf("%d", &opcao);

    switch (opcao) {
        case 1: 
            gerar_chave_publica(); 
            break;
        case 2: 
            encriptar_mensagem(); 
            break;
        case 3: 
            desencriptar_mensagem(); 
            break;
        case 0: 
            printf("Saindo...\n"); 
            break;
        default: 
            printf("Opção inválida!\n");
    }

    return 0;
}
