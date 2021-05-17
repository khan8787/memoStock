import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import Styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { StocksContext } from '~/Context/Stocks';
import ListNone from '~/Screens/Home/ListNone';
import StockList from '~/Screens/Home/StockList';
import { RefreshControl } from "react-native";
import IconButton from '~/Components/IconButton';
import { addComma, removeComma, showAlert } from '~/Utils';
import { SwipeListView } from 'react-native-swipe-list-view';
import ListHiddenButton from '~/Components/ListHiddenButton';
import Help from '~/Screens/Help';
import ModalView from '~/Components/Modal';
import Loading from '~/Screens/Loading';

const Container = Styled.SafeAreaView`flex: 1; background-color: #fcf7f1;`;
const StockListContainer = Styled.View`flex: 1; display: flex; flex-direction: column; padding-left: 25px; padding-right: 25px;`;
// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HiddenContaner = Styled.View`flex: 1; display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-top: 20px;`;
const HiddenLeftContainer = Styled.View``;
const HiddenRightContainer = Styled.View`display: flex; flex-direction: row; width: 120px; height: 50px;`;

type NavigationProp = StackNavigationProp<HomeNaviParamList, 'Home'>;
interface Props {
    navigation: NavigationProp;
}

const Home = ({navigation}: Props) => {
    const { stockCodeList, stockList, setStorageStockList, refreshStocks, getStorageHelpScreen, setStorageHelpScreen } = useContext<IStocksContext>(StocksContext);
    const [stocks, setStocks] = useState<Array<IStockInfo>>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showHelp, setShowHelp] = useState<boolean>(false);
    const [HomeInitRefreshState, setHomeInitRefreshState] = useState<boolean>(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton iconName="add" style={{width: 20, height: 20, marginRight: 30}} onPress={moveToStockAdd} />
            ),
            headerLeft: () => (
                <IconButton iconName="menu" style={{width: 20, height: 20, marginLeft: 30}} onPress={moveToSettings} />
            )
        })
    }, []);

    const moveToSettings = () => {
        console.log('moveToSettings');
        navigation.navigate('Settings');
    }

    const onPressHelp = () => {
        console.log('###### HELP CLick');
        setShowHelp(false);
        setStorageHelpScreen('true');
    }

    const moveToStockAdd = () => {
        console.log('moveToStockAdd');
        navigation.navigate('StockAdd');
    }

    const onRefresh = () => {
        console.log('=====> OnRefresh Stocks : ' + stocks.length);
        setRefreshing(true);
        stocks && stocks.length > 0 && refreshStocks();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }

    const calculateTotalReturn = (currPrice: number, buyPrice: number, buyTotal: number): string => {
        console.log(`currPrice : ${currPrice}, buyPrice : ${buyPrice}, buyTotal : ${buyTotal}`);
        const calResult = getTotalReturn(currPrice, buyPrice, buyTotal);
        const absNum = Math.abs(calResult);
        const stringResult = addComma(String(absNum));
        console.log('stringResult : ' + stringResult);
        if(calResult >= 0) {
            return stringResult;
        } else {
            return '-'+stringResult;
        }
    }

    const getTotalReturn = (currPrice: number, buyPrice: number, buyTotal: number): number => {
        const extra = currPrice - buyPrice;
        return extra * buyTotal;
    }

    const calculateMovement = (currPrice: number, buyPrice: number): 'up' | 'down' | 'noChange' => {
        const extra = currPrice - buyPrice;
        if(extra > 0) {
            return 'up';
        } else if (extra === 0){
            return 'noChange';
        } else {
            return 'down';
        }
    }

    const calculateMovementPrice = (currPrice: number, buyPrice: number): string => {
        const extra = currPrice - buyPrice;
        const absNum = Math.abs(currPrice - buyPrice);
        const stringResult = addComma(String(absNum));
        if(extra >= 0) {
            return stringResult;
        } else {
            return '-'+stringResult;
        }
    }

    const calculateStockData = (stockList: IStockInfo[]): IStockInfo[] => {
        const result = stockList.map((stock, index) => {
            const currPriceNum = Number(removeComma(stock.currPrice));
            const buyPriceNum = Number(removeComma(stock.buyPrice));
            const buyTotlaNum = Number(removeComma(stock.buyTotal));
            stock.movement = calculateMovement(currPriceNum, buyPriceNum);
            stock.movementPrice = calculateMovementPrice(currPriceNum, buyPriceNum);
            stock.totalReturn = calculateTotalReturn(currPriceNum, buyPriceNum, buyTotlaNum);
            return stock;
        });
        console.log('============>>> result')
        console.log(result)
        return result;
    }

    const modifyStock = (index: number) => {
        console.log('########## modifyStock index : ' + index);
        const selectedStock: IStockInfo = stocks[index];
        // selectedStock.isShowDetail = false;
        navigation.navigate('StockModify', { selectedStock });
    }

    const removeStock = (index: number) => {
        console.log('########## removeStock index : ' + index);
        // console.log(stocks[index].name);
        const okCallback = () => {
            setStorageStockList(index, 'remove');
        }
        showAlert(true, stocks[index].name, '삭제하시겠습니까?', okCallback);
    }

    const closeStock = (rowMap: any, rowKey: any) => {
        console.log('closeStock');
        // console.log(rowMap[rowKey]);
        rowMap && rowKey && rowMap[rowKey].closeRow();
    }

    const renderHiddenItem = (data: any, rowMap: any) => {
        // console.log('renderHiddenItem');
        const stock: IStockInfo = data.item;
        // console.log(stock.isin);
        // console.log(rowMap[stock.isin]);
        // *** rowKey ==> List keyExtractor Value
        return (
            <HiddenContaner>
                <HiddenLeftContainer />
                <HiddenRightContainer>
                    <ListHiddenButton 
                        iconName="modify" index={data.index} isin={stock.isin} 
                        onPress={modifyStock} 
                        closeStock={() => closeStock(rowMap, `${data.item.isin}-${data.index}`)} />
                    <ListHiddenButton 
                        iconName="remove" index={data.index} isin={stock.isin} 
                        onPress={removeStock} 
                        closeStock={() => closeStock(rowMap, `${data.item.isin}-${data.index}`)} />
                </HiddenRightContainer>
            </HiddenContaner>
        )
    }

    useEffect(() => {
        console.log('================= useEffect Home stockList');
        // console.log(stockList);
        if (stockList && stockList.length > 0) {
            setStocks(calculateStockData(stockList));
        } else {
            setStocks([]);
        }
    }, [stockList]);

    useEffect(() => {
        console.log('================= useEffect Home Init stocks');
        console.log(stocks);
        if (!HomeInitRefreshState && (stockList && stockList.length > 0)) {
            console.log('########## App Init... Refesh Try...');
            refreshStocks();
            setHomeInitRefreshState(true);
        }
    }, [stocks]);

    useEffect(() => {
        if (stockCodeList) {
            console.log(`stockCodeList total : ` + stockCodeList.list.length);
            SplashScreen.hide();
            if (stockCodeList.list.length <= 0) {
                showAlert(false, '불러오기 실패', `주식 종목 리스트를 가져오는데 실패하였습니다.`);
            }
        } 
        // else undefined value
    }, [stockCodeList]);

    useEffect(() => {
        console.log('================= Home Init');
        // console.log(stockList);
        getStorageHelpScreen().then(isSawHelp => {
            console.log('isSawHelp :: ' + isSawHelp);
            if (isSawHelp === undefined) {
                setShowHelp(true);
            }
        });
    }, []);

    return (
        <Container>
            { 
                stocks && stocks.length > 0 ?
                <StockListContainer>
                    <SwipeListView
                        data={stocks}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        refreshing={refreshing}
                        keyExtractor={(item, index) => {
                            return `${item.isin}-${index}`;
                        }}
                        renderItem={({item, index}) => (
                            <StockList stock={item} index={index} />
                        )}
                        renderHiddenItem={renderHiddenItem}
                        leftOpenValue={0}
                        rightOpenValue={-125}
                    />
                    {/* <ModalView /> */}
                </StockListContainer>
                :
                <ListNone onPress={() => navigation.navigate('StockAdd')} />
            }
            {
                showHelp && <Help onPress={onPressHelp}/>
            }
        </Container>
    )
}

export default Home;



    // const Test: Array<IStockInfo> = 
    // [
    //     {
    //         "buyPrice": "3,333", "buyTotal": "4", "currPrice": "2,390", 
    //         "isin": "001250", "memo": "5555", "movement": "down", 
    //         "movementPrice": "-943", "name": "GS글로벌", "totalReturn": "-3,772"
    //     },
    //     {
    //         "buyPrice": "23,333", "buyTotal": "34", "currPrice": "22,390", 
    //         "isin": "001250", "memo": "5555", "movement": "down", 
    //         "movementPrice": "-1943", "name": "GS글로벌_KKK_KKK", "totalReturn": "-13,772"
    //     }
    // ];