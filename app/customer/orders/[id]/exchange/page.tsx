import ExchangePage from "./exchange-page";

export default async function ExchangePageWrapper({ params }: any) {
  const { id } = await params
  return <ExchangePage params={params} />
}

