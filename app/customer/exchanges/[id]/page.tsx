import ExchangeDetailPage from "./exchange-detail-page";


export default function ExchangeDetailPageWrapper({ params }: { params: { id: string } }) {
  return <ExchangeDetailPage exchangeId={params.id} />
}
