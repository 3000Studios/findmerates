# FindMeRates Metrics Dictionary

This is the canonical list of analytics events emitted by the site.

## Event: `page_view`
- **When:** A page is viewed (key surfaces only).
- **Payload keys:** `kind`, `storyId?`, `slug?`, `category?`

## Event: `outbound_click`
- **When:** A user clicks an outbound link (rate card CTA, partner offer).
- **Payload keys:** `kind`, `category`, `provider?`, `partner?`, `offerId?`, `url`

## Event: `lead_submit`
- **When:** A lead form is submitted successfully.
- **Payload keys:** `category`, `zip`, `hasEmail`, `hasPhone`

## Event: `lead_error`
- **When:** Lead submit fails (network/rules).
- **Payload keys:** `category`, `message`

## Event: `checkout_click`
- **When:** A checkout button is clicked (Stripe/PayPal).
- **Payload keys:** `provider`, `plan?`, `url`, `surface`

## Event: `pro_signup_start`
- **When:** Pro subscribe flow starts.
- **Payload keys:** `surface`

## Event: `pro_signup_success`
- **When:** Pro signup flow proceeds to checkout.
- **Payload keys:** `surface`

