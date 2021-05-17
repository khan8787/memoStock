import React, { useRef, useEffect, useContext, useState, TouchEvent } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import Styled from 'styled-components/native';
import { StocksContext } from '~/Context/Stocks';
import { Animated, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import MovementIcon from '~/Components/MovementIcon';

const Container = Styled.View`flex: 1; padding-left: 15px; padding-right: 15px; align-items: center; background-color: #fcf7f1;`;
const Text = Styled.Text`font-size: 22px; text-align: center; font-family: 'NanumBarunpen-bold'; color: #FFF;`;

const ContentWrap = Styled.View``;
const StockContainer = Styled.TouchableOpacity``;

const StockTopInfo = Styled.View`display: flex; flex-direction: row; justify-content: space-between; width: 100%; height: 90px;`;
const StockTopTitle = Styled.View`display: flex; flex-direction: row; align-items: center; justify-content: flex-start; width: 54%; height: 90px; padding-left: 35px;`;
const StockMovement = Styled.View`display: flex; flex-direction: row; align-items: center; justify-content: flex-end; width: 34%; height: 90px; padding-right: 5px;`;
const IconContainer = Styled.View`display: flex; justify-content: center; width: 12%; height: 90px; padding-right: 25px;`;

const StockMiddleInfo = Styled.View`display: flex; width: 100%; height: 210px;`;
const StockMiddleDetail = Styled.View`display: flex; flex-direction: row; justify-content: space-between; width: 100%; height: 40px;`;
const DetailLeft = Styled.View`display: flex; justify-content: center; align-items: flex-end; width: 40%; height: 60px; padding-right: 25px;`;
const DetailRight = Styled.View`display: flex; justify-content: center; align-items: flex-end; width: 60%; height: 60px; padding-right: 40px;`;
const DetailText = Styled.Text`font-size: 20px; text-align: center; font-family: 'NanumBarunpen-bold'; color: #FFF;`;

const MemoContainer = Styled.View`display: flex; justify-content: center; width: 100%; min-height: 90px; max-height: 160px; border-bottom-right-radius: 45px; border-bottom-left-radius: 45px; padding-left: 30px; padding-right: 30px; background: #e6bf73;`;
const MemoText = Styled.Text`font-size: 20px; font-family: 'NanumBarunpen'; color: #FFF;`;

// TODO. 개당 가격 아닌 전체 토탈 보기 옵션 넣기...
// type NavigationProp = StackNavigationProp<HomeNaviParamList, 'StockAdd'>;
interface Props {
    stock: IStockInfo;
    // navigation: NavigationProp;
    index: number;
}

const StockList = ({stock, index}: Props) => {
    const [backgroundColor, setBackgroundColor] = useState<string>('#68b5b0');
    const itemHeight = 90;
    const itemExpandHeightNoMemo = 340;
    const itemExpandHeight = 430;
    const animationDuration = 500;
    const animateHeight = useRef(new Animated.Value(itemHeight)).current;

    const onClickStock = (stock: IStockInfo, index: number) => {
        console.log('onClickStock. index : ' + index);
        console.log(stock);
        if (stock.isShowDetail) {
            Animated.timing(animateHeight, {
                toValue: itemHeight,
                duration: animationDuration,   
                useNativeDriver: false
            }).start();
            setTimeout(() => {
                stock.isShowDetail = !stock.isShowDetail;
            }, animationDuration);
        } else {
            stock.isShowDetail = !stock.isShowDetail;
            Animated.timing(animateHeight, {
                toValue: stock.memo ? itemExpandHeight : itemExpandHeightNoMemo,
                duration: animationDuration,   
                useNativeDriver: false
            }).start();
        }
    }

    const getBGColor = (movement: string): string => {
        console.log('getBGColor');
        if (movement === 'up') {
            return '#d46960';
        } else if (movement === 'down') {
            return '#808dde';
        } else {
            return '#68b5b0';
        }        
    }

    useEffect(() => {
        stock.movement && setBackgroundColor(getBGColor(stock.movement));
        console.log('movement index :::' + index);
    }, [stock.movement]);

    useEffect(() => {
        console.log('========== useEffect Memo');
        // Memo 수정 시 높이 원상복귀
        Animated.timing(animateHeight, {
            toValue: itemHeight,
            duration: animationDuration,   
            useNativeDriver: false
        }).start();
        setTimeout(() => {
            stock.isShowDetail = false;
        }, animationDuration);
    }, [stock.memo]);

    return (
        <Animated.View 
            key={`list-${index}`} 
            style={[{ 
                overflow: "hidden", width: '100%', height: animateHeight, 
                marginTop: 20, borderRadius: 45,
            }]}>
            <ContentWrap>
                <StockContainer activeOpacity={1} onPress={() => onClickStock(stock, index)}>
                    <StockTopInfo 
                        style={[{ backgroundColor: backgroundColor }]}>
                        <StockTopTitle>
                            <Text numberOfLines={1}>{stock.name}</Text>
                        </StockTopTitle>
                        <StockMovement>
                            <Text numberOfLines={1}>{stock.movementPrice}</Text>
                        </StockMovement>
                        <IconContainer>
                            <MovementIcon iconName={stock.movement} />
                        </IconContainer>
                    </StockTopInfo>
                    <StockMiddleInfo 
                        style={[{ 
                            backgroundColor: backgroundColor, 
                            borderBottomRightRadius: stock.memo ? 0 : 45,
                            borderBottomLeftRadius: stock.memo ? 0 : 45,
                        }]}>
                        <StockMiddleDetail>
                            <DetailLeft>
                                <DetailText>시가</DetailText>
                            </DetailLeft>
                            <DetailRight>
                                <DetailText numberOfLines={1}>{stock.currPrice}</DetailText>
                            </DetailRight>
                        </StockMiddleDetail>
                        <StockMiddleDetail>
                            <DetailLeft>
                                <DetailText>매입단가</DetailText>
                            </DetailLeft>
                            <DetailRight>
                                <DetailText numberOfLines={1}>{stock.buyPrice}</DetailText>
                            </DetailRight>
                        </StockMiddleDetail>
                        <StockMiddleDetail>
                            <DetailLeft>
                                <DetailText>보유수량</DetailText>
                            </DetailLeft>
                            <DetailRight>
                                <DetailText numberOfLines={1}>{stock.buyTotal}</DetailText>
                            </DetailRight>
                        </StockMiddleDetail>
                        <StockMiddleDetail style={[{paddingTop: 10}]}>
                            <DetailLeft></DetailLeft>
                            <DetailRight>
                                <DetailText numberOfLines={1} style={[{fontSize: 24}]}>
                                    {stock.totalReturn}
                                </DetailText>
                            </DetailRight>
                        </StockMiddleDetail>
                    </StockMiddleInfo>
                </StockContainer>
                {
                    stock.memo &&
                    <MemoContainer>
                        <MemoText numberOfLines={3}>
                            {stock.memo}
                        </MemoText>
                    </MemoContainer>
                }
            </ContentWrap>
        </Animated.View>
    )
}

export default StockList;