export interface MeasurementRow {
  size: string;
  chestCm: number;
  lengthCm: number;
  sleeveCm: number;
}

interface MeasurementsTableProps {
  rows: MeasurementRow[];
}

/**
 * MeasurementsTable — genérica, reutilizável em qualquer produto que
 * precise de tabela de medidas. Desktop: tabela de verdade (`<table>`,
 * acessível). Mobile: mesma informação em cards empilhados, porque uma
 * tabela de 4 colunas espremida em 360px vira ilegível.
 */
export function MeasurementsTable({ rows }: MeasurementsTableProps) {
  return (
    <>
      <table className="hidden w-full text-left text-body-sm md:table">
        <caption className="sr-only">Tabela de medidas por tamanho, em centímetros</caption>
        <thead>
          <tr className="border-b border-border text-caption uppercase text-muted">
            <th scope="col" className="py-3 font-normal">Tamanho</th>
            <th scope="col" className="py-3 font-normal">Peito (cm)</th>
            <th scope="col" className="py-3 font-normal">Comprimento (cm)</th>
            <th scope="col" className="py-3 font-normal">Manga (cm)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.size} className="border-b border-border/60">
              <td className="py-3 font-mono text-foreground">{row.size}</td>
              <td className="py-3 text-muted">{row.chestCm}</td>
              <td className="py-3 text-muted">{row.lengthCm}</td>
              <td className="py-3 text-muted">{row.sleeveCm}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <div key={row.size} className="rounded-md border border-border p-4">
            <p className="mb-2 font-mono text-body-sm text-foreground">{row.size}</p>
            <dl className="grid grid-cols-3 gap-2 text-caption text-muted">
              <div>
                <dt className="uppercase">Peito</dt>
                <dd className="mt-0.5 text-foreground">{row.chestCm} cm</dd>
              </div>
              <div>
                <dt className="uppercase">Comp.</dt>
                <dd className="mt-0.5 text-foreground">{row.lengthCm} cm</dd>
              </div>
              <div>
                <dt className="uppercase">Manga</dt>
                <dd className="mt-0.5 text-foreground">{row.sleeveCm} cm</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
