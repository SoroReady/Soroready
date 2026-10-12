interface Paso {
  numero: number
  texto: string
  quien: 'Esta página' | 'La Action' | 'El tablero'
}

const PASOS: Paso[] = [
  { numero: 1, texto: 'El mantenedor agrega el workflow de Soroready a su repo, sin configuración adicional.', quien: 'La Action' },
  { numero: 2, texto: 'Se lee Cargo.toml y package.json del repo.', quien: 'Esta página' },
  { numero: 3, texto: 'Se compara la versión encontrada contra la versión vigente, verificada en vivo.', quien: 'Esta página' },
  { numero: 4, texto: 'Si hay desfase, se arma el diagnóstico: qué versión hay, qué versión viene y qué archivos tocar.', quien: 'Esta página' },
  { numero: 5, texto: 'El mantenedor lee el issue y decide si y cuándo actualizar. Soroready nunca abre un PR.', quien: 'La Action' },
  { numero: 6, texto: 'El resultado agregado, anónimo, alimenta el % de repos de Stellar listos para el próximo protocolo.', quien: 'El tablero' },
]

const COLOR_QUIEN: Record<Paso['quien'], string> = {
  'Esta página': 'bg-primario text-sobre-primario',
  'La Action': 'bg-elevada text-texto-sec border border-borde',
  'El tablero': 'bg-elevada text-texto-sec border border-borde',
}

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-center font-heading text-2xl font-semibold text-texto sm:text-3xl">Cómo funciona</h2>
      <p className="mx-auto mt-2 max-w-lg text-center text-sm text-texto-sec">
        Los 6 pasos del flujo completo de Soroready. Esta página simula los pasos 2 a 4 desde el navegador.
      </p>
      <ol className="mt-10 flex flex-col gap-6">
        {PASOS.map((paso) => (
          <li key={paso.numero} className="flex gap-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-borde font-mono text-sm text-texto-sec">
              {paso.numero}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-texto">{paso.texto}</p>
              <span className={`w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${COLOR_QUIEN[paso.quien]}`}>
                {paso.quien}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
