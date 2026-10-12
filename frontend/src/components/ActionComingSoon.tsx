import { Construction } from 'lucide-react'

export function ActionComingSoon() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-dashed border-borde p-8 text-center">
        <Construction className="mx-auto text-texto-sec" size={28} aria-hidden="true" />
        <h2 className="mt-3 font-heading text-xl font-semibold text-texto">Próximamente: la GitHub Action</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-texto-sec">
          La misma lógica que ves aquí, corriendo sola en tu CI: lee tu repo, compara versiones y abre o actualiza
          un issue si hay desfase. Todavía está en construcción — por ahora, este sitio es su vista previa.
        </p>
      </div>
    </section>
  )
}
