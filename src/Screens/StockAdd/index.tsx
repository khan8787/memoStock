import React, { useEffect, useContext, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import Styled from 'styled-components/native';
import AddInput from '~/Components/AddInput';
import Autocomplete from '~/Components/AutoComplete';
import TextArea from '~/Components/TextArea';
import { StocksContext } from '~/Context/Stocks';
import SearchBar from '~/Components/SearchBar';
import InvalidNotiBox from '~/Components/InvalidNotiBox';
import { addComma, removeComma } from '~/Utils';
import { KeyboardAvoidingView, Keyboard, Platform, ScrollView } from 'react-native';

const Container = Styled.View`flex: 1; display: flex; padding-left: 35px; padding-right: 35px; background-color: #fcf7f1;`;
const TouchView = Styled.TouchableWithoutFeedback``;
const SaveBtnContainer = Styled.View`margin-top: 100px; display: flex; width: 100%; height: 35px;`;
const SaveBtn = Styled.TouchableOpacity``;
const Text = Styled.Text`font-size: 26px; text-align: center; font-family: 'NanumBarunpen'; color: #292929;`;

type NavigationProp = StackNavigationProp<HomeNaviParamList, 'StockAdd'>;
interface Props {
    navigation: NavigationProp;
}

const StockAdd = ({navigation}: Props) => {
    const { getAPIStockCodeList, setAPISelectedStockPrice, selectdStockPrice, setStorageStockList } = useContext<IStocksContext>(StocksContext);
    const [stockCodeList, setStockCodeList] = useState<IStockCodeList>();
    // const [inputText, setInputText] = useState('');
    const [autoCompleteData, setAutoCompleteData] = useState<IStockInfoFromXML[]>([]);
    const [isin, setIsin] = useState<string | undefined>(undefined);
    
    // Input Datas
    const [searchKeyword, setSearchKeyword] = useState<string | undefined>(undefined);
    const [inputs, setInputs] = useState({});
    const [autoCompleteStockName, setAutoCompleteStockName] = useState<string | undefined>(undefined);
    const [currStockPrice, setCurrStockPrice] = useState<string>('');
    const [buyPriceText, setBuyPriceText] = useState<string | undefined>(undefined);
    const [buyTotalText, setBuyTotalText] = useState<string | undefined>(undefined);
    const [memoText, setMemoText] = useState<string | undefined>(undefined);

    // Check Input Value
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [invalidMsg, setInvalidMsg] = useState<string>('');

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

    const onSearchText = (text: string) => {
        console.log(`Search Input text : ${text}`);
        setSearchKeyword(text);
    }

    const onClickSearch = async (stockName: string, stockIsin: string) => {
        console.log('onClickSearch. stockIsin : ' + stockIsin);
        setAutoCompleteStockName(stockName);
        setAutoCompleteData([]);
        setAPISelectedStockPrice(stockIsin);
        setIsin(stockIsin);
    }

    const findSearchStock = (keyword: string): IStockInfoFromXML[] => {
        console.log('findSearchStock');
        const noSpaceString = keyword.replace(/(\s*)/g, '');
        let result: IStockInfoFromXML[] = [];
        if (stockCodeList) {
            if (noSpaceString !== '') {
                result = stockCodeList?.list.filter((stockList: IStockInfoFromXML) => {
                    const stockName = stockList.name;
                    return stockName.indexOf(noSpaceString) !== -1;
                });
                // console.log(result);
            }
        }
        return result;
    }

    const showInvalidBox = (invalidMsg: string) => {
        setInvalidMsg(invalidMsg);
        setIsInvalid(true);
        setTimeout(() => {
            setIsInvalid(false);
        }, 1500);
    }

    const saveStockInfo = () => {
        console.log('saveStockInfo');
        console.log(
        `=================================================
        autoCompleteStockName : ${autoCompleteStockName}
        currStockPrice : ${currStockPrice}
        buyPriceText : ${buyPriceText}
        buyTotalText : ${buyTotalText}
        memoText : ${memoText}
        =================================================`);
        if (isin && autoCompleteStockName && currStockPrice && buyPriceText && buyTotalText) {
            const isInvalidBuyPrice = isNaN(Number(removeComma(buyPriceText)));
            const isInvalidBuyTotal = isNaN(Number(removeComma(buyTotalText)));
            console.log(`isInvalidBuyPrice : ${isInvalidBuyPrice}, isInvalidBuyTotal : ${isInvalidBuyTotal}`);
            // console.log(isNaN(t));
            if (isInvalidBuyPrice || isInvalidBuyTotal) {
                showInvalidBox('????????? ?????? ??????????????????.');
            } else {
                const addStockInfo: IStockInfo = {
                    isin,
                    name: autoCompleteStockName,
                    currPrice: currStockPrice,
                    buyPrice: buyPriceText,
                    buyTotal: buyTotalText,
                }
                if (memoText) addStockInfo.memo = memoText;
                setStorageStockList(addStockInfo, "add");
                navigation.navigate('Home');
            }
        } else {
            console.log('Check Input Value...');
            showInvalidBox('????????? ?????? ??????????????????.');
        }
    }

    
    useEffect(() => {
        console.log('EFFECT selectdStockPrice : ' + selectdStockPrice);
        if (selectdStockPrice === '') {
            showInvalidBox('????????? ????????? ????????? ???????????? ???????????????.');
        } else {
            selectdStockPrice && setCurrStockPrice(selectdStockPrice);
        }
    }, [selectdStockPrice]);

    useEffect(() => {
        console.log('EFFECT input');
        console.log(inputs);
    }, [inputs]);

    useEffect(() => {
        const stockCodeList: IStockInfoFromXML[] = findSearchStock(String(searchKeyword));
        setAutoCompleteData(stockCodeList); 
    }, [searchKeyword]);

    useEffect(() => {
        console.log('========== StockAdd Component Init');
        setStockCodeList(getAPIStockCodeList()); 
        setCurrStockPrice('');
    }, []);

    // behavior = padding or height
    // react-native-keyboard-aware-scrollview

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{flex: 1, backgroundColor: '#fcf7f1'}} 
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
            {/* onPress={Keyboard.dismiss} */}
            <TouchView> 
                <ScrollView>
                <Container>
                    <SearchBar label="??????" placeholder="?????? ?????? ??????" onSearchText={onSearchText} />
                    <Autocomplete autoCompleteData={autoCompleteData} onClickSearch={onClickSearch} />
                    {
                        autoCompleteData.length > 0 ?
                        null
                        :
                        <>
                            <AddInput 
                                label="?????????" 
                                placeholder="?????????"
                                value={autoCompleteStockName}
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
                                placeholder="????????? ??????" 
                                keyboardType="default"
                                inputType="memo" 
                                onChangeText={onChangeText}
                            />
                            <SaveBtnContainer>
                                <SaveBtn onPress={saveStockInfo}>
                                    <Text>??????</Text>
                                </SaveBtn>
                            </SaveBtnContainer>
                        </>
                    }
                </Container>
                <InvalidNotiBox message={invalidMsg} isShow={isInvalid} />
                </ScrollView>
            </TouchView>
        </KeyboardAvoidingView>
    )
}

export default StockAdd;
