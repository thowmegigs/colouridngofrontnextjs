import ExchangePage from "./exchange-page";

export default function ExchangePageWrapper({ params }: { params: { id: string } }) {
  return <ExchangePage params={params} />
}
