import React, { createContext, useState, useEffect } from 'react';
import Styled from 'styled-components/native';
import { ScrollView, Keyboard } from 'react-native';

// const Container = Styled.View`flex: 1; justify-content: center;`;
// const Text = Styled.Text`font-size: 21px; text-align: center; font-family: 'NanumBarunpen';`;

// flex-wrap: nowrap; 

const Container = Styled.View`display: flex; width: 100%; max-height: 390px;`;
const ListContainer = Styled.TouchableOpacity`display: flex; flex-direction: row; align-items: center; flex: 1; height: 70px;`;
const CodeContainer = Styled.View`min-width: 100px;`;
const NameContainer = Styled.View``;
const CodeText = Styled.Text`font-size: 21px; color: #929292; font-family: 'NanumBarunpen';`;
const NameText = Styled.Text`width: 220px; font-size: 21px; color: #292929; font-family: 'NanumBarunpen';`;


interface Props {
    autoCompleteData: IStockInfoFromXML[];
    onClickSearch: (stockName: string, stockIsin: string) => void;
}

const AutoComplete = ({ autoCompleteData, onClickSearch }: Props) => {
    const [list, setList] = useState<IStockInfoFromXML[]>([]);

    const onTouchStart = () => {
        // console.log('onTouchStart @@@@');
        // 키보드 발생 시 오토컴플리트 스크롤이 동작하지 않으므로(부모 스크롤만 동작) 키보드 닫음
        Keyboard.dismiss();
    }

    useEffect(() => {
        console.log('========= AutoComplete ==========');
        console.log(autoCompleteData);
        setList(autoCompleteData);
    }, [autoCompleteData])

    return (
        <Container>
            <ScrollView onTouchStart={onTouchStart}>
                {autoCompleteData.length > 0 && autoCompleteData.map((list, index) => (
                    <ListContainer 
                        key={`autocomplete-${list.isin}-${index}`} 
                        onPress={ () => onClickSearch(list.name, list.isin) }>
                        <CodeContainer>
                            <CodeText>{list.isin}</CodeText>
                        </CodeContainer>
                        <NameContainer>
                            <NameText numberOfLines={1}>{list.name}</NameText>
                        </NameContainer>
                    </ListContainer>
                ))}
            </ScrollView>
        </Container>
    )
}

export default AutoComplete;
