/**
 * Path enum file
 */
export enum PathEnum {
  bin_info = "deferred/v2/bin/",
  card_token = "card/v1/tokens",
  card_subscription_token = "v1/subscription-tokens",
  deferred_info = "card/v1/deferred/",
  merchant_settings = "merchant/v1/merchant/settings",
  cybersource_jwt = "card/v1/authToken",
  secure_validation = "rules/v1/secureValidation",
  bank_list = "transfer/v1/bankList",
  commission_configuration = "commission/v1/configuration",
  subscriptions = "v1/subscriptions/",
  device_token = "subscriptions/v1/card/",
  brands_logos_by_merchant = "card/v1/merchant/brands-logos",
  start_apple_pay_session = "apple-pay/v1/session/start",
  get_apple_pay_token = "apple-pay/v1/token"
}
