import React, { useEffect, useContext, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Styled from 'styled-components/native';
import AddInput from '~/Components/AddInput';
import TextArea from '~/Components/TextArea';
import { StocksContext } from '~/Context/Stocks';
import { addComma, removeComma } from '~/Utils';
import InvalidNotiBox from '~/Components/InvalidNotiBox';
import { KeyboardAvoidingView, Keyboard, Platform, ScrollView } from 'react-native';
const Container = Styled.View`flex: 1; padding-left: 35px; padding-right: 35px; align-items: center; background-color: #fcf7f1;`;
// const MiddleContainer = Styled.TouchableOpacity`display: flex; flex-direction: column; width: 100%; height: 100px; align-items: center;`;
const SaveBtnContainer = Styled.View`margin-top: 140px; display: flex; width: 100%; height: 35px;`;
const SaveBtn = Styled.TouchableOpacity``;
const Text = Styled.Text`font-size: 26px; text-align: center; font-family: 'NanumBarunpen'; color: #292929;`;

type NavigationProp = StackNavigationProp<HomeNaviParamList, 'StockModify'>;
interface Props {
    navigation: NavigationProp;
    route: RouteProp<HomeNaviParamList, 'StockModify'>;
}

const StockModify = ({route, navigation}: Props) => {
    const { setStorageStockList } = useContext<IStocksContext>(StocksContext);
    const [isin, setIsin] = useState<string | undefined>(undefined);
    
    // Input Datas
    const [inputs, setInputs] = useState({});
    const [stockName, setStockName] = useState<string | undefined>(undefined);
    const [currStockPrice, setCurrStockPrice] = useState<string>('');
    const [buyPriceText, setBuyPriceText] = useState<string | undefined>(undefined);
    const [buyTotalText, setBuyTotalText] = useState<string | undefined>(undefined);
    const [memoText, setMemoText] = useState<string | undefined>(undefined);
    // Check Input Value
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [invalidMsg, setInvalidMsg] = useState<string>('');


    // TODO. ?????? ?????? ?????? ??????? HOC?
    const onChangeText = (text: string, type: string) => {
        console.log(`type : ${type}, text : ${text}`);
        if (type === 'buyTotal') {
            if (text[0] !== '0') {
                if (text.length > 2) {
                    setBuyTotalText(addComma(text));
                } else {
                    setBuyTotalText(text);
                }
            }
        } else if (type === 'buyPrice') {
            if (text[0] !== '0') {
                if (text.length > 2) {
                    setBuyPriceText(addComma(text));
                } else {
                    setBuyPriceText(text);
                }
            }
        } else if (type === 'memo') {
            setMemoText(text);
        } else {
            setInputs({
                ...inputs, 
                [type]: text
            });
        }
    }

    const modifyStockInfo = () => {
        console.log('modifyStockInfo');
        console.log(
        `=================================================
        autoCompleteStockName : ${stockName}
        currStockPrice : ${currStockPrice}
        buyPriceText : ${buyPriceText}
        buyTotalText : ${buyTotalText}
        memoText : ${memoText}
        =================================================`);
        if (isin && stockName && currStockPrice && buyPriceText && buyTotalText) {
            const isInvalidBuyPrice = isNaN(Number(removeComma(buyPriceText)));
            const isInvalidBuyTotal = isNaN(Number(removeComma(buyTotalText)));
            console.log(`isInvalidBuyPrice : ${isInvalidBuyPrice}, isInvalidBuyTotal : ${isInvalidBuyTotal}`);
            if (isInvalidBuyPrice || isInvalidBuyTotal) {
                showInvalidBox('????????? ?????? ??????????????????.');;
            } else {
                const modifyStockInfo: IStockInfo = {
                    isin,
                    name: stockName,
                    currPrice: currStockPrice,
                    buyPrice: buyPriceText,
                    buyTotal: buyTotalText,
                }
                if (memoText) modifyStockInfo.memo = memoText;
                setStorageStockList(modifyStockInfo, "modify");
                navigation.navigate('Home');
            }
        } else {
            console.log('Check Input Value...');
            showInvalidBox('????????? ?????? ??????????????????.');;
        }
    }

    const showInvalidBox = (invalidMsg: string) => {
        setInvalidMsg(invalidMsg);
        setIsInvalid(true);
        setTimeout(() => {
            setIsInvalid(false);
        }, 1500);
    }

    useEffect(() => {
        console.log('========== StockModify Component Init');
        // console.log(route.params);
        if (route.params.selectedStock) {
            const stock: IStockInfo = route.params.selectedStock;
            setIsin(stock.isin);
            setStockName(stock.name);
            setCurrStockPrice(stock.currPrice);
            setBuyPriceText(stock.buyPrice);
            setBuyTotalText(stock.buyTotal);
            stock.memo ? setMemoText(stock.memo) : setMemoText(undefined);
        } else {
            console.log('routeParam : ', route.params);
            navigation.navigate('Home');
        }
    }, []);

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{flex: 1, backgroundColor: '#fcf7f1'}} 
            keyboardVerticalOffset={100}>
            <ScrollView>
                <Container>
                    <AddInput 
                        label="?????????" 
                        placeholder="?????????"
                        value={stockName}
                        editable={false} 
                        inputType="stockName" 
                        onChangeText={onChangeText}
                    />
                    <AddInput 
                        label="?????????"
                        placeholder="0???"
                        value={currStockPrice && currStockPrice + "???"} 
                        editable={false} 
                        inputType="stockPrice" 
                        onChangeText={onChangeText}
                    />
                    <AddInput 
                        label="????????????" 
                        placeholder="?????? ?????? ??????" 
                        value={buyPriceText}
                        editable={true} 
                        keyboardType="default"
                        inputType="buyPrice"
                        onChangeText={onChangeText}
                    />
                    <AddInput 
                        label="??????" 
                        placeholder="?????? ?????? ??????" 
                        value={buyTotalText}
                        editable={true} 
                        keyboardType="default"
                        inputType="buyTotal" 
                        onChangeText={onChangeText}
                    />
                    <TextArea 
                        label="??????" 
                        value={memoText}
                        placeholder="????????? ??????" 
                        keyboardType="default"
                        inputType="memo" 
                        onChangeText={onChangeText}
                    />
                    <SaveBtnContainer>
                        <SaveBtn onPress={modifyStockInfo}>
                            <Text>??????</Text>
                        </SaveBtn>
                    </SaveBtnContainer>
                </Container>
                <InvalidNotiBox message={invalidMsg} isShow={isInvalid} />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default StockModify;