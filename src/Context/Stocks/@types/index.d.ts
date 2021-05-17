interface IStockInfo {
    isin: string; // 종목번호
    movement?: | 'up' | 'down' | 'noChange' // Up or Down or NoChange
    movementPrice?: string;
    name: string;
    // nameEn?: string;
    currPrice: string;
    buyPrice: string;
    buyTotal: string;
    memo?: string;
    isShowDetail?: boolean;
    animate?: any;
    totalReturn?: string;
}

interface IStocksContext {
    isLoading: boolean;
    showLoading: (isShow: booelan) => void;
    stockList: Array<IStockInfo> | undefined;
    stockCodeList: IStockCodeList | undefined;
    selectdStockPrice: string | undefined,
    setStorageStockList: (stock: IStockInfo | number, setType: 'add' | 'modify' | 'remove') => void;
    getStorageStockList: () => void;
    getAPIStockCodeList: () => IStockCodeList | undefined;
    setAPISelectedStockPrice: (stockIsin: stirng) => void;
    refreshStocks: () => Promise<String>;
    getStorageHelpScreen: () => Promise<String | undefined>;
    setStorageHelpScreen: (isSaw: string) => void;
    appDataInit: () => void;
    // removeAll ?
}

interface IStockCodeList {
    list: StockInfoFromXML[],
    expiredDate: Date,
}

interface IStockInfoFromXML {
    name: string;
    isin: string;
}