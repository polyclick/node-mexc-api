"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/helpers/utils.ts
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var removeEmptyValue = (obj) => {
  if (!(obj instanceof Object))
    return {};
  Object.keys(obj).forEach((key) => isEmptyValue(obj[key]) && delete obj[key]);
  return obj;
};
var isEmptyValue = (input) => {
  const var1 = !input && input !== false && input !== 0;
  const var2 = (typeof input === "string" || input instanceof String) && /^\s+$/.test(input);
  const var3 = input instanceof Object && !Object.keys(input).length;
  const var4 = Array.isArray(input) && !input.length;
  return var1 || var2 || var3 || var4;
};
var buildQueryString = (params) => {
  if (!params)
    return "";
  return Object.entries(params).map((param) => stringifyKeyValuePair(param)).join("&");
};
var CreateRequest = async (config) => {
  const { method, url, params, apiKey, timestamp, Signature } = config;
  if (method === "GET" || method === "DELETE") {
    const data = await getRequestInstance({
      headers: {
        "Content-Type": "application/json",
        "ApiKey": apiKey,
        "Request-Time": timestamp,
        "Signature": Signature
      }
    }).request({
      method,
      url,
      params
    });
    return data.data;
  }
  if (method === "POST") {
    const data = await getRequestInstance({
      headers: {
        "Content-Type": "application/json",
        "ApiKey": apiKey,
        "Request-Time": timestamp,
        "Signature": Signature
      }
    }).request({
      method,
      url,
      data: params
    });
    return data.data;
  }
};
var stringifyKeyValuePair = ([key, value]) => {
  const valueString = Array.isArray(value) ? `["${value.join('","')}"]` : value;
  return `${key}=${encodeURIComponent(valueString)}`;
};
var getRequestInstance = (config) => {
  return _axios2.default.create(__spreadValues({}, config));
};
var createRequest = async (config) => {
  const { apiKey, method, url } = config;
  const data = await getRequestInstance({
    headers: {
      "Content-Type": "application/json",
      "X-MEXC-APIKEY": apiKey
    }
  }).request({
    method,
    url
  });
  return data.data;
};
var pubRequest = async (config) => {
  const { apiKey, method, url } = config;
  const data = await getRequestInstance({
    headers: {
      "Content-Type": "application/json",
      "X-MEXC-APIKEY": apiKey
    }
  }).request({
    method,
    url
  });
  return data.data;
};

// src/modules/base.ts
var _cryptojs = require('crypto-js'); var _cryptojs2 = _interopRequireDefault(_cryptojs);
var Mexc = class {
  constructor(options) {
    const { apiKey, apiSecret } = options;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    return this;
  }
  publicRequestV3(method, path, params = {}) {
    params = removeEmptyValue(params);
    params = buildQueryString(params);
    if (params !== "") {
      path = `${path}?${params}`;
    }
    return createRequest({
      method,
      url: path,
      apiKey: this.apiKey
    });
  }
  signRequestV3(method, path, params = {}) {
    params = removeEmptyValue(params);
    const timestamp = Date.now();
    const queryString = buildQueryString(__spreadProps(__spreadValues({}, params), { timestamp }));
    const signature = _cryptojs2.default.enc.Hex.stringify(_cryptojs2.default.HmacSHA256(queryString, this.apiSecret));
    return createRequest({
      method,
      url: `${path}?${queryString}&signature=${signature}`,
      apiKey: this.apiKey
    });
  }
  publicRequestV2(method, path, params = {}) {
    params = removeEmptyValue(params);
    params = buildQueryString(params);
    if (params !== "") {
      path = `${path}?${params}`;
    }
    return pubRequest({
      method,
      url: path,
      apiKey: this.apiKey
    });
  }
  signRequestV2(method, path, params = {}) {
    params = removeEmptyValue(params);
    const timestamp = Date.now();
    const apiKey = this.apiKey;
    let objectString = apiKey + timestamp;
    if (method === "POST") {
      path = `${path}`;
      objectString += JSON.stringify(params);
    } else {
      let queryString = buildQueryString(__spreadValues({}, params));
      path = `${path}?${queryString}`;
      objectString += queryString;
    }
    const Signature = _cryptojs2.default.enc.Hex.stringify(_cryptojs2.default.HmacSHA256(objectString, this.apiSecret));
    return CreateRequest({
      method,
      url: path,
      apiKey: this.apiKey,
      timestamp,
      Signature,
      params
    });
  }
};

