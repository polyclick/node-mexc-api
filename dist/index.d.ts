interface IOptions {
    apiKey: string;
    apiSecret: string;
    type?: 'contract' | 'spot';
}
declare type methodType = 'POST' | 'GET' | 'DELETE';
declare class Mexc$1 {
    private readonly apiKey;
    private readonly apiSecret;
    constructor(options: IOptions);
    publicRequestV3(method: methodType, path: string, params?: {}): Promise<any>;
    signRequestV3(method: methodType, path: string, params?: {}): Promise<any>;
    publicRequestV2(method: methodType, path: string, params?: {}): Promise<any>;
    signRequestV2(method: methodType, path: string, params?: {}): Promise<any>;
}

declare class Contract extends Mexc$1 {
    private contractBaseUrl;
    constructor({ apiKey, apiSecret }: IOptions);
    serverTime(): Promise<any>;
    contractDetail(): Promise<any>;
    supportCurrencies(): Promise<any>;
    depthBySymbol(params: {
        symbol: string;
    }): Promise<any>;
    depthCommitsBySymbol(params: {
        symbol: string;
        limit: string;
    }): Promise<any>;
    indexPriceBySymbol(params: {
        symbol: string;
    }): Promise<any>;
    fairPriceBySymbol(params: {
        symbol: string;
    }): Promise<any>;
    fundingRateBySymbol(params: {
        symbol: string;
    }): Promise<any>;
    klineBySymbol(params: {
        symbol: string;
    }): Promise<any>;
    indexPriceKlineBySymbol(params: {
        symbol: string;
    }): Promise<any>;
    fairPriceKlineBySymbol(params: {
        symbol: string;
    }): Promise<any>;
    dealsBySymbol(params: {
        symbol: string;
    }): Promise<any>;
    ticker(params: {
        symbol?: string;
    }): Promise<any>;
    riskReverse(params: {
        symbol?: string;
    }): Promise<any>;
    riskReverseHistory(params: {
        symbol: string;
        page_num: string;
        page_size: string;
    }): Promise<any>;
    fundingRateHistory(params: {
        symbol: string;
        page_num: string;
        page_size: string;
    }): Promise<any>;
    assets(): Promise<any>;
    assetByCurrency(params: {
        currency: string;
    }): Promise<any>;
    transferRecord(params: {
        page_num: string;
        page_start: string;
    }): Promise<any>;
    historyPositions(params: {
        page_num: string;
        page_start: string;
    }): Promise<any>;
    openPositions(params: {
        symbol: string;
    }): Promise<any>;
    fundingRecords(params: {
        symbol?: string;
        position_id?: string;
        page_num: string;
        page_size: string;
    }): Promise<any>;
    openOrders(params: {
        symbol: string;
        page_num: string;
        page_size: string;
    }): Promise<any>;
    historyOrders(params: {
        symbol: string;
        states: string;
        category: number;
        start_time: string;
        end_time: string;
        side: string;
        page_num: string;
        page_size: string;
    }): Promise<any>;
    externalByExternalOid(params: {
        symbol: string;
        external_oid: string;
    }): Promise<any>;
    queryOrderById(params: {
        order_id: string;
    }): Promise<any>;
    batchQueryById(params: {
        order_ids: string;
    }): Promise<any>;
    dealDetails(params: {
        order_id: string;
    }): Promise<any>;
    orderDeals(params: {
        symbol: string;
        start_time: string;
        end_time: string;
        page_num: string;
        page_size: string;
    }): Promise<any>;
    planOrder(params: {
        symbol: string;
        states: string;
        start_time: string;
        end_time: string;
        page_num: string;
        page_size: string;
    }): Promise<any>;
    stopOrder(params: {
        symbol: string;
        is_finished: string;
        start_time: string;
        end_time: string;
        page_num: string;
        page_size: string;
    }): Promise<any>;
    riskLimit(params: {
        symbol: string;
    }): Promise<any>;
    tieredFeeRate(params: {
        symbol: string;
    }): Promise<any>;
    changeMargin(params: {
        positionId: string;
        amount: string;
        type: string;
    }): Promise<any>;
    leverage(params: {
        symbol: string;
    }): Promise<any>;
    changeLeverage(params: {
        positionId: string;
        leverage: string;
        openType: string;
        symbol: string;
        positionType: string;
    }): Promise<any>;
    getPositionMode(): Promise<any>;
    changePositionMode(params: {
        positionMode: 1 | 2;
    }): Promise<any>;
    placeNewOrder(params: {
        symbol: string;
        price: string;
        vol: string;
        leverage: string;
        side: string;
        type: string;
        openType: string;
        positionId: string;
        externalOid: string;
        stopLossPrice: string;
        takeProfitPrice: string;
        positionMode: string;
        reduceOnly: string;
    }): Promise<any>;
    placeNewOrderBatch(params: {
        symbol: string;
        price: string;
        vol: string;
        leverage: string;
        side: string;
        type: string;
        openType: string;
        positionId: string;
        externalOid: string;
        stopLossPrice: string;
        takeProfitPrice: string;
        positionMode: string;
        reduceOnly: string;
    }[]): Promise<any>;
    cancelOrderById(params: string[]): Promise<any>;
    cancelWithExternal(params: {
        symbol: string;
        externalOid: string;
    }): Promise<any>;
    cancelAll(params: {
        symbol: string;
    }): Promise<any>;
    cancelPlanOrder(params: string[]): Promise<any>;
    cancelAllPlanOrder(params: {
        symbol: string;
    }): Promise<any>;
    cancelStopOrder(params: {
        stopPlanOrderId: string;
    }): Promise<any>;
    cancelAllStopOrder(params: {
        symbol: string;
        positionId: string;
    }): Promise<any>;
    stopOrderChangePrice(params: {
        orderId: string;
        stopLossPrice: string;
        takeProfitPrice: string;
    }): Promise<any>;
    stopOrderChangePlanPrice(params: {
        stopPlanOrderId: string;
        stopLossPrice: string;
        takeProfitPrice: string;
    }): Promise<any>;
}

