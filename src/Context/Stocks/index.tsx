import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios').default;
const cheerio = require('cheerio');
import { showAlert } from '~/Utils';

const defaultContext: IStocksContext = {
    isLoading: false,
    stockList: [],
    stockCodeList: undefined,
    selectdStockPrice: undefined,
    showLoading: (isShow: boolean) => {},
    setStorageStockList: (stock: Both, setType: string) => {},
    getStorageStockList: () => {},
    getAPIStockCodeList: () => undefined,
    setAPISelectedStockPrice: (stockIsin: string) => {},
    refreshStocks: async () => '',
    getStorageHelpScreen: async () => undefined,
    setStorageHelpScreen: () => undefined,
    appDataInit: () => undefined,
}

const StocksContext = createContext(defaultContext);

interface Props {
    children: JSX.Element | Array<JSX.Element>;
}

type Both = IStockInfo | number;

const StockContextProvider = ({children}: Props) => {
    const [stockList, setStockList] = useState<IStockInfo[] | undefined>([]);
    const [stockCodeList, setStockCodeList] = useState<IStockCodeList | undefined>(undefined);
    const [selectdStockPrice, setSelectdStockPrice] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const showLoading = (isShow: boolean) => {
        setIsLoading(isShow);
    }

    const getStorageData = async (key: string) => {
        const storageData = await AsyncStorage.getItem(key);
        if (storageData === null) {
            return undefined;
        }
        return JSON.parse(storageData);
    };

    // const setStorageData = (key: string, data: Array<any>) => {
    //     AsyncStorage.setItem(key, JSON.stringify(data));
    // };

    const setStorageStockList = (stock: Both, setType: 'add' | 'modify' | 'remove') => {
        console.log('Context setStorageStockList');
        // add, modify, remove
        if (stockList) {
            if (setType === 'add' && typeof stock === 'object') {
                try {
                    console.log('Context setStorageStockList - Set Storage...');
                    const addResult = [...stockList, stock];
                    setStockList(addResult);
                    const stringData = JSON.stringify(addResult);
                    console.log(stringData);
                    AsyncStorage.setItem('stockList', stringData);
                } catch (e) {
                    console.log('Context setStorageStockList Error - ' + JSON.stringify(e));
                }
            } else if (setType === 'modify' && typeof stock === 'object') {
                try {
                    const modifyResult = stockList.map((item) => {
                        if (item.isin === stock.isin) {
                            item.buyPrice = stock.buyPrice;
                            item.buyTotal = stock.buyTotal;
                            item.memo = stock.memo;
                            return item;
                        } else {
                            return item;
                        }
                    });
                    console.log(modifyResult);
                    setStockList(modifyResult);
                    const stringData = JSON.stringify(modifyResult);
                    AsyncStorage.setItem('stockList', stringData);
                } catch (e) {
                    console.log('Context setStorageStockList Error - ' + JSON.stringify(e));
                }
            } else if (setType === 'remove' && typeof stock === 'number') {
                // remove case
                const selectedIndex = stock;
                let removeResult: IStockInfo[] = [];
                try {
                    stockList.forEach((item, index) => {
                        if (index !== selectedIndex) {
                            removeResult = [...removeResult, item];
                        }
                    });
                    console.log('=========> removeResult. selectedIndex : ' + selectedIndex);
                    console.log(removeResult);
                    console.log(removeResult.length);
                    setStockList(removeResult);
                    const stringData = JSON.stringify(removeResult);
                    AsyncStorage.setItem('stockList', stringData);
                } catch (e) {
                    console.log('Context setStorageStockList Error - ' + JSON.stringify(e));
                }
            } else {
                console.log(`else... setType : ${setType}, stock : ${stock}`);
            }
        }
    };

    const getStorageStockList = () => {
        console.log('Context getStorageStockList');
        AsyncStorage.getItem('stockList').then(value => {
            if (value) {
                const parseData: IStockInfo[] = JSON.parse(value);
                console.log(parseData);
                setStockList(parseData);
            }
            showLoading(false);
        })
        .catch(error => {
            console.log('Context getStorageStockList Error - ' + JSON.stringify(error));
            setStockList(undefined);
            showLoading(false);
        })
    };

    const getAPIStockCodeList = (): IStockCodeList | undefined => {
        console.log('Context getAPIStockCodeList');
        return stockCodeList;
    };

    // const getAPISelectedStockPrice = async () => {
    //     return selectdStockPrice;
    // }

    const setAPISelectedStockPrice = async (stockIsin: string) => {
        console.log('Context setAPIStockCodeList. stockIsin : ' + stockIsin);
        const config = {
            method: 'get',
            url: `https://finance.naver.com/item/main.nhn?code=${stockIsin}`,
            headers: { 
                'Cookie': 'JSESSIONID=7A0F7C8552330F63B3B7EBC2F6689725'
            }
        };
        try {
            const res = await axios(config);
            const stockPrice = getPriceDataFromNaver(res);
            console.log('stockPrice : ' + stockPrice);
            setSelectdStockPrice(stockPrice);
        } catch (e) {
            console.log(JSON.stringify(e));
            setSelectdStockPrice('');
            showAlert(false, '불러오기 실패', `가격 정보를 가져오는데 실패하였습니다. - ${e.message}`);
        }
    }

    const getAPIStockPrice = async (stockIsin: string) => {
        console.log('Context Call API - getAPIStockPrice. stockIsin : ' + stockIsin);
        const config = {
            method: 'get',
            url: `https://finance.naver.com/item/main.nhn?code=${stockIsin}`,
            headers: { 
                'Cookie': 'JSESSIONID=7A0F7C8552330F63B3B7EBC2F6689725'
            }
        };
        try {
            const res = await axios(config);
            const stockPrice = getPriceDataFromNaver(res);
            console.log('stockPrice : ' + stockPrice);
            // setSelectdStockPrice(stockPrice);
            return stockPrice;
        } catch (e) {
            console.log(JSON.stringify(e));
            showAlert(false, '불러오기 실패', `가격 정보를 가져오는데 실패하였습니다. - ${e.message}`);
            // setSelectdStockPrice('');
        }
    }

    const getPriceDataFromNaver = (res: any): string => {
        try {
            const $ = cheerio.load(res.data);
            const currPrice = $('div.today span.blind').first().text();
            // console.log($('div.today span.blind').first().text());
            // console.log($('div#chart_area div.rate_info div.today p.no_today').text());
            return currPrice;
        } catch (e) {
            console.log(JSON.stringify(e));
            return '';
        }
    }

    const setAPIStockCodeList = async () => {
        console.log('Context setAPIStockCodeList');
        // CHECK. storage 저장 사용. 만료기한 설정. 값 체크 후 통신.
        const storageData = await getStorageData('stockCodeList');
        if (storageData) {
            const isExpired = isExpiredStockCodeListData(storageData);
            if (isExpired) {
                resetAPIStockCodeList();
            } else {
                setStockCodeList(storageData);
            }
            return;
        }
        const config = {
            method: 'get',
            url: 'https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13',
            headers: { 
                'Cookie': 'JSESSIONID=o1pQlw69bEn7QPzjcHBVYWD0Egc1w1UHUUeyx9LyNZ2v575NJchcPkvO899a95ei.amV1c19kb21haW4vMTBfRFNUMQ==; __smVisitorID=scJu6Lq-4sk'
            }
        };
        try {
            const res = await axios(config);
            const stockCodeList = getObjectDataFromXML(res);
            setStockCodeList(stockCodeList);
            AsyncStorage.setItem('stockCodeList', JSON.stringify(stockCodeList));
        } catch (e) {
            console.log(JSON.stringify(e));
            let stockCodeList: IStockCodeList;
            stockCodeList = {
                list : [],
                expiredDate: new Date()
            };
            setStockCodeList(stockCodeList);
            // showAlert(false, '불러오기 실패', `주식 종목 리스트를 가져오는데 실패하였습니다. - ${e.message}`);
        }
    };

    const getObjectDataFromXML = (res: any): IStockCodeList => {
        let stockCodeList: IStockCodeList;
        let stockList: Array<IStockInfoFromXML> = [];
        try {
            const $ = cheerio.load(res.data);
            $('table.bbs_tb tr').each((i: number, trElm: any) => {
                // console.log('============================= i : ' + i);
                if (i === 0) return true; // 1번 항목부터 데이터 추가
                let tdArr: Array<String> = [];
                const tds = $(trElm).find('td');
                tds.each((i: number, tdElm: any) => {
                    if (i > 1) return true; // => continue;
                    const text = $(tdElm).text();
                    tdArr = [...tdArr, text];
                });
                const stockInfo: IStockInfoFromXML ={
                    name: String(tdArr[0]).trim(),
                    isin: String(tdArr[1]),
                };
                stockList = [...stockList, stockInfo];
            });
        } catch (e) {
            console.log(JSON.stringify(e));
        }
        // console.log(stockList);
        const currDate = new Date();
        const expiredDate = new Date(currDate.setMonth(currDate.getMonth()+1));
        stockCodeList = {
            list : stockList,
            expiredDate
        };
        console.log('========== Load Complete Stocks total : ' + (stockCodeList && stockCodeList.list.length));
        return stockCodeList;
    }

    const isExpiredStockCodeListData = (storageData: IStockCodeList): boolean => {
        const expiredDate = new Date(storageData.expiredDate);
        const currDate = new Date();
        return expiredDate < currDate;
    }

    const resetAPIStockCodeList = async () => {
        console.log('resetAPIStockCodeList');
        await AsyncStorage.removeItem('stockCodeList');
        setAPIStockCodeList();
    }

    const refreshStocks = async (): Promise<String>  => {
        console.log('refreshStocks');
        console.log(stockList);
        if (stockList && stockList.length > 0) {
            try {
                const result = stockList.map(async (stock) => {
                    const currPrice = await getAPIStockPrice(stock.isin);
                    // console.log('await end... currPrice : ' + currPrice);
                    stock.currPrice = String(currPrice);
                    return stock;
                });
                const promiseArr = await Promise.all(result);
                console.log(promiseArr);
                setStockList(promiseArr);
                return 'success';
            } catch (e) {
                console.log(JSON.stringify(e));
                return 'fail';
            }
        }
        return 'fail';
    }

    const getStorageHelpScreen = async (): Promise<String | undefined> => {
        return await getStorageData('stockHelp');
    }

    const setStorageHelpScreen = async (isSaw: string) => {
        AsyncStorage.setItem('stockHelp', isSaw);
    }

    const appDataInit = () => {
        console.log('########## App Data / Context Init (remove All)');
        setStockList(undefined);
        setStockCodeList(undefined);
        setSelectdStockPrice(undefined);
        AsyncStorage.clear();
    }

    useEffect(() => {
        getStorageStockList();
        setAPIStockCodeList();
    }, []);

    return (
        <StocksContext.Provider 
            value={{ 
                isLoading, stockList, stockCodeList, selectdStockPrice,
                setStorageStockList, getStorageStockList, getAPIStockCodeList, 
                setAPISelectedStockPrice, refreshStocks, showLoading, getStorageHelpScreen, setStorageHelpScreen,
                appDataInit
            }}>
            {children}
        </StocksContext.Provider>
    )
}

export { StocksContext, StockContextProvider };