// src/modules/contract.ts
var Contract = class extends Mexc {
  constructor({ apiKey, apiSecret }) {
    super({ apiKey, apiSecret });
    this.contractBaseUrl = "https://contract.mexc.com/api/v1/";
    return this;
  }
  serverTime() {
    return this.publicRequestV3("GET", `${this.contractBaseUrl}contract/ping`);
  }
  contractDetail() {
    return this.publicRequestV3("GET", `${this.contractBaseUrl}contract/detail`);
  }
  supportCurrencies() {
    return this.publicRequestV3("GET", `${this.contractBaseUrl}contract/support_currencies`);
  }
  depthBySymbol(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/depth/{symbol}`,
      params
    );
  }
  depthCommitsBySymbol(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/depth_commits/{symbol}/{limit}`,
      params
    );
  }
  indexPriceBySymbol(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/index_price/{symbol}`,
      params
    );
  }
  fairPriceBySymbol(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/fair_price/{symbol}`,
      params
    );
  }
  fundingRateBySymbol(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/funding_rate/{symbol}`,
      params
    );
  }
  klineBySymbol(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/kline/{symbol}`,
      params
    );
  }
  indexPriceKlineBySymbol(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/kline/index_price/{symbol}`,
      params
    );
  }
  fairPriceKlineBySymbol(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/kline/fair_price/{symbol}`,
      params
    );
  }
  dealsBySymbol(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/deals/{symbol}`,
      params
    );
  }
  ticker(params) {
    return this.publicRequestV3("GET", `${this.contractBaseUrl}contract/ticker`, params);
  }
  riskReverse(params) {
    return this.publicRequestV3("GET", `${this.contractBaseUrl}contract/risk_reverse`, params);
  }
  riskReverseHistory(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/risk_reverse/history`,
      params
    );
  }
  fundingRateHistory(params) {
    return this.publicRequestV3(
      "GET",
      `${this.contractBaseUrl}contract/funding_rate/history`,
      params
    );
  }
  assets() {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/account/assets`
    );
  }
  assetByCurrency(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/account/asset/{currency}`,
      params
    );
  }
  transferRecord(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/account/transfer_record`,
      params
    );
  }
  historyPositions(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/position/list/history_positions`,
      params
    );
  }
  openPositions(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/position/open_positions`,
      params
    );
  }
  fundingRecords(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/position/funding_records`,
      params
    );
  }
  openOrders(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/order/list/open_orders/{symbol}`,
      params
    );
  }
  historyOrders(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/order/list/history_orders`,
      params
    );
  }
  externalByExternalOid(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/order/external/{symbol}/{external_oid}`,
      params
    );
  }
  queryOrderById(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/order/get/{order_id}`,
      params
    );
  }
  batchQueryById(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/order/batch_query`,
      params
    );
  }
  dealDetails(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/order/deal_details/{order_id}`,
      params
    );
  }
  orderDeals(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/order/list/order_deals`,
      params
    );
  }
  planOrder(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/planorder/list/orders`,
      params
    );
  }
  stopOrder(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/stoporder/list/orders`,
      params
    );
  }
  riskLimit(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/account/risk_limit`,
      params
    );
  }
  tieredFeeRate(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/account/tiered_fee_rate`,
      params
    );
  }
  changeMargin(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/position/change_margin`,
      params
    );
  }
  leverage(params) {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/position/leverage`,
      params
    );
  }
  changeLeverage(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/position/change_leverage`,
      params
    );
  }
  getPositionMode() {
    return this.signRequestV2(
      "GET",
      `${this.contractBaseUrl}private/position/position_mode`
    );
  }
  changePositionMode(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/position/change_position_mode`,
      params
    );
  }
  placeNewOrder(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/order/submit`,
      params
    );
  }
  placeNewOrderBatch(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/order/submit_batch`,
      params
    );
  }
  cancelOrderById(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/order/cancel`,
      params
    );
  }
  cancelWithExternal(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/order/cancel_with_external`,
      params
    );
  }
  cancelAll(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/order/cancel_all`,
      params
    );
  }
  cancelPlanOrder(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/planorder/cancel`,
      params
    );
  }
  cancelAllPlanOrder(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/planorder/cancel_all`,
      params
    );
  }
  cancelStopOrder(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/stoporder/cancel`,
      params
    );
  }
  cancelAllStopOrder(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/stoporder/cancel_all`,
      params
    );
  }
  stopOrderChangePrice(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/stoporder/change_price`,
      params
    );
  }
  stopOrderChangePlanPrice(params) {
    return this.signRequestV2(
      "POST",
      `${this.contractBaseUrl}private/stoporder/change_plan_price`,
      params
    );
  }
};

// src/modules/spot.ts
var Spot = class extends Mexc {
  constructor({ apiKey, apiSecret }) {
    super({ apiKey, apiSecret });
    this.spotBaseUrlV2 = "https://www.mexc.com/open/api/v2/";
    this.spotBaseUrlV3 = "https://api.mexc.com/api/v3/";
    return this;
  }
  symbols(params) {
    return this.publicRequestV2("GET", `${this.spotBaseUrlV2}market/symbols`, params);
  }
  serverTime() {
    return this.publicRequestV2("GET", `${this.spotBaseUrlV2}common/timestamp`);
  }
  ping() {
    return this.publicRequestV2("GET", `${this.spotBaseUrlV2}common/ping`);
  }
  defaultSymbols() {
    return this.publicRequestV2(
      "GET",
      `${this.spotBaseUrlV2}market/api_default_symbols`
    );
  }
  ticker(params) {
    return this.publicRequestV2(
      "GET",
      `${this.spotBaseUrlV2}market/ticker`,
      params
    );
  }
  depthV2(params) {
    return this.publicRequestV2(
      "GET",
      `${this.spotBaseUrlV2}market/depth`,
      params
    );
  }
  deals(params) {
    return this.publicRequestV2(
      "GET",
      `${this.spotBaseUrlV2}market/deals`,
      params
    );
  }
  klineV2(params) {
    return this.publicRequestV2(
      "GET",
      `${this.spotBaseUrlV2}market/kline`,
      params
    );
  }
  coinList(params) {
    return this.publicRequestV2("GET", `${this.spotBaseUrlV2}market/coin/list`, params);
  }
  account() {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}account/info`
    );
  }
  apiAccount() {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}market/api_symbols`
    );
  }
  placeOrder(params) {
    return this.signRequestV2(
      "POST",
      `${this.spotBaseUrlV2}order/place`,
      params
    );
  }
  cancelOrderV2(params) {
    return this.signRequestV2(
      "DELETE",
      `${this.spotBaseUrlV2}order/cancel`,
      params
    );
  }
  multiPlaceOrder(params) {
    return this.signRequestV2(
      "POST",
      `${this.spotBaseUrlV2}order/place_batch`,
      params
    );
  }
  getOpenOrder(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}order/open_orders`,
      params
    );
  }
  getAllOrder(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}order/list`,
      params
    );
  }
  queryOrderById(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}order/query`,
      params
    );
  }
  getOrderDeal(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}order/deals`,
      params
    );
  }
  queryOrderDealById(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}order/deal_detail`,
      params
    );
  }
  cancelBySymbol(params) {
    return this.signRequestV2(
      "DELETE",
      `${this.spotBaseUrlV2}order/cancel_by_symbol`,
      params
    );
  }
  getDepositList(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}asset/deposit/address/list`,
      params
    );
  }
  getDepositRecord(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}asset/deposit/list`,
      params
    );
  }
  getWithdrawList(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}asset/withdraw/list`,
      params
    );
  }
  withdraw(params) {
    return this.signRequestV2(
      "POST",
      `${this.spotBaseUrlV2}asset/withdraw`,
      params
    );
  }
  transFer(params) {
    return this.signRequestV2(
      "POST",
      `${this.spotBaseUrlV2}asset/internal/transfer`,
      params
    );
  }
  getTransferRecord(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}asset/internal/transfer/record`,
      params
    );
  }
  getAvlTransfer(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}account/balance`,
      params
    );
  }
  queryTransferRecordById(params) {
    return this.signRequestV2(
      "GET",
      `${this.spotBaseUrlV2}asset/internal/transfer/info`,
      params
    );
  }
  pingV3() {
    return this.publicRequestV3("GET", `${this.spotBaseUrlV3}ping`);
  }
  serverTimeV3() {
    return this.publicRequestV3("GET", `${this.spotBaseUrlV3}time`);
  }
  exchangeInformation() {
    return this.publicRequestV3("GET", `${this.spotBaseUrlV3}exchangeInfo`);
  }
  depth(params) {
    return this.publicRequestV3(
      "GET",
      `${this.spotBaseUrlV3}depth`,
      params
    );
  }
  recentTradesList(params) {
    return this.publicRequestV3(
      "GET",
      `${this.spotBaseUrlV3}trades`,
      params
    );
  }
  oldTradeLookup(params) {
    return this.publicRequestV3(
      "GET",
      `${this.spotBaseUrlV3}historicalTrades`,
      params
    );
  }
  compressedTradesList(params) {
    return this.publicRequestV3(
      "GET",
      `${this.spotBaseUrlV3}aggTrades`,
      params
    );
  }
  kline(params) {
    return this.publicRequestV3(
      "GET",
      `${this.spotBaseUrlV3}klines`,
      params
    );
  }
  currentAveragePrice(params) {
    return this.publicRequestV3(
      "GET",
      `${this.spotBaseUrlV3}avgPrice`,
      params
    );
  }
  tickerPriceChange() {
    return this.publicRequestV3("GET", `${this.spotBaseUrlV3}ticker/24hr`);
  }
  symbolPriceTicker() {
    return this.publicRequestV3("GET", `${this.spotBaseUrlV3}ticker/price`);
  }
  symbolOrderBook() {
    return this.publicRequestV3("GET", `${this.spotBaseUrlV3}ticker/bookTicker`);
  }
  etfInfo() {
    return this.publicRequestV3("GET", `${this.spotBaseUrlV3}etf/info`);
  }
  testConnectivity(params) {
    return this.signRequestV3(
      "POST",
      `${this.spotBaseUrlV3}order/test`,
      params
    );
  }
  order(params) {
    return this.signRequestV3(
      "POST",
      `${this.spotBaseUrlV3}order`,
      params
    );
  }
  cancelOrder(params) {
    return this.signRequestV3(
      "DELETE",
      `${this.spotBaseUrlV3}order`,
      params
    );
  }
  cancelAllOpenOrders(params) {
    return this.signRequestV3(
      "DELETE",
      `${this.spotBaseUrlV3}openOrders`,
      params
    );
  }
  queryOrder(params) {
    return this.signRequestV3(
      "GET",
      `${this.spotBaseUrlV3}order`,
      params
    );
  }
  currentOpenOrders(params) {
    return this.signRequestV3(
      "GET",
      `${this.spotBaseUrlV3}openOrders`,
      params
    );
  }
  allOrders(params) {
    return this.signRequestV3(
      "GET",
      `${this.spotBaseUrlV3}allOrders`,
      params
    );
  }
  accountInformation() {
    return this.signRequestV3(
      "GET",
      `${this.spotBaseUrlV3}account`
    );
  }
  accountTradeList(params) {
    return this.signRequestV3(
      "GET",
      `${this.spotBaseUrlV3}myTrades`,
      params
    );
  }
};

// src/index.ts
var Mexc2 = class {
  constructor(options) {
    this.spot = new Spot(options);
    this.contract = new Contract(options);
    return this;
  }
};


exports.default = Mexc2;
//# sourceMappingURL=index.js.map