declare class Spot extends Mexc$1 {
    spotBaseUrlV2: string;
    spotBaseUrlV3: string;
    constructor({ apiKey, apiSecret }: IOptions);
    symbols(params: {
        symbol: string;
    }): Promise<any>;
    serverTime(): Promise<any>;
    ping(): Promise<any>;
    defaultSymbols(): Promise<any>;
    ticker(params: {
        symbol?: string;
    }): Promise<any>;
    depthV2(params: {
        symbol?: string;
        depth?: number;
    }): Promise<any>;
    deals(params: {
        symbol: string;
        limit?: number;
    }): Promise<any>;
    klineV2(params: {
        symbol: string;
        interval: string;
        start_time?: string;
        limit: string;
    }): Promise<any>;
    coinList(params: {
        currency?: string;
    }): Promise<any>;
    account(): Promise<any>;
    apiAccount(): Promise<any>;
    placeOrder(params: {
        client_order_id?: string;
        order_type: string;
        price: string;
        quantity: string;
        symbol: string;
        trade_type: string;
    }): Promise<any>;
    cancelOrderV2(params: {
        order_ids: string;
        client_order_ids: string;
    }): Promise<any>;
    multiPlaceOrder(params: {
        order_type: string;
        price: string;
        quantity: string;
        symbol: string;
        trade_type: string;
    }[]): Promise<any>;
    getOpenOrder(params: {
        symbol: string;
    }): Promise<any>;
    getAllOrder(params: {
        states: string;
        symbol: string;
        trade_type: string;
    }): Promise<any>;
    queryOrderById(params: {
        order_ids: string;
    }): Promise<any>;
    getOrderDeal(params: {
        limit: string;
        start_time: string;
        symbol: string;
    }): Promise<any>;
    queryOrderDealById(params: {
        order_id: string;
    }): Promise<any>;
    cancelBySymbol(params: {
        symbol: string;
    }): Promise<any>;
    getDepositList(params: {
        currency: string;
    }): Promise<any>;
    getDepositRecord(params: {
        currency: string;
        start_time: string;
        end_time: string;
    }): Promise<any>;
    getWithdrawList(params: {
        start_time: string;
        end_time: string;
        withdraw_id: string;
    }): Promise<any>;
    withdraw(params: {
        currency: string;
        chain: string;
        amount: string;
        address: string;
    }): Promise<any>;
    transFer(params: {
        sub_uid: string;
        currency: string;
        amount: string;
        type: string;
    }): Promise<any>;
    getTransferRecord(params: {
        start_time: string;
        end_time: string;
    }): Promise<any>;
    getAvlTransfer(params: {
        currency: string;
    }): Promise<any>;
    queryTransferRecordById(params: {
        transact_id: string;
    }): Promise<any>;
    pingV3(): Promise<any>;
    serverTimeV3(): Promise<any>;
    exchangeInformation(): Promise<any>;
    depth(params: {
        symbol: string;
        limit?: number;
    }): Promise<any>;
    recentTradesList(params: {
        symbol: string;
    }): Promise<any>;
    oldTradeLookup(params: {
        symbol: string;
    }): Promise<any>;
    compressedTradesList(params: {
        symbol: string;
    }): Promise<any>;
    kline(params: {
        symbol: string;
        interval: string;
        startTime?: number;
        endTime?: number;
        limit?: number;
    }): Promise<any>;
    currentAveragePrice(params: {
        symbol: string;
    }): Promise<any>;
    tickerPriceChange(): Promise<any>;
    symbolPriceTicker(): Promise<any>;
    symbolOrderBook(): Promise<any>;
    etfInfo(): Promise<any>;
    testConnectivity(params: {
        symbol: string;
        side: string;
        type: string;
        quantity: string;
        price: string;
    }): Promise<any>;
    order(params: {
        symbol: string;
        side: string;
        type: string;
        quantity: string;
        price: string;
        quoteOrderQty: string;
    }): Promise<any>;
    cancelOrder(params: {
        symbol: string;
        orderId: string;
    }): Promise<any>;
    cancelAllOpenOrders(params: {
        symbol: string;
    }): Promise<any>;
    queryOrder(params: {
        symbol: string;
        orderId: string;
    }): Promise<any>;
    currentOpenOrders(params: {
        symbol: string;
    }): Promise<any>;
    allOrders(params: {
        symbol: string;
    }): Promise<any>;
    accountInformation(): Promise<any>;
    accountTradeList(params: {
        symbol: string;
    }): Promise<any>;
}

declare class Mexc {
    spot: Spot;
    contract: Contract;
    constructor(options: IOptions);
}

export { Mexc as default };
