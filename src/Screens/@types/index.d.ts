// Home 화면 진입 종류

type HomeNaviParamList = {
    Home: undefined;
    StockAdd: undefined;
    StockModify: {
        selectedStock: IStockInfo;
    };
    Settings: undefined;
}