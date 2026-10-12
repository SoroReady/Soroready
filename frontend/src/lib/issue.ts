import type { ResultadoEscaneo } from './types'

const LIMITE_CARACTERES = 7000

export interface IssueGenerado {
  titulo: string
  markdown: string
  recortado: boolean
}

export function construirIssue(resultado: ResultadoEscaneo): IssueGenerado {
  const desfasados = resultado.archivos.filter((a) => a.estado === 'desfasado')
  const total = resultado.archivos.length
  const alDia = total - desfasados.length

  const titulo =
    desfasados.length > 0
      ? `Actualiza ${desfasados.length === 1 ? 'la dependencia' : 'las dependencias'} de Stellar antes del próximo upgrade de protocolo`
      : 'Diagnóstico de Soroready: todo al día'

  const filas = desfasados
    .map((a) => `| \`${a.ruta}\` | ${a.versionEncontrada} | ${a.versionVigente} |`)
    .join('\n')

  const fuentes: string[] = []
  if (resultado.releaseSoroban) {
    fuentes.push(`- soroban-sdk ${resultado.releaseSoroban.version}: ${resultado.releaseSoroban.url}`)
  }
  if (resultado.releaseStellarSdk) {
    fuentes.push(`- @stellar/stellar-sdk ${resultado.releaseStellarSdk.version}: ${resultado.releaseStellarSdk.url}`)
  }

  const partes = [
    `## Soroready: diagnóstico de versiones`,
    ``,
    `\`${resultado.owner}/${resultado.repo}\` tiene **${desfasados.length} de ${total}** archivos desfasados frente a la última versión publicada por Stellar (${alDia} al día).`,
  ]

  if (desfasados.length > 0) {
    partes.push(
      ``,
      `| Archivo | Versión encontrada | Versión vigente |`,
      `| --- | --- | --- |`,
      filas,
      ``,
      `**Qué cambia:** revisa las notas del release antes de actualizar.`,
      ...fuentes,
    )
  }

  partes.push(
    ``,
    `---`,
    `_Generado por Soroready. Solo un aviso: no cambia tu código ni tus fondos._`,
    `_Consultado el ${new Date(resultado.consultadoEn).toLocaleString('es-MX')}._`,
  )

  let markdown = partes.join('\n')
  let recortado = false
  if (markdown.length > LIMITE_CARACTERES) {
    markdown = `${markdown.slice(0, LIMITE_CARACTERES)}\n\n_(recortado por longitud — ver el escaneo completo en la página)_`
    recortado = true
  }

  return { titulo, markdown, recortado }
}

export function urlAbrirIssue(owner: string, repo: string, issue: IssueGenerado): string {
  const params = new URLSearchParams({ title: issue.titulo, body: issue.markdown })
  return `https://github.com/${owner}/${repo}/issues/new?${params.toString()}`
}
