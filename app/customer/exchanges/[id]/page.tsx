import ExchangeDetailPage from "./exchange-detail-page";


export default async function ExchangeDetailPageWrapper({ params }: any) {
  const { id } = await params
  return <ExchangeDetailPage exchangeId={id} />
}
