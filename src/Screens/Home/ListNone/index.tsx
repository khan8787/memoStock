import React, { useEffect, useContext } from 'react';
import Styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';

const Container = Styled.View`flex: 1; justify-content: center;`;
const MiddleContainer = Styled.TouchableOpacity`display: flex; flex-direction: column; width: 100%; height: 100px; align-items: center;`;
const Icon = Styled.Image`width: 35px; height: 35px; margin-bottom: 10px;`;
const Text = Styled.Text`font-size: 21px; text-align: center; font-family: 'NanumBarunpen';`;

// type NavigationProp = StackNavigationProp<HomeNaviParamList, 'Home'>;
interface Props {
    onPress: () => void;
}

const ListNone = ({onPress}: Props) => {
    return (
        <Container>
            <MiddleContainer onPress={onPress}>
                <Icon source={require('~/Assets/Images/home_add_black.png')} />
                <Text>종목을 추가해 보세요!</Text>
            </MiddleContainer>
        </Container>
    )
}

export default ListNone;