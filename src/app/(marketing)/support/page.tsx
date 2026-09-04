import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Accordion } from '@/components/ui/Accordion';
export default function SupportPage(){return <Section><Container size="md"><SectionTitle eyebrow="Suporte" title="Como podemos ajudar?" className="mb-10"/><Accordion items={[{value:'entrega',title:'Entrega',content:'Informações de prazo e rastreamento serão conectadas ao checkout.'},{value:'troca',title:'Trocas',content:'A política definitiva será adicionada antes da publicação.'},{value:'contato',title:'Contato',content:'O canal oficial de atendimento será configurado nesta página.'}]}/></Container></Section>}
