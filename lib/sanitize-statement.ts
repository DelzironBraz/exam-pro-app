/**
 * As questões importadas do JurisWay vêm com o cabeçalho de navegação, o
 * formulário de login e os botões de compartilhamento da página colados no
 * início do enunciado. Esse bloco sempre termina logo antes do conteúdo real
 * com a sequência "Tweet ... Comente abaixo". Esta função remove esse "lixo"
 * e normaliza os espaços em branco deixados para trás.
 */

const HEADER_END_MARKERS = ['Comente abaixo', 'Comente abaixo:']

// Trechos que identificam o cabeçalho/menu do JurisWay. Usados como fallback
// caso o marcador final não exista no texto.
const CHROME_SNIPPETS = [
  'person_outline',
  'announcement',
  'Você não está conectado',
  'Faça o login no JurisWay',
  'Não tem conta?',
  'Cadastre-se no JurisWay',
  'Esqueceu a senha?',
  'Achou esta página útil',
]

function collapseWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .trim()
}

export function sanitizeStatement(raw: string | null | undefined): string {
  if (!raw) return ''

  let text = raw.replace(/\r\n/g, '\n')

  const hasChrome =
    /JurisWay/i.test(text) || CHROME_SNIPPETS.some((s) => text.includes(s))

  if (hasChrome) {
    // Estratégia principal: cortar tudo até o último marcador de fim de
    // cabeçalho, que aparece imediatamente antes do conteúdo da página.
    let cutAt = -1
    for (const marker of HEADER_END_MARKERS) {
      const idx = text.lastIndexOf(marker)
      if (idx !== -1) {
        cutAt = Math.max(cutAt, idx + marker.length)
      }
    }

    if (cutAt !== -1) {
      text = text.slice(cutAt)
    } else {
      // Fallback: remover linha a linha os trechos conhecidos do cabeçalho.
      text = text
        .split('\n')
        .filter(
          (line) =>
            !CHROME_SNIPPETS.some((s) => line.includes(s)) &&
            !/^\s*(person_outline|announcement|search|menu|Tweet)\s*$/.test(line)
        )
        .join('\n')
    }
  }

  return collapseWhitespace(text)
}

// Preâmbulo do tipo "Resposta FGV Para ver a resposta da FGV, role a tela mais
// um pouco...": o conteúdo real (padrão de resposta) começa logo depois.
const ANSWER_START_MARKER = /(?:para ver a resposta[^.]*?)?role a tela mais um pouco[.…\s]*/i

// A partir de qualquer um destes trechos começa o rodapé/navegação/scripts do
// JurisWay (e a duplicação do conteúdo). Corta-se tudo a partir do primeiro.
const ANSWER_END_MARKERS = [
  '- Voltar para lista',
  'Voltar para lista de',
  'Questão Anterior',
  'Próxima Questão',
  'Achou esta página útil',
  'Comente abaixo',
  'Comentários',
  'Copyright (c)',
  'Copyright ©',
  "GoogleAnalyticsObject",
  "ga('create'",
  'fbAsyncInit',
  'facebook-jssdk',
  'twitter-wjs',
  'adsbygoogle',
  'setTimeout(function',
  'window.innerHeight',
]

/**
 * Limpa a resposta-modelo (referenceAnswer) / explicação importada do JurisWay,
 * removendo o preâmbulo "Resposta FGV ... role a tela mais um pouco...", o
 * rodapé de navegação, os comentários, o copyright e os blocos de
 * JavaScript (Google Analytics, Facebook, Twitter, AdSense) que vêm colados
 * — inclusive a duplicação do conteúdo.
 */
export function sanitizeAnswer(raw: string | null | undefined): string {
  if (!raw) return ''

  let text = raw.replace(/\r\n/g, '\n')

  // Remove o preâmbulo "... role a tela mais um pouco..." mantendo o conteúdo.
  const startMatch = text.match(ANSWER_START_MARKER)
  if (startMatch && startMatch.index !== undefined) {
    text = text.slice(startMatch.index + startMatch[0].length)
  }

  // Corta a partir do primeiro marcador de rodapé/navegação/script.
  let cutAt = text.length
  for (const marker of ANSWER_END_MARKERS) {
    const idx = text.indexOf(marker)
    if (idx !== -1 && idx < cutAt) cutAt = idx
  }
  text = text.slice(0, cutAt)

  return collapseWhitespace(text)
}
