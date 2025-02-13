// @@@ pwned by 1m4unkn0wn @@@
import { useTranslation } from "react-i18next";
import Stripe from "stripe";
import { getFormattedPriceInCurrency } from "~/utils/helpers/PricingHelper";
import DateUtils from "~/utils/shared/DateUtils";

interface Props {
  items: Stripe.UpcomingInvoice[];
}

export default function MyUpcomingInvoice({ items }: Props) {
  const { t } = useTranslation();
  return (
    <div>
      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between space-x-2">
            <div className="text-sm font-medium">{t("app.subscription.invoices.upcoming")}</div>
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="border-border bg-secondary flex flex-col rounded-md border border-dashed p-3">
              <div>
                <span className="font-medium">
                  {getFormattedPriceInCurrency({
                    currency: item.currency,
                    price: Number(item.amount_due / 100),
                  })}
                </span>{" "}
                <span className="text-sm uppercase text-gray-500">{item.currency}</span>
                <div className="text-muted-foreground text-sm">
                  {item.next_payment_attempt && DateUtils.dateMonthDayYear(new Date(item.next_payment_attempt * 1000))}
                </div>
              </div>
              {item.lines.data.map((lineItem, idx) => {
                return (
                  <div key={idx} className="text-sm">
                    {lineItem.price?.nickname && <span>{t(lineItem.price?.nickname)} &rarr; </span>}
                    {lineItem.description}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
