import React, { useEffect, useContext, useState } from 'react';
import { showAlert } from '~/Utils';
import Help from '~/Screens/Help';
import Mailer from 'react-native-mail';
import Styled from 'styled-components/native';
import { StocksContext } from '~/Context/Stocks';
import { TouchableOpacity, View } from 'react-native';
const Container = Styled.View`flex: 1; align-items: center; background-color: #fcf7f1;`;
const ListTitleContainer = Styled.View`margin-top: 30px; padding-left: 20px; padding-right: 30px; display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%;`;
const ListTitle = Styled.Text`font-size: 23px; text-align: center; font-family: 'NanumBarunpen-bold'; color: #636363;`;
const ListContainer = Styled.TouchableOpacity`padding-left: 30px; padding-right: 30px; display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; height: 60px;`;
const Text = Styled.Text`font-size: 23px; text-align: center; font-family: 'NanumBarunpen'; color: #292929;`;

// type NavigationProp = StackNavigationProp<HomeNaviParamList, 'Settings'>;
// interface Props {
//     navigation: NavigationProp;
//     route: RouteProp<HomeNaviParamList, 'Settings'>;
// }

const Settings = () => {
    const { appDataInit } = useContext<IStocksContext>(StocksContext);
    const [showHelp, setShowHelp] = useState<boolean>(false);
    const [gainOrLossOption, setGainOrLossOption] = useState<string>('unit');  // unit or quantity

    const changeGainOrLossOption = () => {
        showAlert(false, '옵션 변경', '아직 준비중입니다.');
    }
    
    const stockListInit = () => {
        console.log('########## stockListInit');
        // console.log(stocks[index].name);
        const okCallback = () => {
            appDataInit();
        }
        showAlert(true, '앱 데이터 초기화', '모든 항목을 삭제하시겠습니까?', okCallback);
    }

    const onPressHelp = () => {
        console.log('###### HELP CLick');
        showHelp ? setShowHelp(false) : setShowHelp(true); 
    }

    const handleEmail = () => {
        Mailer.mail({
            subject: 'Memo Stock App - 의견 및 제안',
            recipients: ['ahn8787@naver.com'],
            // body: '<b>A Bold Body</b>',
            isHTML: true,
            // attachment: {
            //     path: '',  // The absolute path of the file from which to read data.
            //     type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
            //     name: '',   // Optional: Custom filename for attachment
            // }
        }, (error, event) => {
            // console.log('email :: ' + JSON.stringify(error)); // null
            // console.log('event :: ' + JSON.stringify(event)); // "sent"
            if (error) {
                showAlert(false, 'email Error', `${JSON.stringify(error)}`);
            }
        });
      }

    return (
        <Container>
            <ListTitleContainer>
                <ListTitle>OPTION</ListTitle>
            </ListTitleContainer>
            <ListContainer activeOpacity={1}>
                <Text>평가손익 표시</Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <TouchableOpacity style={{marginRight: 10}} onPress={changeGainOrLossOption}>
                        <Text style={{fontSize: 21, color: '#666'}}>매입단가</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={changeGainOrLossOption}>
                        <Text style={{fontSize: 21, color: '#666'}}>보유수량</Text>
                    </TouchableOpacity>
                </View>
            </ListContainer>
            <ListContainer onPress={stockListInit}>
                <Text>초기화</Text>
                <Text style={{fontSize: 21, color: '#666'}}>{'>'}</Text>
            </ListContainer>
            <ListTitleContainer>
                <ListTitle>INFO</ListTitle>
            </ListTitleContainer>
            <ListContainer onPress={onPressHelp}>
                <Text>Help</Text>
                <Text style={{fontSize: 21, color: '#666'}}>{'>'}</Text>
            </ListContainer>
            <ListContainer onPress={handleEmail}>
                <Text>피드백</Text>
                <Text style={{fontSize: 21, color: '#666'}}>ahn8787@naver.com{'  >'}</Text>
            </ListContainer>
            {
                showHelp && <Help onPress={onPressHelp}/>
            }
        </Container>
    )
}

export default Settings

